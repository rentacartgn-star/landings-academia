// [A2] Tema Diamond · joyería nocturna (obsidiana, blanco diamante, hielo y CTA esmeralda).
import type { Theme } from '../index';
import { tokens } from './tokens';
import { DiamondLanding } from './Landing';

const theme: Theme = {
  id: 'diamond',
  tokens,
  Landing: DiamondLanding,
};

export default theme;
