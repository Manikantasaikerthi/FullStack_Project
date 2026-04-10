import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Trash2, MapPin, Phone, ShoppingBasket, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import TranslatedText from '../../components/common/TranslatedText';

const Cart = () => {
  const { cart, removeFromCart, clearCart, placeOrder } = useData();
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orderSuccess, setOrderSuccess] = useState(false);

  const calculateTotal = () => cart.reduce((acc, item) => acc + Number(item.price), 0);

  const handleCheckout = () => {
    if (!user) { navigate('/login'); return; }
    if (cart.length === 0) return;
    if (!user.address || !user.phone) {
      alert("Please update your address and phone number in your profile first.");
      navigate('/profile');
      return;
    }

    placeOrder({
      customerEmail: user.email,
      customerName: user.name,
      customerPhone: user.phone,
      customerAddress: user.address,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        artisanEmail: item.artisanEmail,
        artisanName: item.artisanName,
        status: 'PENDING'
      })),
      total: calculateTotal()
    });

    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      clearCart();
      navigate('/orders');
    }, 2500);
  };

  if (orderSuccess) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div className="animate-bounce" style={{ width: '100px', height: '100px', background: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', boxShadow: '0 10px 30px rgba(46, 213, 115, 0.3)' }}>
            <CheckCircle size={60} color="white" />
        </div>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Order Confirmed!</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)' }}>Thank you for supporting tribal artisans. Redirecting to your orders...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'var(--surface-light)', border: 'none', color: 'var(--text)', padding: '10px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowLeft size={20} />
            </button>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Shopping Basket</h1>
        </div>

        {cart.length === 0 ? (
            <div className="glass-card" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                <ShoppingBasket size={100} strokeWidth={1} style={{ color: 'var(--text-dim)', opacity: 0.2, marginBottom: '2rem' }} />
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your basket is empty</h2>
                <p style={{ color: 'var(--text-dim)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Your shopping basket lives to serve. Give it purpose — fill it with tribal crafts!</p>
                <Link to="/" className="btn-primary" style={{ padding: '16px 40px', textDecoration: 'none', fontSize: '1.1rem' }}>Continue Shopping</Link>
            </div>
        ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '2.5rem', alignItems: 'start' }}>
                {/* Items List */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dim)' }}>Items</h2>
                        <span style={{ color: 'var(--text-dim)' }}>Price</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {cart.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '2rem', paddingBottom: '2rem', borderBottom: idx === cart.length - 1 ? 'none' : '1px solid var(--glass-border)' }}>
                                <img src={item.imageUrl} alt="" style={{ width: '180px', height: '180px', borderRadius: '16px', objectFit: 'cover', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }} />
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                            <TranslatedText text={item.name} />
                                        </h3>
                                        <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>₹{item.price}</span>
                                    </div>
                                    <p style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '0.5rem' }}>In Stock</p>
                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Sold by <b>{item.artisanName}</b></p>
                                    
                                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <button 
                                            onClick={() => removeFromCart(idx)}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                        <span style={{ width: '1px', height: '15px', background: 'var(--glass-border)' }} />
                                        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.9rem' }}>Save for later</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '7rem' }}>
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            <CheckCircle size={16} />
                            <span>Your order qualifies for FREE Delivery.</span>
                        </div>
                        
                        <div style={{ marginBottom: '2rem' }}>
                           <span style={{ fontSize: '1.25rem', color: 'var(--text-dim)' }}>Subtotal ({cart.length} items): </span>
                           <span style={{ fontSize: '1.75rem', fontWeight: '900' }}>₹{calculateTotal()}</span>
                        </div>

                        <button 
                            onClick={handleCheckout}
                            className="btn-primary" 
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: '700', borderRadius: '12px' }}
                        >
                            Proceed to Buy
                        </button>
                    </div>

                    {user && (
                        <div className="glass-card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delivery Address</h3>
                            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <MapPin size={18} color="var(--primary)" />
                                <span style={{ fontSize: '0.95rem' }}>{user.address || 'Not specified'}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <Phone size={18} color="var(--primary)" />
                                <span style={{ fontSize: '0.95rem' }}>{user.phone || 'Not specified'}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default Cart;
