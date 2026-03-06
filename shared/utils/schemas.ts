import { z } from "zod/v4"

// Funda API sometimes returns numbers where we expect strings (e.g. Id, Bouwjaar),
// so we coerce both directions to keep the rest of the app type-safe.
const coercedString = z.union([z.string(), z.number()]).transform(String)
const coercedNumber = z.union([z.string(), z.number()]).pipe(z.coerce.number())

// Validates the shape we actually use, ignoring extra fields the API may return.
export const ListingSummarySchema = z.object({
  Id: coercedString,
  Adres: z.string(),
  Woonplaats: z.string(),
  Postcode: z.string(),
  Koopprijs: z.number().nullable(),
  KoopprijsTot: z.number().nullable(),
  Woonoppervlakte: z.number().nullable(),
  Perceeloppervlakte: z.number().nullable(),
  AantalKamers: z.number().nullable(),
  Foto: z.string().nullable(),
  FotoMedium: z.string().nullable(),
  FotoLarge: z.string().nullable(),
  FotoLargest: z.string().nullable(),
  URL: z.string().nullable(),
  AangebodenSindsTekst: z.string().nullable(),
  MakelaarNaam: z.string().nullable(),
  Prijs: z
    .object({
      Koopprijs: z.number().nullable(),
      KoopAbbreviation: z.string().nullable(),
    })
    .nullable(),
  WGS84_X: z.number().nullable(),
  WGS84_Y: z.number().nullable(),
})

export const ListingsResponseSchema = z.object({
  Objects: z.array(ListingSummarySchema),
  TotaalAantalObjecten: z.number(),
  Paging: z.object({
    AantalPaginas: z.number(),
    HuidigePagina: z.number(),
  }),
})

const MediaItemSchema = z.object({
  Url: z.string(),
  Height: z.number().nullable(),
  Width: z.number().nullable(),
})

const MediaSchema = z.object({
  MediaItems: z.array(MediaItemSchema),
  Soort: z.number(),
})

export const ListingDetailSchema = z.object({
  Id: coercedString,
  Adres: z.string(),
  Plaats: z.string().nullable(),
  Postcode: z.string(),
  Koopprijs: z.number().nullable(),
  KoopprijsFormaat: z.string().nullable(),
  WoonOppervlakte: z.number().nullable(),
  PerceelOppervlakte: z.number().nullable(),
  AantalKamers: z.number().nullable(),
  AantalBadkamers: z.number().nullable(),
  AantalSlaapkamers: z.number().nullable().optional(),
  AantalWoonlagen: z.string().nullable(),
  Bouwjaar: coercedNumber.nullable(),
  SoortWoning: z.string().nullable(),
  Bouwvorm: z.string().nullable(),
  SoortDak: z.string().nullable(),
  Tuin: z.string().nullable(),
  Inhoud: z.number().nullable(),
  Ligging: z.string().nullable(),
  Garage: z.string().nullable(),
  Energielabel: z
    .object({
      Label: z.string().nullable(),
    })
    .nullable(),
  VolledigeOmschrijving: z.string().nullable(),
  HoofdFoto: z.string().nullable(),
  Media: z.array(MediaSchema).nullable(),
  WGS84_X: z.number().nullable(),
  WGS84_Y: z.number().nullable(),
  Makelaar: z.string().nullable(),
  MakelaarTelefoon: z.string().nullable(),
  Prijs: z
    .object({
      Koopprijs: z.number().nullable(),
      KoopAbbreviation: z.string().nullable(),
    })
    .nullable(),
})

// Inferred types keep schemas as the single source of truth, no manual interfaces needed.
export type ListingSummary = z.infer<typeof ListingSummarySchema>;
export type ListingDetail = z.infer<typeof ListingDetailSchema>;
export type ListingsResponse = z.infer<typeof ListingsResponseSchema>;
