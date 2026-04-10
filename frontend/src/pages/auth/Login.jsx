import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
  const [error, setError] = useState('');
  const [tempUser, setTempUser] = useState(null);
  
  const { login, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      setTempUser(result.user);
      setStep(2);
      // Backend automatically sends OTP during login step
    } else {
      setError(result.message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await verifyOtp(email, otp, tempUser);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid OTP code.');
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '4rem auto', textAlign: 'center' }} className="animate-fade-in">
      <div className="glass-card" style={{ padding: '3rem' }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>
          {step === 1 ? t('welcome') : t('security')}
        </h1>
        <p style={{ color: 'var(--text-dim)', marginBottom: '2.5rem' }}>
          {step === 1 
            ? 'Sign in to access your tribal craft account' 
            : `We've sent a 6-digit code to ${email}`}
        </p>

        {error && (
          <div style={{ background: 'rgba(244, 67, 54, 0.1)', color: 'var(--error)', padding: '12px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input 
                type="email" 
                placeholder={t('email')} 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', paddingLeft: '48px' }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input 
                type="password" 
                placeholder={t('password')} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', paddingLeft: '48px' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              {t('login')} <ArrowRight size={18} />
            </button>

          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <ShieldCheck size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input 
                type="text" 
                placeholder="Enter 6-digit OTP" 
                required 
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ width: '100%', paddingLeft: '48px', textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.5em' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
              {t('verify_login')}
            </button>
            <button 
              type="button" 
              onClick={() => setStep(1)}
              style={{ background: 'transparent', color: 'var(--text-dim)', fontSize: '0.9rem', cursor: 'pointer' }}
            >
              {t('back_to_login')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
