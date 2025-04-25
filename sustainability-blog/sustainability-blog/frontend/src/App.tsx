import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { HelmetProvider, ProviderProps } from 'react-helmet-async';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import KeyboardShortcutsGuide from './components/KeyboardShortcutsGuide';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useFocusManagement } from './hooks/useFocusManagement';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Privacy from './pages/Privacy';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import PageTransition from './components/PageTransition';

const helmetContext: ProviderProps['context'] = {};

const AppContent = () => {
  const { showShortcutsGuide, setShowShortcutsGuide } = useKeyboardShortcuts();
  useFocusManagement();

  const handleSkipToContent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="App d-flex flex-column min-vh-100">
      <a 
        href="#main-content" 
        className="skip-to-main"
        onClick={handleSkipToContent}
        onKeyDown={(e) => e.key === 'Enter' && handleSkipToContent(e as any)}
      >
        Skip to main content
      </a>
      <Navigation />
      <main 
        id="main-content" 
        className="flex-grow-1" 
        tabIndex={-1}
        style={{ outline: 'none' }}
      >
        <ErrorBoundary>
          <Container>
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="*" element={
                  <div className="text-center py-5">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you are looking for does not exist.</p>
                  </div>
                } />
              </Routes>
            </PageTransition>
          </Container>
        </ErrorBoundary>
      </main>
      <Footer />
      <KeyboardShortcutsGuide
        show={showShortcutsGuide}
        onHide={() => setShowShortcutsGuide(false)}
      />
    </div>
  );
};

function App() {
  return (
    <HelmetProvider context={helmetContext}>
      <ThemeProvider>
        <ErrorBoundary>
          <Router>
            <AppContent />
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
