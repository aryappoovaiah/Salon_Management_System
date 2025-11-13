import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Services from './pages/Services';
import BookAppointment from './pages/BookAppointment';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/pages/Dashboard';
import AdminServices from './admin/pages/Services';
import AdminAppointments from './admin/pages/AdminAppointments';
import AdminClients from './admin/pages/Clients';
import AdminPOS from './admin/pages/AdminPOS';
import AdminInventory from './admin/pages/Inventory';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/book" element={<BookAppointment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/admin" element={<AdminLayout />}> 
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="pos" element={<AdminPOS />} />
              <Route path="inventory" element={<AdminInventory />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;