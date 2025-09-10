import React, { useState, useEffect } from 'react';
import './AdminPannel.css';
import QrScannerComponent from './QrScanner';

export default function AdminPannel() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [teams, setTeams] = useState([]);
  const [filterPayment, setFilterPayment] = useState('');
  const [filterCollegeId, setFilterCollegeId] = useState('');
  const [filterEvent, setFilterEvent] = useState('');
  const [tableLoading, setTableLoading] = useState(false);
  const [view, setView] = useState('team'); // 'team' or 'member'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://dotz-12-production.up.railway.app/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password })
      });
      const data = await res.json();
      if (data.valid) {
        setAuthenticated(true);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server error');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) {
      setTableLoading(true);
      fetch('https://dotz-12-production.up.railway.app/api/admin/teams')
        .then(res => res.json())
        .then(data => {
          setTeams(data.teams || []);
          setTableLoading(false);
        })
        .catch(() => setTableLoading(false));
    }
  }, [authenticated]);

  // Add refresh handler
  const handleRefresh = () => {
    if (authenticated) {
      setTableLoading(true);
      fetch('https://dotz-12-production.up.railway.app/api/admin/teams')
        .then(res => res.json())
        .then(data => {
          setTeams(data.teams || []);
          setTableLoading(false);
        })
        .catch(() => setTableLoading(false));
    }
  };

  // Team Table Filtering
  const filteredTeams = teams.filter(team => {
    let paymentMatch = team.paymentStatus === 'paid';
    let collegeIdMatch = true;
    if (filterCollegeId) {
      collegeIdMatch = team.collegeId && team.collegeId.toLowerCase().includes(filterCollegeId.toLowerCase());
    }
    return paymentMatch && collegeIdMatch;
  });

  // Member Table Preparation & Filtering
  const allMembers = teams
    .filter(team => team.paymentStatus === 'paid') // Only paid teams
    .flatMap(team => [
      {
        teamNumber: team.teamNumber,
        name: team.leaderName,
        email: team.leaderEmail,
        phone: team.leaderPhoneNumber,
        collegeName: team.collegeName,
        collegeId: team.collegeId,
        hasVisited: team.hasVisited,
        paymentStatus: team.paymentStatus,
        events: team.leaderEvents || [],
        role: 'Leader'
      },
      ...((team.members || []).map((member, idx) => ({
        teamNumber: team.teamNumber,
        name: member.name,
        email: member.email,
        phone: member.phone,
        collegeName: team.collegeName,
        collegeId: team.collegeId,
        hasVisited: team.hasVisited,
        paymentStatus: team.paymentStatus, // Inherit from team
        events: member.events || [],
        role: `Member ${idx + 1}`
      })))
    ]);

  const filteredMembers = allMembers.filter(person => {
    let eventMatch = true;
    let collegeIdMatch = true;
    // Only paid members (already filtered above)
    if (filterEvent) {
      eventMatch = person.events && person.events.includes(filterEvent);
    }
    if (filterCollegeId) {
      collegeIdMatch = person.collegeId && person.collegeId.toLowerCase().includes(filterCollegeId.toLowerCase());
    }
    return eventMatch && collegeIdMatch;
  });

  if (!authenticated) {
    return (
      <div className="admin-login-container">
        <h2 className="admin-title">Admin Login</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="admin-input"
            />
          </div>
          {error && <div className="admin-error">{error}</div>}
          <button type="submit" disabled={loading} className="admin-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel-container">
      <h2 className="admin-title">Admin Panel</h2>
      <div className="admin-toggle-btns">
        <button
          onClick={() => setView('team')}
          className={`admin-btn-toggle${view === 'team' ? ' active' : ''}`}
        >
          Team Table
        </button>
        <button
          onClick={() => setView('member')}
          className={`admin-btn-toggle${view === 'member' ? ' active' : ''}`}
        >
          Member Table
        </button>
        <button
          onClick={() => setView('qr-reader')}
          className={`admin-btn-toggle${view === 'qr-reader' ? ' active' : ''}`}
        >
          Qr Scanner
        </button>
        <button
          onClick={handleRefresh}
          className="admin-btn-toggle"
          style={{ marginLeft: 12 }}
        >
          Refresh Data
        </button>
      </div>
      {view == 'team' && (
        <div>
          <div className="admin-filters">
            {/* <div>
              <label>Payment Status:</label>
              <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)} className="admin-select">
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="UNPAID">Unpaid</option>
              </select>
            </div> */}
            <div>
              <label>College ID:</label>
              <input type="text" value={filterCollegeId} onChange={e => setFilterCollegeId(e.target.value)} placeholder="Search college ID..." className="admin-input" />
            </div>
          </div>
          {tableLoading ? (
            <div className="admin-loading">Loading records...</div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Team #</th>
                    <th>Leader Name</th>
                    <th>Mobile Number</th>
                    <th>Email</th>
                    <th>College Name</th>
                    <th>College ID</th>
                    <th>Participants</th>
                    <th>Has Visited</th>
                    <th>Payment Status</th>
                    <th>Bank Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.length === 0 ? (
                    <tr><td colSpan={10} className="admin-no-records">No records found.</td></tr>
                  ) : (
                    filteredTeams.map(team => (
                      <tr key={team._id}>
                        <td>{team.teamNumber}</td>
                        <td>{team.leaderName}</td>
                        <td>{team.leaderPhoneNumber}</td>
                        <td>{team.leaderEmail}</td>
                        <td>{team.collegeName}</td>
                        <td>{team.collegeId}</td>
                        <td>{team.participantCount}</td>
                        <td>{team.hasVisited ? 'Yes' : 'No'}</td>
                        <td>{team.paymentStatus}</td>
                        <td>{team.bankReference}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )} {view === 'member' && (
        <div>
          <div className="admin-filters">
            <div>
              <label>Filter by Event:</label>
              <select value={filterEvent} onChange={e => setFilterEvent(e.target.value)} className="admin-select">
                <option value="">All</option>
                <option value="Paper Presentation">Paper Presentation</option>
                <option value="Algoverse X">Algoverse X</option>
                <option value="Brain Compiler">Brain Compiler</option>
                <option value="Design Warriors">Design Warriors</option>
                <option value="Non Technical">Non Technical</option>
              </select>
            </div>
            <div>
              <label>College ID:</label>
              <input type="text" value={filterCollegeId} onChange={e => setFilterCollegeId(e.target.value)} placeholder="Search college ID..." className="admin-input" />
            </div>
          </div>
          {tableLoading ? (
            <div className="admin-loading">Loading records...</div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Team #</th>
                    <th>Role</th>
                    <th>Name</th>
                    <th>Mobile Number</th>
                    <th>Email</th>
                    <th>College Name</th>
                    <th>College ID</th>
                    <th>Events</th>
                    <th>Has Visited</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.length === 0 ? (
                    <tr><td colSpan={10} className="admin-no-records">No records found.</td></tr>
                  ) : (
                    filteredMembers.map((person, idx) => (
                      <tr key={person.teamNumber + '-' + person.role + '-' + idx}>
                        <td>{person.teamNumber}</td>
                        <td>{person.role}</td>
                        <td>{person.name}</td>
                        <td>{person.phone}</td>
                        <td>{person.email}</td>
                        <td>{person.collegeName}</td>
                        <td>{person.collegeId}</td>
                        <td>{person.events && person.events.join(', ')}</td>
                        <td>{person.hasVisited ? 'Yes' : 'No'}</td>
                        <td>{person.paymentStatus}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
             
            </div>
          )}
          
        </div>
      )} {
        view === 'qr-reader' && (
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <QrScannerComponent />
          </div>
        )
      }
      
    </div>
  );
}
