import { mockAccessTable } from '@/__mocks__/components.mock';
import { COUNTRY_OPTION_CA, COUNTRY_OPTION_UK, COUNTRY_OPTION_US } from '@/__mocks__/countries.mock';
import { TableFilters } from '@/components/Misc/AccessFilter';
import { AccessResults, AccessResultsType } from '@/components/Misc/AccessResults';
import { CountryOption } from '@/types/country-option.type';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// Mock the AccessTable component
jest.mock('@/components/Misc/AccessTable', () => ({
  AccessTable: jest.fn(mockAccessTable)
}));

describe('AccessResults Component', () => {
  const mockAccessResults: AccessResultsType = {
    US: { UK: 'visa free', CA: 'visa required' },
    UK: { US: 'visa free', CA: 'visa free' },
  };

  const mockSelectedCountries: CountryOption[] = [ COUNTRY_OPTION_US, COUNTRY_OPTION_UK ];

  const mockTableFilters: TableFilters = {
    countries: [COUNTRY_OPTION_CA],
    accessFilters: { US: [{ value: 'visa free' }] }
  };

  it('renders without crashing', () => {
    render(
      <AccessResults
        accessResults={mockAccessResults}
        selectedCountries={mockSelectedCountries}
        tableFilters={mockTableFilters}
      />
    );
    expect(screen.getByTestId('mock-access-table')).toBeInTheDocument();
  });

  it('renders the AccessTable component with correct props', () => {
    const { AccessTable } = require('@/components/Misc/AccessTable');
    render(
      <AccessResults
        accessResults={mockAccessResults}
        selectedCountries={mockSelectedCountries}
        tableFilters={mockTableFilters}
      />
    );
    expect(AccessTable).toHaveBeenCalledWith(
      {
        accessResults: mockAccessResults,
        selectedCountries: mockSelectedCountries,
        tableFilters: mockTableFilters
      },
      expect.anything()
    );
  });

  it('renders within a results container', () => {
    render(
      <AccessResults
        accessResults={mockAccessResults}
        selectedCountries={mockSelectedCountries}
        tableFilters={mockTableFilters}
      />
    );
    expect(screen.getByTestId('mock-access-table').closest('.results-container')).toBeInTheDocument();
  });

  it('renders within a table wrapper', () => {
    render(
      <AccessResults
        accessResults={mockAccessResults}
        selectedCountries={mockSelectedCountries}
        tableFilters={mockTableFilters}
      />
    );
    expect(screen.getByTestId('mock-access-table').closest('.table-wrapper')).toBeInTheDocument();
  });
});