import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Home } from 'lucide-react';

interface NavigationArrowsProps {
  onNavigateHome: () => void;
  currentPage?: string;
}

const NavigationArrows: React.FC<NavigationArrowsProps> = ({ onNavigateHome, currentPage }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed top-20 left-4 z-30 md:top-24">
      <button
        onClick={onNavigateHome}
        className="flex items-center space-x-2 bg-white/95 backdrop-blur-sm hover:bg-white text-gray-700 font-medium py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200"
        title={t('nav.home')}
      >
        <ArrowLeft className="h-4 w-4" />
        <Home className="h-4 w-4" />
        <span className="text-sm hidden sm:inline">{t('nav.home')}</span>
      </button>
    </div>
  );
};

export default NavigationArrows;