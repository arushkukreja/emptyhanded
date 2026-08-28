import {AbsoluteFill, CanvasImage, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {SceneAudio} from '../SceneAudio';
import {body, colors, display, ease, rail, reveal} from '../theme';

type CardProps = {
  opacity: number;
  x?: number;
  count: string;
  category: string;
  title: string;
  description: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  chooseOpacity?: number;
  chooseScale?: number;
  chosen?: boolean;
  chooseBackground?: string;
};

const RecommendationCard: React.FC<CardProps> = ({opacity, x = 0, count, category, title, description, image, imageWidth, imageHeight, chooseOpacity = 0, chooseScale = 1, chosen = false, chooseBackground = colors.orange}) => (
  <div style={{position: 'absolute', inset: 0, opacity, translate: `${x}px 0`}}>
    <div style={{position: 'absolute', left: 78, top: 90, width: 620, height: 560, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#F2EDE4', borderRadius: 24}}>
      <CanvasImage src={staticFile(image)} style={{width: imageWidth, height: imageHeight, objectFit: 'contain', filter: 'drop-shadow(0 18px 24px rgba(15,23,42,.16))'}} />
    </div>
    <div style={{position: 'absolute', left: 780, top: 118, width: 610}}>
      <div style={{...rail, fontSize: 15, color: '#64748B'}}>{count}</div>
      <div style={{...rail, marginTop: 48, fontSize: 18, color: '#B45309'}}>{category}</div>
      <div style={{...display, marginTop: 26, fontSize: 80, lineHeight: .96}}>{title}</div>
      <div style={{...body, width: 570, marginTop: 20, fontSize: 23, lineHeight: 1.45, color: '#52627A'}}>{description}</div>
      {count === '3 OF 3' ? (
        <div style={{position: 'relative', width: 500, height: 78, marginTop: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: chooseBackground, color: colors.ink, ...rail, fontSize: 18, opacity: chooseOpacity, scale: chooseScale}}>
          {chosen ? 'GIFT CHOSEN ✓' : 'CHOOSE THIS GIFT'}
        </div>
      ) : null}
    </div>
  </div>
);

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const shell = reveal(frame, 2, 14);
  const firstCursorX = interpolate(frame, [20, 30], [-250, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const firstCursorY = interpolate(frame, [20, 30], [150, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const choosing = reveal(frame, 132, 145);
  const cursorX = firstCursorX + interpolate(choosing, [0, 1], [0, -370], {easing: ease});
  const cursorY = firstCursorY + interpolate(choosing, [0, 1], [0, 175], {easing: ease});
  const firstPress = frame >= 34 && frame <= 41 ? interpolate(frame, [34, 37, 41], [1, .92, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  const secondPress = frame >= 79 && frame <= 86 ? interpolate(frame, [79, 82, 86], [1, .92, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  const nextScale = frame < 60 ? firstPress : secondPress;
  const firstRipple = frame >= 43 && frame <= 51;
  const secondRipple = frame >= 87 && frame <= 96;
  const rippleStart = firstRipple ? 43 : 87;
  const rippleScale = firstRipple || secondRipple ? interpolate(frame, [rippleStart, rippleStart + 8], [0, 3.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease}) : 0;
  const rippleOpacity = firstRipple || secondRipple ? interpolate(frame, [rippleStart, rippleStart + 1, rippleStart + 8], [0, .72, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  const card1 = frame < 53 ? 1 : interpolate(frame, [53, 58], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const card2 = frame < 60 ? 0 : frame < 97 ? reveal(frame, 60, 68) : interpolate(frame, [97, 102], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const card3 = reveal(frame, 104, 112);
  const nextOpacity = frame < 115 ? 1 : interpolate(frame, [115, 119], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const chooseOpacity = reveal(frame, 121, 129);
  const choosePress = frame >= 149 && frame <= 155 ? interpolate(frame, [149, 152, 155], [1, .96, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  const choiceRippleActive = frame >= 157 && frame <= 166;
  const choiceRippleScale = choiceRippleActive ? interpolate(frame, [157, 165], [0, 3.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease}) : 0;
  const choiceRippleOpacity = choiceRippleActive ? interpolate(frame, [157, 158, 165], [0, .72, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  const chosen = frame >= 167;
  const cursorOpacity = frame < 18 ? 0 : frame < 177 ? 1 : interpolate(frame, [177, 181], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: colors.parchment, color: colors.ink, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 190, top: 102, ...rail, fontSize: 21, color: '#B45309'}}>RECOMMENDED FOR MAYA</div>
      <div style={{position: 'absolute', left: 190, top: 168, width: 1540, height: 740, overflow: 'hidden', backgroundColor: colors.warmWhite, border: `1px solid ${colors.mist}`, borderRadius: 30, boxShadow: '0 30px 80px rgba(15,23,42,.13)', opacity: shell, translate: `0 ${(1 - shell) * 22}px`}}>
        <RecommendationCard opacity={card1} count="1 OF 3" category="BEAUTY PICK" title="Pout Preserve Lip Treatment" description="A small everyday luxury that feels useful and personal." image="assets/pout-preserve.jpg" imageWidth={500} imageHeight={500} />
        <RecommendationCard opacity={card2} x={(1 - card2) * 22} count="2 OF 3" category="BEAUTY TOOL" title="F4 Dual-Ended Face Brush" description="A polished upgrade for the beauty routine she already loves." image="assets/f4-brush.png" imageWidth={420} imageHeight={510} />
        <RecommendationCard opacity={card3} x={(1 - card3) * 22} count="3 OF 3" category="SKINCARE PICK" title="Snail Mucin Eye Cream" description="A gentle, thoughtful pick for Maya's slow-morning routine." image="assets/snail-eye-cream.png" imageWidth={400} imageHeight={510} chooseOpacity={chooseOpacity} chooseScale={choosePress} chosen={chosen} chooseBackground={chosen ? '#FEF3C7' : colors.orange} />
        <div style={{position: 'absolute', right: 70, top: 320, width: 82, height: 82, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: colors.orange, color: colors.ink, ...body, fontWeight: 700, fontSize: 36, boxShadow: '0 12px 28px rgba(180,83,9,.22)', scale: nextScale, opacity: nextOpacity}}>→</div>
      </div>
      <div style={{position: 'absolute', left: 1582, top: 491, width: 76, height: 76, border: `4px solid ${colors.orange}`, borderRadius: '50%', opacity: rippleOpacity, scale: rippleScale}} />
      <div style={{position: 'absolute', left: 1182, top: 669, width: 76, height: 76, border: `4px solid ${colors.orange}`, borderRadius: '50%', opacity: choiceRippleOpacity, scale: choiceRippleScale}} />
      <div style={{position: 'absolute', left: 1601, top: 505, width: 38, height: 52, backgroundColor: colors.ink, clipPath: 'polygon(0 0, 100% 72%, 56% 76%, 40% 100%)', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.24))', opacity: cursorOpacity, translate: `${cursorX}px ${cursorY}px`}} />
      <SceneAudio effects={[
        {file: 'click-soft.mp3', at: 1.14, volume: 0.18},
        {file: 'click-soft.mp3', at: 2.62, volume: 0.18},
        {file: 'click-soft.mp3', at: 4.96, volume: 0.22},
        {file: 'pop.mp3', at: 5.58, volume: 0.14},
      ]} />
    </AbsoluteFill>
  );
};
