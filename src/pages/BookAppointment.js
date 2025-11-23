// src/pages/BookAppointment.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { timeSlots } from '../data/salonData';
import { supabase } from '../supabaseClient';
import './BookAppointment.css';

function BookAppointment() {
  const location = useLocation();
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: today,
    time: '',
    notes: ''
  });

  const [allServices, setAllServices] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null); // {type:'ok'|'error'|'info', text: string}

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (location.state?.selectedService && allServices.length > 0) {
      const service = allServices.find(s => s.name === location.state.selectedService);
      if (service) {
        setFormData(prev => ({ ...prev, service: String(service.id) }));
      }
    }
  }, [location.state, allServices]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setAllServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Quick DB test helper to fetch last 5 rows (useful to verify client works)
  const testFetch = async () => {
    setStatusMsg({ type: 'info', text: 'Testing DB connectivity...' });
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('testFetch error', error);
        setStatusMsg({ type: 'error', text: 'Test fetch failed: ' + error.message });
        return;
      }
      console.log('testFetch rows:', data);
      setStatusMsg({ type: 'ok', text: `Test fetch OK — ${data.length} row(s) returned (check console).` });
    } catch (err) {
      console.error('testFetch unexpected', err);
      setStatusMsg({ type: 'error', text: 'Unexpected test error: ' + (err.message || err) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg(null);

    // simple validation
    if (!formData.name || !formData.phone || !formData.service || !formData.date || !formData.time) {
      setStatusMsg({ type: 'error', text: 'Please fill required fields.' });
      return;
    }

    setBusy(true);
    setStatusMsg({ type: 'info', text: 'Saving appointment...' });

    try {
      const dateTimeISO = new Date(`${formData.date}T${formData.time}:00`).toISOString();
      const selectedService = allServices.find(s => String(s.id) === String(formData.service));

      const payload = {
        customer_name: formData.name,
        customer_email: formData.email || null,
        phone: formData.phone,
        service: selectedService?.name || formData.service,
        date_time: dateTimeISO,
        price: parseFloat(selectedService?.price?.replace(/[^\d.]/g, '') || 0),
        status: 'booked',
        notes: formData.notes || null
      };

      // Insert and return inserted row(s)
      const { data, error } = await supabase
        .from('appointments')
        .insert([payload])
        .select('*');

      if (error) {
        console.error('Insert error', error);
        setStatusMsg({ type: 'error', text: 'Failed to save: ' + (error?.message || error) });
        setBusy(false);
        return;
      }

      // Success: data contains inserted rows (usually 1)
      console.info('Insert success', data);
      setStatusMsg({ type: 'ok', text: 'Appointment saved successfully.' });

      // Preserve your original UI behavior
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          date: today,
          time: '',
          notes: ''
        });
        setStatusMsg(null);
      }, 2200);
    } catch (err) {
      console.error('Unexpected save error', err);
      setStatusMsg({ type: 'error', text: 'Unexpected error: ' + (err?.message || String(err)) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="book-appointment">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="booking-header">
          <h1>Book Your Appointment</h1>
          <p>Fill out the form below to schedule your visit</p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button type="button" onClick={testFetch} style={{ marginBottom: 8 }}>Test DB</button>
          <div style={{ fontSize: 12, color: '#666' }}>Use "Test DB" to verify connectivity.</div>
        </div>
      </div>

      <div className="booking-container">
        {statusMsg && (
          <div style={{
            marginBottom: 10,
            padding: 10,
            borderRadius: 6,
            background: statusMsg.type === 'error' ? '#ffe6e6' : statusMsg.type === 'info' ? '#eef2ff' : '#e6ffef',
            color: '#111'
          }}>
            {statusMsg.text}
          </div>
        )}

        {submitted ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Appointment Booked Successfully!</h2>
            <p>We'll send you a confirmation email shortly.</p>
          </div>
        ) : (
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address (Optional)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="service">Select Service *</label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="">Choose a service</option>
                {['hair', 'nails', 'cosmetology', 'makeup'].map(category => {
                  const categoryServices = allServices.filter(s => s.category === category);
                  if (categoryServices.length === 0) return null;
                  const categoryNames = { hair: 'Hair', nails: 'Nails', cosmetology: 'Cosmetology', makeup: 'Make-Up' };
                  return (
                    <optgroup key={category} label={categoryNames[category]}>
                      {categoryServices.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name} - {service.price}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Select Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={today}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Select Time *</label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose a time</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Additional Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Any special requests or notes..."
              />
            </div>

            <button type="submit" className="submit-button" disabled={busy}>
              {busy ? 'Saving...' : 'Book Appointment'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default BookAppointment;