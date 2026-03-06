import { describe, it, expect } from "vitest"
import { formatPrice, formatArea } from "../../app/utils/format"

describe("formatPrice", () => {
  it("formats a typical Dutch real-estate price", () => {
    expect(formatPrice(350000)).toBe("€\u00a0350.000")
  })

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("€\u00a00")
  })

  it('returns "Prijs op aanvraag" for null', () => {
    expect(formatPrice(null)).toBe("Prijs op aanvraag")
  })

  it('returns "Prijs op aanvraag" for undefined', () => {
    expect(formatPrice(undefined)).toBe("Prijs op aanvraag")
  })

  it("handles large prices without decimals", () => {
    const result = formatPrice(1250000)
    expect(result).toContain("1.250.000")
    expect(result).not.toContain(",")
  })
})

describe("formatArea", () => {
  it("formats area with default m² unit", () => {
    expect(formatArea(120)).toBe("120 m²")
  })

  it("accepts a custom unit", () => {
    expect(formatArea(360, "m³")).toBe("360 m³")
  })

  it('returns "—" for null', () => {
    expect(formatArea(null)).toBe("—")
  })

  it('returns "—" for undefined', () => {
    expect(formatArea(undefined)).toBe("—")
  })

  it("formats zero area", () => {
    expect(formatArea(0)).toBe("0 m²")
  })
})
