import React, { useState } from "react";
import './FormRegister.css';
import { load } from "@cashfreepayments/cashfree-js";
import { useNavigate } from "react-router-dom";

const initialMember = {
  name: "",
  email: "",
  phone: "",
  registerNumber: "",
  foodPreference: "Vegetarian",
  gender: "Male",
  events: [], // Each member's events
};


const EVENT_OPTIONS = [
  "Paper Presentation",
  "Algoverse X",
  "Brain Compiler",
  "Design Warriors",
  "Non Technical",
];

const MEMBER_EVENT_OPTIONS = [
  "Algoverse X",
  "Brain Compiler",
  "Design Warriors",
  "Non Technical",
];

export default function FormRegister({ onSubmit }) {
  const [form, setForm] = useState({
    participantCount: "",
    leaderName: "",
    leaderPhoneNumber: "",
    leaderEmail: "",
    leaderRegisterNumber: "",
    leaderFoodPreference: "Vegetarian",
    leaderGender: "Male",
    collegeName: "",
    collegeId: "",
    members: [ { ...initialMember } ],
    leaderEvents: [],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handler for simple fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for Members
  const handleMemberChange = (idx, e) => {
    const { name, value } = e.target;
    const updated = form.members.map((m, i) =>
      i === idx ? { ...m, [name]: value } : m
    );
    setForm((prev) => ({ ...prev, members: updated }));
  };

  // Handler for member events (checkboxes)
  const handleMemberEventCheckbox = (memberIdx, eventName) => {
    setForm((prev) => {
      const membersCopy = prev.members.map((m, i) => {
        if (i !== memberIdx) return m;
        const alreadySelected = m.events.includes(eventName);
        if (alreadySelected) {
          return { ...m, events: m.events.filter(ev => ev !== eventName) };
        } else if (m.events.length < MEMBER_EVENT_OPTIONS.length) {
          return { ...m, events: [...m.events, eventName] };
        } else {
          return m;
        }
      });
      return { ...prev, members: membersCopy };
    });
  };

  // Handler for leaderEvents (checkboxes)
  const handleLeaderEventCheckbox = (eventName) => {
    setForm((prev) => {
      const alreadySelected = prev.leaderEvents.includes(eventName);
      if (alreadySelected) {
        return { ...prev, leaderEvents: prev.leaderEvents.filter(ev => ev !== eventName) };
      } else if (prev.leaderEvents.length < EVENT_OPTIONS.length) {
        return { ...prev, leaderEvents: [...prev.leaderEvents, eventName] };
      } else {
        return prev;
      }
    });
  };


  // Add/Remove Members
  const addMember = () => {
    if (form.members.length < 3)
      setForm((prev) => ({
        ...prev,
        members: [...prev.members, { ...initialMember }],
      }));
  };
  const removeMember = (idx) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== idx),
    }));
  };


