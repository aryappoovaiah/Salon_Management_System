// src/pages/admin/Services.js
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import '../admin.css';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: 'hair'
  });
  const [statusMsg, setStatusMsg] = useState(null);
  const realtimeSubRef = useRef(null);

  // Fetch services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      setServices(data ?? []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setStatusMsg({ type: 'error', text: 'Failed to load services' });
    } finally {
      setLoading(false);
    }
  };

  // Realtime subscription
  useEffect(() => {
    fetchServices();

    realtimeSubRef.current = supabase
      .channel('services-realtime')
      .on(
        'postgres_changes',
        { event: '*', table: 'services', schema: 'public' },
        () => fetchServices()
      )
      .subscribe();

    return () => {
      if (realtimeSubRef.current) {
        supabase.removeChannel(realtimeSubRef.current);
      }
    };
  }, []);

  // Handle inline field changes
  const handleInlineChange = async (id, field, value) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

    try {
      const { error } = await supabase
        .from('services')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      setStatusMsg({ type: 'ok', text: 'Service updated successfully' });
    } catch (err) {
      console.error('Error updating service:', err);
      setStatusMsg({ type: 'error', text: 'Failed to update service' });
      fetchServices(); // Revert to server state on error
    }
  };

  // Add a service
  const addService = async (e) => {
    e.preventDefault();
    if (!newService.name) {
      setStatusMsg({ type: 'error', text: 'Service name is required' });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('services')
        .insert([{
          name: newService.name,
          description: newService.description || 'New service',
          price: newService.price || '₹0',
          duration: newService.duration || '30 min',
          category: newService.category || 'hair',
          image: ''
        }])
        .select();

      if (error) throw error;

      setServices([...services, ...data]);
      setNewService({ name: '', description: '', price: '', duration: '', category: 'hair' });
      setStatusMsg({ type: 'ok', text: 'Service added successfully' });
    } catch (err) {
      console.error('Error adding service:', err);
      setStatusMsg({ type: 'error', text: 'Failed to add service' });
    }
  };

  // Delete service
  const removeService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setServices(prev => prev.filter(s => s.id !== id));
      setStatusMsg({ type: 'ok', text: 'Service deleted successfully' });
    } catch (err) {
      console.error('Error deleting service:', err);
      setStatusMsg({ type: 'error', text: 'Failed to delete service' });
    }
  };

  return (
    <div>
      {statusMsg && (
        <div style={{
          marginBottom: 10,
          padding: 10,
          borderRadius: 6,
          background: statusMsg.type === 'error' ? '#ffe6e6' : '#e6ffef',
          color: '#111'
        }}>
          {statusMsg.text}
        </div>
      )}

      {/* Add Service Panel */}
      <div className="admin-panel" style={{marginBottom: '1rem'}}>
        <div className="admin-panel-header">
          <div className="admin-panel-title">Add New Service</div>
        </div>

        <div className="admin-panel-body">
          <form className="form-row" onSubmit={addService}>
            <input
              className="input"
              placeholder="Name"
              value={newService.name}
              onChange={(e) =>
                setNewService({ ...newService, name: e.target.value })
              }
              required
            />

            <input
              className="input"
              placeholder="Description"
              value={newService.description}
              onChange={(e) =>
                setNewService({ ...newService, description: e.target.value })
              }
            />

            <select
              className="input"
              value={newService.category}
              onChange={(e) =>
                setNewService({ ...newService, category: e.target.value })
              }
              required
            >
              <option value="hair">Hair</option>
              <option value="nails">Nails</option>
              <option value="cosmetology">Cosmetology</option>
              <option value="makeup">Make-Up</option>
            </select>

            <input
              className="input"
              placeholder="Duration (e.g. 45 min)"
              value={newService.duration}
              onChange={(e) =>
                setNewService({ ...newService, duration: e.target.value })
              }
            />

            <input
              className="input"
              placeholder="Price"
              value={newService.price}
              onChange={(e) =>
                setNewService({ ...newService, price: e.target.value })
              }
            />

            <button className="btn" type="submit">Add Service</button>
          </form>
        </div>
      </div>

      {/* Services Table */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div className="admin-panel-title">Services</div>
        </div>

        <div className="admin-panel-body">
          {loading ? (
            <div>Loading services...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th style={{width: '60px'}}>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th style={{width: '140px'}}>Category</th>
                  <th style={{width: '120px'}}>Price</th>
                  <th style={{width: '100px'}}>Duration</th>
                  <th style={{width: '100px'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.description}</td>
                    <td>
                      <select
                        className="input"
                        value={s.category || 'hair'}
                        onChange={e => handleInlineChange(s.id, 'category', e.target.value)}
                      >
                        <option value="hair">Hair</option>
                        <option value="nails">Nails</option>
                        <option value="cosmetology">Cosmetology</option>
                        <option value="makeup">Make-Up</option>
                      </select>
                    </td>
                    <td>
                      <input
                        className="input"
                        value={s.price}
                        onChange={e => handleInlineChange(s.id, 'price', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="input"
                        value={s.duration}
                        onChange={e => handleInlineChange(s.id, 'duration', e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        className="btn secondary"
                        onClick={() => removeService(s.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {services.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{textAlign: 'center'}}>
                      No services found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Services;