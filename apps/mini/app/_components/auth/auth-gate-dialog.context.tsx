'use client';

import { createContext, use, useMemo, useState } from 'react';

import { AuthGateDialog } from './auth-gate-dialog';

const useAuthGateDialogMessages = () => {
  return useMemo(
    () =>
      ({
        default: {
          title: 'Create digital experiences ✨',
          description:
            'Join our community to create amazing events and build your digital experiences collection.',
        },
        profile: {
          title: 'Build your profile with Mint Up!',
          description: 'Join our community to create events and build your collection.',
        },
        createEvent: {
          title: 'Create digital experiences ✨',
          description:
            'Join our community to create amazing events and build your digital experiences collection.',
        },
      } as const),
    []
  );
};

type DialogKey = keyof ReturnType<typeof useAuthGateDialogMessages>;

interface OpenOptions {
  key?: DialogKey;
}

const AuthGateDialogContext = createContext<{
  open: (options?: OpenOptions) => void;
}>({
  open: () => {},
});

export function AuthGateDialogProvider({ children }: { children: React.ReactNode }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogKey, setDialogKey] = useState<DialogKey>('default');

  const dialogMessages = useAuthGateDialogMessages();

  const open = (options?: OpenOptions) => {
    setDialogKey(options?.key ?? 'default');
    setOpenDialog(true);
  };

  return (
    <AuthGateDialogContext.Provider value={{ open }}>
      {children}
      <AuthGateDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        title={dialogMessages[dialogKey].title}
        description={dialogMessages[dialogKey].description}
      />
    </AuthGateDialogContext.Provider>
  );
}

export const useAuthGateDialog = () => {
  const context = use(AuthGateDialogContext);

  if (!context) {
    throw new Error('useAuthGateDialog must be used within a AuthGateDialogProvider');
  }

  return context;
};
