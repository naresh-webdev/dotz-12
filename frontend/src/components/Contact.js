import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page minimal">
      <header className="contact-header">
        <h1>Contact Us</h1>
        <p>We’d love to hear from you. Reach out for queries about DoTz V12.0.</p>
      </header>

      <div className="contact-layout">
        <aside className="contact-panel">
          <div className="panel-section">
            <h2>Contact Information</h2>
            <ul className="info-list">
              <li>
                <span className="info-label">Email</span>
                <span className="info-value"><a href="mailto:dotzversion11@gmail.com">dotzversion11@gmail.com</a></span>
              </li>
              <li>
                <span className="info-label">Student Coordinators</span>
                <span className="info-value">
                  <span>+91 9566778342</span>
                  <span>+91 9876543210</span>
                </span>
              </li>
              <li>
                <span className="info-label">Address</span>
                <span className="info-value">
                  <span>University College of Engineering Tindivanam</span>
                  <span>Melpakkam, Tamil Nadu, 604307</span>
                </span>
              </li>
            </ul>
          </div>
        </aside>

        <section className="contact-form-wrapper">
          <form className="contact-form minimal" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input id="name" type="text" placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" placeholder="you@example.com" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" placeholder="How can we help?" required />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Send Message</button>
            </div>
          </form>
        </section>
      </div>

      <section className="map-block" id="map">
        <h2>Location</h2>
        <div className="map-frame">
          <iframe
            title="University College of Engineering Tindivanam"
            src="https://www.google.com/maps?q=University%20College%20of%20Engineering%20Tindivanam&output=embed"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
};

export default Contact;
