import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/layout/Navbar';

// Pages
import Home from './pages/customer/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Profile from './pages/auth/Profile';
import ArtisanDashboard from './pages/artisan/Dashboard';
import AddProduct from './pages/artisan/AddProduct';
import ManageOrders from './pages/artisan/ManageOrders';
import ConsultantDashboard from './pages/consultant/Dashboard';
import Logistics from './pages/consultant/Logistics';
import AdminDashboard from './pages/admin/Dashboard';
import Orders from './pages/customer/Orders';
import Cart from './pages/customer/Cart';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-neutral-900 text-white">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Common Protected Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />

                {/* Customer Routes */}
                <Route path="/orders" element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/cart" element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <Cart />
                  </ProtectedRoute>
                } />
                
                {/* Artisan Routes */}
                <Route path="/artisan" element={
                  <ProtectedRoute allowedRoles={['artisan']}>
                    <ArtisanDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/artisan/add-product" element={
                  <ProtectedRoute allowedRoles={['artisan']}>
                    <AddProduct />
                  </ProtectedRoute>
                } />
                <Route path="/artisan/manage-orders" element={
                  <ProtectedRoute allowedRoles={['artisan']}>
                    <ManageOrders />
                  </ProtectedRoute>
                } />

                {/* Consultant Routes */}
                <Route path="/consultant" element={
                  <ProtectedRoute allowedRoles={['consultant']}>
                    <ConsultantDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/consultant/logistics" element={
                  <ProtectedRoute allowedRoles={['consultant']}>
                    <Logistics />
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
