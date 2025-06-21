import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Send, Loader2 } from 'lucide-react';

interface VoiceAssistantProps {
  onCommand?: (command: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onCommand }) => {
  const { t, i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true);
      synthRef.current = speechSynthesis;
      
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      // Set language based on current i18n language
      const langMap: { [key: string]: string } = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'te': 'te-IN'
      };
      recognition.lang = langMap[i18n.language] || 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };
      
      recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        processCommand(result);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          speak(t('voiceAssistant.microphonePermissionDenied'));
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [i18n.language]);

  const speak = (text: string) => {
    if (!synthRef.current) return;
    
    try {
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice based on language
      const voices = synthRef.current.getVoices();
      const langMap: { [key: string]: string[] } = {
        'en': ['en-US', 'en-GB', 'en'],
        'hi': ['hi-IN', 'hi'],
        'te': ['te-IN', 'te']
      };
      
      const preferredLangs = langMap[i18n.language] || ['en-US'];
      const voice = voices.find(v => 
        preferredLangs.some(lang => v.lang.startsWith(lang))
      );
      
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
    }
  };

  const processCommand = async (command: string) => {
    setIsProcessing(true);
    const lowerCommand = command.toLowerCase();
    let responseText = '';
    
    try {
      // Navigation commands
      if (lowerCommand.includes('home') || lowerCommand.includes('होम') || lowerCommand.includes('హోమ్')) {
        responseText = t('voiceAssistant.navigatingToHome');
        onCommand?.('home');
      } else if (lowerCommand.includes('symptom') || lowerCommand.includes('लक्षण') || lowerCommand.includes('లక్షణ')) {
        responseText = t('voiceAssistant.openingSymptomChecker');
        onCommand?.('symptom-checker');
      } else if (lowerCommand.includes('first aid') || lowerCommand.includes('प्राथमिक चिकित्सा') || lowerCommand.includes('ప్రథమ చికిత్స')) {
        responseText = t('voiceAssistant.openingFirstAid');
        onCommand?.('first-aid');
      } else if (lowerCommand.includes('reminder') || lowerCommand.includes('रिमाइंडर') || lowerCommand.includes('రిమైండర్')) {
        responseText = t('voiceAssistant.openingReminders');
        onCommand?.('medicine-reminders');
      } else if (lowerCommand.includes('record') || lowerCommand.includes('रिकॉर्ड') || lowerCommand.includes('రికార్డ్')) {
        responseText = t('voiceAssistant.openingHealthRecords');
        onCommand?.('health-records');
      } else if (lowerCommand.includes('help') || lowerCommand.includes('सहायता') || lowerCommand.includes('సహాయం')) {
        responseText = t('voiceAssistant.openingFindHelp');
        onCommand?.('find-help');
      } 
      // Health-related responses
      else if (lowerCommand.includes('fever') || lowerCommand.includes('बुखार') || lowerCommand.includes('జ్వరం')) {
        responseText = t('voiceAssistant.feverAdvice');
      } else if (lowerCommand.includes('headache') || lowerCommand.includes('सिरदर्द') || lowerCommand.includes('తలనొప్పి')) {
        responseText = t('voiceAssistant.headacheAdvice');
      } else if (lowerCommand.includes('emergency') || lowerCommand.includes('आपातकाल') || lowerCommand.includes('అత్యవసరం')) {
        responseText = t('voiceAssistant.emergencyAdvice');
      } 
      // Language switching
      else if (lowerCommand.includes('english') || lowerCommand.includes('अंग्रेजी') || lowerCommand.includes('ఇంగ్లీష్')) {
        i18n.changeLanguage('en');
        responseText = 'Language changed to English';
      } else if (lowerCommand.includes('hindi') || lowerCommand.includes('हिंदी') || lowerCommand.includes('హిందీ')) {
        i18n.changeLanguage('hi');
        responseText = 'भाषा हिंदी में बदल दी गई';
      } else if (lowerCommand.includes('telugu') || lowerCommand.includes('तेलुगु') || lowerCommand.includes('తెలుగు')) {
        i18n.changeLanguage('te');
        responseText = 'భాష తెలుగులోకి మార్చబడింది';
      }
      // Default response
      else {
        responseText = t('voiceAssistant.defaultResponse');
      }
      
      setResponse(responseText);
      speak(responseText);
    } catch (error) {
      console.error('Command processing error:', error);
      responseText = t('voiceAssistant.processingError');
      setResponse(responseText);
      speak(responseText);
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current || isListening) return;
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setShowTextInput(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      setTranscript(textInput);
      processCommand(textInput);
      setTextInput('');
    }
  };

  if (!isSupported && !showTextInput) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <MessageCircle className="h-5 w-5 text-yellow-600" />
          <span className="font-medium text-yellow-800">{t('voiceAssistant.notSupported')}</span>
        </div>
        <p className="text-yellow-700 text-sm mb-3">{t('voiceAssistant.useTextInput')}</p>
        <button
          onClick={() => setShowTextInput(true)}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          {t('voiceAssistant.enableTextInput')}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-[#2b7a78]" />
          <span>{t('voiceAssistant.title')}</span>
        </h3>
        
        <div className="flex items-center space-x-2">
          {isSupported && (
            <>
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isSpeaking || isProcessing}
                className={`p-3 rounded-full transition-all duration-200 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                    : 'bg-[#2b7a78] hover:bg-[#1e5a57] text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isListening ? t('voiceAssistant.stopListening') : t('voiceAssistant.startListening')}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              
              <button
                onClick={isSpeaking ? stopSpeaking : () => {}}
                disabled={!isSpeaking}
                className={`p-3 rounded-full transition-all duration-200 ${
                  isSpeaking
                    ? 'bg-blue-500 hover:bg-blue-600 text-white animate-pulse'
                    : 'bg-gray-300 text-gray-500'
                } disabled:cursor-not-allowed`}
                title={isSpeaking ? t('voiceAssistant.stopSpeaking') : t('voiceAssistant.notSpeaking')}
              >
                {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
            </>
          )}
          
          <button
            onClick={() => setShowTextInput(!showTextInput)}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200"
            title={t('voiceAssistant.toggleTextInput')}
          >
            <MessageCircle className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mb-4 space-y-2">
        {isListening && (
          <div className="flex items-center space-x-2 text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">{t('voiceAssistant.listening')}</span>
          </div>
        )}
        
        {isSpeaking && (
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">{t('voiceAssistant.speaking')}</span>
          </div>
        )}
        
        {isProcessing && (
          <div className="flex items-center space-x-2 text-[#2b7a78]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">{t('voiceAssistant.processing')}</span>
          </div>
        )}
      </div>

      {/* Text Input Form */}
      {showTextInput && (
        <form onSubmit={handleTextSubmit} className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={t('voiceAssistant.typeCommand')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2b7a78] focus:border-transparent"
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={!textInput.trim() || isProcessing}
              className="bg-[#2b7a78] hover:bg-[#1e5a57] disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {/* Transcript */}
      {transcript && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">{t('voiceAssistant.youSaid')}:</p>
          <p className="text-gray-900 font-medium">"{transcript}"</p>
        </div>
      )}

      {/* Response */}
      {response && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-600 mb-1">{t('voiceAssistant.assistant')}:</p>
          <p className="text-green-900 font-medium">{response}</p>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>{t('voiceAssistant.helpText')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-2">
          <p>• "{t('voiceAssistant.exampleCommands.home')}"</p>
          <p>• "{t('voiceAssistant.exampleCommands.symptoms')}"</p>
          <p>• "{t('voiceAssistant.exampleCommands.firstAid')}"</p>
          <p>• "{t('voiceAssistant.exampleCommands.help')}"</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;