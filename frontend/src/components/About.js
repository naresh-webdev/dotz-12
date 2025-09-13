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
                <a href="tel:+919791194793" className="coordinator-phone">+91 97911 94793</a>
              </div>
            </div>
          </div>

          {/* Student Coordinators */}
          <div className="coordinator-category">
            <h3 className="category-title">Student Coordinators</h3>
            <div className="coordinators-grid">
              <div className="coordinator-card">
                <div className="coordinator-info">
                  <h4 className="coordinator-name">D. Ram Mrithyun Jay</h4>
                  <p className="coordinator-position">Secretary</p>
                  <a href="tel:+918072375560" className="coordinator-phone">+91 80723 75560</a>
                </div>
              </div>
              <div className="coordinator-card">
                <div className="coordinator-info">
                  <h4 className="coordinator-name">S. Rakshaya</h4>
                  <p className="coordinator-position">Treasurer</p>
                  <a href="tel:+918015181982" className="coordinator-phone">+91 80151 81982</a>
                </div>
              </div>
            </div>
          </div>

          {/* Event Coordinators */}
          <div className="coordinator-category">
            <h3 className="category-title">Event Coordinators</h3>
            
            {/* Technical Events */}
            <h4 className="category-subtitle">Technical Events</h4>
            <div className="coordinators-grid">
              <div className="coordinator-card">
                <div className="coordinator-info">
                  <h4 className="coordinator-name">T. Akalya</h4>
                  <p className="coordinator-position">Brain Compiler</p>
                  <a href="tel:+916374772083" className="coordinator-phone">+91 63747 72083</a>
                </div>
              </div>
              <div className="coordinator-card">
                <div className="coordinator-info">
                  <h4 className="coordinator-name">D. Monish</h4>
                  <p className="coordinator-position">Design Warrior</p>
                  <a href="tel:+919500377213" className="coordinator-phone">+91 95003 77213</a>
                </div>
              </div>
              <div className="coordinator-card">
                <div className="coordinator-info">
                  <h4 className="coordinator-name">M. Varun Karthikeyan</h4>
                  <p className="coordinator-position">Algoverse X</p>
                  <a href="tel:+919994945451" className="coordinator-phone">+91 99949 45451</a>
                </div>
              </div>
              <div className="coordinator-card">
                <div className="coordinator-info">
                  <h4 className="coordinator-name">G. Vetriselvan</h4>
                  <p className="coordinator-position">Vision X</p>
                  <a href="tel:+918438932796" className="coordinator-phone">+91 84389 32796</a>
                </div>
              </div>
            </div>
            
            {/* Non-Technical Events */}
            <h4 className="category-subtitle">Non-Technical Events</h4>
            <div className="coordinators-grid">
              <div className="coordinator-card">
                <div className="coordinator-info">
                  <h4 className="coordinator-name">P. Baskar</h4>
                  <p className="coordinator-position">Just a Minute</p>
                  <a href="tel:+918220802116" className="coordinator-phone">+91 90476 48112</a>
                </div>
              </div>
              <div className="coordinator-card">
                <div className="coordinator-info">
                  <h4 className="coordinator-name">G. Ramya</h4>
                  <p className="coordinator-position">Rhythm and Rhyme</p>
                  <a href="tel:+919600334898" className="coordinator-phone">+91 96003 34898</a>
                </div>
              </div>
              <div className="coordinator-card">
                <div className="coordinator-info">
                  <h4 className="coordinator-name">K. Yuvaraj</h4>
                  <p className="coordinator-position">Booyah Carnival</p>
                  <a href="tel:+919047569880" className="coordinator-phone">+91 90475 69880</a>
                </div>
              </div>
              <div className="coordinator-card">
                <div className="coordinator-info">
                  <h4 className="coordinator-name">S. Dhanalakshmi</h4>
                  <p className="coordinator-position">Catch and Crunch</p>
                  <a href="tel:+919585382291" className="coordinator-phone">+91 95853 82291</a>
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
