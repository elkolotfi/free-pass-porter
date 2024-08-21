import { PassportData } from '@/types/types';
import { PassportDataService } from '../passport-data.service';
import { AccessTypeService } from '../access-type.service';
import { mockFetch } from '@/utils/__mocks__/fetch.mock';
import { AccessResultsType } from '@/components/Misc/AccessResults';
import { TableFilters } from '@/components/Misc/AccessFilter';
import { CountryOption } from '@/types/country-option.type';

describe('PassportDataService', () => {
  const passportDataService: PassportDataService =
    PassportDataService.getInstance(AccessTypeService.getInstance());

  describe('getPassportData', () => {
    it('should fetch and parse CSV data correctly', async () => {
      // Mock fetch
      const mockCsvData = `Passport,AFG,ALB,DZA,AGO
      AFG,citizen,visa,visa,visa
      ALB,visa,citizen,visa,visa
      DZA,visa,visa,citizen,visa`;
      mockFetch(mockCsvData);

      // Call getPassportData
      const passportData = await passportDataService.getPassportData();

      // Expect the result to be a correctly formatted PassportData object
      expect(passportData).toEqual({
        AFG: { AFG: 'citizen', ALB: 'visa', DZA: 'visa', AGO: 'visa' },
        ALB: { AFG: 'visa', ALB: 'citizen', DZA: 'visa', AGO: 'visa' },
        DZA: { AFG: 'visa', ALB: 'visa', DZA: 'citizen', AGO: 'visa' },
      });
    });

    it('should handle empty CSV data', async () => {
      // Mock fetch to return empty CSV
      mockFetch('');

      // Call getPassportData
      const passportData = await passportDataService.getPassportData();

      // Expect the result to be an empty object
      expect(passportData).toEqual({});
    });

    it('should handle malformed CSV data', async () => {
      // Mock fetch to return malformed CSV
      const mockCsvData = `Passportz,AFG,ALB,DZA,AGO
      AFG,citizen,visa,visa
      ALB,visa,citizen,visa,visa,extra`;
      mockFetch(mockCsvData);

      // Call getPassportData
      // Expect the function to throw an error or return a partial result
      await expect(passportDataService.getPassportData()).rejects.toThrow();
    });
  });

  describe('getCountryAccessTypes', () => {
    const mockPassportData: PassportData = {
      US: { FR: '90', DE: 'e-visa', UK: 'visa-free', JP: 'visa required', US: '-1' },
      UK: { FR: '90', DE: '90', US: 'visa-free', JP: 'visa required', UK: '-1' },
      JP: { FR: '90', DE: 'e-visa', UK: 'visa-free', US: '90', JP: '-1' }
    };

    it('should correctly process passport data for multiple countries', () => {
      // Call getCountryAccessTypes with ['US', 'UK', 'JP'] and mockPassportData
      const countryAccess: AccessResultsType = passportDataService.getCountryAccessTypes(['US', 'JP'], mockPassportData);
      // Expect the result to contain correct access types for all countries
      expect(countryAccess).toEqual({
        DE: {US: 'e-visa', JP: 'e-visa'},
        FR: {US: 90, JP: 90},
        JP: {US: 'visa required', JP: 'citizen'},
        UK: {US: 'visa-free', JP: 'visa-free'},
        US: {US: 'citizen', JP: 90}
      });
    });

    it('should handle missing passport data', () => {
      // Call getCountryAccessTypes with a non-existent passport
      const countryAccess: AccessResultsType = passportDataService.getCountryAccessTypes(['MA', 'JP'], mockPassportData);
      // Expect the result to not include data for the missing passport
      expect(countryAccess).toEqual({
        DE: {JP: 'e-visa'},
        FR: {JP: 90},
        JP: {JP: 'citizen'},
        UK: {JP: 'visa-free'},
        US: {JP: 90}
      })
    });

    it('should correctly set citizen status', () => {
      // Call getCountryAccessTypes with ['US', 'UK']
      const countryAccess: AccessResultsType = passportDataService.getCountryAccessTypes(['US', 'UK'], mockPassportData);
      // Expect US to be citizen for US, and UK to be citizen for UK
      expect(countryAccess.US.US).toBe('citizen');
      expect(countryAccess.UK.UK).toBe('citizen');
    });

    it('should handle empty passport list', () => {
      // Call getCountryAccessTypes with an empty array
      const countryAccess: AccessResultsType = passportDataService.getCountryAccessTypes([], mockPassportData);
      // Expect the result to be an empty object
      expect(countryAccess).toEqual({});
    });

    it('should handle passport data with missing countries', () => {
      // Create passport data with some countries missing
      const mockPassportDataWithMissingCountry: PassportData = {
        US: { FR: '90', DE: 'e-visa', UK: 'visa-free', JP: 'visa required', US: '-1' },
        UK: { FR: '90', DE: '90', US: 'visa-free', JP: 'visa required', UK: '-1' },
        // JP data is missing
      };
      
      // Call getCountryAccessTypes
      const countryAccess: AccessResultsType = passportDataService.getCountryAccessTypes(['US', 'JP', 'MA'], mockPassportDataWithMissingCountry);
    
      // Expect the result to only include data for available countries
      expect(countryAccess).toEqual({
        DE: { US: 'e-visa' },
        FR: { US: 90 },
        UK: { US: 'visa-free' },
        US: { US: 'citizen' },
        JP: { US: 'visa required'}
      });
    });
  });

  describe('filterAccessResults', () => {
    const COUNTRY_OPTION_US: CountryOption = { label: 'United States', value: 'US', flag: '🇺🇸' };
    const COUNTRY_OPTION_UK: CountryOption = { label: 'United Kingdom', value: 'UK', flag: '🇬🇧' };
    const COUNTRY_OPTION_JP: CountryOption = { label: 'Japan', value: 'JP', flag: '🇯🇵' };
    const COUNTRY_OPTION_FR: CountryOption = { label: 'France', value: 'FR', flag: '🇫🇷' };
    const COUNTRY_OPTION_DE: CountryOption = { label: 'Germany', value: 'DE', flag: '🇩🇪' };

    const mockSelectedCountries: CountryOption[] = [
      COUNTRY_OPTION_US, COUNTRY_OPTION_UK, COUNTRY_OPTION_JP
    ];

    const mockAccessResults: AccessResultsType = {
      US: { FR: 90, DE: 'e-visa', US: -1, UK: 'visa free', JP: 'visa required' },
      UK: { FR: 90, DE: 90, US: 'visa free', UK: -1, JP: 'visa required' },
      JP: { FR: 90, DE: 'e-visa', US: 90, UK: 'visa free', JP: -1 },
      CA: { FR: 90, DE: 'e-visa', UK: 'visa free', US: 'visa required', JP: 380 }
    };
  
  
    it('should filter by countries', () => {
      // Mock Table filters (filter by countries)
      const mockTableFilters: TableFilters = {
        countries: [COUNTRY_OPTION_US, COUNTRY_OPTION_UK],
        accessFilters: {}
      };

      // Call filterAccessResults 
      const filteredResults = passportDataService.filterAccessResults(
        mockAccessResults,
        mockTableFilters,
        mockSelectedCountries
      );
  
      // Expect results to be filtered by countries
      expect(filteredResults).not.toBeNull();
      expect(filteredResults?.length).toBe(2);
      expect(filteredResults?.map(result => result[0])).toEqual(['US', 'UK']);
    });
  
    it('should filter by access types', () => {
      // Mock Selected countries and Table filters
      const mockSelectedCountries: CountryOption[] = [COUNTRY_OPTION_FR, COUNTRY_OPTION_DE];
      const mockTableFilters: TableFilters = {
        countries: [],
        accessFilters: {
          FR: [{ value: 'visa free' }],
          DE: [{ value: 'visa free' }],
        }
      };

      // Call filterAccessResults 
      const filteredResults = passportDataService.filterAccessResults(
        mockAccessResults,
        mockTableFilters,
        mockSelectedCountries
      );
  
      // Expect filtered results to only contain UK destinations
      expect(filteredResults).not.toBeNull();
      expect(filteredResults?.length).toBe(1);
  
      if (filteredResults && filteredResults.length > 0) {
        const [country, destinations] = filteredResults[0];

        expect(country).toBe(COUNTRY_OPTION_UK.value);
        expect(destinations).toEqual(mockAccessResults.UK);
      }
    });
  
    it('should filter by selected countries', () => {
      // Verify that the function only returns countries that have at least one passport in the selectedCountries
    });
  
    it('should return an empty array if all countries are filtered out', () => {
      // Mock Selected countries and Table filters
      const mockSelectedCountries: CountryOption[] = [COUNTRY_OPTION_FR, COUNTRY_OPTION_DE];
      const mockTableFilters: TableFilters = {
        countries: [],
        accessFilters: {
          FR: [{ value: 'visa required' }],
        }
      };

      // Call filterAccessResults 
      const filteredResults = passportDataService.filterAccessResults(
        mockAccessResults,
        mockTableFilters,
        mockSelectedCountries
      );

      expect(filteredResults).not.toBeNull();
      expect(filteredResults?.length).toBe(0);
    });
  
    it('should handle empty table countries and filters', () => {
      // Mock Selected countries and Table filters
      const mockSelectedCountries: CountryOption[] = [COUNTRY_OPTION_FR, COUNTRY_OPTION_DE];
      const mockTableFilters: TableFilters = {
        countries: [],
        accessFilters: {}
      };

      // Call filterAccessResults 
      const filteredResults = passportDataService.filterAccessResults(
        mockAccessResults,
        mockTableFilters,
        mockSelectedCountries
      );

      expect(filteredResults).not.toBeNull();
      expect(filteredResults?.length).toBe(4);
    });
  });
});
