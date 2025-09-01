import React from 'react';

import { useNavigate } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="contact-page enhanced">
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
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Reach out for queries about DoTz V12.0.</p>
      </header>

      <div className="contact-layout">
        <aside className="contact-panel enhanced">
          <div className="panel-header">
            <svg className="panel-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h2>Contact Information</h2>
          </div>
          <div className="contact-methods">
            <div className="contact-item">
              <div className="contact-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="contact-details">
                <h3>Email</h3>
                <a href="mailto:dotzversion12@gmail.com">dotzversion12@gmail.com</a>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="contact-details">
                <h3>Student Coordinators</h3>
                <a href="tel:+919344735611">+91 9344735611</a>
                <a href="tel:+917010658799">+91 7010658799</a>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="contact-details">
                <h3>Address</h3>
                <span>University College of Engineering Tindivanam</span>
                <span>Melpakkam, Tamil Nadu, 604307</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="contact-form-wrapper enhanced">
          <div className="form-header">
            <svg className="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2>Send us a Message</h2>
            <p>Fill out the form below and we'll get back to you as soon as possible.</p>
          </div>
          <form className="contact-form enhanced">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input 
                  id="name" 
                  name="name"
                  type="text" 
                  placeholder="Your full name" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="you@example.com" 
                  required 
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea 
                id="message" 
                name="message"
                placeholder="Tell us about your query or how we can help you..."
                rows="6"
                required 
              />
            </div>
            <div className="form-actions">
              <a 
                href="mailto:dotzversion12@gmail.com?subject=DoTz V12.0 Inquiry&body=Hello DoTz Team,%0A%0AI have a question about DoTz V12.0:%0A%0A" 
                className="submit-btn"
              >
                <svg className="send-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Message
              </a>
            </div>
          </form>
        </section>
      </div>

      <section className="map-section">
        <div className="map-header">
          <svg className="map-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h2>Find Us</h2>
          <p>Visit our campus located in the heart of Tamil Nadu</p>
        </div>
        <div className="map-container">
          <div className="map-frame">
            <iframe
              title="University College of Engineering Tindivanam"
              src="https://www.google.com/maps?q=University%20College%20of%20Engineering%20Tindivanam&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
