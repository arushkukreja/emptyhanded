import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {SceneAudio} from '../SceneAudio';
import {colors, display, rail, reveal} from '../theme';

const TypedSentence: React.FC<{
  frame: number;
  start: number;
  lead: string;
  emphasis: string;
  emphasisStyle?: React.CSSProperties;
}> = ({frame, start, lead, emphasis, emphasisStyle}) => {
  const count = Math.max(0, Math.min(lead.length + emphasis.length, frame - start + 1));
  const leadText = lead.slice(0, Math.min(lead.length, count));
  const emphasisText = emphasis.slice(0, Math.max(0, count - lead.length));

  return (
    <>
      <span style={{display: 'block', minHeight: 88, fontFamily: 'Plus Jakarta Sans', fontSize: 72, lineHeight: 1.08, letterSpacing: '-0.035em'}}>{leadText}</span>
      <span style={{...display, display: 'block', minHeight: 180, marginTop: 20, fontSize: 190, lineHeight: .9, fontStyle: 'italic', color: colors.orange, ...emphasisStyle}}>{emphasisText}</span>
    </>
  );
};

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const kicker = reveal(frame, 1, 7);
  const budgetVisible = frame >= 7 && frame < 52;
  const tasteVisible = frame >= 54 && frame < 122;
  const payoffVisible = frame >= 125;
  const sentenceStyle: React.CSSProperties = {position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center'};

  return (
    <AbsoluteFill style={{backgroundColor: colors.ink, color: colors.warmWhite, overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: 960, height: 960, right: -180, top: 40, background: 'radial-gradient(circle, rgba(245,158,11,.21), transparent 68%)'}} />
      <div style={{position: 'absolute', inset: 0, padding: '112px 160px 96px'}}>
        <div style={{...rail, fontSize: 21, color: colors.orange, opacity: kicker, translate: `${(1 - kicker) * -16}px 0`}}>A LITTLE CONTEXT GOES A LONG WAY</div>
        <div style={{width: 1600, height: 1, marginTop: 40, backgroundColor: 'rgba(255,255,255,.22)'}} />
        <div style={{position: 'relative', width: 1600, height: 790, overflow: 'hidden'}}>
          <div style={{...sentenceStyle, opacity: budgetVisible ? 1 : 0}}>
            <TypedSentence frame={frame} start={8} lead="Her gift budget is set to " emphasis="$50–100." />
          </div>
          <div style={{...sentenceStyle, opacity: tasteVisible ? 1 : 0}}>
            <TypedSentence frame={frame} start={56} lead="She loves " emphasis="skincare, slow mornings, cozy home finds, and books." emphasisStyle={{width: 1560, minHeight: 210, fontSize: 100, lineHeight: .95}} />
          </div>
          <div style={{...sentenceStyle, opacity: payoffVisible ? 1 : 0}}>
            <TypedSentence frame={frame} start={126} lead="So let’s find her " emphasis="something that feels personal." emphasisStyle={{width: 1560, minHeight: 240, fontSize: 132, lineHeight: .92}} />
          </div>
        </div>
      </div>
      <SceneAudio effects={[
        {file: 'typing-budget.wav', at: 0.25, volume: 0.18},
        {file: 'typing-tastes.wav', at: 1.84, volume: 0.16},
        {file: 'typing-payoff.wav', at: 4.18, volume: 0.18},
      ]} />
    </AbsoluteFill>
  );
};
