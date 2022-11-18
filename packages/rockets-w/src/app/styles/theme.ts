import { createTheme } from "@concepta/react-material-ui/dist/styles";

export const themeLight = createTheme({
  system: {
    drawerBg: "#1F2937",
    drawerButtonText: "#D1D5DB",
    drawerButtonBg: "#111827",
  },
  palette: {
    primary: {
      main: "#2563EB",
      dark: "#1D4ED8",
    },
    background: {
      default: "#f9fafb",
    },
    text: {
      primary: "#374151",
      secondary: "#9CA3AF",
    },
  },
});

export const themeDark = createTheme({
  system: {
    drawerBg: "#1F2937",
    drawerButtonText: "#D1D5DB",
    drawerButtonBg: "#111827",
  },
  palette: {
    mode: "dark",
    text: {
      primary: "#c8cdd6",
      secondary: "#c2c6cc",
    },
  },
});
