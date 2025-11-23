import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import ServiceCard from "../components/ServiceCard";
import { supabase } from "../supabaseClient";
import "./Services.css";

const categoryInfo = {
  hair: {
    id: 'hair',
    name: 'Hair',
    image: 'https://www.bubblesindia.com/wp-content/uploads/2019/03/Bubbles_Services_Banner_Mens_Grooming.jpg'
  },
  nails: {
    id: 'nails',
    name: 'Nails',
    image: 'https://casaderma.in/wp-content/uploads/2024/02/7769-1-1024x768.jpg'
  },
  cosmetology: {
    id: 'cosmetology',
    name: 'Cosmetology',
    image: 'https://charmssalon.in/wp-content/uploads/2024/09/beautician-with-brush-applies-white-moisturizing-mask-face-young-girl-client-spa-beauty-salon-scaled.jpg'
  },
  makeup: {
    id: 'makeup',
    name: 'Make-Up',
    image: 'https://5.imimg.com/data5/MB/GI/GLADMIN-59832824/party-makeup-service.png'
  }
};

function Services() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category");

  const [activeCategory, setActiveCategory] = useState(
    categoryFromUrl || "hair"
  );
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    fetchServices();

    const channel = supabase
      .channel('services-public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
        fetchServices();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentCategoryInfo = categoryInfo[activeCategory];
  const categoryServices = services.filter(s => s.category === activeCategory);

  const handleServiceClick = (service) => {
    navigate("/book", {
      state: { selectedService: service.name, selectedPrice: service.price },
    });
  };

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Our Services</h1>
        <p>Discover our range of premium beauty and wellness services</p>
      </div>

      <div className="services-container">
        {/* Category Navigation */}
        <div className="category-nav">
          {Object.values(categoryInfo).map((category) => (
            <button
              key={category.id}
              className={`category-btn ${
                activeCategory === category.id ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Current Category */}
        {currentCategoryInfo && (
          <>
            <div className="category-header">
              <img
                src={currentCategoryInfo.image}
                alt={currentCategoryInfo.name}
                className="category-image"
              />
              <h2>{currentCategoryInfo.name}</h2>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                Loading services...
              </div>
            ) : categoryServices.length > 0 ? (
              <div className="services-grid">
                {categoryServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceClick(service)}
                    style={{ cursor: "pointer" }}
                  >
                    <ServiceCard service={service} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                No services available in this category yet.
              </div>
            )}
          </>
        )}
      </div>

      {/* Call to Action */}
      <div className="services-cta">
        <h2>Ready to Book?</h2>
        <p>Select a service and schedule your appointment today</p>
        <Link to="/book" className="cta-button">
          Book Appointment
        </Link>
      </div>
    </div>
  );
}

export default Services;
