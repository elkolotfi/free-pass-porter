import { countries, getEmojiFlag, TCountryCode } from 'countries-list';

export class CountryService {
  private static INSTANCE: CountryService;
  private constructor() {}

  static getInstance(): CountryService {
    if (!CountryService.INSTANCE) {
      CountryService.INSTANCE = new CountryService();
    }

    return CountryService.INSTANCE;
  }

  getCountryFlagAndName(countryCode: string): string {
    const Tcountry = countries[countryCode as keyof typeof countries];
    return Tcountry ? `${getEmojiFlag(countryCode as TCountryCode)} ${Tcountry.name}` : countryCode;
  }
}