// [A2] Mapache Picks · tema "golpe nocturno": grafito, linterna ámbar, antifaz y cristal líquido.
import type { Theme } from '../index';
import { tokens } from './tokens';
import { MapacheLanding } from './Landing';

const theme: Theme = {
  id: 'mapache',
  tokens,
  Landing: MapacheLanding,
};

export default theme;
