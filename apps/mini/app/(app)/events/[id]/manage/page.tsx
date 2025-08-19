import { ManageEventScreen } from 'app/screens/manage-event/manage-event-screen';

export default async function ManageEventScreenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ManageEventScreen id={id} />;
}
