'use client';

import dynamic from 'next/dynamic';

import { FullPageSpinner } from '../_components/FullPageSpinner';

// note: dynamic import is required for components that use the Frame SDK
const AppComponent = dynamic(() => import('@/app/_components/App'), {
  ssr: false,
  loading: () => <FullPageSpinner />,
});

export default function App() {
  return <AppComponent />;
}
