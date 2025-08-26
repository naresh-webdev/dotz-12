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
        } else if (m.events.length < 5) {
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
      } else if (prev.leaderEvents.length < 5) {
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
    const response = await fetch("https://dotz-12-backend.onrender.com/api/register", {
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
    // compute the participantCount
    const participantCount = form.members.length + 1; // +1 for the leader
    console.log("participant Count : ", participantCount);

    // Validate leader events
    if (form.leaderEvents.length < 2) {
      alert("❌ Please select at least 2 events for the leader.");
      return;
    }

    // Validate member events
    for (const mem of form.members) {
      if (mem.events.length < 1) {
        alert(`❌ Please select at least 1 event for member ${mem.name || ''}.`);
        return;
      }
    }

    // Prepare form data with correct participantCount
    const formData = { ...form, participantCount };

    try {
      const response = await fetch("https://dotz-12-backend.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      console.log("RESULT FROM REGISTERING USER : ", result);
      console.log("User Data Successfully Saved to MongoDB");

      if (response.ok) {
        // Registration successful, navigate to payment
        navigate('/payment', {
          state: {
            orderId: result.orderId,
            paymentSessionId: result.paymentSessionId,
            teamData: result.team
          }
        });
        alert("✅ Payment successful and team registered!");
      } else {
        alert("❌ Failed to get payment token from server.");
      }
    } catch (err) {
      alert("❌ Team registration failed after payment!");
      console.error("❌ Team registration failed:", err);
    }

    


    
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">Team Registration</h2>
      <div className="form-grid">
        <label className="form-label">Leader Name
          <input name="leaderName" value={form.leaderName} onChange={handleChange} placeholder="Leader Name" required className="form-input" />
        </label>
        <label className="form-label">Leader Phone Number
          <input name="leaderPhoneNumber" value={form.leaderPhoneNumber} onChange={handleChange} placeholder="Leader Phone Number" required type="number" className="form-input" />
        </label>
        <label className="form-label">Leader Email
          <input name="leaderEmail" value={form.leaderEmail} onChange={handleChange} placeholder="Leader Email" required type="email" className="form-input" />
        </label>
        <label className="form-label">Leader Register Number
          <input name="leaderRegisterNumber" value={form.leaderRegisterNumber} onChange={handleChange} placeholder="Leader Register Number" required type="number" className="form-input" />
        </label>
        <label className="form-label">College Name
          <input name="collegeName" value={form.collegeName} onChange={handleChange} placeholder="College Name" required className="form-input" />
        </label>
        <label className="form-label">College ID
          <input name="collegeId" value={form.collegeId} onChange={handleChange} placeholder="College ID" required className="form-input" />
        </label>
        <label className="form-label">Food Preference
          <select name="leaderFoodPreference" value={form.leaderFoodPreference} defaultValue={form.leaderFoodPreference} onChange={handleChange} required className="form-select">
            <option value="">Select...</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
          </select>
        </label>
        <label className="form-label">Gender
          <select name="leaderGender" value={form.leaderGender} defaultValue={form.leaderGender} onChange={handleChange} required className="form-select">
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
      </div>

      <div>
      <h3 className="text-xl font-semibold mb-2">Leader Events (select min 2)</h3>
        <div className="form-grid">
          {EVENT_OPTIONS.map((eventName) => (
            <label key={eventName} className="flex items-center space-x-2 bg-gray-50 p-2 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={form.leaderEvents.includes(eventName)}
                onChange={() => handleLeaderEventCheckbox(eventName)}
                disabled={
                  !form.leaderEvents.includes(eventName) && form.leaderEvents.length >= 5
                }
                className="form-checkbox"
              />
              <span>{eventName}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
  <h3 className="text-xl font-semibold mb-2 text-gray-800">Members</h3>
        <div className="space-y-4">
          {form.members.map((member, idx) => (
            <div key={idx} className="form-grid bg-gray-50 p-4 rounded-lg">
              <label className="form-label">Name
                <input name="name" value={member.name} onChange={(e) => handleMemberChange(idx, e)} placeholder="Name" required className="form-input" />
              </label>
              <label className="form-label">Email
                <input name="email" value={member.email} onChange={(e) => handleMemberChange(idx, e)} placeholder="Email" required type="email" className="form-input" />
              </label>
              <label className="form-label">Phone
                <input name="phone" value={member.phone} onChange={(e) => handleMemberChange(idx, e)} placeholder="Phone" required type="number" className="form-input" />
              </label>
              <label className="form-label">Register Number
                <input name="registerNumber" value={member.registerNumber} onChange={(e) => handleMemberChange(idx, e)} placeholder="Register Number" required type="number" className="form-input" />
              </label>
              <label className="form-label">Food Preference
                <select name="foodPreference" value={member.foodPreference} defaultValue={member.foodPreference} onChange={(e) => handleMemberChange(idx, e)} required className="form-select">
                  <option value="">Select...</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                </select>
              </label>
              <label className="form-label">Gender
                <select name="gender" value={member.gender} defaultValue={member.gender} onChange={(e) => handleMemberChange(idx, e)} required className="form-select">
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </label>
              <div className="w-full">
                <span className="font-medium">Events: (select min 1)</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {MEMBER_EVENT_OPTIONS.map((eventName) => (
                    <label key={eventName} className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={member.events.includes(eventName)}
                        onChange={() => handleMemberEventCheckbox(idx, eventName)}
                        disabled={
                          !member.events.includes(eventName) && member.events.length >= 5
                        } 
                        className="form-checkbox"
                      />
                      <span>{eventName}</span>
                    </label>
                  ))}
                </div>
              </div>
              {form.members.length > 1 && (
                <button type="button" onClick={() => removeMember(idx)} className="btn btn-error btn-sm mt-2 w-full">Remove</button>
              )}
            </div>
          ))}
        </div>
        {form.members.length < 3 && (
          <button type="button" onClick={addMember} className="btn btn-primary btn-sm mt-2">Add Member</button>
        )}
      </div>

      <button type="submit" className="btn btn-success w-full mt-4">Register & Pay</button>
    </form>
  );
}
