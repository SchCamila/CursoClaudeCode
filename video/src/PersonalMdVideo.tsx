import { Series, AbsoluteFill } from 'remotion';
import { Scene1Intro } from './scenes/Scene1Intro';
import { Scene2WhatIsIt } from './scenes/Scene2WhatIsIt';
import { Scene3Example } from './scenes/Scene3Example';
import { Scene4Cta } from './scenes/Scene4Cta';
import { theme } from './theme';

export const VIDEO_FPS = 30;

export const SCENE_DURATION = 150; // 5s per scene
export const SCENE_COUNT = 4;
export const TOTAL_DURATION = SCENE_DURATION * SCENE_COUNT;

export const PersonalMdVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATION}>
          <Scene1Intro />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATION}>
          <Scene2WhatIsIt />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATION}>
          <Scene3Example />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATION}>
          <Scene4Cta />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
