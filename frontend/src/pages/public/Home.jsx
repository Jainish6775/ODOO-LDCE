import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap, FiDollarSign, FiCompass, FiUsers, FiGlobe } from 'react-icons/fi';
import './Home.css';

export default function Home() {
  const coreFeatures = [
    {
      icon: <FiZap size={22} className="text-primary-400" />,
      title: 'Smart Itinerary Builder',
      desc: 'Build and customize multi-day trip schedules, activities, and daily travel plans with ease.'
    },
    {
      icon: <FiDollarSign size={22} className="text-success" />,
      title: 'Budget & Expense Tracking',
      desc: 'Set trip budgets, log flight and stay expenses, and track your spending in real time.'
    },
    {
      icon: <FiCompass size={22} className="text-accent-purple" />,
      title: '40+ World Destinations',
      desc: 'Explore curated city dossiers, popular landmarks, and travel tips for top global destinations.'
    },
    {
      icon: <FiUsers size={22} className="text-accent-amber" />,
      title: 'Community Feed',
      desc: 'Discover itineraries shared by fellow travelers, share experiences, and get inspired.'
    }
  ];

  return (
    <div className="landing-page">
      
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-container">
          <div className="hero-pill-badge">
            <span className="hero-radar-dot"></span>
            <span>Intelligent Travel Planning</span>
          </div>

          <h1 className="hero-title">
            Plan, Track & Experience Your <span className="text-gradient-aurora">Perfect Journey</span>
          </h1>

          <p className="hero-subtitle">
            Wayfare brings all your travel itineraries, budgets, and destination guides together into one simple, modern platform.
          </p>

          <div className="hero-cta-group">
            <Link to="/register" className="btn btn-primary btn-lg hero-btn-main">
              <FiZap /> Start Planning Free <FiArrowRight size={16} />
            </Link>
            <Link to="/explore" className="btn btn-secondary btn-lg">
              <FiGlobe /> Explore Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="landing-features-section">
        <div className="landing-container">
          <div className="features-grid">
            {coreFeatures.map((feat, idx) => (
              <div key={idx} className={`card feature-card spotlight-card tilt-card p-6 hover-lift stagger-${idx + 1}`}>
                <div className="feature-icon-box mb-4">
                  {feat.icon}
                </div>
                <h3 className="feature-card-title">{feat.title}</h3>
                <p className="feature-card-desc mt-2">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
