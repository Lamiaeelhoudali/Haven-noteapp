import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ── Star generator ────────────────────────────────────────
// 60 stars total: 30 twinkling + 30 sparkling
// Colors match the aurora: blue, purple, green, cyan, violet

const STAR_COLORS = ['star-blue', 'star-purple', 'star-green', 'star-cyan', 'star-violet'];

function generateStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    // random position anywhere on screen
    top:  `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    // random size between 2px and 5px
    size: Math.random() * 3 + 2,
    // random aurora color
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    // random animation duration between 2s and 6s
    duration: Math.random() * 4 + 2,
    // random delay so they don't all pulse together
    delay: Math.random() * 5,
    // half twinkle, half sparkle
    type: i < count / 2 ? 'star-twinkle' : 'star-sparkle',
  }));
}

export default function AuthPage() {
  const [isLogin,  setIsLogin]  = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // useMemo so stars don't regenerate on every keystroke
  const stars = useMemo(() => generateStars(60), []);

  // ── Frontend validation ───────────────────────────────────
  const validate = () => {
    const e = {};
    if (!username.trim())
      e.username = 'Username is required.';
    else if (!isLogin && username.trim().length < 3)
      e.username = 'Username must be at least 3 characters.';
    else if (!isLogin && !/^[a-zA-Z0-9_]+$/.test(username.trim()))
      e.username = 'Only letters, numbers, and underscores allowed.';
    if (!password)
      e.password = 'Password is required.';
    else if (password.length < 6)
      e.password = 'Password must be at least 6 characters.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const frontendErrors = validate();
    if (Object.keys(frontendErrors).length > 0) {
      setErrors(frontendErrors);
      return;
    }
    setLoading(true);
    try {
      await (isLogin ? login : register)(username.trim(), password);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (data?.field) {
        setErrors({ [data.field]: data.message });
      } else {
        setErrors({ general: data?.message || 'Something went wrong. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const FieldError = ({ name }) =>
    errors[name] ? (
      <div style={{ color: '#ffaaaa', fontSize: '0.78rem', marginTop: '0.25rem', textAlign: 'left' }}>
        ⚠️ {errors[name]}
      </div>
    ) : null;

  return (
    <div className="login-page">

      {/* ── Aurora blobs ── */}
      <div className="aurora-1" />
      <div className="aurora-2" />
      <div className="aurora-3" />

      {/* ── 60 Stars (30 twinkling + 30 sparkling) ── */}
      {stars.map(star => (
        <div
          key={star.id}
          className={`star ${star.type} ${star.color}`}
          style={{
            top:             star.top,
            left:            star.left,
            width:           star.size,
            height:          star.size,
            animationDuration:  `${star.duration}s`,
            animationDelay:     `${star.delay}s`,
          }}
        />
      ))}

      {/* ── Floating orbs (bubbles) ── */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
      <div className="orb orb-5" />

      {/* ── Waves ── */}
      <div className="waves-container">
        <div className="wave-1" />
        <div className="wave-2" />
        <div className="wave-3" />
      </div>

      {/* ── Login card ── */}
      <div className="login-card">
        <div className="login-brand-name">Haven</div>
        <div className="login-brand-tagline">A place where your thoughts feel at home</div>

        <form onSubmit={handleSubmit} noValidate>

          <label className="login-label">Username</label>
          <input
            className="login-input"
            style={errors.username ? { borderColor: '#ff6b6b' } : {}}
            type="text"
            placeholder="your_username"
            value={username}
            onChange={e => { setUsername(e.target.value); setErrors(prev => ({ ...prev, username: '' })); }}
            autoFocus
            autoComplete="username"
          />
          <FieldError name="username" />

          <label className="login-label" style={{ marginTop: '0.75rem' }}>Password</label>
          <input
            className="login-input"
            style={errors.password ? { borderColor: '#ff6b6b' } : {}}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
          <FieldError name="password" />

          {errors.general && (
            <div className="login-error">⚠️ {errors.general}</div>
          )}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? '⏳ Please wait...' : isLogin ? '✨ Enter Haven' : '🌿 Create My Haven'}
          </button>
        </form>

        {!isLogin && (
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>
            Password must be at least 6 characters
          </div>
        )}

        <div className="login-switch">
          {isLogin ? "New here? " : "Already have an account? "}
          <button onClick={() => { setIsLogin(!isLogin); setErrors({}); }}>
            {isLogin ? 'Create an account' : 'Sign in'}
          </button>
        </div>
      </div>

    </div>
  );
}
