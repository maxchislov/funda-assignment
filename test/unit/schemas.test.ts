import { describe, it, expect } from "vitest"
import {
  ListingSummarySchema,
  ListingsResponseSchema,
  ListingDetailSchema,
} from "../../shared/utils/schemas"

function makeValidSummary(overrides = {}) {
  return {
    Id: "abc-123",
    Adres: "Prinsengracht 263",
    Woonplaats: "Amsterdam",
    Postcode: "1016 GV",
    Koopprijs: 850000,
    KoopprijsTot: null,
    Woonoppervlakte: 120,
    Perceeloppervlakte: null,
    AantalKamers: 5,
    Foto: "https://cloud.funda.nl/foto.jpg",
    FotoMedium: null,
    FotoLarge: null,
    FotoLargest: null,
    URL: "/detail/koop/amsterdam/abc-123",
    AangebodenSindsTekst: "5 dagen",
    MakelaarNaam: "Makelaardij BV",
    Prijs: { Koopprijs: 850000, KoopAbbreviation: "k.k." },
    WGS84_X: 4.883,
    WGS84_Y: 52.373,
    ...overrides,
  }
}

function makeValidDetail(overrides = {}) {
  return {
    Id: "abc-123",
    Adres: "Prinsengracht 263",
    Plaats: "Amsterdam",
    Postcode: "1016 GV",
    Koopprijs: 850000,
    KoopprijsFormaat: "€ 850.000",
    WoonOppervlakte: 120,
    PerceelOppervlakte: null,
    AantalKamers: 5,
    AantalBadkamers: 1,
    AantalSlaapkamers: 3,
    AantalWoonlagen: "2",
    Bouwjaar: 1920,
    SoortWoning: "Bovenwoning",
    Bouwvorm: "Bestaande bouw",
    SoortDak: "Plat dak",
    Tuin: "Geen tuin",
    Inhoud: 360,
    Ligging: "Aan water",
    Garage: null,
    Energielabel: { Label: "C" },
    VolledigeOmschrijving: "<p>Mooie woning</p>",
    HoofdFoto: "https://cloud.funda.nl/hoofd.jpg",
    Media: [
      {
        Soort: 3,
        MediaItems: [
          { Url: "https://cloud.funda.nl/small.jpg", Width: 200, Height: 150 },
          { Url: "https://cloud.funda.nl/large.jpg", Width: 1200, Height: 900 },
        ],
      },
    ],
    WGS84_X: 4.883,
    WGS84_Y: 52.373,
    Makelaar: "Makelaardij BV",
    MakelaarTelefoon: "020-1234567",
    Prijs: { Koopprijs: 850000, KoopAbbreviation: "k.k." },
    ...overrides,
  }
}

describe("ListingSummarySchema", () => {
  it("parses a valid listing summary", () => {
    const result = ListingSummarySchema.parse(makeValidSummary())
    expect(result.Id).toBe("abc-123")
    expect(result.Adres).toBe("Prinsengracht 263")
    expect(result.Koopprijs).toBe(850000)
  })

  it("coerces numeric Id to string", () => {
    const result = ListingSummarySchema.parse(makeValidSummary({ Id: 12345 }))
    expect(result.Id).toBe("12345")
    expect(typeof result.Id).toBe("string")
  })

  it("allows nullable price fields", () => {
    const result = ListingSummarySchema.parse(
      makeValidSummary({ Koopprijs: null, Prijs: null }),
    )
    expect(result.Koopprijs).toBeNull()
    expect(result.Prijs).toBeNull()
  })

  it("rejects missing required fields", () => {
    expect(() =>
      ListingSummarySchema.parse({ Id: "1", Adres: "Test" }),
    ).toThrow()
  })

  it("rejects wrong types on non-nullable fields", () => {
    expect(() =>
      ListingSummarySchema.parse(makeValidSummary({ Adres: 42 })),
    ).toThrow()
  })
})

describe("ListingsResponseSchema", () => {
  it("parses a valid listings response", () => {
    const input = {
      Objects: [makeValidSummary()],
      TotaalAantalObjecten: 150,
      Paging: { AantalPaginas: 6, HuidigePagina: 1 },
    }
    const result = ListingsResponseSchema.parse(input)
    expect(result.Objects).toHaveLength(1)
    expect(result.TotaalAantalObjecten).toBe(150)
    expect(result.Paging.AantalPaginas).toBe(6)
  })

  it("accepts an empty Objects array", () => {
    const input = {
      Objects: [],
      TotaalAantalObjecten: 0,
      Paging: { AantalPaginas: 0, HuidigePagina: 1 },
    }
    const result = ListingsResponseSchema.parse(input)
    expect(result.Objects).toHaveLength(0)
  })

  it("rejects when Paging is missing", () => {
    expect(() =>
      ListingsResponseSchema.parse({
        Objects: [],
        TotaalAantalObjecten: 0,
      }),
    ).toThrow()
  })
})

describe("ListingDetailSchema", () => {
  it("parses a valid listing detail", () => {
    const result = ListingDetailSchema.parse(makeValidDetail())
    expect(result.Id).toBe("abc-123")
    expect(result.AantalKamers).toBe(5)
    expect(result.Media).toHaveLength(1)
  })

  it("coerces string Bouwjaar to number", () => {
    const result = ListingDetailSchema.parse(
      makeValidDetail({ Bouwjaar: "1920" }),
    )
    expect(result.Bouwjaar).toBe(1920)
    expect(typeof result.Bouwjaar).toBe("number")
  })

  it("coerces numeric Id to string", () => {
    const result = ListingDetailSchema.parse(makeValidDetail({ Id: 9876543 }))
    expect(result.Id).toBe("9876543")
  })

  it("handles null Bouwjaar", () => {
    const result = ListingDetailSchema.parse(
      makeValidDetail({ Bouwjaar: null }),
    )
    expect(result.Bouwjaar).toBeNull()
  })

  it("allows optional AantalSlaapkamers to be absent", () => {
    const input = makeValidDetail()
    delete (input as Record<string, unknown>).AantalSlaapkamers
    const result = ListingDetailSchema.parse(input)
    expect(result.AantalSlaapkamers).toBeUndefined()
  })

  it("rejects completely invalid data", () => {
    expect(() => ListingDetailSchema.parse("not an object")).toThrow()
    expect(() => ListingDetailSchema.parse(null)).toThrow()
    expect(() => ListingDetailSchema.parse({})).toThrow()
  })
})
