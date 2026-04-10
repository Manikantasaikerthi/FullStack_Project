import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const VoiceTranslator = ({ onTranslate, currentLang }) => {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [speakingLang, setSpeakingLang] = useState(currentLang || 'hi');
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);
  const speakingLangRef = useRef(speakingLang);

  // Sync ref with state to avoid stale closures in async callbacks
  useEffect(() => {
    speakingLangRef.current = speakingLang;
  }, [speakingLang]);

  // Map app languages to speech recognition codes
  const langMap = {
    'hi': 'hi-IN',
    'te': 'te-IN',
    'ta': 'ta-IN',
    'ml': 'ml-IN',
    'kn': 'kn-IN',
    'mr': 'mr-IN',
    'en': 'en-US'
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        // Use the ref to get the latest selected language
        await translateToEnglish(transcript, speakingLangRef.current);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setError(t('voice_error') || 'Error occurred while speaking.');
        setIsListening(false);
      };
    } else {
      setError(t('speech_not_supported'));
    }
  }, [t]);

  const translateToEnglish = async (text, langCode) => {
    const currentSpeakingLang = langCode || speakingLang;

    if (currentSpeakingLang === 'en') {
      onTranslate(text);
      return;
    }

    setIsTranslating(true);
    try {
      // Using Google Translate (gtx) API - More robust for semantic translation
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${currentSpeakingLang}&tl=en&dt=t&q=${encodeURIComponent(text)}`
      );
      const data = await response.json();
      
      // Google API returns nested arrays: [[["Translated Text", "Original Text", null, null, 1]]]
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        onTranslate(data[0][0][0]);
      } else {
        throw new Error('Translation failed');
      }
    } catch (err) {
      console.error('Translation error:', err);
      // Fallback: use the original text if translation fails
      onTranslate(text);
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError(null);
      recognitionRef.current.lang = langMap[speakingLang] || 'hi-IN';
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ position: 'relative' }}>
        <button 
          type="button"
          onClick={toggleListening}
          disabled={isTranslating}
          title={t('voice_hint')}
          style={{ 
            background: isListening ? 'var(--error)' : 'var(--primary)', 
            color: 'white', 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
            animation: isListening ? 'pulse 1.5s infinite' : 'none'
          }}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
      </div>

      <select 
        value={speakingLang} 
        onChange={(e) => setSpeakingLang(e.target.value)}
        style={{ 
          background: 'var(--surface-light)', 
          border: '1px solid var(--glass-border)', 
          color: 'var(--text)', 
          padding: '4px 8px', 
          borderRadius: '4px',
          fontSize: '0.75rem'
        }}
        title="Speaking Language"
      >
        <option value="hi">हिन्दी</option>
        <option value="te">తెలుగు</option>
        <option value="ta">தமிழ்</option>
        <option value="ml">മലയാളം</option>
        <option value="kn">ಕನ್ನಡ</option>
        <option value="mr">मराठी</option>
        <option value="en">English</option>
      </select>

      {isListening && (
        <span style={{ fontSize: '0.85rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '8px', height: '8px', background: 'var(--error)', borderRadius: '50%', animation: 'blink 1s infinite' }}></span>
          {t('listening')}
        </span>
      )}

      {isTranslating && (
        <span style={{ fontSize: '0.85rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Loader2 size={16} className="animate-spin" />
          {t('translating')}
        </span>
      )}

      {error && <span style={{ fontSize: '0.85rem', color: 'var(--error)' }}>{error}</span>}

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(244, 67, 54, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
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

export default VoiceTranslator;
