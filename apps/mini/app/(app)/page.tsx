'use client';

import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useEffect } from 'react';

import App from './app';
import { FullPageSpinner } from '../_components/FullPageSpinner';

export default function HomePage() {
  const { context, setFrameReady, isFrameReady } = useMiniKit();

  // The setFrameReady() function is called when your mini-app is ready to be shown
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady().then(() => console.log('Mini app loaded'));
    }
  }, [setFrameReady, isFrameReady]);
  console.log('HomePage');

  if (!isFrameReady) {
    return <FullPageSpinner />;
  }

  return <App />;
}
