<<<<<<< HEAD
// src/pages/admin/Services.js
import React, { useEffect, useState, useRef } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> ead3d2f62a7a0189f05eb1fca4a46129fb0e7f4d
import { supabase } from '../../supabaseClient';
import '../admin.css';

function Services() {
  const [services, setServices] = useState([]);
<<<<<<< HEAD
  const [loading, setLoading] = useState(true);
  const [newService, setNewService] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    duration: ''
  });
  const [error, setError] = useState(null);
  const realtimeSubRef = useRef(null);

  // Fetch services
  const fetchServices = async () => {
    setLoading(true);
    setError(null);

=======
  const [newService, setNewService] = useState({ name: '', description: '', price: '', duration: '' });
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
>>>>>>> ead3d2f62a7a0189f05eb1fca4a46129fb0e7f4d
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
<<<<<<< HEAD

      setServices(data ?? []);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err.message);
=======
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setStatusMsg({ type: 'error', text: 'Failed to load services' });
>>>>>>> ead3d2f62a7a0189f05eb1fca4a46129fb0e7f4d
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
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

  // Add a service (manual ID)
  const addService = async (e) => {
    e.preventDefault();

    if (!newService.id || !newService.name) {
      return alert("ID and Name are required");
    }

    const payload = {
      id: Number(newService.id),
      name: newService.name,
      description: newService.description,
      price: newService.price,
      duration: newService.duration
    };
=======
  const handleInlineChange = async (id, field, value) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
>>>>>>> ead3d2f62a7a0189f05eb1fca4a46129fb0e7f4d

    try {
      const { error } = await supabase
        .from('services')
<<<<<<< HEAD
        .insert([payload]);

      if (error) throw error;

      setNewService({
        id: '',
        name: '',
        description: '',
        price: '',
        duration: ''
      });

      fetchServices();
    } catch (err) {
      console.error("Insert error:", err.message);
      alert("Error: " + err.message);
    }
  };

  // Update field inline
  const updateField = async (id, field, value) => {
    setServices(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );

    try {
      const { error } = await supabase
        .from('services')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error("Update error:", err.message);
      alert("Error updating service");
      fetchServices();
    }
  };

  // Delete service
  const removeService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

=======
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      setStatusMsg({ type: 'ok', text: 'Service updated successfully' });
    } catch (err) {
      console.error('Error updating service:', err);
      setStatusMsg({ type: 'error', text: 'Failed to update service' });
      fetchServices();
    }
  };

  const addService = async (e) => {
    e.preventDefault();
    if (!newService.name) return;

    try {
      const { data, error } = await supabase
        .from('services')
        .insert([{
          name: newService.name,
          description: newService.description || 'New service',
          price: newService.price || '₹0',
          duration: newService.duration || '30 min',
          image: ''
        }])
        .select();

      if (error) throw error;

      setServices([...services, ...data]);
      setNewService({ name: '', description: '', price: '', duration: '' });
      setStatusMsg({ type: 'ok', text: 'Service added successfully' });
    } catch (err) {
      console.error('Error adding service:', err);
      setStatusMsg({ type: 'error', text: 'Failed to add service' });
    }
  };

  const removeService = async (id) => {
>>>>>>> ead3d2f62a7a0189f05eb1fca4a46129fb0e7f4d
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setServices(prev => prev.filter(s => s.id !== id));
<<<<<<< HEAD
    } catch (err) {
      console.error("Delete error:", err.message);
      alert("Error deleting service");
=======
      setStatusMsg({ type: 'ok', text: 'Service deleted successfully' });
    } catch (err) {
      console.error('Error deleting service:', err);
      setStatusMsg({ type: 'error', text: 'Failed to delete service' });
>>>>>>> ead3d2f62a7a0189f05eb1fca4a46129fb0e7f4d
    }
  };

  return (
    <div>
<<<<<<< HEAD
      {/* Add Service Panel */}
      <div className="admin-panel" style={{ marginBottom: "1rem" }}>
=======
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

      <div className="admin-panel" style={{marginBottom:'1rem'}}>
>>>>>>> ead3d2f62a7a0189f05eb1fca4a46129fb0e7f4d
        <div className="admin-panel-header">
          <div className="admin-panel-title">Add New Service</div>
        </div>

        <div className="admin-panel-body">
          <form className="form-row" onSubmit={addService}>
            <input
              className="input"
              placeholder="ID (manual)"
              value={newService.id}
              onChange={(e) =>
                setNewService({ ...newService, id: e.target.value })
              }
              required
            />

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
<<<<<<< HEAD
            <div>Loading…</div>
=======
            <div>Loading services...</div>
>>>>>>> ead3d2f62a7a0189f05eb1fca4a46129fb0e7f4d
          ) : (
            <table className="table">
              <thead>
                <tr>
<<<<<<< HEAD
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {services.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>

                    <td>
                      <input
                        className="input"
                        value={s.name}
                        onChange={(e) =>
                          updateField(s.id, "name", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        className="input"
                        value={s.description || ""}
                        onChange={(e) =>
                          updateField(s.id, "description", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        className="input"
                        value={s.duration || ""}
                        onChange={(e) =>
                          updateField(s.id, "duration", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        className="input"
                        value={s.price || ""}
                        onChange={(e) =>
                          updateField(s.id, "price", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <button
                        className="btn"
                        style={{ background: "red", color: "white" }}
                        onClick={() => removeService(s.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {services.length === 0 && (
                  <tr>
                    <td colSpan="6">No services found.</td>
                  </tr>
                )}
=======
                  <th style={{width:'60px'}}>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th style={{width:'140px'}}>Price</th>
                  <th style={{width:'120px'}}>Duration</th>
                  <th style={{width:'120px'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.description}</td>
                    <td>
                      <input className="input" value={s.price} onChange={e=>handleInlineChange(s.id,'price', e.target.value)} />
                    </td>
                    <td>
                      <input className="input" value={s.duration} onChange={e=>handleInlineChange(s.id,'duration', e.target.value)} />
                    </td>
                    <td>
                      <button className="btn secondary" onClick={()=>removeService(s.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
>>>>>>> ead3d2f62a7a0189f05eb1fca4a46129fb0e7f4d
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Services;
