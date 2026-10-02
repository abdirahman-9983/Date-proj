import { useState } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import AnimatedBackground from './components/AnimatedBackground';
import MusicToggle from './components/MusicToggle';
import Home from './pages/Home';
import Questions from './pages/Questions';
import Review from './pages/Review';
import Confirmation from './pages/Confirmation';
import Admin from './pages/Admin';
import { saveDateResponse } from './lib/dateResponseService';

const INITIAL_DATE_PLAN = {
  accepted: false,
  freeDay: '',
  vibe: '',
  food: '',
  perfectDate: '',
  date: '',
  time: '',
  location: '',
  customLocation: '',
  message: '',
};

// Flow steps
const STEP_HOME = 'home';
const STEP_QUESTIONS = 'questions';
const STEP_REVIEW = 'review';
const STEP_CONFIRMATION = 'confirmation';

function DateApp() {
  const [step, setStep] = useState(STEP_HOME);
  const [datePlan, setDatePlan] = useState(INITIAL_DATE_PLAN);
  const [isSaving, setIsSaving] = useState(false);
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || '';

  const handleYes = () => {
    setDatePlan(prev => ({ ...prev, accepted: true }));
    setStep(STEP_QUESTIONS);
  };

  const handleQuestionsComplete = () => {
    setStep(STEP_REVIEW);
  };

  const handleConfirm = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await saveDateResponse(name, datePlan);
      if (error) {
        console.warn('[Supabase] Insert notice:', error.message || error);
        // Resilient backup to localStorage so no response is ever lost
        const localList = JSON.parse(localStorage.getItem('local_date_responses') || '[]');
        localList.unshift({
          id: 'local-' + Date.now(),
          created_at: new Date().toISOString(),
          name: name || null,
          ...datePlan,
        });
        localStorage.setItem('local_date_responses', JSON.stringify(localList));
      } else {
        console.log('[Supabase] Response saved successfully:', data);
      }
    } catch (err) {
      console.warn('[Supabase] Network/connection fallback:', err);
    } finally {
      setIsSaving(false);
      setStep(STEP_CONFIRMATION);
    }
  };

  const handleBack = () => {
    setStep(STEP_QUESTIONS);
  };

  const handleRestart = () => {
    setDatePlan(INITIAL_DATE_PLAN);
    setStep(STEP_HOME);
  };

  return (
    <>
      {step === STEP_HOME && <Home onYes={handleYes} />}
      {step === STEP_QUESTIONS && (
        <Questions
          datePlan={datePlan}
          setDatePlan={setDatePlan}
          onComplete={handleQuestionsComplete}
        />
      )}
      {step === STEP_REVIEW && (
        <Review
          datePlan={datePlan}
          isSaving={isSaving}
          onConfirm={handleConfirm}
          onBack={handleBack}
        />
      )}
      {step === STEP_CONFIRMATION && (
        <Confirmation onRestart={handleRestart} />
      )}
    </>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<DateApp />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
      <MusicToggle />
    </div>
  );
}
