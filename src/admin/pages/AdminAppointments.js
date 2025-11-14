// src/pages/AdminAppointments.js
import React, { useState, useMemo, useEffect, useRef } from 'react';
import './AdminAppointments.css';
import { supabase } from '../../supabaseClient' // <- DB client (adjust path if needed)

// --- Mock Data (kept as fallback but not used when DB is present) ---
const initialAppointments = [
  { id: 'a1', customerName: 'Alice Smith', customerEmail: 'alice@example.com', phone: '555-0101', service: "Women's Haircut", dateTime: '2025-11-11T09:00:00', price: 65, status: 'confirmed' },
  { id: 'a2', customerName: 'Bob Johnson', customerEmail: 'bob@example.com', phone: '555-0102', service: "Men's Haircut", dateTime: '2025-11-11T10:30:00', price: 40, status: 'booked' },
  { id: 'a3', customerName: 'Charlie Brown', customerEmail: 'charlie@example.com', phone: '555-0103', service: 'Beard Trim', dateTime: '2025-11-12T11:00:00', price: 25, status: 'booked' },
  { id: 'a4', customerName: 'Diana Prince', customerEmail: 'diana@example.com', phone: '555-0104', service: 'Full Color', dateTime: '2025-11-12T14:00:00', price: 150, status: 'confirmed' },
  { id: 'a5', customerName: 'Eve Adams', customerEmail: 'eve@example.com', phone: '555-0105', service: 'Balayage', dateTime: '2025-11-13T13:00:00', price: 220, status: 'booked' },
  { id: 'a6', customerName: 'Frank Castle', customerEmail: 'frank@example.com', phone: '555-0106', service: "Men's Haircut", dateTime: '2025-11-09T15:00:00', price: 40, status: 'completed' },
  { id: 'a7', customerName: 'Grace Hopper', customerEmail: 'grace@example.com', phone: '555-0107', service: 'Root Touch-up', dateTime: '2025-11-10T10:00:00', price: 80, status: 'completed' },
  { id: 'a8', customerName: 'Hank Pym', customerEmail: 'hank@example.com', phone: '555-0108', service: 'Beard Trim', dateTime: '2025-11-10T12:00:00', price: 25, status: 'cancelled' },
  { id: 'a9', customerName: 'Ivy Stone', customerEmail: 'ivy@example.com', phone: '555-0109', service: 'Bridal Package', dateTime: '2025-11-14T09:00:00', price: 450, status: 'confirmed' },
  { id: 'a10', customerName: 'Jack Ryan', customerEmail: 'jack@example.com', phone: '555-0110', service: "Men's Haircut", dateTime: '2025-11-14T16:00:00', price: 40, status: 'booked' },
  { id: 'a11', customerName: 'Kara Danvers', customerEmail: 'kara@example.com', phone: '555-0111', service: "Women's Haircut", dateTime: '2025-11-08T11:00:00', price: 65, status: 'completed' },
  { id: 'a12', customerName: 'Luke Cage', customerEmail: 'luke@example.com', phone: '555-0112', service: 'Head Shave', dateTime: '2025-11-15T10:00:00', price: 30, status: 'booked' },
];

// --- Utility Functions ---
const formatDateTime = (isoString) => {
  if (!isoString) return 'N/A';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: 'numeric', minute: 'numeric', hour12: true,
    }).format(new Date(isoString));
  } catch (error) {
    console.error('Error formatting date:', isoString, error);
    return 'Invalid Date';
  }
};

const getLocalDate = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

const getTodayDateString = () => {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;
  const localDate = new Date(today.getTime() - timezoneOffset);
  return localDate.toISOString().split('T')[0];
};

// --- Sub-components ---
const StatusBadge = ({ status }) => {
  const statusClass = status ? status.toLowerCase() : 'unknown';
  return <span className={`status-badge status-${statusClass}`}>{status}</span>;
};

