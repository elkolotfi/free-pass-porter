import Select, { StylesConfig } from 'react-select';
import { CountryOption } from '../types/country-option.type';

interface CountrySelectProps {
  availableCountries: CountryOption[];
  selectedCountries: CountryOption[];
  onChange: (selected: readonly CountryOption[]) => void;
}

export function CountrySelect({ availableCountries, selectedCountries, onChange }: CountrySelectProps) {
  const customStyles: StylesConfig<CountryOption, true> = {
    control: (provided) => ({
      ...provided,
      cursor: 'pointer',
    }),
    option: (provided) => ({
      ...provided,
      cursor: 'pointer',
    }),
  };
  
  return (
    <div className="select-container">
      <Select
        isMulti
        options={availableCountries}
        value={selectedCountries}
        onChange={onChange}
        className="passport-select"
        placeholder="Select your passports countries..."
        formatOptionLabel={(country) => (
          <div className="country-option">
            <span className="country-flag">{country.flag}</span>
            <span className="country-name">{country.label}</span>
          </div>
        )}
        styles={customStyles}
      />
      { selectedCountries.length < 1 && 
        <p>Select the passports you own or want to own and see places you can freely travel to 😌</p>
      }
    </div>
  );
}