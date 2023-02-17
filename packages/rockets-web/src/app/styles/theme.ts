import createTheme from '@mui/material/styles/createTheme';

export const themeLight = createTheme({
  palette: {
    primary: {
      main: '#2563EB',
      dark: '#1D4ED8',
    },
    background: {
      default: '#f9fafb',
    },
    text: {
      primary: '#374151',
      secondary: '#9CA3AF',
    },
  },
});

export const customThemeDark = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'black',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent!important',
          backgroundImage: 'none!important',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'lightGray!important',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: 'white',
          backgroundColor: 'green',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          margin: '0px!important',
          backgroundColor: 'transparent!important',
        },
      },
    },
    MuiIcon: {
      styleOverrides: {
        root: {
          color: 'white!important',
          backgroundColor: 'white!important',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: 'white!important',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: 'white',
        },
      },
    },
  },
});

export const customthemelight = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: 'white',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          boxShadow: 'none',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'blue',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginBottom: '0px',
          marginTop: '0px',
          backgroundColor: 'white!important',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: 'white',
          backgroundColor: 'blue',
        },
      },
    },
    MuiIcon: {
      styleOverrides: {
        root: {
          display: 'none!important',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: 'black!important',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: 'white',
        },
      },
    },
  },
});

export const themeDark = createTheme({
  palette: {
    mode: 'dark',
    text: {
      primary: '#c8cdd6',
      secondary: '#c2c6cc',
    },
    background: {
      default: 'black',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'green',
        },
      },
    },
  },
});
