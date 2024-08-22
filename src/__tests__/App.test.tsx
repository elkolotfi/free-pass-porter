import { render, screen } from '@testing-library/react';
import App from '@/App';

jest.mock('@/components/Layout/Footer', () => ({
  __esModule: true,
  default: () => (<div>Footer Component</div>)
}));
jest.mock('@/components/Layout/Home', () => ({
  __esModule: true,
  default: () => (<div>Home Component</div>)
}));

describe('App', () => {
  it('renders Home and Footer components', () => {

    render(<App />); 

    // Check if Footer component is rendered
    const footerElement = screen.getByText(/Footer Component/i);
    expect(footerElement).toBeDefined();

    // Check if Home component is rendered
    const homeElement = screen.getByText(/Home Component/i);
    expect(homeElement).toBeDefined();
  });
});