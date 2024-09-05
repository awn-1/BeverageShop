import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './components/Home';
import Products from './components/Products';
import Cart from './components/Cart';
import { FaUser } from 'react-icons/fa';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

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
  align-items: center;
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

const AuthButton = styled.button`
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

const UserMenuWrapper = styled.div`
  position: relative;
`;

const UserIcon = styled(FaUser)`
  cursor: pointer;
  font-size: 1.5rem;
`;

const UserMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  z-index: 1000;
`;

const UserMenuItem = styled.div`
  padding: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

function App() {
    const [cartCount, setCartCount] = useState(0);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { isAuthenticated, loginWithRedirect, logout, user, isLoading, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
  
    useEffect(() => {
      console.log('Auth0 state:', { isAuthenticated, isLoading, user });
    }, [isAuthenticated, isLoading, user]);
  
    const fetchCartCount = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          console.log('Access token obtained:', token);
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const count = response.data.reduce((total, item) => total + item.quantity, 0);
          setCartCount(count);
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      }
    };
  
    useEffect(() => {
      if (isAuthenticated) {
        fetchCartCount();
      }
    }, [isAuthenticated]);
  
    const handleAuth = () => {
      if (isAuthenticated) {
        setShowUserMenu(!showUserMenu);
      } else {
        console.log('Initiating login...');
        loginWithRedirect();
      }
    };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
    setShowUserMenu(false);
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
            <NavItem>
              {isAuthenticated ? (
                <UserMenuWrapper>
                  <UserIcon onClick={handleAuth} />
                  {showUserMenu && (
                    <UserMenu>
                      <UserMenuItem>Welcome, {user.name}</UserMenuItem>
                      <UserMenuItem onClick={handleOrdersClick}>Orders</UserMenuItem>
                      <UserMenuItem onClick={handleProfileClick}>Profile</UserMenuItem>
                      <UserMenuItem onClick={handleLogout}>Logout</UserMenuItem>
                    </UserMenu>
                  )}
                </UserMenuWrapper>
              ) : (
                <AuthButton onClick={() => loginWithRedirect()}>Login</AuthButton>
              )}
            </NavItem>
          </NavList>
        </Nav>
      </Header>
      <Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products updateCartCount={fetchCartCount} />} />
          <Route path="/cart" element={<Cart updateCartCount={fetchCartCount} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </Main>
    </AppWrapper>
  );
}

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [getAccessTokenSilently]);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
    </div>
  );
};

const Orders = () => {
  return <div>Orders page (to be implemented)</div>;
};

export default App;