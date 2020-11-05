import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { StylesProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Provider } from 'next-auth/client';
import theme from 'utils/theme';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    // Remove the server-side injected CSS
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <CssBaseline />
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Provider session={pageProps.session}>
            <Component {...pageProps} />
          </Provider>
        </ThemeProvider>
      </StylesProvider>
    </>
  );
};

export default MyApp;
