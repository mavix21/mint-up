import { FocusScope } from '@tamagui/focus-scope';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Modal, PanResponder, Platform, type Animated } from 'react-native';
import {
  AnimatePresence,
  createStyledContext,
  Portal,
  PortalProps,
  Stack,
  StackProps,
  styled,
  TamaguiElement,
  useConfiguration,
  useControllableState,
  usePropsAndStyle,
  withStaticProperties,
  YStack,
} from 'tamagui';

export const DrawerContext = createStyledContext<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: () => {},
});

function SwipeDismissableComponent({
  onDismiss,
  children,
  dismissAfter = 80,
  ref,
  ...rest
}: StackProps & {
  onDismiss: () => void;
  children: any;
  dismissAfter?: number;
  ref?: TamaguiElement;
}) {
  const { animationDriver } = useConfiguration();

  if (!animationDriver) {
    throw new Error('Animation driver not found');
  }

  const { useAnimatedNumber, useAnimatedNumberStyle } = animationDriver;
  const AnimatedView = (animationDriver.View ?? Stack) as typeof Animated.View;
  const pan = useAnimatedNumber(0);
  const [props, style] = usePropsAndStyle(rest);
  const [dragStarted, setDragStarted] = useState(false);
  const dismissAfterRef = useRef(dismissAfter);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderMove: (_, gestureState) => {
        const { dx } = gestureState;
        if (dx < 0) {
          setDragStarted(true);
          pan.setValue(dx, { type: 'direct' });
        }
      },
      // eslint-disable-next-line node/handle-callback-err
      onPanResponderRelease: (e, gestureState) => {
        setDragStarted(false);
        if (gestureState.dx < -dismissAfterRef.current) {
          if (onDismiss) {
            onDismiss();
          }
        } else {
          pan.setValue(0, { type: 'spring', overshootClamping: true });
        }
      },
    })
  ).current;

  const panStyle = useAnimatedNumberStyle(pan, (val) => {
    'worklet';
    return {
      transform: [{ translateX: val }],
    };
  });

  return (
    <AnimatedView
      ref={ref}
      style={[
        panStyle,
        {
          height: '100%',
          ...(style as any),
          ...(dragStarted && { pointerEvents: 'none' }),
        },
      ]}
      {...(props as any)}
      {...panResponder.panHandlers}
    >
      {children}
    </AnimatedView>
  );
}

const DrawerFrame = styled(YStack, {
  variants: {
    unstyled: {
      false: {
        themeInverse: true,
        paddingVertical: '$2',
        tag: 'nav',
        width: 210,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '$background',
        x: 0,
        gap: '$4',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: false,
  },
});

type DrawerProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * When true, uses a portal to render at the very top of the root TamaguiProvider
   */
  portalToRoot?: boolean;
};

const Overlay = styled(YStack, {
  name: 'DrawerOverlay',
  context: DrawerContext,
  enterStyle: {
    opacity: 0,
  },
  exitStyle: {
    opacity: 0,
  },

  variants: {
    unstyled: {
      false: {
        fullscreen: true,
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100_000 - 1,
        pointerEvents: 'auto',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: false,
  },
});

const DrawerOverlay = Overlay.styleable((props, ref) => {
  const { setOpen } = DrawerContext.useStyledContext();
  return <Overlay ref={ref} onPress={() => setOpen(false)} {...props} />;
});

function DrawerSwipeable({
  ref,
  ...rest
}: Omit<React.ComponentProps<typeof SwipeDismissableComponent>, 'onDismiss'>) {
  const { setOpen, open: _open } = DrawerContext.useStyledContext();
  return (
    <SwipeDismissableComponent
      onDismiss={() => setOpen(false)}
      zIndex={1000_000_000}
      position="absolute"
      ref={ref}
      {...rest}
    />
  );
}

const DrawerContent = DrawerFrame.styleable((props, ref) => {
  const { children, ...rest } = props;

  return (
    <FocusScope trapped enabled loop>
      <DrawerFrame
        ref={ref}
        animation="medium"
        enterStyle={{ x: -(rest.width || rest.w || 210) }}
        exitStyle={{ x: -(rest.width || rest.w || 210) }}
        {...rest}
      >
        {children}
      </DrawerFrame>
    </FocusScope>
  );
});

const DrawerImpl = ({
  open = false,
  onOpenChange,
  children,
  portalToRoot,
  ...rest
}: DrawerProps & { children?: React.ReactNode }) => {
  const [_open, setOpen] = useControllableState({
    prop: open,
    defaultProp: false,
    onChange: onOpenChange,
  });

  const content = open && <>{children}</>;

  return (
    <DrawerContext.Provider open={_open} setOpen={setOpen}>
      <AnimatePresence>{_open && content}</AnimatePresence>
    </DrawerContext.Provider>
  );
};

const DrawerPortal = (props: PortalProps) => {
  return Platform.select({
    web: <Portal zIndex={100_000_000} {...props} />,
    native: (
      <Modal animationType="fade" transparent>
        {props.children}
      </Modal>
    ),
  });
};

export const Drawer = withStaticProperties(DrawerImpl, {
  Content: DrawerContent,
  Overlay: DrawerOverlay,
  Swipeable: DrawerSwipeable,
  Portal: DrawerPortal,
});
