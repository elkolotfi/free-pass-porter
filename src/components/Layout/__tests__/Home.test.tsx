import Home from '@/components/Layout/Home';
import store from '@/context/store';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

// Mock the child components
jest.mock('@/components/Layout/Head', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-head">Mock Head Component</div>
}));

jest.mock('@/components/Misc/AccessResults', () => ({
  AccessResults: () => <div data-testid="mock-access-results">Mock Access Results Component</div>
}));

describe('Home Component', () => {
  const renderWithProvider = () => {
    return render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
  };

  it('renders without crashing', () => {
    renderWithProvider();
    expect(screen.getByTestId('mock-head')).toBeInTheDocument();
    expect(screen.getByTestId('mock-access-results')).toBeInTheDocument();
  });

  it('renders the Head component', () => {
    renderWithProvider();
    expect(screen.getByTestId('mock-head')).toBeInTheDocument();
  });

  it('renders the AccessResults component', () => {
    renderWithProvider();
    expect(screen.getByTestId('mock-access-results')).toBeInTheDocument();
  });

  it('renders components in the correct order', () => {
    renderWithProvider();
    const homeDiv = screen.getByTestId('mock-head').parentElement;
    expect(homeDiv).toBeInTheDocument();
    expect(homeDiv?.children[0]).toHaveAttribute('data-testid', 'mock-head');
    expect(homeDiv?.children[1]).toHaveAttribute('data-testid', 'mock-access-results');
  });

  it('applies the correct CSS class', () => {
    renderWithProvider();
    const homeDiv = screen.getByTestId('mock-head').parentElement;
    expect(homeDiv).toHaveClass('home');
  });
});