import { AccessSelect } from "@/components/Form/AccessSelect";
import CountrySelect from "@/components/Form/CountrySelect";
import { useAppDispatch, useAppSelector } from "@/context/hooks";
import { setTableFilters } from "@/context/slices/search.slice";
import { AccessOption } from "@/types/access-option.type";
import { CountryOption } from "@/types/country-option.type";
import { useState } from "react";
import { FaRotate } from "react-icons/fa6";

export type AccessFilters = { [passport: string]: AccessOption[] }

export interface TableFilters {
  countries: CountryOption[];
  accessFilters: AccessFilters;
}

interface Props {
  selectedCountries: CountryOption[];
}

export default function AccessFilter({ selectedCountries }: Props) {
  const [reload, setReload] = useState(0);
  const filters = useAppSelector(state => state.search.filters);
  const dispatch = useAppDispatch();

  function reset() {
    dispatch(setTableFilters({
      countries: [], accessFilters: {}
    }));
    setReload(Math.random());
  }

  const handleCountryChange = 
    (selected: readonly CountryOption[]) => {
      dispatch(setTableFilters({ ...filters, countries: [...selected] }));
    }

  const handleAccessChange = 
    (selected: readonly AccessOption[], country: CountryOption) => {
      const newAccessFilters: AccessFilters = { ...filters.accessFilters };
      newAccessFilters[country.value] = [...selected];
      dispatch(setTableFilters({ ...filters, accessFilters: newAccessFilters }));
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