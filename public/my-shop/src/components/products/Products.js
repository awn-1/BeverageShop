import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { supabase } from '../../supabaseClient';
import { useAuth0 } from '@auth0/auth0-react';

const ProductsWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 1rem;
`;

const ProductName = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  color: #2c5234;
`;

const ProductPrice = styled.p`
  margin: 0 0 1rem;
  font-weight: bold;
  color: #2c5234;
`;

const AddToCartButton = styled.button`
  background-color: #2c5234;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1e3a24;
  }
`;

const PageTitle = styled.h2`
  color: #2c5234;
  text-align: center;
  margin-bottom: 2rem;
`;

function Products({ updateCartCount }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id');

      if (error) throw error;

      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
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
        .eq('product_id', productId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

      const { data, error } = await supabase
        .from('cart')
        .upsert({ 
          user_id: user.sub,
          product_id: productId,
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
    return <PageTitle>Loading products...</PageTitle>;
  }

  return (
    <ProductsWrapper>
      <PageTitle>Our Products</PageTitle>
      <ProductGrid>
        {products.map(product => (
          <ProductCard key={product.id}>
            <ProductImage src={`/images/${product.image}`} alt={product.name} />
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
              <AddToCartButton onClick={() => addToCart(product.id)}>
                Add to Cart
              </AddToCartButton>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>
    </ProductsWrapper>
  );
}

export default Products;