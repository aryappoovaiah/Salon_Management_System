import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './admin.css';

function AdminLayout() {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">Cut and Colors Admin</div>
        <nav className="admin-nav">
          <Link to="/admin/dashboard" className={isActive('/admin/dashboard') || location.pathname === '/admin' ? 'admin-link active' : 'admin-link'}>Dashboard</Link>
          <Link to="/admin/appointments" className={isActive('/admin/appointments') ? 'admin-link active' : 'admin-link'}>Appointments</Link>
          <Link to="/admin/clients" className={isActive('/admin/clients') ? 'admin-link active' : 'admin-link'}>Clients</Link>
          <Link to="/admin/services" className={isActive('/admin/services') ? 'admin-link active' : 'admin-link'}>Services</Link>
          <Link to="/admin/pos" className={isActive('/admin/pos') ? 'admin-link active' : 'admin-link'}>Point of Sale</Link>
          <Link to="/admin/inventory" className={isActive('/admin/inventory') ? 'admin-link active' : 'admin-link'}>Inventory</Link>
        </nav>
      </aside>
      <section className="admin-content">
        <div className="admin-topbar">
          <div className="admin-top-title">{location.pathname.split('/').slice(-1)[0] || 'dashboard'}</div>
        </div>
        <div className="admin-page">
          <Outlet />
        </div>
      </section>
    </div>
  );
}

export default AdminLayout;
