import { render, screen } from '@testing-library/react';
import Footer from '@/components/Layout/Footer';

// Mock react-icons
jest.mock("react-icons/fa", () => ({
  FaExternalLinkAlt: () => <span data-testid="external-link-icon" />,
  FaGithub: () => <span data-testid="github-icon" />,
}));

describe('Footer', () => {
  test('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2024 Free Pass Porter\./)).toBeInTheDocument();
  });

  test('renders "Open to contribution" text with GitHub icon', () => {
    render(<Footer />);
    const contributionText = screen.getByText(/Open to contribution/);
    expect(contributionText).toBeInTheDocument();
    expect(screen.getByTestId('github-icon')).toBeInTheDocument();
  });

  test('renders "Made with ❤️ by" text with link and external link icon', () => {
    render(<Footer />);
    const madeByText = screen.getByText(/Made with ❤️ by/);
    expect(madeByText).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /elkolotfi/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/lotfi-el-korchi/');
    expect(link).toHaveAttribute('target', '_blank');

    expect(screen.getByTestId('external-link-icon')).toBeInTheDocument();
  });

  test('renders footer with correct class', () => {
    const { container } = render(<Footer />);
    expect(container.firstChild).toHaveClass('footer');
  });
});