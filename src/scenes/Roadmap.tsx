import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, ramp} from '../anim';
import {Glow, Stage} from '../components/primitives';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Peta video: tiga bagian (prinsip dasar → implementasi dalam kimia → penerapan).
const sub = (v: string) => (
  <tspan baselineShift="sub" fontSize={17}>
    {v}
  </tspan>
);
const CARDS: {n: string; title: string; items: React.ReactNode[]; words: string[]; color: string; glow: 'cyan' | 'violet' | 'gold'; x: number}[] = [
  {
    n: '1',
    title: 'Prinsip dasar',
    items: ['orbital kelompok', <>BeH{sub('2')} (berilium hidrida)</>, <>CH{sub('4')} (metana)</>, <>H{sub('2')}O (air)</>],
    words: ['kelompok', 'berilium', 'metana', 'air'],
    color: C.cyan,
    glow: 'cyan',
    x: 420,
  },
  {
    n: '2',
    title: 'Implementasi dalam kimia',
    items: ['metode Hückel (elektron π)', 'butadiena', 'benzena', 'aromatisitas', 'warna'],
    words: ['Hückel', 'butadiena', 'benzena', 'aromatisitas', 'warna'],
    color: C.violet,
    glow: 'violet',
    x: 960,
  },
  {
    n: '3',
    title: 'Penerapan',
    items: ['logam & CO (karbonil logam)', 'desain katalis', 'elektronika organik'],
    words: ['logam', 'katalis', 'elektronika'],
    color: C.amber,
    glow: 'gold',
    x: 1500,
  },
];
const Y = 570;
const CW = 480;
const CH = 420;

const Icon: React.FC<{i: number; x: number; y: number; t: number}> = ({i, x, y, t}) => {
  if (i === 0) {
    // atom pusat + empat orbital 1s berfase (orbital kelompok) yang berputar pelan
    const rot = t * 0.5;
    return (
      <g>
        <circle cx={x} cy={y} r={58} fill="none" stroke={C.cyan} strokeOpacity={0.35} strokeWidth={2} strokeDasharray="5 6" strokeDashoffset={-t * 10} />
        {[0, 1, 2, 3].map((k) => {
          const a = rot + (k * Math.PI) / 2 + Math.PI / 4;
          const col = k % 2 ? C.violet : C.gold;
          return <circle key={k} cx={x + 40 * Math.cos(a)} cy={y + 40 * Math.sin(a)} r={14 + 1.5 * Math.sin(t * 2.4 + k)} fill={col} fillOpacity={0.45} stroke={col} strokeWidth={2.5} />;
        })}
        <circle cx={x} cy={y} r={15} fill="#59627a" stroke="#9aa6c4" strokeWidth={2} />
      </g>
    );
  }
  if (i === 1) {
    // benzena dengan cincin π yang beredar
    const pts = Array.from({length: 6}, (_, k) => {
      const a = -Math.PI / 2 + (k * Math.PI) / 3;
      return `${(x + 46 * Math.cos(a)).toFixed(1)},${(y + 46 * Math.sin(a)).toFixed(1)}`;
    });
    return (
      <g>
        <path d={`M${pts.join(' L')} Z`} fill="none" stroke={C.ink} strokeWidth={3.5} strokeLinejoin="round" />
        <circle cx={x} cy={y} r={27} fill="none" stroke={C.amber} strokeWidth={3} strokeDasharray="10 7" strokeDashoffset={-t * 18} />
        {[0, 1, 2, 3, 4, 5].map((k) => {
          const a = t * 1.2 + (k * Math.PI) / 3;
          return <circle key={k} cx={x + 27 * Math.cos(a)} cy={y + 27 * Math.sin(a)} r={3.5} fill={C.amber} opacity={0.5 + 0.5 * Math.sin(t * 3 + k)} />;
        })}
      </g>
    );
  }
  // logam–C≡O: donasi σ dan donasi balik π
  const ph = (t * 0.8) % 2;
  return (
    <g>
      <circle cx={x - 58} cy={y} r={20} fill="#7c8db8" stroke="#c4d0ee" strokeWidth={2} />
      <line x1={x - 38} y1={y} x2={x - 6} y2={y} stroke="#8b97b8" strokeWidth={5} />
      {[-6, 0, 6].map((o) => (
        <line key={o} x1={x + 12} y1={y + o} x2={x + 42} y2={y + o} stroke="#8b97b8" strokeWidth={3} />
      ))}
      <circle cx={x + 2} cy={y} r={14} fill="#59627a" />
      <circle cx={x + 52} cy={y} r={15} fill="#ff4d63" />
      <path d={`M${x - 4},${y - 22} Q${x - 26},${y - 48} ${x - 52},${y - 26}`} fill="none" stroke={C.cyan} strokeWidth={3} strokeDasharray="5 5" strokeDashoffset={-t * 16} opacity={0.4 + 0.6 * Math.max(0, Math.sin(ph * Math.PI))} />
      <path d={`M${x - 52},${y + 26} Q${x - 10},${y + 54} ${x + 30},${y + 26}`} fill="none" stroke={C.pink} strokeWidth={3} strokeDasharray="5 5" strokeDashoffset={-t * 16} opacity={0.4 + 0.6 * Math.max(0, -Math.sin(ph * Math.PI))} />
    </g>
  );
};

