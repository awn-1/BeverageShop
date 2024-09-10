import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { supabase } from '../supabaseClient';
import { useAuth0 } from '@auth0/auth0-react';

const ProductsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
`;

const ProductCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ProductTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.2rem;
`;

const ProductInfo = styled.p`
  color: #34495e;
  margin: 0.5rem 0;
  font-size: 1rem;
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

const PageTitle = styled.h2`
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

function Products({ updateCartCount }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAccessTokenSilently } = useAuth0();

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
    try {
      const token = await getAccessTokenSilently();
      const { data, error } = await supabase
        .from('cart')
        .upsert({ 
          user_id: token,
          product_id: productId,
          quantity: 1
        }, { onConflict: 'user_id,product_id' });

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
    <div>
      <PageTitle>Our Products</PageTitle>
      <ProductsWrapper>
        {products.map(product => (
          <ProductCard key={product.id}>
            <div>
              <ProductTitle>{product.name}</ProductTitle>
              <ProductInfo>Price: ${product.price.toFixed(2)}</ProductInfo>
              <ProductInfo>In stock: {product.inventory}</ProductInfo>
            </div>
            <AddToCartButton 
              onClick={() => addToCart(product.id)}
              disabled={product.inventory === 0}
            >
              {product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
            </AddToCartButton>
          </ProductCard>
        ))}
      </ProductsWrapper>
    </div>
  );
}

export default Products;