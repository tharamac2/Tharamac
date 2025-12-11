import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color'; // ✅ FIXED: changed from 'react-native' to correct path

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
