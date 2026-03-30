import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import PlansPage from './pages/PlansPage';
import CommunityPage from './pages/CommunityPage';
import JournalPage from './pages/JournalPage';
import BottomNav from './components/BottomNav';
import SplashScreen from './components/SplashScreen';
import InstallPrompt from './components/InstallPrompt';

function AppContent() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState('home');
  const [showPrayer, setShowPrayer] = useState(false);

  if (loading) return <SplashScreen />;
  if (!user) return <LoginPage />;

  return (
    <AppProvider>
      <div className="min-h-[100dvh]">
        {tab === 'home' && <HomePage />}
        {tab === 'plans' && <PlansPage />}
        {tab === 'community' && <CommunityPage />}
        {tab === 'journal' && <JournalPage />}
        <BottomNav activeTab={tab} onTabChange={setTab} onPray={() => setTab('home')} />
        <InstallPrompt />
      </div>
    </AppProvider>
  );
}

export default function App() { return <AppContent />; }