const AppointmentModal = ({ mode, initialData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(
    initialData || {
      customerName: '',
      customerEmail: '',
      phone: '',
      service: '',
      dateTime: '',
      price: '',
      status: 'booked',
      notes: '',
    }
  );
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (firstInputRef.current) firstInputRef.current.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey) {
          if (document.activeElement === first) {
            last.focus(); event.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus(); event.preventDefault();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    if (name === 'datePart') {
      const timePart = formData.dateTime ? formData.dateTime.split('T')[1] : '00:00:00';
      setFormData(prev => ({ ...prev, dateTime: `${value}T${timePart}` }));
    } else if (name === 'timePart') {
      const datePart = formData.dateTime ? formData.dateTime.split('T')[0] : getTodayDateString();
      setFormData(prev => ({ ...prev, dateTime: `${datePart}T${value}:00` }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const datePart = formData.dateTime ? formData.dateTime.split('T')[0] : '';
  const timePart = formData.dateTime ? formData.dateTime.split('T')[1]?.substring(0,5) : '';

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content" ref={modalRef}>
        <header className="modal-header">
          <h2 id="modal-title">{mode === 'add' ? 'Add New Appointment' : 'Edit Appointment'}</h2>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close dialog">&times;</button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="customerName">Customer Name</label>
            <input id="customerName" name="customerName" type="text" value={formData.customerName} onChange={handleChange} required ref={firstInputRef} />
          </div>

          <div className="form-group">
            <label htmlFor="customerEmail">Customer Email</label>
            <input id="customerEmail" name="customerEmail" type="email" value={formData.customerEmail} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="service">Service</label>
            <input id="service" name="service" type="text" value={formData.service} onChange={handleChange} required />
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="datePart">Date</label>
              <input id="datePart" name="datePart" type="date" value={datePart} onChange={handleDateTimeChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="timePart">Time</label>
              <input id="timePart" name="timePart" type="time" value={timePart} onChange={handleDateTimeChange} required />
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input id="price" name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange} required>
                <option value="booked">Booked</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" value={formData.notes || ''} onChange={handleChange} rows="3" />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Page Component (DB-enabled) ---
const AdminAppointments = () => {
  // --- State ---
  const [appointments, setAppointments] = useState([]); // start empty; we'll load from DB
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'dateTime', direction: 'descending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'add', data: null });

  const ITEMS_PER_PAGE = 10;
  const todayDateString = getTodayDateString();

  // --- Load appointments from Supabase ---
  const fetchAppointments = async () => {
    try {
      // select all columns, order by date_time desc
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date_time', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        // fallback to initial mock data if you want:
        setAppointments(initialAppointments);
        return;
      }

      // map DB rows to UI structure (date_time -> dateTime, customer_name -> customerName, etc.)
      const mapped = (data || []).map(row => ({
        id: row.id,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        phone: row.phone,
        service: row.service,
        dateTime: row.date_time, // ISO string
        price: row.price,
        status: row.status,
        notes: row.notes ?? ''
      }));

      setAppointments(mapped);
    } catch (err) {
      console.error('Unexpected fetch error:', err);
      setAppointments(initialAppointments);
    }
  };

  useEffect(() => {
    // initial fetch
    fetchAppointments();

    // Realtime subscription: re-fetch on any change to appointments
    let sub = null;
    try {
      sub = supabase
        .channel('public:appointments')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, (payload) => {
          // For simplicity, just re-fetch the list
          fetchAppointments();
        })
        .subscribe();
    } catch (err) {
      console.warn('Realtime subscription error', err);
    }

    return () => {
      if (sub && sub.unsubscribe) sub.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Debouncing for Search Input ---
  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedSearchTerm(searchTerm), 250);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // --- Filtering, Sorting, Pagination (same logic as before) ---
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appt => {
      const lowerSearch = debouncedSearchTerm.toLowerCase();
      const matchesSearch =
        lowerSearch === '' ||
        (appt.customerName || '').toLowerCase().includes(lowerSearch) ||
        (appt.phone || '').toLowerCase().includes(lowerSearch) ||
        (appt.customerEmail || '').toLowerCase().includes(lowerSearch);

      const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;
      const apptDate = getLocalDate(appt.dateTime);
      const matchesToday = !showTodayOnly || apptDate === todayDateString;
      return matchesSearch && matchesStatus && matchesToday;
    });
  }, [appointments, debouncedSearchTerm, statusFilter, showTodayOnly, todayDateString]);

  const sortedAppointments = useMemo(() => {
    let sortableItems = [...filteredAppointments];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredAppointments, sortConfig]);

  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedAppointments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedAppointments, currentPage]);

  const totalPages = Math.max(1, Math.ceil(sortedAppointments.length / ITEMS_PER_PAGE));

  // --- Event handlers (DB backed) ---
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
    else if (sortConfig.key === key && sortConfig.direction === 'descending') direction = 'ascending';
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  const handlePageChange = (direction) => {
    setCurrentPage(prev => {
      if (direction === 'next' && prev < totalPages) return prev + 1;
      if (direction === 'prev' && prev > 1) return prev - 1;
      return prev;
    });
  };

  useEffect(() => setCurrentPage(1), [debouncedSearchTerm, statusFilter, showTodayOnly]);

  const openModal = (mode, appointment = null) => {
    const modalData = mode === 'edit' ? appointment : {
      customerName: '',
      customerEmail: '',
      phone: '',
      service: '',
      dateTime: `${todayDateString}T09:00:00`,
      price: '0',
      status: 'booked',
      notes: '',
    };
    setModalState({ isOpen: true, mode, data: modalData });
  };

  const closeModal = () => setModalState({ isOpen: false, mode: 'add', data: null });

  // When modal submits, save to DB (add or edit)
  const handleModalSubmit = async (formData) => {
    try {
      if (modalState.mode === 'add') {
        // Insert into Supabase. Map fields to DB columns.
        const payload = {
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          phone: formData.phone,
          service: formData.service,
          date_time: formData.dateTime,
          price: parseFloat(formData.price) || 0,
          status: formData.status || 'booked',
          notes: formData.notes || null,
        };
        const { data, error } = await supabase.from('appointments').insert([payload]).select('*');
        if (error) throw error;
        // Update local list: add new mapped row(s)
        const mapped = (data || []).map(row => ({
          id: row.id,
          customerName: row.customer_name,
          customerEmail: row.customer_email,
          phone: row.phone,
          service: row.service,
          dateTime: row.date_time,
          price: row.price,
          status: row.status,
          notes: row.notes ?? '',
        }));
        setAppointments(prev => [...mapped, ...prev]);
      } else if (modalState.mode === 'edit') {
        // Update DB row
        const idToUpdate = modalState.data?.id;
        const payload = {
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          phone: formData.phone,
          service: formData.service,
          date_time: formData.dateTime,
          price: parseFloat(formData.price) || 0,
          status: formData.status || 'booked',
          notes: formData.notes || null,
        };
        const { data, error } = await supabase.from('appointments').update(payload).eq('id', idToUpdate).select('*');
        if (error) throw error;
        // Update local list item
        const updated = (data || [])[0];
        if (updated) {
          setAppointments(prev => prev.map(appt => appt.id === updated.id ? {
            id: updated.id,
            customerName: updated.customer_name,
            customerEmail: updated.customer_email,
            phone: updated.phone,
            service: updated.service,
            dateTime: updated.date_time,
            price: updated.price,
            status: updated.status,
            notes: updated.notes ?? '',
          } : appt));
        }
      }
    } catch (err) {
      console.error('save appointment error', err);
      alert('Failed to save appointment: ' + (err.message || String(err)));
    } finally {
      closeModal();
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      const { error } = await supabase.from('appointments').delete().eq('id', appointmentId);
      if (error) throw error;
      setAppointments(prev => prev.filter(appt => appt.id !== appointmentId));
    } catch (err) {
      console.error('delete error', err);
      alert('Delete failed: ' + (err.message || String(err)));
    }
  };

  const handleMarkCompleted = async (appointment) => {
    const apptDate = new Date(appointment.dateTime);
    const now = new Date();
    if (apptDate > now && !window.confirm('This appointment is in the future. Are you sure you want to mark it as completed?')) return;
    try {
      const { error } = await supabase.from('appointments').update({ status: 'completed' }).eq('id', appointment.id);
      if (error) throw error;
      setAppointments(prev => prev.map(appt => appt.id === appointment.id ? { ...appt, status: 'completed' } : appt));
    } catch (err) {
      console.error('mark completed error', err);
      alert('Failed to mark completed: ' + (err.message || String(err)));
    }
  };

  // --- Render ---
  return (
    <div className="admin-appointments-page">
      <h1>Appointment Management</h1>

      {/* Controls */}
      <div className="controls-container card">
        <input
          type="search"
          placeholder="Search by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="control-search"
        />
        <div className="control-filters">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
            <option value="all">All Statuses</option>
            <option value="booked">Booked</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <label className="control-toggle">
            <input type="checkbox" checked={showTodayOnly} onChange={(e) => setShowTodayOnly(e.target.checked)} />
            Show Today's Only
          </label>
        </div>
        <button className="btn btn-primary" onClick={() => openModal('add')}>+ Add Appointment</button>
      </div>

      {/* Table */}
      <div className="table-container card">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Service</th>
              <th className="sortable-header" onClick={() => handleSort('dateTime')} aria-sort={sortConfig.key === 'dateTime' ? sortConfig.direction : 'none'}>
                Date & Time {getSortIndicator('dateTime')}
              </th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAppointments.length > 0 ? (
              paginatedAppointments.map(appt => (
                <tr key={appt.id}>
                  <td>
                    <div className="customer-name">{appt.customerName}</div>
                    <div className="customer-email">{appt.customerEmail}</div>
                  </td>
                  <td><div>{appt.phone}</div></td>
                  <td>{appt.service}</td>
                  <td>{formatDateTime(appt.dateTime)}</td>
                  <td>${appt.price?.toFixed?.(2)}</td>
                  <td><StatusBadge status={appt.status} /></td>
                  <td>
                    <div className="action-buttons">
                      {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                        <button className="btn btn-sm btn-outline" onClick={() => handleMarkCompleted(appt)} title="Mark as Completed">✓</button>
                      )}
                      <button className="btn btn-sm btn-secondary" onClick={() => openModal('edit', appt)} aria-label={`Edit appointment for ${appt.customerName}`}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(appt.id)} aria-label={`Delete appointment for ${appt.customerName}`}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results-cell">No appointments found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button className="btn" onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>&laquo; Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button className="btn" onClick={() => handlePageChange('next')} disabled={currentPage === totalPages}>Next &raquo;</button>
        </div>
      )}

      {/* Modal */}
      {modalState.isOpen && (
        <AppointmentModal mode={modalState.mode} initialData={modalState.data} onClose={closeModal} onSubmit={handleModalSubmit} />
      )}
    </div>
  );
};

export default AdminAppointments;
