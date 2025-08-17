import type { Meta, StoryObj } from '@storybook/react';
import { YStack } from 'tamagui';
import { LiveIndicator } from './LiveIndicator';

const meta: Meta<typeof LiveIndicator> = {
  title: 'Components/LiveIndicator',
  component: LiveIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'outlined'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'medium',
    variant: 'default',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    variant: 'default',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    variant: 'default',
  },
};

export const Outlined: Story = {
  args: {
    size: 'medium',
    variant: 'outlined',
  },
};

export const AllVariants: Story = {
  render: () => (
    <YStack gap="$4" alignItems="center">
      <LiveIndicator size="small" variant="default" />
      <LiveIndicator size="medium" variant="default" />
      <LiveIndicator size="large" variant="default" />
      <LiveIndicator size="medium" variant="outlined" />
    </YStack>
  ),
};
