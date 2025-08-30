import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page">
      {/* Page Header */}
      <header className="page-header">
        <h1>Privacy Policy</h1>
        <p>Your privacy is important to us</p>
      </header>

      <div className="container">
        <div className="policy-content">
          <section className="policy-section">
            <p>At DoTz V12.0, we are committed to protecting your privacy and ensuring that your personal information is handled safely and responsibly. This Privacy Policy explains how we collect, use, and safeguard the information you provide when you use our website and services.</p>
          </section>

          <section className="policy-section">
            <h2>Information We Collect</h2>
            <p>When you interact with our website, we may collect:</p>
            <ul>
              <li><strong>Personal Information:</strong> Name, email address, phone number, and other details provided during registration or inquiry.</li>
              <li><strong>Payment Information:</strong> While making payments, your transaction details are processed securely by our payment gateway partner (Cashfree). We do not store your credit card, debit card, or banking details.</li>
              <li><strong>Technical Information:</strong> IP address, browser type, device information, and cookies to enhance user experience.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul>
              <li>Process and confirm registrations, orders, or payments.</li>
              <li>Provide you with updates regarding events, services, or account-related notifications.</li>
              <li>Improve our services, website performance, and user experience.</li>
              <li>Respond to queries, requests, or complaints.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>Data Security</h2>
            <p>We adopt industry-standard security measures to safeguard your data, including SSL encryption and secure payment gateways. However, no electronic storage or transmission method is 100% secure, and we cannot guarantee absolute data security.</p>
          </section>

          <section className="policy-section">
            <h2>Sharing of Information</h2>
            <p>We do not sell, trade, or rent users' personal information. Your information may only be shared with:</p>
            <ul>
              <li>Trusted third-party service providers who help us operate our website and conduct business.</li>
              <li>Legal authorities when required by law or to protect against fraud and misuse.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>User Rights</h2>
            <p>You have the right to access, correct, or request deletion of your personal information by contacting us at <a href="mailto:dotzversion12@gmail.com">dotzversion12@gmail.com</a> or +91 9344735611.</p>
          </section>

          <section className="policy-section">
            <h2>Changes to Privacy Policy</h2>
            <p>We reserve the right to update this Privacy Policy at any time. Updates will be posted on this page.</p>
          </section>

          <section className="policy-section">
            <h2>Contact Us</h2>
            <p>For any privacy-related concerns, please contact us at:</p>
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

export default PrivacyPolicy;