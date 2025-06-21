import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Heart, 
  Menu,
  Stethoscope,
  FileText,
  Search,
  Clock,
  Database,
  MapPin
} from 'lucide-react';

// Import components
import SymptomChecker from './components/SymptomChecker';
import FirstAidGuide from './components/FirstAidGuide';
import MedicineReminders from './components/MedicineReminders';
import HealthRecords from './components/HealthRecords';
import FindHelp from './components/FindHelp';
import LanguageSwitcher from './components/LanguageSwitcher';
import AuthButton from './components/AuthButton';
import MobileNavigation from './components/MobileNavigation';
import AuthGuard from './components/AuthGuard';
import Sidebar from './components/Sidebar';
import VoiceAssistant from './components/VoiceAssistant';
import NavigationArrows from './components/NavigationArrows';

function App() {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle scroll for floating header effect (desktop only)
  useEffect(() => {
    const handleScroll = () => {
      if (!isMobile) {
        setIsScrolled(window.scrollY > 20);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  const scrollToSection = (sectionId: string) => {
    if (['symptom-checker', 'first-aid', 'medicine-reminders', 'health-records', 'find-help'].includes(sectionId)) {
      setActiveComponent(sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setActiveComponent(null);
    }
    setIsSidebarOpen(false);
  };

  const handleVoiceCommand = (command: string) => {
    scrollToSection(command);
  };

  const navigateToHome = () => {
    setActiveComponent(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const FeatureCard = ({ icon: Icon, title, description, onClick, color }: any) => (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 transform hover:-translate-y-2 cursor-pointer"
    >
      <div className={`w-16 h-16 rounded-lg ${color} flex items-center justify-center mb-4 mx-auto`}>
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
        {title}
      </h3>
      <p className="text-gray-600 text-center">
        {description}
      </p>
    </div>
  );

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white pb-20 md:pb-0">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeComponent={activeComponent}
          onNavigate={scrollToSection}
        />

        {/* Navigation Arrows - Show only when not on home */}
        {activeComponent && (
          <NavigationArrows 
            onNavigateHome={navigateToHome}
            currentPage={activeComponent}
          />
        )}

        {/* Header */}
        <header className={`${
          isMobile 
            ? 'relative bg-[#2b7a78] shadow-lg' 
            : `fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
                isScrolled 
                  ? 'bg-white/95 backdrop-blur-md shadow-lg mx-4 mt-4 rounded-2xl' 
                  : 'bg-[#2b7a78] shadow-lg'
              }`
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              {/* Menu Button and Logo */}
              <div className="flex items-center space-x-4">
                {!isMobile && (
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      isScrolled 
                        ? 'text-gray-700 hover:bg-gray-100' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                )}

                <button
                  onClick={() => setActiveComponent(null)}
                  className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                >
                  <div className="relative">
                    <Heart className="h-8 w-8 text-red-500 animate-pulse" />
                    <div className="absolute inset-0 h-8 w-8 text-red-400 opacity-30 animate-ping">
                      <Heart className="h-8 w-8" />
                    </div>
                  </div>
                  <div>
                    <h1 className={`text-xl font-bold ${
                      isMobile 
                        ? 'text-white' 
                        : isScrolled 
                          ? 'text-gray-900' 
                          : 'text-white'
                    }`}>
                      {t('app.title')} {t('app.subtitle')}
                    </h1>
                  </div>
                </button>
              </div>

              {/* Desktop Auth & Language */}
              {!isMobile && (
                <div className="flex items-center space-x-4">
                  <LanguageSwitcher isScrolled={isScrolled} />
                  <AuthButton isScrolled={isScrolled} />
                </div>
              )}

              {/* Mobile Menu Button */}
              {isMobile && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Component Content or Home Page */}
        {activeComponent ? (
          <main className={isMobile ? "pt-4" : "pt-24"}>
            {activeComponent === 'symptom-checker' && <SymptomChecker />}
            {activeComponent === 'first-aid' && <FirstAidGuide />}
            {activeComponent === 'medicine-reminders' && <MedicineReminders />}
            {activeComponent === 'health-records' && <HealthRecords />}
            {activeComponent === 'find-help' && <FindHelp />}
          </main>
        ) : (
          <>
            {/* Home Section */}
            <section id="home" className={`relative overflow-hidden bg-gradient-to-br from-green-50 to-teal-50 py-20 ${
              isMobile ? 'pt-8' : 'pt-32'
            }`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Mobile Language Toggle - Above welcome message */}
                {isMobile && (
                  <div className="flex justify-center mb-8">
                    <LanguageSwitcher isMobile={true} />
                  </div>
                )}

                <div className="text-center">
                  <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                    {t('home.welcome')}{' '}
                    <span className="text-[#2b7a78]">{t('app.title')} {t('app.subtitle')}</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    {t('app.tagline')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => scrollToSection('symptom-checker')}
                      className="bg-[#2b7a78] hover:bg-[#1e5a57] text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      {t('home.checkSymptoms')}
                    </button>
                    <button
                      onClick={() => scrollToSection('first-aid')}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      {t('home.emergencyFirstAid')}
                    </button>
                  </div>

                  {/* Mobile Auth Button */}
                  {isMobile && (
                    <div className="flex justify-center mt-6">
                      <AuthButton isScrolled={false} />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-10 left-10 opacity-10">
                <Stethoscope className="h-32 w-32 text-[#2b7a78] animate-pulse" />
              </div>
              <div className="absolute bottom-10 right-10 opacity-10">
                <Heart className="h-24 w-24 text-red-500 animate-bounce" />
              </div>
            </section>

            {/* Voice Assistant Section */}
            <section className="py-12 bg-white">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <VoiceAssistant onCommand={handleVoiceCommand} />
              </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {t('home.featuresTitle')}
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    {t('home.featuresSubtitle')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <FeatureCard
                    icon={Search}
                    title={t('features.symptomChecker.title')}
                    description={t('features.symptomChecker.description')}
                    color="bg-green-100 text-green-600"
                    onClick={() => scrollToSection('symptom-checker')}
                  />
                  <FeatureCard
                    icon={FileText}
                    title={t('features.firstAid.title')}
                    description={t('features.firstAid.description')}
                    color="bg-red-100 text-red-600"
                    onClick={() => scrollToSection('first-aid')}
                  />
                  <FeatureCard
                    icon={Database}
                    title={t('features.healthRecords.title')}
                    description={t('features.healthRecords.description')}
                    color="bg-purple-100 text-purple-600"
                    onClick={() => scrollToSection('health-records')}
                  />
                  <FeatureCard
                    icon={Clock}
                    title={t('features.reminders.title')}
                    description={t('features.reminders.description')}
                    color="bg-blue-100 text-blue-600"
                    onClick={() => scrollToSection('medicine-reminders')}
                  />
                  <FeatureCard
                    icon={MapPin}
                    title={t('features.findHelp.title')}
                    description={t('features.findHelp.description')}
                    color="bg-orange-100 text-orange-600"
                    onClick={() => scrollToSection('find-help')}
                  />
                </div>
              </div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {t('about.title')}
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    {t('about.subtitle')}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-[#2b7a78] rounded-full p-2">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {t('about.ruralFocus.title')}
                        </h3>
                        <p className="text-gray-600">
                          {t('about.ruralFocus.description')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-[#2b7a78] rounded-full p-2">
                        <Search className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {t('about.aiIntegration.title')}
                        </h3>
                        <p className="text-gray-600">
                          {t('about.aiIntegration.description')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-[#2b7a78] rounded-full p-2">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {t('about.offlineAccess.title')}
                        </h3>
                        <p className="text-gray-600">
                          {t('about.offlineAccess.description')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="bg-gradient-to-br from-[#2b7a78] to-[#14b8a6] rounded-2xl p-8 text-white">
                      <Heart className="h-16 w-16 mb-6 mx-auto animate-pulse text-red-300" />
                      <h3 className="text-2xl font-bold text-center mb-4">
                        {t('about.mission.title')}
                      </h3>
                      <p className="text-center text-green-100">
                        {t('about.mission.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Heart className="h-6 w-6 text-red-500 animate-pulse" />
                    <span className="text-lg font-semibold">{t('app.title')} {t('app.subtitle')}</span>
                  </div>
                  <p className="text-gray-400">
                    {t('footer.copyright')}
                  </p>
                </div>
              </div>
            </footer>
          </>
        )}

        {/* Mobile Bottom Navigation */}
        <MobileNavigation activeComponent={activeComponent} onNavigate={scrollToSection} />
      </div>
    </AuthGuard>
  );
}

export default App;