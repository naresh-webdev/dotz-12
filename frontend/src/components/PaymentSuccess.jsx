import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (orderId) {
      verifyPayment();
    } else {
      setError('No order ID found');
      setLoading(false);
    }
  }, [orderId]);

  const verifyPayment = async () => {
    try {
      // Single API call: verify payment and get booking data
      const response = await fetch('https://dotz-12-backend.onrender.com/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setBooking(data.booking);
      } else {
        setError(data.message || 'Payment verification failed');
      }
    } catch {
      setError('Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-950" style={{background: '#0b1229'}}>
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-400 mx-auto"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-300 animate-ping"></div>
            </div>
            <h2 className="text-xl font-semibold text-blue-300 mb-2">Verifying Payment</h2>
            <p className="text-gray-300">Please wait while we confirm your payment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-950" style={{background: '#0b1229'}}>
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-red-500/20 backdrop-blur-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-red-300 mb-2">Payment Error</h2>
              <p className="text-gray-300 mb-6">{error}</p>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-950" style={{background: '#0b1229'}}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-800/10 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-green-500/20 backdrop-blur-xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-600/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-green-300 mb-2">Registration Successful!</h2>
            <p className="text-gray-300 mb-6">Your team has been registered successfully for DoTz v12.</p>

            {booking && (
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6 text-left border border-gray-700/50 backdrop-blur-sm">
                <h3 className="font-semibold text-blue-300 mb-3">Registration Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-400">Team Leader:</span>
                    <span className="text-gray-300">{booking.leaderName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-400">Registration Date:</span>
                    <span className="text-gray-300">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-400">Order ID:</span>
                    <span className="text-gray-300 font-mono text-xs">{booking.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-400">Amount:</span>
                    <span className="text-green-400 font-semibold">₹{booking.amount}</span>
                  </div>
                  {booking.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-400">Payment Method:</span>
                      <span className="text-gray-300">{booking.paymentMethod}</span>
                    </div>
                  )}
                  {booking.paymentId && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-400">Payment ID:</span>
                      <span className="text-gray-300 font-mono text-xs">{booking.paymentId}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Back to Home
              </button>
              <p className="text-xs text-gray-400">
                You will receive a confirmation email with all the event details shortly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 