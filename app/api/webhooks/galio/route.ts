import { NextResponse } from "next/server";
import { getPayment } from "@/lib/credits/galio";
import {
  hasTransactionWithDescription,
  recordTransaction,
} from "@/lib/server/db/credits";
import { CREDITS_PER_PURCHASE } from "@/lib/credits/config";

/**
 * Handle incoming webhooks from GalioPay.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Galio usually sends the payment info directly, but we only strictly need the ID to fetch secure data
    const paymentId = body.id || (body.payment && body.payment.id);

    if (!paymentId) {
      return NextResponse.json(
        { error: "Missing payment ID" },
        { status: 400 },
      );
    }

    // Securely fetch payment details from Galio using the provided ID
    const payment = await getPayment(paymentId);

    const isApproved = payment.status === "approved";
    const isSandboxValid =
      process.env.NODE_ENV !== "production" &&
      payment.status === "approved_sandbox";

    if (isApproved || isSandboxValid) {
      const txDescription = `galio_payment_${payment.id}`;
      const userId = payment.referenceId;

      try {
        // We use the txDescription as the Primary Key ID to prevent race conditions natively.
        // If Galio fires two concurrent webhooks, SQLite will block the second with a UNIQUE constraint error.
        await recordTransaction({
          id: txDescription,
          userId,
          amount: CREDITS_PER_PURCHASE,
          type: "purchase",
          description: txDescription,
        });

        // NOTE: We intentionally do not check `canPurchaseCredits(user.credits)` here.
        // Since the user has already paid real money, honoring the credits takes priority
        // over the soft limit on the account balance.

        console.log(
          `Successfully credited ${CREDITS_PER_PURCHASE} to user ${userId} for payment ${payment.id}`,
        );
      } catch (dbError) {
        // If it's a constraint error, it means the transaction was already processed
        const errorMsg =
          dbError instanceof Error ? dbError.message : String(dbError);
        if (errorMsg.includes("UNIQUE constraint failed")) {
          console.log(
            `Payment ${payment.id} was already processed concurrently. Skipping.`,
          );
        } else {
          throw dbError; // Rethrow other unexpected database errors
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Galio Webhook Error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
