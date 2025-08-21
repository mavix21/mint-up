import { YGroup, Separator } from '@my/ui';
import { createEventFormOpts } from 'app/screens/create-event/model/shared-form';
import {
  LocationButton,
  DescriptionButton,
  EventLocationSheet,
  EventDescriptionSheet,
} from 'app/screens/create-event/ui';
import { withForm } from 'app/shared/lib/form';

interface LocationAndDescriptionFieldsProps {
  showLocationSheet: boolean;
  setShowLocationSheet: (open: boolean) => void;
  showDescriptionSheet: boolean;
  setShowDescriptionSheet: (open: boolean) => void;
}

export const LocationAndDescriptionFields = withForm({
  ...createEventFormOpts,
  props: {
    showLocationSheet: false,
    setShowLocationSheet: (_open: boolean) => {},
    showDescriptionSheet: false,
    setShowDescriptionSheet: (_open: boolean) => {},
  } as LocationAndDescriptionFieldsProps,
  render: function LocationAndDescriptionFields({
    form,
    showLocationSheet,
    setShowLocationSheet,
    showDescriptionSheet,
    setShowDescriptionSheet,
  }) {
    return (
      <>
        <YGroup
          backgroundColor="$color3"
          orientation="vertical"
          separator={<Separator />}
          borderRadius="$4"
        >
          <YGroup.Item>
            <form.AppField
              name="location"
              children={(field) => {
                return (
                  <LocationButton
                    location={field.state.value}
                    onPress={() => setShowLocationSheet(true)}
                  />
                );
              }}
            />
          </YGroup.Item>
          <YGroup.Item>
            <form.AppField
              name="description"
              children={(field) => {
                return (
                  <DescriptionButton
                    description={field.state.value}
                    onPress={() => setShowDescriptionSheet(true)}
                  />
                );
              }}
            />
          </YGroup.Item>
        </YGroup>

        <EventLocationSheet
          form={form}
          open={showLocationSheet}
          onOpenChange={setShowLocationSheet}
        />
        <EventDescriptionSheet
          form={form}
          open={showDescriptionSheet}
          onOpenChange={setShowDescriptionSheet}
        />
      </>
    );
  },
}) as typeof LocationAndDescriptionFields;
