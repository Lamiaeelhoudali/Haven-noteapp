import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../utils/api';

export default function PinModal({ entry, onSuccess, onClose }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleKey = (digit) => {
    if (pin.length < 4) setPin(p => p + digit);
  };
  const handleBack = () => setPin(p => p.slice(0, -1));

  const submit = async (currentPin) => {
    setLoading(true);
    try {
      const res = await api.post(`/journal/${entry._id}/unlock`, { pin: currentPin });
      onSuccess(res.data.data);
    } catch {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 900);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pin.length === 4) submit(pin);
  }, [pin]);

  return (
    <div className="pin-overlay">
      <div className="pin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3>🔒 Locked Entry</h3>
          <button className="btn-icon" onClick={onClose}><X size={15} /></button>
        </div>
        <p>Enter your 4-digit PIN</p>

        <div className="pin-dots">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`pin-dot ${i < pin.length ? 'filled' : ''} ${error ? 'error' : ''}`}
            />
          ))}
        </div>

        {error && <div className="pin-error-text">Incorrect PIN. Try again.</div>}

        <div className="pin-keypad">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} className="pin-key" onClick={() => handleKey(String(n))} disabled={loading}>
              {n}
            </button>
          ))}
          <button className="pin-key" onClick={handleBack} disabled={loading}>⌫</button>
          <button className="pin-key" onClick={() => handleKey('0')} disabled={loading}>0</button>
          <button className="pin-key" onClick={onClose} style={{ color: '#e05555' }}>✕</button>
        </div>
      </div>
    </div>
  );
}
