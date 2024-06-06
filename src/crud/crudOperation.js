import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CrudOperation = () => {
  const [customers, setCustomers] = useState([]);
  const [editCustomer, setEditCustomer] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    balance: 0
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:8181/api/customers/list');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const addOrUpdateCustomer = async formData => {
    try {
      const { username, password, fullName, email, balance } = formData;
  
      // Form validation
      if (!username || !password) {
        alert('Username and password are required!');
        return;
      }
  
      // Email validation using regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
        alert('Invalid email format!');
        return;
      }
  
      // Balance validation
      if (balance < 0) {
        alert('Balance cannot be less than 0!');
        return;
      }
  
      const data = {
        fullName,
        email,
        balance
      };
  
      if (editCustomer) {
        await axios.post(`http://localhost:8181/api/customers/updateProfile?customerId=${editCustomer.id}&fullName=${fullName}&email=${email}`, data);
        setEditCustomer(null);
      } else {
        await axios.post('http://localhost:8181/api/customers/add', formData);
      }
  
      await fetchCustomers(); // Fetch the updated list of customers after adding or updating
      clearForm();
    } catch (error) {
      console.error('Error adding/updating customer:', error);
    }
  };
  

  const clearForm = () => {
    setFormData({
      username: '',
      password: '',
      fullName: '',
      email: '',
      balance: 0
    });
  };

  const deleteCustomer = async customerId => {
    try {
      await axios.delete(`http://localhost:8181/api/customers/delete/${customerId}`);
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    addOrUpdateCustomer(formData);
  };

  const editCustomerHandler = customer => {
    setEditCustomer(customer);
    setFormData({
      username: customer.username,
      password: customer.password,
      fullName: customer.fullName,
      email: customer.email,
      balance: customer.balance
    });
  };

  return (
    <div className="container">
      <h1 className="my-4">Bank Customers</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
        </div>
        <div className="form-group">
          <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        </div>
        <div className="form-group">
          <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
        </div>
        <div className="form-group">
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        </div>
        <div className="form-group">
          <input type="number" className="form-control" name="balance" value={formData.balance} onChange={handleChange} placeholder="Balance" />
        </div>
        <button type="submit" className="btn btn-primary">{editCustomer ? 'Update' : 'Add'} Customer</button>
      </form>
      <ul className="list-group mt-4">
        {customers.map(customer => (
          <li key={customer.id} className="list-group-item">
            {customer.fullName} - {customer.email} - Balance: {customer.balance}
            <button className="btn btn-danger ml-2" onClick={() => deleteCustomer(customer.id)}>Delete</button>
            <button className="btn btn-primary ml-2" onClick={() => editCustomerHandler(customer)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrudOperation;
