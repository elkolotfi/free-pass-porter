import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { FaRotate } from "react-icons/fa6";
import { CountryOption } from "../types/country-option.type";
import { AccessSelect } from "./AccessSelect";
import { CountrySelect } from "./CountrySelect";
import { AccessOption } from "../types/access-option.type";

export type AccessFilters = { [passport: string]: readonly AccessOption[] }

export interface TableFilters {
  countries: readonly CountryOption[];
  accessFilters: AccessFilters
}

interface Props {
  selectedCountries: CountryOption[];
  getTableFilters: (filters: TableFilters) => void;
}

export default function AccessTableFilter({ selectedCountries, getTableFilters }: Props) {
  const [show, setShow] = useState(false);
  const [reload, setReload] = useState(0);
  const [tableFilters, setTableFilters] = useState<TableFilters>({
    countries: [], accessFilters: {}
  });

  useEffect(() => {
    if (tableFilters) {
      getTableFilters(tableFilters);
    }
  }, [tableFilters]);

  function reset() {
    setTableFilters({
      countries: [], accessFilters: {}
    });
    setReload(Math.random());
  }

  return show ? <div className="filter-body">
    <div className="filter-title">
      <h3><FaFilter /> Filter results</h3>
      <button onClick={() => setShow(false)}>x</button>
    </div>

    <form className="filter-form">
      <div className="form-group">
        <label htmlFor="filter-country">Destination countries</label>
        <CountrySelect
          onChange={selected => setTableFilters({ ...tableFilters, countries: selected })}
          reload={reload}
          placeholder="Filter your destination countries..."
        />
      </div>
      { selectedCountries &&
        selectedCountries.map((country, id) => <div className="form-group" key={id}>
          <label>{country.flag}</label>
          <AccessSelect
            onChange={selected => {
              const newAccessFilters: AccessFilters = { ...tableFilters.accessFilters };
              newAccessFilters[country.value] = selected;
              setTableFilters({ ...tableFilters, accessFilters: newAccessFilters });
            }}
            reload={reload}
          />
        </div>)
      }

      <div className="form-actions">
        <button type="button" onClick={reset}><FaRotate /> Reset</button>
      </div>
    </form>
  </div>
  : <button onClick={() => setShow(true)}><FaFilter /> Filter results</button>;
}