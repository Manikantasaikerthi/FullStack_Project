import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Package, Clock, Truck, CheckCircle, MapPin, Phone } from 'lucide-react';
import TranslatedText from '../../components/common/TranslatedText';

const Orders = () => {
  const { orders } = useData();
  const { user } = useAuth();
  const { t } = useTranslation();


  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock size={20} color="var(--warning)" />;
      case 'PREPARING': return <Clock size={20} color="var(--primary)" />;
      case 'SHIPPED_TO_CONSULTANT': return <Truck size={20} color="var(--secondary)" />;
      case 'PROCESSING': return <Package size={20} color="var(--secondary)" />;
      case 'SHIPPED_TO_CUSTOMER': return <Truck size={20} color="var(--success)" />;
      case 'DELIVERED': return <CheckCircle size={20} color="var(--success)" />;
      default: return <Clock size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return t('order_placed');
      case 'PREPARING': return t('preparing');
      case 'SHIPPED_TO_CONSULTANT': return t('to_consultant');
      case 'PROCESSING': return t('verified');
      case 'SHIPPED_TO_CUSTOMER': return t('to_you');
      case 'DELIVERED': return t('delivered');
      default: return status;
    }
  };

  const getItemStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Waiting for Artisan';
      case 'PREPARING': return 'Being Crafted';
      case 'SHIPPED_TO_CONSULTANT': return 'In Transit to Hub';
      case 'RECEIVED_BY_CONSULTANT': return 'Quality Verified';
      default: return status.replace(/_/g, ' ');
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Your Orders</h1>
        <p style={{ color: 'var(--text-dim)' }}>Track your tribal treasures from the artisan to your door.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {sortedOrders.length === 0 ? (
          <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
            <Package size={64} style={{ color: 'var(--text-dim)', marginBottom: '1rem', opacity: 0.3 }} />
            <p style={{ color: 'var(--text-dim)' }}>You haven't placed any orders yet.</p>
          </div>
        ) : (
          sortedOrders.map(order => (
            <div key={order.id} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>ORDER ID: {order.id}</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '30px' }}>
                  {getStatusIcon(order.status)}
                  <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{getStatusText(order.status)}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ 
                      background: 'rgba(255,255,255,0.03)', 
                      padding: '1.25rem', 
                      borderRadius: '12px',
                      borderLeft: item.status === 'RECEIVED_BY_CONSULTANT' ? '4px solid var(--success)' : '4px solid var(--primary)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <p style={{ fontWeight: '600', fontSize: '1.1rem' }}><TranslatedText text={item.name} /></p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{t('artisan')}: {item.artisanName}</p>
                        </div>
                        <p style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{item.price}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {item.status === 'RECEIVED_BY_CONSULTANT' ? (
                          <CheckCircle size={14} color="var(--success)" />
                        ) : (
                          <div className="pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
                        )}
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: item.status === 'RECEIVED_BY_CONSULTANT' ? 'var(--success)' : 'var(--text-dim)' }}>
                          {getItemStatusText(item.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Delivery Details</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-dim)' }}>
                      <MapPin size={16} />
                      <span style={{ fontSize: '0.85rem' }}>{order.customerAddress}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-dim)' }}>
                      <Phone size={16} />
                      <span style={{ fontSize: '0.85rem' }}>{order.customerPhone}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-dim)' }}>{t('total_amount')}</span>
                      <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.2rem' }}>₹{order.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
