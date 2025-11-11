import React from 'react';
import '../admin.css';

const todaysAppointments = [
  { time: '09:00', client: 'Susmita Sen', service: 'Haircut & Style', staff: 'Pooja', status: 'confirmed' },
  { time: '10:30', client: 'Rajat Sharma', service: 'Color Treatment', staff: 'Rhea', status: 'confirmed' },
  { time: '14:00', client: 'Sravani Malik', service: 'Manicure', staff: 'Rohan', status: 'pending' }
];

function Dashboard() {
  return (
    <div>
      <div className="admin-grid">
        <div className="admin-card">
          <div className="admin-card-title">Today's Appointments</div>
          <div className="admin-card-value">6</div>
        </div>
        <div className="admin-card">
          <div className="admin-card-title">Active Clients</div>
          <div className="admin-card-value">248</div>
        </div>
        <div className="admin-card">
          <div className="admin-card-title">Services Offered</div>
          <div className="admin-card-value">12</div>
        </div>
        <div className="admin-card">
          <div className="admin-card-title">Today's Revenue</div>
          <div className="admin-card-value">₹40,000</div>
        </div>
      </div>

      <div className="admin-columns">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title">Today's Appointments</div>
            <button className="btn">+ New Appointment</button>
          </div>
          <div className="admin-panel-body">
            <table className="table">
              <thead>
                <tr>
                  <th style={{width:'80px'}}>Time</th>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Staff</th>
                  <th style={{width:'120px'}}>Status</th>
                </tr>
              </thead>
              <tbody>
                {todaysAppointments.map((a) => (
                  <tr key={a.time + a.client}>
                    <td>{a.time}</td>
                    <td>{a.client}</td>
                    <td>{a.service}</td>
                    <td>{a.staff}</td>
                    <td>
                      <span className={`admin-chip ${a.status === 'confirmed' ? 'chip-confirmed' : 'chip-pending'}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title">Quick Actions</div>
          </div>
          <div className="admin-panel-body" style={{display:'grid',gap:'0.6rem'}}>
            <button className="btn">New Appointment</button>
            <button className="btn secondary">Add Client</button>
            <button className="btn secondary">Add Service</button>
            <button className="btn secondary">Quick Checkout</button>
            <div style={{marginTop:'1rem',color:'#666',fontWeight:600}}>Staff on Duty</div>
            <div style={{display:'grid',gap:'0.35rem'}}>
              <div>Pooja Trivedi</div>
              <div>Rhea Reddy</div>
              <div>Rohan Kumar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
