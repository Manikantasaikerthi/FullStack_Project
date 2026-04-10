import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Package, Clock, Truck, Check, MapPin, Phone } from 'lucide-react';

const ManageOrders = () => {
  const { orders, updateOrderStatus, updateItemStatus } = useData();
  const { user } = useAuth();
  const { t } = useTranslation();

  // An order can have multiple items, some might belong to this artisan.
  // We filter orders that contain at least one item from this artisan.
  const artisanOrders = orders.filter(o => 
    o.items.some(item => item.artisanEmail === user.email)
  );

  const getStatusAction = (orderId, itemId, itemStatus) => {
    switch (itemStatus) {
      case 'PENDING':
        return (
          <button 
            onClick={() => updateItemStatus(orderId, itemId, user.email, 'PREPARING')}
            className="btn-primary" 
            style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'var(--primary)' }}
          >
            Accept & Prepare
          </button>
        );
      case 'PREPARING':
        return (
          <button 
            onClick={() => updateItemStatus(orderId, itemId, user.email, 'SHIPPED_TO_CONSULTANT')}
            className="btn-primary" 
            style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'var(--secondary)' }}
          >
            Send to Consultant
          </button>
        );
      case 'SHIPPED_TO_CONSULTANT':
        return <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Waiting for Consultant Verification</span>;
      default: // RECEIVED_BY_CONSULTANT or further
        return <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: '700' }}>Received by Consultant</span>;
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Customer Orders</h1>
        <p style={{ color: 'var(--text-dim)' }}>Manage orders for your handcrafted creations.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {artisanOrders.length === 0 ? (
          <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
            <Package size={64} style={{ color: 'var(--text-dim)', marginBottom: '1rem', opacity: 0.3 }} />
            <p style={{ color: 'var(--text-dim)' }}>No orders received yet. Keep crafting!</p>
          </div>
        ) : (
          artisanOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(order => (
            <div key={order.id} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>ORDER ID: {order.id}</p>
                  <p style={{ fontWeight: '700' }}>{t('status')}: {order.status}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Requested Items</h3>
                  {order.items.filter(item => item.artisanEmail === user.email).map((item, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{item.name}</p>
                        <p style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{item.price}</p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-dim)' }}>
                          Item Status: {item.status}
                        </span>
                        {getStatusAction(order.id, item.id, item.status)}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Customer Info</h3>
                  <p style={{ fontWeight: '600', marginBottom: '0.75rem' }}>{order.customerName}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <MapPin size={14} /> <span>{order.customerAddress}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Phone size={14} /> <span>{order.customerPhone}</span>
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

export default ManageOrders;
