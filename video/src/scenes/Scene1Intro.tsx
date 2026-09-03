import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { theme } from '../theme';
import { GlowBackground } from './GlowBackground';

const FULL_TEXT = 'personal.md';

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chars = Math.min(
    FULL_TEXT.length,
    Math.floor(interpolate(frame, [10, 45], [0, FULL_TEXT.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }))
  );
  const typed = FULL_TEXT.slice(0, chars);
  const cursorOn = Math.floor(frame / 8) % 2 === 0;

  const subtitleOpacity = spring({ frame: frame - 55, fps, config: { damping: 200 } });
  const subtitleY = interpolate(subtitleOpacity, [0, 1], [20, 0]);

  const badgeScale = spring({ frame: frame - 5, fps, config: { damping: 12, mass: 0.6 } });

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily }}>
      <GlowBackground />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            transform: `scale(${badgeScale})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 28,
          }}
        >
          <div
            style={{
              fontFamily: theme.mono,
              fontSize: 96,
              fontWeight: 700,
              color: theme.greenLight,
              textShadow: '0 0 40px rgba(123,224,123,0.45)',
              letterSpacing: '-0.02em',
            }}
          >
            {typed}
            <span style={{ opacity: cursorOn ? 1 : 0, color: theme.amber }}>|</span>
          </div>

          <div
            style={{
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
              fontSize: 34,
              color: theme.text,
              textAlign: 'center',
            }}
          >
            Sua memória pessoal dentro do{' '}
            <span style={{ color: theme.greenLight, fontWeight: 600 }}>Claude Code</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
