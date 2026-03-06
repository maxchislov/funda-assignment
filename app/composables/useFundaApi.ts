import type { ListingsResponse, ListingDetail } from "#shared/utils/schemas"

// Thin wrappers around useFetch that keeps API URLs and query logic in one place
// and gives every consumer SSR-safe, reactive data out of the box.
export function useListings(params?: {
  page?: MaybeRef<number>;
  location?: MaybeRef<string>;
}) {
  return useFetch<ListingsResponse>("/api/listings", {
    query: {
      page: params?.page ?? 1,
      zo: params?.location,
    },
  })
}

export function useListingDetail(id: MaybeRef<string>) {
  return useFetch<ListingDetail>(() => `/api/listings/${toValue(id)}`)
}
