import { Link } from 'react-router-dom';
import { Button, Card, CardBody } from '../components/ui';
import './Landing.css';
import logo from "../assets/logo.png";


const features = [
  {
    icon: '🧠',
    title: 'Smart Planning',
    description: 'AI breaks your deadlines into daily micro-tasks with realistic time blocks. No more guessing what to do next.',
    color: 'var(--color-primary)',
  },
  {
    icon: '⚠️',
    title: 'Risk Alerts',
    description: 'Proactive warnings when you\'re falling behind. Catch procrastination before it catches you.',
    color: 'var(--color-warning-dark)',
  },
  {
    icon: '🔄',
    title: 'Dynamic Rescheduling',
    description: 'Missed a task? The plan adapts automatically, redistributing work across remaining days.',
    color: 'var(--color-accent)',
  },
];

const steps = [
  { number: '01', title: 'Add Your Tasks', description: 'Input assignments, exams and projects with deadlines and priorities.' },
  { number: '02', title: 'Get Your Plan', description: 'AI generates a personalized day-wise execution plan instantly.' },
  { number: '03', title: 'Execute & Track', description: 'Follow your plan, mark tasks done and watch your progress grow.' },
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-inner container">
          <Link to="/" className="landing-logo">
            <img src={logo} alt="logo" className="landing-logo-icon" />
            <span className="landing-logo-text">Actify</span>
          </Link>
          <div className="landing-nav-links">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🚀</span> AI-Powered Academic Planner
            </div>
            <h1 className="hero-title">
              Stop Procrastinating.<br />
              <span className="hero-title-accent">Start Executing.</span>
            </h1>
            <p className="hero-subtitle">
              Transform your deadlines into structured daily action plans. 
              Know exactly what to do, when to do it, and never miss a deadline again.
            </p>
            <div className="hero-cta">
              <Link to="/signup">
                <Button variant="primary" size="lg">
                  Start Planning Free →
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  I Have an Account
                </Button>
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">|</span>
                <span className="hero-stat-label">Smart Scheduling</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">|</span>
                <span className="hero-stat-label">Risk Detection</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">|</span>
                <span className="hero-stat-label">Progress Tracking</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hero-visual">
            <Card variant="default" className="hero-card hero-card-1 animate-fadeInUp">
              <CardBody>
                <div className="hero-card-header">
                  <span className="hero-card-icon">📝</span>
                  <span className="hero-card-title">Today's Plan</span>
                </div>
                <div className="hero-task">
                  <div className="hero-task-check done">✓</div>
                  <div>
                    <div className="hero-task-name">Math Ch.5 Review</div>
                    <div className="hero-task-time">9:00 - 10:30 AM</div>
                  </div>
                </div>
                <div className="hero-task">
                  <div className="hero-task-check done">✓</div>
                  <div>
                    <div className="hero-task-name">Physics Lab Report</div>
                    <div className="hero-task-time">11:00 AM - 12:30 PM</div>
                  </div>
                </div>
                <div className="hero-task">
                  <div className="hero-task-check">○</div>
                  <div>
                    <div className="hero-task-name">CS Assignment Q4-Q6</div>
                    <div className="hero-task-time">2:00 - 4:00 PM</div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card variant="primary" className="hero-card hero-card-2 animate-fadeInUp delay-2">
              <CardBody>
                <div className="hero-card-header">
                  <span className="hero-card-icon">📈</span>
                  <span className="hero-card-title">Progress</span>
                </div>
                <div className="hero-progress-item">
                  <span>Math Exam</span>
                  <div className="hero-progress-bar">
                    <div className="hero-progress-fill" style={{ width: '75%' }}></div>
                  </div>
                  <span>75%</span>
                </div>
                <div className="hero-progress-item">
                  <span>CS Project</span>
                  <div className="hero-progress-bar">
                    <div className="hero-progress-fill accent" style={{ width: '45%' }}></div>
                  </div>
                  <span>45%</span>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Students Love Actify</h2>
            <p>Intelligent features that actually help you get things done</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <Card key={index} hoverable className={`feature-card animate-fadeInUp delay-${index + 1}`}>
                <CardBody>
                  <div className="feature-icon" style={{ backgroundColor: feature.color }}>
                    {feature.icon}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Three simple steps to academic success</p>
          </div>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={index} className={`step animate-fadeInUp delay-${index + 1}`}>
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <Card className="cta-card">
            <CardBody>
              <h2>Ready to Stop Procrastinating?</h2>
              <p>Join thousands of students who've taken control of their academic life</p>
              <Link to="/signup">
                <Button variant="primary" size="md">
                  Get Started — It's Free 🎯
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <img src={logo} alt="logo" className="landing-logo-icon" />
              <span className="landing-logo-text">Actify</span>
            </div>
            <p className="footer-tagline">AI-Powered Academic Execution Planner</p>
            <p className="footer-copy">Made by Alpha Bro's</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
