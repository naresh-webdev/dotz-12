import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
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

      {/* Page Header Section */}
      <header className="page-header">
        <h1>About DoTz V12.0</h1>
        <p>Celebrating the 12th year of Innovation, Excellence, and Technical Brilliance</p>
      </header>

      {/* Coordinators Section */}
      <section className="coordinators-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Meet Our Team</h2>
          </div>
          
          {/* Symposium Coordinator */}
          <div className="coordinator-category">
            <h3 className="category-title">Symposium Coordinator</h3>
            <div className="coordinator-card primary-coordinator">
              <div className="coordinator-info">
                <h4 className="coordinator-name">Dr. R. Shyamala</h4>
                <p className="coordinator-position">AP/IT</p>
                <a href="tel:+919791194793" className="coordinator-phone">+91 9791194793</a>
              </div>
            </div>
          </div>

          {/* Student Coordinators */}
          <div className="coordinator-category">
            <h3 className="category-title">Student Coordinators</h3>
            <div className="coordinators-grid">
              <div className="coordinator-card">
                <div className="coordinator-info">
                  <h4 className="coordinator-name">Mr. D. Ram Mrithyun Jay</h4>
                  <p className="coordinator-position">Secretary</p>
                  <a href="tel:+918072375560" className="coordinator-phone">+91 8072 375 560</a>
                </div>
              </div>
              <div className="coordinator-card">
                <div className="coordinator-info">
                  <h4 className="coordinator-name">Ms. S. Rakshaya</h4>
                  <p className="coordinator-position">Treasurer</p>
                  <a href="tel:+918015181982" className="coordinator-phone">+91 8015181982</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="card mission-card">
              <div className="card-icon">🎯</div>
              <h2>Our Mission</h2>
              <p>To create exceptional learning experiences that inspire innovation and foster meaningful connections between students and industry professionals.</p>
            </div>
            <div className="card vision-card">
              <div className="card-icon">🚀</div>
              <h2>Our Vision</h2>
              <p>To be the leading platform for transformative events that bridge technical expertise and creative expression.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">12th</div>
              <div className="stat-label">Year of Legacy</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">8+</div>
              <div className="stat-label">Amazing Events</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Participants Expected</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Colleges Participating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
