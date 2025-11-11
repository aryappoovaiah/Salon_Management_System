import React from 'react';
import './ServiceCard.css';

function ServiceCard({ service }) {
  return (
    <div className="service-card">
      <div className="service-image-container">
        <img 
          src={service.image} 
          alt={service.name}
          className="service-image"
        />
      </div>
      <h3 className="service-name">{service.name}</h3>
      <p className="service-description">{service.description}</p>
      <div className="service-details">
        <span className="service-price">{service.price}</span>
        <span className="service-duration">{service.duration}</span>
      </div>
    </div>
  );
}

export default ServiceCard;

