import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SceneAudio} from '../SceneAudio';
import {body, colors, display, ease, rail, reveal} from '../theme';

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const mail = reveal(frame, 2, 14);
  const sender = reveal(frame, 20, 29);
  const subject = reveal(frame, 36, 51);
  const copy = reveal(frame, 56, 66);
  const cta = reveal(frame, 73, 85);
  const cursorMove = reveal(frame, 91, 102);
  const cursorX = interpolate(cursorMove, [0, 1], [400, 0], {easing: ease});
  const cursorY = interpolate(cursorMove, [0, 1], [120, 0], {easing: ease});
  const ctaPress = frame >= 104 && frame <= 111 ? interpolate(frame, [104, 107, 111], [1, .96, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  const ripple = frame >= 112 && frame <= 119;
  const rippleScale = ripple ? interpolate(frame, [112, 119], [0, 3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease}) : 0;
  const rippleOpacity = ripple ? interpolate(frame, [112, 113, 119], [0, .72, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;

  return (
    <AbsoluteFill style={{backgroundColor: colors.parchment, color: colors.ink, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 42%, rgba(245,158,11,.14), transparent 46%)'}} />
      <div style={{position: 'absolute', left: 270, top: 160, width: 1380, height: 760, overflow: 'hidden', backgroundColor: colors.warmWhite, border: `1px solid ${colors.mist}`, borderRadius: 30, boxShadow: '0 34px 90px rgba(15,23,42,.14)', opacity: mail, translate: `0 ${(1 - mail) * 24}px`}}>
        <div style={{height: 116, padding: '0 62px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${colors.mist}`, backgroundColor: '#FBF8F2'}}>
          <div style={{display: 'flex', alignItems: 'baseline'}}><span style={{...display, fontSize: 36}}>emptyhanded</span><span style={{width: 14, height: 14, marginLeft: 7, borderRadius: '50%', backgroundColor: colors.orange}} /></div>
          <div style={{...rail, fontSize: 14, color: '#5F6F85'}}>INBOX · 9:02 AM</div>
        </div>
        <div style={{padding: '58px 82px 64px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, opacity: sender, translate: `${(1 - sender) * -18}px 0`}}>
            <div style={{width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: colors.orange, ...display, fontSize: 32}}>e</div>
            <div><div style={{...body, fontWeight: 700, fontSize: 19}}>emptyhanded reminders</div><div style={{...body, marginTop: 5, fontSize: 14, color: '#5F6F85'}}>to Alex</div></div>
          </div>
          <div style={{...display, width: 1120, marginTop: 48, fontSize: 92, lineHeight: .98, opacity: subject, translate: `0 ${(1 - subject) * 20}px`}}><span style={{display: 'block'}}>Maya&apos;s birthday is in</span><span style={{display: 'block', marginTop: 6, color: '#D97706', fontStyle: 'italic'}}>7 days.</span></div>
          <div style={{...body, width: 950, marginTop: 34, fontSize: 25, lineHeight: 1.5, color: '#52627A', opacity: copy, translate: `0 ${(1 - copy) * 14}px`}}>You still have time to find something thoughtful—and skip the last-minute scramble.</div>
          <div style={{width: 430, height: 74, marginTop: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, backgroundColor: colors.ink, color: colors.warmWhite, borderRadius: 999, ...rail, fontSize: 17, opacity: cta, scale: (.96 + cta * .04) * ctaPress}}>SEE MAYA&apos;S GIFT PICKS <span style={{color: colors.orange, fontSize: 28}}>→</span></div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 530, top: 775, width: 74, height: 74, border: `4px solid ${colors.orange}`, borderRadius: '50%', opacity: rippleOpacity, scale: rippleScale}} />
      <div style={{position: 'absolute', left: 555, top: 790, width: 38, height: 52, backgroundColor: colors.ink, clipPath: 'polygon(0 0, 100% 72%, 56% 76%, 40% 100%)', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.24))', opacity: frame >= 87 && frame < 120 ? 1 : 0, translate: `${cursorX}px ${cursorY}px`}} />
      <SceneAudio effects={[
        {file: 'notification-chime.mp3', at: 0.12, volume: 0.14},
        {file: 'click-soft.mp3', at: 3.48, volume: 0.2},
      ]} />
    </AbsoluteFill>
  );
};
