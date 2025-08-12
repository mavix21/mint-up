# Ticket NFT 3D Component

A cross-platform 3D ticket NFT component that provides an immersive viewing experience for NFT tickets.

## Features

- **3D Effects**: Interactive 3D rotation and perspective effects
- **Three.js Integration**: Enhanced 3D rendering on web platforms
- **Cross-Platform**: Works on both web and React Native
- **Interactive**: Mouse/touch responsive with smooth animations
- **Customizable**: Configurable actions and styling

## Installation

The component automatically handles Three.js loading and will fall back to CSS-based 3D effects if Three.js is not available.

## Usage

### Basic Usage

```tsx
import { TicketNFT3D } from '@my/app/widgets/event-modal';

<TicketNFT3D
  nftURL="https://example.com/nft-image.jpg"
  title="Event NFT Ticket"
  onView={() => console.log('View NFT')}
  onDownload={() => console.log('Download NFT')}
  onShare={() => console.log('Share NFT')}
/>;
```

### Props

| Prop         | Type         | Required | Description                  |
| ------------ | ------------ | -------- | ---------------------------- |
| `nftURL`     | `string`     | Yes      | URL of the NFT image         |
| `title`      | `string`     | Yes      | Title/name of the NFT ticket |
| `onView`     | `() => void` | No       | Callback for view action     |
| `onDownload` | `() => void` | No       | Callback for download action |
| `onShare`    | `() => void` | No       | Callback for share action    |

### Platform-Specific Behavior

#### Web

- Uses Three.js for enhanced 3D rendering
- Mouse-responsive 3D rotation
- CSS transforms for smooth animations
- Glossy overlay effects

#### React Native

- Optimized for touch interactions
- Smooth scale animations
- Platform-specific shadows and elevation
- Touch feedback animations

## Examples

### Event Modal Integration

The component is already integrated into the EventModal component. Users can click the "View NFT Ticket" button to see their NFT in 3D.

### Standalone Demo

```tsx
import { TicketNFT3DDemo } from '@my/app/widgets/event-modal';

// Use the demo component to showcase the NFT viewer
<TicketNFT3DDemo />;
```

## Styling

The component uses Tamagui's design system and automatically adapts to the current theme. It supports:

- Theme-aware colors
- Responsive sizing
- Smooth animations
- Platform-specific shadows

## Performance

- Three.js is loaded dynamically only when needed
- Efficient rendering with requestAnimationFrame
- Memory cleanup on component unmount
- Fallback to CSS 3D when Three.js is unavailable

## Browser Support

- Modern browsers with WebGL support
- Graceful degradation for older browsers
- Mobile web optimization

## Dependencies

- `three`: For 3D rendering on web
- `@tamagui/lucide-icons`: For action icons
- `@my/ui`: For UI components and theming
