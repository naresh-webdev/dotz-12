import React, { useState } from "react";
import './FormRegister.css';

const initialMember = {
  name: "",
  email: "",
  phone: "",
  registerNumber: "",
  foodPreference: "",
  gender: "",
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
    leaderFoodPreference: "",
    leaderGender: "",
    collegeName: "",
    collegeId: "",
    members: [ { ...initialMember } ],
    leaderEvents: [],
  });

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
    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teamData),
    });
    if (!response.ok) throw new Error("Failed to register team");
    return response.json();
  };

  // ---------- Cashfree Integration ----------
  // Create Cashfree order (token) from backend
  const createCashfreeOrder = async (amountPaise) => {
    const response = await fetch("http://localhost:5000/api/create-cashfree-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountPaise, currency: "INR" }),
    });
    if (!response.ok) throw new Error("Failed to create Cashfree order");
    return response.json();
  };

  // Handler for Cashfree payment
  const openCashfree = (orderToken, amountRupees) => {
    if (!window.Cashfree) {
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/ui/2.0.0/cashfree.sandbox.js";
      script.async = true;
      script.onload = () => launchCashfree(orderToken);
      document.body.appendChild(script);
    } else {
      launchCashfree(orderToken);
    }
  };

  // Launch Cashfree checkout
  const launchCashfree = (orderToken) => {
    const cashfree = new window.Cashfree();
    cashfree.checkout({
      paymentSessionId: orderToken,
      redirectTarget: "_modal",
      onSuccess: async (data) => {
        // Payment successful, register team
        try {
          const result = await submitTeamData(form);
          alert("✅ Payment successful and team registered!");
          onSubmit?.({ ...form, payment: data });
        } catch (err) {
          alert("❌ Team registration failed after payment!");
          console.error("❌ Team registration failed:", err);
        }
      },
      onFailure: (data) => {
        alert("❌ Payment failed!");
        console.error("❌ Payment failed:", data);
      },
      onError: (err) => {
        alert("❌ Payment error!");
        console.error("❌ Payment error:", err);
      },
    });
  };

  // ---------- Submit Handler ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    // compute the participantCount
    const participantCount = form.members.length + 1; // +1 for the leader
    setForm((prev) => ({ ...prev, participantCount }));
    if (form.leaderEvents.length < 2) {
      alert("❌ Please select at least 2 events for the leader.");
      return;
    }
    form.members.forEach(mem => {
      if (mem.events.length < 1) {
        alert(`❌ Please select at least 1 event for member ${mem.name}.`);
      }
    });
    try {
      // Step 2: Calculate fee = 200 * team size
      const teamSize = Number(form.participantCount || 0);
      const amountRupees = teamSize * 200;
      const amountPaise = amountRupees * 100;

      // Step 3: Create Cashfree order in backend
      const { orderToken } = await createCashfreeOrder(amountPaise);

      // Step 4: Load Cashfree SDK if not loaded
      openCashfree(orderToken, amountRupees);
    } catch (error) {
      console.error("❌ Registration or payment failed:", error);
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
          <select name="leaderFoodPreference" value={form.leaderFoodPreference} onChange={handleChange} required className="form-select">
            <option value="">Select...</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
          </select>
        </label>
        <label className="form-label">Gender
          <select name="leaderGender" value={form.leaderGender} onChange={handleChange} required className="form-select">
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
                <select name="foodPreference" value={member.foodPreference} onChange={(e) => handleMemberChange(idx, e)} required className="form-select">
                  <option value="">Select...</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                </select>
              </label>
              <label className="form-label">Gender
                <select name="gender" value={member.gender} onChange={(e) => handleMemberChange(idx, e)} required className="form-select">
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
