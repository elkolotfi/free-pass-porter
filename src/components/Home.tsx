import { countries, getEmojiFlag, TCountryCode } from 'countries-list';
import getCountryFlag from 'country-flag-icons/unicode';
import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import AccessTypeBadge from './AccessType';
import { AccessType, getBestAccess, getCountryAccessTypes, getPassportData, PassportData } from '../services/passport.service';
import { FaPassport, FaPlane, FaGlobeAfrica } from 'react-icons/fa';


interface CountryOption {
  value: string;
  label: string;
  flag: string;
}

function formatAccess(access: AccessType): string {
  if (typeof access === 'number') {
    return `visa free (${access} days)`;
  }
  return access;
}

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

  const getCountryFlagAndName = (country: string): string => {
    const Tcountry = countries[country as keyof typeof countries];
    return Tcountry ? `${getEmojiFlag(country as TCountryCode)} ${Tcountry.name}` : country;
  }

  const filteredAccessResults = useMemo(() => {
    if (!accessResults) return null;
    if (!searchTerm) return accessResults;

    return Object.fromEntries(
      Object.entries(accessResults).filter(([country]) =>
        getCountryFlagAndName(country).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [accessResults, searchTerm]);

  // const toggleSearch = () => {
  //   setShowSearch(!showSearch);
  //   setSearchTerm('');
  // };

  return (
    <div className="home">
      <h1 className="title"><FaPlane /> Free Pass Porter <FaPassport /></h1>
      <div className="select-container">
        <Select
          isMulti
          options={availableCountries}
          value={selectedCountries}
          onChange={handleChange}
          className="passport-select"
          placeholder="Select countries passports..."
          formatOptionLabel={(country) => (
            <div className="country-option">
              <span className="country-flag">{country.flag}</span>
              <span className="country-name">{country.label}</span>
            </div>
          )}
        />
      </div>
      {accessResults && (
        <div className="results-container">
          <h2><FaGlobeAfrica /> World Wide Access</h2>
          <table className="access-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search country..."
                    className="country-search"
                    autoFocus
                  />
                </th>
                {selectedCountries.map(country => (
                    <th key={country.value}>{country.flag}</th>
                ))}
                { selectedCountries.length > 1 && <th>{selectedCountries.map(country => country.flag).join(' + ')}</th> }
              </tr>
            </thead>
            <tbody>
              {Object.entries(filteredAccessResults || {}).map(([country, accessTypes]) => (
                <tr key={country}>
                  <td>{getCountryFlagAndName(country)}</td>
                  {selectedCountries.map((selectedCountry: CountryOption) => (
                    <td key={selectedCountry.value}>
                      <AccessTypeBadge access={formatAccess(accessTypes[selectedCountry.value] || 'N/A')} />
                    </td>
                  ))}
                  { selectedCountries.length > 1 && <td>
                    <AccessTypeBadge access={formatAccess(getBestAccess(Object.values(accessTypes)))} />
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
