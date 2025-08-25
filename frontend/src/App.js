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
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
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
                  <span>×</span>
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
