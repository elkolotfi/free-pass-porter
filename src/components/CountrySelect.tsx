import Select from 'react-select';
import { CountryOption } from '../types/country-option.type';

interface CountrySelectProps {
  availableCountries: CountryOption[];
  selectedCountries: CountryOption[];
  onChange: (selected: readonly CountryOption[]) => void;
}

export function CountrySelect({ availableCountries, selectedCountries, onChange }: CountrySelectProps) {
  return (
    <div className="select-container">
      <Select
        isMulti
        options={availableCountries}
        value={selectedCountries}
        onChange={onChange}
        className="passport-select"
        placeholder="Select countries passports..."
        formatOptionLabel={(country) => (
          <div className="country-option">
            <span className="country-flag">{country.flag}</span>
            <span className="country-name">{country.label}</span>
          </div>
        )}
      />
    </div>
  );
}