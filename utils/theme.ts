import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  palette: {
    primary: {
      light: '#F8F4FF',
      main: '#9276B5',
      dark: '#71579C',
    },
    secondary: {
      light: '#EB6658',
      main: '#908D93',
      dark: '#EB6658',
    },
    test: {
      main: '#ff0000',
    },
  },
  typography: {
    fontFamily: "'Epilogue', sans-serif",
    fontSize: 14,
    h1: {
      fontSize: '2.815rem',
      fontWeight: 800,
    },
    h2: {
      fontSize: '2.289rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.861rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.513rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.23rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '0.813rem',
      fontWeight: 300,
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.813rem',
      fontWeight: 400,
    },
  },
  overrides: {
    MuiOutlinedInput: {
      root: {
        borderRadius: '20px',
      },
    },
  },
});
