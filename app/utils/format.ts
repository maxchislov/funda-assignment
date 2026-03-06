// Dutch locale formatting: € 350.000 (no decimals for real estate prices)
export function formatPrice(price: number | null | undefined): string {
  if (price == null) return "Prijs op aanvraag";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatArea(
  area: number | null | undefined,
  unit = "m²",
): string {
  if (area == null) return "—";
  return `${area} ${unit}`;
}
