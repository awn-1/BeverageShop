import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Home from './components/Home';
import Products from './components/Products';
import Cart from './components/Cart';
axios.defaults.withCredentials = true;

const AppWrapper = styled.div`
  font-family: 'Arial', sans-serif;
  color: #333;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Header = styled.header`
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
`;

const Nav = styled.nav`
  margin-top: 1rem;
`;

const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  gap: 1rem;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

const Main = styled.main`
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CartCount = styled.span`
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  margin-left: 0.5rem;
`;

function App() {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const response = await axios.get('/api/cart', { withCredentials: true });
      const count = response.data.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <AppWrapper>
      <Header>
        <Title>My Shop</Title>
        <Nav>
          <NavList>
            <NavItem><NavLink to="/">Home</NavLink></NavItem>
            <NavItem><NavLink to="/products">Products</NavLink></NavItem>
            <NavItem>
              <NavLink to="/cart">
                Cart <CartCount>({cartCount})</CartCount>
              </NavLink>
            </NavItem>
          </NavList>
        </Nav>
      </Header>
      <Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products updateCartCount={fetchCartCount} />} />
          <Route path="/cart" element={<Cart updateCartCount={fetchCartCount} />} />
        </Routes>
      </Main>
    </AppWrapper>
  );
}

export default App;