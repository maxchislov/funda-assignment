import { describe, it, expect } from "vitest"
import type { ListingDetail, ListingSummary } from "../../shared/utils/schemas"
import {
  getListingImageUrl,
  extractPhotos,
  extractSpecs,
} from "../../app/utils/listing"

// ---------- getListingImageUrl ----------

describe("getListingImageUrl", () => {
  const base: ListingSummary = {
    Id: "1",
    Adres: "Test",
    Woonplaats: "Amsterdam",
    Postcode: "1000AA",
    Koopprijs: null,
    KoopprijsTot: null,
    Woonoppervlakte: null,
    Perceeloppervlakte: null,
    AantalKamers: null,
    Foto: null,
    FotoMedium: null,
    FotoLarge: null,
    FotoLargest: null,
    URL: null,
    AangebodenSindsTekst: null,
    MakelaarNaam: null,
    Prijs: null,
    WGS84_X: null,
    WGS84_Y: null,
  }

  it("prefers FotoLargest", () => {
    expect(
      getListingImageUrl({
        ...base,
        Foto: "s.jpg",
        FotoMedium: "m.jpg",
        FotoLarge: "l.jpg",
        FotoLargest: "xl.jpg",
      }),
    ).toBe("xl.jpg")
  })

  it("falls back to FotoLarge when FotoLargest is missing", () => {
    expect(
      getListingImageUrl({ ...base, Foto: "s.jpg", FotoLarge: "l.jpg" }),
    ).toBe("l.jpg")
  })

  it("falls back to FotoMedium", () => {
    expect(
      getListingImageUrl({ ...base, Foto: "s.jpg", FotoMedium: "m.jpg" }),
    ).toBe("m.jpg")
  })

  it("falls back to Foto", () => {
    expect(getListingImageUrl({ ...base, Foto: "s.jpg" })).toBe("s.jpg")
  })

  it("returns empty string when no photos exist", () => {
    expect(getListingImageUrl(base)).toBe("")
  })
})

// ---------- extractPhotos ----------

describe("extractPhotos", () => {
  it("returns empty array for null media", () => {
    expect(extractPhotos(null)).toEqual([])
  })

  it("filters to Soort === 3 (photos) only", () => {
    const media: ListingDetail["Media"] = [
      {
        Soort: 3,
        MediaItems: [{ Url: "photo.jpg", Width: 800, Height: 600 }],
      },
      {
        Soort: 1,
        MediaItems: [{ Url: "floorplan.jpg", Width: 800, Height: 600 }],
      },
      {
        Soort: 2,
        MediaItems: [{ Url: "video.mp4", Width: 1920, Height: 1080 }],
      },
    ]
    const result = extractPhotos(media)
    expect(result).toHaveLength(1)
    expect(result[0]!.url).toBe("photo.jpg")
  })

  it("picks the widest MediaItem for each photo", () => {
    const media: ListingDetail["Media"] = [
      {
        Soort: 3,
        MediaItems: [
          { Url: "small.jpg", Width: 200, Height: 150 },
          { Url: "large.jpg", Width: 1200, Height: 900 },
          { Url: "medium.jpg", Width: 600, Height: 450 },
        ],
      },
    ]
    const result = extractPhotos(media)
    expect(result[0]!.url).toBe("large.jpg")
  })

  it("handles null Width by treating it as 0", () => {
    const media: ListingDetail["Media"] = [
      {
        Soort: 3,
        MediaItems: [
          { Url: "unknown.jpg", Width: null, Height: null },
          { Url: "known.jpg", Width: 100, Height: 75 },
        ],
      },
    ]
    const result = extractPhotos(media)
    expect(result[0]!.url).toBe("known.jpg")
  })

  it("returns empty array when no media items have Soort 3", () => {
    const media: ListingDetail["Media"] = [
      { Soort: 1, MediaItems: [{ Url: "x.jpg", Width: 100, Height: 100 }] },
    ]
    expect(extractPhotos(media)).toEqual([])
  })
})

// ---------- extractSpecs ----------

describe("extractSpecs", () => {
  const baseDetail: ListingDetail = {
    Id: "1",
    Adres: "Test",
    Plaats: "Amsterdam",
    Postcode: "1000AA",
    Koopprijs: null,
    KoopprijsFormaat: null,
    WoonOppervlakte: null,
    PerceelOppervlakte: null,
    AantalKamers: null,
    AantalBadkamers: null,
    AantalWoonlagen: null,
    Bouwjaar: null,
    SoortWoning: null,
    Bouwvorm: null,
    SoortDak: null,
    Tuin: null,
    Inhoud: null,
    Ligging: null,
    Garage: null,
    Energielabel: null,
    VolledigeOmschrijving: null,
    HoofdFoto: null,
    Media: null,
    WGS84_X: null,
    WGS84_Y: null,
    Makelaar: null,
    MakelaarTelefoon: null,
    Prijs: null,
  }

  it("returns empty array when all fields are null", () => {
    expect(extractSpecs(baseDetail)).toEqual([])
  })

  it("includes only non-null specs", () => {
    const detail = { ...baseDetail, AantalKamers: 4, Bouwjaar: 1985 }
    const result = extractSpecs(detail)
    expect(result).toHaveLength(2)
    expect(result.find((s) => s.label === "Kamers")?.value).toBe(4)
    expect(result.find((s) => s.label === "Bouwjaar")?.value).toBe(1985)
  })

  it("formats area fields with units", () => {
    const detail = { ...baseDetail, WoonOppervlakte: 120, Inhoud: 360 }
    const result = extractSpecs(detail)
    expect(result.find((s) => s.label === "Woonoppervlakte")?.value).toBe(
      "120 m²",
    )
    expect(result.find((s) => s.label === "Inhoud")?.value).toBe("360 m³")
  })

  it("includes nested Energielabel.Label", () => {
    const detail = { ...baseDetail, Energielabel: { Label: "A++" } }
    const result = extractSpecs(detail)
    expect(result.find((s) => s.label === "Energielabel")?.value).toBe("A++")
  })

  it("excludes Energielabel when Label is null", () => {
    const detail = { ...baseDetail, Energielabel: { Label: null } }
    const result = extractSpecs(detail)
    expect(result.find((s) => s.label === "Energielabel")).toBeUndefined()
  })
})
