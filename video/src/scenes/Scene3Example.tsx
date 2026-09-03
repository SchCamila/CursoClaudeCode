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

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '0 60px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', width: '100%' }}>
          <div
            style={{
              opacity: captionOpacity,
              fontSize: 34,
              fontWeight: 700,
              color: theme.text,
            }}
          >
            Escreva do seu jeito
          </div>

          <div
            style={{
              transform: `scale(${windowScale})`,
              width: '100%',
              maxWidth: 920,
              borderRadius: 14,
              overflow: 'hidden',
              border: `1px solid ${theme.border}`,
              boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                background: theme.bgAlt,
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: 6, background: '#e63946' }} />
              <div style={{ width: 12, height: 12, borderRadius: 6, background: theme.amber }} />
              <div style={{ width: 12, height: 12, borderRadius: 6, background: theme.greenLight }} />
              <div style={{ marginLeft: 14, color: theme.textMuted, fontFamily: theme.mono, fontSize: 16 }}>
                ~/.claude/personal.md
              </div>
            </div>

            <div style={{ background: theme.panel, padding: '26px 28px', minHeight: 290 }}>
              {LINES.map((line, i) => {
                const start = 8 + i * 9;
                const progress = interpolate(frame, [start, start + 6], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                });
                const chars = Math.floor(progress * line.text.length);

                return (
                  <div
                    key={line.text}
                    style={{
                      fontFamily: theme.mono,
                      fontSize: 21,
                      color: line.color,
                      lineHeight: 1.9,
                      minHeight: 21 * 1.9,
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
