import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import HowItWorks from './components/landing/HowItWorks';
import Dashboard from './components/landing/Dashboard';
import CallToAction from './components/landing/CallToAction';
import LoginPage from './pages/LoginPage';
import './App.css';
import MeetPage from './pages/MeetPage';

function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="meetbot-theme">
        <div className="min-h-screen bg-background text-foreground antialiased">
          <Header scrollY={scrollY} />
          <main className="overflow-hidden">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <Features />
                    <HowItWorks />
                    <Dashboard />
                    <CallToAction />
                  </>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/meet" element={<MeetPage></MeetPage>}></Route>
            </Routes>
          </main>
          <Footer />
        </div>
    </ThemeProvider>
  );
}

export default App;
