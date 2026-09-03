import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { theme } from '../theme';
import { GlowBackground } from './GlowBackground';

export const Scene4Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const titleY = interpolate(titleProgress, [0, 1], [30, 0]);

  const pathOpacity = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const pathScale = spring({ frame: frame - 20, fps, config: { damping: 10, mass: 0.6 } });

  const taglineOpacity = spring({ frame: frame - 45, fps, config: { damping: 200 } });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily, opacity: fadeOut }}>
      <GlowBackground />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
          <div
            style={{
              opacity: titleProgress,
              transform: `translateY(${titleY}px)`,
              fontSize: 56,
              fontWeight: 700,
              color: theme.text,
              textAlign: 'center',
            }}
          >
            Crie o seu agora
          </div>

          <div
            style={{
              opacity: pathOpacity,
              transform: `scale(${pathScale})`,
              fontFamily: theme.mono,
              fontSize: 40,
              color: theme.greenLight,
              background: theme.panel,
              border: `1px solid ${theme.border}`,
              borderRadius: 10,
              padding: '18px 32px',
              boxShadow: '0 0 40px rgba(46,125,50,0.35)',
            }}
          >
            ~/.claude/personal.md
          </div>

          <div
            style={{
              opacity: taglineOpacity,
              fontSize: 30,
              color: theme.textMuted,
            }}
          >
            Claude Code, com a sua cara.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
