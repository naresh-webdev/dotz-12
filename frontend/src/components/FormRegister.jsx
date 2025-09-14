import React, { useState, useRef } from "react";
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
  "Design Warrior",
  "Non Technical",
];

const MEMBER_EVENT_OPTIONS = [
  "Algoverse X",
  "Brain Compiler",
  "Design Warrior",
  "Non Technical",
];

export default function FormRegister({ isOnSpot = false }) {
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
    paperPresentationTitle: "",
    paperPresentationAbstract: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", errors: [] });
  const formRef = useRef(null);
  const navigate = useNavigate();

  // Validation functions
  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateRegisterNumber = (regNumber) => {
    return regNumber.trim().length > 0;
  };

  const validateCollegeId = (collegeId) => {
    return collegeId.trim().length > 0;
  };

  const validateCollegeName = (collegeName) => {
    return collegeName.trim().length > 0;
  };

  const validateLeaderName = (leaderName) => {
    return leaderName.trim().length > 0;
  };

  // Function to scroll to the first error
  const scrollToFirstError = (newErrors, memberErrors) => {
    // Scroll to top if there are leader errors
    if (Object.keys(newErrors).length > 0) {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    
    // Scroll to first member error if no leader errors
    if (memberErrors.some(err => err !== undefined)) {
      const firstErrorIndex = memberErrors.findIndex(err => err !== undefined);
      if (firstErrorIndex !== -1) {
        const element = document.getElementById(`member-${firstErrorIndex}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: "smooth" });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
      }
    }
  };

  // Handler for simple fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone numbers, only allow digits and limit to 10 characters
    if (name === "leaderPhoneNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }
    
    // For register numbers and college ID, allow any input
    if (name === "leaderRegisterNumber" || name === "collegeId") {
      setForm((prev) => ({ ...prev, [name]: value }));
      return;
    }
    
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for Members
  const handleMemberChange = (idx, e) => {
    const { name, value } = e.target;
    
    // For member phone numbers, only allow digits and limit to 10 characters
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      const updated = form.members.map((m, i) =>
        i === idx ? { ...m, [name]: numericValue } : m
      );
      setForm((prev) => ({ ...prev, members: updated }));
      return;
    }
    
    // For member register numbers, trim whitespace
    if (name === "registerNumber") {
      const updated = form.members.map((m, i) =>
        i === idx ? { ...m, [name]: value } : m
      );
      setForm((prev) => ({ ...prev, members: updated }));
      return;
    }
    
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
    
    // Clear previous errors
    setErrors({});
    setLoading(true);
    
    // Validate leader information
    const newErrors = {};
    
    if (!validateLeaderName(form.leaderName)) {
      newErrors.leaderName = "Please enter the leader's name.";
    }
    
    if (!validatePhoneNumber(form.leaderPhoneNumber)) {
      newErrors.leaderPhoneNumber = "Please enter a valid 10-digit phone number without spaces or country code.";
    }
    
    if (!validateEmail(form.leaderEmail)) {
      newErrors.leaderEmail = "Please enter a valid email address.";
    }
    
    if (!validateRegisterNumber(form.leaderRegisterNumber)) {
      newErrors.leaderRegisterNumber = "Please enter the leader's register number.";
    }
    
    if (!validateCollegeName(form.collegeName)) {
      newErrors.collegeName = "Please enter the college name.";
    }
    
    if (!validateCollegeId(form.collegeId)) {
      newErrors.collegeId = "Please enter the college code.";
    }
    
    // Validate leader events
    if (form.leaderEvents.length < 2) {
      newErrors.leaderEvents = "Please select at least 2 events for the leader.";
    } else if (form.leaderEvents.length > 5) {
      newErrors.leaderEvents = "Leader can select at most 5 events.";
    }
    
    // Validate member information
    const memberErrors = [];
    for (let i = 0; i < form.members.length; i++) {
      const member = form.members[i];
      const memberError = {};
      
      if (!member.name.trim()) {
        memberError.name = `Please enter name for member ${i + 1}.`;
      }
      
      if (!validatePhoneNumber(member.phone)) {
        memberError.phone = `Please enter a valid 10-digit phone number for member ${i + 1} without spaces or country code.`;
      }
      
      if (!validateEmail(member.email)) {
        memberError.email = `Please enter a valid email address for member ${i + 1}.`;
      }
      
      if (!validateRegisterNumber(member.registerNumber)) {
        memberError.registerNumber = `Please enter register number for member ${i + 1}.`;
      }
      
      if (member.events.length < 1) {
        memberError.events = `Please select at least 1 event for member ${i + 1}.`;
      } else if (member.events.length > 4) {
        memberError.events = `Member ${i + 1} can select at most 4 events.`;
      }
      
      if (Object.keys(memberError).length > 0) {
        memberErrors[i] = memberError;
      }
    }
    
    // If Paper Presentation is selected, validate title and abstract
    if (form.leaderEvents.includes("Paper Presentation")) {
      if (!form.paperPresentationTitle.trim()) {
        newErrors.paperPresentationTitle = "Please provide a Paper Presentation Title.";
      }
      if (!form.paperPresentationAbstract.trim()) {
        newErrors.paperPresentationAbstract = "Please provide an Abstract Description for the Paper Presentation.";
      }
      if (form.paperPresentationAbstract.length > 1000) {
        newErrors.paperPresentationAbstract = "Abstract Description must be 1000 characters or less.";
      }
    }
    
    // If there are errors, set them and stop submission
    if (Object.keys(newErrors).length > 0 || memberErrors.some(err => err !== undefined)) {
      setErrors({ ...newErrors, members: memberErrors });
      setLoading(false);
      
      // Create a list of all errors
      const errorList = [];
      
      // Add leader errors
      Object.keys(newErrors).forEach(key => {
        if (key !== "members" && key !== "leaderEvents") {
          errorList.push(newErrors[key]);
        }
      });
      
      // Add leader events error
      if (newErrors.leaderEvents) {
        errorList.push(newErrors.leaderEvents);
      }
      
      // Add member errors
      memberErrors.forEach((memberError, index) => {
        if (memberError) {
          Object.keys(memberError).forEach(key => {
            errorList.push(`Member ${index + 1}: ${memberError[key]}`);
          });
        }
      });
      
      // Show custom alert modal
      setAlert({
        show: true,
        message: "Please fix the following errors:",
        errors: errorList
      });
      
      // Scroll to the first error
      scrollToFirstError(newErrors, memberErrors);
      
      return;
    }
    
    // compute the participantCount
    const participantCount = form.members.length + 1; // +1 for the leader
    
    // Prepare form data with correct participantCount
    const formData = { ...form, participantCount };
    
      if (!isOnSpot) {
        try {
        // Online Registration - initiate payment
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
    }} else {
      // On-Spot Registration - no payment
      try {
        const response = await fetch("https://dotz-12-production.up.railway.app/api/onspot-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (response.ok) {
          alert("✅ Team registered successfully for On-Spot Registration!");
          setForm({
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
            paperPresentationTitle: "",
            paperPresentationAbstract: ""
          });
        } else {
          alert("❌ Failed to register team for On-Spot Registration.");
          console.error("❌ On-Spot registration failed:", result);
        }
      } catch (err) {
        alert("❌ Team registration failed for On-Spot Registration!");
        console.error("❌ On-Spot registration failed:", err)
      }
    }
    
      
    setLoading(false);
  };

  return (
    <div className="registration-page registration-form">
      {/* Custom Alert Modal */}
      {alert.show && (
        <div className="alert-modal-overlay">
          <div className="alert-modal">
            <div className="alert-modal-header">
              <h2 className="alert-modal-title">Validation Errors</h2>
              <button 
                className="alert-modal-close"
                onClick={() => setAlert({ show: false, message: "", errors: [] })}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="alert-modal-content">
              <p className="alert-modal-message">{alert.message}</p>
              <ul className="alert-error-list">
                {alert.errors.map((error, index) => (
                  <li key={index} className="alert-error-item">
                    <svg className="alert-error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="alert-error-text">{error}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="alert-modal-actions">
              <button 
                className="alert-modal-button alert-modal-button-primary"
                onClick={() => setAlert({ show: false, message: "", errors: [] })}
              >
                OK, I'll fix them
              </button>
            </div>
          </div>
        </div>
      )}

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

      <form ref={formRef} onSubmit={handleSubmit} className="form-container">
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
                className={`form-input ${errors.leaderName ? "invalid" : ""}`} 
              />
              {errors.leaderName && <span className="form-error">{errors.leaderName}</span>}
            </label>
            <label className="form-label">
              <span className="label-text">Phone Number *</span>
              <input 
                name="leaderPhoneNumber" 
                value={form.leaderPhoneNumber} 
                onChange={handleChange} 
                placeholder="10-digit number only (e.g. 9876543210)" 
                required 
                type="tel" 
                className={`form-input ${errors.leaderPhoneNumber ? "invalid" : ""}`} 
                maxLength="10"
              />
              <small className="form-hint">10 digits only, no spaces or country code</small>
              {errors.leaderPhoneNumber && <span className="form-error">{errors.leaderPhoneNumber}</span>}
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
                className={`form-input ${errors.leaderEmail ? "invalid" : ""}`} 
              />
              {errors.leaderEmail && <span className="form-error">{errors.leaderEmail}</span>}
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
                className={`form-input ${errors.leaderRegisterNumber ? "invalid" : ""}`} 
              />
              {errors.leaderRegisterNumber && <span className="form-error">{errors.leaderRegisterNumber}</span>}
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
                placeholder="Enter college full name" 
                required 
                className={`form-input ${errors.collegeName ? "invalid" : ""}`} 
              />
              {errors.collegeName && <span className="form-error">{errors.collegeName}</span>}
            </label>
            <label className="form-label">
              <span className="label-text">College Code *</span>
              <input 
                name="collegeId" 
                value={form.collegeId} 
                onChange={handleChange} 
                placeholder="Enter college code - eg '4224'" 
                required 
                className={`form-input ${errors.collegeId ? "invalid" : ""}`} 
              />
              {errors.collegeId && <span className="form-error">{errors.collegeId}</span>}
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
          {errors.leaderEvents && <span className="form-error">{errors.leaderEvents}</span>}
          <br></br>
          {/* Paper Presentation Fields */}
          {form.leaderEvents.includes("Paper Presentation") && (
            <div className="paper-presentation-fields">
              <label className="form-label form-input-padding-bottom">
                <span className="label-text">Paper Presentation Title  *</span>
                <input
                  name="paperPresentationTitle"
                  value={form.paperPresentationTitle}
                  onChange={handleChange}
                  placeholder="Enter paper title"
                  required
                  className={`form-input ${errors.paperPresentationTitle ? "invalid" : ""}`}
                />
                {errors.paperPresentationTitle && <span className="form-error">{errors.paperPresentationTitle}</span>}
              </label>
              <label className="form-label">
                <span className="label-text">Paper Presentation Abstract Description *</span>
                <textarea
                  name="paperPresentationAbstract"
                  value={form.paperPresentationAbstract}
                  onChange={handleChange}
                  placeholder="Enter abstract description - Max 1000 characters"
                  required
                  className={`form-input ${errors.paperPresentationAbstract ? "invalid" : ""}`}
                  rows={4}
                  maxLength={1000}
                />
                <span className="char-count">{form.paperPresentationAbstract.length}/1000 characters</span>
                {errors.paperPresentationAbstract && <span className="form-error">{errors.paperPresentationAbstract}</span>}
              </label>
            </div>
          )}
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
              <div key={idx} id={`member-${idx}`} className="member-card">
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
                      className={`form-input ${errors.members && errors.members[idx] && errors.members[idx].name ? "invalid" : ""}`} 
                    />
                    {errors.members && errors.members[idx] && errors.members[idx].name && <span className="form-error">{errors.members[idx].name}</span>}
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
                      className={`form-input ${errors.members && errors.members[idx] && errors.members[idx].email ? "invalid" : ""}`} 
                    />
                    {errors.members && errors.members[idx] && errors.members[idx].email && <span className="form-error">{errors.members[idx].email}</span>}
                  </label>
                  <label className="form-label">
                    <span className="label-text">Phone *</span>
                    <input 
                      name="phone" 
                      value={member.phone} 
                      onChange={(e) => handleMemberChange(idx, e)} 
                      placeholder="10-digit number only (e.g. 9876543210)" 
                      required 
                      type="tel" 
                      className={`form-input ${errors.members && errors.members[idx] && errors.members[idx].phone ? "invalid" : ""}`} 
                      maxLength="10"
                    />
                    <small className="form-hint">10 digits only, no spaces or country code</small>
                    {errors.members && errors.members[idx] && errors.members[idx].phone && <span className="form-error">{errors.members[idx].phone}</span>}
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
                      className={`form-input ${errors.members && errors.members[idx] && errors.members[idx].registerNumber ? "invalid" : ""}`} 
                    />
                    {errors.members && errors.members[idx] && errors.members[idx].registerNumber && <span className="form-error">{errors.members[idx].registerNumber}</span>}
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
                  {errors.members && errors.members[idx] && errors.members[idx].events && <span className="form-error">{errors.members[idx].events}</span>}
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
};



