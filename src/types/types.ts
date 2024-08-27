export interface CountryRow {
  [countryCode: string]: string;
}

export interface PassportData {
  [passportCountry: string]: CountryRow;
}

export type AccessType = number | string;

export type FilteredResultsType = [string, { [passport: string]: AccessType; }];