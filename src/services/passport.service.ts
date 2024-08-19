import { countries, getEmojiFlag, TCountryCode } from 'countries-list';
import Papa from 'papaparse';
import { AccessResultsType } from '../components/AccessResults';
import { TableFilters } from '../components/AccessTableFilter';
import { CountryOption } from '../types/country-option.type';

const PASSPORT_FILE_PATH = '/src/data/passport-index-matrix-iso2.csv';
export const ORDERED_ACCESS_TYPES = ['citizen', 'visa free', 'visa on arrival', 'e-visa', 'visa required'];

export interface PassportData {
  [country: string]: { [country: string]: string };
}

export type AccessType = number | string;

export type FilteredResultsType = [string, { [passport: string]: AccessType; }];

export async function getPassportData(): Promise<PassportData> {
  const response = await fetch(PASSPORT_FILE_PATH);
  const csv = await response.text();
  const { data } = Papa.parse(csv, { header: true });
  
  const passportData: PassportData = {};
  data.forEach((row: any) => {
    const passport = row.Passport;
    delete row.Passport;
    passportData[passport] = row;
  });
  
  return passportData;
}

function parseAccess(access: string): AccessType {
  if (access === '-1') return 'citizen';
  const num = Number(access);
  return isNaN(num) ? access : num;
}

export function getCountryAccessTypes(passports: string[], data: PassportData): AccessResultsType {
  const accessTypes: AccessResultsType = {};

  passports.forEach(passport => {
    const passportData = data[passport];
    if (!passportData) return;

    Object.entries(passportData).forEach(([country, access]) => {
      if (!accessTypes[country]) {
        accessTypes[country] = {};
      }
      accessTypes[country][passport] = parseAccess(access);
    });

    if (!accessTypes[passport]) {
      accessTypes[passport] = {};
    }
    accessTypes[passport][passport] = 'citizen';
  });
  return accessTypes;
}

export function getBestAccess(accessTypes: AccessType[]): AccessType {
  const numericAccesses = accessTypes.filter((access): access is number => typeof access === 'number');
  
  if (numericAccesses.length > 0) {
    return Math.max(...numericAccesses);
  }

  return accessTypes.reduce((best, current) => {
    if (typeof best !== 'string' || typeof current !== 'string') return best;
    const bestIndex = ORDERED_ACCESS_TYPES.indexOf(best);
    const currentIndex = ORDERED_ACCESS_TYPES.indexOf(current);
    return bestIndex < currentIndex ? best : current;
  });
}

export function getCountryFlagAndName (country: string): string {
  const Tcountry = countries[country as keyof typeof countries];
  return Tcountry ? `${getEmojiFlag(country as TCountryCode)} ${Tcountry.name}` : country;
}

export function formatAccess(access: AccessType): string {
  if (typeof access === 'number') {
    return `visa free (${access} days)`;
  }
  return access;
}

export function filterAccessResults(
  accessResults: AccessResultsType,
  tableFilters: TableFilters,
  selectedCountries: CountryOption[]
): FilteredResultsType[] | null {
  if (!accessResults) {
    return null;
  }

  const filtered = Object.entries(accessResults).reduce((acc, [country, passports]) => {
    // Filter by countries
    if (tableFilters.countries.length > 0 && !tableFilters.countries.some(c => c.value === country)) {
      return acc;
    }

    // Filter by access types
    const filteredPassports = Object.entries(passports).reduce((passAcc, [passport, accessType]) => {
      const accessFilters = tableFilters.accessFilters[passport];
      if (accessFilters && accessFilters.length > 0) {
        if (accessFilters.some(filter => filter.value === accessType || filter.value === 'visa free' && typeof accessType === 'number')) {
          passAcc[passport] = accessType;
        }
      } else {
        passAcc[passport] = accessType;
      }
      return passAcc;
    }, {} as { [passport: string]: AccessType });

    // Only add the country if there are filtered passports
    if (Object.keys(filteredPassports).length > 0) {
      acc[country] = filteredPassports;
    }

    return acc;
  }, {} as AccessResultsType);
  return Object.entries(filtered).filter(([_, accessTypes]) => {
    const passports = Object.entries(accessTypes).map(([passport, _]) => passport);
    return !selectedCountries.some(selectedCountry => !passports.includes(selectedCountry.value));
  });
}
