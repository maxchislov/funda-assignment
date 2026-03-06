# Funda - Property Listings

A Nuxt 3 application for browsing Funda real-estate listings, built as a frontend engineering assignment.

## Research & Strategy

Before writing the first line of code, I researched the [Funda Engineering Blog](https://blog.funda.nl/) to understand the team's recent migration to Nuxt 3. My goal was to align this project with Funda's architectural values:

- **Consistency**: Adopting the "Appshell" pattern for a seamless SSR-to-Client transition.
- **Performance-First**: Recognizing that real estate search is a high-traffic domain where LCP (Largest Contentful Paint) and CLS (Cumulative Layout Shift) directly impact SEO and user retention.
- **Pragmatism**: I chose a "Simple over Complex" design philosophy. I avoided over-engineering (e.g., massive state management stores like Pinia) where native Nuxt 3 features like `useState` or URL params were more than sufficient for the scope.

---

## Architecture Decisions

- **Single Responsibility & DRY**: Logic for data transformation (API -> UI) is strictly isolated in `utils/listing.ts` and parsing schemas in `shared/utils/schemas.ts`. On the presentation side, UI is broken down into small, highly reusable components (`PropertyCard`, `SearchBar`, `PaginationBar`). This keeps components "dumb" and focused solely on presentation, while making the business logic 100% unit-testable.
- **Testing Architecture**: Guided by the Funda Engineering blog post on Nuxt 3 testing struggles, the test suite is fundamentally split into multiple projects in `vitest.config.ts`. Standard business logic runs instantly in raw Node, while component tests utilize `@nuxt/test-utils` (`environment: 'nuxt'`) to perfectly mock auto-imports and the Nuxt context.
- **Security & API Proxying**: By using a server-side proxy route (`server/api/listings.get.ts`), the API key remains a private environment variable on the server. This prevents "Key Leaks" to the client, and allows the native Nitro caching layer to act as a shield to prevent catastrophic Rate-Limit bans from the Funda Partner API.
- **URL as the Source of Truth**: The search query and pagination state are bound directly to the URL (`?q=`, `?page=`). This ensures listings are natively shareable, bookmarkable, and provides a perfectly sensible "Back" button experience when returning from a detail page.
- **SSR-First vs Client-Only Boundaries**: Pages utilize `useFetch` to render listings on the server for immediate SEO availability and fast First Paint. However, heavy client-bound libraries (like Leaflet Maps) are intentionally segregated into `.client.vue` components to completely avoid SSR hydration mismatches.

---

## Quality Gates & Performance

> ![Lighthouse 100/100](lighthouse-screenshot.png) *(Score achieved on the Vercel production deployment, where Nitro caching and IPX optimizations are active.)*

I implemented multiple layers of defense to ensure a production-ready application that scores exceptionally well on Lighthouse audits (100 Performance, 100 SEO/Best Practices):

- **A11y (Accessibility) by Default**: The UI is optimized for screen readers. Structural elements have comprehensive `aria-labels`, decorative icons are explicitly hidden (`aria-hidden="true"`), and dynamic transitions like pagination utilize `aria-live="polite"` regions so visual changes are announced natively.
- **Zod Validation (Schema Guards)**: Zod acts as a strict boundary between the Funda API and the frontend. If the API ever changes shape or sends unexpected nulls, the backend proxy catches it, gracefully failing or coercing types rather than crashing the client's browser.
- **Image Optimization (LCP Fixes)**: Real estate sites are heavy on highly-detailed imagery. I adopted `@nuxt/image` tied to the `ipx` provider to natively convert large Funda JPEGs into highly compressed WebP/AVIF formats on the fly.
- **Responsive Densities (CLS Fixes)**: I applied explicit `sizes` and `densities` constraints (e.g. `sizes="xs:100vw sm:50vw lg:400px"`) to the `<NuxtImg>` components. This prevents the browser from uselessly downloading massive retina-scaled 1080px images for tiny mobile screens, drastically cutting payload size and eliminating layout shifts.

---

## Final Thoughts & Next Steps

This project represents my core approach to frontend engineering: **Build it reliable, make it fast, and keep it maintainable.** 

If I had more time to continue iterating on this assignment, my next areas of focus would be:

1. **Expanding the Automated Testing Suite**: While the foundation is set via `vitest.config.ts`, I would expand the suite to rigorously validate edge-cases in the Zod schemas and data transformers, alongside deeper component integration tests utilizing `@nuxt/test-utils` and `happy-dom`.
2. **Edge Caching**: Expanding upon the current Nitro in-memory cache by implementing proper `Cache-Control: s-maxage` (Stale-While-Revalidate) headers, allowing Vercel/Cloudflare Edge nodes to statically host API responses globally, further reducing Time-to-First-Byte (TTFB).
3. **GEO (Generative Engine Optimization) — JSON-LD structured data**: My next step for GEO would be to add **Schema.org JSON-LD** on the property detail page so that each listing is not just “text and images” but a machine-readable **RealEstateListing**. Concretely: inject a `<script type="application/ld+json">` via Nuxt’s `useHead` (or `useJsonld` when available), with `@type: "RealEstateListing"`, `address` (PostalAddress), `price`/`priceCurrency`, `numberOfRooms`, and `floorSize` (QuantitativeValue, unitCode MTK). **Why this matters for Funda in 2026**: Search engines and LLMs increasingly use structured data to understand, summarize, and cite sources. With proper JSON-LD, Funda’s listings can be reliably parsed and referenced in AI-generated answers (e.g. “Houses in Amsterdam under €500k”), in rich results, and in voice/search assistants—improving visibility and trust in a GEO-heavy landscape.

---

## Getting Started

### Tech Stack
- **Nuxt 3** - SSR-first framework for Vue
- **Tailwind CSS** - Utility-first styling with Funda branding
- **Zod** - Runtime validation of API responses
- **Leaflet** - Lightweight maps (client-side only)

```bash
# Install dependencies
npm install

# Copy env file and add your API key
cp .env.example .env

# Start development server
npm run dev

# Or build for production preview
npm run build && npm run preview
```
The app runs at `http://localhost:3000`.
