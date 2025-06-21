import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Loader2, AlertCircle, CheckCircle, Thermometer, Zap, Activity } from 'lucide-react';

interface SymptomAnalysis {
  condition: string;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
  seekMedicalAttention: boolean;
}

interface SymptomChip {
  id: string;
  symptom: string;
  severity: 'low' | 'medium' | 'high';
}

const SymptomChecker: React.FC = () => {
  const { t } = useTranslation();
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
  const [error, setError] = useState('');

  const commonSymptoms: SymptomChip[] = [
    { id: 'fever', symptom: t('symptoms.fever'), severity: 'medium' },
    { id: 'headache', symptom: t('symptoms.headache'), severity: 'low' },
    { id: 'cough', symptom: t('symptoms.cough'), severity: 'low' },
    { id: 'sore-throat', symptom: t('symptoms.soreThroat'), severity: 'low' },
    { id: 'chest-pain', symptom: t('symptoms.chestPain'), severity: 'high' },
    { id: 'difficulty-breathing', symptom: t('symptoms.difficultyBreathing'), severity: 'high' },
    { id: 'stomach-pain', symptom: t('symptoms.stomachPain'), severity: 'medium' },
    { id: 'nausea', symptom: t('symptoms.nausea'), severity: 'medium' },
    { id: 'dizziness', symptom: t('symptoms.dizziness'), severity: 'medium' },
    { id: 'fatigue', symptom: t('symptoms.fatigue'), severity: 'low' },
    { id: 'body-ache', symptom: t('symptoms.bodyAche'), severity: 'low' },
    { id: 'vomiting', symptom: t('symptoms.vomiting'), severity: 'medium' }
  ];

  // Simulated AI analysis with realistic responses
  const analyzeSymptoms = async (symptomInput: string): Promise<SymptomAnalysis> => {
    const lowerSymptoms = symptomInput.toLowerCase();
    
    // Simple pattern matching for demo purposes
    if (lowerSymptoms.includes('fever') && lowerSymptoms.includes('headache')) {
      return {
        condition: t('analysis.viralInfection'),
        severity: 'medium',
        recommendations: [
          t('recommendations.stayHydrated'),
          t('recommendations.getRest'),
          t('recommendations.takeParacetamol'),
          t('recommendations.monitorTemperature'),
          t('recommendations.avoidContact')
        ],
        seekMedicalAttention: false
      };
    } else if (lowerSymptoms.includes('chest pain') || lowerSymptoms.includes('difficulty breathing')) {
      return {
        condition: t('analysis.seriousCondition'),
        severity: 'high',
        recommendations: [
          t('recommendations.seekImmediate'),
          t('recommendations.callEmergency'),
          t('recommendations.avoidExertion'),
          t('recommendations.stayCalm')
        ],
        seekMedicalAttention: true
      };
    } else if (lowerSymptoms.includes('cough') && lowerSymptoms.includes('sore throat')) {
      return {
        condition: t('analysis.upperRespiratory'),
        severity: 'low',
        recommendations: [
          t('recommendations.gargleSaltWater'),
          t('recommendations.drinkWarmLiquids'),
          t('recommendations.useLozenges'),
          t('recommendations.getRest'),
          t('recommendations.stayHydrated')
        ],
        seekMedicalAttention: false
      };
    } else if (lowerSymptoms.includes('stomach pain') || lowerSymptoms.includes('nausea')) {
      return {
        condition: t('analysis.gastricIssue'),
        severity: 'medium',
        recommendations: [
          t('recommendations.eatBlandFoods'),
          t('recommendations.sipWater'),
          t('recommendations.avoidSpicyFoods'),
          t('recommendations.restAvoidActivity'),
          t('recommendations.considerORS')
        ],
        seekMedicalAttention: false
      };
    } else {
      return {
        condition: t('analysis.generalConcern'),
        severity: 'low',
        recommendations: [
          t('recommendations.monitorSymptoms'),
          t('recommendations.maintainHygiene'),
          t('recommendations.stayHydratedRest'),
          t('recommendations.consultProvider'),
          t('recommendations.keepDiary')
        ],
        seekMedicalAttention: false
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symptoms.trim()) {
      setError(t('symptomChecker.enterSymptoms'));
      return;
    }

    setError('');
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      
      const result = await analyzeSymptoms(symptoms);
      setAnalysis(result);
    } catch (err) {
      setError(t('symptomChecker.analysisFailed'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSymptomChipClick = (symptom: string) => {
    const currentSymptoms = symptoms.trim();
    const newSymptom = currentSymptoms ? `${currentSymptoms}, ${symptom}` : symptom;
    setSymptoms(newSymptom);
    
    // Auto-trigger analysis
    setTimeout(() => {
      const form = document.getElementById('symptom-form') as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
    }, 100);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertCircle className="h-5 w-5" />;
      case 'medium': return <Thermometer className="h-5 w-5" />;
      case 'low': return <CheckCircle className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getChipSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200';
    }
  };

  const getChipSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <Zap className="h-3 w-3" />;
      case 'medium': return <Activity className="h-3 w-3" />;
      case 'low': return <CheckCircle className="h-3 w-3" />;
      default: return <CheckCircle className="h-3 w-3" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-[#2b7a78] rounded-full p-3">
            <Search className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('symptomChecker.title')}</h2>
        <p className="text-gray-600">
          {t('symptomChecker.subtitle')}
        </p>
      </div>

      {/* Common Symptoms Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('symptomChecker.commonSymptoms')}</h3>
        <div className="flex flex-wrap gap-2">
          {commonSymptoms.map((symptomChip) => (
            <button
              key={symptomChip.id}
              onClick={() => handleSymptomChipClick(symptomChip.symptom)}
              className={`inline-flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium border transition-all duration-200 transform hover:scale-105 ${getChipSeverityColor(symptomChip.severity)}`}
              disabled={isAnalyzing}
            >
              {getChipSeverityIcon(symptomChip.severity)}
              <span>{symptomChip.symptom}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">{t('symptomChecker.clickToAdd')}</p>
      </div>

      <form id="symptom-form" onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
            {t('symptomChecker.enterSymptomsLabel')}
          </label>
          <textarea
            id="symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2b7a78] focus:border-transparent transition-colors duration-200 resize-none"
            rows={4}
            placeholder={t('symptomChecker.symptomsPlaceholder')}
            disabled={isAnalyzing}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isAnalyzing || !symptoms.trim()}
          className="w-full bg-[#2b7a78] hover:bg-[#1e5a57] disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center space-x-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{t('symptomChecker.analyzing')}</span>
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span>{t('symptomChecker.analyzeButton')}</span>
            </>
          )}
        </button>
      </form>

      {analysis && (
        <div className="bg-gray-50 rounded-xl p-6 animate-fade-in">
          <div className="mb-6">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getSeverityColor(analysis.severity)}`}>
              {getSeverityIcon(analysis.severity)}
              <span className="text-sm font-medium capitalize">{t(`severity.${analysis.severity}`)} {t('severity.priority')}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-4">{analysis.condition}</h3>

          {analysis.seekMedicalAttention && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-semibold">{t('analysis.immediateAttention')}</span>
              </div>
              <p className="text-red-700 text-sm mt-1">
                {t('analysis.consultImmediately')}
              </p>
            </div>
          )}

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('analysis.recommendedActions')}</h4>
            <ul className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>{t('analysis.disclaimer')}</strong> {t('analysis.disclaimerText')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;