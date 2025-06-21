import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, 
  Home, 
  Search, 
  FileText, 
  Clock, 
  Database,
  MapPin,
  Heart
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeComponent: string | null;
  onNavigate: (sectionId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeComponent, onNavigate }) => {
  const { t } = useTranslation();

  const navigationItems = [
    { id: 'home', icon: Home, label: t('nav.home') },
    { id: 'symptom-checker', icon: Search, label: t('nav.symptomChecker') },
    { id: 'first-aid', icon: FileText, label: t('nav.firstAid') },
    { id: 'medicine-reminders', icon: Clock, label: t('nav.reminders') },
    { id: 'health-records', icon: Database, label: t('nav.healthRecords') },
    { id: 'find-help', icon: MapPin, label: t('nav.findHelp') }
  ];

  const handleNavigate = (sectionId: string) => {
    onNavigate(sectionId);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Heart className="h-8 w-8 text-red-500 animate-pulse" />
                <div className="absolute inset-0 h-8 w-8 text-red-400 opacity-30 animate-ping">
                  <Heart className="h-8 w-8" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{t('app.title')}</h2>
                <p className="text-sm text-gray-600">{t('app.subtitle')}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6">
            <div className="space-y-2 px-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeComponent === item.id || (item.id === 'home' && !activeComponent);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-[#2b7a78] text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-[#2b7a78]'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                {t('footer.copyright')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;