import { Sheet } from '@my/ui';
import { CreateEventScreen } from 'app/screens/create-event/create-event-screen';
import { memo } from 'react';

interface CreateEventSheetWrapperProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CreateEventSheetWrapper({ open, setOpen }: CreateEventSheetWrapperProps) {
  return (
    <Sheet
      dismissOnSnapToBottom
      disableDrag
      modal
      open={open}
      onOpenChange={setOpen}
      zIndex={100_000}
      snapPoints={[98, 50]}
      snapPointsMode="percent"
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        backgroundColor="$shadowColor"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle backgroundColor="$color2" />
      <Sheet.Frame alignItems="center" bg="$color2">
        <SheetContents />
      </Sheet.Frame>
    </Sheet>
  );
}

const SheetContents = memo(() => {
  return (
    <>
      <CreateEventScreen />
    </>
  );
});
