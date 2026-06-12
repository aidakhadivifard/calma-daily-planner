import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider, useAppData } from './context/AppDataContext';
import { ThemeProvider } from './context/ThemeContext';
import BottomNav from './components/ui/BottomNav';
import Spinner from './components/ui/Spinner';

import WelcomePage from './pages/WelcomePage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import LibraryPage from './pages/LibraryPage';
import MyChildPage from './pages/MyChildPage';
import SettingsPage from './pages/SettingsPage';
import StoryGeneratingPage from './pages/StoryGeneratingPage';
import StoryDetailPage from './pages/StoryDetailPage';
import StoryPlayerPage from './pages/StoryPlayerPage';
import PaywallPage from './pages/PaywallPage';

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-night-900">
      <Spinner size={36} />
    </div>
  );
}

function RequireAuth({ children }) {
  const { user, initializing } = useAuth();
  if (initializing) return <FullScreenLoader />;
  if (!user) return <Navigate to="/welcome" replace />;
  return children;
}

function RequireChild({ children }) {
  const { hasChild, loading } = useAppData();
  if (loading) return <FullScreenLoader />;
  if (!hasChild) return <Navigate to="/onboarding" replace />;
  return children;
}

function RootRedirect() {
  const { user, initializing } = useAuth();
  const { hasChild, loading } = useAppData();

  if (initializing || (user && loading)) return <FullScreenLoader />;
  if (!user) return <Navigate to="/welcome" replace />;
  if (!hasChild) return <Navigate to="/onboarding" replace />;
  return <Navigate to="/app/home" replace />;
}

function AppShell() {
  return (
    <div className="pb-24">
      <Outlet />
      <BottomNav />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route
        path="/onboarding"
        element={
          <RequireAuth>
            <OnboardingPage />
          </RequireAuth>
        }
      />
      <Route
        path="/app"
        element={
          <RequireAuth>
            <RequireChild>
              <AppShell />
            </RequireChild>
          </RequireAuth>
        }
      >
        <Route path="home" element={<HomePage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="child" element={<MyChildPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route
        path="/generating"
        element={
          <RequireAuth>
            <StoryGeneratingPage />
          </RequireAuth>
        }
      />
      <Route
        path="/story/:storyId"
        element={
          <RequireAuth>
            <StoryDetailPage />
          </RequireAuth>
        }
      />
      <Route
        path="/story/:storyId/play"
        element={
          <RequireAuth>
            <StoryPlayerPage />
          </RequireAuth>
        }
      />
      <Route
        path="/paywall"
        element={
          <RequireAuth>
            <PaywallPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppDataProvider>
            <div className="relative mx-auto min-h-screen w-full max-w-md bg-night-900">
              <AppRoutes />
            </div>
          </AppDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
