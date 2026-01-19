
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicHome from './pages/PublicHome';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import { Booking, User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Initialize data if not present
  useEffect(() => {
    if (!localStorage.getItem('barbearia_bookings')) {
      localStorage.setItem('barbearia_bookings', JSON.stringify([]));
    }
    const savedUser = localStorage.getItem('barbearia_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('barbearia_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('barbearia_user');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicHome />} />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/admin" 
          element={user ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
