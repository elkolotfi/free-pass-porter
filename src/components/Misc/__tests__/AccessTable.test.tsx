import { COUNTRY_OPTION_CA, COUNTRY_OPTION_FR, COUNTRY_OPTION_UK, COUNTRY_OPTION_US } from '@/__mocks__/countries.mock';
import { AccessTable } from '@/components/Misc/AccessTable';
import { setSelectedCountries } from '@/context/slices/search.slice';
import store from '@/context/store';
import { AccessTypeService } from '@/services/access-type.service';
import { CountryService } from '@/services/country.service';
import { FilteredResultsType } from '@/types/types';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

// Mock the services
jest.mock('@/services/country.service');
jest.mock('@/services/access-type.service');

// Mock the AccessTypeBadge component
jest.mock('@/components/Misc/AccessTypeShow', () => ({
  __esModule: true,
  default: ({ access }: { access: string }) => (<span data-testid="access-type-badge">{access}</span>)
}));

describe('AccessTable Component', () => {
  const mockFilteredResults: FilteredResultsType[] = [
    [COUNTRY_OPTION_CA.value, { [COUNTRY_OPTION_US.value]: 'visa free', [COUNTRY_OPTION_UK.value]: 'visa free' }],
    [COUNTRY_OPTION_FR.value, { [COUNTRY_OPTION_US.value]: 'visa required', [COUNTRY_OPTION_UK.value]: 'visa free' }],
  ];

  const mockSelectedCountries = [COUNTRY_OPTION_US, COUNTRY_OPTION_UK];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the service methods
    (CountryService.getInstance as jest.Mock).mockReturnValue({
      getCountryFlagAndName: jest.fn((country) => `${country} Flag and Name`),
    });

    (AccessTypeService.getInstance as jest.Mock).mockReturnValue({
      formatAccess: jest.fn((access) => access),
      getBestAccess: jest.fn(() => 'visa free'),
    });

    // Reset the Redux store
    store.dispatch(setSelectedCountries(mockSelectedCountries));
  });

  const renderWithProvider = (accessResults: FilteredResultsType[]) => {
    return render(
      <Provider store={store}>
        <AccessTable accessResults={accessResults} />
      </Provider>
    );
  };

  it('renders without crashing', () => {
    renderWithProvider(mockFilteredResults);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders correct number of columns', () => {
    renderWithProvider(mockFilteredResults);
    const headerCells = screen.getAllByRole('columnheader');
    // +1 for destination country, +1 for combined access
    expect(headerCells).toHaveLength(mockSelectedCountries.length + 2);
  });

  it('renders correct number of rows', () => {
    renderWithProvider(mockFilteredResults);
    const rows = screen.getAllByRole('row');
    // +1 for header row
    expect(rows).toHaveLength(mockFilteredResults.length + 1);
  });

  it('displays correct country flags in header', () => {
    renderWithProvider(mockFilteredResults);
    mockSelectedCountries.forEach(country => {
      expect(screen.getByText(country.flag)).toBeInTheDocument();
    });
  });

  it('displays correct access types', () => {
    renderWithProvider(mockFilteredResults);
    const accessBadges = screen.getAllByTestId('access-type-badge');
    expect(accessBadges).toHaveLength(mockFilteredResults.length * (mockSelectedCountries.length + 1));
  });

  it('displays "No results" message when no results are available', () => {
    renderWithProvider([]);
    expect(screen.getByText('No results for your research 😥')).toBeInTheDocument();
  });

  it('calls country service methods', () => {
    renderWithProvider(mockFilteredResults);
    const countryService = CountryService.getInstance();
    expect(countryService.getCountryFlagAndName).toHaveBeenCalledTimes(mockFilteredResults.length);
  });

  it('calls access type service methods', () => {
    renderWithProvider(mockFilteredResults);
    const accessTypeService = AccessTypeService.getInstance();
    expect(accessTypeService.formatAccess).toHaveBeenCalled();
    expect(accessTypeService.getBestAccess).toHaveBeenCalled();
  });
});