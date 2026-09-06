import CountryCodes from './country_codes'
import type { ITUEntry } from './types'

export type { ITUEntry }

export function fromITUCode (ITUCode: string | number): ITUEntry[] {
  const ITUCodeNum = parseInt(String(ITUCode))
  if (isNaN(ITUCodeNum)) return []

  return CountryCodes.filter((country) => {
    return country.itu_country_code === ITUCodeNum
  })
}

export function fromISOCode (ISOCode: string): ITUEntry[] {
  if (typeof ISOCode !== 'string' || ISOCode.length !== 2) return []
  const ISOCodeUpper = ISOCode.toUpperCase()

  return CountryCodes.filter((country) => {
    return country.iso_country_code === ISOCodeUpper
  })
}
