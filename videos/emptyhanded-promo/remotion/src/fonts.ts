import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

await Promise.all([
  loadFont({
    family: 'Fraunces',
    url: staticFile('fonts/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nib1603gg7S2nfgRYIcHhyjDg.ttf'),
    weight: '400',
  }),
  loadFont({
    family: 'Plus Jakarta Sans',
    url: staticFile('fonts/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_KUnNSg.ttf'),
    weight: '400',
  }),
]);
