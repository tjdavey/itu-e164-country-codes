# ITU E.164 Country Codes
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/tjdavey/itu-e164-country-codes/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/tjdavey/itu-e164-country-codes/tree/main)
[![Coverage Status](https://coveralls.io/repos/github/tjdavey/itu-e164-country-codes/badge.svg?branch=main)](https://coveralls.io/github/tjdavey/itu-e164-country-codes?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/tjdavey/itu-e164-country-codes/badge.svg)](https://snyk.io/test/github/tjdavey/itu-e164-country-codes)




Javascript Module for searching ITU E.164 Country Codes.

Source data:
- [List of Recommendation ITU-T E.164 assigned country codes](https://www.itu.int/pub/T-SP-E.164D)

## Installation

```bash
npm install itu-e164-country-codes
```

## Usage

### `fromITUCode`

Search for records by ITU E.164 assigned country code.

```javascript 

```javascript
const { fromITUCode } = require('itu-e164-country-codes');

// Search by ITU E.164 Country Code
console.log(fromITUCode(372));
/*
[
  {
    itu_country_code: 372,
    name: 'Estonia (Republic of)',
    iso_country_code: 'EW'
  }
]
 */
```

> NOTE: Many ITU E.164 assigned country codes represent multiple countries or regions. Each region recognised by the ITU
> is represented as a separate record.

### `fromISOCode`

Search for records by ISO 3166-1 alpha-2 Country Code.

```javascript
// Search by ISO 3166-1 alpha-2 Country Code
console.log(fromISOCode('AU'));
/*
[
  {
    itu_country_code: 61,
    name: 'Australia',
    iso_country_code: 'AU'
  },
  {
    itu_country_code: 672,
    name: 'Australian External Territories',
    iso_country_code: 'AU'
  }
]
 */
```

> NOTE: Some ITU E.164 assigned country codes correspond to sub-regions of an ISO 3166-1 recognised country which is not
> separately recognised by the ISO. In these cases these are grouped under the primary ISO-3166-1 code. This means 
> multiple entries may match a single ISO 3166-1 alpha-2 country code.

## Data Structure

```javascript
[
  {
    itu_country_code: number,
    name: string,
    iso_country_code: string
  }
]
```

| Field              | Type                  | Description                                                                         | Notes                                                                                                                                                                                                                                       |
|--------------------|-----------------------|-------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `itu_country_code` | `number`              | [ITU-T E.164 assigned country code](https://en.wikipedia.org/wiki/E.164)            |                                                                                                                                                                                                                                             |
| `iso_country_code` | `string &#124; null`  | [ISO 3166-1 alpha-2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) | Where the ITU code represents a sub-region of a country which does not have a seperate ISO 3166-1 designation the country designation is used. If the ITU code does not correspond to a country or region of a country this will be `null`. |
| `name`             | `string  &#124; null` | Name                                                                                | Defined as per the ITU document "List of Recommendation ITU-T E.164 assigned country codes". If the ITU-T documentation lists this ITU-T e.164 assigned country code as "Spare" this will be `null`.                                        |





