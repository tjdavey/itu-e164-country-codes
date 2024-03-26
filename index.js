const CountryCodes = require('./country_codes')

function fromITUCode (ITUCode) {
  const ITUCodeNum = parseInt(ITUCode)
  if (isNaN(ITUCodeNum)) return []

  return CountryCodes.filter((country) => {
    return country.itu_country_code === ITUCodeNum
  })
}

function fromISOCode (ISOCode) {
  if (ISOCode.length !== 2 || !ISOCode.toUpperCase) return []
  const ISOCodeUpper = ISOCode.toUpperCase()

  return CountryCodes.filter((country) => {
    return country.iso_country_code === ISOCodeUpper
  })
}

module.exports = {
  fromITUCode,
  fromISOCode
}
