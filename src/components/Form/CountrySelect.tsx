import { CountryOption } from '@/types/country-option.type';
import { countries } from 'countries-list';
import getCountryFlag from 'country-flag-icons/unicode';
import { useMemo, useState } from 'react';
import Select, { StylesConfig } from 'react-select';

interface CountrySelectProps {
  onChange: (selected: readonly CountryOption[]) => void;
  reload?: number;
  placeholder?: string;
}

export default function CountrySelect({ onChange, placeholder = 'Select the countries of your passports...' }: CountrySelectProps) {
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
    <div className="select-container" data-testid="country-select">
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