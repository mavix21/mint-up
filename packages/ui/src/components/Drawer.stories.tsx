import { Meta, StoryObj } from '@storybook/react';

import { Drawer } from './Drawer';

const meta: Meta<typeof Drawer> = {
  title: 'ui/Drawer',
  parameters: { layout: 'centered' },
  component: Drawer,
};

type Story = StoryObj<typeof Drawer>;

export const Basic: Story = {
  args: {},
};

export default meta;
