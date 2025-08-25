import React from 'react';
import { Link } from 'react-router-dom';
import './Events.css';

const technicalEvents = [
  { id: 'tech1', title: 'Code Sprint', description: 'Rapid coding challenge to test your algorithms and speed.', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop', category: 'Technical' },
  { id: 'tech2', title: 'Debug Duel', description: 'Find and fix bugs in real-world codebases.', image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop', category: 'Technical' },
  { id: 'tech3', title: 'UI/UX Jam', description: 'Design intuitive interfaces for a modern app.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop', category: 'Technical' },
  { id: 'tech4', title: 'Cloud Wars', description: 'Architect resilient cloud deployments with limited resources.', image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop', category: 'Technical' }
];

const nonTechnicalEvents = [
  { id: 'non1', title: 'Quiz Quest', description: 'A fast-paced general knowledge and tech-leaning quiz.', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop', category: 'Non-Technical' },
  { id: 'non2', title: 'Pitch Perfect', description: 'Pitch your startup idea in 3 minutes.', image: 'https://images.unsplash.com/photo-1494173853739-c21f58b16055?q=80&w=1200&auto=format&fit=crop', category: 'Non-Technical' },
  { id: 'non3', title: 'Design Dash', description: 'Poster design contest with a theme revealed on the spot.', image: 'https://images.unsplash.com/photo-1529336953121-4a32006c1d5a?q=80&w=1200&auto=format&fit=crop', category: 'Non-Technical' },
  { id: 'non4', title: 'Treasure Hunt', description: 'Solve clues and race to the finish across campus.', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1200&auto=format&fit=crop', category: 'Non-Technical' }
];

const Events = () => {
  return (
    <div className="events-page">
      <header className="page-header">
        <h1>Events</h1>
        <p>Explore our wide range of technical and non-technical events.</p>
      </header>

      <section className="events-section">
        <h2 className="section-title">Technical Events</h2>
        <div className="events-grid">
          {technicalEvents.map((event) => (
            <div className="event-card" key={event.id}>
              <div className="event-image">
                <img src={event.image} alt={event.title} />
              </div>
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                <Link to={`/event/${event.id}`} className="btn btn-primary btn-large">More Details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="events-section">
        <h2 className="section-title">Non-Technical Events</h2>
        <div className="events-grid">
          {nonTechnicalEvents.map((event) => (
            <div className="event-card" key={event.id}>
              <div className="event-image">
                <img src={event.image} alt={event.title} />
              </div>
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                <Link to={`/event/${event.id}`} className="btn btn-primary btn-large">More Details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Events;
