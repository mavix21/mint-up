import { View, styled, createStyledContext, withStaticProperties } from '@my/ui';

// Define the context for sharing timeline state
export const TimelineContext = createStyledContext({
  variant: 'default',
});

export const TimelineFrame = styled(View, {
  name: 'Timeline',
  context: TimelineContext,
  position: 'relative',
  marginBottom: '$4',
});

// Timeline content wrapper that automatically gets padding
export const TimelineContent = styled(View, {
  name: 'TimelineContent',
  context: TimelineContext,
  position: 'relative',
  paddingLeft: '$5',
});

export const TimelineLine = styled(View, {
  context: TimelineContext,
  position: 'absolute',
  bottom: 0,
  left: 4,
  top: 16,
  width: 0.5,
  backgroundColor: '$color8',
});

// Timeline dot that automatically styles based on timeline variant
export const TimelineDot = styled(View, {
  name: 'TimelineDot',
  context: TimelineContext,
  position: 'absolute',
  left: 0.5,
  top: 3,
  height: '$0.75',
  width: '$0.75',
  borderRadius: '$5',
  theme: 'green',
  backgroundColor: '$color8',
});

export const Timeline = withStaticProperties(TimelineFrame, {
  Content: TimelineContent,
  Dot: TimelineDot,
  Line: TimelineLine,
  Props: TimelineContext.Provider,
});
