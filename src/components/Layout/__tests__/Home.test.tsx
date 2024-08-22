import Home from '@/components/Layout/Home';
import { TableFilters } from '@/components/Misc/AccessFilter';
import { AccessResultsType } from '@/components/Misc/AccessResults';
import { PassportDataService } from '@/services/passport-data.service';
import { CountryOption } from '@/types/country-option.type';
import { FilteredResultsType, PassportData } from '@/types/types';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';

// Mock the services
jest.mock('@/services/passport-data.service');
jest.mock('@/services/access-type.service');

// Create a mock PassportData
const mockPassportData: PassportData = {
  USA: { CA: 'visa free', UK: 'visa free' },
  UK: { USA: 'visa free', CA: 'visa free' },
};

// Create a mock AccessResultsType
const mockAccessResults: AccessResultsType = {
  CA: { US: 'visa free', UK: 'visa free' },
  UK: { US: 'visa free' },
  US: { US: 'citizen', UK: 'visa free' },
};

// Create a mock FilteredResultsType
const mockFilteredResults: FilteredResultsType[] = [
  ['Canada', { USA: 'visa free', UK: 'visa free' }],
  ['UK', { USA: 'visa free' }],
  ['USA', { USA: 'citizen', UK: 'visa free' }],
];

jest.mock('@/components/Form/CountrySelect', () => ({
  __esModule: true,
  default: ({ onChange }: { onChange: (selected: CountryOption[]) => void }) => (
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

// const mockAccessResultsComponent = jest.fn(({ tableFilters }) => <div data-testid="access-results">Access Results</div>);
jest.mock('@/components/Misc/AccessResults', () => ({
  __esModule: true,
  AccessResults: () => <div data-testid="access-results">Access Results</div>,
}));

jest.mock('@/components/Misc/AccessFilter', () => ({
  __esModule: true,
  default: ({ selectedCountries, getTableFilters }: { selectedCountries: CountryOption[], getTableFilters: (filters: TableFilters) => void }) => {
    return <div data-testid="access-filter">
      { selectedCountries.map((selectedCountry, i) => <div className="country-filter" key={i}>{selectedCountry.label}</div>)}
      <button type="button" onClick={() => getTableFilters({ accessFilters: {}, countries: [] })}></button>
    </div>
  }
}));

const EXPLANATION_TEXT = 'Select the passports you own or want to own and see places you can freely travel to 😌';

describe('Home Component', () => {
  let mockPassportDataService: jest.Mocked<PassportDataService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockPassportDataService = {
      getPassportData: jest.fn().mockResolvedValue(mockPassportData),
      getCountryAccessTypes: jest.fn().mockReturnValue(mockAccessResults),
      filterAccessResults: jest.fn().mockReturnValue(mockFilteredResults),
    } as unknown as jest.Mocked<PassportDataService>;

    (PassportDataService.getInstance as jest.Mock).mockReturnValue(mockPassportDataService);

    await act(async () => {
      render(<Home />);
    });
  });

  it('renders without crashing', async () => {
    expect(screen.getByText('Free Pass Porter')).toBeInTheDocument();
  });

  it('displays initial message when no countries are selected', async () => {
    expect(screen.getByText(EXPLANATION_TEXT)).toBeInTheDocument();
  });

  it('hides initial message when a country is selected', async () => {
    expect(screen.getByText(EXPLANATION_TEXT)).toBeInTheDocument();

    // Select a country
    await act(async () => {
      const select = screen.getByTestId('country-select');
      fireEvent.change(select, { target: { value: 'USA' } });
    });

    expect(screen.queryByTestId(EXPLANATION_TEXT)).not.toBeInTheDocument();
  });

  it('select country -> show filter button -> click it -> show filters + hide filter button', async () => {
    // Check initial state
    expect(screen.queryByTestId('show-filters-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('hide-filters-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('access-results')).not.toBeInTheDocument();
    expect(screen.queryByTestId('access-filter')).not.toBeInTheDocument();

    // Select a country
    await act(async () => {
      const select = screen.getByTestId('country-select');
      fireEvent.change(select, { target: { value: 'US' } });
    });

    // Check state after country selection
    expect(screen.getByTestId('show-filters-button')).toBeInTheDocument();
    expect(screen.queryByTestId('hide-filters-button')).not.toBeInTheDocument();
    expect(screen.getByTestId('access-results')).toBeInTheDocument();
    expect(screen.queryByTestId('access-filter')).not.toBeInTheDocument();

    // Show filters
    await act(async () => {
      const showFilterButton = screen.getByTestId('show-filters-button');
      fireEvent.click(showFilterButton);
    });

    // Check state after Show filters event
    await waitFor(() => {
      expect(screen.queryByTestId('show-filters-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('hide-filters-button')).toBeInTheDocument();
      expect(screen.getByTestId('access-results')).toBeInTheDocument();
      expect(screen.getByTestId('access-filter')).toBeInTheDocument();
    });

  });

  it('hide filters when selected countries are cleared', async () => {
    // Check initial state
    expect(screen.queryByTestId('show-filters-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('hide-filters-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('access-results')).not.toBeInTheDocument();
    expect(screen.queryByTestId('access-filter')).not.toBeInTheDocument();

    // Select a country + Show filters
    await act(async () => {
      const select = screen.getByTestId('country-select');
      fireEvent.change(select, { target: { value: 'US' } });
      const showFilterButton = screen.getByTestId('show-filters-button');
      fireEvent.click(showFilterButton);
    });

    // Check state after Show filters event
    expect(screen.queryByTestId('show-filters-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('hide-filters-button')).toBeInTheDocument();
    expect(screen.getByTestId('access-results')).toBeInTheDocument();
    expect(screen.getByTestId('access-filter')).toBeInTheDocument();

    await act(async () => {
      const select = screen.getByTestId('country-select');
      fireEvent.change(select, { target: { value: '' } });
    });

    // Check state after hide filter button
    expect(screen.queryByTestId('show-filters-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('access-results')).not.toBeInTheDocument();
    expect(screen.queryByTestId('access-filter')).not.toBeInTheDocument();
    expect(screen.queryByTestId('hide-filters-button')).not.toBeInTheDocument();
  });

  it('toggles filter visibility when filter button is clicked', async () => {
    await act(async () => {
      const select = screen.getByTestId('country-select');
      fireEvent.change(select, { target: { value: 'US' } });
      const showFilterButton = screen.getByTestId('show-filters-button');
      fireEvent.click(showFilterButton);
    });

    // Check state after Show filters event
    expect(screen.queryByTestId('show-filters-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('hide-filters-button')).toBeInTheDocument();
    expect(screen.getByTestId('access-results')).toBeInTheDocument();
    expect(screen.getByTestId('access-filter')).toBeInTheDocument();

    await act(async () => {
      const hideFilterButton = screen.getByTestId('hide-filters-button');
      fireEvent.click(hideFilterButton);
    });

    expect(screen.queryByTestId('show-filters-button')).toBeInTheDocument();
    expect(screen.queryByTestId('hide-filters-button')).not.toBeInTheDocument();
    expect(screen.getByTestId('access-results')).toBeInTheDocument();
    expect(screen.queryByTestId('access-filter')).not.toBeInTheDocument();
  });

  it('triggers getTableFilters correctly', async () => {
    await act(async () => {
      const select = screen.getByTestId('country-select');
      fireEvent.change(select, { target: { value: 'US' } });
      const showFilterButton = screen.getByTestId('show-filters-button');
      fireEvent.click(showFilterButton);
    });

    expect(screen.getByTestId('access-filter')).toBeInTheDocument();

    await act(async() => {
      const filterButton = within(screen.getByTestId('access-filter')).getByRole('button');
      // Fire click event on the button
      fireEvent.click(filterButton);
    });
  });

  it('calls PassportDataService.getPassportData on mount', async () => {  
    await waitFor(() => {
      expect(mockPassportDataService.getPassportData).toHaveBeenCalled();
    });
  });
});