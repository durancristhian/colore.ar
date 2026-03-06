# colore.ar — AI Config

## Design Context

### Users

The primary user is someone who enjoys taking photos and transforming them into printable coloring-book-style pages. The core loop is: describe a scene or upload a photo → generate a B&W line-art page → print it → color it by hand. The app is publicly accessible but optimized for this casual, creative, hands-on use case.

### Brand Personality

Creative, minimal, functional.

The app enables a delightful creative act (turning real life into a coloring page) but should stay out of the way. Personality is warm and approachable — not corporate, not childish, not over-designed. Just quietly capable.

### Aesthetic Direction

- **Minimal by default.** Every element earns its place. No decorative chrome, no unnecessary UI noise.
- **Warm tones.** The existing terracotta/amber primary (`oklch(0.62 0.14 39)`) and creamy backgrounds reflect a handmade, analogue feel — lean into this.
- **Typography hierarchy.** Source Serif 4 for headings gives editorial warmth; DM Sans for body keeps it clean and readable.
- **Both light and dark mode** are supported and should be considered equally.
- **Restrained animation.** Confetti on image creation and sparkles on the hero are intentional moments of delight — keep all other motion subtle and purposeful.
- **Not:** flashy SaaS, dark "AI product" aesthetic, loud gradients, excessive iconography, gamified UI patterns.

### Design Principles

1. **Function before form.** The interface exists to help users get to a printable image fast. Reduce steps, reduce noise.
2. **Warmth over polish.** Prefer textures of a sketchbook over the coldness of a dashboard. The product is about making things by hand.
3. **Moments of delight are earned.** Reserve animation and personality for meaningful moments (creation success, first load). Default to calm.
4. **Spanish-first.** All copy is in Rioplatense Spanish. Tone is conversational and friendly — not formal, not cutesy.
5. **Print is a first-class concern.** The output is a physical object. Clarity, contrast, and printability of generated images matter as much as the screen UI.
