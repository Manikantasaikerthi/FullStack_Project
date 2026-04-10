import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, UserCheck, Package, Check, X, Clock, AlertCircle } from 'lucide-react';

const ConsultantDashboard = () => {
  const { products, artisanRequests, approveProduct, approveArtisan, rejectProduct, rejectArtisan } = useData();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'artisans'

  const pendingProducts = products.filter(p => !p.approved);
  const pendingArtisans = artisanRequests.filter(a => !a.approved);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{t('consultant')}</h1>
        <p style={{ color: 'var(--text-dim)' }}>{t('review_verify_desc')}</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
        <button 
          onClick={() => setActiveTab('products')}
          className="glass-card" 
          style={{ 
            flex: 1, 
            padding: '2rem', 
            textAlign: 'left',
            cursor: 'pointer',
            border: activeTab === 'products' ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
            background: activeTab === 'products' ? 'rgba(139, 94, 52, 0.1)' : 'var(--glass)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Package size={24} color={activeTab === 'products' ? 'var(--primary)' : 'var(--text-dim)'} />
            <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>{pendingProducts.length} NEW</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{t('product_submissions')}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Verify materials and pricing for new listings.</p>
        </button>

        <button 
          onClick={() => setActiveTab('artisans')}
          className="glass-card" 
          style={{ 
            flex: 1, 
            padding: '2rem', 
            textAlign: 'left',
            cursor: 'pointer',
            border: activeTab === 'artisans' ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
            background: activeTab === 'artisans' ? 'rgba(139, 94, 52, 0.1)' : 'var(--glass)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <UserCheck size={24} color={activeTab === 'artisans' ? 'var(--primary)' : 'var(--text-dim)'} />
            <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>{pendingArtisans.length} NEW</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{t('artisan_registrations')}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Vet tribal artisans and verify authenticity.</p>
        </button>
      </div>

      {activeTab === 'products' ? (
        <section>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock size={24} style={{ color: 'var(--warning)' }} /> {t('pending_products')}
          </h2>
          {pendingProducts.length === 0 ? (
            <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
              <Check size={48} style={{ color: 'var(--success)', marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ color: 'var(--text-dim)' }}>{t('no_pending_products')}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {pendingProducts.map(product => (
                <div key={product.id} className="glass-card" style={{ overflow: 'hidden' }}>
                  <img src={product.imageUrl} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.1rem' }}>{product.name}</h3>
                      <span style={{ color: 'var(--primary)', fontWeight: '700' }}>₹{product.price}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      <span>{t('by')} <b>{product.artisanName}</b></span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button 
                        onClick={() => approveProduct(product.id)}
                        className="btn-primary" 
                        style={{ flex: 1, padding: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--success)' }}
                      >
                        <Check size={16} /> {t('approve')}
                      </button>
                      <button 
                        onClick={() => rejectProduct(product.id)}
                        className="btn-outline" 
                        style={{ flex: 1, padding: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        <X size={16} /> {t('reject')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock size={24} style={{ color: 'var(--warning)' }} /> {t('pending_artisans')}
          </h2>
          {pendingArtisans.length === 0 ? (
            <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
              <Check size={48} style={{ color: 'var(--success)', marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ color: 'var(--text-dim)' }}>{t('no_pending_artisans')}</p>
            </div>
          ) : (
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-light)', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                    <th style={{ padding: '1.5rem' }}>{t('full_name')}</th>
                    <th style={{ padding: '1.5rem' }}>{t('email')}</th>
                    <th style={{ padding: '1.5rem' }}>{t('status')}</th>
                    <th style={{ padding: '1.5rem' }}>{t('submit')}</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingArtisans.map(artisan => (
                    <tr key={artisan.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1.5rem', fontWeight: '600' }}>{artisan.name}</td>
                      <td style={{ padding: '1.5rem', color: 'var(--text-dim)' }}>{artisan.email}</td>
                      <td style={{ padding: '1.5rem' }}>
                        <span style={{ color: 'var(--warning)', fontSize: '0.85rem', fontWeight: '600' }}>{t('pending_review')}</span>
                      </td>
                      <td style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <button 
                          onClick={() => approveArtisan(artisan.id)}
                          style={{ background: 'var(--success)', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
                        >
                          <Check size={14} /> {t('approve')}
                        </button>
                        <button 
                          onClick={() => rejectArtisan(artisan.id)}
                          style={{ background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                        >
                          {t('reject')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default ConsultantDashboard;
