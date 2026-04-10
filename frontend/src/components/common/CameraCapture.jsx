import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RotateCcw, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { t } = useTranslation();
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Please grant camera permissions to take a photo.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirm = () => {
    onCapture(capturedImage);
    onClose();
  };

  return (
    <div className="glass-card animate-fade-in" style={{ position: 'fixed', inset: '2rem', zIndex: 2000, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(0,0,0,0.95)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Camera size={24} /> {t('camera_title')}</h3>
        <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-dim)', cursor: 'pointer' }}><X size={24} /></button>
      </div>

      <div style={{ flex: 1, position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {error ? (
          <div style={{ textAlign: 'center', color: 'var(--error)' }}>{error}</div>
        ) : capturedImage ? (
          <img src={capturedImage} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        {capturedImage ? (
          <>
            <button onClick={retake} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', borderColor: 'white', cursor: 'pointer' }}>
              <RotateCcw size={18} /> {t('retake')}
            </button>
            <button onClick={confirm} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--success)', cursor: 'pointer' }}>
              <Check size={18} /> {t('use_photo')}
            </button>
          </>
        ) : (
          <button 
            onClick={takePhoto} 
            disabled={!!error}
            style={{ 
              width: '70px', 
              height: '70px', 
              borderRadius: '50%', 
              background: 'white', 
              border: '5px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: !!error ? 'not-allowed' : 'pointer'
            }}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #000' }}></div>
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
