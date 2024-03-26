const ituE164CC = require('./index')
describe('fromITUCode', () => {
  test('should return a valid value from an int', () => {
    const results = ituE164CC.fromITUCode('61')
    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBe(1)
    expect(results).toContainEqual({
      itu_country_code: 61,
      name: 'Australia',
      iso_country_code: 'AU'
    })
  })

  test('should return a valid value from a string', () => {
    const results = ituE164CC.fromITUCode('61')
    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBe(1)
    expect(results).toContainEqual({
      itu_country_code: 61,
      name: 'Australia',
      iso_country_code: 'AU'
    })
  })

  test('should return multiple results for shared codes', () => {
    const results = ituE164CC.fromITUCode(1)
    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBe(25)
  })

  test('should return an empty array for completely unknown codes', () => {
    const results = ituE164CC.fromITUCode(2)

    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBe(0)
  })

  test('should return an empty array for an invalid code', () => {
    const results = ituE164CC.fromITUCode('zero')

    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBe(0)
  })
})

describe('fromISOCode', () => {
  test('should return a valid value from a valid uppercase code', () => {
    const results = ituE164CC.fromISOCode('DE')
    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBe(1)
    expect(results).toContainEqual({
      itu_country_code: 49,
      name: 'Germany (Federal Republic of)',
      iso_country_code: 'DE'
    })
  })

  test('should return a valid value from a valid lowercase code', () => {
    const results = ituE164CC.fromISOCode('DE')
    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBe(1)
    expect(results).toContainEqual({
      itu_country_code: 49,
      name: 'Germany (Federal Republic of)',
      iso_country_code: 'DE'
    })
  })

  test('should return multiple results for shared codes', () => {
    const results = ituE164CC.fromISOCode('AU')
    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBe(2)
  })

  test('should return an empty array for completely unknown codes', () => {
    const results = ituE164CC.fromISOCode('ZZ')

    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBe(0)
  })

  test('should return an empty array for completely invalid codes', () => {
    const results = ituE164CC.fromISOCode(1)

    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBe(0)
  })
})
