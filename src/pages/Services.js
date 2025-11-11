import React from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { services } from '../data/salonData';
import './Services.css';

function Services() {
  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Our Services</h1>
        <p>Discover our range of premium beauty and wellness services</p>
      </div>

      <div className="services-container">
        <div className="services-grid">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      <div className="services-cta">
        <h2>Ready to Book?</h2>
        <p>Select a service and schedule your appointment today</p>
        <Link to="/book" className="cta-button">Book Appointment</Link>
      </div>
    </div>
  );
}

export default Services;

