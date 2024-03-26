export interface ITUEntry {
    itu_country_code: number;
    name: string | null;
    iso_country_code: string | null;
}

export function fromITUCode(ITUCode: string | number): [ITUEntry] | [];

export function fromISOCode(ISOCode: string): [ITUEntry] | [];
