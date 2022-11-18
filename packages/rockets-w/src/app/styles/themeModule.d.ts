import {
  Theme as MUITheme,
  ThemeOptions as MUIThemeOptions,
} from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Theme extends MUITheme {
    system: {
      drawerBg: string
      drawerButtonText: string
      drawerButtonBg: string
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions extends MUIThemeOptions {
    system?: {
      drawerBg?: string
      drawerButtonText?: string
      drawerButtonBg?: string
    }
  }
  export function createTheme(options?: ThemeOptions): Theme
}
