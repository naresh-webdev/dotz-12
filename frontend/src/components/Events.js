import React from 'react';
import { Link } from 'react-router-dom';
import './Events.css';

// Import images from src/images/event_posters/
import algoverseXImg from '../images/event_posters/algoverse_x.jpeg';
import booyahCarnivalImg from '../images/event_posters/booyah_carnival.jpeg';
import brainCompilerImg from '../images/event_posters/brain_compiler.jpeg';
import catchCrunchImg from '../images/event_posters/catch_crunch.jpeg';
import designWarriorImg from '../images/event_posters/design_warrior.jpeg';
import justAMinuteImg from '../images/event_posters/just_a_minute.jpeg';
import rhythmRhymeImg from '../images/event_posters/rhythm_rhyme.jpeg';

// Note: Missing images - using placeholders for now
const visionXImg = '/images/placeholder.jpg';

const technicalEvents = [
  { id: 'tech1', title: 'Brain Compiler', description: 'Test your logical thinking and programming skills with Puzzle & Aptitude Quest and Code Reverse challenges. Two-round competition focusing on analytical ability and code generation.', image: brainCompilerImg, category: 'Technical' },
  { id: 'tech2', title: 'Design Warrior', description: 'UI/UX Design Contest with Quiz Challenge and On-Name Design rounds. Teams of 3 compete in hands-on design challenges with creativity, usability, and visual appeal judging.', image: designWarriorImg, category: 'Technical' },
  { id: 'tech3', title: 'Algoverse X', description: 'Dive into the universe of algorithms with Code Quest MCQs and HackerRank Showdown challenges. Two-round competition testing logical thinking and problem-solving skills.', image: algoverseXImg, category: 'Technical' },
  { id: 'tech4', title: 'Vision X', description: 'Paper Presentation event showcasing innovative research and technical skills. Students present before judges focusing on originality, clarity, and technical depth.', image: visionXImg, category: 'Technical' }
];

const nonTechnicalEvents = [
  { id: 'non1', title: 'Rhythm & Rhyme', description: 'Test your spelling and music knowledge with Spell Bee and Guess the Lyrics challenges. Two-round competition testing accuracy, speed, and musical knowledge.', image: rhythmRhymeImg, category: 'Non-Technical' },
  { id: 'non2', title: 'Just A Minute', description: 'Think fast and speak faster in this exciting impromptu speaking challenge. Image-to-Word and Category Bidding rounds test your quick thinking.', image: justAMinuteImg, category: 'Non-Technical' },
  { id: 'non3', title: 'Booyah Carnival', description: 'Join the ultimate fun carnival with games, challenges, and entertainment galore.', image: booyahCarnivalImg, category: 'Non-Technical' },
  { id: 'non4', title: 'Catch & Crunch', description: 'Quick thinking meets quick reflexes in this fast-paced mental and physical challenge.', image: catchCrunchImg, category: 'Non-Technical' }
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
              <div className="event-category-tag technical">
                <span>TECH</span>
              </div>
              <div className="event-image">
                <img src={event.image} alt={event.title} />
                <div className="event-image-overlay"></div>
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
              <div className="event-category-tag non-technical">
                <span>NON-TECH</span>
              </div>
              <div className="event-image">
                <img src={event.image} alt={event.title} />
                <div className="event-image-overlay"></div>
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
