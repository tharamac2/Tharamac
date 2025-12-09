import { useColorScheme } from "react-native";

type ColorName = "text" | "background";
type Theme = "light" | "dark";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorName
) {
  const theme: Theme = useColorScheme() as Theme;
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  const Colors: Record<Theme, Record<ColorName, string>> = {
    light: {
      text: "#000000",
      background: "#ffffff",
    },
    dark: {
      text: "#ffffff",
      background: "#000000",
    },
  };

  return Colors[theme][colorName];
}
