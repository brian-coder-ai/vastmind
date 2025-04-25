import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const useFocusManagement = (mainContentId: string = 'main-content') => {
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  const storeFocus = useCallback(() => {
    lastFocusedElement.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (lastFocusedElement.current) {
      lastFocusedElement.current.focus();
    }
  }, []);

  useEffect(() => {
    // Only manage focus on route changes
    if (location.pathname !== previousPath.current) {
      const mainContent = document.getElementById(mainContentId);
      if (mainContent) {
        // Set focus to main content area
        mainContent.focus();
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      previousPath.current = location.pathname;
    }
  }, [location, mainContentId]);

  const focusOnElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
    }
  };

  return { focusOnElement, storeFocus, restoreFocus };
};