'use client';

import {
  AnimatePresence,
  getVariableValue,
  Switch,
  useTheme,
  View,
  YStack,
  isWeb,
  useIsomorphicLayoutEffect,
} from '@my/ui';
import type { SizeTokens } from '@my/ui';
import { getSize } from '@tamagui/get-token';
import { MoonStar, Sun } from '@tamagui/lucide-icons';
import { useThemeSetting } from '@tamagui/next-theme';
import { useId, useState } from 'react';
import { Appearance } from 'react-native';

export function ThemeSwitch({ size = '$4' }: { size?: SizeTokens }) {
  const uniqueId = useId();
  const [checked, setChecked] = useState(false);

  // do not use this code. only use in showcase
  const { set, current } = useThemeSetting();

  useIsomorphicLayoutEffect(() => {
    setChecked(current === 'dark');
  }, [current]);

  const thumbSize = getVariableValue(getSize(size));

  const larger = thumbSize >= 64;

  const { color11 } = useTheme();

  const iconSize = thumbSize * 0.4;

  return (
    <Switch
      id={uniqueId + 'switch'}
      checked={checked}
      onCheckedChange={(checked) => {
        set(checked ? 'dark' : 'light');
        if (!isWeb) {
          setTimeout(() => {
            Appearance?.setColorScheme?.(checked ? 'dark' : 'light');
          }, 350);
        }
      }}
      size={size}
      backgroundColor="$background"
      jc="center"
      ai="center"
      cursor="pointer"
      borderWidth={2}
      borderColor="$colorTransparent"
      // shadowColor="$shadowColor"
      // shadowOffset={{
      //   width: 12,
      //   height: 12,
      // }}
      // shadowOpacity={0.2}
      // shadowRadius="$6"
    >
      {/* switch background */}
      {larger ? <SwitchBackground checked={checked} /> : null}
      <Switch.Thumb animation="medium" bg="$colorTransparent">
        <View
          shadowOpacity={0.5}
          shadowRadius="$4"
          shadowOffset={{
            width: '$4',
            height: 0,
          }}
          m={thumbSize >= 64 ? '$1.5' : '$1'}
          flex={1}
          overflow="hidden"
          br="$10"
          ai="center"
          jc="center"
          backgroundColor={color11}
          animation="200ms"
        >
          <AnimatePresence exitBeforeEnter custom={{ direction: -1 }}>
            <YStack
              pos="absolute"
              key="Sun"
              animation="medium"
              fullscreen
              w="100%"
              h="100%"
              ai="center"
              jc="center"
              o={checked ? 0 : 1}
              transform={[{ scale: !checked ? 1 : 0 }, { translateY: !checked ? 0 : thumbSize }]}
            >
              <Sun size={iconSize} fill="white" color="$color1" />
            </YStack>

            <YStack
              pos="absolute"
              animation="medium"
              key="moon"
              fullscreen
              ai="center"
              w="100%"
              h="100%"
              jc="center"
              transform={[
                { scale: checked ? 1 : 0 },
                { translateY: checked ? 0 : -thumbSize },
                { rotate: checked ? '0deg' : '-90deg' },
              ]}
            >
              <MoonStar color="white" fill="white" size={iconSize} />
            </YStack>
          </AnimatePresence>
        </View>
      </Switch.Thumb>
    </Switch>
  );
}

const SwitchBackground = ({ checked }: { checked: boolean }) => {
  return (
    <View
      key="background"
      w="50%"
      r={checked ? '50%' : 0}
      h="100%"
      jc="center"
      ai="center"
      animation="200ms"
      pos="absolute"
      top={0}
      bottom={0}
    >
      <View
        t="20%"
        animation="200ms"
        l={checked ? '55%' : 0}
        pos="absolute"
        bg="$color7"
        w={checked ? 4 : 30}
        h={checked ? 4 : 5}
        borderRadius="$10"
      />
      <View
        t={checked ? '33%' : '45%'}
        l="28%"
        animation="200ms"
        pos="absolute"
        bg="$color7"
        w={checked ? 3 : 22}
        h={checked ? 3 : 5}
        borderRadius="$10"
      />
      <View
        t="70%"
        l={checked ? '30%' : 0}
        animation="200ms"
        pos="absolute"
        bg="$color7"
        w={checked ? 4 : 15}
        h={checked ? 4 : 5}
        borderRadius="$10"
      />

      {checked ? (
        <>
          <View
            b="35%"
            r="35%"
            pos="absolute"
            bg="$color7"
            w={4}
            h={4}
            borderRadius="$10"
            animation="200ms"
          />
          <View
            t="50%"
            r="10%"
            pos="absolute"
            bg="$color7"
            w={3}
            h={3}
            borderRadius="$10"
            animation="200ms"
          />
        </>
      ) : null}
    </View>
  );
};

ThemeSwitch.title = 'Theme Switch';
