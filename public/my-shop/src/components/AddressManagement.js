import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';

const AddressForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
`;

const AddressList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const AddressItem = styled.li`
  background-color: #f0f0f0;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
`;

function AddressManagement() {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/address`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      await axios.post(`${process.env.REACT_APP_API_URL}/api/address`, newAddress, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAddresses();
      setNewAddress({ street: '', city: '', state: '', zipCode: '', country: '' });
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  return (
    <div>
      <h2>Address Management</h2>
      <AddressForm onSubmit={handleSubmit}>
        <Input
          type="text"
          name="street"
          value={newAddress.street}
          onChange={handleInputChange}
          placeholder="Street"
          required
        />
        <Input
          type="text"
          name="city"
          value={newAddress.city}
          onChange={handleInputChange}
          placeholder="City"
          required
        />
        <Input
          type="text"
          name="state"
          value={newAddress.state}
          onChange={handleInputChange}
          placeholder="State"
          required
        />
        <Input
          type="text"
          name="zipCode"
          value={newAddress.zipCode}
          onChange={handleInputChange}
          placeholder="Zip Code"
          required
        />
        <Input
          type="text"
          name="country"
          value={newAddress.country}
          onChange={handleInputChange}
          placeholder="Country"
          required
        />
        <Button type="submit">Add Address</Button>
      </AddressForm>
      <h3>Your Addresses</h3>
      <AddressList>
        {addresses.map((address, index) => (
          <AddressItem key={index}>
            {address.street}, {address.city}, {address.state} {address.zipCode}, {address.country}
          </AddressItem>
        ))}
      </AddressList>
    </div>
  );
}

export default AddressManagement;