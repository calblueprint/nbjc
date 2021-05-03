import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { StylesProvider } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Provider } from 'next-auth/client';
import theme from 'utils/theme';
import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import toastStyles from '../styles/Toast.module.css';

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
      <Head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <CssBaseline />
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Provider session={pageProps.session}>
            <SnackbarProvider
              maxSnack={3}
              classes={{
                root: toastStyles.root,
                variantSuccess: toastStyles.success,
                variantError: toastStyles.error,
              }}
            >
              <Component {...pageProps} />
            </SnackbarProvider>
          </Provider>
        </ThemeProvider>
      </StylesProvider>
    </>
  );
};

export default MyApp;
