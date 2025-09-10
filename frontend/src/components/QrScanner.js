import React, { useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';

export default function QrScannerComponent() {
  const [result, setResult] = useState('No result');
  const [error, setError] = useState('');
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [scanLock, setScanLock] = useState(false);

  useEffect(() => {
    async function getVideoDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (err) {
        setError('Could not enumerate cameras');
      }
    }
    getVideoDevices();
  }, []);

  const handleScan = async (data) => {
    if (data && !scanLock) {
      setScanLock(true);
      const teamKey = data.text || data;
      setResult(teamKey);
      try {
        const response = await fetch('https://dotz-12-production.up.railway.app/api/entry-permit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teamKey }),
        });
        const resData = await response.json();
        if (resData.valid) {
          alert(resData.message || 'Entry registered successfully!');
        } else {
          alert(resData.message || 'Error: Could not register entry.');
        }
      } catch (err) {
        alert('Server error: Could not update entry.');
      }
      setTimeout(() => setScanLock(false), 2000); // unlock after 2 seconds
    }
  };

  const handleError = (err) => {
    setError(err?.message || 'Camera error');
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  const constraints = selectedDeviceId
    ? { video: { deviceId: selectedDeviceId } }
    : { video: { facingMode: 'environment' } };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <h2 style={{ fontWeight: 'bold' }}>QR Code Scanner</h2>
      {devices.length > 0 && (
        <select
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          style={{ marginBottom: '1rem' }}
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </option>
          ))}
        </select>
      )}
      <QrScanner
        delay={100}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
        constraints={constraints}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p style={{ color: 'green', fontWeight: 'bold' }}>{result}</p>
    </div>
  );
}
