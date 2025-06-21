import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, LogIn, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';

interface AuthButtonProps {
  isScrolled?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({ isScrolled = false }) => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
        isScrolled ? 'bg-gray-100' : 'bg-white/10'
      }`}>
        <Loader2 className={`h-4 w-4 animate-spin ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-3">
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
          isScrolled ? 'bg-gray-100 text-gray-700' : 'bg-white/10 text-white'
        }`}>
          <User className="h-4 w-4" />
          <span className="text-sm font-medium hidden sm:inline">
            {user.displayName || user.email?.split('@')[0]}
          </span>
        </div>
        <button
          onClick={signOut}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
          title={t('auth.signOut')}
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium hidden sm:inline">{t('auth.signOut')}</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowAuthModal(true)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
          isScrolled 
            ? 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200' 
            : 'bg-white hover:bg-gray-50 text-gray-700'
        }`}
      >
        <LogIn className="h-4 w-4" />
        <span className="text-sm font-medium">{t('auth.signIn')}</span>
      </button>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
};

export default AuthButton;