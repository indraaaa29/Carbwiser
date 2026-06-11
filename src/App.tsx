import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ProfileProvider } from './context/ProfileContext';
import { ActionProvider } from './context/ActionContext';
import RootLayout from './components/layout/RootLayout';

const LazyLanding = lazy(() => import('./pages/LandingPage'));
const LazyAssessment = lazy(() => import('./pages/LifestyleAssessment'));
const LazyOverview = lazy(() => import('./pages/FootprintOverview'));
const LazySmartActions = lazy(() => import('./pages/SmartActions'));
const LazyHotspots = lazy(() => import('./pages/CarbonHotspots'));
const LazyRoadmap = lazy(() => import('./pages/CarbonRoadmap'));
const LazySimulator = lazy(() => import('./pages/WhatIfSimulator'));
const LazyTracking = lazy(() => import('./pages/ProgressTracking'));
const LazyMethodology = lazy(() => import('./pages/Methodology'));

const LazyAgentation = lazy(() =>
  import('agentation').then((mod) => ({ default: mod.Agentation }))
);

function App() {
  return (
    <>
      <BrowserRouter>
        <MotionConfig reducedMotion="user">
          <ProfileProvider>
            <ActionProvider>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><span className="material-symbols-outlined animate-spin">autorenew</span></div>}>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<LazyLanding />} />
              <Route path="/assessment" element={<LazyAssessment />} />
              <Route path="/overview" element={<LazyOverview />} />
              <Route path="/actions" element={<LazySmartActions />} />
              <Route path="/hotspots" element={<LazyHotspots />} />
              <Route path="/roadmap" element={<LazyRoadmap />} />
              <Route path="/simulator" element={<LazySimulator />} />
              <Route path="/tracking" element={<LazyTracking />} />
              <Route path="/methodology" element={<LazyMethodology />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
            </ActionProvider>
          </ProfileProvider>
        </MotionConfig>
      </BrowserRouter>
      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <LazyAgentation />
        </Suspense>
      )}
    </>
  );
}

export default App;
