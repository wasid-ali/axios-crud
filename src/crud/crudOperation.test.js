import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import CrudOperation from './crudOperation';

jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  }));
  

describe('CrudOperation Component', () => {
  describe('Rendering the component', () => {
    test('renders the component with initial state', async () => {
      const { getByText, getByPlaceholderText } = render(<CrudOperation />);
      
      // Check if key elements are present
      expect(getByText('Bank Customers')).toBeInTheDocument();
      expect(getByPlaceholderText('Username')).toBeInTheDocument();
      expect(getByPlaceholderText('Password')).toBeInTheDocument();
      expect(getByPlaceholderText('Full Name')).toBeInTheDocument();
      expect(getByPlaceholderText('Email')).toBeInTheDocument();
      expect(getByPlaceholderText('Balance')).toBeInTheDocument();
      expect(getByText('Add Customer')).toBeInTheDocument();
    });
  });

  describe('Adding a new customer', () => {
    test('adds a new customer and fetches the updated list', async () => {
      const { getByText, getByPlaceholderText } = render(<CrudOperation />);
      
      // Simulate user input
      fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testuser' } });
      fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'testpassword' } });
      fireEvent.change(getByPlaceholderText('Full Name'), { target: { value: 'Test User' } });
      fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.change(getByPlaceholderText('Balance'), { target: { value: 100 } });
      
      // Mock the API response
      axios.post.mockResolvedValueOnce({});
      axios.get.mockResolvedValueOnce({ data: [{ id: 1, fullName: 'Test User', email: 'test@example.com', balance: 100 }] });
      
      // Simulate form submission
      fireEvent.click(getByText('Add Customer'));
      
      // Wait for the asynchronous operations to complete
      await waitFor(() => {
        // Verify that the API was called with the correct data
        expect(axios.post).toHaveBeenCalledWith('http://localhost:8181/api/customers/add', {
  username: 'testuser',
  password: 'testpassword',
  fullName: 'Test User',
  email: 'test@example.com',
  balance: '100', // Ensure balance is sent as a string or a number
});

        
        //Verify that the list was updated
        expect(getByText('Test User - test@example.com - Balance: 100')).toBeInTheDocument();
      });
    });
  });
});

