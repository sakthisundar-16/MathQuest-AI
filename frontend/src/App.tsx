import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GradeProvider } from './context/GradeContext';
import { AppLayout } from './components/AppLayout';
import { SuspenseLoader } from './components/SuspenseLoader';

import { SoundProvider } from './context/SoundContext';
import { GrandEntryLoader } from './components/GrandEntryLoader';

// Code-split route components for rapid initial load and optimal memory efficiency
const LandingPage = React.lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LearnTopicsPage = React.lazy(() => import('./pages/LearnTopicsPage').then(m => ({ default: m.LearnTopicsPage })));
const LessonPage = React.lazy(() => import('./pages/LessonPage').then(m => ({ default: m.LessonPage })));
const VideoLessonPage = React.lazy(() => import('./pages/VideoLessonPage').then(m => ({ default: m.VideoLessonPage })));
const QuizPage = React.lazy(() => import('./pages/QuizPage').then(m => ({ default: m.QuizPage })));
const ResultsPage = React.lazy(() => import('./pages/ResultsPage').then(m => ({ default: m.ResultsPage })));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ProgressPage = React.lazy(() => import('./pages/ProgressPage').then(m => ({ default: m.ProgressPage })));
const QuestieCharacterSheet = React.lazy(() => import('./components/QuestieCharacterSheet').then(m => ({ default: m.QuestieCharacterSheet })));

export function App() {
  return (
    <GradeProvider>
      <SoundProvider>
        <GrandEntryLoader />
        <BrowserRouter>
          <AppLayout>
            <Suspense fallback={<SuspenseLoader message="Loading Adventure Zone..." />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/learn" element={<LearnTopicsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/character-sheet" element={<QuestieCharacterSheet />} />
                <Route path="/lesson/:topicId" element={<LessonPage />} />
                <Route path="/lesson/:topicId/video" element={<VideoLessonPage />} />
                <Route path="/quiz/:topicId" element={<QuizPage />} />
                <Route path="/results/:attemptId" element={<ResultsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AppLayout>
        </BrowserRouter>
      </SoundProvider>
    </GradeProvider>
  );
}

export default App;
