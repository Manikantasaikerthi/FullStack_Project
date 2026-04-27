import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [artisanRequests, setArtisanRequests] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('tribal_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const { user } = useAuth();
  
  const getHeaders = () => {
      const headers = { 'Content-Type': 'application/json' };
      if (user && user.token) {
          headers['Authorization'] = `Bearer ${user.token}`;
      }
      return headers;
  };

  const fetchData = async () => {
    try {
      let finalProducts = [];
      
      // 1. Fetch public approved products for everyone
      const prodRes = await fetch(`${API_BASE_URL}/products/public/approved`);
      if (prodRes.ok) {
          finalProducts = await prodRes.json();
      }

      if (!user) {
          setProducts(finalProducts);
          return;
      }

      // 2. Role-specific product and user fetching
      if (user.role === 'consultant' || user.role === 'admin') {
          // Administrators and Consultants see EVERYTHING
          const allProdRes = await fetch(`${API_BASE_URL}/products/pending`, { headers: getHeaders() });
          if (allProdRes.ok) {
              finalProducts = await allProdRes.json();
          }
          
          // Fetch all users for management and stats
          const usersRes = await fetch(`${API_BASE_URL}/users`, { headers: getHeaders() });
          if (usersRes.ok) {
              const allUsers = await usersRes.json();
              setUsers(allUsers);
              setArtisanRequests(allUsers.filter(u => u.role === 'artisan' && !u.approved));
          }
      } else if (user.role === 'artisan') {
          // Artisans see public products PLUS their own unapproved products
          const myProdRes = await fetch(`${API_BASE_URL}/products/artisan/${user.email}`, { headers: getHeaders() });
          if (myProdRes.ok) {
              const myProds = await myProdRes.json();
              const prodMap = new Map();
              finalProducts.forEach(p => prodMap.set(p.id, p));
              myProds.forEach(p => prodMap.set(p.id, p));
              finalProducts = Array.from(prodMap.values());
          }
      }
      
      setProducts(finalProducts);

      // 3. Order fetching
      if (user.role === 'consultant' || user.role === 'admin') {
           const ordersRes = await fetch(`${API_BASE_URL}/orders`, { headers: getHeaders() });
           if (ordersRes.ok) {
               setOrders(await ordersRes.json());
           }
      } else if (user.role === 'customer') {
          const ordersRes = await fetch(`${API_BASE_URL}/orders/customer`, { headers: getHeaders() });
          if (ordersRes.ok) {
              setOrders(await ordersRes.json());
          }
      } else if (user.role === 'artisan') {
          const ordersRes = await fetch(`${API_BASE_URL}/orders`, { headers: getHeaders() });
          if (ordersRes.ok) {
              setOrders(await ordersRes.json());
          }
      }

    } catch (e) {
        console.error("Failed to fetch data", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tribal_cart', JSON.stringify(cart));
  }, [cart]);

  const addProduct = async (productData) => {
    try {
        const res = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(productData)
        });
        if (res.ok) {
            await fetchData();
            return true;
        } else {
            const errorBody = await res.text();
            console.error("Failed to add product. Status:", res.status, "Body:", errorBody);
        }
    } catch(e) {}
    return false;
  };

  const approveProduct = async (productId) => {
    try {
        const res = await fetch(`${API_BASE_URL}/products/${productId}/approve`, {
            method: 'PUT',
            headers: getHeaders()
        });
        if (res.ok) fetchData();
    } catch(e) {}
  };

  const rejectProduct = async (productId) => {
    try {
        const res = await fetch(`${API_BASE_URL}/products/${productId}/reject`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (res.ok) fetchData();
    } catch(e) {}
  };

  const approveArtisan = async (artisanId) => {
     try {
         const res = await fetch(`${API_BASE_URL}/users/${artisanId}`, {
             method: 'PUT',
             headers: getHeaders(),
             body: JSON.stringify({ approved: true })
         });
         if (res.ok) fetchData();
     } catch(e) {}
  };

  const deleteProductsByArtisan = async (artisanEmail) => {
      // Handled via DB cascades or separate service calls
  };

  const rejectArtisan = async (artisanId) => {
      try {
         const res = await fetch(`${API_BASE_URL}/users/${artisanId}`, {
             method: 'DELETE',
             headers: getHeaders()
         });
         if (res.ok) fetchData();
     } catch(e) {}
  };

  const placeOrder = async (orderData) => {
      try {
        const res = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(orderData)
        });
        if (res.ok) {
            fetchData();
            const data = await res.json();
            return { success: true, orderId: data.id };
        }
      } catch(e) {}
      return { success: false };
  };

  const updateOrderStatus = async (orderId, newStatus) => {
     try {
        const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) fetchData();
    } catch(e) {}
  };

  const updateItemStatus = async (orderId, itemId, artisanEmail, newStatus) => {
      try {
        const res = await fetch(`${API_BASE_URL}/orders/${orderId}/items/${itemId}/status`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ status: newStatus, artisanEmail })
        });
        if (res.ok) fetchData();
    } catch(e) {}
  };

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  const removeFromCart = (index) => {
    setCart(prev => {
      const newCart = [...prev];
      newCart.splice(index, 1);
      return newCart;
    });
  };

  const clearCart = () => setCart([]);

  const getStats = () => {
    return {
      totalProducts: products.length,
      approvedProducts: products.filter(p => p.approved).length,
      totalCustomers: users.filter(u => u.role === 'customer').length,
      totalArtisans: users.filter(u => u.role === 'artisan' && u.approved).length,
      pendingArtisans: artisanRequests.length,
      pendingProducts: products.filter(p => !p.approved).length,
      totalOrders: orders.length,
      revenue: orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0),
      profit: orders.reduce((acc, curr) => acc + (Number(curr.total) * 0.2 || 0), 0)
    };
  };

  const value = {
    products,
    artisanRequests,
    orders,
    users, // Exporting users for components that need the list
    addProduct,
    approveProduct,
    placeOrder,
    updateOrderStatus,
    updateItemStatus,
    rejectProduct,
    rejectArtisan,
    deleteProductsByArtisan,
    getStats,
    approveArtisan,
    cart,
    addToCart,
    removeFromCart,
    clearCart
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
