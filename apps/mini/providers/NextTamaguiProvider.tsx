'use client';

import '@tamagui/core/reset.css';
import '@tamagui/polyfill-dev';

import { config } from '@my/ui';
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme';
import { useServerInsertedHTML } from 'next/navigation';
import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { TamaguiProvider } from 'tamagui';

export const NextTamaguiProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useRootTheme();

  useServerInsertedHTML(() => {
    // @ts-ignore
    const rnwStyle = StyleSheet.getSheet();
    return (
      <>
        {/* Link your CSS output for optimized themes */}
        <link rel="stylesheet" href="/tamagui.css" />
        <style dangerouslySetInnerHTML={{ __html: rnwStyle.textContent }} id={rnwStyle.id} />
        <style
          dangerouslySetInnerHTML={{
            // the first time this runs you'll get the full CSS including all themes
            // after that, it will only return CSS generated since the last call
            __html: config.getNewCSS(),
          }}
        />

        <style
          dangerouslySetInnerHTML={{
            __html: config.getNewCSS({
              exclude: process.env.NODE_ENV === 'production' ? 'design-system' : null,
            }),
          }}
        />

        <script
          dangerouslySetInnerHTML={{
            // avoid flash of animated things on enter:
            __html: `document.documentElement.classList.add('t_unmounted')`,
          }}
        />
      </>
    );
  });

  return (
    <NextThemeProvider
      skipNextHead
      onChangeTheme={(next) => {
        setTheme(next as any);
      }}
    >
      <TamaguiProvider config={config} disableRootThemeClass defaultTheme={theme}>
        {children}
      </TamaguiProvider>
    </NextThemeProvider>
  );
};
