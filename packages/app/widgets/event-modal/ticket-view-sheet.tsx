import { FullscreenSpinner, Sheet } from '@my/ui';
import dynamic from 'next/dynamic';
import { memo } from 'react';

const NftTicket = dynamic(() => import('../../entities/nft-ticket/nft-ticket'), {
  loading: () => <FullscreenSpinner />,
  ssr: false,
});

export interface TicketViewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TicketViewSheet = ({ open, onOpenChange }: TicketViewSheetProps) => {
  // Reset local state when sheet opens
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
  };

  return (
    <Sheet
      open={open}
      forceRemoveScrollEnabled={open}
      onOpenChange={handleOpenChange}
      snapPoints={[90]}
      snapPointsMode="percent"
      zIndex={200_000}
      modal
      dismissOnOverlayPress
      dismissOnSnapToBottom
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        backgroundColor="$shadowColor"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame flex={1} width="100%" gap="$5">
        <Sheet.ScrollView>
          <NftTicket />
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};

export default memo(TicketViewSheet);
