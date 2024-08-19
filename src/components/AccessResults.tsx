import { FaGlobeAfrica } from 'react-icons/fa';
import { AccessType } from '../services/passport.service';
import { CountryOption } from '../types/country-option.type';
import { AccessTable } from './AccessTable';

export type AccessResultsType = { [country: string]: { [passport: string]: AccessType } };

interface AccessTableProps {
  accessResults: AccessResultsType;
  selectedCountries: CountryOption[];
}

export function AccessResults({ accessResults, selectedCountries }: AccessTableProps) {
  return (
    <div className="results-container">
      <h2><FaGlobeAfrica /> World Wide Visa/Free Access</h2>
      <div className="table-wrapper">
        <AccessTable accessResults={accessResults} selectedCountries={selectedCountries} />
      </div>
    </div>
  );
}