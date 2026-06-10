import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Agentation } from 'agentation';
import LandingPage from './pages/LandingPage';
import LifestyleAssessment from './pages/LifestyleAssessment';
import FootprintOverview from './pages/FootprintOverview';
import SmartActions from './pages/SmartActions';
import CarbonHotspots from './pages/CarbonHotspots';
import CarbonRoadmap from './pages/CarbonRoadmap';
import WhatIfSimulator from './pages/WhatIfSimulator';
import ProgressTracking from './pages/ProgressTracking';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/assessment" element={<LifestyleAssessment />} />
          <Route path="/overview" element={<FootprintOverview />} />
          <Route path="/actions" element={<SmartActions />} />
          <Route path="/hotspots" element={<CarbonHotspots />} />
          <Route path="/roadmap" element={<CarbonRoadmap />} />
          <Route path="/simulator" element={<WhatIfSimulator />} />
          <Route path="/tracking" element={<ProgressTracking />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}

export default App;
