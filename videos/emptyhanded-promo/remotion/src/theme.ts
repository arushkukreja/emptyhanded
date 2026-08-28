import {Easing, interpolate} from 'remotion';

export const colors = {
  ink: '#0F172A',
  orange: '#F59E0B',
  parchment: '#F5F0E7',
  warmWhite: '#FFFEFC',
  mist: '#E7E1D8',
  slate: '#93A4BF',
};

export const ease = Easing.bezier(0.16, 1, 0.3, 1);

export const reveal = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

export const rail: React.CSSProperties = {
  fontFamily: 'Plus Jakarta Sans',
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
};

export const display: React.CSSProperties = {
  fontFamily: 'Fraunces',
  fontWeight: 400,
  letterSpacing: '-0.035em',
  lineHeight: 0.9,
};

export const body: React.CSSProperties = {
  fontFamily: 'Plus Jakarta Sans',
  fontWeight: 500,
};
