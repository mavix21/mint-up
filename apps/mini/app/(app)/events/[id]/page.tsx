'use client';

import { ShareableEventDescriptionScreenScreen } from 'app/screens/shareable-event-description-screen/shareable-event-description-screen-screen';
import { useParams } from 'solito/navigation';

export default function ShareableEventDescriptionScreenPage() {
  const { id } = useParams<{ id: string }>();
  return <ShareableEventDescriptionScreenScreen id={id} />;
}
