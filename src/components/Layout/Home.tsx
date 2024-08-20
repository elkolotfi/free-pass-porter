import { CountrySelect } from '@/components/Form/CountrySelect';
import { AccessResults, AccessResultsType } from '@/components/Misc/AccessResults';
import { CountryOption } from '@/types/country-option.type';
import { useEffect, useState } from 'react';
import { FaFilter, FaPassport, FaPlane } from 'react-icons/fa';
import AccessFilter, { TableFilters } from '../Misc/AccessFilter';
import { FaFilterCircleXmark } from 'react-icons/fa6';
import { PassportData } from '@/types/types';
import { PassportDataService } from '@/services/passport-data.service';
import { AccessTypeService } from '@/services/access-type.service';


const INIT_FILTER: TableFilters = {
  countries: [], accessFilters: {}
};

export default function Home() {
  const [selectedCountries, setSelectedCountries] = useState<CountryOption[]>([]);
  const [passportData, setPassportData] = useState<PassportData | null>(null);
  const [accessResults, setAccessResults] = useState<AccessResultsType | null>(null);
  const [tableFilters, setTableFilters] = useState<TableFilters>(INIT_FILTER);
  const [showFilters, setShowFilters] = useState(false);

  const passportDataService = PassportDataService.getInstance(AccessTypeService.getInstance());

  useEffect(() => {
    if(!selectedCountries || selectedCountries.length < 1) {
      setTableFilters(INIT_FILTER);
      setShowFilters(false);
    }
  }, [selectedCountries]);

  useEffect(() => {
    passportDataService.getPassportData().then(setPassportData);
  }, []);

  const handleChange = (selected: readonly CountryOption[]) => {
    setSelectedCountries(selected as CountryOption[]);
    if (selected.length > 0 && passportData) {
      const countryAccessTypes = passportDataService.getCountryAccessTypes(selected.map(c => c.value), passportData);
      setAccessResults(countryAccessTypes);
    } else {
      setAccessResults(null);
    }
  };

  function getTableFilters(filters: TableFilters) {
    setTableFilters(filters);
  }

  return (
    <div className="home">
      <div className="head-card">
        <h1 className="title"><FaPlane /> Free Pass Porter <FaPassport /></h1>
        <div className="form-group">
          <label><FaPassport /> Passports</label>
          <div className="select-passports">
            <CountrySelect
              onChange={handleChange}
            />
            { selectedCountries.length > 0 && !showFilters &&
              <button type="button" onClick={() => setShowFilters(true)}><FaFilter /></button>
            }
            { selectedCountries.length > 0 && showFilters &&
              <button type="button" onClick={() => setShowFilters(false)}><FaFilterCircleXmark /></button>
            }
          </div>
          { showFilters && <AccessFilter selectedCountries={selectedCountries} getTableFilters={getTableFilters} /> }
        </div>
        
        { selectedCountries.length < 1 && 
          <p>Select the passports you own or want to own and see places you can freely travel to 😌</p>
        }
      </div>
      
      {accessResults &&
        <AccessResults
          accessResults={accessResults}
          selectedCountries={selectedCountries}
          tableFilters={tableFilters}
        />
      }
    </div>
  );
}