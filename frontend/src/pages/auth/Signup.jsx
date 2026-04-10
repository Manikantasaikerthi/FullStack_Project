import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { User, Mail, Lock, Briefcase, CheckCircle } from 'lucide-react';

const Signup = () => {
  const [role, setRole] = useState('customer'); // 'customer' or 'artisan'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const { signup } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await signup({ name, email, password, role });
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.message);
    }
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: '500px', margin: '6rem auto', textAlign: 'center' }} className="animate-fade-in">
        <div className="glass-card" style={{ padding: '3rem' }}>
          <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '1.5rem' }} />
          <h1 style={{ marginBottom: '1rem' }}>{t('submit')}!</h1>
          <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
            {role === 'artisan' 
              ? 'Your artisan registration request has been sent for review. A consultant will verify your profile shortly.'
              : 'Your account has been created. You can now log in to start exploring.'}
          </p>
          <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>{t('back_to_login')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '4rem auto' }} className="animate-fade-in">
      <div className="glass-card" style={{ padding: '3rem' }}>
        <h1 style={{ marginBottom: '1rem', textAlign: 'center' }}>{t('register_title')}</h1>
        <p style={{ color: 'var(--text-dim)', marginBottom: '2.5rem', textAlign: 'center' }}>{t('register_sub')}</p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: 'var(--surface-light)', padding: '6px', borderRadius: '12px' }}>
          <button 
            type="button"
            onClick={() => setRole('customer')}
            style={{ 
              flex: 1, 
              padding: '12px', 
              borderRadius: '8px', 
              background: role === 'customer' ? 'var(--primary)' : 'transparent',
              color: role === 'customer' ? 'white' : 'var(--text-dim)',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <User size={16} /> {t('customer')}
          </button>
          <button 
            type="button"
            onClick={() => setRole('artisan')}
            style={{ 
              flex: 1, 
              padding: '12px', 
              borderRadius: '8px', 
              background: role === 'artisan' ? 'var(--primary)' : 'transparent',
              color: role === 'artisan' ? 'white' : 'var(--text-dim)',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Briefcase size={16} /> {t('artisan')}
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 67, 54, 0.1)', color: 'var(--error)', padding: '12px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input 
              type="text" 
              placeholder={t('full_name')} 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', paddingLeft: '48px' }}
            />
          </div>
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
          
          <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }}>
            {t('create_account')}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            {t('already_account')} <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>{t('login')}</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
