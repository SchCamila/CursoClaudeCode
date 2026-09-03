import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { theme } from '../theme';

export const GlowBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 60) * 40;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(600px circle at ${50 + drift / 10}% 30%, rgba(46,125,50,0.25), transparent 60%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(126,224,126,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(126,224,126,0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          transform: `translateY(${drift}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
