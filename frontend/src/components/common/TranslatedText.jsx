import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const TranslatedText = ({ text }) => {
  const { i18n } = useTranslation();
  const [display, setDisplay] = useState(text);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const translateText = async () => {
      const targetLang = i18n.language.split('-')[0];
      
      if (targetLang === 'en' || !text) {
        setDisplay(text);
        return;
      }

      setIsTranslating(true);
      try {
        const response = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
        );
        const data = await response.json();
        const translated = data[0].map(x => x[0]).join('');
        setDisplay(translated || text);
      } catch (error) {
        console.error('Translation error:', error);
        setDisplay(text);
      } finally {
        setIsTranslating(false);
      }
    };

    translateText();
  }, [text, i18n.language]);

  return (
    <span style={{ opacity: isTranslating ? 0.6 : 1, transition: 'opacity 0.2s' }}>
      {display}
    </span>
  );
};

export default TranslatedText;
