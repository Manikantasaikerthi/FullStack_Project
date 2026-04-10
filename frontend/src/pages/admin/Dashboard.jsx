import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, Users, ShoppingBag, DollarSign, 
  BarChart2, Activity, Trash2, User, Briefcase, 
  List, Package, CheckCircle, Clock
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const AdminDashboard = () => {
  const { orders, getStats, deleteProductsByArtisan } = useData();
  const { getAllUsers, deleteUser } = useAuth();
  const stats = getStats();
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', or 'orders'
  const [allUsers, setAllUsers] = useState([]);

  React.useEffect(() => {
    const loadUsers = async () => {
      const users = await getAllUsers();
      if (Array.isArray(users)) {
        setAllUsers(users);
      }
    };
    loadUsers();
  }, []); // Safe to keep empty since we only want to fetch once on mount

  const handleDeleteUser = (userToDelete) => {
    deleteUser(userToDelete.id);
    if (userToDelete.role === 'artisan') {
      deleteProductsByArtisan(userToDelete.email);
    }
    setAllUsers(prev => prev.filter(u => u.id !== userToDelete.id));
  };

  // Mock chart data
  const revenueData = [
    { name: 'Jan', revenue: 0, profit: 0 },
    { name: 'Feb', revenue: 0, profit: 0 },
    { name: 'Mar', revenue: 0, profit: 0 },
    { name: 'Apr', revenue: 0, profit: 0 },
    { name: 'May', revenue: 0, profit: 0 },
    { name: 'Jun', revenue: 0, profit: 0 },
    { name: 'Jul', revenue: 0, profit: 0 },
  ];

  const categoryData = [
    { name: 'Mon', total: 0 },
    { name: 'Tue', total: 0 },
    { name: 'Wed', total: 0 },
    { name: 'Thu', total: 0 },
    { name: 'Fri', total: 0 },
    { name: 'Sat', total: 0 },
    { name: 'Sun', total: 0 },
  ];

  const StatCard = ({ title, value, icon: Icon, trend, color, isCurrency }) => (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ background: `rgba(${color}, 0.1)`, color: `rgb(${color})`, padding: '0.75rem', borderRadius: '12px' }}>
          <Icon size={24} />
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <TrendingUp size={14} /> {trend}
        </span>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>{isCurrency ? `₹${value}` : value}</div>
      <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{title}</div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{t('site_admin')}</h1>
          <p style={{ color: 'var(--text-dim)' }}>Comprehensive overview of marketplace health and user activity.</p>
        </div>
        <div style={{ display: 'flex', background: 'var(--surface-light)', padding: '4px', borderRadius: '12px', gap: '4px' }}>
          {['overview', 'users', 'orders'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ 
                padding: '8px 16px', 
                borderRadius: '8px', 
                border: 'none', 
                background: activeTab === tab ? 'var(--primary)' : 'transparent', 
                color: activeTab === tab ? 'white' : 'var(--text-dim)', 
                cursor: 'pointer', 
                fontWeight: '600',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'overview' ? 'Stats' : tab === 'users' ? 'Users' : 'Orders'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
            <StatCard title={t('total_revenue')} value={stats.revenue.toLocaleString()} icon={DollarSign} trend="0%" color="76, 175, 80" isCurrency />
            <StatCard title={t('total_profit')} value={stats.profit.toLocaleString()} icon={Activity} trend="0%" color="139, 94, 52" isCurrency />
            <StatCard title={t('active_customers')} value={stats.totalCustomers} icon={Users} trend="0%" color="33, 150, 243" />
            <StatCard title={t('certified_artisans')} value={stats.totalArtisans} icon={ShoppingBag} trend="0%" color="156, 39, 176" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><TrendingUp size={20} /> Revenue Overview</h3>
              </div>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="revenue" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.1} strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}><BarChart2 size={20} /> Daily Traffic</h3>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                    <Bar dataKey="total" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--surface-light)', color: 'var(--text-dim)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                <th style={{ padding: '1.5rem' }}>User</th>
                <th style={{ padding: '1.5rem' }}>Role</th>
                <th style={{ padding: '1.5rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1.5rem' }}>
                    <p style={{ fontWeight: '600' }}>{u.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{u.email}</p>
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(255,255,255,0.05)' }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <button onClick={() => handleDeleteUser(u)} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.length === 0 ? (
            <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
              <Package size={48} style={{ color: 'var(--text-dim)', marginBottom: '1rem', opacity: 0.3 }} />
              <p style={{ color: 'var(--text-dim)' }}>No orders in the system yet.</p>
            </div>
          ) : (
            orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(order => (
              <div key={order.id} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>ID: {order.id}</p>
                    <p style={{ fontWeight: '700', color: 'var(--primary)' }}>Status: {order.status}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>{order.customerName}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{order.customerEmail}</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                      <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{item.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Artisan: {item.artisanName}</p>
                      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', fontWeight: '700', color: item.status === 'RECEIVED_BY_CONSULTANT' ? 'var(--success)' : 'var(--warning)' }}>
                        {item.status === 'RECEIVED_BY_CONSULTANT' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {item.status.replace(/_/g, ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
