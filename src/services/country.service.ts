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

  getCountryFlagAndName(country: string): string {
    const Tcountry = countries[country as keyof typeof countries];
    return Tcountry ? `${getEmojiFlag(country as TCountryCode)} ${Tcountry.name}` : country;
  }
}