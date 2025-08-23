import { ProfileScreen } from 'app/screens/profile/profile-screen';

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProfileScreen id={id} />;
}
