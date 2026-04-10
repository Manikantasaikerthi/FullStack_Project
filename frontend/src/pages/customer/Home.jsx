import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/common/ProductCard';

const Home = () => {
  const { products, addToCart } = useData();
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');

  const approvedProducts = products.filter(p => p.approved);
  
  const filteredProducts = approvedProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product);
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
            <ProductCard key={product.id} product={product} addToCart={handleAddToCart} />
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
