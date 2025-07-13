import { Sheet } from '@my/ui';
import { CreateEventScreen } from 'app/screens/create-event/create-event-screen';
import { memo, useState } from 'react';

interface CreateEventSheetWrapperProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CreateEventSheetWrapper({ open, setOpen }: CreateEventSheetWrapperProps) {
  const [position, setPosition] = useState(0);
  const snapPoints = [98, 50, 25];

  return (
    <Sheet
      dismissOnSnapToBottom
      modal
      open={open}
      onOpenChange={setOpen}
      position={position}
      onPositionChange={setPosition}
      zIndex={100_000}
      snapPoints={snapPoints}
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
      <Sheet.Frame alignItems="center" bg="$color2" pt="$4">
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
