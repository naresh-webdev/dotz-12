import React, { useState, useEffect } from 'react';

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
      <div className="admin-login-container" style={{ maxWidth: 400, margin: '60px auto', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px #000', background: '#000' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </div>
          {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, borderRadius: 4, background: '#4f46e5', color: '#000', border: 'none', fontWeight: 'bold' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', padding: 24 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Admin Panel</h2>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <button
          onClick={() => setView('team')}
          style={{ padding: '8px 24px', marginRight: 12, borderRadius: 4, border: view === 'team' ? '2px solid #4f46e5' : '1px solid #ccc', background: view === 'team' ? '#eef2ff' : '#000', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Team Table
        </button>
        <button
          onClick={() => setView('member')}
          style={{ padding: '8px 24px', borderRadius: 4, border: view === 'member' ? '2px solid #4f46e5' : '1px solid #ccc', background: view === 'member' ? '#eef2ff' : '#000', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Member Table
        </button>
      </div>
      {view === 'team' ? (
        <div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <div>
              <label>Payment Status:</label>
              <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)} style={{ marginLeft: 8, padding: 4 }}>
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="UNPAID">Unpaid</option>
              </select>
            </div>
            <div>
              <label>College ID:</label>
              <input type="text" value={filterCollegeId} onChange={e => setFilterCollegeId(e.target.value)} placeholder="Search college ID..." style={{ marginLeft: 8, padding: 4 }} />
            </div>
          </div>
          {tableLoading ? (
            <div style={{ textAlign: 'center', marginTop: 40 }}>Loading records...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#000' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ padding: 8, border: '1px solid #000' }}>Team #</th>
                    <th style={{ padding: 8, border: '1px solid #000' }}>Leader Name</th>
                    <th style={{ padding: 8, border: '1px solid #000' }}>Mobile Number</th>
                    <th style={{ padding: 8, border: '1px solid #000' }}>Email</th>
                    <th style={{ padding: 8, border: '1px solid #000' }}>College Name</th>
                    <th style={{ padding: 8, border: '1px solid #000' }}>College ID</th>
                    <th style={{ padding: 8, border: '1px solid #000' }}>Participants</th>
                    <th style={{ padding: 8, border: '1px solid #000' }}>Has Visited</th>
                    <th style={{ padding: 8, border: '1px solid #000' }}>Payment Status</th>
                    <th style={{ padding: 8, border: '1px solid #000' }}>Bank Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.length === 0 ? (
                    <tr><td colSpan={10} style={{ textAlign: 'center', padding: 24 }}>No records found.</td></tr>
                  ) : (
                    filteredTeams.map(team => (
                      <tr key={team._id}>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{team.teamNumber}</td>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{team.leaderName}</td>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{team.leaderPhoneNumber}</td>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{team.leaderEmail}</td>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{team.collegeName}</td>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{team.collegeId}</td>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{team.participantCount}</td>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{team.hasVisited ? 'Yes' : 'No'}</td>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{team.paymentStatus}</td>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{team.bankReference}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <div>
              <label>Filter by Event:</label>
              <select value={filterEvent} onChange={e => setFilterEvent(e.target.value)} style={{ marginLeft: 8, padding: 4 }}>
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
              <input type="text" value={filterCollegeId} onChange={e => setFilterCollegeId(e.target.value)} placeholder="Search college ID..." style={{ marginLeft: 8, padding: 4 }} />
            </div>
          </div>
          {tableLoading ? (
            <div style={{ textAlign: 'center', marginTop: 40 }}>Loading records...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#000' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ padding: 8, border: '1px solid #000' }}>Team #</th>
                    <th style={{ padding: 8, border: '1px solid #000' }}>Role</th>
                    <th style={{ padding: 8, border: '1px solid #000' }}>Name</th>
                    <th style={{ padding: 8, border: '1px solid #000' }}>Mobile Number</th>
                    <th style={{ padding: 8, border: '1px solid #000' }}>Email</th>
                    <th style={{ padding: 8, border: '1px solid #000' }}>College Name</th>
                    <th style={{ padding: 8, border: '1px solid #000' }}>College ID</th>
                    <th style={{ padding: 8, border: '1px solid #000' }}>Events</th>
                    <th style={{ padding: 8, border: '1px solid #000' }}>Has Visited</th>
                    <th style={{ padding: 8, border: '1px solid #000' }}>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.length === 0 ? (
                    <tr><td colSpan={10} style={{ textAlign: 'center', padding: 24 }}>No records found.</td></tr>
                  ) : (
                    filteredMembers.map((person, idx) => (
                      <tr key={person.teamNumber + '-' + person.role + '-' + idx}>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{person.teamNumber}</td>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{person.role}</td>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{person.name}</td>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{person.phone}</td>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{person.email}</td>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{person.collegeName}</td>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{person.collegeId}</td>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{person.events && person.events.join(', ')}</td>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{person.hasVisited ? 'Yes' : 'No'}</td>
                        <td style={{ padding: 8, border: '1px solid #000' }}>{person.paymentStatus}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
