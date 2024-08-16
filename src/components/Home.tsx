import { useEffect, useMemo, useState } from 'react';
import { FaPassport, FaPlane } from 'react-icons/fa';
import { countries } from 'countries-list';
import getCountryFlag from 'country-flag-icons/unicode';
import { AccessType, getCountryAccessTypes, getPassportData, PassportData } from '../services/passport.service';
import { CountrySelect } from './CountrySelect';
import { AccessTable } from './AccessTable';
import { CountryOption } from '../types/country-option.type';

export default function Home() {
  const [selectedCountries, setSelectedCountries] = useState<CountryOption[]>([]);
  const [passportData, setPassportData] = useState<PassportData | null>(null);
  const [accessResults, setAccessResults] = useState<{ [country: string]: { [passport: string]: AccessType } } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const countryList: CountryOption[] = useMemo(() => {
    return Object.entries(countries).map(([code, country]) => ({
      value: code,
      label: country.name,
      flag: getCountryFlag(code),
    }));
  }, []);

  const availableCountries = useMemo(() => {
    return countryList.filter(
      (country) => !selectedCountries.some((selected) => selected.value === country.value)
    );
  }, [countryList, selectedCountries]);

  useEffect(() => {
    getPassportData().then(setPassportData);
  }, []);

  const handleChange = (selected: readonly CountryOption[]) => {
    setSelectedCountries(selected as CountryOption[]);
    if (selected.length > 0 && passportData) {
      const countryAccessTypes = getCountryAccessTypes(selected.map(c => c.value), passportData);
      setAccessResults(countryAccessTypes);
    } else {
      setAccessResults(null);
    }
  };

  return (
    <div className="home">
      <h1 className="title"><FaPlane /> Free Pass Porter <FaPassport /></h1>
      <CountrySelect
        availableCountries={availableCountries}
        selectedCountries={selectedCountries}
        onChange={handleChange}
      />
      {accessResults && (
        <AccessTable
          accessResults={accessResults}
          selectedCountries={selectedCountries}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}
    </div>
  );
}