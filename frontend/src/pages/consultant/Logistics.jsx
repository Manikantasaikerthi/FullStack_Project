import React from 'react';
import { useData } from '../../context/DataContext';
import { useTranslation } from 'react-i18next';
import { Truck, Package, MapPin, Phone, Check, Box } from 'lucide-react';

const Logistics = () => {
  const { orders, updateOrderStatus, updateItemStatus } = useData();
  const { t } = useTranslation();

  // Consultant handles orders that are pending, in processing, or shipped
  const incomingOrders = orders.filter(o => 
    ['PENDING', 'PROCESSING', 'SHIPPED_TO_CUSTOMER'].includes(o.status)
  );

  const isOrderReadyToShip = (order) => {
    return order.items.every(i => i.status === 'RECEIVED_BY_CONSULTANT');
  };

  const getLogisticsAction = (order) => {
    switch (order.status) {
      case 'PENDING':
      case 'PROCESSING':
        if (isOrderReadyToShip(order)) {
          return (
            <button 
              onClick={() => updateOrderStatus(order.id, 'SHIPPED_TO_CUSTOMER')}
              className="btn-primary" 
              style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'var(--success)' }}
            >
              Final Ship to Customer
            </button>
          );
        }
        return <span style={{ color: 'var(--warning)', fontSize: '0.85rem', fontWeight: '700' }}>Waiting for all items...</span>;
      case 'SHIPPED_TO_CUSTOMER':
        return (
          <button 
            onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
            className="btn-primary" 
            style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'var(--primary)' }}
          >
            Mark as Delivered
          </button>
        );
      default:
        return <span style={{ color: 'var(--success)', fontWeight: '700' }}>Delivered Successfully</span>;
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Logistics Hub</h1>
        <p style={{ color: 'var(--text-dim)' }}>Manage the flow of tribal crafts from consultants to the final customer address.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {incomingOrders.length === 0 ? (
          <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
            <Box size={64} style={{ color: 'var(--text-dim)', marginBottom: '1rem', opacity: 0.3 }} />
            <p style={{ color: 'var(--text-dim)' }}>No parcels in transit currently.</p>
          </div>
        ) : (
          incomingOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(order => (
            <div key={order.id} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>ORDER ID: {order.id}</p>
                  <p style={{ fontWeight: '700' }}>Current Status: {order.status}</p>
                </div>
                {getLogisticsAction(order)}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Shipping To</h3>
                  <p style={{ fontWeight: '600', marginBottom: '0.50rem' }}>{order.customerName}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <MapPin size={14} /> <span>{order.customerAddress}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Phone size={14} /> <span>{order.customerPhone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Package size={18} /> Package Contents
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ 
                        background: 'rgba(255,255,255,0.03)', 
                        padding: '1rem', 
                        borderRadius: '12px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        borderLeft: item.status === 'RECEIVED_BY_CONSULTANT' ? '4px solid var(--success)' : '4px solid var(--warning)'
                      }}>
                        <div>
                          <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.name}</p>
                          <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>From: <b>{item.artisanName}</b> | Status: {item.status}</p>
                        </div>
                        {item.status === 'SHIPPED_TO_CONSULTANT' ? (
                          <button 
                            onClick={() => updateItemStatus(order.id, item.id, item.artisanEmail, 'RECEIVED_BY_CONSULTANT')}
                            style={{ background: 'var(--secondary)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                          >
                            Mark as Received
                          </button>
                        ) : item.status === 'RECEIVED_BY_CONSULTANT' ? (
                          <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: '700' }}>
                            <Check size={14} /> VERIFIED
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>Waiting for Artisan...</span>
                        )}
                      </div>
                    ))}
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

export default Logistics;
