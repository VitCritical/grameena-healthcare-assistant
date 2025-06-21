import React from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';
import { Loader2, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { t } = useTranslation();
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <Heart className="h-16 w-16 text-red-500 animate-pulse mx-auto" />
            <div className="absolute inset-0 h-16 w-16 text-red-400 opacity-30 animate-ping mx-auto">
              <Heart className="h-16 w-16" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('app.title')} {t('app.subtitle')}</h1>
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-[#2b7a78]" />
            <span className="text-gray-600">{t('auth.loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="relative mb-6">
              <Heart className="h-16 w-16 text-red-500 animate-pulse mx-auto" />
              <div className="absolute inset-0 h-16 w-16 text-red-400 opacity-30 animate-ping mx-auto">
                <Heart className="h-16 w-16" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('app.title')} {t('app.subtitle')}</h1>
            <p className="text-gray-600 mb-6">{t('auth.signInRequired')}</p>
          </div>
          <AuthModal onClose={() => {}} showCloseButton={false} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;