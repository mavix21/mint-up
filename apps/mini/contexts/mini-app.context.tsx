import { useAddFrame, useMiniKit } from '@coinbase/onchainkit/minikit';
import { createContext, useCallback, useContext, useEffect } from 'react';

interface MiniAppContextType {
  isFrameReady: boolean;
  setFrameReady: () => void;
  addFrame: () => Promise<{ url: string; token: string } | null>;
}

const MiniAppContext = createContext<MiniAppContextType | undefined>(undefined);

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const addFrame = useAddFrame();

  const handleAddFrame = useCallback(async () => {
    try {
      const result = await addFrame();
      if (result) {
        return result;
      }

      return null;
    } catch (error) {
      console.error('[error] adding frame', error);
      return null;
    }
  }, [addFrame]);

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [isFrameReady, setFrameReady]);

  useEffect(() => {
    if (isFrameReady && !context?.client?.added) {
      handleAddFrame();
    }
  }, [isFrameReady, context?.client?.added, handleAddFrame]);

  return (
    <MiniAppContext.Provider value={{ isFrameReady, setFrameReady, addFrame: handleAddFrame }}>
      {children}
    </MiniAppContext.Provider>
  );
}

export function useMiniApp() {
  const context = useContext(MiniAppContext);
  if (!context) {
    throw new Error('useMiniApp must be used within a MiniAppProvider');
  }
  return context;
}
