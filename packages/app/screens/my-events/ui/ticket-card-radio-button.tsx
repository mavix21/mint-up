import { Card, Label, RadioGroup, SizableText, View } from '@my/ui';
import React from 'react';

type ItemProps = {
  id: string;
  label: string;
  description: string;
  setValue: (value: string) => void;
  uniqueId: string;
  selected: boolean;
};

export function TicketCardRadioButton({
  id,
  label,
  description,
  setValue,
  uniqueId,
  selected,
}: ItemProps) {
  return (
    <Card
      flexDirection="row"
      flexShrink={1}
      alignItems="flex-start"
      gap="$3"
      padding="$3"
      active={selected}
      onPress={() => setValue(id)}
      cursor="pointer"
    >
      <View onPress={(e) => e.stopPropagation()}>
        <RadioGroup.Item id={uniqueId + id} value={id}>
          <RadioGroup.Indicator />
        </RadioGroup.Item>
      </View>
      <View flexDirection="column" flexShrink={1}>
        <Label
          size="$4"
          lineHeight="$2"
          alignItems="flex-start"
          flexDirection="column"
          htmlFor={uniqueId + id}
          cursor="pointer"
        >
          {label}
        </Label>
        <SizableText flexShrink={1} size="$3" fontWeight="300" color="$gray9">
          {description}
        </SizableText>
      </View>
    </Card>
  );
}
