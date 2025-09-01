import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './EventDetail.css';

// Import images from src/images/event_posters/
import algoverseXImg from '../images/event_posters/algoverse_x.jpeg';
import booyahCarnivalImg from '../images/event_posters/booyah_carnival.jpeg';
import brainCompilerImg from '../images/event_posters/brain_compiler.jpeg';
import catchCrunchImg from '../images/event_posters/catch_crunch.jpeg';
import designWarriorImg from '../images/event_posters/design_warrior.jpeg';
import justAMinuteImg from '../images/event_posters/just_a_minute.jpeg';
import rhythmRhymeImg from '../images/event_posters/rhythm_rhyme.jpeg';
import visionXImg from '../images/event_posters/vision_x.jpeg';

const allEvents = {
  tech1: {
    id: 'tech1',
    title: 'Brain Compiler',
    image: brainCompilerImg,
    category: 'Technical',
    description: '• Test your logical thinking and programming skills in this exciting brain challenge\n• Participants can join individually or as a team of 2\n• Round 1: Puzzle & Aptitude Quest - Solve 10 basic puzzles and aptitude questions\n• Mix of reasoning, number series, and simple logic problems\n• Mode: Google Form / Paper-based, Time: 20 minutes (2 minutes per question)\n• Checks logical thinking, analytical ability, and quick problem-solving skills\n• Round 2: Code Reverse - Qualified participants from Round 1 move to finals\n• Given only program output, write correct code (C/C++/Java/Python) to generate exact output\n• Mode: PC (Lab), Time: 40-45 minutes\n• Scoring based on total points + submission time, leaderboard determines winners\n• Round 1 is qualifier (top 20-30% move to finals), Round 2 decides winners\n• In case of tie, submission time is considered',
    date: '15 Sep 2025',
    time: 'To be announced soon',
    location: 'To be announced soon',
    price: '₹200',
    instructor: 'Akalya T',
    maxParticipants: 100
  },
  tech2: {
    id: 'tech2',
    title: 'Design Warrior',
    image: designWarriorImg,
    category: 'Technical',
    description: '• UI/UX Design Contest with quiz and hands-on design challenges\n• Team Size: 3 members per team, Venue: Computer Lab (20 systems in 2 rows)\n• Round 1: Quiz Challenge - Online quiz via Google Form displayed on Smart Board\n• 25 questions total, 5 minutes duration, teams need 20+ correct answers to qualify\n• Round 2: On-Name Design Challenge - Teams design application interface\n• Given concept/application name and UI components (buttons, icons, layouts)\n• Designing: 40 minutes, Explanation: 10 minutes overall\n• Judging: Creativity & Innovation, Usability & UX, Visual Appeal, Design Justification\n• Winners: Top 3 teams with best designs selected as winners\n• Quick elimination in Round 1, in-depth skill demonstration in Round 2',
    date: '15 Sep 2025',
    time: 'To be announced soon',
    location: 'To be announced soon',
    price: '₹200',
    instructor: 'Monish D',
    maxParticipants: 60
  },
  tech3: {
    id: 'tech3',
    title: 'Algoverse X',
    image: algoverseXImg,
    category: 'Technical',
    description: '• Dive into the universe of algorithms where complex problems meet innovative solutions\n• Requirements: 2-3 rows of PCs in the lab\n• Round 1: Code Quest - 10 pseudo code MCQs via Google Form (20 minutes)\n• Teams (2 members) or individuals can participate in Round 1\n• 5 simple logical algorithms + 5 hard algorithm and problem-solving questions\n• Round 2: HackerRank Showdown - Top performers from Round 1 qualify\n• 3 questions: 2 easy (25+25 points) + 1 medium (100 points) = 150 total points\n• 1.5 hours time frame with built-in leaderboard ranking\n• Winners selected based on HackerRank contest leaderboard performance',
    date: '15 Sep 2025',
    time: 'To be announced soon',
    location: 'To be announced soon',
    price: '₹200',
    instructor: 'Varun Karthikeyan M',
    maxParticipants: 100
  },
  tech4: {
    id: 'tech4',
    title: 'Vision X',
    image: visionXImg,
    category: 'Technical',
    description: '• Paper Presentation event offering a platform for students to showcase innovative research and technical skills\n• Time Limit: 5 minutes per team + 2 minutes Q&A session\n• Presentation Format: 12 slides (must include Introduction & Conclusion)\n• Venues: Seminar Hall, Mini-Seminar Hall, IT Lab (12 teams per hall)\n• Setup: Projectors (Seminar Halls), Raptor & HDMI (IT Lab), Mic & Sound System\n• Papers will be shortlisted - only selected teams can present\n• Presentations in PPT/PDF format with pen drive backup required\n• Reporting time: 30 minutes before event starts\n• Judging: Content quality, originality, presentation skills, time management, Q&A\n• Event updates and slot details shared via email - stay active on mail',
    date: '15 Sep 2025',
    time: 'To be announced soon',
    location: 'To be announced soon',
    price: '₹200',
    instructor: 'Vetriselvan G',
    maxParticipants: 144
  },
  non1: {
    id: 'non1',
    title: 'Rhythm & Rhyme',
    image: rhythmRhymeImg,
    category: 'Non-Technical',
    description: '• Test your spelling and music knowledge in this exciting challenge\n• Expected Members: 30 (Each team has two members) = 15 teams\n• Round 1: Spell Bee Challenge - Teams spell words of varying difficulty correctly\n• Incorrect spelling leads to elimination, teams shortlisted based on accuracy and speed\n• Round 2: Guess the Lyrics Challenge (8 teams qualify)\n• Teams identify and complete missing lyrics from popular songs\n• Each correct answer earns points, highest scores win\n• Winners selected based on Round 2 performance with prize distribution',
    date: '15 Sep 2025',
    time: 'To be announced soon',
    location: 'To be announced soon',
    price: '₹200',
    instructor: 'Ramya G, Yasmeen K',
    maxParticipants: 30
  },
  non2: {
    id: 'non2',
    title: 'Just A Minute',
    image: justAMinuteImg,
    category: 'Non-Technical',
    description: '• Think fast and speak faster in this exciting impromptu speaking challenge\n• Expected Members: 30 (16 teams with 2 members each)\n• Round 1: Image-to-Word Challenge - Teams identify words from four images\n• Teams are shortlisted for Round 2 based on performance\n• Round 2: Category Bidding Challenge (8 teams qualify)\n• Teams pick categories and bid on how many words they can name within one minute\n• Winners are selected based on Round 2 performance',
    date: '15 Sep 2025',
    time: 'To be announced soon',
    location: 'To be announced soon',
    price: '₹200',
    instructor: 'Rabinson R, Baskar P',
    maxParticipants: 30
  },
  non3: {
    id: 'non3',
    title: 'Booyah Carnival',
    image: booyahCarnivalImg,
    category: 'Non-Technical',
    description: 'Join the ultimate fun carnival with games, challenges, and entertainment galore. Create attractive presentations around surprise themes and showcase your creativity.',
    date: '15 Sep 2025',
    time: 'To be announced soon',
    location: 'To be announced soon',
    price: '₹200',
    instructor: 'Yuvaraj K',
    maxParticipants: 70
  },
  non4: {
    id: 'non4',
    title: 'Catch & Crunch',
    image: catchCrunchImg,
    category: 'Non-Technical',
    description: 'Quick thinking meets quick reflexes in this fast-paced mental and physical challenge. Solve riddles, crack clues, and explore the campus to win exciting prizes in teams.',
    date: '15 Sep 2025',
    time: 'To be announced soon',
    location: 'To be announced soon',
    price: '₹200',
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

          </div>

          <div className="event-description-detailed">
            <h3>About the Event</h3>
            <div>
              {event.description.split('\n').map((line, index) => (
                <p key={index} style={{ margin: '0.5rem 0', lineHeight: '1.6' }}>{line}</p>
              ))}
            </div>
          </div>

          <div className="event-actions">
            <Link to="/register" className="btn btn-primary">Register Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;