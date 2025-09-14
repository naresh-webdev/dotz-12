import React from "react";
import { useNavigate } from "react-router-dom";
import './RegistrationStatus.css';

export default function RegistrationStatus() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="registration-status-page">
      <div className="status-container">
        <div className="status-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="status-title">Registration Information</h1>
        
        <div className="status-message online-registration">
          <h2 className="status-subtitle">Online Registration</h2>
          <p className="status-text">The online registration period has ended. Thank you for your interest!</p>
        </div>
        
        <div className="status-message onspot-registration">
          <h2 className="status-subtitle">On-Spot Registration</h2>
          <p className="status-text">On-Spot Registration is available on <strong>15th September 2025</strong> from <strong>9:00 AM to 10:00 AM</strong> at the registration desk.</p>
          <p className="status-details">Please bring your college ID card </p>
        </div>
        
        <div className="status-additional-info">
          <h3 className="info-title">Important Notes</h3>
          <ul className="info-list">
            <li className="info-item">Registration fee: ₹250 (on-spot)</li>
            <li className="info-item">Event date: 15th September 2025</li>
            <li className="info-item">Event timings: 9:00 AM to 4:00 PM</li>
          </ul>
        </div>
        
        <button className="home-button" onClick={handleGoHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
}