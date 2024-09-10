import AccessFilter from '@/components/Misc/AccessFilter';
import { setSelectedCountries, setTableFilters } from '@/context/slices/search.slice';
import store from '@/context/store';
import { AccessOption, AccessType } from '@/types/access-option.type';
import { CountryOption } from '@/types/country-option.type';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

// Mock the child components
jest.mock('@/components/Form/CountrySelect', () => ({
  __esModule: true,
  default: ({ onChange }: { onChange: (selected: readonly CountryOption[]) => void }) => (
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
  ),
}));

jest.mock('@/components/Form/AccessSelect', () => ({
  __esModule: true,
  AccessSelect: ({ onChange }: { onChange: (selected: readonly AccessOption[]) => void }) => (
    <select data-testid="access-select" onChange={(e) => onChange([{ value: (e.target.value as AccessType) }])}>
      <option value="">Select access</option>
      <option value="visa free">Visa Free</option>
      <option value="visa required">Visa Required</option>
    </select>
  ),
}));

describe('AccessFilter Component', () => {
  const mockSelectedCountries: CountryOption[] = [
    { value: 'US', label: 'United States', flag: '🇺🇸' },
    { value: 'UK', label: 'United Kingdom', flag: '🇬🇧' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    store.dispatch(setTableFilters({ countries: [], accessFilters: {} }));
  });

  const renderWithProvider = (selectedCountries: CountryOption[]) => {
    return render(
      <Provider store={store}>
        <AccessFilter selectedCountries={selectedCountries} />
      </Provider>
    );
  };

  it('renders without crashing', () => {
    renderWithProvider([]);
    expect(screen.getByText('Destination countries')).toBeInTheDocument();
  });

  it('renders country select', () => {
    renderWithProvider([]);
    expect(screen.getByTestId('country-select')).toBeInTheDocument();
  });

  it('renders access selects for each selected country', () => {
    renderWithProvider(mockSelectedCountries);
    expect(screen.getAllByTestId('access-select')).toHaveLength(2);
  });

  it('updates store when country is selected', async () => {
    renderWithProvider([]);
    const countrySelect = screen.getByTestId('country-select');
    fireEvent.change(countrySelect, { target: { value: 'US' } });

    await waitFor(() => {
      expect(store.getState().search.filters.countries).toEqual([
        { value: 'US', label: 'US', flag: '🇺🇸' },
      ]);
    });
  });

  it('updates store when access type is selected', async () => {
    store.dispatch(setSelectedCountries(mockSelectedCountries));
    renderWithProvider(mockSelectedCountries);
    const accessSelects = screen.getAllByTestId('access-select');
    fireEvent.change(accessSelects[0], { target: { value: 'visa free' } });

    await waitFor(() => {
      expect(store.getState().search.filters.accessFilters).toEqual({
        US: [{ value: 'visa free' }],
      });
    });
  });

  it('resets filters when reset button is clicked', async () => {
    store.dispatch(setSelectedCountries(mockSelectedCountries));
    store.dispatch(setTableFilters({
      countries: mockSelectedCountries,
      accessFilters: { US: [{ value: 'visa free' }] },
    }));

    renderWithProvider(mockSelectedCountries);
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(store.getState().search.filters).toEqual({
        countries: [],
        accessFilters: {},
      });
    });
  });
});