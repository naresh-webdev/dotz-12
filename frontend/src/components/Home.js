import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import './Home.css';

const faqs = [
  {
    q: "Who can participate?",
    a: "All the Events is open for Students from all over India. It is the right place for anyone who's interested in learning and innovating with their ideas.",
    id: '01'
  },
  {
    q: "How much will it cost?",
    a: "Symposium registration costs ₹200 for online participants. On-Spot registration is available at ₹250.",
    id: '02'
  },
  {
    q: "How can I apply?",
    a: "The registration would be simply done by just clicking the register button Above and if any queries kindly contact the respected co-ordinators",
    id: '03'
  },
  {
    q: "What if I don't know how to code?",
    a: "No worries! You can still join in non-technical events and be part of the experience.",
    id: '04'
  },
  {
    q: "What are the prizes to be won?",
    a: "We are going to announce some really exciting prizes and incentives soon. Stay tuned for further updates!",
    id: '05'
  },
  {
    q: "Can we apply as a team?",
    a: "Yes! You can form teams of 2-4 people. Most teams aim to have a mix of people with both design and development skills.",
    id: '06'
  }
];

const phases = [
  {
    id: 1,
    title: "Registrations",
    subtitle: "Phase 1",
    date: "30 Aug 2025",
    icon: "📝",
    description: "Open for all students across India",
    status: "active"
  },
  {
    id: 2,
    title: "Shortlisting",
    subtitle: "Phase 2",
    date: "12 Sep 2025",
    icon: "✅",
    description: "Selection of qualified participants",
    status: "upcoming"
  },
  {
    id: 3,
    title: "Event Day",
    subtitle: "Phase 3",
    date: "15 Sep 2025",
    icon: "🏆",
    description: "National Level Technical Symposium",
    status: "upcoming"
  },
  {
    id: 4,
    title: "Prize",
    subtitle: "Phase 4",
    date: "15 Sep 2025",
    icon: "🎉",
    description: "Winners announcement and awards",
    status: "upcoming"
  }
];

