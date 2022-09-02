import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 860, // default is 960 but we'd like annotation editor to appear as low as 860
      lg: 1280,
      xl: 1920,
    },
  },
  // props: {
  //   MuiButtonBase: {
  //     disableRipple: true
  //   },
  //   MuiButton: {
  //     disableElevation: true
  //   }
  // },
  palette: {
    primary: {
      main: '#0c7fff',
    },
    secondary: {
      main: '#c82c63'
    }
  },
  typography: {
    button: {
      textTransform: 'none'
    }
  }
  // overrides: {
  //   MuiDialogActions: {
  //     root: {
  //       padding: '1em',
  //       justifyContent: 'center'
  //     }
  //   },
  //   MuiButton: {
  //     root: {
  //       minWidth: 'none'
  //     }
  //   },
  //   MuiSelect: {
  //     root: {
  //       padding: 5,
  //       paddingLeft: 10
  //     }
  //   },
  //   MuiInput: {
  //     root: {
  //       border: '1px solid #eee',
  //       padding: '0.5em'
  //     },
  //     underline: {
  //       '&:hover::before': {
  //         border: '0 !important'
  //       },
  //       '&::before': {
  //         border: 0
  //       },
  //       '&::after': {
  //         border: 0
  //       }
  //     }
  //   }
  // }
})


export default theme;
