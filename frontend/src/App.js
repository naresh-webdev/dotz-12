import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import Components
import Home from './components/Home';
import Events from './components/Events';
import About from './components/About';
import Sponsors from './components/Sponsors';
import Contact from './components/Contact';
import EventDetail from './components/EventDetail';
import FormRegister from './components/FormRegister';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentPage from './components/PaymentPage';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import RefundPolicy from './components/RefundPolicy';
import TermsConditions from './components/TermsConditions';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent both vertical and horizontal scroll when menu is open
      document.body.classList.add('menu-open');
      document.documentElement.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="nav-container">
            {/* Left side - DOTZ v12 */}
            <div className="nav-logo">
              <Link to="/" className="logo-text" onClick={closeMenu}>DOTZ v12</Link>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="nav-toggle" onClick={toggleMenu} ref={toggleRef}>
              <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
            </div>
            
            {/* Center - Navigation Links */}
            <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`} ref={menuRef}>
              <div className="mobile-menu-header">
                <h3>Menu</h3>
                <button className="close-menu-btn" onClick={closeMenu}>
                  {/* <span>×</span> */}
                </button>
              </div>
              <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
              <Link to="/events" className="nav-link" onClick={closeMenu}>Events</Link>
              <Link to="/about" className="nav-link" onClick={closeMenu}>About</Link>
              <Link to="/sponsors" className="nav-link" onClick={closeMenu}>Sponsors</Link>
              <Link to="/contact" className="nav-link" onClick={closeMenu}>Contact</Link>
            </div>
            
            {/* Right side - Register Button */}
            <div className="nav-cta">
              <Link to="/register" className="btn btn-primary btn-md">Register</Link>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<FormRegister />} />
            <Route path='/payment' element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failed" element={<PaymentFailed />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

function PaymentFailed() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-6">Your payment was not completed. Please try again.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default App;
