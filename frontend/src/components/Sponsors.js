import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sponsors.css';

const sponsors = [
  // Premium sponsors (₹2000 or more) sorted by amount in descending order
  { id: 's1', name: 'SS JEWELLERY', image: require('../images/event_posters/ss.jpg'), website: 'https://maps.app.goo.gl/iQm1yqFtybJo8nYX8', category: 'Platinum', description: 'Exquisite jewelry collection for all your special occasions and everyday elegance.' },
  { id: 's2', name: 'SRI BALAJI NAGAR', image: null, website: 'https://maps.app.goo.gl/sRnKYbzGq5iTrxkr5', category: 'Platinum', description: 'Comprehensive services with quality offerings for community needs.' },
  { id: 's3', name: 'SAAMY CLINIC', image: require('../images/event_posters/saamy.jpg'), website: '#', category: 'Platinum', description: 'Comprehensive healthcare services with advanced medical facilities and expert care.' },
  { id: 's4', name: 'VETRI THEATRE', image: require('../images/event_posters/vetri.jpg'), website: '#', category: 'Platinum', description: 'Premier entertainment destination providing exceptional cinematic experiences for movie lovers.' },
  { id: 's5', name: 'KRS AMMA MAHAL', image: require('../images/event_posters/krs.jpeg'), website: 'https://maps.app.goo.gl/FyPd8hL1wmaHFSjC6', category: 'Platinum', description: 'Elegant marriage hall providing exceptional venues for weddings and special occasions.' },
  { id: 's6', name: 'SANKAR JEWELLERY', image: require('../images/event_posters/sankar.jpeg'), website: 'https://maps.app.goo.gl/LQW8PeZF7MPWQAUX7', category: 'Platinum', description: 'Traditional and contemporary jewelry designs for all your precious moments.' },
  { id: 's7', name: 'GD TURF', image: require('../images/event_posters/gd_turf.jpeg'), website: 'https://maps.app.goo.gl/1Qn1UMxPgCwSxMveA', category: 'Platinum', description: 'Premium synthetic turf solutions for sports and recreational facilities.' },
  { id: 's8', name: 'MAHARAJA TRADERS', image: require('../images/event_posters/magaraja.jpg'), website: '#', category: 'Platinum', description: 'Trusted supplier of electrical equipment, hardware tools, and quality paints for residential and commercial needs.' },
  { id: 's9', name: 'DEEPHAM HOSPITAL', image: require('../images/event_posters/deepham.jpeg'), website: 'https://maps.app.goo.gl/C8raM9b9KePDDodc8', category: 'Platinum', description: 'Comprehensive healthcare services with advanced medical facilities and expert care.' },
  { id: 's10', name: 'VEL COMPUTERS', image: require('../images/event_posters/VELS.jpg'), website: 'https://maps.app.goo.gl/qybug61CFRqvUf3a6', category: 'Platinum', description: 'Computer hardware components including printers, toners, and essential computer parts.' }
];

