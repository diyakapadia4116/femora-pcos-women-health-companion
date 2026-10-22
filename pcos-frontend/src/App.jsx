import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AppHeader from './components/AppHeader';
import QuickLogModal from './components/QuickLogModal';
import Toast from './components/Toast';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CycleTrackerPage from './pages/CycleTrackerPage';
import SymptomTrackerPage from './pages/SymptomTrackerPage';
import LifestyleTrackerPage from './pages/LifestyleTrackerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import RiskAssessmentPage from './pages/RiskAssessmentPage';
import PersonalizedPathPage from './pages/PersonalizedPathPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

import { api } from './services/api';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('landing');
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  // Increment this to force DashboardPage to remount and re-fetch fresh data
  const [dashboardKey, setDashboardKey] = useState(0);

  useEffect(() => {
    // Check if user session exists in localStorage
    const savedUser = localStorage.getItem('pcos_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('pcos_user', JSON.stringify(userData));
    if (token) localStorage.setItem('pcos_token', token);
    setCurrentRoute('dashboard');
  };

  const handleLogout = () => {
    api.logout(); // clears token + drafts
    setUser(null);
    showToast('Logged out safely.');
    setCurrentRoute('landing');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // Determine whether to display the authenticated sidebar layout
  const isAppView = user && ![ 'landing', 'login', 'signup', 'about', 'contact' ].includes(currentRoute);

  // When navigating TO dashboard, bump the key so it fully re-mounts and re-fetches
  const navigateTo = (route) => {
    if (route === 'dashboard') setDashboardKey(k => k + 1);
    setCurrentRoute(route);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* Toast Alert Component */}
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        onLogSaved={() => {
          if (currentRoute === 'dashboard') {
            setDashboardKey(k => k + 1);
          }
        }}
        onShowToast={showToast}
      />

      {!isAppView ? (
        // Public / Marketing / Auth Layout
        <>
          <Navbar
            currentRoute={currentRoute}
            setCurrentRoute={setCurrentRoute}
            user={user}
            onLogout={handleLogout}
          />
          <main className="flex-grow">
            {currentRoute === 'landing' && (
              <LandingPage setCurrentRoute={setCurrentRoute} />
            )}
            {currentRoute === 'login' && (
              <LoginPage
                setCurrentRoute={setCurrentRoute}
                onLoginSuccess={handleLoginSuccess}
                onShowToast={showToast}
              />
            )}
            {currentRoute === 'signup' && (
              <SignupPage
                setCurrentRoute={setCurrentRoute}
                onLoginSuccess={handleLoginSuccess}
                onShowToast={showToast}
              />
            )}
            {currentRoute === 'about' && (
              <AboutPage setCurrentRoute={setCurrentRoute} />
            )}
            {currentRoute === 'contact' && (
              <ContactPage onShowToast={showToast} />
            )}
          </main>
        </>
      ) : (
        // Authenticated Dashboard & Module Layout (matching Prototype Pages 4-12)
        <div className="flex h-screen overflow-hidden">
          {/* Left Sidebar */}
          <Sidebar
            currentRoute={currentRoute}
            setCurrentRoute={navigateTo}
            onLogout={handleLogout}
            user={user}
          />

          {/* Right Main Panel with Top Header */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <AppHeader
              user={user}
              onOpenQuickLog={() => setIsQuickLogOpen(true)}
              phase="Follicular Phase (Day 14)"
            />

            <main className="flex-1 pb-16">
              {currentRoute === 'dashboard' && (
                <DashboardPage
                  key={dashboardKey}
                  user={user}
                  onOpenQuickLog={() => setIsQuickLogOpen(true)}
                  setCurrentRoute={navigateTo}
                  onShowToast={showToast}
                />
              )}
              {currentRoute === 'cycle' && (
                <CycleTrackerPage
                  onOpenQuickLog={() => setIsQuickLogOpen(true)}
                  onShowToast={showToast}
                />
              )}
              {currentRoute === 'symptoms' && (
                <SymptomTrackerPage
                  onShowToast={showToast}
                  setCurrentRoute={navigateTo}
                />
              )}
              {currentRoute === 'lifestyle' && (
                <LifestyleTrackerPage
                  onShowToast={showToast}
                />
              )}
              {currentRoute === 'analytics' && (
                <AnalyticsPage
                  onShowToast={showToast}
                />
              )}
              {currentRoute === 'risk' && (
                <RiskAssessmentPage
                  onShowToast={showToast}
                  setCurrentRoute={setCurrentRoute}
                />
              )}
              {currentRoute === 'personalized' && (
                <PersonalizedPathPage
                  user={user}
                  onShowToast={showToast}
                />
              )}
              {currentRoute === 'reports' && (
                <ReportsPage
                  user={user}
                  onShowToast={showToast}
                />
              )}
              {currentRoute === 'profile' && (
                <ProfilePage
                  user={user}
                  onUpdateUser={(updated) => {
                    const newUser = { ...user, ...updated };
                    setUser(newUser);
                    localStorage.setItem('pcos_user', JSON.stringify(newUser));
                  }}
                  onLogout={handleLogout}
                  onShowToast={showToast}
                />
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
