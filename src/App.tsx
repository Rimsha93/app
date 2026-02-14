import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { Toaster } from '@/components/ui/sonner';

// Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import OnboardingPage from '@/pages/OnboardingPage';
import Dashboard from '@/pages/Dashboard';
import AICounsellor from '@/pages/AICounsellor';
import Universities from '@/pages/Universities';
import ApplicationGuidance from '@/pages/ApplicationGuidance';
import Profile from '@/pages/Profile';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Onboarding Guard
function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!state.user?.profile.isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route 
        path="/onboarding" 
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <OnboardingGuard>
            <Dashboard />
          </OnboardingGuard>
        } 
      />
      <Route 
        path="/counsellor" 
        element={
          <OnboardingGuard>
            <AICounsellor />
          </OnboardingGuard>
        } 
      />
      <Route 
        path="/universities" 
        element={
          <OnboardingGuard>
            <Universities />
          </OnboardingGuard>
        } 
      />
      <Route 
        path="/application" 
        element={
          <OnboardingGuard>
            <ApplicationGuidance />
          </OnboardingGuard>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <OnboardingGuard>
            <Profile />
          </OnboardingGuard>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
        <Toaster position="top-right" />
      </Router>
    </AppProvider>
  );
}

export default App;
