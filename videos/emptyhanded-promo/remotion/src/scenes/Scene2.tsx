import {AbsoluteFill, CanvasImage, staticFile, useCurrentFrame} from 'remotion';
import {SceneAudio} from '../SceneAudio';
import {colors, reveal} from '../theme';

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const screen = reveal(frame, 4, 22);
  const focus = reveal(frame, 30, 42);

  return (
    <AbsoluteFill style={{backgroundColor: colors.warmWhite, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 110, top: 62, width: 1700, height: 956, overflow: 'hidden', border: `1px solid ${colors.mist}`, boxShadow: '0 24px 70px rgba(15,23,42,.12)', opacity: screen, scale: 0.975 + screen * 0.025}}>
        <CanvasImage src={staticFile('assets/scroll-000.png')} style={{width: 1700, height: 956, objectFit: 'fill'}} />
      </div>
      <div style={{position: 'absolute', left: 346, top: 405, width: 1228, height: 398, border: `5px solid ${colors.orange}`, boxShadow: '0 0 0 999px rgba(15,23,42,.12)', opacity: focus}} />
      <SceneAudio effects={[{file: 'whoosh-short.mp3', at: 0.14, volume: 0.16}]} />
    </AbsoluteFill>
  );
};
