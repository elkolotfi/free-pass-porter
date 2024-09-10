import { AccessType, PassportData } from '@/types/types';
import { AccessTable } from './AccessTable';
import { useAppSelector } from '@/context/hooks';
import { useEffect, useMemo, useState } from 'react';
import { PassportDataService } from '@/services/passport-data.service';
import { AccessTypeService } from '@/services/access-type.service';

export type AccessResultsType = { [country: string]: { [passport: string]: AccessType } };

export function AccessResults() {
  const passportDataService = PassportDataService.getInstance(AccessTypeService.getInstance());
  const selectedCountries = useAppSelector((state) => state.search.countries);
  const tableFilters = useAppSelector((state) => state.search.filters);

  const [passportData, setPassportData] = useState<PassportData | null>(null);
  useEffect(() => {
    passportDataService.getPassportData().then(setPassportData);
  }, [passportDataService]);

  const accessResults = useMemo(() => {
    if (selectedCountries.length > 0 && passportData) {
      const accessResults = passportDataService.getCountryAccessTypes(
        selectedCountries.map(c => c.value), passportData);

      return passportDataService.filterAccessResults(accessResults, tableFilters, selectedCountries);
    }
    return null;
  }, [selectedCountries, passportDataService, passportData, tableFilters]);

  return accessResults !== null ? (
    <div className="results-container">
      <div className="table-wrapper">
        <AccessTable accessResults={accessResults} />
      </div>
    </div>
  ) : null;
}