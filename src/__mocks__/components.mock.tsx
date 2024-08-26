import { CountryOption } from '@/types/country-option.type';
import { AccessOption, AccessType } from '@/types/access-option.type';

export const mockCountrySelect = ({ onChange }: { onChange: (selected: CountryOption[]) => void }) => (
  <select
    data-testid="country-select"
    onChange={(e) => {
      if (e.target.value) {
        onChange([{ value: e.target.value, label: e.target.value, flag: '🇺🇸' }]);
      } else {
        onChange([]);
      }
    }}
  >
    <option value="">Select a country</option>
    <option value="US">USA</option>
    <option value="UK">UK</option>
  </select>
);

export const mockAccessSelect = ({ onChange }: { onChange: (selected: AccessOption[]) => void }) => (
  <select
    data-testid="access-select"
    onChange={(e) => {
      if (e.target.value) {
        onChange([{ value: e.target.value as AccessType }]);
      } else {
        onChange([]);
      }
    }}
  >
    <option value="">Select access type</option>
    <option value="visa free">Visa Free</option>
    <option value="visa on arrival">Visa on Arrival</option>
  </select>
);

export const mockAccessTable = () => (<div data-testid="mock-access-table">Mock Access Table</div>);
