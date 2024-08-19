import Select, { StylesConfig } from 'react-select';
import { CountryOption } from '../types/country-option.type';
import { useEffect, useMemo, useState } from 'react';
import { countries } from 'countries-list';
import getCountryFlag from 'country-flag-icons/unicode';

interface CountrySelectProps {
  onChange: (selected: readonly CountryOption[]) => void;
  reload?: number;
  placeholder?: string;
}

export function CountrySelect({ onChange, reload = 0, placeholder = 'Select your passports countries...' }: CountrySelectProps) {
  const [selectedCountries, setSelectedCountries] = useState<CountryOption[]>([]);

  const customStyles: StylesConfig<CountryOption, true> = {
    control: (provided) => ({
      ...provided,
      cursor: 'pointer',
    }),
    option: (provided) => ({
      ...provided,
      cursor: 'pointer',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 2,
    }),
  };

  useEffect(() => {
    setSelectedCountries([]);
    onChange([]);
  }, [reload]);

  const countryList: CountryOption[] = useMemo(() => {
    return Object.entries(countries).map(([code, country]) => ({
      value: code,
      label: country.name,
      flag: getCountryFlag(code),
    }));
  }, []);

  const availableCountries = useMemo(() => {
    return countryList.filter(
      (country) => !selectedCountries.some((selected) => selected.value === country.value)
    );
  }, [countryList, selectedCountries]);

  const handleChange = (selected: readonly CountryOption[]) => {
    setSelectedCountries(selected as CountryOption[]);
    onChange(selected);
  };
  
  return (
    <div className="select-container">
      <Select
        isMulti
        options={availableCountries}
        value={selectedCountries}
        onChange={handleChange}
        className="passport-select"
        placeholder={placeholder}
        formatOptionLabel={(country) => (
          <div className="country-option">
            <span className="country-flag">{country.flag}</span>
            <span className="country-name">{country.label}</span>
          </div>
        )}
        styles={customStyles}
      />
    </div>
  );
}