import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, AlertTriangle, Flame, Scissors, Wind, Heart } from 'lucide-react';

interface FirstAidStep {
  step: number;
  instruction: string;
  warning?: string;
}

interface EmergencyGuide {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  severity: 'high' | 'medium' | 'low';
  description: string;
  steps: FirstAidStep[];
  whenToSeekHelp: string[];
}

const FirstAidGuide: React.FC = () => {
  const { t } = useTranslation();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const emergencyGuides: EmergencyGuide[] = [
    {
      id: 'burns',
      title: t('firstAid.burns.title'),
      icon: Flame,
      severity: 'high',
      description: t('firstAid.burns.description'),
      steps: [
        {
          step: 1,
          instruction: t('firstAid.burns.steps.step1'),
          warning: t('firstAid.burns.steps.step1Warning')
        },
        {
          step: 2,
          instruction: t('firstAid.burns.steps.step2')
        },
        {
          step: 3,
          instruction: t('firstAid.burns.steps.step3')
        },
        {
          step: 4,
          instruction: t('firstAid.burns.steps.step4')
        },
        {
          step: 5,
          instruction: t('firstAid.burns.steps.step5'),
          warning: t('firstAid.burns.steps.step5Warning')
        }
      ],
      whenToSeekHelp: [
        t('firstAid.burns.seekHelp.largeBurns'),
        t('firstAid.burns.seekHelp.faceHandsFeet'),
        t('firstAid.burns.seekHelp.thirdDegree'),
        t('firstAid.burns.seekHelp.chemicalElectrical'),
        t('firstAid.burns.seekHelp.infection')
      ]
    },
    {
      id: 'cuts',
      title: t('firstAid.cuts.title'),
      icon: Scissors,
      severity: 'medium',
      description: t('firstAid.cuts.description'),
      steps: [
        {
          step: 1,
          instruction: t('firstAid.cuts.steps.step1')
        },
        {
          step: 2,
          instruction: t('firstAid.cuts.steps.step2')
        },
        {
          step: 3,
          instruction: t('firstAid.cuts.steps.step3')
        },
        {
          step: 4,
          instruction: t('firstAid.cuts.steps.step4')
        },
        {
          step: 5,
          instruction: t('firstAid.cuts.steps.step5')
        },
        {
          step: 6,
          instruction: t('firstAid.cuts.steps.step6')
        }
      ],
      whenToSeekHelp: [
        t('firstAid.cuts.seekHelp.deepCuts'),
        t('firstAid.cuts.seekHelp.longCuts'),
        t('firstAid.cuts.seekHelp.bleeding'),
        t('firstAid.cuts.seekHelp.infection'),
        t('firstAid.cuts.seekHelp.dirtyObjects'),
        t('firstAid.cuts.seekHelp.tetanus')
      ]
    },
    {
      id: 'choking',
      title: t('firstAid.choking.title'),
      icon: Wind,
      severity: 'high',
      description: t('firstAid.choking.description'),
      steps: [
        {
          step: 1,
          instruction: t('firstAid.choking.steps.step1')
        },
        {
          step: 2,
          instruction: t('firstAid.choking.steps.step2')
        },
        {
          step: 3,
          instruction: t('firstAid.choking.steps.step3')
        },
        {
          step: 4,
          instruction: t('firstAid.choking.steps.step4')
        },
        {
          step: 5,
          instruction: t('firstAid.choking.steps.step5'),
          warning: t('firstAid.choking.steps.step5Warning')
        }
      ],
      whenToSeekHelp: [
        t('firstAid.choking.seekHelp.callEmergency'),
        t('firstAid.choking.seekHelp.unconscious'),
        t('firstAid.choking.seekHelp.persistent'),
        t('firstAid.choking.seekHelp.afterRemoval'),
        t('firstAid.choking.seekHelp.infants')
      ]
    },
    {
      id: 'fainting',
      title: t('firstAid.fainting.title'),
      icon: Heart,
      severity: 'medium',
      description: t('firstAid.fainting.description'),
      steps: [
        {
          step: 1,
          instruction: t('firstAid.fainting.steps.step1')
        },
        {
          step: 2,
          instruction: t('firstAid.fainting.steps.step2')
        },
        {
          step: 3,
          instruction: t('firstAid.fainting.steps.step3')
        },
        {
          step: 4,
          instruction: t('firstAid.fainting.steps.step4')
        },
        {
          step: 5,
          instruction: t('firstAid.fainting.steps.step5')
        },
        {
          step: 6,
          instruction: t('firstAid.fainting.steps.step6')
        }
      ],
      whenToSeekHelp: [
        t('firstAid.fainting.seekHelp.noConsciousness'),
        t('firstAid.fainting.seekHelp.duringExercise'),
        t('firstAid.fainting.seekHelp.chestPain'),
        t('firstAid.fainting.seekHelp.injury'),
        t('firstAid.fainting.seekHelp.frequent'),
        t('firstAid.fainting.seekHelp.medicalConditions')
      ]
    }
  ];

  const toggleExpanded = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-orange-200 bg-orange-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getIconColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-600 rounded-full p-3">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('firstAid.title')}</h2>
        <p className="text-gray-600">
          {t('firstAid.subtitle')}
        </p>
      </div>

      <div className="space-y-4">
        {emergencyGuides.map((guide) => {
          const isExpanded = expandedItem === guide.id;
          const IconComponent = guide.icon;

          return (
            <div
              key={guide.id}
              className={`border rounded-xl transition-all duration-300 ${getSeverityColor(guide.severity)} ${
                isExpanded ? 'shadow-lg' : 'shadow-md hover:shadow-lg'
              }`}
            >
              <button
                onClick={() => toggleExpanded(guide.id)}
                className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-[#2b7a78] focus:ring-inset rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${getIconColor(guide.severity)}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{guide.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{guide.description}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="h-6 w-6 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-gray-500" />
                    )}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 animate-fade-in">
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">{t('firstAid.stepsTitle')}</h4>
                    <div className="space-y-4 mb-6">
                      {guide.steps.map((step) => (
                        <div key={step.step} className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-[#2b7a78] text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {step.step}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-700">{step.instruction}</p>
                            {step.warning && (
                              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-800 text-sm font-medium">
                                  ⚠️ {t('firstAid.warning')}: {step.warning}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h5 className="font-semibold text-red-800 mb-2">{t('firstAid.seekHelpTitle')}</h5>
                      <ul className="space-y-1">
                        {guide.whenToSeekHelp.map((condition, index) => (
                          <li key={index} className="text-red-700 text-sm flex items-start space-x-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>{condition}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>{t('firstAid.emergencyNumbers')}</strong> {t('firstAid.disclaimer')}
        </p>
      </div>
    </div>
  );
};

export default FirstAidGuide;