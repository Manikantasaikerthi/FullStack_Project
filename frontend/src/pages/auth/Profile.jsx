import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, MapPin, Save, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useTranslation();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({ name, phone, address });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Your Profile</h1>
        <p style={{ color: 'var(--text-dim)' }}>Manage your contact and shipping information</p>
      </div>

      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: '600' }}>{t('full_name')}</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-dim)' }} />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', paddingLeft: '48px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: '600' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-dim)' }} />
              <input 
                type="email" 
                value={user?.email}
                disabled
                style={{ width: '100%', paddingLeft: '48px', background: 'rgba(255,255,255,0.05)', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: '600' }}>Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-dim)' }} />
              <input 
                type="tel" 
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ width: '100%', paddingLeft: '48px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: '600' }}>Shipping Address</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-dim)' }} />
              <textarea 
                rows={4}
                placeholder="Door No, Street Name, City, Pincode"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                style={{ width: '100%', paddingLeft: '48px', resize: 'none' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <Save size={18} /> Update Profile
          </button>

          {showSuccess && (
            <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: '600', padding: '10px', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '8px' }}>
              <CheckCircle size={18} /> Profile updated successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
