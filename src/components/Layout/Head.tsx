import { useAppDispatch, useAppSelector } from "@/context/hooks";
import { setSelectedCountries, setTableFilters } from "@/context/slices/search.slice";
import { CountryOption } from "@/types/country-option.type";
import { useCallback, useEffect, useState } from "react";
import { FaFilter, FaPassport, FaPlane } from "react-icons/fa";
import { FaFilterCircleXmark } from "react-icons/fa6";
import CountrySelect from "../Form/CountrySelect";
import AccessFilter from "../Misc/AccessFilter";


export default function Head() {
  const selectedCountries = useAppSelector((state) => state.search.countries);
  const dispatch = useAppDispatch();

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if(!selectedCountries || selectedCountries.length < 1) {
      setTableFilters({ accessFilters: {}, countries: [] });
      setShowFilters(false);
    }
  }, [selectedCountries]);

  const handleChange = useCallback((selected: readonly CountryOption[]) => {
    dispatch(setSelectedCountries(selected as CountryOption[]));
  }, [dispatch]);

  return <div className="head-card">
    <h1 className="title"><FaPlane /> Free Pass Porter <FaPassport /></h1>
    <div className="form-group">
      <label><FaPassport /> Passports</label>
      <div className="select-passports">
        <CountrySelect
          onChange={handleChange}
        />
        { selectedCountries.length > 0 && !showFilters &&
          <button type="button" data-testid="show-filters-button" onClick={() => setShowFilters(true)}>
            <FaFilter />
          </button>
        }
        { selectedCountries.length > 0 && showFilters &&
          <button type="button" data-testid="hide-filters-button" onClick={() => setShowFilters(false)}>
            <FaFilterCircleXmark />
          </button>
        }
      </div>
      { showFilters && <AccessFilter selectedCountries={selectedCountries} /> }
    </div>
    
    { selectedCountries.length < 1 && 
      <strong>Select the passports you own or want to own and see places you can freely travel to 😌</strong>
    }
  </div>
}