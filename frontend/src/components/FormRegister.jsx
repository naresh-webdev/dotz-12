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
    const response = await fetch("https://dotz-12-backend.onrender.com/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teamData),
    });
    if (!response.ok) throw new Error("Failed to register team");
    return response.json();
  };

  const createOrder = async (amountPaise) => {
    const response = await fetch("https://dotz-12-backend.onrender.com/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountPaise, currency: "INR" }),
    });
    if (!response.ok) throw new Error("Failed to create order");
    return response.json();
  };

  const verifyPayment = async (paymentData) => {
    const response = await fetch("https://dotz-12-backend.onrender.com/api/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });
    return response.json();
  };

  // ---------- Razorpay Checkout ----------
  const openRazorpay = (order, amountRupees) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID, // frontend key_id
      amount: order.amount,
      currency: order.currency,
      name: "Tech Event Registration",
      description: "Team Registration Fee",
      order_id: order.id,
      prefill: {
        name: form.LeaderName,
        email: form.LeaderEmail,
        contact: form.LeaderPhoneNumber,
      },
      handler: async function (response) {
        // Verify payment on backend
        const verifyRes = await verifyPayment(response);
        if (verifyRes.verified) {
          alert("✅ Payment successful and verified!");
          // Register team only after successful payment
          try {
            const result = await submitTeamData(form);
            console.log("✅ Team registered:", result);
            onSubmit?.({ ...form, payment: response });
          } catch (err) {
            alert("❌ Team registration failed after payment!");
            console.error("❌ Team registration failed:", err);
          }
        } else {
          alert("❌ Payment verification failed!");
        }
      },
      theme: { color: "#3399cc" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ---------- Submit Handler ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    // computer the participantCount
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

      // Step 3: Create order in backend
      const { order } = await createOrder(amountPaise);

      // Step 4: Load Razorpay SDK if not loaded
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => openRazorpay(order, amountRupees);
        document.body.appendChild(script);
      } else {
        openRazorpay(order, amountRupees);
      }
    } catch (error) {
      console.error("❌ Registration or payment failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
  <h2 className="form-title text-gray-800">Team Registration</h2>
      <div className="form-grid">
        <input name="leaderName" value={form.leaderName} onChange={handleChange} placeholder="Leader Name" required className="form-input" />
        <input name="leaderPhoneNumber" value={form.leaderPhoneNumber} onChange={handleChange} placeholder="Leader Phone Number" required type="number" className="form-input" />
        <input name="leaderEmail" value={form.leaderEmail} onChange={handleChange} placeholder="Leader Email" required type="email" className="form-input" />
        <input name="leaderRegisterNumber" value={form.leaderRegisterNumber} onChange={handleChange} placeholder="Leader Register Number" required type="number" className="form-input" />
        <input name="collegeName" value={form.collegeName} onChange={handleChange} placeholder="College Name" required className="form-input" />
        <input name="collegeId" value={form.collegeId} onChange={handleChange} placeholder="College ID" required className="form-input" />
        <select name="leaderFoodPreference" value={form.leaderFoodPreference} onChange={handleChange} required className="form-select">
          <option value="">Food Preference</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Non-Vegetarian">Non-Vegetarian</option>
        </select>
        <select name="leaderGender" value={form.leaderGender} onChange={handleChange} required className="form-select">
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div>
  <h3 className="text-xl font-semibold mb-2 text-gray-800">Leader Events (select min 2)</h3>
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
              <input name="name" value={member.name} onChange={(e) => handleMemberChange(idx, e)} placeholder="Name" required className="form-input" />
              <input name="email" value={member.email} onChange={(e) => handleMemberChange(idx, e)} placeholder="Email" required type="email" className="form-input" />
              <input name="phone" value={member.phone} onChange={(e) => handleMemberChange(idx, e)} placeholder="Phone" required type="number" className="form-input" />
              <input name="registerNumber" value={member.registerNumber} onChange={(e) => handleMemberChange(idx, e)} placeholder="Register Number" required type="number" className="form-input" />
              <select name="foodPreference" value={member.foodPreference} onChange={(e) => handleMemberChange(idx, e)} required className="form-select">
                <option value="">Food Preference</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
              <select name="gender" value={member.gender} onChange={(e) => handleMemberChange(idx, e)} required className="form-select">
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <div className="w-full">
                <span className="font-medium text-gray-800">Events: (select min 1)</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {MEMBER_EVENT_OPTIONS.map((eventName) => (
                    <label key={eventName} className="flex items-center space-x-1 text-gray-800">
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
