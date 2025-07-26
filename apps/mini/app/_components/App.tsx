import { FullPageSpinner } from './FullPageSpinner';
import { Navigator } from './Navigator';

import { useMiniApp } from '@/contexts/mini-app.context';

export default function App() {
  const { isFrameReady } = useMiniApp();

  if (!isFrameReady) {
    return <FullPageSpinner />;
  }

  return <Navigator />;
}
