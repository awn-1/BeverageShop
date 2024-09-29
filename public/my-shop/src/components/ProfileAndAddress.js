import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';

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

const Message = styled.div`
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
  background-color: ${props => props.isError ? '#f8d7da' : '#d4edda'};
  color: ${props => props.isError ? '#721c24' : '#155724'};
`;

function ProfileAndAddress() {
    const { user } = useAuth0();
    const [profile, setProfile] = useState({
      auth0_id: '',
      first_name: '',
      last_name: '',
      email: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      phone: ''
    });
    const [message, setMessage] = useState({ text: '', isError: false });
  
    useEffect(() => {
      if (user) {
        fetchProfile();
      }
    }, [user]);
  
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth0_id', user.sub)
          .single();
  
        if (error) {
          if (error.code === 'PGRST116') {
            console.log('Profile not found, will create a new one');
            setProfile(prev => ({ ...prev, auth0_id: user.sub, email: user.email }));
          } else {
            throw error;
          }
        } else if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage({ text: `Failed to fetch profile: ${error.message}`, isError: true });
      }
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setProfile(prevProfile => ({
        ...prevProfile,
        [name]: value
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const { data, error } = await supabase
          .from('profiles')
          .upsert({
            auth0_id: user.sub,
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: profile.email,
            street: profile.street,
            city: profile.city,
            state: profile.state,
            zip: profile.zip,
            phone: profile.phone,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'auth0_id'
          });
  
        if (error) throw error;
  
        console.log('Profile updated successfully:', data);
        setMessage({ text: 'Profile updated successfully!', isError: false });
      } catch (error) {
        console.error('Error updating profile:', error);
        setMessage({ text: `Failed to update profile: ${error.message}`, isError: true });
      }
    };

  return (
    <ProfileWrapper>
      <h2>Profile and Address</h2>
      <ProfileForm onSubmit={handleSubmit}>
        <Input
          type="text"
          name="first_name"
          value={profile.first_name}
          onChange={handleInputChange}
          placeholder="First Name"
          required
        />
        <Input
          type="text"
          name="last_name"
          value={profile.last_name}
          onChange={handleInputChange}
          placeholder="Last Name"
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
          name="street"
          value={profile.street}
          onChange={handleInputChange}
          placeholder="Street Address"
        />
        <Input
          type="text"
          name="city"
          value={profile.city}
          onChange={handleInputChange}
          placeholder="City"
        />
        <Input
          type="text"
          name="state"
          value={profile.state}
          onChange={handleInputChange}
          placeholder="State"
        />
        <Input
          type="text"
          name="zip"
          value={profile.zip}
          onChange={handleInputChange}
          placeholder="ZIP Code"
        />
        <Input
          type="tel"
          name="phone"
          value={profile.phone}
          onChange={handleInputChange}
          placeholder="Phone Number"
        />
        <Button type="submit">Update Profile</Button>
      </ProfileForm>
      {message.text && (
        <Message isError={message.isError}>{message.text}</Message>
      )}
    </ProfileWrapper>
  );
}

export default ProfileAndAddress;