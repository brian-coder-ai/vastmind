import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export const useKeyboardShortcuts = () => {
  const [showShortcutsGuide, setShowShortcutsGuide] = useState(false);
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'h':
          navigate('/');
          break;
        case 'b':
          navigate('/blog');
          break;
        case 'a':
          navigate('/about');
          break;
        case 't':
          toggleTheme();
          break;
        case '?':
          setShowShortcutsGuide(prev => !prev);
          break;
        case 'escape':
          setShowShortcutsGuide(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, toggleTheme]);

  return {
    showShortcutsGuide,
    setShowShortcutsGuide
  };
};