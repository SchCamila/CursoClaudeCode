import { Composition } from 'remotion';
import { PersonalMdVideo, VIDEO_FPS, TOTAL_DURATION } from './PersonalMdVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PersonalMd"
      component={PersonalMdVideo}
      durationInFrames={TOTAL_DURATION}
      fps={VIDEO_FPS}
      width={1920}
      height={1080}
    />
  );
};
