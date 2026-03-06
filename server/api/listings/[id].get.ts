import { ListingDetailSchema } from "#shared/utils/schemas"

export default defineCachedEventHandler(
  async (event) => {
    const config = useRuntimeConfig()
    const id = getRouterParam(event, "id")

    // Basic guard against path traversal or Nitro internal routes (keeps console clean)
    if (!id || id.length < 5 || id.startsWith("_") || id.includes(".")) {
      throw createError({
        statusCode: 404,
        statusMessage: "Invalid listing ID",
      })
    }

    const url = `https://partnerapi.funda.nl/feeds/Aanbod.svc/json/detail/${config.fundaApiKey}/koop/${id}/`

    const data = await $fetch(url)
    return ListingDetailSchema.parse(data)
  },
  {
    maxAge: 3600, // Cache property details for 1 hour
    name: "funda-listing-detail",
    getKey: (event) => getRouterParam(event, "id") || "unknown",
  },
)
