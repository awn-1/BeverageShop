import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';
import { FaUser, FaShoppingCart, FaInstagram, FaFacebookF, FaTwitter, FaTiktok, FaLinkedinIn, FaRss } from 'react-icons/fa';
import { supabase } from './supabaseClient';
import GlobalStyle from './GlobalStyle';
import Home from './components/Home';
import Products from './components/products/Products';
import ProductDetail from './components/products/ProductDetail';
import Checkout from './components/Checkout';
import Cart from './components/Cart';
import ProfileAndAddress from './components/ProfileAndAddress';
import OrderManagement from './components/OrderManagement';

const AppWrapper = styled.div`
  font-family: 'Arial', sans-serif;
  color: #333;
`;

const Header = styled.header`
  background-color: #ffffff;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 2rem;
  color: #2c3e50;
`;

const Nav = styled.nav`
  margin-top: 1rem;
  width: 100%;
`;

const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  gap: 2rem;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLink = styled(Link)`
  color: #2c3e50;
  text-decoration: none;
  font-weight: bold;
  text-transform: uppercase;
  &:hover {
    text-decoration: underline;
  }
`;

const UserSection = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SocialSection = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const SocialIcon = styled.a`
  color: #2c3e50;
  font-size: 1.2rem;
  &:hover {
    color: #3498db;
  }
`;

const CartLink = styled(Link)`
  display: flex;
  align-items: center;
  color: #2c3e50;
  text-decoration: none;
  font-weight: bold;
`;

const CartCount = styled.span`
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  margin-left: 0.5rem;
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const UserMenuWrapper = styled.div`
  position: relative;
`;

const UserIcon = styled(FaUser)`
  cursor: pointer;
  font-size: 1.5rem;
  color: #2c3e50;
`;

const UserMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.5rem;
  z-index: 1000;
  min-width: 150px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const UserMenuItem = styled.div`
  padding: 0.5rem;
  cursor: pointer;
  color: #2c3e50;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const AuthButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #2980b9;
  }
`;

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCartCount();
    }
  }, [isAuthenticated, user]);

  const fetchCartCount = async () => {
    if (isAuthenticated && user) {
      try {
        const { data, error } = await supabase
          .from('cart')
          .select('quantity', { count: 'exact' })
          .eq('user_id', user.sub);

        if (error) throw error;

        const totalCount = data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalCount);
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    }
  };

  const handleAuth = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      loginWithRedirect();
    }
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
    setShowUserMenu(false);
    setCartCount(0);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowUserMenu(false);
  };

  const handleOrdersClick = () => {
    navigate('/orders');
    setShowUserMenu(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <GlobalStyle />
      <AppWrapper>
        <Header>
          <SocialSection>
            <SocialIcon href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></SocialIcon>
            <SocialIcon href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></SocialIcon>
            <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></SocialIcon>
            <SocialIcon href="https://tiktok.com" target="_blank" rel="noopener noreferrer"><FaTiktok /></SocialIcon>
            <SocialIcon href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></SocialIcon>
            <SocialIcon href="/rss" target="_blank" rel="noopener noreferrer"><FaRss /></SocialIcon>
          </SocialSection>
          <Logo>My Shop</Logo>
          <Nav>
            <NavList>
              <NavItem><NavLink to="/">Home</NavLink></NavItem>
              <NavItem><NavLink to="/products">Products</NavLink></NavItem>
              <NavItem><NavLink to="/learn">Learn</NavLink></NavItem>
              <NavItem><NavLink to="/mixology">Mixology</NavLink></NavItem>
            </NavList>
          </Nav>
          <UserSection>
            <CartLink to="/cart">
              <FaShoppingCart /> Cart <CartCount>({cartCount})</CartCount>
            </CartLink>
            {isAuthenticated ? (
              <UserMenuWrapper>
                <UserIcon onClick={handleAuth} />
                {showUserMenu && (
                  <UserMenu>
                    <UserMenuItem>Welcome, {user.name}</UserMenuItem>
                    <UserMenuItem onClick={handleOrdersClick}>Orders</UserMenuItem>
                    <UserMenuItem onClick={handleProfileClick}>Profile & Address</UserMenuItem>
                    <UserMenuItem onClick={handleLogout}>Logout</UserMenuItem>
                  </UserMenu>
                )}
              </UserMenuWrapper>
            ) : (
              <AuthButton onClick={() => loginWithRedirect()}>Login</AuthButton>
            )}
          </UserSection>
        </Header>
        <Main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products updateCartCount={fetchCartCount} />} />
            <Route path="/product/:id" element={<ProductDetail updateCartCount={fetchCartCount} />} />
            <Route path="/cart" element={<Cart updateCartCount={fetchCartCount} />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<ProfileAndAddress />} />
            <Route path="/orders" element={<OrderManagement />} />
          </Routes>
        </Main>
      </AppWrapper>
    </>
  );
}

export default App;