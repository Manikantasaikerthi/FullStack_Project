import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, User, LogOut, LayoutDashboard, ShieldCheck, PenTool, Languages, ChevronDown, UserCircle, Package, Truck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showLangs, setShowLangs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'ml', name: 'മലയാളം' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'mr', name: 'ಮರಾठी' }
  ];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setShowLangs(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-card" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 1000 }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '12px' }}>
          <ShoppingBag size={24} color="white" />
        </div>
        <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.05em' }}>TRIBAL<span style={{ color: 'var(--text)' }}>CRAFT</span></span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {/* Language Switcher */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowLangs(!showLangs)}
            style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text)', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}
          >
            <Languages size={18} />
            {languages.find(l => l.code === i18n.language.split('-')[0])?.name || 'Language'}
            <ChevronDown size={14} />
          </button>
          
          {showLangs && (
            <div className="glass-card animate-fade-in" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', width: '150px', overflow: 'hidden', zIndex: 1001 }}>
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  style={{ width: '100%', padding: '10px 16px', textAlign: 'left', background: i18n.language.startsWith(lang.code) ? 'var(--primary)' : 'transparent', color: i18n.language.startsWith(lang.code) ? 'white' : 'var(--text)', fontSize: '0.9rem', cursor: 'pointer', border: 'none' }}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <Link to="/" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: '500' }}>{t('explore')}</Link>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {user.role === 'artisan' && (
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <Link to="/artisan" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <PenTool size={18} /> {t('dashboard')}
                </Link>
                <Link to="/artisan/manage-orders" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Package size={18} /> {t('orders')}
                </Link>
              </div>
            )}
            {user.role === 'consultant' && (
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <Link to="/consultant" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} /> {t('consultant')}
                </Link>
                <Link to="/consultant/logistics" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Truck size={18} /> {t('logistics')}
                </Link>
              </div>
            )}
            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LayoutDashboard size={18} /> {t('admin')}
              </Link>
            )}
            {user.role === 'customer' && (
               <Link to="/orders" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={18} /> {t('orders')}
              </Link>
            )}
            
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ background: 'var(--surface-light)', color: 'var(--text)', padding: '5px 15px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', border: '1px solid var(--glass-border)' }}
              >
                <UserCircle size={20} />
                <span style={{ fontSize: '0.9rem' }}>{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>

              {showUserMenu && (
                <div className="glass-card animate-fade-in" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', width: '180px', overflow: 'hidden', zIndex: 1001 }}>
                  <Link to="/profile" onClick={() => setShowUserMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '12px 16px', color: 'var(--text)', textDecoration: 'none', fontSize: '0.9rem' }}>
                    <User size={16} /> Profile Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '12px 16px', color: 'var(--error)', background: 'transparent', cursor: 'pointer', border: 'none', borderTop: '1px solid var(--glass-border)', fontSize: '0.9rem' }}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem', textDecoration: 'none' }}>{t('login')}</Link>
            <Link to="/signup" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', textDecoration: 'none' }}>{t('join')}</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
