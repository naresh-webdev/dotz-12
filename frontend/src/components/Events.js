import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Events.css';

// Import images
import algoverseXImg from '../images/event_posters/algoverse_x.jpeg';
import booyahCarnivalImg from '../images/event_posters/booyah_carnival.jpeg';
import brainCompilerImg from '../images/event_posters/brain_compiler.jpeg';
import catchCrunchImg from '../images/event_posters/catch_crunch.jpeg';
import designWarriorImg from '../images/event_posters/design_warrior.jpeg';
import justAMinuteImg from '../images/event_posters/just_a_minute.jpeg';
import rhythmRhymeImg from '../images/event_posters/rhythm_rhyme.jpeg';
import visionXImg from '../images/event_posters/vision_x.jpeg';

const events = [
  {
    id: 'tech1',
    title: 'Brain Compiler',
    description: 'Challenge your analytical thinking with complex puzzles and reverse engineering challenges.',
    image: brainCompilerImg,
    category: 'Technical'
  },
  {
    id: 'tech2',
    title: 'Design Warrior',
    description: 'Showcase your UI/UX expertise in this intensive design competition with real-world challenges.',
    image: designWarriorImg,
    category: 'Technical'
  },
  {
    id: 'tech3',
    title: 'Algoverse X',
    description: 'Enter the universe of algorithms and data structures in this competitive programming challenge.',
    image: algoverseXImg,
    category: 'Technical'
  },
  {
    id: 'tech4',
    title: 'Vision X',
    description: 'Present your innovative research and technical insights to industry experts.',
    image: visionXImg,
    category: 'Technical'
  },
  {
    id: 'non1',
    title: 'Rhythm & Rhyme',
    description: 'Test your linguistic skills and musical knowledge in this entertaining dual challenge.',
    image: rhythmRhymeImg,
    category: 'Non-Technical'
  },
  {
    id: 'non2',
    title: 'Just A Minute',
    description: 'Master the art of impromptu speaking in this fast-paced communication challenge.',
    image: justAMinuteImg,
    category: 'Non-Technical'
  },
  {
    id: 'non3',
    title: 'Booyah Carnival',
    description: 'Experience the ultimate entertainment carnival with games, challenges, and surprises.',
    image: booyahCarnivalImg,
    category: 'Non-Technical'
  },
  {
    id: 'non4',
    title: 'Catch & Crunch',
    description: 'Solve mysteries and explore the campus in this thrilling treasure hunt adventure.',
    image: catchCrunchImg,
    category: 'Non-Technical'
  }
];

const Events = () => {
  const navigate = useNavigate();
  
  // Separate events by category
  const technicalEvents = events.filter(event => event.category === 'Technical');
  const nonTechnicalEvents = events.filter(event => event.category === 'Non-Technical');

  return (
    <div className="events-page">
      {/* Back Button */}
      <div className="back-button-container">
        <button 
          type="button" 
          onClick={() => navigate(-1)} 
          className="back-button"
          aria-label="Go back"
        >
          <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <h1>Events</h1>
        <p>Explore our wide range of technical and non-technical events designed to challenge and inspire you.</p>
      </div>

      {/* Technical Events Section */}
      <div className="events-container">
        <div className="section-header">
          <h2 className="section-title">Technical Events</h2>
          <p className="section-description">Test your programming skills, design expertise, and technical knowledge</p>
        </div>
        
        <div className="events-grid">
          {technicalEvents.map((event) => (
            <div key={event.id} className="event-card technical">
              <div className="event-image">
                <img src={event.image} alt={event.title} />
                <div className="event-category technical">{event.category}</div>
              </div>
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                <Link to={`/event/${event.id}`} className="event-link">
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Non-Technical Events Section */}
      <div className="events-container">
        <div className="section-header">
          <h2 className="section-title">Non-Technical Events</h2>
          <p className="section-description">Showcase your creativity, communication skills, and artistic talents</p>
        </div>
        
        <div className="events-grid">
          {nonTechnicalEvents.map((event) => (
            <div key={event.id} className="event-card non-technical">
              <div className="event-image">
                <img src={event.image} alt={event.title} />
                <div className="event-category non-technical">{event.category}</div>
              </div>
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                <Link to={`/event/${event.id}`} className="event-link">
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
