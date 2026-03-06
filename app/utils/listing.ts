import type { ListingDetail, ListingSummary } from "#shared/utils/schemas"
import { formatArea } from "~/utils/format"

export interface GalleryPhoto {
  url: string;
  alt?: string;
}

// Funda API uses numeric media types; 3 = photo (vs video, floorplan, etc.)
const MEDIA_TYPE_PHOTO = 3

// Pick the best available resolution, API provides multiple sizes
export function getListingImageUrl(listing: ListingSummary): string {
  return (
    listing.FotoLargest ||
    listing.FotoLarge ||
    listing.FotoMedium ||
    listing.Foto ||
    ""
  )
}

export function extractPhotos(media: ListingDetail["Media"]): GalleryPhoto[] {
  if (!media) return []
  return media
    .filter((m) => m.Soort === MEDIA_TYPE_PHOTO)
    .map((m) => {
      // Each media entry has multiple resolutions, grab the widest one
      const largest = m.MediaItems.reduce((a, b) =>
        (b.Width ?? 0) > (a.Width ?? 0) ? b : a,
      )
      return { url: largest.Url }
    })
}

interface SpecEntry {
  label: string;
  value: string | number | null | undefined;
}

// Build a flat list of non-null specs for the detail page grid
export function extractSpecs(
  listing: ListingDetail,
): { label: string; value: string | number }[] {
  const raw: SpecEntry[] = [
    {
      label: "Woonoppervlakte",
      value: listing.WoonOppervlakte
        ? formatArea(listing.WoonOppervlakte)
        : null,
    },
    {
      label: "Perceeloppervlakte",
      value: listing.PerceelOppervlakte
        ? formatArea(listing.PerceelOppervlakte)
        : null,
    },
    {
      label: "Inhoud",
      value: listing.Inhoud ? formatArea(listing.Inhoud, "m³") : null,
    },
    { label: "Kamers", value: listing.AantalKamers },
    { label: "Slaapkamers", value: listing.AantalSlaapkamers },
    { label: "Badkamers", value: listing.AantalBadkamers },
    { label: "Woonlagen", value: listing.AantalWoonlagen },
    { label: "Bouwjaar", value: listing.Bouwjaar },
    { label: "Soort woning", value: listing.SoortWoning },
    { label: "Bouwvorm", value: listing.Bouwvorm },
    { label: "Dak", value: listing.SoortDak },
    { label: "Tuin", value: listing.Tuin },
    { label: "Garage", value: listing.Garage },
    { label: "Ligging", value: listing.Ligging },
    { label: "Energielabel", value: listing.Energielabel?.Label },
  ]
  return raw.filter(
    (d): d is { label: string; value: string | number } => d.value != null,
  )
}
