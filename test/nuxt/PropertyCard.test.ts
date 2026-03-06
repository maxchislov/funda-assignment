import { describe, it, expect } from "vitest"
import { mountSuspended } from "@nuxt/test-utils/runtime"
import type { ListingSummary } from "#shared/utils/schemas"
import PropertyCard from "~/components/PropertyCard.vue"

const baseListing: ListingSummary = {
  Id: "abc-123",
  Adres: "Keizersgracht 100",
  Woonplaats: "Amsterdam",
  Postcode: "1015 AA",
  Koopprijs: 595000,
  KoopprijsTot: null,
  Woonoppervlakte: 85,
  Perceeloppervlakte: null,
  AantalKamers: 3,
  Foto: "https://cloud.funda.nl/thumb.jpg",
  FotoMedium: null,
  FotoLarge: null,
  FotoLargest: null,
  URL: null,
  AangebodenSindsTekst: "3 dagen",
  MakelaarNaam: "Broker BV",
  Prijs: { Koopprijs: 595000, KoopAbbreviation: "k.k." },
  WGS84_X: 4.8866,
  WGS84_Y: 52.3676,
}

describe("PropertyCard", () => {
  it("renders the address and city", async () => {
    const wrapper = await mountSuspended(PropertyCard, {
      props: { listing: baseListing },
    })
    expect(wrapper.text()).toContain("Keizersgracht 100")
    expect(wrapper.text()).toContain("Amsterdam")
  })

  it("renders a formatted price", async () => {
    const wrapper = await mountSuspended(PropertyCard, {
      props: { listing: baseListing },
    })
    expect(wrapper.text()).toContain("595.000")
  })

  it("renders the price abbreviation", async () => {
    const wrapper = await mountSuspended(PropertyCard, {
      props: { listing: baseListing },
    })
    expect(wrapper.text()).toContain("k.k.")
  })

  it('shows "Prijs op aanvraag" when price is null', async () => {
    const wrapper = await mountSuspended(PropertyCard, {
      props: { listing: { ...baseListing, Koopprijs: null } },
    })
    expect(wrapper.text()).toContain("Prijs op aanvraag")
  })

  it("renders property stats when present", async () => {
    const wrapper = await mountSuspended(PropertyCard, {
      props: { listing: baseListing },
    })
    expect(wrapper.text()).toContain("85 m²")
    expect(wrapper.text()).toContain("3 kamers")
  })

  it("links to the detail page", async () => {
    const wrapper = await mountSuspended(PropertyCard, {
      props: { listing: baseListing },
    })
    const link = wrapper.find("a")
    expect(link.attributes("href")).toContain("/abc-123")
  })
})
