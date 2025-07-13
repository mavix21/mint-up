import { SubmitButton, Theme, YStack } from '@my/ui';
import { formFields, SchemaForm } from 'app/utils/SchemaForm';
import { View } from 'tamagui';
import { z } from 'zod';

const CreateEventSchema = z.object({
  title: formFields.text.min(1).describe('Title // Title of your event'),
  description: formFields.textarea.describe('Description // Description of your event'),
  date: formFields.date.describe('Date // Date of your event'),
  time: formFields.time.describe('Time // Time of your event'),
  location: formFields.text.describe('Location // Location of your event'),
  imageUrl: formFields.image.describe('Image URL // Image URL of your event'),
});

export function CreateEventScreen() {
  console.log('CreateEventScreen');
  return (
    <View flex={1} py="$4" $sm={{ minWidth: '100%' }}>
      <SchemaForm
        schema={CreateEventSchema}
        onSubmit={(values) => {
          console.log(values);
        }}
        defaultValues={{
          title: '',
          description: '',
          location: '',
        }}
        props={{
          date: {
            size: '$20',
          },
        }}
        renderAfter={({ submit }) => (
          <Theme inverse>
            <SubmitButton onPress={() => submit()}>Create Event</SubmitButton>
          </Theme>
        )}
      >
        {(fields) => (
          <YStack gap="$2" py="$4" pb="$0" pt="$0" minWidth="100%" $gtSm={{ minWidth: 480 }}>
            {Object.values(fields)}
          </YStack>
        )}
      </SchemaForm>
    </View>
  );
}
