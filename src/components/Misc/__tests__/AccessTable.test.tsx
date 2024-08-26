import { COUNTRY_OPTION_UK, COUNTRY_OPTION_US } from '@/__mocks__/countries.mock';
import { TableFilters } from '@/components/Misc/AccessFilter';
import { AccessResultsType } from '@/components/Misc/AccessResults';
import { AccessTable } from '@/components/Misc/AccessTable';
import { AccessTypeService } from '@/services/access-type.service';
import { CountryService } from '@/services/country.service';
import { PassportDataService } from '@/services/passport-data.service';
import { CountryOption } from '@/types/country-option.type';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// Mock the services
jest.mock('@/services/passport-data.service');
jest.mock('@/services/country.service');
jest.mock('@/services/access-type.service');


// const fn = ({ access }: { access: string }) => (<span data-testid="access-type-badge">{access}</span>)
// Mock the AccessTypeBadge component
jest.mock('@/components/Misc/AccessTypeShow', () => ({
  __esModule: true,
  default: ({ access }: { access: string }) => (<span data-testid="access-type-badge">{access}</span>)
}));

describe('AccessTable Component', () => {
  const mockAccessResults: AccessResultsType = {
    CA: { US: 'visa free', UK: 'visa free' },
    FR: { US: 'visa required', UK: 'visa free' },
  };

  const mockSelectedCountries: CountryOption[] = [COUNTRY_OPTION_US, COUNTRY_OPTION_UK];

  const mockTableFilters: TableFilters = {
    countries: [],
    accessFilters: {}
  };

  const mockFilteredResults = [
    ['CA', { US: 'visa free', UK: 'visa free' }],
    ['FR', { US: 'visa required', UK: 'visa free' }],
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the service methods
    (PassportDataService.getInstance as jest.Mock).mockReturnValue({
      filterAccessResults: jest.fn().mockReturnValue(mockFilteredResults),
    });

    (CountryService.getInstance as jest.Mock).mockReturnValue({
      getCountryFlagAndName: jest.fn((country) => `${country} Flag and Name`),
    });

    (AccessTypeService.getInstance as jest.Mock).mockReturnValue({
      formatAccess: jest.fn((access) => access),
      getBestAccess: jest.fn(() => 'visa free'),
    });
  });

  it('renders without crashing', () => {
    render(
      <AccessTable
        accessResults={mockAccessResults}
        selectedCountries={mockSelectedCountries}
        tableFilters={mockTableFilters}
      />
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders correct number of columns', () => {
    render(
      <AccessTable
        accessResults={mockAccessResults}
        selectedCountries={mockSelectedCountries}
        tableFilters={mockTableFilters}
      />
    );
    const headerCells = screen.getAllByRole('columnheader');
    // +1 for destination country, +1 for combined access
    expect(headerCells).toHaveLength(mockSelectedCountries.length + 2);
  });

  it('renders correct number of rows', () => {
    render(
      <AccessTable
        accessResults={mockAccessResults}
        selectedCountries={mockSelectedCountries}
        tableFilters={mockTableFilters}
      />
    );
    const rows = screen.getAllByRole('row');
    // +1 for header row
    expect(rows).toHaveLength(mockFilteredResults.length + 1);
  });

  it('displays correct country flags in header', () => {
    render(
      <AccessTable
        accessResults={mockAccessResults}
        selectedCountries={mockSelectedCountries}
        tableFilters={mockTableFilters}
      />
    );
    mockSelectedCountries.forEach(country => {
      expect(screen.getByText(country.flag)).toBeInTheDocument();
    });
  });

  it('displays correct access types', () => {
    render(
      <AccessTable
        accessResults={mockAccessResults}
        selectedCountries={mockSelectedCountries}
        tableFilters={mockTableFilters}
      />
    );
    const accessBadges = screen.getAllByTestId('access-type-badge');
    expect(accessBadges).toHaveLength(mockFilteredResults.length * (mockSelectedCountries.length + 1));
  });

  it('displays "No results" message when no results are available', () => {
    (PassportDataService.getInstance as jest.Mock)().filterAccessResults.mockReturnValue([]);
    render(
      <AccessTable
        accessResults={mockAccessResults}
        selectedCountries={mockSelectedCountries}
        tableFilters={mockTableFilters}
      />
    );
    expect(screen.getByText('No results for your research 😥')).toBeInTheDocument();
  });

  it('calls filterAccessResults with correct parameters', () => {
    render(
      <AccessTable
        accessResults={mockAccessResults}
        selectedCountries={mockSelectedCountries}
        tableFilters={mockTableFilters}
      />
    );
    expect(PassportDataService.getInstance(AccessTypeService.getInstance()).filterAccessResults)
      .toHaveBeenCalledWith(
        mockAccessResults,
        mockTableFilters,
        mockSelectedCountries
      );
  });
});