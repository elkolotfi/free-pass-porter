import Head from '@/components/Layout/Head';
import store from '@/context/store';
import { setSelectedCountries, setTableFilters } from '@/context/slices/search.slice';
import { CountryOption } from '@/types/country-option.type';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { COUNTRY_OPTION_US } from '@/__mocks__/countries.mock';

// Mock the components used in Head
jest.mock('@/components/Form/CountrySelect', () => ({
  __esModule: true,
  default: ({ onChange }: { onChange: (selected: readonly CountryOption[]) => void }) => (
    <select
      data-testid="country-select"
      onChange={(e) => {
        if (e.target.value) {
          onChange([{ value: e.target.value, label: e.target.value, flag: '🇲🇦' }]);
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

jest.mock('@/components/Misc/AccessFilter', () => ({
  __esModule: true,
  default: ({ selectedCountries }: { selectedCountries: CountryOption[] }) => (
    <div data-testid="access-filter">
      {selectedCountries.map((country, index) => (
        <div key={index}>{country.label}</div>
      ))}
    </div>
  ),
}));

const EXPLANATION_TEXT = 'Select the passports you own or want to own and see places you can freely travel to 😌';

describe('Head Component', () => {
  beforeEach(() => {
    // Reset the store before each test
    store.dispatch(setSelectedCountries([]));
  });

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <Head />
      </Provider>
    );
    expect(screen.getByText('Free Pass Porter')).toBeInTheDocument();
  });

  it('displays initial message when no countries are selected', () => {
    render(
      <Provider store={store}>
        <Head />
      </Provider>
    );
    expect(screen.getByText(EXPLANATION_TEXT)).toBeInTheDocument();
  });

  it('hides initial message when a country is selected', async () => {
    render(
      <Provider store={store}>
        <Head />
      </Provider>
    );

    expect(screen.getByText(EXPLANATION_TEXT)).toBeInTheDocument();

    // Select a country
    await act(async () => {
      const select = screen.getByTestId('country-select');
      fireEvent.change(select, { target: { value: 'US' } });
    });

    expect(screen.queryByText(EXPLANATION_TEXT)).not.toBeInTheDocument();
  });

  it('shows and hides filters when filter button is clicked', async () => {
    render(
      <Provider store={store}>
        <Head />
      </Provider>
    );

    // Select a country
    await act(async () => {
      const select = screen.getByTestId('country-select');
      fireEvent.change(select, { target: { value: 'US' } });
    });

    // Show filters
    const showFilterButton = screen.getByTestId('show-filters-button');
    fireEvent.click(showFilterButton);

    expect(screen.getByTestId('access-filter')).toBeInTheDocument();
    expect(screen.getByTestId('hide-filters-button')).toBeInTheDocument();

    // Hide filters
    const hideFilterButton = screen.getByTestId('hide-filters-button');
    fireEvent.click(hideFilterButton);

    expect(screen.queryByTestId('access-filter')).not.toBeInTheDocument();
    expect(screen.getByTestId('show-filters-button')).toBeInTheDocument();
  });

  it('clears filters when all countries are removed', async () => {
    // Set initial state
    store.dispatch(setSelectedCountries([COUNTRY_OPTION_US]));
    store.dispatch(setTableFilters({ accessFilters: { US: [{ value: 'visa free' }] }, countries: [COUNTRY_OPTION_US] }));

    render(
      <Provider store={store}>
        <Head />
      </Provider>
    );

    await act(async () => {
      const select = screen.getByTestId('country-select');
      fireEvent.change(select, { target: { value: '' } });
    });

    expect(store.getState().search.countries).toEqual([]);
    expect(store.getState().search.filters).toEqual({ accessFilters: {}, countries: [] });
  });
});