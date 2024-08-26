import AccessTypeShow from '@/components/Misc/AccessTypeShow';
import { accessTypes } from '@/types/access-option.type';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('AccessTypeShow Component', () => {
  it('renders without crashing', () => {
    render(<AccessTypeShow access="visa free" />);
    expect(screen.getByText('visa free')).toBeInTheDocument();
  });

  it('displays the correct access type text', () => {
    const accessType = 'visa required';
    render(<AccessTypeShow access={accessType} />);
    expect(screen.getByText(accessType)).toBeInTheDocument();
  });

  it('applies the correct background color for known access types', () => {
    const accessType = 'visa free';
    render(<AccessTypeShow access={accessType} />);
    const element = screen.getByText(accessType);
    expect(element).toHaveStyle(`background-color: ${accessTypes[accessType]}`);
  });

  it('applies default background color for unknown access types', () => {
    const accessType = 'unknown type';
    render(<AccessTypeShow access={accessType} />);
    const element = screen.getByText(accessType);
    expect(element).toHaveStyle('background-color: #9E9E9E');
  });

  it('handles access types with additional information in parentheses', () => {
    const accessType = 'visa free (ETA)';
    render(<AccessTypeShow access={accessType} />);
    const element = screen.getByText(accessType);
    expect(element).toHaveStyle(`background-color: ${accessTypes['visa free']}`);
  });

  it('applies correct styles to the container', () => {
    render(<AccessTypeShow access="visa free" />);
    const element = screen.getByText('visa free');
    expect(element).toHaveStyle({
      color: '#FFF',
      display: 'block',
      padding: '4px',
    });
  });
});