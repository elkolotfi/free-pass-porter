import { AccessSelect } from '@/components/Form/AccessSelect';
import { accessTypes } from '@/types/access-option.type';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

describe('AccessSelect Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<AccessSelect onChange={mockOnChange} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('uses custom placeholder when provided', () => {
    const placeholder = 'expected place holder';
    render(<AccessSelect onChange={mockOnChange} placeholder={placeholder} />);
    expect(screen.queryByPlaceholderText(placeholder)).toBeDefined();
  });

  it('uses default placeholder when provided', () => {
    const defaultPlaceholder = 'Filter by access level...';
    render(<AccessSelect onChange={mockOnChange} />);
    expect(screen.queryByPlaceholderText(defaultPlaceholder)).not.toBeInTheDocument();
    expect(screen.getByText(defaultPlaceholder)).toBeInTheDocument();
  });

  it('renders options correctly', () => {
    render(<AccessSelect key={0} onChange={mockOnChange} />);
    
    const selectContainer = screen.queryByTestId('select-component');

    expect(selectContainer).toBeDefined();
    expect(selectContainer).not.toBeNull();
    if(selectContainer && selectContainer.firstChild) {
      fireEvent.keyDown(selectContainer.firstChild, { key: 'ArrowDown' });
      for(const accessType of Object.keys(accessTypes)) {
        expect(screen.getByText(accessType)).toBeInTheDocument();
      }
    } else {
      fail('select container was not found or has not child');
    }
  });

  it('calls onChange when an option is selected', async () => {
    render(<AccessSelect onChange={mockOnChange} />);

    expect(mockOnChange).toHaveBeenCalledTimes(0);
    
    const selectContainer = screen.queryByTestId('select-component');

    if(selectContainer && selectContainer.firstChild) {
      fireEvent.keyDown(selectContainer.firstChild, { key: 'ArrowDown' });
      fireEvent.click(screen.getByText('visa free'));

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith([{ value: 'visa free' }]); 
    } else {
      fail('select container was not found or has not child');
    }  
  });
});
