import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, mix, rand, ramp} from '../anim';
import {Glow, Stage} from '../components/primitives';
import {VbDefs} from '../components/vbA';
import {SpinUD} from '../components/grupA';
import {MoADefs, SpreadCloud} from '../components/moA';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

const Letters: React.FC<{text: string; t: number; start: number; step: number; style: React.CSSProperties}> = ({text, t, start, step, style}) => (
  <div style={{display: 'flex', justifyContent: 'center', ...style}}>
    {text.split('').map((ch, i) => {
      const p = ramp(t, start + i * step, start + i * step + 0.9);
      return (
        <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', opacity: p, translate: `0px ${(1 - p) * 40}px`, scale: String(0.92 + 0.08 * p)}}>
          {ch}
        </span>
      );
    })}
  </div>
);

// Rumus & simbol ikatan yang melayang samar di latar.
const sub = (s: number, v: string, col?: string) => (
  <tspan fontSize={s * 0.6} baselineShift="sub" fill={col}>
    {v}
  </tspan>
);
const sup = (s: number, v: string, col?: string) => (
  <tspan fontSize={s * 0.6} baselineShift="super" fill={col}>
    {v}
  </tspan>
);
const FLOATS: ((s: number) => React.ReactNode)[] = [
  () => <tspan fill={C.cyan}>σ</tspan>,
  (s) => (
    <>
      <tspan fill={C.pink}>π</tspan>
      {sup(s, '*', C.pink)}
    </>
  ),
  () => (
    <>
      <tspan fill={C.cyan}>↑</tspan>
      <tspan fill={C.cyan}>↑</tspan>
    </>
  ),
  (s) => (
    <>
      <tspan fill={C.ink}>O</tspan>
      {sub(s, '2')}
    </>
  ),
  () => <tspan fill={C.amber}>π</tspan>,
  (s) => (
    <>
      <tspan fill={C.red}>σ</tspan>
      {sup(s, '*', C.red)}
    </>
  ),
  (s) => (
    <>
      <tspan fill={C.violet}>ψ = c</tspan>
      {sub(s, 'A', C.violet)}
      <tspan fill={C.violet}>φ</tspan>
      {sub(s, 'A', C.violet)}
      <tspan fill={C.violet}> ± c</tspan>
      {sub(s, 'B', C.violet)}
      <tspan fill={C.violet}>φ</tspan>
      {sub(s, 'B', C.violet)}
    </>
  ),
  () => <tspan fill={C.gold}>HOMO</tspan>,
  () => <tspan fill={C.mint}>LUMO</tspan>,
  () => <tspan fill={C.gold}>orde ikatan = 2</tspan>,
  (s) => (
    <>
      <tspan fill={C.ink}>N</tspan>
      {sub(s, '2')}
    </>
  ),
];

// Diagram MO samar di latar: tingkat orbital atom kiri/kanan, MO di tengah, penghubung putus-putus.
const MO_LEVELS: {y: number; col: string; e: number}[] = [
  {y: 250, col: C.red, e: 0},
  {y: 330, col: C.pink, e: 1},
  {y: 610, col: C.amber, e: 2},
  {y: 690, col: C.cyan, e: 2},
];
const MoGhost: React.FC<{t: number; p: number}> = ({t, p}) => (
  <g opacity={p}>
    {[
      [340, 520],
      [1580, 520],
    ].map(([x, y], k) => (
      <g key={k}>
        <line x1={x - 90} y1={y} x2={x + 90} y2={y} stroke={C.blue} strokeWidth={5} strokeLinecap="round" />
        {MO_LEVELS.map((L, i) => (
          <line
            key={i}
            x1={k ? x - 90 : x + 90}
            y1={y}
            x2={k ? 1230 : 690}
            y2={L.y}
            stroke={C.muted}
            strokeWidth={2}
            strokeDasharray="8 10"
            strokeDashoffset={-t * 12}
            opacity={0.6}
          />
        ))}
      </g>
    ))}
    {MO_LEVELS.map((L, i) => (
      <g key={i}>
        <line x1={690} y1={L.y} x2={1230} y2={L.y} stroke={L.col} strokeWidth={5} strokeLinecap="round" />
        {L.e === 1
          ? [-1, 1].map((s) => <SpinUD key={s} x={960 + s * 150} y={L.y - 4 + 3 * Math.sin(t * 2.4 + s)} up len={50} width={4} />)
          : null}
      </g>
    ))}
  </g>
);

export const Title: React.FC = () => {
  const {t} = useScene();
  const bg = ramp(t, 0.1, 2.0, EASE_IN_OUT);
  const sub = ramp(t, 2.6, 3.6);
  const line = ramp(t, 1.8, 3.2, EASE_IN_OUT);
  const meet = ramp(t, 0.2, 4.0, EASE_IN_OUT);
  const flashP = ramp(t, 3.6, 5.2);
  return (
    <AbsoluteFill>
      <Stage>
        <VbDefs />
        <Glow x={960} y={470} r={640} color="gold" opacity={0.12 * bg} />
        <MoADefs />
        <MoGhost t={t} p={0.3 * bg} />
        {/* awan elektron yang menyebar ke seluruh molekul di belakang judul */}
        <g opacity={0.9 * bg}>
          <SpreadCloud cx={960} cy={470} half={mix(80, 240, meet)} t={t} spread={ramp(t, 0.6, 4.6, EASE_IN_OUT)} R={mix(120, 230, meet)} />
        </g>
        <circle cx={960} cy={470} r={420 * flashP + 80} fill="url(#vbA-flash)" opacity={0.35 * Math.max(0, 1 - Math.abs(t - 4.0) / 1.2) * bg} />
        {FLOATS.map((f, i) => {
          const x = 140 + ((rand(i * 3.3) * 1640 + t * (14 + rand(i) * 18)) % 1640);
          const y = 150 + rand(i * 5.1 + 2) * 680;
          const edge = Math.min(1, (x - 140) / 120, (1780 - x) / 120);
          const s = 40 + rand(i * 7.7) * 26;
          return (
            <text key={i} x={x} y={y} fontFamily={FONT.serif} fontSize={s} fill={C.ink} opacity={0.16 * bg * Math.max(0, edge)} textAnchor="middle">
              {f(s)}
            </text>
          );
        })}
      </Stage>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingBottom: 120}}>
        <Letters
          text="ORBITAL MILIK BERSAMA"
          t={t}
          start={0.6}
          step={0.05}
          style={{fontFamily: FONT.sans, fontWeight: 800, fontSize: 120, letterSpacing: 4, lineHeight: 1.08, color: C.gold, textShadow: '0 0 60px rgba(255,194,74,0.45)'}}
        />
        <div style={{width: 700 * line, height: 2, margin: '30px 0 24px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`}} />
        <div style={{fontFamily: FONT.sans, fontSize: 36, color: C.muted, letterSpacing: 1, opacity: sub, translate: `0px ${(1 - sub) * 16}px`}}>
          Kimia Kuantum · Orbital Molekul Poliatomik &amp; Hückel
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
