import React from 'react';
import styled from 'styled-components';

const HomeWrapper = styled.div`
  text-align: center;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

function Home() {
  return (
    <HomeWrapper>
      <Title>Welcome to My Shop</Title>
      <Description>
        Discover our amazing products and enjoy a seamless shopping experience. 
        Browse our collection and find exactly what you're looking for!
      </Description>
    </HomeWrapper>
  );
}

export default Home;