import { CountryOption } from '@/types/country-option.type';
import { AccessTable } from './AccessTable';
import { TableFilters } from './AccessFilter';
import { AccessType } from '@/types/types';

export type AccessResultsType = { [country: string]: { [passport: string]: AccessType } };

interface AccessTableProps {
  accessResults: AccessResultsType;
  selectedCountries: CountryOption[];
  tableFilters: TableFilters;
}

export function AccessResults({ accessResults, selectedCountries, tableFilters }: AccessTableProps) {
  return (
    <div className="results-container">
      <div className="table-wrapper">
        <AccessTable accessResults={accessResults} selectedCountries={selectedCountries} tableFilters={tableFilters} />
      </div>
    </div>
  );
}