import "styled-components/native";
import {defaultTheme} from "@theme/index";

declare module 'styled-components' {
  type ThemeType = typeof defaultTheme

  export interface DefaultTheme extends ThemeType {}
}