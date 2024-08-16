import Papa from 'papaparse';

const PASSPORT_FILE_PATH = '/src/data/passport-index-matrix-iso2.csv';
export const ORDERED_ACCESS_TYPES = ['citizen', 'visa free', 'visa on arrival', 'e-visa', 'visa required'];

export interface PassportData {
  [country: string]: { [country: string]: string };
}

export type AccessType = number | string;

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

export function getCountryAccessTypes(passports: string[], data: PassportData): { [country: string]: { [passport: string]: AccessType } } {
  const accessTypes: { [country: string]: { [passport: string]: AccessType } } = {};

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