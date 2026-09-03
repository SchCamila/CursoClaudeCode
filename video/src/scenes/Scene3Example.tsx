import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { theme } from '../theme';
import { GlowBackground } from './GlowBackground';

type Line = { text: string; color: string };

const LINES: Line[] = [
  { text: '# Sobre mim', color: theme.greenLight },
  { text: '- Nome: Camila, Engenheira de Software', color: theme.text },
  { text: '- Gosto de respostas diretas e objetivas', color: theme.text },
  { text: '- Sempre commitar em português', color: theme.text },
  { text: '- Uso TypeScript e React no dia a dia', color: theme.text },
  { text: '- Prefiro testes antes de subir código', color: theme.text },
];

export const Scene3Example: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const windowScale = spring({ frame, fps, config: { damping: 14, mass: 0.7 } });
  const captionOpacity = spring({ frame: frame - 10, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily }}>
      <GlowBackground />

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center' }}>
          <div
            style={{
              opacity: captionOpacity,
              fontSize: 40,
              fontWeight: 700,
              color: theme.text,
            }}
          >
            Escreva do seu jeito
          </div>

          <div
            style={{
              transform: `scale(${windowScale})`,
              width: 1100,
              borderRadius: 14,
              overflow: 'hidden',
              border: `1px solid ${theme.border}`,
              boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                background: theme.bgAlt,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <div style={{ width: 14, height: 14, borderRadius: 7, background: '#e63946' }} />
              <div style={{ width: 14, height: 14, borderRadius: 7, background: theme.amber }} />
              <div style={{ width: 14, height: 14, borderRadius: 7, background: theme.greenLight }} />
              <div style={{ marginLeft: 16, color: theme.textMuted, fontFamily: theme.mono, fontSize: 20 }}>
                ~/.claude/personal.md
              </div>
            </div>

            <div style={{ background: theme.panel, padding: '32px 36px', minHeight: 340 }}>
              {LINES.map((line, i) => {
                const start = 18 + i * 14;
                const progress = interpolate(frame, [start, start + 8], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                });
                const chars = Math.floor(progress * line.text.length);

                return (
                  <div
                    key={line.text}
                    style={{
                      fontFamily: theme.mono,
                      fontSize: 26,
                      color: line.color,
                      lineHeight: 1.9,
                      minHeight: 26 * 1.9,
                    }}
                  >
                    {line.text.slice(0, chars)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
