import React from 'react';
import './RefundPolicy.css';

const RefundPolicy = () => {
  return (
    <div className="refund-policy-page">
      {/* Page Header */}
      <header className="page-header">
        <h1>Refund & Cancellation Policy</h1>
        <p>Our refund and cancellation terms</p>
      </header>

      <div className="container">
        <div className="policy-content">
          <section className="policy-section">
            <p>We strive to provide a seamless and transparent registration/payment experience. Please review our refund and cancellation guidelines below:</p>
          </section>

          <section className="policy-section">
            <h2>Event Registrations / Services</h2>
            <ul>
              <li>Once a registration/payment is successfully made, it is non-refundable and non-transferable.</li>
              <li>In the event of duplicate or accidental payment, kindly notify us immediately at <a href="mailto:dotzversion12@gmail.com">dotzversion12@gmail.com</a> with transaction details. After verification, the extra amount will be refunded within 7–10 business days.</li>
              <li>If an event/service is cancelled by us (organizers), a full refund will be initiated to the original payment source within 7–10 business days.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>Technical Failures</h2>
            <p>If payment is debited from your account but not reflected in our system, please contact us with proof of payment (transaction ID, screenshot, etc.). We will reconcile with our payment gateway and resolve the issue.</p>
          </section>

          <section className="policy-section">
            <h2>Refund Processing</h2>
            <ul>
              <li>Refunds will only be made through the original payment method used during the transaction.</li>
              <li>Processing times may vary depending on your bank/payment provider.</li>
              <li>You will receive an email confirmation once the refund is initiated.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>Contact for Queries</h2>
            <p>For refund or cancellation queries, contact us at:</p>
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

export default RefundPolicy;