import {AbsoluteFill, Composition, Folder, Sequence} from 'remotion';
import {Scene1} from './scenes/Scene1';
import {Scene2} from './scenes/Scene2';
import {Scene3} from './scenes/Scene3';
import {Scene4} from './scenes/Scene4';
import {Scene5} from './scenes/Scene5';
import {Scene6} from './scenes/Scene6';

export const EmptyHandedPromo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence name="01 · Seven days" durationInFrames={120} premountFor={30}><Scene1 /></Sequence>
      <Sequence name="02 · Already remembered" from={120} durationInFrames={150} premountFor={30}><Scene2 /></Sequence>
      <Sequence name="03 · Knows Maya" from={270} durationInFrames={180} premountFor={30}><Scene3 /></Sequence>
      <Sequence name="04 · Personal picks" from={450} durationInFrames={180} premountFor={30}><Scene4 /></Sequence>
      <Sequence name="05 · Handled" from={630} durationInFrames={120} premountFor={30}><Scene5 /></Sequence>
      <Sequence name="06 · Emptyhanded" from={750} durationInFrames={150} premountFor={30}><Scene6 /></Sequence>
    </AbsoluteFill>
  );
};

export const PromoCompositions: React.FC = () => (
  <>
    <Folder name="EmptyHanded-Scenes">
      <Composition id="EH-SevenDays" component={Scene1} durationInFrames={120} fps={30} width={1920} height={1080} />
      <Composition id="EH-AlreadyRemembered" component={Scene2} durationInFrames={150} fps={30} width={1920} height={1080} />
      <Composition id="EH-KnowsMaya" component={Scene3} durationInFrames={180} fps={30} width={1920} height={1080} />
      <Composition id="EH-PersonalPicks" component={Scene4} durationInFrames={180} fps={30} width={1920} height={1080} />
      <Composition id="EH-Handled" component={Scene5} durationInFrames={120} fps={30} width={1920} height={1080} />
      <Composition id="EH-BrandLockup" component={Scene6} durationInFrames={150} fps={30} width={1920} height={1080} />
    </Folder>
    <Composition id="EmptyHanded-Launch-Promo" component={EmptyHandedPromo} durationInFrames={900} fps={30} width={1920} height={1080} />
  </>
);
