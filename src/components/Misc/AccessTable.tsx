import { useAppSelector } from '@/context/hooks';
import { AccessTypeService } from '@/services/access-type.service';
import { CountryService } from '@/services/country.service';
import { CountryOption } from '@/types/country-option.type';
import { FilteredResultsType } from '@/types/types';
import { useMemo } from 'react';
import AccessTypeBadge from './AccessTypeShow';

interface AccessTableProps {
  accessResults: FilteredResultsType[];
}

export function AccessTable({ accessResults }: AccessTableProps) {
  const countryService = CountryService.getInstance();
  const accessTypeService = AccessTypeService.getInstance();

  const selectedCountries = useAppSelector((state) => state.search.countries);


  const countDestinations = useMemo(() => {
    return accessResults ? Object.keys(accessResults).length : 0
  }, [accessResults]);

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
          { accessResults && accessResults.length > 0 ? 
            accessResults.map(([country, accessTypes]) => (
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