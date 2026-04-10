import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTranslation } from 'react-i18next';
import { Plus, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const ArtisanDashboard = () => {
  const { user } = useAuth();
  const { products } = useData();
  const { t } = useTranslation();
  
  const myProducts = products.filter(p => p.artisanEmail === user.email);
  const pendingCount = myProducts.filter(p => !p.approved).length;
  const approvedCount = myProducts.filter(p => p.approved).length;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{t('artisan_dashboard')}</h1>
          <p style={{ color: 'var(--text-dim)' }}>{t('manage_workspace')}</p>
        </div>
        <Link to="/artisan/add-product" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Plus size={20} /> {t('add_product')}
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(139, 94, 52, 0.15)', color: 'var(--primary)', padding: '1rem', borderRadius: '12px' }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800' }}>{myProducts.length}</div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{t('total_products')}</div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(76, 175, 80, 0.15)', color: 'var(--success)', padding: '1rem', borderRadius: '12px' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800' }}>{approvedCount}</div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{t('live_on_site')}</div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(255, 152, 0, 0.15)', color: 'var(--warning)', padding: '1rem', borderRadius: '12px' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '800' }}>{pendingCount}</div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{t('pending_review')}</div>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem' }}>{t('your_inventory')}</h2>
      {myProducts.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <Package size={48} style={{ color: 'var(--text-dim)', marginBottom: '1rem', opacity: 0.5 }} />
          <p style={{ color: 'var(--text-dim)' }}>{t('no_products_yet')}</p>
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--surface-light)', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                <th style={{ padding: '1.5rem' }}>{t('product')}</th>
                <th style={{ padding: '1.5rem' }}>{t('price')}</th>
                <th style={{ padding: '1.5rem' }}>{t('date_added')}</th>
                <th style={{ padding: '1.5rem' }}>{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {myProducts.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={product.imageUrl} alt="" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                    <span style={{ fontWeight: '600' }}>{product.name}</span>
                  </td>
                  <td style={{ padding: '1.5rem' }}>₹{product.price}</td>
                  <td style={{ padding: '1.5rem', color: 'var(--text-dim)' }}>{new Date(product.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1.5rem' }}>
                    {product.approved ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.85rem', fontWeight: '600' }}>
                        <CheckCircle size={14} /> {t('approved')}
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', fontSize: '0.85rem', fontWeight: '600' }}>
                        <Clock size={14} /> {t('pending_review')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ArtisanDashboard;
