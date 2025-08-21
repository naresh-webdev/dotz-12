import React, { useState } from "react";

const initialMember = {
  name: "",
  email: "",
  phone: "",
  registerNumber: "",
  foodPreference: "",
  gender: "",
};




const EVENT_OPTIONS = [
  "Code Sprint",
  "Quiz Bowl",
  "Designathon",
  "Hackathon",
  "Robotics",
  "Gaming",
  "Debate",
  "Workshop"
];

export default function FormRegister({ onSubmit }) {


    

  const [form, setForm] = useState({
    teamNumber: "",
    participantCount: "",
    LeaderName: "",
    LeaderPhoneNumber: "",
    LeaderEmail: "",
    LeaderRegisterNumber: "",
    LeaderFoodPreference: "",
    LeaderGender: "",
    CollegeName: "",
    CollegeId: "",
    Members: [ { ...initialMember } ],
    events: [],
    // payment will be set by API, not user
  });

  // Handler for simple fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for Members
  const handleMemberChange = (idx, e) => {
    const { name, value } = e.target;
    const updated = form.Members.map((m, i) =>
      i === idx ? { ...m, [name]: value } : m
    );
    setForm((prev) => ({ ...prev, Members: updated }));
  };

  // Handler for Events (checkboxes)
  const handleEventCheckbox = (eventName) => {
    setForm((prev) => {
      const alreadySelected = prev.events.includes(eventName);
      if (alreadySelected) {
        return { ...prev, events: prev.events.filter(ev => ev !== eventName) };
      } else if (prev.events.length < 8) {
        return { ...prev, events: [...prev.events, eventName] };
      } else {
        return prev;
      }
    });
  };


  // Add/Remove Members
  const addMember = () => {
    if (form.Members.length < 3)
      setForm((prev) => ({
        ...prev,
        Members: [...prev.Members, { ...initialMember }],
      }));
  };
  const removeMember = (idx) => {
    setForm((prev) => ({
      ...prev,
      Members: prev.Members.filter((_, i) => i !== idx),
    }));
  };


  // API call function
  const submitTeamData = async (teamData) => {
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error submitting team data:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("form data : ", form)
    try {
      const result = await submitTeamData(form);
      console.log('Team registration successful:', result);
      // Handle success (e.g., show success message, redirect, etc.)
      onSubmit?.(result);
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error('Failed to submit team registration:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="teamNumber" value={form.teamNumber} onChange={handleChange} placeholder="Team Number" required />
      <input name="participantCount" value={form.participantCount} onChange={handleChange} placeholder="Participant Count" required type="number" min="1" max="4" />
      <input name="LeaderName" value={form.LeaderName} onChange={handleChange} placeholder="Leader Name" required />
      <input name="LeaderPhoneNumber" value={form.LeaderPhoneNumber} onChange={handleChange} placeholder="Leader Phone Number" required type="number" />
      <input name="LeaderEmail" value={form.LeaderEmail} onChange={handleChange} placeholder="Leader Email" required type="email" />
  <input name="LeaderRegisterNumber" value={form.LeaderRegisterNumber} onChange={handleChange} placeholder="Leader Register Number" required type="number" />
  <input name="CollegeName" value={form.CollegeName} onChange={handleChange} placeholder="College Name" required />
  <input name="CollegeId" value={form.CollegeId} onChange={handleChange} placeholder="College ID" required />
      <select name="LeaderFoodPreference" value={form.LeaderFoodPreference} onChange={handleChange} required>
        <option value="">Food Preference</option>
        <option value="Vegetarian">Vegetarian</option>
        <option value="Non-Vegetarian">Non-Vegetarian</option>
      </select>
      <select name="LeaderGender" value={form.LeaderGender} onChange={handleChange} required>
        <option value="">Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <h3>Members</h3>
      {form.Members.map((member, idx) => (
        <div key={idx}>
          <input name="name" value={member.name} onChange={(e) => handleMemberChange(idx, e)} placeholder="Name" required />
          <input name="email" value={member.email} onChange={(e) => handleMemberChange(idx, e)} placeholder="Email" required type="email" />
          <input name="phone" value={member.phone} onChange={(e) => handleMemberChange(idx, e)} placeholder="Phone" required type="number" />
          <input name="registerNumber" value={member.registerNumber} onChange={(e) => handleMemberChange(idx, e)} placeholder="Register Number" required type="number" />
          <select name="foodPreference" value={member.foodPreference} onChange={(e) => handleMemberChange(idx, e)} required>
            <option value="">Food Preference</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
          </select>
          <select name="gender" value={member.gender} onChange={(e) => handleMemberChange(idx, e)} required>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {form.Members.length > 1 && (
            <button type="button" onClick={() => removeMember(idx)}>Remove</button>
          )}
        </div>
      ))}
      {form.Members.length < 3 && (
        <button type="button" onClick={addMember}>Add Member</button>
      )}

      <h3>Events</h3>
      <div>
        {EVENT_OPTIONS.map((eventName) => (
          <label key={eventName} style={{ display: 'block' }}>
            <input
              type="checkbox"
              checked={form.events.includes(eventName)}
              onChange={() => handleEventCheckbox(eventName)}
              disabled={
                !form.events.includes(eventName) && form.events.length >= 8
              }
            />
            {eventName}
          </label>
        ))}
      </div>


      <button type="submit">Submit</button>
    </form>
  );
}