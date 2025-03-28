import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the search button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/search/i);
  expect(buttonElement).toBeInTheDocument();
});

test('renders the My Profile button', () => {
  render(<App />);
  const profileButton = screen.getByText(/my profile/i);
  expect(profileButton).toBeInTheDocument();
});

test('renders the Login button', () => {
  render(<App />);
  const loginButton = screen.getByText(/login/i);
  expect(loginButton).toBeInTheDocument();
});
