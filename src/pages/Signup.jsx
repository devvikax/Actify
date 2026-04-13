import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/ui';
import './Auth.css';
import logo from "../assets/logo.png";

/**
 * Map Firebase error codes to user-friendly messages.
 */
function getAuthErrorMessage(error) {
  const code = error?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign up is not enabled.';
    default:
      return error?.message || 'Something went wrong. Please try again.';
  }
}

export default function Signup() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in using useEffect to avoid render-phase side effects
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!displayName.trim()) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);

    try {
      const { user: newUser } = await signup(email, password);

      // Set display name on the Firebase user profile
      await updateProfile(newUser, {
        displayName: displayName.trim(),
      });

      navigate('/dashboard');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-back">
        <Link to="/">← Back to Home</Link>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <img src={logo} alt="logo" className="landing-logo-icon" />
            <span className="landing-logo-text">Actify</span>
          </div>
          <h1 className="auth-title">Create Your Account</h1>
          <p className="auth-subtitle">Start planning smarter today</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            id="signup-name"
            label="Full Name"
            type="text"
            placeholder="Alex Johnson"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            id="signup-email"
            label="Email"
            type="email"
            placeholder="you@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            id="signup-password"
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
          />

          <Input
            id="signup-confirm"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account →'}
          </Button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
}
