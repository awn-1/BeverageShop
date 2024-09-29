import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { supabase } from '../../supabaseClient';
import { useAuth0 } from '@auth0/auth0-react';

const ProductDetailWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProductTitle = styled.h2`
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ProductInfo = styled.p`
  color: #34495e;
  margin: 0.5rem 0;
  font-size: 1.1rem;
`;

const AddToCartButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1rem;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

function ProductDetail({ updateCartCount }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  
    useEffect(() => {
      fetchProduct();
    }, [id]);
  
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
  
        if (error) throw error;
  
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    const addToCart = async () => {
      if (!isAuthenticated) {
        toast.error('Please log in to add items to your cart.');
        loginWithRedirect();
        return;
      }
  
      try {
        const { data: existingItem, error: fetchError } = await supabase
          .from('cart')
          .select('quantity')
          .eq('user_id', user.sub)
          .eq('product_id', product.id)
          .single();
  
        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }
  
        const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
  
        const { data, error } = await supabase
          .from('cart')
          .upsert({ 
            user_id: user.sub,
            product_id: product.id,
            quantity: newQuantity
          }, { 
            onConflict: 'user_id,product_id'
          });
  
        if (error) throw error;
  
        updateCartCount();
        toast.success('Product added to cart!');
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Failed to add product to cart. Please try again.');
      }
    };
  
    if (loading) {
      return <div>Loading product...</div>;
    }
  
    if (!product) {
      return <div>Product not found.</div>;
    }
  
    return (
      <ProductDetailWrapper>
        <ProductTitle>{product.name}</ProductTitle>
        <ProductInfo>Price: ${product.price.toFixed(2)}</ProductInfo>
        <ProductInfo>Description: {product.description || 'No description available.'}</ProductInfo>
        <AddToCartButton onClick={addToCart}>
          Add to Cart
        </AddToCartButton>
      </ProductDetailWrapper>
    );
  }
  
  export default ProductDetail;