import {Audio} from '@remotion/media';
import {Sequence, staticFile, useVideoConfig} from 'remotion';

export const SceneAudio: React.FC<{
  voice?: string;
  effects?: Array<{file: string; at: number; volume?: number}>;
}> = ({voice, effects = []}) => {
  const {fps} = useVideoConfig();

  return (
    <>
      {voice ? <Audio src={staticFile(`audio/${voice}.wav`)} volume={0.95} /> : null}
      {effects.map((effect) => (
        <Sequence
          key={`${effect.file}-${effect.at}`}
          from={Math.round(effect.at * fps)}
          premountFor={fps}
        >
          <Audio src={staticFile(`sfx/${effect.file}`)} volume={() => effect.volume ?? 0.24} />
        </Sequence>
      ))}
    </>
  );
};
