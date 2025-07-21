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

### `EventDescriptionSheet`

A full-screen description editor component:

- Full-screen textarea for detailed event descriptions
- Fixed bottom action buttons (Save/Cancel)
- Placeholder text with helpful guidance
- Local state management with save/cancel functionality
- Ready for future markdown integration

### `DescriptionButton`

A button component that displays the current description status:

- Shows "Add Description" when empty
- Displays preview of existing description (first 50 characters)
- Color-coded status (filled vs empty)
- Opens the description sheet when pressed

### `EventTicketingSheet`

A comprehensive ticketing management component:

- Create multiple ticket types with different configurations
- Each ticket includes: name, price type (free/paid), description, and supply
- Dynamic price field for paid tickets
- Add/remove ticket types with intuitive UI
- Form validation ensures required fields are filled
- Scrollable content for multiple tickets
- Local state management with save/cancel functionality

### `TicketingButton`

A button component that displays the current ticketing status:

- Shows ticket count and pricing summary
- Displays "Free", "From $X.XX", or "Free & Paid" based on ticket types
- Color-coded status (configured vs default)
- Opens the ticketing sheet when pressed

## Usage

```tsx
import { CreateEventForm, EventLocationSheet, LocationButton, EventDescriptionSheet, DescriptionButton, EventTicketingSheet, TicketingButton } from './ui';

// In your screen component
<CreateEventForm
  onSubmit={handleSubmit}
  isLoading={isLoading}
  theme={theme}
  onThemeChange={setTheme}
  showThemeSheet={showThemeSheet}
  onShowThemeSheetChange={setShowThemeSheet}
/>

// Or use components individually
<LocationButton location={location} onPress={() => setShowLocationSheet(true)} />
<EventLocationSheet
  open={showLocationSheet}
  onOpenChange={setShowLocationSheet}
  location={location}
  onLocationChange={setLocation}
/>

<DescriptionButton description={description} onPress={() => setShowDescriptionSheet(true)} />
<EventDescriptionSheet
  open={showDescriptionSheet}
  onOpenChange={setShowDescriptionSheet}
  description={description}
  onDescriptionChange={setDescription}
/>

<TicketingButton tickets={tickets} onPress={() => setShowTicketingSheet(true)} />
<EventTicketingSheet
  open={showTicketingSheet}
  onOpenChange={setShowTicketingSheet}
  tickets={tickets}
  onTicketsChange={setTickets}
/>
```

## Architecture

- **Smart Component**: `create-event-screen.tsx` - Handles state and business logic
- **UI Components**: Located in `ui/` folder - Pure presentation components
- **Props Interface**: Each component has a clear interface for data and callbacks
- **Flexibility**: Components accept optional props with sensible defaults
