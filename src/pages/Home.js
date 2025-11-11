import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      {/* Hero Section with Image Background */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Cut and Colors</h1>
          <p className="hero-subtitle">Classic beauty with a modern touch</p>
          <p className="hero-description">
            Indulge in the extraordinary. Experience premium salon services with our expert stylists 
            and beauticians. Your palace of beauty awaits.
          </p>
          <div className="hero-buttons">
            <Link to="/book" className="cta-button primary">Book Appointment</Link>
            <Link to="/services" className="cta-button secondary">View Services</Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Indulge in the Extraordinary</h2>
              <p>
                Cut and Colors is one of the trendiest salon chains, catering to the beauty needs 
                of ardent fashion followers, trendsetters and celebrities. Being in existence for 
                almost two decades, we have become a leader and benchmark in the hair, beauty and 
                nail care industry.
              </p>
              <p>
                Our expert team believes that beauty is different for every person, which is why 
                we do not mass produce but tailor-make a look, keeping in mind an individual's 
                features when conceiving their cut and color.
              </p>
            </div>
            <div className="about-image">
              <img 
                src="https://media.istockphoto.com/id/1856117770/photo/modern-beauty-salon.jpg?s=612x612&w=0&k=20&c=dVZtsePk2pgbqDXwVkMm-yIw5imnZ2rnkAruR7zf8EA=" 
                alt="Modern beauty salon interior" 
                className="salon-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="services-showcase">
        <div className="container">
          <h2 className="section-title">Your Palace of Beauty</h2>
          <div className="services-grid">
            <div className="service-showcase-card">
              <div className="service-image">
                <img 
                  src="https://www.bubblesindia.com/wp-content/uploads/2019/03/Bubbles_Services_Banner_Mens_Grooming.jpg" 
                  alt="Hair styling service" 
                />
              </div>
              <div className="service-info">
                <h3>Hair</h3>
                <p>
                  Hair stylists at Cut and Colors believe that beauty is different for every person 
                  which is why they do not mass produce but tailor-make a look, keeping in mind 
                  an individual's features when conceiving their cut and colour.
                </p>
              </div>
            </div>
            <div className="service-showcase-card">
              <div className="service-image">
                <img 
                  src="https://charmssalon.in/wp-content/uploads/2024/09/beautician-with-brush-applies-white-moisturizing-mask-face-young-girl-client-spa-beauty-salon-scaled.jpg" 
                  alt="Cosmetology facial treatment" 
                />
              </div>
              <div className="service-info">
                <h3>Cosmetology</h3>
                <p>
                  Your path to radiant skin starts here with top-notch, advanced cosmetology services 
                  especially customised for you at Cut and Colors.
                </p>
              </div>
            </div>
            <div className="service-showcase-card">
              <div className="service-image">
                <img 
                  src="https://5.imimg.com/data5/MB/GI/GLADMIN-59832824/party-makeup-service.png" 
                  alt="Makeup service" 
                />
              </div>
              <div className="service-info">
                <h3>Make-Up</h3>
                <p>
                  Step into the spotlight with makeup services at Cut and Colors that highlights 
                  your unique style.
                </p>
              </div>
            </div>
            <div className="service-showcase-card">
              <div className="service-image">
                <img 
                  src="https://casaderma.in/wp-content/uploads/2024/02/7769-1-1024x768.jpg" 
                  alt="Nail care service" 
                />
              </div>
              <div className="service-info">
                <h3>Nails</h3>
                <p>
                  Nail Goals? We've got you covered! Our expert team of nail technicians is all 
                  about precision & creating masterpieces with every stroke.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Cut and Colors?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15 8.5 22 9 17 13.5 18.5 20 12 16.5 5.5 20 7 13.5 2 9 9 8.5 12 2"/>
                </svg>
              </div>
              <h3>Expert Stylists</h3>
              <p>Certified professionals with years of experience in the beauty industry</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l7 7-7 13L5 9l7-7z"/>
                  <path d="M12 2l7 7-7 13L5 9l7-7z" opacity=".2"/>
                </svg>
              </div>
              <h3>Premium Products</h3>
              <p>Only the finest quality luxury products used across services</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9"/>
                  <path d="M12 7v6l3 2"/>
                </svg>
              </div>
              <h3>Flexible Hours</h3>
              <p>Open 7 days a week with convenient appointment scheduling</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
                </svg>
              </div>
              <h3>Customer Care</h3>
              <p>Personalised, attentive service with a satisfaction-first mindset</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="container">
          <h2 className="section-title">Our Gallery</h2>
          <div className="gallery-grid">
            <div className="gallery-item gallery-item-1"></div>
            <div className="gallery-item gallery-item-2"></div>
            <div className="gallery-item gallery-item-3"></div>
            <div className="gallery-item gallery-item-4"></div>
            <div className="gallery-item gallery-item-5"></div>
            <div className="gallery-item gallery-item-6"></div>
          </div>
        </div>
      </section>

      {/* Special Offer Section */}
      <section className="offer-section">
        <div className="container">
          <div className="offer-content">
            <h2>Flat 25% off on Luxury Facials</h2>
            <p>Limited time offer - Book now and save!</p>
            <Link to="/book" className="cta-button primary">Book an Appointment</Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <footer className="contact-section">
        <div className="container contact-container">
          <div className="contact-brand">
            <h3>Cut and Colors</h3>
            <p>Classic beauty with a modern touch</p>
          </div>
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-label">Phone</span>
              <a href="tel:+11234567890" className="contact-link">+1 123 456 7890</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Email</span>
              <a href="mailto:hello@cutandcolors.com" className="contact-link">hello@cutandcolors.com</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Instagram</span>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="contact-link">@cutandcolors</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
