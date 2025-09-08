import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

export default function QrScannerComponent() {
const [result, setResult] = useState('No result');
const [error, setError] = useState('');

const handleScan = (data) => {
if (data) {
setResult(data.text || data);
}
};

const handleError = (err) => {
setError(err?.message || 'Camera error');
};

const previewStyle = {
height: 240,
width: 320,
};

return (
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
<h2 style={{ fontWeight: 'bold' }}>QR Code Scanner</h2>
<QrScanner
        delay={100}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
        facingMode="environment" 
      />
{error && <p style={{ color: 'red' }}>{error}</p>}
<p style={{ color: 'green', fontWeight: 'bold' }}>{result}</p>
</div>
);
}
