/** @type {import('next').NextConfig} */
const { withTamagui } = require('@tamagui/next-plugin');
const { join } = require('path');

const boolVals = {
  true: true,
  false: false,
};

const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ?? process.env.NODE_ENV === 'development';

const plugins = [
  withTamagui({
    themeBuilder: {
      input: '../../packages/ui/src/themes/theme.ts',
      output: '../../packages/ui/src/themes/theme-generated.ts',
    },
    appDir: true,
    config: '../../packages/ui/src/tamagui.config.ts',
    components: ['tamagui', '@my/ui'],
    importsWhitelist: ['constants.js', 'colors.js'],
    outputCSS: process.env.NODE_ENV === 'production' ? './public/tamagui.css' : null,
    logTimings: true,
    disableExtraction,
    shouldExtract: (path) => {
      if (path.includes(join('packages', 'app'))) {
        return true;
      }
    },
    disableThemesBundleOptimize: true,
    excludeReactNativeWebExports: ['Switch', 'ProgressBar', 'Picker', 'CheckBox', 'Touchable'],
  }),
  (nextConfig) => {
    return {
      webpack: (webpackConfig, options) => {
        webpackConfig.externals.push('pino-pretty', 'lokijs', 'encoding');

        webpackConfig.resolve.alias = {
          ...webpackConfig.resolve.alias,
          'react-native-svg': '@tamagui/react-native-svg',
        };
        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(webpackConfig, options);
        }
        return webpackConfig;
      },
    };
  },
];

module.exports = () => {
  /** @type {import('next').NextConfig} */
  let config = {
    images: {
      remotePatterns: [
        {
          hostname: 'ui-avatars.com',
        },
        {
          hostname: 'localhost',
        },
        {
          hostname: '192.168.0.23',
        },
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    },

    transpilePackages: [
      'solito',
      'react-native-web',
      'expo-linking',
      'expo-constants',
      'expo-modules-core',
      'expo-image-picker',
      'react-native-gesture-handler',
      'react-native-reanimated',
    ],

    experimental: {
      scrollRestoration: true,
      viewTransition: true,
      serverActions: {
        bodySizeLimit: '2mb',
      },
      // optimizeCss: true,
    },
    async redirects() {
      return [
        {
          source: '/',
          destination: '/my-events',
          permanent: true,
        },
      ];
    },
  };

  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    };
  }

  return {
    ...config,
    typescript: { ignoreBuildErrors: true },
    images: { unoptimized: true },
    output: 'standalone',
    experimental: config.experimental,
  };
};
