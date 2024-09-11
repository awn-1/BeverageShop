import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';

const CheckoutWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: var(--border-radius);
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: var(--border-radius);
`;

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1rem;
`;

function Checkout() {
  const { user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [sameAddress, setSameAddress] = useState(true);
  const [mailingAddress, setMailingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth0_id', user.sub)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Profile not found, using default values');
        } else {
          throw error;
        }
      }

      if (data) {
        setProfile({
          name: data.first_name + ' ' + data.last_name,
          email: data.email,
          phone: data.phone,
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zip,
          country: data.country
        });
      } else {
        // If no profile data, use user info from Auth0
        setProfile(prev => ({
          ...prev,
          name: user.name,
          email: user.email
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile. Please fill in your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleMailingAddressChange = (e) => {
    const { name, value } = e.target;
    setMailingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically process the order
    // For now, we'll just show a success message and redirect
    toast.success('Order placed successfully!');
    navigate('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <CheckoutWrapper>
      <h2>Checkout</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleInputChange}
          placeholder="Full Name"
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
          type="tel"
          name="phone"
          value={profile.phone}
          onChange={handleInputChange}
          placeholder="Phone"
          required
        />
        <h3>Shipping Address</h3>
        <Input
          type="text"
          name="street"
          value={profile.street}
          onChange={handleInputChange}
          placeholder="Street Address"
          required
        />
        <Input
          type="text"
          name="city"
          value={profile.city}
          onChange={handleInputChange}
          placeholder="City"
          required
        />
        <Input
          type="text"
          name="state"
          value={profile.state}
          onChange={handleInputChange}
          placeholder="State"
          required
        />
        <Input
          type="text"
          name="zipCode"
          value={profile.zipCode}
          onChange={handleInputChange}
          placeholder="ZIP Code"
          required
        />
        <Input
          type="text"
          name="country"
          value={profile.country}
          onChange={handleInputChange}
          placeholder="Country"
          required
        />
        <Label>
          <Checkbox
            type="checkbox"
            checked={sameAddress}
            onChange={() => setSameAddress(!sameAddress)}
          />
          Mailing address same as shipping address
        </Label>
        {!sameAddress && (
          <>
            <h3>Mailing Address</h3>
            <Input
              type="text"
              name="street"
              value={mailingAddress.street}
              onChange={handleMailingAddressChange}
              placeholder="Street Address"
              required
            />
            <Input
              type="text"
              name="city"
              value={mailingAddress.city}
              onChange={handleMailingAddressChange}
              placeholder="City"
              required
            />
            <Input
              type="text"
              name="state"
              value={mailingAddress.state}
              onChange={handleMailingAddressChange}
              placeholder="State"
              required
            />
            <Input
              type="text"
              name="zipCode"
              value={mailingAddress.zipCode}
              onChange={handleMailingAddressChange}
              placeholder="ZIP Code"
              required
            />
            <Input
              type="text"
              name="country"
              value={mailingAddress.country}
              onChange={handleMailingAddressChange}
              placeholder="Country"
              required
            />
          </>
        )}
        <h3>Shipping Method</h3>
        <Select
          value={shippingMethod}
          onChange={(e) => setShippingMethod(e.target.value)}
        >
          <option value="standard">Standard Shipping</option>
          <option value="express">Express Shipping</option>
          <option value="overnight">Overnight Shipping</option>
        </Select>
        <Button type="submit">Place Order</Button>
      </Form>
    </CheckoutWrapper>
  );
}

export default Checkout;