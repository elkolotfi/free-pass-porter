import { COUNTRY_OPTION_US } from '@/__mocks__/countries.mock';
import { setSelectedCountries, setTableFilters } from '@/context/slices/search.slice';
import store from '@/context/store';
import { AccessTypeService } from '@/services/access-type.service';
import { PassportDataService } from '@/services/passport-data.service';
import { PassportData } from '@/types/types';
import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { AccessResults } from '@/components/Misc/AccessResults';

// Mock the AccessTable component
jest.mock('@/components/Misc/AccessTable', () => ({
  AccessTable: () => <div data-testid="mock-access-table">Mock Access Table</div>
}));

// Create a mock PassportData
const mockPassportData: PassportData = {
  US: { UK: 'visa free', CA: 'visa required' },
  UK: { US: 'visa free', CA: 'visa free' },
};

describe('AccessResults Component', () => {
  let passportDataServiceInstance: PassportDataService;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create real instances of services
    const accessTypeService = AccessTypeService.getInstance();
    passportDataServiceInstance = PassportDataService.getInstance(accessTypeService);

    // Spy on the methods we want to track
    jest.spyOn(passportDataServiceInstance, 'getPassportData').mockResolvedValue(mockPassportData);
    jest.spyOn(passportDataServiceInstance, 'getCountryAccessTypes');
    jest.spyOn(passportDataServiceInstance, 'filterAccessResults');

    // Reset the store
    store.dispatch(setSelectedCountries([]));
    store.dispatch(setTableFilters({ countries: [], accessFilters: {} }));
  });

  it('renders nothing when no countries are selected', async () => {
    render(
      <Provider store={store}>
        <AccessResults />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('mock-access-table')).not.toBeInTheDocument();
    });
  });

  it('renders AccessTable when countries are selected', async () => {
    store.dispatch(setSelectedCountries([
      { value: 'US', label: 'United States', flag: '🇺🇸' },
      { value: 'UK', label: 'United Kingdom', flag: '🇬🇧' },
    ]));

    render(
      <Provider store={store}>
        <AccessResults />
      </Provider> 
    );

    await waitFor(() => {
      expect(screen.getByTestId('mock-access-table')).toBeInTheDocument();
    });
  });

  it('calls getPassportData on mount', async () => {
    render(
      <Provider store={store}>
        <AccessResults />
      </Provider>
    );

    await waitFor(() => {
      expect(passportDataServiceInstance.getPassportData).toHaveBeenCalled();
    });
  });

  it('calls getCountryAccessTypes and filterAccessResults when countries are selected', async () => {
    store.dispatch(setSelectedCountries([
      { value: 'US', label: 'United States', flag: '🇺🇸' },
      { value: 'UK', label: 'United Kingdom', flag: '🇬🇧' },
    ]));

    render(
      <Provider store={store}>
        <AccessResults />
      </Provider>
    );

    await waitFor(() => {
      expect(passportDataServiceInstance.getCountryAccessTypes).toHaveBeenCalled();
      expect(passportDataServiceInstance.filterAccessResults).toHaveBeenCalled();
    });
  });

  it('updates when tableFilters change', async () => {
    store.dispatch(setSelectedCountries([
      { value: 'US', label: 'United States', flag: '🇺🇸' },
      { value: 'UK', label: 'United Kingdom', flag: '🇬🇧' },
    ]));

    const { rerender } = render(
      <Provider store={store}>
        <AccessResults />
      </Provider>
    );

    await waitFor(() => {
      expect(passportDataServiceInstance.filterAccessResults).toHaveBeenCalledTimes(1);
    });

    act(() => store.dispatch(setTableFilters({
      countries: [COUNTRY_OPTION_US],
      accessFilters: { US: [{ value: 'visa free' }] }
    })));

    rerender(
      <Provider store={store}>
        <AccessResults />
      </Provider>
    );

    await waitFor(() => {
      expect(passportDataServiceInstance.filterAccessResults).toHaveBeenCalledTimes(2);
    });
  });
});