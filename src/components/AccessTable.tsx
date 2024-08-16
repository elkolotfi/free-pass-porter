import { AccessType, getBestAccess } from '../services/passport.service';
import AccessTypeBadge from './AccessType';
import { CountryOption } from '../types/country-option.type';
import { FaGlobeAfrica } from 'react-icons/fa';

interface AccessTableProps {
  accessResults: { [country: string]: { [passport: string]: AccessType } } | null;
  selectedCountries: CountryOption[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function AccessTable({ accessResults, selectedCountries, searchTerm, onSearchChange }: AccessTableProps) {
  const filteredAccessResults = accessResults ? Object.fromEntries(
    Object.entries(accessResults).filter(([country]) =>
      getCountryFlagAndName(country).toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) : null;

  return (
    <div className="results-container">
      <h2><FaGlobeAfrica /> World Wide Access</h2>
      <div className="table-wrapper">
        <table className="access-table">
          <thead>
            <tr>
              <th>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search country..."
                  className="country-search"
                  autoFocus
                />
              </th>
              {selectedCountries.map(country => (
                <th key={country.value}>{country.flag}</th>
              ))}
              {selectedCountries.length > 1 && <th>{selectedCountries.map(country => country.flag).join(' + ')}</th>}
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
                {selectedCountries.length > 1 && <td>
                  <AccessTypeBadge access={formatAccess(getBestAccess(Object.values(accessTypes)))} />
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}