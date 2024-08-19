import { useEffect, useState } from 'react';
import { FaPassport, FaPlane } from 'react-icons/fa';
import { AccessType, getCountryAccessTypes, getPassportData, PassportData } from '../services/passport.service';
import { CountryOption } from '../types/country-option.type';
import { AccessResults, AccessResultsType } from './AccessResults';
import { CountrySelect } from './CountrySelect';

export default function Home() {
  const [selectedCountries, setSelectedCountries] = useState<CountryOption[]>([]);
  const [passportData, setPassportData] = useState<PassportData | null>(null);
  const [accessResults, setAccessResults] = useState<AccessResultsType | null>(null);

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
        onChange={handleChange}
      />
      { selectedCountries.length < 1 && 
        <p>Select the passports you own or want to own and see places you can freely travel to 😌</p>
      }
      {accessResults && (
        <AccessResults
          accessResults={accessResults}
          selectedCountries={selectedCountries}
        />
      )}
    </div>
  );
}