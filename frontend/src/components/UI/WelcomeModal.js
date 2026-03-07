import React from 'react';

export default function WelcomeModal({ isFirstTime, username, onClose }) {
  return (
    <div className="welcome-overlay" onClick={onClose}>
      <div className="welcome-card" onClick={e => e.stopPropagation()}>
        <div className="welcome-icon">{isFirstTime ? '🌿' : '🕯️'}</div>
        <h1>{isFirstTime ? 'Welcome to Haven' : `Welcome back, ${username}`}</h1>
        <p>
          {isFirstTime
            ? `Hello ${username}! You've just found your Haven — a place where your thoughts feel at home. Write freely, reflect deeply, and make it yours.`
            : `Your Haven has been waiting for you. Your notes and journal are right where you left them.`}
        </p>
        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
          onClick={onClose}
        >
          {isFirstTime ? "Let's begin ✨" : 'Continue →'}
        </button>
      </div>
    </div>
  );
}
