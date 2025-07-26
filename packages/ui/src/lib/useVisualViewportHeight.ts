import { useEffect, useState } from 'react';

import { isIos } from './devices';

export function useVisualViewportHeight() {
  const [visualViewportHeight, setVisualViewportHeight] = useState('100%');

  useEffect(() => {
    let initialHeight = '100%';

    if (typeof window !== 'undefined' && isIos() && window.visualViewport) {
      initialHeight = `${window.visualViewport.height}px`;

      const handleResize = () => {
        setVisualViewportHeight(`${window.visualViewport?.height}px`);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    setVisualViewportHeight(initialHeight);
  }, []);

  return visualViewportHeight;
}
