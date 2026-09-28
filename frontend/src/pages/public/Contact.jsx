import { useState } from 'react';
import { FiMail, FiMapPin, FiSend, FiCheckCircle, FiChevronDown, FiHelpCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    toast.success('Your message has been sent successfully!');
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const faqs = [
    {
      q: 'Is Wayfare free to use for planning trips?',
      a: 'Yes, creating itineraries, tracking expenses, and exploring destinations is completely free.'
    },
    {
      q: 'Can I share my itinerary with others?',
      a: 'Yes, you can publish itineraries to the Community Feed or share details with friends.'
    },
    {
      q: 'How do I add a new custom city or trip?',
      a: 'Click "New Trip" on your dashboard or explore catalog to start creating a personalized itinerary.'
    }
  ];

  return (
    <div className="contact-page">
      
      {/* Header */}
      <section className="contact-hero-section">
        <div className="contact-container text-center">
          <div className="contact-pill-badge">
            <span className="contact-dot"></span>
            <span>Contact Us</span>
          </div>
          <h1 className="contact-hero-title">
            We’d Love to <span className="text-gradient-primary">Hear from You</span>
          </h1>
          <p className="contact-hero-desc">
            Have questions, feedback, or need assistance? Reach out and we’ll get back to you quickly.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="contact-main-section">
        <div className="contact-container">
          <div className="contact-grid">
            
            {/* Contact Form */}
            <div className="card contact-form-card p-6">
              <h2 className="contact-card-title">Send a Message</h2>
              <p className="contact-card-subtitle">Leave your details and we will reply as soon as possible.</p>

              {submitted ? (
                <div className="contact-success-box text-center p-6 mt-4">
                  <FiCheckCircle size={32} className="text-success" />
                  <h3 className="text-base font-bold text-primary mt-2">Message Sent!</h3>
                  <p className="text-xs text-secondary mt-1">
                    Thank you for reaching out. We have received your message.
                  </p>
                  <button className="btn btn-secondary btn-sm mt-4" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form mt-4">
                  <div className="grid-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Name <span className="required">*</span></label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email <span className="required">*</span></label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Trip planning question"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message <span className="required">*</span></label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="form-textarea"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-full btn-lg mt-2">
                    <FiSend size={14} /> Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Direct Info */}
            <div className="contact-channels-column">
              <div className="card channel-card p-5">
                <div className="channel-icon blue"><FiMail size={20} /></div>
                <div className="channel-text">
                  <span className="channel-label">EMAIL SUPPORT</span>
                  <span className="channel-val">support@wayfare-os.com</span>
                  <span className="channel-sub">Quick responses within 24 hours</span>
                </div>
              </div>

              <div className="card channel-card p-5 mt-4">
                <div className="channel-icon emerald"><FiMapPin size={20} /></div>
                <div className="channel-text">
                  <span className="channel-label">PROJECT LOCATION</span>
                  <span className="channel-val">Wayfare Project Lab</span>
                  <span className="channel-sub">Ahmedabad, Gujarat, India</span>
                </div>
              </div>

              {/* Mini FAQ in sidebar */}
              <div className="card p-5 mt-4">
                <h3 className="text-sm font-bold text-primary mb-3">Quick Answers</h3>
                <div className="faq-mini-list">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="faq-mini-item mb-3">
                      <span className="text-xs font-semibold text-primary">{faq.q}</span>
                      <p className="text-xs text-muted mt-1">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
