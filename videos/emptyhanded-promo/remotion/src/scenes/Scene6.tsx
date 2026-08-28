import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {colors, display, rail, reveal} from '../theme';

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const lineOne = reveal(frame, 5, 18);
  const logo = reveal(frame, 24, 41);
  const lineTwo = reveal(frame, 47, 60);

  return (
    <AbsoluteFill style={{backgroundColor: colors.ink, color: colors.warmWhite, overflow: 'hidden', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 48%, rgba(180,83,9,.18), transparent 38%)'}} />
      <div aria-label="Never show up emptyhanded again." style={{position: 'relative', width: 1500, textAlign: 'center'}}>
        <div style={{...rail, fontWeight: 500, fontSize: 66, letterSpacing: '.04em', opacity: lineOne, translate: `0 ${(1 - lineOne) * 18}px`}}>Never show up</div>
        <div aria-label="emptyhanded." style={{margin: '34px 0 28px', display: 'flex', alignItems: 'baseline', justifyContent: 'center', ...display, fontSize: 216, lineHeight: .9, whiteSpace: 'nowrap', opacity: logo, scale: .92 + logo * .08}}>
          emptyhanded<span style={{display: 'inline-block', width: 82, height: 82, marginLeft: 24, borderRadius: '50%', backgroundColor: colors.orange}} />
        </div>
        <div style={{...rail, fontWeight: 500, fontSize: 66, letterSpacing: '.04em', opacity: lineTwo, translate: `0 ${(1 - lineTwo) * 18}px`}}>again.</div>
      </div>
    </AbsoluteFill>
  );
};
