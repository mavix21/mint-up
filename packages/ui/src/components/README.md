# LiveIndicator Component

A Tamagui-based component that displays a live indicator with a pulsing dot animation and "LIVE" text.

## Features

- **Pulsing Animation**: The dot on the left has a smooth pulsing animation
- **Multiple Sizes**: Available in small, medium, and large sizes
- **Variants**: Default (filled) and outlined styles
- **Responsive**: Built with Tamagui for cross-platform compatibility
- **Accessible**: Proper ARIA labels and keyboard navigation support

## Usage

```tsx
import { LiveIndicator } from '@my/ui';

// Basic usage
<LiveIndicator />

// With custom size
<LiveIndicator size="large" />

// Outlined variant
<LiveIndicator variant="outlined" />

// All props
<LiveIndicator
  size="medium"
  variant="default"
/>
```

## Props

| Prop      | Type                             | Default     | Description               |
| --------- | -------------------------------- | ----------- | ------------------------- |
| `size`    | `'small' \| 'medium' \| 'large'` | `'medium'`  | The size of the indicator |
| `variant` | `'default' \| 'outlined'`        | `'default'` | The visual style variant  |

## Examples

### Default Live Indicator

```tsx
<LiveIndicator />
```

Displays a red background with white text and a pulsing white dot.

### Outlined Variant

```tsx
<LiveIndicator variant="outlined" />
```

Displays a transparent background with red border and red text.

### Different Sizes

```tsx
<YStack gap="$3">
  <LiveIndicator size="small" />
  <LiveIndicator size="medium" />
  <LiveIndicator size="large" />
</YStack>
```

## Implementation Details

The component uses:

- **Tamagui Chip**: As the base component for consistent styling
- **Keyframe Animations**: For the pulsing dot effect
- **Styled Components**: For custom styling and layout
- **Token System**: For consistent spacing and colors

## Customization

The component can be customized by modifying the Tamagui theme tokens:

- Colors: `$red9` for the background, `white` for text and dot
- Spacing: Uses Tamagui space tokens (`$2`, `$3`, `$4`)
- Border radius: `$4` for rounded corners
- Animation: 2-second infinite pulse with ease-in-out timing

## Accessibility

- Proper contrast ratios for text and background
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
