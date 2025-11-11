import React, { useState } from 'react';
import { services as initialServices } from '../../data/salonData';
import '../admin.css';

function Services() {
  const [services, setServices] = useState(initialServices);
  const [newService, setNewService] = useState({ name: '', description: '', price: '', duration: '' });

  const handleInlineChange = (id, field, value) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addService = (e) => {
    e.preventDefault();
    if (!newService.name) return;
    const next = {
      id: Math.max(0, ...services.map(s => s.id)) + 1,
      name: newService.name,
      description: newService.description || 'New service',
      price: newService.price || '₹0',
      duration: newService.duration || '30 min',
      image: ''
    };
    setServices([ ...services, next ]);
    setNewService({ name: '', description: '', price: '', duration: '' });
  };

  const removeService = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div>
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
        </div>
      </div>
    </div>
  );
}

export default Services;