// ---------- API Helpers ----------
  const submitTeamData = async (teamData) => {
    const response = await fetch("https://dotz-12-production.up.railway.app/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teamData),
    });
    if (!response.ok) throw new Error("Failed to register team");
    return response.json();
  };



  // ---------- Submit Handler ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    // compute the participantCount
    const participantCount = form.members.length + 1; // +1 for the leader
    // Validate leader events
    if (form.leaderEvents.length < 2) {
      alert("❌ Please select at least 2 events for the leader.");
      setLoading(false);
      return;
    }
    // Validate member events
    for (const mem of form.members) {
      if (mem.events.length < 1) {
        alert(`❌ Please select at least 1 event for member ${mem.name || ''}.`);
        setLoading(false);
        return;
      }
    }
    // Prepare form data with correct participantCount
    const formData = { ...form, participantCount };
    try {
      const response = await fetch("https://dotz-12-production.up.railway.app/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        navigate('/payment', {
          state: {
            orderId: result.orderId,
            paymentSessionId: result.paymentSessionId,
            teamData: result.team
          }
        });
      } else {
        alert("❌ Failed to get payment token from server.");
      }
    } catch (err) {
      alert("❌ Team registration failed after payment!");
      console.error("❌ Team registration failed:", err);
    }
    setLoading(false);
  };

  return (
    <div className="registration-page registration-form">
      {/* Back Button and Header */}
      <div className="page-header">
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
        <div className="header-content">
          <h1 className="page-title">Team Registration</h1>
          <p className="page-subtitle">Join DOTZ v12 - Register your team for an amazing experience!</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        {/* Leader Information Section */}
        <div className="form-section">
          <h3 className="section-title">
            <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Team Leader Information
          </h3>
          <div className="form-grid">
            <label className="form-label">
              <span className="label-text">Leader Name *</span>
              <input 
                name="leaderName" 
                value={form.leaderName} 
                onChange={handleChange} 
                placeholder="Enter leader name" 
                required 
                className="form-input" 
              />
            </label>
            <label className="form-label">
              <span className="label-text">Phone Number *</span>
              <input 
                name="leaderPhoneNumber" 
                value={form.leaderPhoneNumber} 
                onChange={handleChange} 
                placeholder="Enter phone number" 
                required 
                type="tel" 
                className="form-input" 
              />
            </label>
            <label className="form-label">
              <span className="label-text">Email Address *</span>
              <input 
                name="leaderEmail" 
                value={form.leaderEmail} 
                onChange={handleChange} 
                placeholder="Enter email address" 
                required 
                type="email" 
                className="form-input" 
              />
            </label>
            <label className="form-label">
              <span className="label-text">Register Number *</span>
              <input 
                name="leaderRegisterNumber" 
                value={form.leaderRegisterNumber} 
                onChange={handleChange} 
                placeholder="Enter register number" 
                required 
                type="text" 
                className="form-input" 
              />
            </label>
            <label className="form-label">
              <span className="label-text">Food Preference *</span>
              <select 
                name="leaderFoodPreference" 
                value={form.leaderFoodPreference} 
                onChange={handleChange} 
                required 
                className="form-select"
              >
                <option value="">Select preference</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
            </label>
            <label className="form-label">
              <span className="label-text">Gender *</span>
              <select 
                name="leaderGender" 
                value={form.leaderGender} 
                onChange={handleChange} 
                required 
                className="form-select"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
          </div>
        </div>

        {/* College Information Section */}
        <div className="form-section">
          <h3 className="section-title">
            <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            College Information
          </h3>
          <div className="form-grid">
            <label className="form-label">
              <span className="label-text">College Name *</span>
              <input 
                name="collegeName" 
                value={form.collegeName} 
                onChange={handleChange} 
                placeholder="Enter college name" 
                required 
                className="form-input" 
              />
            </label>
            <label className="form-label">
              <span className="label-text">College ID *</span>
              <input 
                name="collegeId" 
                value={form.collegeId} 
                onChange={handleChange} 
                placeholder="Enter college ID" 
                required 
                className="form-input" 
              />
            </label>
          </div>
        </div>

        {/* Leader Events Section */}
        <div className="form-section">
          <h3 className="section-title">
            <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Leader Events <span className="requirement-text">(Select minimum 2)</span>
          </h3>
          <div className="form-events-grid">
            {EVENT_OPTIONS.map((eventName) => (
              <label key={eventName} className="form-event-option">
                <input
                  type="checkbox"
                  checked={form.leaderEvents.includes(eventName)}
                  onChange={() => handleLeaderEventCheckbox(eventName)}
                  disabled={
                    !form.leaderEvents.includes(eventName) && form.leaderEvents.length >= EVENT_OPTIONS.length
                  }
                  className="form-event-checkbox"
                />
                <span className="form-event-label">{eventName}</span>
              </label>
            ))}
          </div>
          <div className="selection-counter">
            Selected: {form.leaderEvents.length}/{EVENT_OPTIONS.length} events
          </div>
        </div>

        {/* Team Members Section */}
        <div className="form-section">
          <h3 className="section-title">
            <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Team Members <span className="requirement-text">(Maximum 3 members)</span>
          </h3>
          <div className="members-container">
            {form.members.map((member, idx) => (
              <div key={idx} className="member-card">
                <div className="member-header">
                  <h4 className="member-title">Member {idx + 1}</h4>
                  <button 
                    type="button" 
                    onClick={() => removeMember(idx)} 
                    className="remove-member-btn"
                    title="Remove member"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="form-grid">
                  <label className="form-label">
                    <span className="label-text">Name *</span>
                    <input 
                      name="name" 
                      value={member.name} 
                      onChange={(e) => handleMemberChange(idx, e)} 
                      placeholder="Enter member name" 
                      required 
                      className="form-input" 
                    />
                  </label>
                  <label className="form-label">
                    <span className="label-text">Email *</span>
                    <input 
                      name="email" 
                      value={member.email} 
                      onChange={(e) => handleMemberChange(idx, e)} 
                      placeholder="Enter email address" 
                      required 
                      type="email" 
                      className="form-input" 
                    />
                  </label>
                  <label className="form-label">
                    <span className="label-text">Phone *</span>
                    <input 
                      name="phone" 
                      value={member.phone} 
                      onChange={(e) => handleMemberChange(idx, e)} 
                      placeholder="Enter phone number" 
                      required 
                      type="tel" 
                      className="form-input" 
                    />
                  </label>
                  <label className="form-label">
                    <span className="label-text">Register Number *</span>
                    <input 
                      name="registerNumber" 
                      value={member.registerNumber} 
                      onChange={(e) => handleMemberChange(idx, e)} 
                      placeholder="Enter register number" 
                      required 
                      type="text" 
                      className="form-input" 
                    />
                  </label>
                  <label className="form-label">
                    <span className="label-text">Food Preference *</span>
                    <select 
                      name="foodPreference" 
                      value={member.foodPreference} 
                      onChange={(e) => handleMemberChange(idx, e)} 
                      required 
                      className="form-select"
                    >
                      <option value="">Select preference</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                    </select>
                  </label>
                  <label className="form-label">
                    <span className="label-text">Gender *</span>
                    <select 
                      name="gender" 
                      value={member.gender} 
                      onChange={(e) => handleMemberChange(idx, e)} 
                      required 
                      className="form-select"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </label>
                </div>
                <div className="member-events">
                  <span className="events-title">Events <span className="requirement-text">(Select minimum 1)</span></span>
                  <div className="form-events-grid">
                    {MEMBER_EVENT_OPTIONS.map((eventName) => (
                      <label key={eventName} className="form-event-option">
                        <input
                          type="checkbox"
                          checked={member.events.includes(eventName)}
                          onChange={() => handleMemberEventCheckbox(idx, eventName)}
                          disabled={
                            !member.events.includes(eventName) && member.events.length >= MEMBER_EVENT_OPTIONS.length
                          }
                          className="form-event-checkbox"
                        />
                        <span className="form-event-label">{eventName}</span>
                      </label>
                    ))}
                  </div>
                  <div className="selection-counter">
                    Selected: {member.events.length}/{MEMBER_EVENT_OPTIONS.length} events
                  </div>
                </div>
              </div>
            ))}
          </div>
          {form.members.length < 3 && (
            <button type="button" onClick={addMember} className="add-member-btn">
              <svg className="add-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Team Member
            </button>
          )}
        </div>

        {/* Submit Section */}
        <div className="submit-section">
          <div className="form-summary">
            <h4>Registration Summary</h4>
            <ul>
              <li>Team Leader: {form.leaderName || 'Not specified'}</li>
              <li>Leader Events: {form.leaderEvents.length} selected</li>
              <li>Team Members: {form.members.length + 1}</li>
              <li>College: {form.collegeName || 'Not specified'}</li>
            </ul>
          </div>
          <button type="submit" className={`submit-btn${loading ? ' loading' : ''}`} disabled={loading}>
            {loading ? (
              <span className="spinner" aria-label="Loading"></span>
            ) : (
              <svg className="submit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            )}
            {loading ? 'Registering...' : 'Complete Registration & Pay'}
          </button>
        </div>
      </form>
    </div>
  );
}
