import { render } from '@testing-library/react';
import { StrictMode } from 'react';
import React from 'react';

// Mock the createRoot function
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}));

// Mock the App component
jest.mock('@/App', () => ({
  __esModule: true,
  default: () => (<div data-testid="mock-app">App Component</div>)
}));

describe('main.tsx', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create a mock root element
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
  });

  afterEach(() => {
    // Clean up the mock root element
    document.body.innerHTML = '';
  });

  test('renders App component wrapped in StrictMode', () => {
    // Import the main module to trigger the rendering
    require('@/main');

    // Get the mock createRoot function
    const { createRoot } = require('react-dom/client');

    // Check if createRoot was called with the correct element
    expect(createRoot).toHaveBeenCalledWith(document.getElementById('root'));

    // Get the render function from the returned object of createRoot
    const renderMock = (createRoot as jest.Mock).mock.results[0].value.render;

    // Check if render was called
    expect(renderMock).toHaveBeenCalled();

    // Get the rendered element
    const renderedElement = renderMock.mock.calls[0][0];

    // Check if the rendered content is wrapped in StrictMode and contains the App component
    expect(renderedElement.type).toBe(StrictMode);
    expect(renderedElement.props.children.type.name).toBe('_default');  // This checks for the mocked App component
  });

  test('imports and uses index.css', () => {
    jest.mock('@/index.css', () => ({}), { virtual: true });
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Import the main module
    require('@/main');

    // Check if index.css was imported (it should not throw an error)
    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });
});