import { mockAccessSelect, mockCountrySelect } from '@/__mocks__/components.mock';
import { COUNTRY_OPTION_UK, COUNTRY_OPTION_US } from '@/__mocks__/countries.mock';
import AccessFilter from '@/components/Misc/AccessFilter';
import { CountryOption } from '@/types/country-option.type';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// Mock the child components
jest.mock('@/components/Form/CountrySelect', () => ({
  __esModule: true,
  default: mockCountrySelect,
}));

jest.mock('@/components/Form/AccessSelect', () => ({
  __esModule: true,
  AccessSelect: mockAccessSelect
  }));

describe('AccessFilter Component', () => {
  const mockGetTableFilters = jest.fn();
  const mockSelectedCountries: CountryOption[] = [ COUNTRY_OPTION_US, COUNTRY_OPTION_UK ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<AccessFilter selectedCountries={[]} getTableFilters={mockGetTableFilters} />);
    expect(screen.getByText('Destination countries')).toBeInTheDocument();
  });

  it('renders country select', () => {
    render(<AccessFilter selectedCountries={[]} getTableFilters={mockGetTableFilters} />);
    expect(screen.getByTestId('country-select')).toBeInTheDocument();
  });

  it('renders access selects for each selected country', () => {
    render(<AccessFilter selectedCountries={mockSelectedCountries} getTableFilters={mockGetTableFilters} />);
    expect(screen.getAllByTestId('access-select')).toHaveLength(2);
  });

  it('calls getTableFilters when country is selected', async () => {
    render(<AccessFilter selectedCountries={[]} getTableFilters={mockGetTableFilters} />);
    const countrySelect = screen.getByTestId('country-select');
    fireEvent.change(countrySelect, { target: { value: 'US' } });

    await waitFor(() => {
      expect(mockGetTableFilters).toHaveBeenCalledWith(expect.objectContaining({
        countries: [expect.objectContaining({ value: 'US' })],
      }));
    });
  });

  it('calls getTableFilters when access type is selected', async () => {
    render(<AccessFilter selectedCountries={mockSelectedCountries} getTableFilters={mockGetTableFilters} />);
    const accessSelects = screen.getAllByTestId('access-select');
    fireEvent.change(accessSelects[0], { target: { value: 'visa free' } });

    await waitFor(() => {
      expect(mockGetTableFilters).toHaveBeenCalledWith(expect.objectContaining({
        accessFilters: expect.objectContaining({
          US: [expect.objectContaining({ value: 'visa free' })],
        }),
      }));
    });
  });

  it('resets filters when reset button is clicked', async () => {
    render(<AccessFilter selectedCountries={mockSelectedCountries} getTableFilters={mockGetTableFilters} />);
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(mockGetTableFilters).toHaveBeenCalledWith({
        countries: [],
        accessFilters: {},
      });
    });
  });
});