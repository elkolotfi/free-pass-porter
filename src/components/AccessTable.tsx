import { useEffect, useMemo, useRef, useState } from 'react';
import { AccessType, filterAccessResults, formatAccess, getBestAccess, getCountryFlagAndName } from '../services/passport.service';
import { CountryOption } from '../types/country-option.type';
import AccessTableFilter, { TableFilters } from './AccessTableFilter';
import AccessTypeBadge from './AccessTypeShow';
import { AccessResultsType } from './AccessResults';

interface AccessTableProps {
  accessResults: AccessResultsType;
  selectedCountries: CountryOption[];
}

export function AccessTable({ accessResults, selectedCountries }: AccessTableProps) {
  const [tableFilters, setTableFilters] = useState<TableFilters>({
    countries: [], accessFilters: {}
  });

  const tableRef = useRef<HTMLTableElement>(null);
  const headerRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (tableRef.current && headerRef.current) {
        const tableRect = tableRef.current.getBoundingClientRect();
        if (tableRect.top < 0) {
          headerRef.current.style.transform = `translateY(${-tableRect.top}px)`;
        } else {
          headerRef.current.style.transform = 'translateY(0)';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredAccessResults = useMemo(() => {
    return filterAccessResults(accessResults, tableFilters, selectedCountries);
  }, [tableFilters]);


  const countDestinations = useMemo(() => {
    return filteredAccessResults ? Object.keys(filteredAccessResults).length : 0
  }, [filteredAccessResults]);

  function getTableFilters(filters: TableFilters) {
    setTableFilters(filters);
  }

  return (
    <div className="table-wrapper">
      <div className="filter-wrapper">
        <AccessTableFilter selectedCountries={selectedCountries} getTableFilters={getTableFilters} />
      </div>
      <table className="access-table" ref={tableRef}>
        <thead ref={headerRef}>
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
              <td>{getCountryFlagAndName(country)}</td>
              {selectedCountries.map((selectedCountry: CountryOption) => (
                <td key={selectedCountry.value}>
                  <AccessTypeBadge access={formatAccess(accessTypes[selectedCountry.value] || 'N/A')} />
                </td>
              ))}
              {selectedCountries.length > 1 && <td>
                <AccessTypeBadge access={formatAccess(getBestAccess(Object.values(accessTypes)))} />
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