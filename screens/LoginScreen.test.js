// __tests__/LoginScreen.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';

test('renders login screen correctly', () => {
  const { getByPlaceholderText, getByText } = render(<LoginScreen />);
  const emailInput = getByPlaceholderText('Email');
  const passwordInput = getByPlaceholderText('Password');
  const loginButton = getByText('Login');

  expect(emailInput).toBeTruthy();
  expect(passwordInput).toBeTruthy();
  expect(loginButton).toBeTruthy();
});

test('handles login correctly', () => {
  const { getByPlaceholderText, getByText } = render(<LoginScreen />);
  const emailInput = getByPlaceholderText('Email');
  const passwordInput = getByPlaceholderText('Password');
  const loginButton = getByText('Login');

  fireEvent.changeText(emailInput, 'test@example.com');
  fireEvent.changeText(passwordInput, 'password');
  fireEvent.press(loginButton);

  // Add assertions to check if the login action is performed correctly
});