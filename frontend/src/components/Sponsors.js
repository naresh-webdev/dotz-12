import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sponsors.css';

const sponsors = [
  // Premium sponsors from event posters
  { id: 's2', name: 'KRS AMMA MAHAL', image: require('../images/event_posters/krs.jpeg'), website: 'https://maps.app.goo.gl/FyPd8hL1wmaHFSjC6', category: 'Platinum', description: 'Elegant marriage hall providing exceptional venues for weddings and special occasions.' },
  { id: 's1', name: 'GD TURF', image: require('../images/event_posters/gd_turf.jpeg'), website: 'https://maps.app.goo.gl/1Qn1UMxPgCwSxMveA  ', category: 'Platinum', description: 'Premium synthetic turf solutions for sports and recreational facilities.' },
  { id: 's3', name: 'DEEPHAM HOSPITAL', image: require('../images/event_posters/deepham.jpeg'), website: 'https://maps.app.goo.gl/C8raM9b9KePDDodc8', category: 'Platinum', description: 'Comprehensive healthcare services with advanced medical facilities and expert care.' },
  { id: 's4', name: 'VEL COMPUTERS', image: require('../images/event_posters/VELS.jpg'), website: 'https://maps.app.goo.gl/qybug61CFRqvUf3a6', category: 'Platinum', description: 'Leading computer hardware and software solutions provider for businesses and individuals.' }
];

const coSponsors = [
  // Additional sponsors from event posters
  { id: 'c1', name: 'BISMI SPORTS WORLD', image: require('../images/event_posters/bishi.jpeg'), website: 'https://maps.app.goo.gl/Sw2VgFfCFgSgpL6Q7', category: 'Co-Sponsor', description: 'Quality sports equipment and accessories for athletes of all levels.' },
  { id: 'c2', name: 'PRS', image: require('../images/event_posters/prs.jpeg'), website: 'http://www.prsandco.in/', category: 'Co-Sponsor', description: 'Professional business solutions and consulting services.' },
  { id: 'c3', name: 'B2 MOBILES', image: require('../images/event_posters/b2.jpeg'), website: 'https://maps.app.goo.gl/mXDLMVQzgb2BuvmVA', category: 'Co-Sponsor', description: 'Mobile technology retailer with latest smartphones and accessories.' },
  { id: 'c4', name: 'K PAUL PANDIAN PAATHIRAKADAI', image: require('../images/event_posters/palpandiyan.jpeg'), website: 'https://maps.app.goo.gl/q2hCyJESdN46dE7o8', category: 'Co-Sponsor', description: 'Reliable vessel store offering quality kitchenware and household essentials.' },
  { id: 'c5', name: 'SS METRO BAZAR', image: require('../images/event_posters/metro.jpg'), website: 'https://maps.app.goo.gl/4TMr1xqvjgMEWKw7A', category: 'Co-Sponsor', description: 'Your trusted local supermarket for all daily needs and groceries.' },
  { id: 'c6', name: 'SS JEWELLERY', image: require('../images/event_posters/ss.jpg'), website: 'https://maps.app.goo.gl/iQm1yqFtybJo8nYX8', category: 'Co-Sponsor', description: 'Exquisite jewelry collection for all your special occasions and everyday elegance.' },
  { id: 'c7', name: 'SANKAR JEWELLERY', image: require('../images/event_posters/sankar.jpeg'), website: 'https://maps.app.goo.gl/LQW8PeZF7MPWQAUX7  ', category: 'Co-Sponsor', description: 'Traditional and contemporary jewelry designs for all your precious moments.' }
];

const Sponsors = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate('/contact');
  };

  const handleBrochureClick = (e) => {
    e.preventDefault();
    const brochureUrl = require('../images/event_posters/brochure.pdf');
    window.open(brochureUrl, '_blank');
  };

  return (
    <div className="sponsors-page sponsors-theme professional">
      {/* Back Button */}
      <div className="back-button-container">
        <button 
          type="button" 
          onClick={() => navigate(-1)} 
          className="back-button"
          aria-label="Go back"
        >
          <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

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
              </div>
              <div className="card-body">
                <h3 className="sponsor-name">{s.name}</h3>
                <p className="sponsor-description">{s.description}</p>
              </div>
              <div className="card-footer">
                <a href={s.website} target="_blank" rel="noreferrer" className="btn btn-primary btn-full">
                  Visit
                  <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
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
              </div>
              <div className="card-body">
                <h3 className="sponsor-name">{s.name}</h3>
                <p className="sponsor-description">{s.description}</p>
              </div>
              <div className="card-footer">
                <a href={s.website} target="_blank" rel="noreferrer" className="btn btn-outline btn-full">
                  Visit
                  <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
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
            <button onClick={handleContactClick} className="btn btn-primary">
              Contact Us
            </button>
            <button onClick={handleBrochureClick} className="btn btn-outline">
              Download Brochure
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sponsors;