const coSponsors = [
  // Co-sponsors (less than ₹2000) sorted by amount in descending order
  { id: 'c1', name: 'KADAR BHAI BIRIYANI', image: require('../images/event_posters/kadar.jpg'), website: 'https://maps.app.goo.gl/QNGhaQGMvZRCoeai6', category: 'Co-Sponsor', description: 'Authentic biriyani specialists serving delicious and flavorful meals for food lovers.' },
  { id: 'c2', name: 'SS METRO BAZAR', image: require('../images/event_posters/metro.jpg'), website: 'https://maps.app.goo.gl/4TMr1xqvjgMEWKw7A', category: 'Co-Sponsor', description: 'Your trusted local supermarket for all daily needs and groceries.' },
  { id: 'c3', name: 'FREEDOM BOYS', image: require('../images/event_posters/freedom.jpg'), website: 'https://maps.app.goo.gl/5zG1Z3zHZhw4rcmz7', category: 'Co-Sponsor', description: 'Quality textile solutions and fashion wear for all occasions.' },
  { id: 'c4', name: 'SM CLINIC', image: require('../images/event_posters/sm.jpg'), website: 'https://maps.app.goo.gl/ydMb19XLnTze3Z8p7', category: 'Co-Sponsor', description: 'Comprehensive medical and wellness services for the community.' },
  { id: 'c5', name: 'JAYAN FITNESS SCHOOL', image: require('../images/event_posters/jayan.jpeg'), website: 'https://maps.app.goo.gl/yRfXCRwqUk1nmJwH7', category: 'Co-Sponsor', description: 'Professional fitness training and wellness programs for all ages.' },
  { id: 'c6', name: 'KSM KARTHIK MC', image: null, website: 'https://maps.app.goo.gl/rNxGHzTcPUTZFZQC8', category: 'Co-Sponsor', description: 'Quality services for all your entertainment needs.' },
  { id: 'c7', name: 'VVV JEWELLERS', image: require('../images/event_posters/vvv.JPG'), website: 'https://maps.app.goo.gl/x6yVHfa5YYPW4Gkm7', category: 'Co-Sponsor', description: 'Exquisite jewelry collection offering traditional and contemporary designs for all special occasions.' },
  { id: 'c8', name: 'PRS', image: require('../images/event_posters/prs.jpeg'), website: 'http://www.prsandco.in/', category: 'Co-Sponsor', description: 'Textile solutions and fashion wear for all occasions.' },
  { id: 'c9', name: 'B2 MOBILES', image: require('../images/event_posters/b2.jpeg'), website: 'https://maps.app.goo.gl/mXDLMVQzgb2BuvmVA', category: 'Co-Sponsor', description: 'Mobile technology retailer with latest smartphones and accessories.' },
  { id: 'c10', name: 'K PAUL PANDIAN PAATHIRAKADAI', image: require('../images/event_posters/palpandiyan.jpeg'), website: 'https://maps.app.goo.gl/q2hCyJESdN46dE7o8', category: 'Co-Sponsor', description: 'Reliable vessel store offering quality kitchenware and household essentials.' },
  { id: 'c11', name: 'KAMALAM AGORA AGENCIES TINDIVANAM', image: null, website: 'https://maps.app.goo.gl/1t9Qks7Q9KrpnmVw8', category: 'Co-Sponsor', description: 'Quality products and services for your daily needs.' },
  { id: 'c12', name: 'MARUTI FURNITURE ENTERPRISES', image: require('../images/event_posters/maruthi.jpg'), website: 'https://maps.app.goo.gl/gy32ZAxW6JfHZB8j7', category: 'Co-Sponsor', description: 'Quality furniture solutions for homes and offices with a wide range of stylish and durable products.' },
  { id: 'c13', name: 'AYINGARAN ENTERPRISES', image: require('../images/event_posters/ayingaran.JPG'), website: 'https://maps.app.goo.gl/qR6YtUUDb8iwwxjp8', category: 'Co-Sponsor', description: 'Reliable enterprise solutions providing quality services and products for business and individual needs.' },
  { id: 'c14', name: 'KASIM PAINT & CO', image: null, website: '#', category: 'Co-Sponsor', description: 'Premium paint solutions and home improvement products.' },
  { id: 'c15', name: 'BISMI SPORTS WORLD', image: require('../images/event_posters/bishi.jpeg'), website: 'https://maps.app.goo.gl/Sw2VgFfCFgSgpL6Q7', category: 'Co-Sponsor', description: 'Quality sports equipment and accessories for athletes of all levels.' }
];

// Helper component to render either an image or a text placeholder
const SponsorImage = ({ sponsor }) => {
  if (sponsor.image) {
    return <img src={sponsor.image} alt={sponsor.name} />;
  }
  
  // Text-based placeholder for sponsors without images
  return (
    <div className="sponsor-text-placeholder">
      <div className="placeholder-initials">
        {sponsor.name
          .split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
          .substring(0, 3)}
      </div>
      <div className="placeholder-name">{sponsor.name}</div>
    </div>
  );
};

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
                <SponsorImage sponsor={s} />
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
                <SponsorImage sponsor={s} />
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