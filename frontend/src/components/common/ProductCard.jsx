import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProductCard = ({ product, addToCart }) => {
  const { t, i18n } = useTranslation();
  const [displayData, setDisplayData] = useState({ name: product.name, description: product.description });
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const translateContent = async () => {
      const targetLang = i18n.language.split('-')[0];
      
      // If language is English, use original data
      if (targetLang === 'en') {
        setDisplayData({ name: product.name, description: product.description });
        return;
      }

      setIsTranslating(true);
      try {
        const fetchTranslation = async (text) => {
          if (!text || text.trim() === '') return '';
          try {
            const response = await fetch(
              `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
            );
            const data = await response.json();
            // Google API returns nested arrays: [[["Translated", "Original", ...]]]
            // We join all parts in case the text was split
            return data[0].map(x => x[0]).join('');
          } catch (e) {
            console.error('Fetch translation failed:', e);
            return text;
          }
        };

        const [translatedName, translatedDesc] = await Promise.all([
          fetchTranslation(product.name),
          fetchTranslation(product.description)
        ]);

        setDisplayData({ 
          name: translatedName || product.name, 
          description: translatedDesc || product.description 
        });
      } catch (error) {
        console.error('Translation error:', error);
        setDisplayData({ name: product.name, description: product.description });
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [i18n.language, product.name, product.description]);

  return (
    <div className="glass-card" style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
        <img 
          src={product.imageUrl} 
          alt={displayData.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', opacity: isTranslating ? 0.7 : 1 }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <button style={{ position: 'absolute', top: '16px', right: '16px', background: 'white', padding: '8px', borderRadius: '50%', color: 'var(--primary)', cursor: 'pointer', border: 'none' }}>
          <Heart size={20} />
        </button>
        {isTranslating && (
           <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
             <Loader2 className="animate-spin" color="var(--primary)" size={32} />
           </div>
        )}
      </div>
      <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', opacity: isTranslating ? 0.5 : 1, transition: 'opacity 0.3s' }}>
            {displayData.name}
          </h3>
          <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.25rem' }}>₹{product.price}</span>
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: 1, opacity: isTranslating ? 0.5 : 1, transition: 'opacity 0.3s' }}>
          {displayData.description}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            {t('by')} <b>{product.artisanName}</b>
          </span>
          <button 
            onClick={() => addToCart(product)}
            className="btn-primary" 
            style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ShoppingCart size={16} /> {t('add_to_cart')}
          </button>
        </div>
      </div>
      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
