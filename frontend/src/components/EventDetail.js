import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './EventDetail.css';

const allEvents = {
  tech1: {
    id: 'tech1',
    title: 'Code Sprint',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    category: 'Technical',
    description: 'Compete in a rapid coding challenge focused on algorithms and problem-solving. Bring your best logic and speed to climb the leaderboard.',
    date: '12 Sep 2024',
    time: '10:00 AM - 12:00 PM',
    location: 'Lab 1, UCET',
    price: '₹200',
    instructor: 'Mr. A. Kumar',
    maxParticipants: 100
  },
  tech2: {
    id: 'tech2',
    title: 'Debug Duel',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop',
    category: 'Technical',
    description: 'Identify and fix bugs in challenging codebases. This event tests your debugging skills and attention to detail.',
    date: '12 Sep 2024',
    time: '12:30 PM - 2:00 PM',
    location: 'Lab 2, UCET',
    price: '₹200',
    instructor: 'Ms. R. Priya',
    maxParticipants: 80
  },
  tech3: {
    id: 'tech3',
    title: 'UI/UX Jam',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    category: 'Technical',
    description: 'Design beautiful, user-centered interfaces. Get a problem statement and build a modern UI with a strong UX.',
    date: '12 Sep 2024',
    time: '2:30 PM - 4:00 PM',
    location: 'Design Studio',
    price: '₹200',
    instructor: 'Ms. S. Lakshmi',
    maxParticipants: 60
  },
  tech4: {
    id: 'tech4',
    title: 'Cloud Wars',
    image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop',
    category: 'Technical',
    description: 'Plan and architect a scalable, resilient cloud deployment with limited budget. Present your architecture decisions.',
    date: '12 Sep 2024',
    time: '10:00 AM - 12:00 PM',
    location: 'Seminar Hall',
    price: '₹200',
    instructor: 'Mr. V. Natarajan',
    maxParticipants: 50
  },
  non1: {
    id: 'non1',
    title: 'Quiz Quest',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop',
    category: 'Non-Technical',
    description: 'Test your knowledge in a fun, fast-paced quiz spanning tech, science, and general awareness.',
    date: '12 Sep 2024',
    time: '10:00 AM - 11:30 AM',
    location: 'Auditorium',
    price: '₹150',
    instructor: 'Mr. P. Ravi',
    maxParticipants: 150
  },
  non2: {
    id: 'non2',
    title: 'Pitch Perfect',
    image: 'https://images.unsplash.com/photo-1494173853739-c21f58b16055?q=80&w=1200&auto=format&fit=crop',
    category: 'Non-Technical',
    description: 'Pitch your startup idea in 3 minutes. Convince the judges with your clarity, innovation, and feasibility.',
    date: '12 Sep 2024',
    time: '12:00 PM - 1:30 PM',
    location: 'Conference Room',
    price: '₹150',
    instructor: 'Ms. N. Kirthika',
    maxParticipants: 40
  },
  non3: {
    id: 'non3',
    title: 'Design Dash',
    image: 'https://images.unsplash.com/photo-1529336953121-4a32006c1d5a?q=80&w=1200&auto=format&fit=crop',
    category: 'Non-Technical',
    description: 'Create an attractive poster around a surprise theme. Showcase your creativity and composition skills.',
    date: '12 Sep 2024',
    time: '2:00 PM - 3:30 PM',
    location: 'Drawing Hall',
    price: '₹150',
    instructor: 'Mr. M. Murali',
    maxParticipants: 70
  },
  non4: {
    id: 'non4',
    title: 'Treasure Hunt',
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1200&auto=format&fit=crop',
    category: 'Non-Technical',
    description: 'Solve riddles, crack clues, and explore the campus to win exciting prizes in teams.',
    date: '12 Sep 2024',
    time: '3:00 PM - 4:00 PM',
    location: 'Campus Grounds',
    price: '₹150',
    instructor: 'UCET IT Team',
    maxParticipants: 200
  }
};

const EventDetail = () => {
  const { id } = useParams();
  const event = allEvents[id];

  if (!event) {
    return (
      <div className="page">
        <h1>Event Not Found</h1>
        <Link to="/events" className="btn btn-primary">Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="event-detail-page">
      <div className="page-header">
        <Link to="/events" className="back-link">← Back to Events</Link>
        <h1>{event.title}</h1>
        <span className="event-category">{event.category}</span>
      </div>

      <div className="event-detail-container">
        <div className="event-image-large">
          <img src={event.image} alt={event.title} />
        </div>

        <div className="event-info">
          <div className="event-meta">
            <div className="meta-item"><strong>Date</strong><span>{event.date}</span></div>
            <div className="meta-item"><strong>Time</strong><span>{event.time}</span></div>
            <div className="meta-item"><strong>Location</strong><span>{event.location}</span></div>
            <div className="meta-item"><strong>Fee</strong><span>{event.price}</span></div>
            <div className="meta-item"><strong>Coordinator</strong><span>{event.instructor}</span></div>
            <div className="meta-item"><strong>Max Participants</strong><span>{event.maxParticipants}</span></div>
          </div>

          <div className="event-description-detailed">
            <h3>About the Event</h3>
            <p>{event.description}</p>
          </div>

          <div className="event-actions">
            <a href="https://forms.gle/your-registration-form" className="btn btn-primary" target="_blank" rel="noreferrer">Register Now</a>
            <a href="#" className="btn btn-outline">Add to Calendar</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
