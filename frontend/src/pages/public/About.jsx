import { Link } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight, FiTarget, FiActivity, FiGlobe, FiShield, FiZap } from 'react-icons/fi';
import './About.css';

export default function About() {
  const values = [
    {
      icon: <FiTarget size={22} className="text-primary-400" />,
      title: 'Intuitive Itinerary Planning',
      desc: 'Create clear, structured daily plans that keep your journeys organized and stress-free.'
    },
    {
      icon: <FiActivity size={22} className="text-success" />,
      title: 'Expense & Budget Clarity',
      desc: 'Keep track of all travel expenses and flight details with clear financial overviews.'
    },
    {
      icon: <FiGlobe size={22} className="text-accent-purple" />,
      title: 'Worldwide City Guides',
      desc: 'Explore vetted landmarks, weather forecasts, and key attractions across top destinations.'
    },
    {
      icon: <FiShield size={22} className="text-accent-amber" />,
      title: 'Safe & Secure',
      desc: 'Your accounts, trip data, and preferences are protected with secure authentication.'
    }
  ];

  return (
    <div className="about-page">
      
      {/* Header */}
      <section className="about-hero-section">
        <div className="about-container text-center">
          <div className="about-pill-badge">
            <span className="about-dot"></span>
            <span>About Wayfare</span>
          </div>
          <h1 className="about-hero-title">
            Making Travel Planning <span className="text-gradient-aurora">Simple & Inspiring</span>
          </h1>
          <p className="about-hero-desc">
            We believe exploring the world should be exciting, not overwhelming. Wayfare was built to bring your itineraries, budgets, and destination inspiration together in one clean platform.
          </p>
        </div>
      </section>

      {/* Mission Cards */}
      <section className="about-mission-section">
        <div className="about-container">
          <div className="grid-2 gap-6">
            <div className="card about-story-card p-6">
              <h2 className="story-card-title">Our Mission</h2>
              <p className="story-card-text">
                Travelers often struggle with disorganized notes, scattered booking emails, and complicated spreadsheets. Our goal is to streamline the entire travel lifecycle so you can spend less time organizing and more time enjoying your journey.
              </p>
            </div>

            <div className="card about-story-card p-6">
              <h2 className="story-card-title">What We Value</h2>
              <div className="story-highlights">
                <div className="highlight-row">
                  <FiCheckCircle className="text-success" />
                  <span>Simplicity and clear, accessible design for all travelers</span>
                </div>
                <div className="highlight-row">
                  <FiCheckCircle className="text-success" />
                  <span>Accurate destination information and curated routes</span>
                </div>
                <div className="highlight-row">
                  <FiCheckCircle className="text-success" />
                  <span>A helpful community sharing real travel experiences</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="about-pillars-section">
        <div className="about-container">
          <div className="section-heading-wrap text-center mb-6">
            <h2 className="section-title">What Wayfare Delivers</h2>
          </div>

          <div className="grid-4 gap-6">
            {values.map((v, idx) => (
              <div key={idx} className="card pillar-card p-5 hover-lift">
                <div className="pillar-icon-box mb-3">{v.icon}</div>
                <h3 className="pillar-title">{v.title}</h3>
                <p className="pillar-desc mt-2">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
