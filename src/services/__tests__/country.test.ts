import { CountryService } from "../country.service";

describe('CountryService', () => {
  const service = CountryService.getInstance();

  it('should return the same instance', () => {
    const instance1 = CountryService.getInstance();
    const instance2 = CountryService.getInstance();
    expect(instance1).toBe(instance2);
  });

  describe('getCountryFlagAndName', () => {
    it('should return the flag and name for a valid country code', () => {
      expect(service.getCountryFlagAndName('US')).toBe('🇺🇸 United States');
      expect(service.getCountryFlagAndName('FR')).toBe('🇫🇷 France');
    });

    it('should return the original string for an invalid country code', () => {
      expect(service.getCountryFlagAndName('XYZ')).toBe('XYZ');
    });
  });
});