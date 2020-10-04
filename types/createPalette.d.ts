// eslint-disable-next-line @typescript-eslint/no-unused-vars
import createPalette from '@material-ui/core/styles/createPalette';

declare module '@material-ui/core/styles/createPalette' {
  interface PaletteOptions {
    test?: PaletteColorOptions;
  }
}
