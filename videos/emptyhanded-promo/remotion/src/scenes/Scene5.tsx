import {AbsoluteFill, CanvasImage, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {SceneAudio} from '../SceneAudio';
import {body, colors, display, ease, rail, reveal} from '../theme';

const ActionButton: React.FC<{children: React.ReactNode; scale?: number; style?: React.CSSProperties}> = ({children, scale = 1, style}) => (
  <div style={{width: 520, height: 78, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.orange, color: colors.ink, ...rail, fontSize: 20, scale, ...style}}>{children}</div>
);

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const checkoutIn = reveal(frame, 2, 10);
  const checkoutVisible = frame < 50 ? checkoutIn : 0;
  const placePulse = interpolate(frame, [35, 38, 44], [1, 0.96, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const confirmation = frame >= 50 ? reveal(frame, 56, 69) : 0;
  const cursorVisible = frame >= 15 && frame < 48;
  const cursorX = interpolate(frame, [15, 30], [-420, 35], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const cursorY = interpolate(frame, [15, 30], [-88, 80], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

  return (
    <AbsoluteFill style={{backgroundColor: colors.parchment, color: colors.ink, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 150, top: 150, width: 1620, height: 760, padding: '78px 86px', backgroundColor: colors.warmWhite, border: `1px solid ${colors.mist}`, boxShadow: '0 26px 70px rgba(15,23,42,.12)', opacity: checkoutVisible, translate: `0 ${(1 - checkoutIn) * 18}px`}}>
        <div style={{...rail, fontSize: 20, color: '#B45309'}}>CHECKOUT</div>
        <div style={{...display, fontSize: 72, marginTop: 28}}>Review and place the order</div>
        <div style={{position: 'absolute', left: 86, top: 270, width: 930, height: 180, display: 'flex', alignItems: 'center', gap: 32, padding: 24, border: `1px solid ${colors.mist}`, backgroundColor: colors.parchment}}>
          <div style={{width: 132, height: 132, overflow: 'hidden', backgroundColor: '#fff', position: 'relative'}}>
            <CanvasImage src={staticFile('assets/snail-eye-cream.png')} style={{position: 'absolute', width: 100, height: 125, left: 16, top: 3, objectFit: 'contain'}} />
          </div>
          <div><div style={{...body, fontWeight: 700, fontSize: 28}}>Snail Mucin Eye Cream</div><div style={{...body, marginTop: 12, fontSize: 20, color: '#52627A'}}>Gift for Maya · Standard delivery</div></div>
        </div>
        <div style={{position: 'absolute', right: 88, top: 224, width: 440, padding: '28px 0', borderTop: `1px solid ${colors.mist}`, borderBottom: `1px solid ${colors.mist}`}}>
          <div style={{...rail, fontSize: 15, color: '#B45309'}}>DELIVER TO</div>
          <div style={{...body, marginTop: 22, fontWeight: 700, fontSize: 30}}>Maya Patel</div>
          <div style={{...body, marginTop: 12, fontSize: 19, color: '#64748B'}}>Arrives before September 1</div>
        </div>
        <ActionButton scale={placePulse} style={{position: 'absolute', right: 88, bottom: 78}}>PLACE ORDER</ActionButton>
      </div>

      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: confirmation, translate: `0 ${(1 - confirmation) * 20}px`}}>
        <div style={{width: 150, height: 150, marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `7px solid ${colors.orange}`, borderRadius: '50%', color: '#B45309', ...body, fontWeight: 700, fontSize: 76}}>✓</div>
        <div style={{...rail, fontSize: 20, color: '#B45309'}}>ORDER PLACED</div>
        <div style={{...display, fontSize: 108, marginTop: 28}}>Maya&apos;s gift is on the way.</div>
      </div>

      <div style={{position: 'absolute', left: 1380, top: 700, width: 38, height: 52, backgroundColor: colors.ink, clipPath: 'polygon(0 0, 100% 72%, 56% 76%, 40% 100%)', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.24))', opacity: cursorVisible ? 1 : 0, translate: `${cursorX}px ${cursorY}px`}} />
      <SceneAudio effects={[
        {file: 'click-soft.mp3', at: 1.18, volume: 0.22},
        {file: 'chime.mp3', at: 1.88, volume: 0.12},
      ]} />
    </AbsoluteFill>
  );
};
