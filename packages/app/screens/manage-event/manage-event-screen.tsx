import { Text, YStack, Link, Button } from '@my/ui';
import { useParams } from 'solito/navigation';

export const ManageEventScreen = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <YStack minHeight={'100vh' as any} justifyContent="center" alignItems="center" gap="$4">
      <Text>ManageEventScreen {id}</Text>
      <Link href="/">
        <Button size="$2">Home</Button>
      </Link>
    </YStack>
  );
};
