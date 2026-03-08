# Funda: Property Listings

A Nuxt 3 SSR application for browsing Funda real-estate listings, built as a frontend engineering assignment.

**[Live Demo](https://funda-assignment-fawn.vercel.app/)** · Vue 3 · Nuxt 3 · Tailwind CSS · Zod · Vitest

---

## What's Built

Two core pages:

- **Search results**: server-rendered listing grid with URL-driven search and pagination (`?q=`, `?page=`)
- **Listing detail**: full property page with a client-side Leaflet map, image gallery, and structured specs

Key technical highlights:

- All API calls proxied server-side, key never exposed to the client
- Zod schema validation at the proxy layer, API shape changes fail gracefully
- `.client.vue` components isolate browser-only widgets (e.g. Leaflet) from SSR
- Nitro in-memory caching buffers against Partner API rate limits
- Appshell pattern for a seamless SSR-to-client transition
- Skeleton loading and fallback error pages for perceived performance and resilience
- "Simple over complex" philosophy: URL query params (`?q=`, `?page=`) as the single source of truth + Vue's native `ref`/`computed` for local state — no state management library needed

**Lighthouse 100/100** on Performance, Accessibility, SEO, and Best Practices on the Vercel production deployment.

---

## Engineering Approach

Before writing any code, I read the [Funda Engineering Blog](https://blog.funda.nl/) to align with the team's technical direction, specifically the **Lighthouse Architecture** (bounded contexts, decoupled ownership) and the push toward Nuxt 3 and cloud-native patterns. The decisions below also reflect my own values: SSR-first for SEO, single-responsibility boundaries for maintainability, and pragmatism over over-engineering.

---

## Architecture Decisions

These are the key architectural choices I made, balancing developer experience with user experience optimisation.

### URL as the Source of Truth

**Implementation:** The search query and pagination state live directly in the URL (`?q=`, `?page=`).

- **DevEx:** No need for a global state management library, the URL handles it. Completely avoids SSR hydration mismatches and `window is not defined` errors.
- **User Experience:** Listings are natively shareable, bookmarkable, and history-aware, no custom routing or state restoration needed.

### SSR-First with Client-Only Boundaries

**Implementation:** Pages use `useFetch` to render listings on the server. Heavy client-side libraries (like Leaflet for maps) are isolated into `.client.vue` components.

- **DevEx:** Clean separation means no accidental DOM access during SSR.
- **User Experience:** Critical content is SEO-available and paints fast. Skeleton loading fills the gap while interactive widgets load, and a dedicated error page handles failures gracefully.

### Security & API Proxying

**Implementation:** All external API calls go through a server-side proxy (`server/api/listings.get.ts`).

- **DevEx:** Centralizes data-fetching logic and gives us a single integration point for caching.
- **User Experience:** Keeps the API key out of the client bundle (no leaks), and the Nitro caching layer acts as a buffer against Rate-Limit bans from the Partner API.

### Single Responsibility & DRY

**Implementation:** Data transformation logic lives in `utils/listing.ts`, parsing schemas in `shared/utils/schemas.ts`. The UI is built from small, focused components (`PropertyCard`, `SearchBar`, etc.) that only handle presentation.

- **DevEx:** Business logic is 100% unit-testable without touching the DOM. Components stay reusable and easy to reason about.
- **User Experience:** When the API structure changes, the blast radius is contained, you fix the transformer, not every template.

---

## Quality Gates

To keep things stable, I set up the following quality boundaries:

### Automated Testing Suite

Guided by Funda's own blog post on Nuxt 3 testing pain points, the suite is split into separate projects in `vitest.config.ts`:

- **Unit Tests**: Fast, pure Node tests for business logic and data transformers.
- **Component Tests**: Uses `@nuxt/test-utils` with `environment: 'nuxt'` to verify UI behavior with proper auto-import mocking.
- **Coverage Reporting**: Test coverage tooling is already wired in, so enforcing minimum coverage thresholds in CI/CD is just a config flag away.
- **Pre-commit hook**: [Husky](https://typicode.github.io/husky/) runs the full test suite (`npm run test:run`, unit + Nuxt projects) before each commit so broken code doesn’t get committed.

### Zod Validation (Schema Guards)

Zod sits as a strict contract between the Funda API and the frontend. Data gets validated and parsed at the server-proxy level, so if the API ever changes shape or sends unexpected nulls, the app fails gracefully instead of crashing with "undefined" errors in the user's browser.

---

## Performance Metrics

> ![Lighthouse 100/100](lighthouse-screenshot.png)
> *Score achieved on the Vercel production deployment, with Nitro caching and IPX optimizations active.*

The app was built to hit strict Core Web Vitals targets, it scores **100/100** on Lighthouse for Performance, Accessibility, SEO, and Best Practices.

### Image Optimization (LCP)

Real estate sites are image-heavy by nature. I used `@nuxt/image` with the `ipx` provider to convert large Funda JPEGs into compressed WebP/AVIF on the fly, which brought LCP well within budget.

### Responsive Densities (CLS)

Explicit `sizes` and `densities` constraints (e.g. `sizes="xs:100vw sm:50vw lg:400px"`) on `<NuxtImg>` components prevent the browser from downloading oversized retina images on small screens. This cuts payload and eliminates layout shifts.

---

## Accessibility (a11y) by Default

The UI is built with screen readers in mind, targeting WCAG AAA European standards. Structural elements carry proper `aria-labels`, decorative icons are hidden via `aria-hidden="true"`, and dynamic content changes (like pagination updates) use `aria-live="polite"` regions so assistive tech picks them up automatically.

---

## Final Thoughts & Next Steps

This project reflects how I like to approach frontend work: **build it reliable, make it fast, keep it maintainable.**

If I had more time to keep iterating, here's where I'd focus next:

1. **JSON-LD Structured Data (GEO)**: Add Schema.org JSON-LD on the detail page to make each listing a machine-readable `RealEstateListing`. Inject via `useHead` with `address`, `price`, `numberOfRooms`, `floorSize`, etc. In 2026, search engines and LLMs increasingly rely on structured data to surface and cite results, this is how Funda's listings show up in AI answers like "houses in Amsterdam under €500k."
2. **Map View Toggle**: A "Show on map" toggle on the results page, plotting all listings on a single Leaflet map. Matches how a lot of people actually search for homes.
3. **Advanced Search & Filtering**: The URL-state architecture (`?q=amsterdam`) is proven. Next step: multi-faceted filtering (price, property type, rooms, sorting). For a premium search experience, integrating **Algolia** for NLP search or **Typesense** for instant typo-tolerant suggestions would be worth exploring.
4. **Expanding the Test Suite**: The foundation is there via `vitest.config.ts`. Next would be thorough edge-case coverage for Zod schemas and deeper component integration tests with `@nuxt/test-utils` and `happy-dom`, and E2E flows with Playwright to validate full user journeys across SSR and client hydration.
5. **Edge Caching**: Move beyond Nitro's in-memory cache by adding proper `Cache-Control: s-maxage` (Stale-While-Revalidate) headers, so Vercel/Cloudflare edge nodes can serve API responses globally and cut TTFB further.
6. **UX Polish**: Collaborate with UX to improve information hierarchy. On the detail page: break up long `VolledigeOmschrijving` blocks into expandable sections with clear headers (e.g. "Begane grond", "Eerste verdieping"), and reorder property specs more logically.
7. **Detail Page Engagement**: Energy label as a color-coded badge, a "Direct contact" form, a quick mortgage calculator, and a "Similar properties" section to keep users browsing.
8. **Branding**: Swap the text logo for a proper Funda SVG. Small change, big visual upgrade.
9. **Favorites / Saved Listings**: Heart icon on property cards, persisted via `localStorage` or account-backed. Simple feature that improves retention.

---

## Getting Started

### Tech Stack


|                  |                                           |
| ---------------- | ----------------------------------------- |
| **Nuxt 3**       | SSR-first framework for Vue               |
| **Tailwind CSS** | Utility-first styling with Funda branding |
| **Zod**          | Runtime validation of API responses       |
| **Vitest**       | Unit and component testing                |
| **Leaflet**      | Lightweight maps (client-side only)       |


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