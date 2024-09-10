import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { toast } from 'react-toastify';


const ProductsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProductTitle = styled.h3`
  margin-top: 0;
  color: #2c3e50;
`;

const ProductInfo = styled.p`
  color: #34495e;
  margin: 0.5rem 0;
`;

const AddToCartButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

function Products({ updateCartCount }) {
    const [products, setProducts] = useState([]);
  
    useEffect(() => {
      fetchProducts();
    }, []);
  
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products. Please try again.');
      }
    };
  
    const addToCart = async (productId) => {
      try {
        await axios.post('/api/cart/add', { productId, quantity: 1 }, { withCredentials: true });
        updateCartCount(); // Update the cart count after adding an item
        toast.success('Product added to cart!');
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Failed to add product to cart. Please try again.');
      }
    };
  
  
    return (
      <div>
        <h2>Our Products</h2>
        <ProductsWrapper>
          {products.map(product => (
            <ProductCard key={product.id}>
              <ProductTitle>{product.name}</ProductTitle>
              <ProductInfo>Price: ${product.price}</ProductInfo>
              <ProductInfo>In stock: {product.inventory}</ProductInfo>
              <AddToCartButton onClick={() => addToCart(product.id)}>Add to Cart</AddToCartButton>
            </ProductCard>
          ))}
        </ProductsWrapper>
      </div>
    );
  }
  
  export default Products;