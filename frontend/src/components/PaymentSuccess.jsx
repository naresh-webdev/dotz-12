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
      setError('No order ID provided');
      setLoading(false);
    }
  }, [orderId]);

  const verifyPayment = async () => {
    try {
      // Single API call: verify payment and get booking data
      const response = await fetch('https://dotz-12-production.up.railway.app/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });

      const data = await response.json();

      if (response.ok && data.success && (data.paymentStatus === 'paid' || data.orderStatus === 'PAID')) {
        console.log("data.booking", data.booking);
        console.log("important", data);
        setBooking(data.booking);
      } else {
        setError(data.message || 'Payment verification failed or invalid payment status');
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
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-300/60 border-t-blue-200 mx-auto"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-100 animate-ping"></div>
            </div>
            <h2 className="text-xl font-semibold text-blue-100 mb-2">Verifying Payment</h2>
            <p className="text-blue-50">Please wait while we confirm your payment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-950 flex flex-col" style={{background: '#0b1229'}}>
        <div className="flex flex-1 items-center justify-center p-4 min-h-0">
          <div className="bg-gradient-to-br from-red-800/40 to-red-700/20 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-red-400/30 backdrop-blur-xl flex flex-col justify-center h-full min-h-[350px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400/40 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-300/40">
                <svg className="w-8 h-8 text-red-200" fill="#ff0000" stroke="#ff0000" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-red-100 mb-2">Payment Error😞, Please contact <bold>9344735611</bold> for immediate assistance.</h2>
              <p className="text-red-50 mb-6">{error}</p>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full p-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-400 hover:to-red-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/10"
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
        <div className="bg-gradient-to-br from-green-700/40 to-emerald-600/20 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-green-300/30 backdrop-blur-xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-300/60 to-emerald-200/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200/40">
              <svg className="w-8 h-8 text-green-100" fill="none" stroke="#00ff00" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-50 mb-2 drop-shadow">Registration Successful!</h2>
            <p className="text-blue-50 mb-6">Your team has been registered successfully for <span className="font-bold">DoTz v12</span>.</p>

            {booking && (
              <div className="bg-white/10 rounded-lg p-4 mb-6 text-left border border-white/20 backdrop-blur-md">
                <h3 className="font-bold text-blue-100 mb-3">Registration Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-200">Team Leader:</span>
                    <span className="text-blue-50">{booking.leaderName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-200">Registration Date:</span>
                    <span className="text-blue-50">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-200">Order ID:</span>
                    <span className="text-blue-100 font-mono text-xs">{booking.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-200">Amount:</span>
                    <span className="text-green-200 font-bold">₹{booking.amount}</span>
                  </div>
                  {booking.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-200">Payment Method:</span>
                      <span className="text-blue-50">{booking.paymentMethod}</span>
                    </div>
                  )}
                  {booking.paymentId && (
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-200">Payment ID:</span>
                      <span className="text-blue-100 font-mono text-xs">{booking.paymentId}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-5">
              <button
                onClick={() => window.location.href = '/'}
                className="w-full p-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/10"
              >
                Back to Home
              </button>
              <p className="text-xs text-blue-100">
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