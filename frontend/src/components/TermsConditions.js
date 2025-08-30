import React from 'react';
import './TermsConditions.css';

const TermsConditions = () => {
  return (
    <div className="terms-conditions-page">
      {/* Page Header */}
      <header className="page-header">
        <h1>Terms & Conditions</h1>
        <p>Please read these terms carefully before registration</p>
      </header>

      <div className="container">
        <div className="policy-content">
          <section className="policy-section">
            <p>These Terms and Conditions govern your use of our website and participation in our services/events. By accessing our website or making payments, you agree to comply with the following terms:</p>
          </section>

          <section className="policy-section">
            <h2>General</h2>
            <ul>
              <li>All users must provide accurate and complete information during registration.</li>
              <li>Payments are processed securely through Cashfree. We do not store your financial data.</li>
              <li>Registration fees, once paid, are non-refundable except as outlined in our Refund & Cancellation Policy.</li>
              <li>We reserve the right to update event details (such as venue, timing, or format) and will notify participants via email/website.</li>
              <li>Unauthorized or fraudulent use of this website may result in cancellation of registration without refund.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>User Responsibilities</h2>
            <ul>
              <li>You agree not to misuse the website for unlawful purposes.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials (if applicable).</li>
              <li>Any violation of these terms may result in immediate termination of access.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>Intellectual Property</h2>
            <p>All content on this website, including text, graphics, logos, and images, is the property of DoTz V12.0 and University College of Engineering Tindivanam and may not be reproduced without permission.</p>
          </section>

          <section className="policy-section">
            <h2>Event Participation</h2>
            <ul>
              <li>Participants must adhere to event rules and guidelines.</li>
              <li>We reserve the right to disqualify participants for misconduct or rule violations.</li>
              <li>Event schedules and formats may be subject to change based on circumstances.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>Limitation of Liability</h2>
            <p>We are not responsible for any indirect, incidental, or consequential damages arising from the use of our website or participation in our events. Our liability is limited to the amount paid for registration.</p>
          </section>

          <section className="policy-section">
            <h2>Governing Law</h2>
            <p>All disputes are subject to the exclusive jurisdiction of courts in Tindivanam, Tamil Nadu, India.</p>
          </section>

          <section className="policy-section">
            <h2>Contact Information</h2>
            <p>For any questions regarding these terms, please contact us at:</p>
            <ul>
              <li>Email: <a href="mailto:dotzversion12@gmail.com">dotzversion12@gmail.com</a></li>
              <li>Phone: +91 9344735611</li>
              <li>Address: University College of Engineering Tindivanam</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;