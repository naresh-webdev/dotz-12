import React from 'react';

import './About.css';

const About = () => {
  return (
    <div className="about-page">
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
            <p className="section-subtitle">Dedicated professionals making DoTz V12.0 possible</p>
          </div>
          
          {/* Symposium Coordinator */}
          <div className="coordinator-category">
            <h3 className="category-title">Symposium Coordinator</h3>
            <div className="coordinator-card primary-coordinator">
              <div className="coordinator-info">
                <h4 className="coordinator-name">Dr. R. Shyamala</h4>
                <p className="coordinator-position">AP/IT</p>
                <p className="coordinator-role">Symposium Coordinator</p>
                <a href="tel:+919791194793" className="coordinator-phone">+91 9791194793</a>
              </div>
            </div>
          </div>

          {/* Organizing Committee */}
          <div className="coordinator-category">
            <h3 className="category-title">Organizing Committee</h3>
            <div className="coordinators-grid">
              <div className="coordinator-card">
                <div className="coordinator-info">
                  <h4 className="coordinator-name">Mr. Vikram Singh</h4>
                  <p className="coordinator-position">Teaching Fellow / IT</p>
                  <p className="coordinator-role">Coordinator</p>
                  <a href="tel:+919887654321" className="coordinator-phone">+91 9887654321</a>
                </div>
              </div>
              <div className="coordinator-card">
                <div className="coordinator-info">
                  <h4 className="coordinator-name">Dr. Anitha Menon</h4>
                  <p className="coordinator-position">Associate Professor / IT</p>
                  <p className="coordinator-role">Coordinator</p>
                  <a href="tel:+919776543210" className="coordinator-phone">+91 9776543210</a>
                </div>
              </div>
              <div className="coordinator-card">
                <div className="coordinator-info">
                  <h4 className="coordinator-name">Mr. Deepak Chandra</h4>
                  <p className="coordinator-position">Teaching Fellow / IT</p>
                  <p className="coordinator-role">Coordinator</p>
                  <a href="tel:+919665432109" className="coordinator-phone">+91 9665432109</a>
                </div>
              </div>
            </div>
          </div>

          {/* Student Coordinators */}
          <div className="coordinator-category">
            <h3 className="category-title">Student Coordinators</h3>
            <div className="coordinators-grid">
              <div className="coordinator-card">
                <div className="coordinator-info">
                  <h4 className="coordinator-name">Ms. Divya Nair</h4>
                  <p className="coordinator-position">Student</p>
                  <p className="coordinator-role">Secretary</p>
                  <a href="tel:+919554433221" className="coordinator-phone">+91 9554433221</a>
                </div>
              </div>
              <div className="coordinator-card">
                <div className="coordinator-info">
                  <h4 className="coordinator-name">Ms. S. Rakshaya</h4>
                  <p className="coordinator-position">Student</p>
                  <p className="coordinator-role">Treasurer</p>
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
              <p>To create exceptional learning experiences that inspire innovation and foster meaningful connections between professionals, students, and industry leaders across technical and creative domains.</p>
            </div>
            <div className="card vision-card">
              <div className="card-icon">🚀</div>
              <h2>Our Vision</h2>
              <p>To be the leading platform for transformative events that bridge the gap between technical expertise and creative expression, empowering the next generation of innovators.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Makes DOTZ Special</h2>
            <p className="section-subtitle">Excellence in Every Aspect</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3>Technical Excellence</h3>
              <p>Cutting-edge technical events including coding challenges, algorithm competitions, and innovative design battles.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎭</div>
              <h3>Creative Expression</h3>
              <p>Non-technical events that celebrate creativity, communication skills, and artistic talents.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Recognition & Prizes</h3>
              <p>Attractive prizes, certificates, and recognition for all participants and winners.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Networking</h3>
              <p>Connect with like-minded individuals, industry professionals, and potential collaborators.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Learning Experience</h3>
              <p>Workshops, seminars, and hands-on sessions with industry experts and experienced professionals.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌟</div>
              <h3>Innovation Hub</h3>
              <p>Platform for showcasing innovative ideas, projects, and breakthrough solutions.</p>
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

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Be Part of DOTZ v12?</h2>
            <p>Join us for an unforgettable experience of learning, competition, and innovation.</p>
            <div className="cta-buttons">
              <a href="/register" className="btn btn-primary">Register Now</a>
              <a href="/events" className="btn btn-secondary">Explore Events</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
