import React, { useState } from 'react';
import { Check, ChevronRight, ChevronLeft, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
interface Option {
  value: string;
  label: string;
  points: number;
}
interface Question {
  id: string;
  question: string;
  subtitle?: string;
  options: Option[];
}
interface Answer {
  value: string;
  points: number;
}
interface Recommendation {
  level: string;
  color: 'green' | 'blue' | 'orange' | 'red';
  title: string;
  description: string;
  priorities: string[];
  bundle: string;
  roi: string;
  nextSteps: string[];
}
const KIReadinessCheck: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const questions: Question[] = [{
    id: 'company_size',
    question: 'Wie groß ist Ihr Unternehmen?',
    options: [{
      value: 'micro',
      label: '1-10 Mitarbeitende',
      points: 2
    }, {
      value: 'small',
      label: '11-50 Mitarbeitende',
      points: 3
    }, {
      value: 'medium',
      label: '51-250 Mitarbeitende',
      points: 4
    }, {
      value: 'large',
      label: 'Über 250 Mitarbeitende',
      points: 3
    }]
  }, {
    id: 'repetitive_tasks',
    question: 'Wie viel Zeit verbringt Ihr Team mit wiederkehrenden Aufgaben?',
    subtitle: '(z.B. Anfragen beantworten, Daten eingeben, Termine koordinieren)',
    options: [{
      value: 'minimal',
      label: 'Kaum (unter 10%)',
      points: 1
    }, {
      value: 'some',
      label: 'Etwas (10-25%)',
      points: 3
    }, {
      value: 'significant',
      label: 'Viel (25-50%)',
      points: 5
    }, {
      value: 'excessive',
      label: 'Sehr viel (über 50%)',
      points: 5
    }]
  }, {
    id: 'customer_communication',
    question: 'Wie viele Kundenanfragen erhalten Sie täglich?',
    options: [{
      value: 'few',
      label: 'Weniger als 10',
      points: 2
    }, {
      value: 'moderate',
      label: '10-50',
      points: 4
    }, {
      value: 'many',
      label: '50-200',
      points: 5
    }, {
      value: 'massive',
      label: 'Über 200',
      points: 5
    }]
  }, {
    id: 'tech_infrastructure',
    question: 'Wie würden Sie Ihre aktuelle IT-Infrastruktur beschreiben?',
    options: [{
      value: 'outdated',
      label: 'Veraltet, viele manuelle Prozesse',
      points: 5
    }, {
      value: 'basic',
      label: 'Grundlegend, aber funktional',
      points: 4
    }, {
      value: 'modern',
      label: 'Modern, aber nicht integriert',
      points: 3
    }, {
      value: 'advanced',
      label: 'Hochmodern und gut integriert',
      points: 2
    }]
  }, {
    id: 'data_protection',
    question: 'Wie wichtig ist Ihnen Datenschutz und DSGVO-Konformität?',
    options: [{
      value: 'critical',
      label: 'Absolut kritisch (z.B. Kanzlei, Gesundheit)',
      points: 5
    }, {
      value: 'very_important',
      label: 'Sehr wichtig',
      points: 4
    }, {
      value: 'important',
      label: 'Wichtig',
      points: 3
    }, {
      value: 'standard',
      label: 'Standard-Anforderungen',
      points: 2
    }]
  }, {
    id: 'team_openness',
    question: 'Wie steht Ihr Team neuen Technologien gegenüber?',
    options: [{
      value: 'resistant',
      label: 'Eher skeptisch',
      points: 2
    }, {
      value: 'cautious',
      label: 'Vorsichtig offen',
      points: 3
    }, {
      value: 'open',
      label: 'Offen und interessiert',
      points: 4
    }, {
      value: 'enthusiastic',
      label: 'Sehr enthusiastisch',
      points: 5
    }]
  }, {
    id: 'budget',
    question: 'Welches monatliche Budget steht für Digitalisierung zur Verfügung?',
    options: [{
      value: 'limited',
      label: 'Unter 500€',
      points: 2
    }, {
      value: 'moderate',
      label: '500-2.000€',
      points: 3
    }, {
      value: 'good',
      label: '2.000-5.000€',
      points: 4
    }, {
      value: 'substantial',
      label: 'Über 5.000€',
      points: 5
    }]
  }, {
    id: 'main_pain_point',
    question: 'Was ist Ihre größte Herausforderung?',
    options: [{
      value: 'efficiency',
      label: 'Zu viele manuelle Prozesse',
      points: 5
    }, {
      value: 'customer_service',
      label: 'Kundenkommunikation überfordert uns',
      points: 5
    }, {
      value: 'data_chaos',
      label: 'Daten sind überall verstreut',
      points: 4
    }, {
      value: 'competition',
      label: 'Wettbewerber sind technologisch voraus',
      points: 4
    }]
  }, {
    id: 'timeline',
    question: 'Wann möchten Sie starten?',
    options: [{
      value: 'urgent',
      label: 'Sofort/Nächsten Monat',
      points: 5
    }, {
      value: 'soon',
      label: 'In 1-3 Monaten',
      points: 4
    }, {
      value: 'planning',
      label: 'In 3-6 Monaten',
      points: 3
    }, {
      value: 'exploring',
      label: 'Nur Information sammeln',
      points: 1
    }]
  }, {
    id: 'goals',
    question: 'Was ist Ihr Hauptziel mit KI-Integration?',
    options: [{
      value: 'cost_reduction',
      label: 'Kosten senken',
      points: 3
    }, {
      value: 'quality',
      label: 'Servicequalität verbessern',
      points: 4
    }, {
      value: 'growth',
      label: 'Wachstum ermöglichen',
      points: 5
    }, {
      value: 'competitive',
      label: 'Wettbewerbsfähig bleiben',
      points: 4
    }]
  }];
  const handleAnswer = (value: string, points: number) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: {
        value,
        points
      }
    });
  };
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  const calculateScore = (): number => {
    return Object.values(answers).reduce((sum, answer) => sum + answer.points, 0);
  };
  const getRecommendation = (): Recommendation => {
    const score = calculateScore();
    const maxScore = questions.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.points)), 0);
    const percentage = Math.round(score / maxScore * 100);
    if (percentage >= 80) {
      return {
        level: 'Hoch',
        color: 'green',
        title: 'Sie sind bereit für KI!',
        description: 'Ihr Unternehmen hat ideale Voraussetzungen für KI-Integration. Sie können sofort mit hochautomatisierten Lösungen starten.',
        priorities: ['KI-gestützter Kundensupport (WhatsApp/Telefon)', 'Prozessautomatisierung mit Odoo-Integration', 'Intelligentes CRM mit Lead-Scoring'],
        bundle: 'Premium KI-Paket',
        roi: '6-9 Monate',
        nextSteps: ['Kostenloses Erstgespräch vereinbaren', 'Quick-Win-Analyse Ihrer Prozesse', 'Pilotprojekt in 4 Wochen starten']
      };
    } else if (percentage >= 60) {
      return {
        level: 'Mittel',
        color: 'blue',
        title: 'Gute Ausgangslage für KI-Einstieg',
        description: 'Sie haben solide Grundlagen. Mit gezielter Vorbereitung können Sie schnell von KI profitieren.',
        priorities: ['Einen klaren Use Case definieren', 'Team-Schulung und Change Management', 'Schrittweise Automatisierung starten'],
        bundle: 'Starter KI-Paket',
        roi: '9-12 Monate',
        nextSteps: ['KI-Strategie-Workshop (kostenlos)', 'Quick-Win identifizieren', 'Pilotprojekt mit kleinem Bereich starten']
      };
    } else if (percentage >= 40) {
      return {
        level: 'Basis',
        color: 'orange',
        title: 'Fundament zuerst aufbauen',
        description: 'Bevor Sie in KI investieren, sollten Sie einige Grundlagen schaffen. Wir helfen Ihnen dabei.',
        priorities: ['IT-Infrastruktur modernisieren', 'Datenprozesse strukturieren', 'Team für Digitalisierung vorbereiten'],
        bundle: 'Digital-Fundament-Paket',
        roi: '12-18 Monate',
        nextSteps: ['Digitalisierungs-Roadmap erstellen', 'Infrastruktur-Audit durchführen', 'Basisautomatisierung ohne KI starten']
      };
    } else {
      return {
        level: 'Niedrig',
        color: 'red',
        title: 'Schritt für Schritt digitalisieren',
        description: 'KI ist noch nicht der richtige Schritt. Lassen Sie uns gemeinsam die Grundlagen legen.',
        priorities: ['Prozesse dokumentieren und optimieren', 'Grundlegende Digitalisierung', 'Team mitnehmen und schulen'],
        bundle: 'Digitalisierungs-Beratung',
        roi: '18-24 Monate',
        nextSteps: ['Kostenlose Potenzialanalyse', 'Digitalisierungs-Fahrplan entwickeln', 'Mit einfachen Verbesserungen starten']
      };
    }
  };
  const progress = (currentQuestion + 1) / questions.length * 100;
  const currentAnswer = answers[questions[currentQuestion]?.id];
  const colorClasses: Record<string, string> = {
    green: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200',
    blue: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200',
    orange: 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-200',
    red: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200'
  };
  if (showResults) {
    const recommendation = getRecommendation();
    const score = calculateScore();
    const maxScore = questions.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.points)), 0);
    const percentage = Math.round(score / maxScore * 100);
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
            {/* Score Display */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-6">
                <div className="text-center">
                  <span className="text-4xl font-bold text-white">{percentage}%</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Ihre KI-Readiness</h2>
              <p className="text-gray-600 dark:text-gray-300">KI-Readiness-Score</p>
            </div>

            {/* Recommendation Card */}
            <div className={`rounded-2xl border-2 p-6 mb-8 ${colorClasses[recommendation.color]}`}>
              <h3 className="text-2xl font-bold mb-3">{recommendation.title}</h3>
              <p className="mb-4">{recommendation.description}</p>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Empfohlenes ROI-Ziel: {recommendation.roi}</span>
              </div>
            </div>

            {/* Priorities */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">Ihre Prioritäten</h4>
              </div>
              <div className="space-y-3">
                {recommendation.priorities.map((priority, index) => <div key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{priority}</span>
                  </div>)}
              </div>
            </div>

            {/* Bundle Recommendation */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
              <p className="text-blue-100 text-sm mb-1">Empfohlenes Deutlicht-Paket</p>
              <h4 className="text-2xl font-bold mb-4">{recommendation.bundle}</h4>
              <p className="font-medium mb-3">Nächste Schritte:</p>
              <ul className="space-y-2">
                {recommendation.nextSteps.map((step, index) => <li key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-300" />
                    <span>{step}</span>
                  </li>)}
              </ul>
            </div>

            {/* Email Form */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 mb-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Detaillierte Auswertung erhalten
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Möchten Sie eine ausführliche Analyse mit konkreten Handlungsempfehlungen? 
                Geben Sie Ihre E-Mail-Adresse ein:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ihre@email.de" className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                <button onClick={() => alert('In der Live-Version wird hier die E-Mail an Ihr CRM gesendet!')} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Senden
                </button>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-3">
                Ihre Daten werden DSGVO-konform verarbeitet und nicht an Dritte weitergegeben.
              </p>
            </div>

            {/* Restart Button */}
            <button onClick={() => {
            setCurrentQuestion(0);
            setAnswers({});
            setShowResults(false);
            setEmail('');
          }} className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
              Neuen Check starten
            </button>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 bg-secondary-foreground mx-0 my-[76px] text-accent">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-#2b3d4f to-indigo-600 p-6 text-white py-[74px] bg-primary px-[28px]">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">KI-Readiness-Check</h1>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                Frage {currentQuestion + 1} von {questions.length}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-500" style={{
              width: `${progress}%`
            }} />
            </div>
          </div>

          {/* Question */}
          <div className="p-6 md:p-8 px-[34px]">
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {questions[currentQuestion].question}
              </h2>
              {questions[currentQuestion].subtitle && <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {questions[currentQuestion].subtitle}
                </p>}
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {questions[currentQuestion].options.map(option => <button key={option.value} onClick={() => handleAnswer(option.value, option.points)} className={`w-full p-4 rounded-xl border-2 text-left transition-all ${currentAnswer?.value === option.value ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md' : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
                    {currentAnswer?.value === option.value && <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  </div>
                </button>)}
            </div>

            {/* Navigation */}
            <div className="flex justify-between gap-4">
              {currentQuestion > 0 && <button onClick={prevQuestion} className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                  Zurück
                </button>}
              <button onClick={nextQuestion} disabled={!currentAnswer} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ml-auto ${currentAnswer ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                {currentQuestion === questions.length - 1 ? 'Ergebnis anzeigen' : 'Weiter'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Powered by Deutlicht – Technologie, die Menschen verbindet
          </p>
        </div>
      </div>
    </div>;
};
export default KIReadinessCheck;