import { ShareableTicketViewScreen } from 'app/screens/shareable-ticket-view-screen/shareable-ticket-view-screen';

export default async function ShareableTicketViewScreenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShareableTicketViewScreen id={id} />;
}
