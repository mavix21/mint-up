import { useAddFrame, useMiniKit } from '@coinbase/onchainkit/minikit';
import { api } from '@my/backend/_generated/api';
import { useMutation } from '@my/backend/react';
import { createContext, useCallback, useContext, useEffect } from 'react';

interface MiniAppContextType {
  isFrameReady: boolean;
  setFrameReady: () => void;
  addFrame: () => Promise<{ url: string; token: string } | null>;
  context: NonNullable<ReturnType<typeof useMiniKit>['context']> | undefined;
}

const MiniAppContext = createContext<MiniAppContextType | undefined>(undefined);

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const addFrame = useAddFrame();

  const storeToken = useMutation(api.notificationTokens.store);

  const handleAddFrame = useCallback(async () => {
    try {
      const result = await addFrame();
      if (result) {
        await storeToken({
          fid: context?.user.fid.toString() ?? '',
          notificationUrl: result.url,
          token: result.token,
        });
        console.log('¡Token y URL de notificación guardados en Convex!');

        return result;
      }

      return null;
    } catch (error) {
      console.error('[Error] adding frame', error);
      return null;
    }
  }, [addFrame, context?.user.fid, storeToken]);

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady({ disableNativeGestures: true });
    }
  }, [isFrameReady, setFrameReady]);

  useEffect(() => {
    if (isFrameReady && context && !context.client.added) {
      handleAddFrame();
    }
  }, [isFrameReady, context?.client?.added, handleAddFrame]);

  return (
    <MiniAppContext.Provider
      value={{
        isFrameReady,
        setFrameReady,
        addFrame: handleAddFrame,
        context: context ?? undefined,
      }}
    >
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
