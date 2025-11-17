import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { serviceCategories } from '../data/salonData';
import './Services.css';

function Services() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get('category');

  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || 'hair');

  useEffect(() => {
    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const currentCategory = serviceCategories.find(cat => cat.id === activeCategory);

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Our Services</h1>
        <p>Discover our range of premium beauty and wellness services</p>
      </div>

      <div className="services-container">
        <div className="category-nav">
          {serviceCategories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {currentCategory && (
          <>
            <div className="category-header">
              <img
                src={currentCategory.image}
                alt={currentCategory.name}
                className="category-image"
              />
              <h2>{currentCategory.name}</h2>
            </div>

            <div className="services-grid">
              {currentCategory.services.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </>
        )}
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

