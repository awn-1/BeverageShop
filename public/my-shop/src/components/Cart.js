import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { supabase } from '../supabaseClient';
import { useAuth0 } from '@auth0/auth0-react';

const CartWrapper = styled.div`
  background-color: #fff;
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
  flex-grow: 1;
`;

const ProductLink = styled(Link)`
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
  
  &:hover {
    text-decoration: underline;
  }
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

function Cart({ updateCartCount }) {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth0();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data, error } = await supabase
        .from('cart')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', user.sub);

      if (error) throw error;

      setCartItems(data);
      updateCartCount();
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart. Please try again.');
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      if (quantity > 0) {
        const { error } = await supabase
          .from('cart')
          .upsert({ 
            user_id: user.sub,
            product_id: productId,
            quantity: quantity
          }, { onConflict: 'user_id,product_id' });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart')
          .delete()
          .match({ user_id: user.sub, product_id: productId });

        if (error) throw error;
      }

      await fetchCart();
      toast.success('Cart updated successfully!');
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart. Please try again.');
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0);

  return (
    <CartWrapper>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map(item => (
            <CartItem key={item.product_id}>
              <ItemInfo>
                <ProductLink to={`/product/${item.product_id}`}>
                  {item.products.name}
                </ProductLink>
                {' - $'}
                {item.products.price.toFixed(2)} each
              </ItemInfo>
              <div>
                <QuantityInput
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateCartItem(item.product_id, parseInt(e.target.value))}
                  min="0"
                />
                <RemoveButton onClick={() => updateCartItem(item.product_id, 0)}>Remove</RemoveButton>
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