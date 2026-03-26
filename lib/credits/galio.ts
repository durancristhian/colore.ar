import { env } from "@/lib/env.server";
import { envClient } from "@/lib/env.client";

export type GalioPaymentLinkItem = {
  title: string;
  quantity: number;
  unitPrice: number;
  currencyId: "ARS";
  imageUrl?: string;
};

export type GalioPaymentLinkRequest = {
  items: GalioPaymentLinkItem[];
  referenceId: string;
  notificationUrl?: string;
  sandbox?: boolean;
  backUrl?: {
    success?: string;
    failure?: string;
  };
};

export type GalioPaymentLinkResponse = {
  url: string;
  proofToken: string;
  referenceId: string;
  sandbox: boolean;
};

export type GalioPayment = {
  id: string;
  amount: number;
  currency: string;
  status:
    | "approved"
    | "pending"
    | "rejected"
    | "cancelled"
    | "refunded"
    | string;
  date: string;
  referenceId: string;
  type: string;
  moneyReleaseDate?: string;
  netAmount?: number;
};

/**
 * Helper to fetch from Galio API using configured credentials.
 */
async function fetchGalio<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${env.GALIOPAY_API_BASE}${endpoint}`;
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${env.GALIOPAY_API_KEY}`);
  headers.set("x-client-id", env.GALIOPAY_CLIENT_ID);

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Galio API error (${response.status}): ${text}`);
  }

  return response.json();
}

/**
 * Creates a payment link via Galio API.
 */
export async function createPaymentLink(
  request: GalioPaymentLinkRequest,
): Promise<GalioPaymentLinkResponse> {
  const baseUrl = envClient.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");

  // Set default notification URL if missing
  if (!request.notificationUrl) {
    request.notificationUrl = `${baseUrl}/api/webhooks/galio`;
  }

  // Set default backUrls if missing
  if (!request.backUrl) {
    request.backUrl = {
      success: `${baseUrl}/creditos?payment=success`,
      failure: `${baseUrl}/creditos?payment=failure`,
    };
  }

  // Always use sandbox if not in production
  if (process.env.NODE_ENV !== "production") {
    request.sandbox = true;
  }

  return fetchGalio<GalioPaymentLinkResponse>("/payment-links", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

/**
 * Fetches the payment details by ID from Galio API.
 */
export async function getPayment(paymentId: string): Promise<GalioPayment> {
  return fetchGalio<GalioPayment>(`/payments/${paymentId}`);
}
