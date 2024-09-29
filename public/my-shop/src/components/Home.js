import React from 'react';
import styled from 'styled-components';
import HeroBanner from './HeroBanner';

const HomeWrapper = styled.div`
  text-align: center;
`;

const ProductFeatures = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
  padding: 1rem 0;
  background-color: #f5f5f5;
`;

const Feature = styled.span`
  font-size: 0.9rem;
  color: #2c5234;
  font-weight: 500;
`;

function Home() {
  return (
    <HomeWrapper>
      <HeroBanner />
      <ProductFeatures>
        <Feature>100% vegan</Feature>
        <Feature>Gluten-free</Feature>
        <Feature>Non GMO</Feature>
        <Feature>Full-Spectrum CBD</Feature>
        <Feature>No THC</Feature>
        <Feature>No added sugar</Feature>
        <Feature>No alcohol</Feature>
        <Feature>Locally-sourced</Feature>
      </ProductFeatures>
    </HomeWrapper>
  );
}

export default Home;