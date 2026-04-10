import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Heart, Search, X, MapPin, Phone, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { products, placeOrder } = useData();
  const { user } = useAuth();

  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const approvedProducts = products.filter(p => p.approved);
  
  const filteredProducts = approvedProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const calculateTotal = () => cart.reduce((acc, item) => acc + Number(item.price), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Check if user has address/phone
    if (!user.address || !user.phone) {
      alert("Please update your address and phone number in your profile first.");
      navigate('/profile');
      return;
    }

    // Single order for all items in cart
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
    setCart([]);
    setTimeout(() => {
      setOrderSuccess(false);
      setShowCheckout(false);
      navigate('/orders');
    }, 2000);
  };

  return (
    <div className="animate-fade-in">
      <header style={{ textAlign: 'center', marginBottom: '4rem', padding: '4rem 0' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t('heritage_title')}
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
          {t('heritage_sub')}
        </p>
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input 
            type="text" 
            placeholder={t('search_placeholder')} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '16px 16px 16px 56px', borderRadius: '30px', fontSize: '1.1rem' }}
          />
        </div>
      </header>

      {/* Cart Float */}
      {cart.length > 0 && (
        <button 
          onClick={() => setShowCheckout(true)}
          className="animate-bounce"
          style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, background: 'var(--primary)', color: 'white', padding: '1rem 2rem', borderRadius: '40px', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', cursor: 'pointer' }}
        >
          <ShoppingCart size={24} />
          <span style={{ fontWeight: '700' }}>{cart.length} {t('items')} • ₹{calculateTotal()}</span>
        </button>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="animate-fade-in" style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            {orderSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '1rem' }} />
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Order Placed!</h2>
                <p style={{ color: 'var(--text-dim)' }}>Your tribal treasures are being prepared.</p>
              </div>
            ) : (
              <>
                <button onClick={() => setShowCheckout(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', color: 'var(--text-dim)', cursor: 'pointer' }}><X size={24} /></button>
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Your Basket</h2>
                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-light)', padding: '1rem', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <img src={item.imageUrl} alt="" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div>
                          <p style={{ fontWeight: '600' }}>{item.name}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>by {item.artisanName}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <p style={{ fontWeight: '700' }}>₹{item.price}</p>
                        <button onClick={() => removeFromCart(idx)} style={{ color: 'var(--error)', background: 'transparent', cursor: 'pointer' }}><X size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>
                    <MapPin size={16} /> <span style={{ fontSize: '0.9rem' }}>{user.address || 'Address not set'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-dim)' }}>
                    <Phone size={16} /> <span style={{ fontSize: '0.9rem' }}>{user.phone || 'Phone not set'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '1.25rem', color: 'var(--text-dim)' }}>Grand Total</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>₹{calculateTotal()}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="btn-primary" 
                  style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}
                >
                  Place Order
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem' }}>{t('featured')}</h2>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <span style={{ padding: '6px 16px', borderRadius: '20px', background: 'var(--primary)', color: 'white', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>{t('all')}</span>
            <span style={{ padding: '6px 16px', borderRadius: '20px', background: 'var(--surface-light)', fontSize: '0.9rem', cursor: 'pointer' }}>{t('pottery')}</span>
            <span style={{ padding: '6px 16px', borderRadius: '20px', background: 'var(--surface-light)', fontSize: '0.9rem', cursor: 'pointer' }}>{t('jewelry')}</span>
            <span style={{ padding: '6px 16px', borderRadius: '20px', background: 'var(--surface-light)', fontSize: '0.9rem', cursor: 'pointer' }}>{t('paintings')}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {filteredProducts.map(product => (
            <div key={product.id} className="glass-card" style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <button style={{ position: 'absolute', top: '16px', right: '16px', background: 'white', padding: '8px', borderRadius: '50%', color: 'var(--primary)', cursor: 'pointer', border: 'none' }}>
                  <Heart size={20} />
                </button>
              </div>
              <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem' }}>{product.name}</h3>
                  <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.25rem' }}>₹{product.price}</span>
                </div>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: 1 }}>{product.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{t('by')} <b>{product.artisanName}</b></span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="btn-primary" 
                    style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <ShoppingCart size={16} /> {t('add_to_cart')}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-dim)' }}>
              <p>No products found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
