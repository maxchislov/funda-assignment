import { ListingsResponseSchema } from "#shared/utils/schemas"

const FUNDA_API_LIST_PATH = "https://partnerapi.funda.nl/feeds/Aanbod.svc/json"

// Server-side proxy: keeps the API key out of the client bundle
// and lets us validate + cache responses before they reach the browser.
export default defineCachedEventHandler(
  async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)

    const page = Number(query.page) || 1
    const pageSize = Number(query.pagesize) || 25
    const location = (query.zo as string) || ""

    const baseUrl = `${FUNDA_API_LIST_PATH}/${config.fundaApiKey}/`
    const params = new URLSearchParams({
      type: "koop",
      page: String(page),
      pagesize: String(pageSize),
    })

    if (location) {
      params.set("zo", `/${location}/`)
    }

    const data = await $fetch(`${baseUrl}?${params}`)
    // Zod parse strips unknown fields and throws on unexpected shapes
    return ListingsResponseSchema.parse(data)
  },
  {
    maxAge: 60, // Cache API response for 1 minute
    name: "funda-listings",
    getKey: (event) => JSON.stringify(getQuery(event)),
  },
)