const Home = () => {
  const [openIdx, setOpenIdx] = useState(null);
  const [activePhase, setActivePhase] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [daysLeft, setDaysLeft] = useState(null);
  const [progressRemaining, setProgressRemaining] = useState(100);
  
  const heroRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Phase animation interval
    const interval = setInterval(() => {
      setActivePhase(prev => prev === 4 ? 1 : prev + 1);
    }, 3000);

    // Calculate dynamic days left and registration progress
    const calculateTime = () => {
      const now = new Date();
      const eventDate = new Date('2025-09-15T00:00:00');
      const msPerDay = 24 * 60 * 60 * 1000;

      const diffMs = eventDate - now;
      const remainingDays = Math.max(0, Math.ceil(diffMs / msPerDay));
      setDaysLeft(remainingDays);

      // Progress remaining based on a 30-day window leading up to the event
      const windowDays = 30;
      const windowStart = new Date(eventDate.getTime() - windowDays * msPerDay);
      let percent = 100;
      if (now >= windowStart && now <= eventDate) {
        percent = Math.max(0, Math.min(100, Math.round(((eventDate - now) / (windowDays * msPerDay)) * 100)));
      } else if (now > eventDate) {
        percent = 0;
      } else {
        percent = 100;
      }
      setProgressRemaining(percent);
    };

    calculateTime();
    const t = setInterval(calculateTime, 60 * 1000);
    
    // Simple mouse movement for parallax
    const onMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 2 - 1; // -1..1
      const y = (e.clientY / innerHeight) * 2 - 1; // -1..1
      const root = document.documentElement;
      root.style.setProperty('--mx', x.toFixed(3));
      root.style.setProperty('--my', y.toFixed(3));
    };
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      clearInterval(interval);
      clearInterval(t);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const handlePhaseClick = (phaseId) => {
    setActivePhase(phaseId);
  };

  return (
    <div className="home-modern">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        ref={heroRef}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: {
              duration: 1,
              staggerChildren: 0.3
            }
          }
        }}
      >
        <div className="hero-background">
          <div className="hero-stars"></div>
          <div className="hero-particles"></div>
          <div className="hero-grid"></div>
          <div className="hero-aurora"></div>
          <div className="hero-shooting-stars">
            <div className="shooting-star"></div>
            <div className="shooting-star"></div>
            <div className="shooting-star"></div>
          </div>
          <div className="hero-orbs">
            <span className="orb o1"></span>
            <span className="orb o2"></span>
            <span className="orb o3"></span>
          </div>
          <div className="hero-energy-waves">
            <div className="energy-wave wave-1"></div>
            <div className="energy-wave wave-2"></div>
            <div className="energy-wave wave-3"></div>
          </div>
        </div>
        
        <motion.div 
          className="container hero-content"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.8,
                staggerChildren: 0.2
              }
            }
          }}
        >
          <motion.div 
            className="hero-badges"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <span className="badge-primary">UCET | Association of IT</span>
            <span className="badge-secondary">Presents</span>
          </motion.div>
          
          <motion.h1 
            className="hero-title"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <motion.span 
              className="title-main"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              DoTz
            </motion.span>
            <motion.span 
              className="title-version"
              animate={{
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              V12.0
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            animate={{
              y: [0, -2, 0],
              opacity: [0.9, 1, 0.9]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            National Level Technical Symposium · 15 Sep 2025
          </motion.p>
          
          <motion.div 
            className="hero-actions"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <motion.a 
              href="#register" 
              className="btn-primary"
              aria-label="Jump to registration section"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Register Here</span>
            </motion.a>
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
            >
              <Link to="/events" className="btn-secondary">
                <span>Explore Events</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
        
        <div className="hero-scroll">
          <div className="scroll-indicator"></div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-number">5+</div>
            <div className="stat-label">Events</div>
            <div className="stat-desc">Technical & Non-Technical</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-number">100+</div>
            <div className="stat-label">Students</div>
            <div className="stat-desc">Pan-India Participation</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏛️</div>
            <div className="stat-number">12th</div>
            <div className="stat-label">Year</div>
            <div className="stat-desc">11 Years of Excellence</div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="info-section">
        <div className="container info-grid">
          <div className="info-card">
            <div className="card-header">
              <div className="card-icon">📍</div>
              <div className="card-title">Venue</div>
            </div>
            <div className="card-content">
              <p>University College of Engineering Tindivanam</p>
              <p className="card-sub">Melpakkam, Pin code: 604307</p>
            </div>
          </div>
          <div className="info-card">
            <div className="card-header">
              <div className="card-icon">📅</div>
              <div className="card-title">Date & Time</div>
            </div>
            <div className="card-content">
              <p>15 September, 2025</p>
              <p className="card-sub">9:00 AM to 4:00 PM</p>
            </div>
          </div>
          <div className="info-card">
            <div className="card-header">
              <div className="card-icon">🎪</div>
              <div className="card-title">Events</div>
            </div>
            <div className="card-content">
              <p>Technical & Non-Technical</p>
              <p className="card-sub">Open to all disciplines</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="container about-content">
          <div className="about-text">
            <h2 className="section-title">About DoTz</h2>
            <p className="about-description">
              DoTz (Decryption of Talentz) is a national-level technical symposium successfully conducted by students from the Association of Information Technology at UCET. It has evolved into a successful decade-long event serving as a platform to showcase students' hidden talents.
            </p>
            <p className="about-description">
              With a myriad of technical and non-technical events, DoTz promises to captivate and impress. Don't miss out on this opportunity to participate and shine in your field!
            </p>
            <div className="about-actions">
              <Link to="/about" className="btn-outline">Learn More</Link>
              <Link to="/events" className="btn-primary">View Events</Link>
            </div>
          </div>
          <div className="about-visual">
            <div className="visual-card">
              <div className="visual-item">
                <div className="visual-number">12th</div>
                <div className="visual-label">Year of Legacy</div>
              </div>
              <div className="visual-item">
                <div className="visual-number">5+</div>
                <div className="visual-label">Tech & Non-Tech Events</div>
              </div>
              <div className="visual-item">
                <div className="visual-number">100+</div>
                <div className="visual-label">Participants</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Timeline */}
      <section className="timeline-section" id="schedule">
        <div className="container">
          <h2 className="section-title">Event Timeline</h2>
          <div className="timeline-container">
            {phases.map((phase) => (
              <div 
                key={phase.id} 
                className={`timeline-item ${activePhase === phase.id ? 'active' : ''} ${phase.status}`}
                onClick={() => handlePhaseClick(phase.id)}
              >
                <div className="timeline-marker">
                  <div className="marker-icon">{phase.icon}</div>
                  <div className="marker-line"></div>
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h3>{phase.title}</h3>
                    <span className="timeline-subtitle">{phase.subtitle}</span>
                  </div>
                  <div className="timeline-date">{phase.date}</div>
                  <p className="timeline-description">{phase.description}</p>
                  <div className="timeline-status">
                    <span className={`status-badge ${phase.status}`}>
                      {phase.status === 'active' ? 'Current' : phase.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="registration-section" id="register">
        <div className="container reg-container">
          <div className="reg-content">
            <div className="reg-header">
              <h2 className="section-title">Registration</h2>
              <div className="reg-deadline">
                <span className="deadline-label">Deadline</span>
                <span className="deadline-date">10 Sep 2025</span>
              </div>
            </div>
            <div className="reg-info">
              <p>The registration process is simple! Just click the register button below and fill out our Google form with your team details.</p>
              <div className="reg-features">
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>Easy online registration</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">👥</span>
                  <span>Team registration (2-4 members)</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💰</span>
                  <span>₹200 online / ₹250 on-spot</span>
                </div>
              </div>
            </div>
            <Link
              to="/register"
              className="btn-register"
              aria-label="Go to registration form"
            >
              <span>Register Now</span>
              <div className="btn-arrow">→</div>
            </Link>
          </div>
          <div className="reg-visual">
            <div className="reg-card">
              <div className="reg-card-header">
                <div className="reg-card-title">DoTz V12.0</div>
                <div className="reg-card-badge">Open</div>
              </div>
              <div className="reg-card-content">
                <div className="reg-stat">
                  <div className="stat-value">{daysLeft !== null ? `${daysLeft}` : '—'}</div>
                  <div className="stat-label">Days Left</div>
                </div>
                <div className="reg-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${progressRemaining}%`}}></div>
                  </div>
                  <span className="progress-text">{progressRemaining}% of registration period remaining</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors CTA */}
      <section className="sponsors-cta">
        <div className="container cta-container">
          <div className="cta-content">
            <h2>Our Sponsors</h2>
            <p>We extend our heartfelt gratitude to our sponsors and co-sponsors for their generous support in making DoTz V12.0 possible.</p>
            <Link to="/sponsors" className="btn-cta">View Sponsors</Link>
          </div>
          <div className="cta-visual">
            <div className="sponsor-icons">
              <div className="sponsor-icon">🏢</div>
              <div className="sponsor-icon">💼</div>
              <div className="sponsor-icon">🚀</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="faqs-section" id="faqs">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="faqs-subtitle">Everything you need to know about DoTz V12.0</p>
          <div className="faqs-container">
            {faqs.map((item, idx) => (
              <div key={item.id} className={`faq-item ${openIdx === idx ? 'open' : ''}`}>
                <button 
                  className="faq-question" 
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={openIdx === idx}
                >
                  <div className="faq-header">
                    <span className="faq-id">{item.id}</span>
                    <span className="faq-text">{item.q}</span>
                  </div>
                  <span className="faq-toggle">
                    <span className="toggle-line"></span>
                    <span className="toggle-line"></span>
                  </span>
                </button>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="contact-strip">
        <div className="container strip-container">
          <div className="strip-content">
            <div className="strip-item">
              <div className="strip-icon">📍</div>
              <div className="strip-info">
                <div className="strip-label">Location</div>
                <div className="strip-text">University College of Engineering Tindivanam, Melpakkam, Tamil Nadu, India.</div>
              </div>
            </div>
            <div className="strip-item">
              <div className="strip-icon">📞</div>
              <div className="strip-info">
                <div className="strip-label">Phone</div>
                <div className="strip-text">+91 9566778342</div>
              </div>
            </div>
            <div className="strip-item">
              <div className="strip-icon">✉️</div>
              <div className="strip-info">
                <div className="strip-label">Email</div>
                <div className="strip-text">dotzversion12@gmail.com</div>
              </div>
            </div>
          </div>
        </div>
        <div className="container strip-footer">
          <div className="footer-text">Designed and Developed by UCET IT Team</div>
        </div>
      </section>
    </div>
  );
};

export default Home;
