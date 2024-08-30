import CountrySelect from '@/components/Form/CountrySelect';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

describe('CountrySelect Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<CountrySelect onChange={mockOnChange} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('uses custom placeholder when provided', () => {
    const placeholder = 'Custom placeholder';
    render(<CountrySelect onChange={mockOnChange} placeholder={placeholder} />);
    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });

  it('uses default placeholder when not provided', () => {
    const defaultPlaceholder = 'Select the countries of your passports...';
    render(<CountrySelect onChange={mockOnChange} />);
    expect(screen.getByText(defaultPlaceholder)).toBeInTheDocument();
  });

  it('renders options correctly', () => {
    render(<CountrySelect onChange={mockOnChange} />);
    
    expect(mockOnChange).toHaveBeenCalledTimes(0);

    const selectContainer = screen.getByTestId('country-select');
    expect(selectContainer).toBeInTheDocument();

    fireEvent.keyDown(selectContainer.firstChild as Element, { key: 'ArrowDown' });
    
    // Check for a few example countries
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
  });

  it('calls onChange when an option is selected', () => {
    render(<CountrySelect onChange={mockOnChange} />);

    expect(mockOnChange).toHaveBeenCalledTimes(0);

    const selectContainer = screen.getByTestId('country-select');
    fireEvent.keyDown(selectContainer.firstChild as Element, { key: 'ArrowDown' });
    fireEvent.click(screen.getByText('United States'));

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith([expect.objectContaining({ label: 'United States' })]);
  });

  it('clears selection when reload prop changes', () => {
    let reload = 0;
    const { rerender } = render(<CountrySelect key={reload} onChange={mockOnChange} />);
    
    const selectContainer = screen.getByTestId('country-select');
    fireEvent.keyDown(selectContainer.firstChild as Element, { key: 'ArrowDown' });
    
    expect(screen.getByText('United States')).toBeInTheDocument();

    fireEvent.click(screen.getByText('United States'));
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith([expect.objectContaining({ label: 'United States' })]);

    reload = 1;
    rerender(<CountrySelect key={reload} onChange={mockOnChange} />);

    
    expect(screen.queryByText('United States')).toBeNull();
  });
});