export const Roadmap: React.FC = () => {
  const {t, cue, wordOf} = useScene();
  const head = ramp(t, -0.2, 0.9);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', opacity: head, translate: `0px ${(1 - head) * 20}px`}}>
        <div style={{fontFamily: FONT.mono, fontSize: 22, letterSpacing: 6, color: C.gold}}>PETA PERJALANAN · PERTEMUAN 11</div>
        <div style={{fontFamily: FONT.sans, fontSize: 60, fontWeight: 700, color: C.ink, marginTop: 6}}>Orbital Molekul Poliatomik</div>
      </div>
      <Stage>
        {/* benang penghubung antarkartu */}
        {[0, 1].map((k) => {
          const p = ramp(t, cue(k + 2) - 0.5, cue(k + 2) + 0.4, EASE_IN_OUT);
          const x1 = CARDS[k].x + CW / 2 + 6;
          const x2 = CARDS[k + 1].x - CW / 2 - 6;
          return (
            <g key={k} opacity={ramp(t, cue(0) + 0.6, cue(0) + 1.4)}>
              <line x1={x1} y1={Y} x2={x2} y2={Y} stroke={C.faint} strokeWidth={3} strokeDasharray="5 6" strokeDashoffset={-t * 16} />
              <circle cx={x1 + (x2 - x1) * p} cy={Y} r={6} fill={C.gold} opacity={p * (1 - ramp(t, cue(k + 2) + 0.6, cue(k + 2) + 1.2))} />
            </g>
          );
        })}
        {CARDS.map((c, i) => {
          const p = ramp(t, cue(0) + 0.2 + i * 0.25, cue(0) + 1.0 + i * 0.25, BACK);
          const on = ramp(t, cue(i + 1) - 0.1, cue(i + 1) + 0.5);
          const off = i < 2 ? ramp(t, cue(i + 2) - 0.1, cue(i + 2) + 0.5, EASE_IN_OUT) : 0;
          const lit = on * (1 - off);
          const dim = 0.55 + 0.45 * Math.max(lit, 1 - ramp(t, cue(1) - 0.2, cue(1) + 0.4));
          const top = Y - CH / 2;
          const left = c.x - CW / 2;
          const float = 4 * Math.sin(t * 0.9 + i * 1.3);
          return (
            <g key={i} opacity={p * dim} transform={`translate(0 ${(1 - p) * 40 - 10 * lit + float})`}>
              <Glow x={c.x} y={Y} r={280} color={c.glow} opacity={0.2 * lit} />
              <rect x={left} y={top} width={CW} height={CH} rx={28} fill="rgba(12,18,40,0.85)" stroke={c.color} strokeOpacity={0.3 + 0.6 * lit} strokeWidth={2.5} />
              <text x={left + 36} y={top + 66} fontFamily={FONT.mono} fontSize={64} fontWeight={600} fill={c.color} dominantBaseline="central">
                {c.n}
              </text>
              <Icon i={i} x={left + CW - 100} y={top + 84} t={t} />
              <text x={left + 36} y={top + 160} fontFamily={FONT.sans} fontSize={31} fontWeight={700} fill={C.ink}>
                {c.title}
              </text>
              <rect x={left + 36} y={top + 182} width={(CW - 72) * on} height={2} fill={c.color} opacity={0.6} />
              {c.items.map((it, k) => {
                const w = ramp(t, wordOf(i + 1, c.words[k]) - 0.25, wordOf(i + 1, c.words[k]) + 0.35);
                const yy = top + 222 + k * 42;
                return (
                  <g key={k} opacity={0.35 + 0.65 * w}>
                    <circle cx={left + 46} cy={yy} r={5 + 2 * w} fill={c.color} />
                    <text x={left + 66} y={yy} dominantBaseline="central" fontFamily={FONT.sans} fontSize={25} fill={C.ink}>
                      {it}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </Stage>
    </AbsoluteFill>
  );
};
