import { TableFilters } from '@/components/Misc/AccessFilter';
import { AccessResultsType } from '@/components/Misc/AccessResults';
import { CountryOption } from '@/types/country-option.type';
import { AccessType, FilteredResultsType, PassportData } from '@/types/types';
import Papa from 'papaparse';
import { AccessTypeService } from './access-type.service';

const PASSPORT_FILE_PATH = '/src/data/passport-index-matrix-iso2.csv';

export class PassportDataService {
  private static INSTANCE: PassportDataService;
  private constructor(private accessTypeService: AccessTypeService) {}

  static getInstance(accessTypeService: AccessTypeService): PassportDataService {
    if (!PassportDataService.INSTANCE && accessTypeService) {
      PassportDataService.INSTANCE = new PassportDataService(accessTypeService);
    }

    return PassportDataService.INSTANCE;
  }

  async getPassportData(): Promise<PassportData> {
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

  getCountryAccessTypes(passports: string[], data: PassportData): AccessResultsType {
    const accessTypes: AccessResultsType = {};

    passports.forEach(passport => {
      const passportData = data[passport];
      if (!passportData) return;

      Object.entries(passportData).forEach(([country, access]) => {
        if (!accessTypes[country]) {
          accessTypes[country] = {};
        }
        accessTypes[country][passport] = this.accessTypeService.parseAccess(access);
      });

      if (!accessTypes[passport]) {
        accessTypes[passport] = {};
      }
      accessTypes[passport][passport] = 'citizen';
    });
    return accessTypes;
  }

  filterAccessResults(
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
}