import React from 'react';
import './Sponsors.css';

const sponsors = [
  { id: 's1', name: 'TechNova Labs', image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop', website: 'https://example.com', category: 'Platinum', description: 'Innovating AI-driven cloud platforms for the enterprise.', industry: 'Cloud & AI' },
  { id: 's2', name: 'FinEdge', image: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572?q=80&w=1200&auto=format&fit=crop', website: 'https://example.com', category: 'Platinum', description: 'Fintech leader in secure digital payments and banking APIs.', industry: 'Fintech' },
  { id: 's3', name: 'DevHex', image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop', website: 'https://example.com', category: 'Platinum', description: 'Developer tooling for scalable microservices and CI/CD.', industry: 'Developer Tools' }
];

const coSponsors = [
  { id: 'c1', name: 'PixelForge', image: 'https://images.unsplash.com/photo-1529336953121-4a32006c1d5a?q=80&w=1200&auto=format&fit=crop', website: 'https://example.com', category: 'Co-Sponsor', description: 'Creative studio for brand identity and product design.', industry: 'Design' },
  { id: 'c2', name: 'DataPulse', image: 'https://images.unsplash.com/photo-1551281044-8d8d0d8d8d8d?q=80&w=1200&auto=format&fit=crop', website: 'https://example.com', category: 'Co-Sponsor', description: 'Real-time analytics and dashboards for modern businesses.', industry: 'Analytics' },
  { id: 'c3', name: 'NimbusNet', image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop', website: 'https://example.com', category: 'Co-Sponsor', description: 'Reliable cloud networking and edge distribution.', industry: 'Networking' }
];

const Sponsors = () => {
  return (
    <div className="sponsors-page sponsors-theme professional">
      <section className="sponsors-hero">
        <div className="hero-content">
          <h1>Our Sponsors</h1>
          <p>We extend our heartfelt gratitude to our sponsors and co-sponsors for their generous support in making DoTz V12.0 possible.</p>
        </div>
      </section>

      <section className="sponsors-section platinum">
        <div className="section-header">
          <span className="header-badge"><span className="badge-icon">🏆</span> Platinum Sponsors</span>
          <h2>Premier Partners</h2>
          <p>Industry leaders enabling innovation and excellence at DoTz.</p>
        </div>
        <div className="sponsors-grid premium">
          {sponsors.map((s) => (
            <div className="sponsor-card premium" key={s.id}>
              <div className="sponsor-image">
                <img src={s.image} alt={s.name} />
                <div className="image-overlay">
                  <span className="category-badge platinum">{s.category}</span>
                </div>
                <div className="industry-tag">{s.industry}</div>
              </div>
              <div className="card-body">
                <h3 className="sponsor-name">{s.name}</h3>
                <p className="sponsor-description">{s.description}</p>
              </div>
              <div className="card-footer">
                <a href={s.website} target="_blank" rel="noreferrer" className="btn btn-primary btn-full">
                  Visit Website
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sponsors-section co-sponsors">
        <div className="section-header">
          <span className="header-badge"><span className="badge-icon">🤝</span> Co‑Sponsors</span>
          <h2>Supporting Partners</h2>
          <p>Valued partners helping us broaden our impact across domains.</p>
        </div>
        <div className="sponsors-grid standard">
          {coSponsors.map((s) => (
            <div className="sponsor-card co-sponsor" key={s.id}>
              <div className="sponsor-image">
                <img src={s.image} alt={s.name} />
                <div className="image-overlay">
                  <span className="category-badge co-sponsor">{s.category}</span>
                </div>
                <div className="industry-tag">{s.industry}</div>
              </div>
              <div className="card-body">
                <h3 className="sponsor-name">{s.name}</h3>
                <p className="sponsor-description">{s.description}</p>
              </div>
              <div className="card-footer">
                <a href={s.website} target="_blank" rel="noreferrer" className="btn btn-outline btn-full">
                  Visit Website
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="become-sponsor">
        <div className="container cta-content">
          <span className="cta-icon">⭐</span>
          <h2>Become a Sponsor</h2>
          <p>Partner with us to support innovation and talent. Showcase your brand to a national audience of budding technologists.</p>
          <div className="cta-buttons">
            <a href="#contact" className="btn btn-primary">Contact Us</a>
            <a href="#brochure" className="btn btn-outline">Download Brochure</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sponsors;
