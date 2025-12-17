'use client';

import React, { useState } from 'react';

const ADMIN_EMAIL = 'myofficearmenia@gmail.com';

export default function AdminEmailLoginPopup({ isOpen, onClose, onLogin }: { isOpen: boolean, onClose: () => void, onLogin: () => void }) {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    setIsLoading(true);
    setMessage('');
    const emailToSend = String(email).trim();
    const res = await fetch('/api/admin/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailToSend }),
    });
    const data = await res.json();
    if (data.success) {
      setStep('code');
      setMessage('Code sent to your email.');
    } else {
      setMessage(data.error || 'Failed to send code.');
    }
    setIsLoading(false);
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    setMessage('');
    const emailToSend = String(email).trim();
    const res = await fetch('/api/admin/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailToSend, code }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('isAdmin', 'true');
      setMessage('Login successful!');
      onLogin();
      onClose();
      // Hard redirect to admin panel
      window.location.href = '/admin-panel';
    } else {
      setMessage(data.error || 'Invalid code.');
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff', padding: 24, borderRadius: 8, minWidth: 320, position: 'relative'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 8 }}>✕</button>
        <h2>Admin Email Login</h2>
        {step === 'email' && (
          <>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', marginBottom: 12, padding: 8 }}
            />
            <button onClick={handleSendCode} disabled={isLoading} style={{ width: '100%', padding: 8 }}>
              {isLoading ? 'Sending...' : 'Send Code'}
            </button>
          </>
        )}
        {step === 'code' && (
          <>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Enter code"
              style={{ width: '100%', marginBottom: 12, padding: 8 }}
            />
            <button onClick={handleVerifyCode} disabled={isLoading} style={{ width: '100%', padding: 8 }}>
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </>
        )}
        {message && <div style={{ marginTop: 12, color: 'blue' }}>{message}</div>}
      </div>
    </div>
  );
} 