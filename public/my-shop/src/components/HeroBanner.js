import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const HeroWrapper = styled.div`
  background-color: #2c5234;
  color: #e8f3e0;
  padding: 4rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const HeroContent = styled.div`
  flex: 1;
  max-width: 50%;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 2rem;
  font-weight: 300;
  line-height: 1.2;
  color: #e8f3e0;
`;

const HeroButton = styled.button`
  background-color: #e8f3e0;
  color: #2c5234;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
  &:hover {
    background-color: #d1e8c4;
  }
`;

const ProductImagesWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ProductImage = styled.img`
  max-width: 45%;
  height: auto;
  object-fit: cover;
  transform: rotate(-5deg);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;

  &:nth-child(2) {
    transform: rotate(5deg);
  }

  &:hover {
    transform: rotate(0) scale(1.05);
  }
`;

function HeroBanner() {
  const navigate = useNavigate();

  const handleShopClick = () => {
    navigate('/products');
  };

  return (
    <HeroWrapper>
      <HeroContent>
        <HeroTitle>CBD Mocktails</HeroTitle>
        <HeroButton onClick={handleShopClick}>SHOP CBD DRINKS</HeroButton>
      </HeroContent>
      <ProductImagesWrapper>
        <ProductImage src="/images/product-razzy-limp.jpg" alt="Razzy Limp Shimmer Soda" />
        <ProductImage src="/images/product-mint-hemp.jpg" alt="Mint Hemp Shimmer Soda" />
      </ProductImagesWrapper>
    </HeroWrapper>
  );
}

export default HeroBanner;