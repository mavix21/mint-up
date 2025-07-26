export interface ThemeOption {
  label: string;
  value: string;
  color: string;
}

/**
 * Get the available theme options for the app
 * @returns Array of ThemeOption objects
 */
export function getThemeOptions(): ThemeOption[] {
  return [
    { label: 'Default', value: '', color: '$color' },
    { label: 'Pink', value: 'pink', color: '$pink10' },
    { label: 'Purple', value: 'purple', color: '$purple10' },
    { label: 'Blue', value: 'blue', color: '$blue10' },
    { label: 'Green', value: 'green', color: '$green10' },
    { label: 'Yellow', value: 'yellow', color: '$yellow10' },
    { label: 'Orange', value: 'orange', color: '$orange10' },
    { label: 'Red', value: 'red', color: '$red10' },
  ];
}

/**
 * Get the color for a specific theme value
 * @param themeValue - The theme value to get color for
 * @param fallbackColor - Fallback color if theme not found
 * @returns The color string for the theme
 */
export function getThemeColor(
  themeValue: string | undefined,
  fallbackColor: string = '$color'
): string {
  const themeOptions = getThemeOptions();
  const theme = themeOptions.find((t) => t.value === themeValue);
  return theme?.color || fallbackColor;
}
