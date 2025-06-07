import React from 'react';
import '../styles/About.css';

const About = () => {
    const features = [
    {
      icon: '🛡️',
      title: 'Safe & Secure',
      description: 'All our vehicles undergo rigorous safety checks and are fully insured for your peace of mind.'
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'Competitive rates with no hidden fees. Get the best value for your money with our transparent pricing.'
    },
    {
      icon: '🚗',
      title: 'Premium Fleet',
      description: 'Choose from our extensive collection of well-maintained, modern vehicles for every occasion.'
    },
    {
      icon: '🕒',
      title: '24/7 Support',
      description: 'Round-the-clock customer support to assist you whenever you need help during your rental period.'
    }
  ];


  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-hero">
          <div className="about-content">
            <h2 className="about-title">
              Your Trusted Car Rental Partner
            </h2>
            <p className="about-subtitle">
              Experience the freedom of the road with our premium car rental service. 
              We've been serving customers for over a decade with reliability, quality, and exceptional service.
            </p>
            <div className="about-stats">
              <div className="stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat">
                <div className="stat-number">500+</div>
                <div className="stat-label">Premium Cars</div>
              </div>
              <div className="stat">
                <div className="stat-number">50+</div>
                <div className="stat-label">Locations</div>
              </div>
            </div>
          </div>
          <div className="about-image">
            <div className="image-placeholder">
              <div className="car-silhouette">🚙</div>
            </div>
          </div>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About