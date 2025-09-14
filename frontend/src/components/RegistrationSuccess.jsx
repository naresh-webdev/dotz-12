import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './RegistrationSuccess.css';

export default function RegistrationSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOnSpot, teamData } = location.state || {};

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="success-title">Registration Successful!</h1>
        <p className="success-message">
          {isOnSpot 
            ? "Your on-spot registration has been completed successfully!" 
            : "Your online registration has been completed successfully!"}
        </p>
        
        {isOnSpot ? (
          <div className="onspot-info">
            <h2 className="onspot-title">On-Spot Registration Details</h2>
            <p className="onspot-text">
              Please visit the registration desk between <strong>9:00 AM to 10:00 AM on September 15th</strong> to complete your registration process.
            </p>
            <p className="onspot-text">
              Bring your college ID card and any other required documents.
            </p>
          </div>
        ) : (
          <div className="online-info">
            <h2 className="online-title">Next Steps</h2>
            <p className="online-text">
              You will receive a confirmation email with your registration details shortly.
            </p>
            <p className="online-text">
              Please keep an eye on your email for further instructions and event updates.
            </p>
          </div>
        )}

        {teamData && (
          <div className="team-details">
            <h3 className="team-title">Registration Summary</h3>
            <div className="team-info">
              <p><strong>Team Leader:</strong> {teamData.leaderName}</p>
              <p><strong>College:</strong> {teamData.collegeName}</p>
              <p><strong>Participants:</strong> {teamData.participantCount}</p>
            </div>
          </div>
        )}

        <button className="home-button" onClick={handleGoHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
}