import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { theme } from '../theme';
import { GlowBackground } from './GlowBackground';

const POINTS = [
  { icon: '📄', text: 'Um arquivo Markdown, só seu' },
  { icon: '📁', text: 'Vive em ~/.claude/personal.md' },
  { icon: '🔄', text: 'Claude lê automaticamente em todo projeto' },
  { icon: '🎯', text: 'Guarda preferências, estilo e contexto pessoal' },
];

export const Scene2WhatIsIt: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = spring({ frame, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily }}>
      <GlowBackground />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 220,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 44, width: 1300 }}>
          <div
            style={{
              opacity: titleOpacity,
              fontSize: 52,
              fontWeight: 700,
              color: theme.text,
            }}
          >
            O que é o <span style={{ color: theme.greenLight }}>personal.md</span>?
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {POINTS.map((point, i) => {
              const start = 20 + i * 18;
              const progress = spring({
                frame: frame - start,
                fps,
                config: { damping: 16, mass: 0.6 },
              });
              const x = interpolate(progress, [0, 1], [-60, 0]);

              return (
                <div
                  key={point.text}
                  style={{
                    opacity: progress,
                    transform: `translateX(${x}px)`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 22,
                    background: theme.panel,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 12,
                    padding: '20px 28px',
                  }}
                >
                  <div style={{ fontSize: 40 }}>{point.icon}</div>
                  <div style={{ fontSize: 32, color: theme.text }}>{point.text}</div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
