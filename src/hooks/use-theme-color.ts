import { useColorScheme } from "react-native";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: string
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme ?? "light"];

  if (colorFromProps) {
    return colorFromProps;
  }

  const Colors = {
    light: {
      text: "#000",
      background: "#fff",
    },
    dark: {
      text: "#fff",
      background: "#000",
    },
  };

  return Colors[theme ?? "light"][colorName];
}
