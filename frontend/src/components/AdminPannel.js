import React, { useState, useEffect } from 'react';
import './AdminPannel.css';
import QrScannerComponent from './QrScanner';
import * as XLSX from 'xlsx';
import FormRegister from './FormRegister.jsx';

export default function AdminPannel() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [teams, setTeams] = useState([]);
  const [filterPayment, setFilterPayment] = useState('');
  const [filterCollegeId, setFilterCollegeId] = useState('');
  const [filterMobileNumber, setFilterMobileNumber] = useState('');
  const [filterTeamNumber, setFilterTeamNumber] = useState('');
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

  // Export team data to Excel
  const exportTeamDataToExcel = () => {
    // Prepare data for export - ALL paid teams with ALL fields
    const paidTeams = teams.filter(team => team.paymentStatus === 'paid');
    const exportData = paidTeams.map(team => ({
      'Team Number': team.teamNumber,
      'Team Key': team.teamKey,
      'Participant Count': team.participantCount,
      'Leader Name': team.leaderName,
      'Leader Phone': team.leaderPhoneNumber,
      'Leader Email': team.leaderEmail,
      'Leader Register Number': team.leaderRegisterNumber,
      'College Name': team.collegeName,
      'College ID': team.collegeId,
      'Leader Food Preference': team.leaderFoodPreference,
      'Leader Gender': team.leaderGender,
      'Has Visited': team.hasVisited ? 'Yes' : 'No',
      'Payment Status': team.paymentStatus,
      'Order ID': team.orderId,
      'Payment Method': team.paymentMethod,
      'Payment ID': team.paymentId,
      'Payment Time': team.paymentTime,
      'Bank Reference': team.bankReference,
      'Paper Presentation Team Count': team.paperPresentationTeamCount,
      'Paper Presentation Title': team.paperPresentationTitle,
      'Paper Presentation Abstract': team.paperPresentationAbstract,
      'Leader Events': team.leaderEvents ? team.leaderEvents.join(', ') : ''
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Teams');
    
    // Export to Excel file
    XLSX.writeFile(wb, 'all_paid_teams_data.xlsx');
  };

  // Export member data to Excel
  const exportMemberDataToExcel = () => {
    // Prepare data for export - ALL members from paid teams with ALL fields
    const paidTeams = teams.filter(team => team.paymentStatus === 'paid');
    const allPaidMembers = paidTeams
      .flatMap(team => [
        {
          teamNumber: team.teamNumber,
          name: team.leaderName,
          email: team.leaderEmail,
          phone: team.leaderPhoneNumber,
          registerNumber: team.leaderRegisterNumber,
          collegeName: team.collegeName,
          collegeId: team.collegeId,
          foodPreference: team.leaderFoodPreference,
          gender: team.leaderGender,
          hasVisited: team.hasVisited,
          paymentStatus: team.paymentStatus,
          events: team.leaderEvents || [],
          role: 'Leader',
          orderId: team.orderId,
          paymentMethod: team.paymentMethod,
          paymentId: team.paymentId,
          paymentTime: team.paymentTime,
          bankReference: team.bankReference
        },
        ...((team.members || []).map((member, idx) => ({
          teamNumber: team.teamNumber,
          name: member.name,
          email: member.email,
          phone: member.phone,
          registerNumber: member.registerNumber,
          collegeName: team.collegeName,
          collegeId: team.collegeId,
          foodPreference: member.foodPreference,
          gender: member.gender,
          hasVisited: team.hasVisited,
          paymentStatus: team.paymentStatus, // Inherit from team
          events: member.events || [],
          role: `Member ${idx + 1}`,
          orderId: team.orderId,
          paymentMethod: team.paymentMethod,
          paymentId: team.paymentId,
          paymentTime: team.paymentTime,
          bankReference: team.bankReference
        })))
      ]);
    
    const exportData = allPaidMembers.map(person => ({
      'Team Number': person.teamNumber,
      'Role': person.role,
      'Name': person.name,
      'Phone': person.phone,
      'Email': person.email,
      'Register Number': person.registerNumber,
      'College Name': person.collegeName,
      'College ID': person.collegeId,
      'Food Preference': person.foodPreference,
      'Gender': person.gender,
      'Events': person.events ? person.events.join(', ') : '',
      'Has Visited': person.hasVisited ? 'Yes' : 'No',
      'Payment Status': person.paymentStatus,
      'Order ID': person.orderId,
      'Payment Method': person.paymentMethod,
      'Payment ID': person.paymentId,
      'Payment Time': person.paymentTime,
      'Bank Reference': person.bankReference
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Members');
    
    // Export to Excel file
    XLSX.writeFile(wb, 'all_paid_members_data.xlsx');
  };

  // Team Table Filtering
  const filteredTeams = teams.filter(team => {
    let paymentMatch = team.paymentStatus === 'paid';
    let collegeIdMatch = true;
    let mobileNumberMatch = true;
    let teamNumberMatch = true;
    
    if (filterCollegeId) {
      collegeIdMatch = team.collegeId && team.collegeId.toLowerCase().includes(filterCollegeId.toLowerCase());
    }
    
    if (filterMobileNumber) {
      const mobileNumberStr = team.leaderPhoneNumber?.toString() || '';
      mobileNumberMatch = mobileNumberStr.includes(filterMobileNumber);
    }
    
    if (filterTeamNumber) {
      teamNumberMatch = team.teamNumber?.toString().includes(filterTeamNumber);
    }
    
    return paymentMatch && collegeIdMatch && mobileNumberMatch && teamNumberMatch;
  }).map(team => {
    // Calculate veg and non-veg counts
    let vegCount = 0;
    let nonVegCount = 0;
    
    // Count leader preference
    if (team.leaderFoodPreference === 'Vegetarian') {
      vegCount++;
    } else if (team.leaderFoodPreference === 'Non-Vegetarian') {
      nonVegCount++;
    }
    
    // Count member preferences
    if (team.members && Array.isArray(team.members)) {
      team.members.forEach(member => {
        if (member.foodPreference === 'Vegetarian') {
          vegCount++;
        } else if (member.foodPreference === 'Non-Vegetarian') {
          nonVegCount++;
        }
      });
    }
    
    return {
      ...team,
      vegCount,
      nonVegCount
    };
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
        foodPreference: team.leaderFoodPreference || '',
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
        foodPreference: member.foodPreference || '',
        role: `Member ${idx + 1}`
      })))
    ]);

  const filteredMembers = allMembers.filter(person => {
    let eventMatch = true;
    let collegeIdMatch = true;
    let teamNumberMatch = true;
    // Only paid members (already filtered above)
    if (filterEvent) {
      eventMatch = person.events && person.events.includes(filterEvent);
    }
    if (filterCollegeId) {
      collegeIdMatch = person.collegeId && person.collegeId.toLowerCase().includes(filterCollegeId.toLowerCase());
    }
    if (filterTeamNumber) {
      teamNumberMatch = person.teamNumber?.toString().includes(filterTeamNumber);
    }
    return eventMatch && collegeIdMatch && teamNumberMatch;
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
              placeholder="Enter your username"
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
              placeholder="Enter your password"
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
          aria-label="View team table"
        >
          Team Table
        </button>
        <button
          onClick={() => setView('member')}
          className={`admin-btn-toggle${view === 'member' ? ' active' : ''}`}
          aria-label="View member table"
        >
          Member Table
        </button>
        <button
          onClick={() => setView('qr-reader')}
          className={`admin-btn-toggle${view === 'qr-reader' ? ' active' : ''}`}
          aria-label="Open QR scanner"
        >
          QR Scanner
        </button>
        <button
          onClick={() => setView('on-spot-registration')}
          className={`admin-btn-toggle${view === 'on-spot-registration' ? ' active' : ''}`}
          aria-label="Open Registration form"
        >
          On Spot Registration
        </button>
        <button
          onClick={handleRefresh}
          className="admin-btn-toggle"
          aria-label="Refresh data"
        >
          Refresh Data
        </button>
        
        {view === 'team' && (
          <button
            onClick={exportTeamDataToExcel}
            className="admin-btn-toggle"
            aria-label="Export team data to Excel"
          >
            Export Team Data
          </button>
        )}
        {view === 'member' && (
          <button
            onClick={exportMemberDataToExcel}
            className="admin-btn-toggle"
            aria-label="Export member data to Excel"
          >
            Export Member Data
          </button>
        )}
      </div>
      {view === 'team' && (
        <div>
          <div className="admin-filters">
            <div>
              <label>College ID:</label>
              <input 
                type="text" 
                value={filterCollegeId} 
                onChange={e => setFilterCollegeId(e.target.value)} 
                placeholder="Search college ID..." 
                className="admin-input" 
              />
            </div>
            <div>
              <label>Mobile Number:</label>
              <input 
                type="text" 
                value={filterMobileNumber} 
                onChange={e => setFilterMobileNumber(e.target.value)} 
                placeholder="Search mobile number..." 
                className="admin-input" 
              />
            </div>
            <div>
              <label>Team Number:</label>
              <input 
                type="text" 
                value={filterTeamNumber} 
                onChange={e => setFilterTeamNumber(e.target.value)} 
                placeholder="Search team number..." 
                className="admin-input" 
              />
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
                    <th>Veg Count</th>
                    <th>Non-Veg Count</th>
                    <th>Has Visited</th>
                    <th>Payment Status</th>
                    <th>Bank Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.length === 0 ? (
                    <tr><td colSpan={12} className="admin-no-records">No records found.</td></tr>
                  ) : (
                    <>
                      {filteredTeams.map(team => (
                        <tr key={team._id}>
                          <td>{team.teamNumber}</td>
                          <td>{team.leaderName}</td>
                          <td>{team.leaderPhoneNumber}</td>
                          <td>{team.leaderEmail}</td>
                          <td>{team.collegeName}</td>
                          <td>{team.collegeId}</td>
                          <td>{team.participantCount}</td>
                          <td>{team.vegCount}</td>
                          <td>{team.nonVegCount}</td>
                          <td>{team.hasVisited ? 'Yes' : 'No'}</td>
                          <td>{team.paymentStatus}</td>
                          <td>{team.bankReference}</td>
                        </tr>
                      ))}
                      <tr className="admin-summary-row">
                        <td colSpan={6}><strong>Totals</strong></td>
                        <td><strong>{filteredTeams.reduce((sum, team) => sum + (team.participantCount || 0), 0)}</strong></td>
                        <td><strong>{filteredTeams.reduce((sum, team) => sum + (team.vegCount || 0), 0)}</strong></td>
                        <td><strong>{filteredTeams.reduce((sum, team) => sum + (team.nonVegCount || 0), 0)}</strong></td>
                        <td colSpan={3}></td>
                      </tr>
                    </>
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
              <select 
                value={filterEvent} 
                onChange={e => setFilterEvent(e.target.value)} 
                className="admin-select"
              >
                <option value="">All Events</option>
                <option value="Paper Presentation">Paper Presentation</option>
                <option value="Algoverse X">Algoverse X</option>
                <option value="Brain Compiler">Brain Compiler</option>
                <option value="Design Warriors">Design Warriors</option>
                <option value="Non Technical">Non Technical</option>
              </select>
            </div>
            <div>
              <label>College ID:</label>
              <input 
                type="text" 
                value={filterCollegeId} 
                onChange={e => setFilterCollegeId(e.target.value)} 
                placeholder="Search college ID..." 
                className="admin-input" 
              />
            </div>
            <div>
              <label>Team Number:</label>
              <input 
                type="text" 
                value={filterTeamNumber} 
                onChange={e => setFilterTeamNumber(e.target.value)} 
                placeholder="Search team number..." 
                className="admin-input" 
              />
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
                    <th>Food Preference</th>
                    <th>Has Visited</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.length === 0 ? (
                    <tr><td colSpan={11} className="admin-no-records">No records found.</td></tr>
                  ) : (
                    <>
                      {filteredMembers.map((person, idx) => (
                        <tr key={person.teamNumber + '-' + person.role + '-' + idx}>
                          <td>{person.teamNumber}</td>
                          <td>{person.role}</td>
                          <td>{person.name}</td>
                          <td>{person.phone}</td>
                          <td>{person.email}</td>
                          <td>{person.collegeName}</td>
                          <td>{person.collegeId}</td>
                          <td>{person.events && person.events.join(', ')}</td>
                          <td>{person.foodPreference}</td>
                          <td>{person.hasVisited ? 'Yes' : 'No'}</td>
                          <td>{person.paymentStatus}</td>
                        </tr>
                      ))}
                    </>
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
      {
        view === 'on-spot-registration' && (
          <div>
            <h2 style={{ fontWeight: 'bold', textAlign: 'center', marginTop: '20px' }}>On Spot Registration</h2>
            <FormRegister isOnSpot={true} />
          </div>
        )
      }
    </div>
  );
}