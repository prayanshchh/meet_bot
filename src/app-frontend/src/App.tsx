import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import HowItWorks from './components/landing/HowItWorks';
import Dashboard from './components/landing/Dashboard';
import CallToAction from './components/landing/CallToAction';
import LoginPage from './pages/LoginPage';
import MeetPage from './pages/MeetPage';
import DashboardPage from './pages/DashboardPage';
import MeetingDetailPage from './pages/MeetingDetailPage';
import { useAuth } from './hooks/useAuth';
import './App.css';

function AppContent() {
  const [scrollY, setScrollY] = useState(0);
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground antialiased flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased">
      <Header scrollY={scrollY} />
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <>
                  <Hero />
                  <Features />
                  <HowItWorks />
                  <Dashboard />
                  <CallToAction />
                </>
              )
            }
          />
          <Route 
            path="/login" 
            element={
              isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />
            } 
          />
          <Route 
            path="/meet" 
            element={
              isLoggedIn ? <MeetPage /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isLoggedIn ? <DashboardPage /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/meeting/:meetId" 
            element={
              isLoggedIn ? <MeetingDetailPage /> : <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="meetbot-theme">
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
