import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Search, FileText, Clock, Database, MapPin } from 'lucide-react';

interface MobileNavigationProps {
  activeComponent: string | null;
  onNavigate: (sectionId: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeComponent, onNavigate }) => {
  const { t } = useTranslation();

  const navItems = [
    { id: 'home', icon: Home, label: t('nav.home') },
    { id: 'symptom-checker', icon: Search, label: t('nav.symptomChecker') },
    { id: 'first-aid', icon: FileText, label: t('nav.firstAid') },
    { id: 'medicine-reminders', icon: Clock, label: t('nav.reminders') },
    { id: 'health-records', icon: Database, label: t('nav.healthRecords') },
    { id: 'find-help', icon: MapPin, label: t('nav.findHelp') }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
      <div className="grid grid-cols-6 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeComponent === item.id || (item.id === 'home' && !activeComponent);
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center space-y-1 px-2 py-2 transition-all duration-200 ${
                isActive
                  ? 'text-[#2b7a78] bg-green-50'
                  : 'text-gray-600 hover:text-[#2b7a78] hover:bg-green-50'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-[#2b7a78]' : ''}`} />
              <span className="text-xs font-medium leading-tight text-center">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;