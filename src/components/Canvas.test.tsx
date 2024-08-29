import React from 'react';
import { render, screen } from '@testing-library/react';
import Canvas from './Canvas';

// Mock the image to prevent actual loading during tests
jest.mock('../assets/beachImage.jpg', () => 'mocked-image-path');
jest.mock('../assets/color_dropper.svg', () => 'mocked-color_dropperimage-path');

describe('Canvas Component', () => {
  it('renders the canvas without crashing', () => {
    render(<Canvas />);
    const canvasElement = screen.getByRole('img');
    expect(canvasElement).toBeInTheDocument();
  });
});
