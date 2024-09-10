import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';

const OrderList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const OrderItem = styled.li`
  background-color: #f0f0f0;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
`;

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div>
      <h2>Order History</h2>
      <OrderList>
        {orders.map((order, index) => (
          <OrderItem key={index}>
            <p>Order ID: {order.id}</p>
            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            <p>Total: ${order.total.toFixed(2)}</p>
            <p>Status: {order.status}</p>
          </OrderItem>
        ))}
      </OrderList>
    </div>
  );
}

export default OrderManagement;