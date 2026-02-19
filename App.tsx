
import React, { useState, useEffect } from 'react';
import { User, TrainingLog } from './types';
import Login from './components/Login';
import AthleteDashboard from './components/AthleteDashboard';
import CoachDashboard from './components/CoachDashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Onboarding from './components/Onboarding';
import BadgesView from './components/BadgesView';
import HistoryView from './components/HistoryView';
import AnalyticsView from './components/AnalyticsView';
import { Zap } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [logs, setLogs] = useState<TrainingLog[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const savedUser = localStorage.getItem('sc_user');
    const savedLogs = localStorage.getItem('sc_logs');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('sc_user', JSON.stringify(user));
    if (user.role === 'ATHLETE' && !user.sportPreference) {
      setShowOnboarding(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sc_user');
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem('sc_user', JSON.stringify(updatedUser));
  };

  const handleUpgrade = () => {
    // In production, this redirects to the main website pricing page for Razorpay processing.
    // Here we simulate the redirect and then a successful return for demo purposes.
    if (confirm("Redirecting to sportsconnects.in/pricing to complete your PRO subscription via Razorpay. Proceed?")) {
      setTimeout(() => {
        handleUpdateUser({ subscriptionStatus: 'PRO' });
        alert('Payment Successful! Your account status has been updated to PRO via sportsconnects.in.');
      }, 1000);
    }
  };

  const addLog = (log: TrainingLog) => {
    const newLogs = [log, ...logs];
    setLogs(newLogs);
    localStorage.setItem('sc_logs', JSON.stringify(newLogs));
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  if (showOnboarding) {
    return <Onboarding onComplete={(sport) => {
      handleUpdateUser({ sportPreference: sport });
      setShowOnboarding(false);
    }} />;
  }

  const renderAthleteContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AthleteDashboard 
            user={currentUser} 
            logs={logs} 
            onAddLog={addLog}
            onUpgrade={handleUpgrade}
          />
        );
      case 'training':
        return <HistoryView logs={logs} />;
      case 'analytics':
        return <AnalyticsView logs={logs} user={currentUser} onUpgrade={handleUpgrade} />;
      case 'achievements':
        return <BadgesView user={currentUser} logs={logs} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold">Coming Soon</h3>
            <p className="text-sm">The {activeTab} feature is being optimized for performance.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        role={currentUser.role} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={currentUser} onUpgrade={handleUpgrade} />
        
        <main className="p-4 md:p-8 flex-1 overflow-y-auto">
          {currentUser.role === 'ATHLETE' ? (
            renderAthleteContent()
          ) : (
            <CoachDashboard 
              athleteLogs={logs} 
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
