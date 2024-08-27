import { AccessTypeService } from '@/services/access-type.service';
import { CountryService } from '@/services/country.service';
import { PassportDataService } from '@/services/passport-data.service';
import { CountryOption } from '@/types/country-option.type';
import { useMemo } from 'react';
import { TableFilters } from './AccessFilter';
import { AccessResultsType } from './AccessResults';
import AccessTypeBadge from './AccessTypeShow';

interface AccessTableProps {
  accessResults: AccessResultsType;
  selectedCountries: CountryOption[];
  tableFilters: TableFilters;
}

export function AccessTable({ accessResults, selectedCountries, tableFilters }: AccessTableProps) {
  const passportDataService = PassportDataService.getInstance(AccessTypeService.getInstance());
  const countryService = CountryService.getInstance();
  const accessTypeService = AccessTypeService.getInstance();

  const filteredAccessResults = useMemo(() => {
    return passportDataService.filterAccessResults(accessResults, tableFilters, selectedCountries);
  }, [tableFilters, accessResults, passportDataService, selectedCountries]);


  const countDestinations = useMemo(() => {
    return filteredAccessResults ? Object.keys(filteredAccessResults).length : 0
  }, [filteredAccessResults]);

  return (
    <div className="table-wrapper">
      <table className="access-table">
        <thead>
          <tr>
            <th>
              Destination Country ({countDestinations})
            </th>
            {selectedCountries.map(country => (
              <th key={country.value}>{country.flag}</th>
            ))}
            {selectedCountries.length > 1 && <th>{selectedCountries.map(country => country.flag).join(' + ')}</th>}
          </tr>
        </thead>
        <tbody>
          { filteredAccessResults && filteredAccessResults.length > 0 ? 
            filteredAccessResults.map(([country, accessTypes]) => (
            <tr key={country}>
              <td>{countryService.getCountryFlagAndName(country)}</td>
              {selectedCountries.map((selectedCountry: CountryOption) => (
                <td key={selectedCountry.value}>
                  <AccessTypeBadge access={accessTypeService.formatAccess(accessTypes[selectedCountry.value] || 'N/A')} />
                </td>
              ))}
              {selectedCountries.length > 1 && <td>
                <AccessTypeBadge 
                  access={accessTypeService.formatAccess(accessTypeService.getBestAccess(Object.values(accessTypes)))} 
                />
              </td>}
            </tr>
            )) : <tr>
              <td colSpan={selectedCountries.length + 2}>No results for your research 😥</td>
            </tr>}
        </tbody>
      </table>
    </div>
  );
}