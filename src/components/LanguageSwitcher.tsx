import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  isScrolled?: boolean;
  isMobile?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ isScrolled = false, isMobile = false }) => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'te', name: t('language.telugu'), flag: '🇮🇳', display: 'తె' },
    { code: 'hi', name: t('language.hindi'), flag: '🇮🇳', display: 'हि' },
    { code: 'en', name: t('language.english'), flag: '🇺🇸', display: 'En' }
  ];

  const currentIndex = languages.findIndex(lang => lang.code === i18n.language);
  const currentLanguage = languages[currentIndex] || languages[0];

  const cycleLanguage = () => {
    const nextIndex = (currentIndex + 1) % languages.length;
    const nextLanguage = languages[nextIndex];
    i18n.changeLanguage(nextLanguage.code);
  };

  if (isMobile) {
    return (
      <button
        onClick={cycleLanguage}
        className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 font-medium py-3 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm">{currentLanguage.display}</span>
        <span className="text-xs opacity-70">{currentLanguage.flag}</span>
      </button>
    );
  }

  return (
    <button
      onClick={cycleLanguage}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        isScrolled 
          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
          : 'bg-white/10 hover:bg-white/20 text-white'
      }`}
      title={`${t('language.translate')} - ${currentLanguage.name}`}
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">{currentLanguage.display}</span>
      <span className="text-sm">{currentLanguage.flag}</span>
    </button>
  );
};

export default LanguageSwitcher;