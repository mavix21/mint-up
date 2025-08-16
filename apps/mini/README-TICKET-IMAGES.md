# Ticket Image Generation for Open Graph

This feature generates dynamic Open Graph images for ticket registration pages using @vercel/og.

## How It Works

1. **API Route**: `/api/ticket-image/[id]` generates a 1200x630 PNG image
2. **Metadata Integration**: The `generateMetadata` function in `/registrations/[id]/page.tsx` uses this image
3. **Dynamic Content**: The image displays ticket information including:
   - Event name
   - Ticket type
   - Date and time
   - Location
   - Ticket holder name
   - Organizer name

## Features

- **Responsive Design**: Optimized for social media sharing (1200x630)
- **Beautiful UI**: Modern gradient backgrounds with glassmorphism effects
- **Dynamic Data**: Automatically pulls from the ticket registration data
- **Fallback Support**: Uses default image if ticket data is unavailable

## Technical Details

- **Framework**: Next.js 15 with App Router
- **Image Generation**: @vercel/og for server-side image rendering
- **Data Source**: Convex backend via `getRegistrationTicketByIdMetadata`
- **Styling**: CSS-in-JS with modern design patterns

## Usage

The images are automatically generated when:

1. A user visits a ticket registration page
2. Social media platforms crawl the page for Open Graph metadata
3. The page is shared on platforms like Twitter, Facebook, LinkedIn

## Customization

To modify the image design:

1. Edit `/api/ticket-image/[id]/route.tsx`
2. Adjust colors, fonts, and layout in the JSX styles
3. The image will automatically update for all tickets

## Dependencies

- `@vercel/og`: For image generation
- `@my/backend`: For data fetching
- Next.js 15: For API routes and metadata generation
