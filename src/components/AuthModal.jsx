import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { X, Mail, Lock, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY } from '../config/emailjs';

// ─── Helpers ───────────────────────────────────────────────────────
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

const getPasswordStrength = (pwd) => {
  if (!pwd) return null;
  const len = pwd.length >= 8;
  const hasLower = /[a-z]/.test(pwd);
  const hasUpper = /[A-Z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);
  const types = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  if (!len) return { label: 'Too Short', color: '#ff4444', width: '20%' };
  if (types <= 1) return { label: 'Weak', color: '#ff6633', width: '30%' };
  if (types === 2) return { label: 'Medium', color: '#ffaa00', width: '60%' };
  if (types === 3) return { label: 'Strong', color: '#00cc88', width: '85%' };
  return { label: 'Very Strong', color: '#00ffcc', width: '100%' };
};

const useEmailJSReady = () => EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';

// ─── Component ─────────────────────────────────────────────────────
const AuthModal = ({ onClose }) => {
  const { login } = useAuth();
  const emailJSConfigured = useEmailJSReady();

  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const strength = getPasswordStrength(password);
  const emailError = emailTouched && email && !isValidEmail(email);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) { setError('Please enter a valid email address.'); return; }
    if (!password) { setError('Password is required.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    setIsLoading(true);

    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);

      if (emailJSConfigured) {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          { email: email, to_name: email.split('@')[0], passcode: code },
          EMAILJS_PUBLIC_KEY
        );
        setStep('otp');
        setIsLoading(false);
      } else {
        // Fallback: show OTP in UI when EmailJS not configured
        setGeneratedOtp(code);
        setStep('otp');
        setIsLoading(false);
        setError(`⚠️ EmailJS not configured. Demo OTP: ${code}`);
      }
    } catch (err) {
      setIsLoading(false);
      console.error('EmailJS Error:', err);
      const msg = err?.text || err?.message || JSON.stringify(err);
      setError(`EmailJS Error: ${msg}`);
    }
  };

  const handleOtpChange = (el, index) => {
    const val = el.value;
    if (isNaN(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && el.nextSibling) el.nextSibling.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = e.target.previousSibling;
      if (prev) prev.focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');
    const entered = otp.join('');
    if (entered.length !== 6) { setError('Enter all 6 digits.'); return; }
    if (entered !== generatedOtp) { setError('Incorrect OTP. Please check your email and try again.'); return; }

    setIsLoading(true);
    setTimeout(() => { login(email); onClose(); }, 600);
  };

  // ─── Input style helper ───────────────────────────────────────────
  const inputStyle = (hasError) => ({
    width: '100%', padding: '0.95rem 1rem 0.95rem 2.75rem',
    background: '#1a1a22',
    border: `1px solid ${hasError ? '#ff4444' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '12px', color: '#fff', fontSize: '1rem',
    outline: 'none', fontFamily: 'Roboto, sans-serif',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box'
  });

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(12px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '440px', background: '#12121a', borderRadius: '20px', border: '1px solid rgba(0, 255, 204, 0.25)', boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 50px rgba(0, 255, 204, 0.08)', padding: '3rem 2.5rem', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
      >
        {/* Close */}
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'flex', transition: 'color 0.2s' }}
          onMouseOver={e => e.currentTarget.style.color = '#fff'}
          onMouseOut={e => e.currentTarget.style.color = '#555'}>
          <X size={22} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '52px', height: '52px', margin: '0 auto 1rem', background: 'rgba(0,255,204,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,255,204,0.3)' }}>
            <ShieldCheck size={26} color="#00ffcc" />
          </div>
          <h2 style={{ color: '#fff', fontSize: '1.7rem', fontWeight: 800, margin: '0 0 0.4rem', fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.5px' }}>
            {step === 'credentials' ? 'Welcome Back' : 'Verify Email'}
          </h2>
          <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
            {step === 'credentials'
              ? 'Sign in to access your TravelScape account.'
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(255, 60, 0, 0.08)', border: '1px solid rgba(255, 80, 0, 0.4)', color: '#ff8866', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.875rem', textAlign: 'center', lineHeight: 1.4 }}>
            {error}
          </div>
        )}

        {/* ── Step 1: Credentials ── */}
        {step === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            {/* Email */}
            <div>
              <div style={{ position: 'relative' }}>
                <Mail size={17} color={emailError ? '#ff4444' : '#555'} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  style={inputStyle(emailError)}
                  onFocus={e => { e.target.style.borderColor = 'rgba(0,255,204,0.5)'; e.target.style.boxShadow = '0 0 12px rgba(0,255,204,0.15)'; }}
                  onBlurCapture={e => { if (!emailError) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; } }}
                />
              </div>
              {emailError && (
                <p style={{ color: '#ff4444', fontSize: '0.78rem', margin: '5px 0 0 4px' }}>Please enter a valid email address.</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div style={{ position: 'relative' }}>
                <Lock size={17} color="#555" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min. 8 characters)"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ ...inputStyle(false), paddingRight: '2.75rem' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(0,255,204,0.5)'; e.target.style.boxShadow = '0 0 12px rgba(0,255,204,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer', padding: '2px', display: 'flex' }}
                  onMouseOver={e => e.currentTarget.style.color = '#fff'}
                  onMouseOut={e => e.currentTarget.style.color = '#555'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength meter */}
              {password && strength && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: strength.width, background: strength.color, borderRadius: '4px', transition: 'width 0.3s, background 0.3s' }} />
                  </div>
                  <p style={{ color: strength.color, fontSize: '0.78rem', margin: '4px 0 0 2px', fontWeight: 600 }}>{strength.label}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{ padding: '1.1rem', background: isLoading ? '#2a2a35' : '#00ffcc', color: isLoading ? '#666' : '#000', fontWeight: 800, fontSize: '1rem', borderRadius: '12px', border: 'none', cursor: isLoading ? 'default' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.8px', boxShadow: isLoading ? 'none' : '0 0 20px rgba(0,255,204,0.25)', transition: 'all 0.2s', marginTop: '0.5rem' }}
              onMouseOver={e => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(0,255,204,0.45)'; } }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isLoading ? 'none' : '0 0 20px rgba(0,255,204,0.25)'; }}
            >
              {isLoading ? 'Sending OTP...' : (<>Send OTP <ArrowRight size={17} /></>)}
            </button>
          </form>
        )}

        {/* ── Step 2: OTP ── */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>

            {/* 6 digit boxes */}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  autoFocus={i === 0}
                  onChange={e => handleOtpChange(e.target, i)}
                  onKeyDown={e => handleOtpKeyDown(e, i)}
                  style={{
                    width: '46px', height: '56px',
                    textAlign: 'center', fontSize: '1.5rem', fontWeight: 700,
                    color: '#fff', background: '#1a1a22',
                    border: `1px solid ${digit ? 'rgba(0,255,204,0.5)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: '10px', outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxShadow: digit ? '0 0 10px rgba(0,255,204,0.2)' : 'none'
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(0,255,204,0.7)'; e.target.style.boxShadow = '0 0 14px rgba(0,255,204,0.25)'; }}
                  onBlur={e => { if (!digit) { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; } }}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{ width: '100%', padding: '1.1rem', background: isLoading ? '#2a2a35' : '#fff', color: '#000', fontWeight: 800, fontSize: '1rem', borderRadius: '12px', border: 'none', cursor: isLoading ? 'default' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.8px', boxShadow: '0 0 20px rgba(255,255,255,0.15)', transition: 'all 0.2s' }}
            >
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem' }}>
              <span
                onClick={() => { setStep('credentials'); setOtp(['','','','','','']); setError(''); }}
                style={{ color: '#555', cursor: 'pointer', textDecoration: 'underline' }}
                onMouseOver={e => e.currentTarget.style.color = '#aaa'}
                onMouseOut={e => e.currentTarget.style.color = '#555'}
              >
                ← Change email
              </span>
              <span
                onClick={() => handleCredentialsSubmit({ preventDefault: () => {} })}
                style={{ color: '#555', cursor: 'pointer', textDecoration: 'underline' }}
                onMouseOver={e => e.currentTarget.style.color = '#aaa'}
                onMouseOut={e => e.currentTarget.style.color = '#555'}
              >
                Resend OTP
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
