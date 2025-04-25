import { useCallback } from 'react';

interface AnnounceOptions {
  politeness?: 'polite' | 'assertive';
  timeout?: number;
}

export const useAnnouncement = () => {
  const announce = useCallback((message: string, options: AnnounceOptions = {}) => {
    const { politeness = 'polite', timeout = 1000 } = options;

    // Create or find the live region
    let liveRegion = document.getElementById(`live-region-${politeness}`);
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = `live-region-${politeness}`;
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('aria-live', politeness);
      liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(liveRegion);
    }

    // Clear any existing content
    liveRegion.textContent = '';

    // Add new content after a brief delay to ensure screen readers detect the change
    setTimeout(() => {
      liveRegion!.textContent = message;
    }, 100);

    // Optionally clear the announcement after specified timeout
    if (timeout) {
      setTimeout(() => {
        liveRegion!.textContent = '';
      }, timeout);
    }
  }, []);

  return announce;
};