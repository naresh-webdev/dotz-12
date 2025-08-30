import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { load } from "@cashfreepayments/cashfree-js";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { orderId, paymentSessionId } = location.state || {};

  console.log("orderID, paymentSessionID inside payment page : ", orderId, paymentSessionId);

  useEffect(() => {
    if (!orderId || !paymentSessionId) {
      setError('Missing payment information');
      return;
    }

    initializePayment();
  }, [orderId, paymentSessionId]);

  const initializePayment = async () => {
    try {
      const cashfree = await load({ mode: "production" });
      
      const checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self",
      };

      await cashfree.checkout(checkoutOptions);
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to initialize payment');
    }
  };

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
                onClick={() => navigate('/')}
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
        <div className="text-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-400 mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-300 animate-ping"></div>
          </div>
          <h2 className="text-xl font-semibold text-blue-300 mb-2">Initializing Payment Gateway</h2>
          <p className="text-gray-300 mb-1">Please wait while we redirect you to the payment page</p>
          <p className="text-sm text-gray-400">This may take a few moments...</p>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage; 