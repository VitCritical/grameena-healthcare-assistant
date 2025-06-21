import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  onClose: () => void;
  showCloseButton?: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, showCloseButton = true }) => {
  const { t } = useTranslation();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error(t('auth.passwordMismatch'));
        }
        if (formData.password.length < 6) {
          throw new Error(t('auth.passwordTooShort'));
        }
        await signUp(formData.email, formData.password, formData.name);
      } else {
        await signIn(formData.email, formData.password);
      }
      if (showCloseButton) {
        onClose();
      }
    } catch (err: any) {
      let errorMessage = t('auth.authenticationFailed');
      
      // Handle Firebase auth errors
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = t('auth.invalidCredentials');
            break;
          case 'auth/email-already-in-use':
            errorMessage = t('auth.emailInUse');
            break;
          case 'auth/weak-password':
            errorMessage = t('auth.weakPassword');
            break;
          case 'auth/invalid-email':
            errorMessage = t('auth.invalidEmail');
            break;
          case 'auth/too-many-requests':
            errorMessage = t('auth.tooManyRequests');
            break;
          default:
            errorMessage = err.message || t('auth.authenticationFailed');
        }
      } else {
        errorMessage = err.message || t('auth.authenticationFailed');
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={`${showCloseButton ? 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4' : ''}`}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {showCloseButton && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {isSignUp ? t('auth.signUp') : t('auth.signIn')}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          )}

          {!showCloseButton && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                {isSignUp ? t('auth.signUp') : t('auth.signIn')}
              </h2>
              <p className="text-gray-600 text-center mt-2">
                {t('auth.accessRequired')}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.fullName')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2b7a78] focus:border-transparent transition-colors duration-200"
                    placeholder={t('auth.enterFullName')}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2b7a78] focus:border-transparent transition-colors duration-200"
                  placeholder={t('auth.enterEmail')}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2b7a78] focus:border-transparent transition-colors duration-200"
                  placeholder={t('auth.enterPassword')}
                  required
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2b7a78] focus:border-transparent transition-colors duration-200"
                    placeholder={t('auth.confirmPassword')}
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2b7a78] hover:bg-[#1e5a57] disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{isSignUp ? t('auth.signingUp') : t('auth.signingIn')}</span>
                </>
              ) : (
                <span>{isSignUp ? t('auth.signUp') : t('auth.signIn')}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#2b7a78] hover:text-[#1e5a57] font-medium transition-colors duration-200"
            >
              {isSignUp ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;