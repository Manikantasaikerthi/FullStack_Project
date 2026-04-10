import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTranslation } from 'react-i18next';
import { Image, Upload, FileText, IndianRupee, ArrowLeft, Send, Camera } from 'lucide-react';
import VoiceTranslator from '../../components/common/VoiceTranslator';
import CameraCapture from '../../components/common/CameraCapture';

const AddProduct = () => {
  const { user } = useAuth();
  const { addProduct } = useData();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const handleVoiceTranslate = (translatedText) => {
    setDescription(prev => prev ? `${prev} ${translatedText}` : translatedText);
  };

  const handleCameraCapture = (base64Image) => {
    setImageUrl(base64Image);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const success = await addProduct({
      name,
      description,
      price: Number(price),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1621345155452-959cb3c75628?auto=format&fit=crop&q=80&w=600',
      artisanEmail: user.email,
      artisanName: user.name
    });

    setIsSubmitting(false);
    
    if (success) {
      navigate('/artisan');
    } else {
      alert("Failed to add product. Please check your connection or try again.");
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {showCamera && <CameraCapture onCapture={handleCameraCapture} onClose={() => setShowCamera(false)} />}
      
      <button 
        onClick={() => navigate('/artisan')}
        style={{ background: 'transparent', color: 'var(--text-dim)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none' }}
      >
        <ArrowLeft size={18} /> {t('dashboard')}
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>{t('add_product')}</h1>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: '600' }}>{t('product_name')}</label>
              <div style={{ position: 'relative' }}>
                <FileText size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-dim)' }} />
                <input 
                  type="text" 
                  placeholder={t('product_name_placeholder')} 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', paddingLeft: '48px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: '600' }}>{t('price')} (₹)</label>
                <div style={{ position: 'relative' }}>
                  <IndianRupee size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-dim)' }} />
                  <input 
                    type="number" 
                    placeholder={t('price_placeholder')} 
                    required 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ width: '100%', paddingLeft: '48px' }}
                  />
                </div>
              </div>
              <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: '600' }}>{t('image_url')}</label>
                <div style={{ position: 'relative' }}>
                  <Image size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-dim)' }} />
                  <input 
                    type="text" 
                    placeholder={t('image_url_placeholder')} 
                    value={imageUrl.startsWith('data:') ? t('camera_captured') : imageUrl}
                    readOnly={imageUrl.startsWith('data:')}
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={{ width: '100%', paddingLeft: '48px' }}
                  />
                  {imageUrl.startsWith('data:') && (
                    <button 
                      type="button"
                      onClick={() => setImageUrl('')}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'var(--error)', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '0.7rem', cursor: 'pointer' }}
                    >
                      {t('clear')}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button 
                type="button" 
                onClick={() => setShowCamera(true)}
                className="btn-outline" 
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
              >
                <Camera size={18} /> {t('use_camera')}
              </button>
              <div style={{ flex: 1, background: 'var(--surface-light)', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px dashed var(--glass-border)', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                {t('paste_url')}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: '600' }}>{t('description')}</label>
                <VoiceTranslator onTranslate={handleVoiceTranslate} currentLang={i18n.language.split('-')[0]} />
              </div>
              <textarea 
                rows={5}
                placeholder={t('desc_placeholder')}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', resize: 'none' }}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
              {isSubmitting ? t('submitting') : <><Send size={18} /> {t('submit_for_review')}</>}
            </button>
          </form>
        </div>

        <div className="glass-card" style={{ padding: '2rem', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{t('preview')}</h3>
          {name || price || imageUrl ? (
            <div style={{ opacity: 1, transition: 'opacity 0.3s' }}>
              <div style={{ height: '220px', background: 'var(--surface-light)', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid var(--glass-border)' }}>
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div style={{ height: '100%', display: imageUrl ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', flexDirection: 'column', gap: '0.5rem' }}>
                  <Image size={48} />
                  <span style={{ fontSize: '0.8rem' }}>{t('no_image_selected')}</span>
                </div>
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{name || t('preview_placeholder_name')}</h4>
              <p style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '1rem' }}>₹{price || '0.00'}</p>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{description || t('preview_placeholder_desc')}</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem 1rem' }}>
              <p>{t('preview_hint')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
