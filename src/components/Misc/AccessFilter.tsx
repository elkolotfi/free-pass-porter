import { AccessSelect } from "@/components/Form/AccessSelect";
import CountrySelect from "@/components/Form/CountrySelect";
import { AccessOption } from "@/types/access-option.type";
import { CountryOption } from "@/types/country-option.type";
import { useEffect, useState } from "react";
import { FaRotate } from "react-icons/fa6";

export type AccessFilters = { [passport: string]: readonly AccessOption[] }

export interface TableFilters {
  countries: readonly CountryOption[];
  accessFilters: AccessFilters
}

interface Props {
  selectedCountries: CountryOption[];
  getTableFilters: (filters: TableFilters) => void;
}

export default function AccessFilter({ selectedCountries, getTableFilters }: Props) {
  const [reload, setReload] = useState(0);
  const [tableFilters, setTableFilters] = useState<TableFilters>({
    countries: [], accessFilters: {}
  });

  useEffect(() => {
    if (tableFilters) {
      getTableFilters(tableFilters);
    }
  }, [tableFilters, getTableFilters]);

  function reset() {
    setTableFilters({
      countries: [], accessFilters: {}
    });
    setReload(Math.random());
  }

  const handleCountryChange = 
    (selected: readonly CountryOption[]) => setTableFilters({ ...tableFilters, countries: selected });

  const handleAccessChange = 
    (selected: readonly AccessOption[], country: CountryOption) => {
      const newAccessFilters: AccessFilters = { ...tableFilters.accessFilters };
      newAccessFilters[country.value] = selected;
      setTableFilters({ ...tableFilters, accessFilters: newAccessFilters });
    }

  return <form className="filter-form">
    <div className="form-group">
      <label htmlFor="filter-country">Destination countries</label>
      <CountrySelect
        key={reload}
        onChange={handleCountryChange}
        reload={reload}
        placeholder="Filter your destination countries..."
      />
    </div>
    { selectedCountries &&
      selectedCountries.map((country, id) => <div className="form-group" key={id}>
        <label>{country.flag}</label>
        <AccessSelect
          key={reload}
          onChange={selected => handleAccessChange(selected, country)}
        />
      </div>)
    }

    <div className="form-actions">
      <button type="button" onClick={reset}><FaRotate /> Reset</button>
    </div>
  </form>;
}