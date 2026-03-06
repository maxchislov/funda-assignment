import type { ListingDetail } from "#shared/utils/schemas";

// ~155 chars keeps the meta description within Google's visible snippet length
const DESCRIPTION_MAX_LENGTH = 155;

// Sets <title> and meta tags reactively so they render server-side for crawlers.
export function useListingSeo(listing: Ref<ListingDetail | null | undefined>) {
  useHead({
    title: computed(() =>
      listing.value
        ? `${listing.value.Adres}, ${listing.value.Plaats || listing.value.Postcode}`
        : "Woning",
    ),
    meta: [
      {
        name: "description",
        content: computed(() => {
          const text = listing.value?.VolledigeOmschrijving;
          if (!text) return "Bekijk deze woning op funda.";
          return text.length > DESCRIPTION_MAX_LENGTH
            ? text.substring(0, DESCRIPTION_MAX_LENGTH) + "..."
            : text;
        }),
      },
      {
        property: "og:image",
        content: computed(() => listing.value?.HoofdFoto || ""),
      },
    ],
  });
}
