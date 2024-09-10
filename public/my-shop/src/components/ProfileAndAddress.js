import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';

const ProfileWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #2980b9;
  }
`;

function ProfileAndAddress() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setProfile(prevProfile => ({
        ...prevProfile,
        address: {
          ...prevProfile.address,
          [addressField]: value
        }
      }));
    } else {
      setProfile(prevProfile => ({
        ...prevProfile,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      await axios.post(`${process.env.REACT_APP_API_URL}/api/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <ProfileWrapper>
      <h2>Profile and Address</h2>
      <ProfileForm onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
        />
        <Input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <Input
          type="text"
          name="address.street"
          value={profile.address.street}
          onChange={handleInputChange}
          placeholder="Street Address"
        />
        <Input
          type="text"
          name="address.city"
          value={profile.address.city}
          onChange={handleInputChange}
          placeholder="City"
        />
        <Input
          type="text"
          name="address.state"
          value={profile.address.state}
          onChange={handleInputChange}
          placeholder="State"
        />
        <Input
          type="text"
          name="address.zipCode"
          value={profile.address.zipCode}
          onChange={handleInputChange}
          placeholder="ZIP Code"
        />
        <Input
          type="text"
          name="address.country"
          value={profile.address.country}
          onChange={handleInputChange}
          placeholder="Country"
        />
        <Button type="submit">Update Profile</Button>
      </ProfileForm>
    </ProfileWrapper>
  );
}

export default ProfileAndAddress;