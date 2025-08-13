import { ShareableEventDescriptionScreenScreen } from 'app/screens/shareable-event-description-screen/shareable-event-description-screen-screen';

export default async function ShareableEventDescriptionScreenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShareableEventDescriptionScreenScreen id={id} />;
}
