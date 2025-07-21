# Create Event UI Components

This directory contains the UI components for the create event screen. The components are designed to be reusable and follow a simple, flexible architecture.

## Components

### `CreateEventForm`

The main form component that contains all the event creation fields. It handles:

- Event image upload
- Theme selection
- Event name input
- Date and time selection
- Location and description
- Event options (tickets, approval, capacity)
- Form submission

### `ThemeSelector`

A theme selection component that allows users to choose the event theme. It includes:

- Theme button with color preview
- Bottom sheet with theme options
- Toggle group for theme selection

### `EventImage`

A reusable component for displaying and selecting event images. Features:

- Placeholder avatar
- Clickable card design
- Consistent styling

### `EventOptions`

A component that handles event configuration options:

- Ticket settings
- Approval requirements
- Capacity limits
- Interactive toggles and buttons

### `EventLocationSheet`

A comprehensive location selection component that supports both in-person and virtual events:

- Toggle between in-person and virtual event types
- Address input for in-person events
- Additional instructions field for in-person events
- URL input for virtual events
- Form validation and save/cancel functionality

### `LocationButton`

A button component that displays the current location status:

- Shows location type (in-person/virtual) with appropriate icons
- Displays address or URL preview
- Color-coded status (filled vs empty)
- Opens the location sheet when pressed

## Usage

```tsx
import { CreateEventForm, EventLocationSheet, LocationButton } from './ui';

// In your screen component
<CreateEventForm
  onSubmit={handleSubmit}
  isLoading={isLoading}
  theme={theme}
  onThemeChange={setTheme}
  showThemeSheet={showThemeSheet}
  onShowThemeSheetChange={setShowThemeSheet}
/>

// Or use location components individually
<LocationButton location={location} onPress={() => setShowLocationSheet(true)} />
<EventLocationSheet
  open={showLocationSheet}
  onOpenChange={setShowLocationSheet}
  location={location}
  onLocationChange={setLocation}
/>
```

## Architecture

- **Smart Component**: `create-event-screen.tsx` - Handles state and business logic
- **UI Components**: Located in `ui/` folder - Pure presentation components
- **Props Interface**: Each component has a clear interface for data and callbacks
- **Flexibility**: Components accept optional props with sensible defaults
