import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import '../admin.css';

function Services() {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: '', description: '', price: '', duration: '' });
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setStatusMsg({ type: 'error', text: 'Failed to load services' });
    } finally {
      setLoading(false);
    }
  };

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

      <div className="admin-panel" style={{marginBottom:'1rem'}}>
        <div className="admin-panel-header">
          <div className="admin-panel-title">Add New Service</div>
        </div>
        <div className="admin-panel-body">
          <form className="form-row" onSubmit={addService}>
            <input className="input" placeholder="Name" value={newService.name} onChange={e=>setNewService({...newService, name:e.target.value})} required />
            <input className="input" placeholder="Price (₹)" value={newService.price} onChange={e=>setNewService({...newService, price:e.target.value})} />
            <input className="input" placeholder="Duration (e.g. 45 min)" value={newService.duration} onChange={e=>setNewService({...newService, duration:e.target.value})} />
            <input className="input" placeholder="Description" value={newService.description} onChange={e=>setNewService({...newService, description:e.target.value})} />
            <button className="btn" type="submit">Add Service</button>
          </form>
        </div>
      </div>

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
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Services;
