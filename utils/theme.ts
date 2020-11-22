import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  palette: {
    primary: {
      light: '#F8F4FF',
      main: '#9056EF',
      dark: '#71579C',
    },
    secondary: {
      light: '#EB6658',
      main: '#EB6658',
      dark: '#EB6658',
    },
    test: {
      main: '#ff0000',
    },
  },
  typography: {
    fontFamily: "'Montserrat', 'Helvetica', 'Arial', sans-serif",
    fontSize: 14,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 800,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 300,
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontWeight: 400,
    },
  },
});
