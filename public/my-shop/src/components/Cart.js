import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { toast } from 'react-toastify';

const CartWrapper = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #ecf0f1;
`;

const ItemInfo = styled.span`
  color: #2c3e50;
`;

const QuantityInput = styled.input`
  width: 50px;
  padding: 0.5rem;
  margin-right: 1rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
`;

const RemoveButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c0392b;
  }
`;

const TotalPrice = styled.h3`
  text-align: right;
  color: #2c3e50;
  margin-top: 2rem;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${rotate} 1s linear infinite;
  margin: 2rem auto;
`;

const ErrorMessage = styled.div`
  background-color: #e74c3c;
  color: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
`;


function Cart({ updateCart }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3001/api/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart. Please try again later.');
      toast.error('Failed to load cart. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      setLoading(true);
      await axios.post('http://localhost:3001/api/cart/update', { productId, quantity });
      await fetchCart();
      updateCart();
      toast.success('Cart updated successfully!');
    } catch (error) {
      console.error('Error updating cart:', error);
      setError('Failed to update cart. Please try again.');
      toast.error('Failed to update cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartWrapper>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map(item => (
            <CartItem key={item.productId}>
              <ItemInfo>{item.name} - ${item.price} each</ItemInfo>
              <div>
                <QuantityInput
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateCartItem(item.productId, parseInt(e.target.value))}
                  min="0"
                />
                <RemoveButton onClick={() => updateCartItem(item.productId, 0)}>Remove</RemoveButton>
              </div>
            </CartItem>
          ))}
          <TotalPrice>Total: ${total.toFixed(2)}</TotalPrice>
        </>
      )}
    </CartWrapper>
  );
}

export default Cart;

