import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, ramp} from '../anim';
import {Glow, Stage, Sub, Sup} from '../components/primitives';
import {POrb, Spin} from '../components/vbD';
import {wlColor} from '../components/viz';
import {Dot, Polyene} from '../components/poD';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 13: tujuh poin rangkuman dengan ikon bergerak; poin terakhir (kartu besar) = teaser simetri.
const COLX = [80, 990];
const CW = 850;
const ROWY = [272, 436, 600, 764];
const CH = 150;
const box = (i: number) =>
  i < 4 ? {x: COLX[0], y: ROWY[i], h: CH} : i < 6 ? {x: COLX[1], y: ROWY[i - 4], h: CH} : {x: COLX[1], y: (ROWY[2] + ROWY[3]) / 2, h: CH * 2 + 14};

const ROWS: {title: React.ReactNode; detail: React.ReactNode; col: string}[] = [
  {title: 'Orbital kelompok (SALC)', detail: 'dicocokkan dengan orbital atom pusat yang simetrinya sama', col: C.cyan},
  {
    title: 'Dua puncak metana',
    detail: (
      <>
        ≈ 14 eV (t<Sub>2</Sub>) dan ≈ 23 eV (a<Sub>1</Sub>) — sp<Sup>3</Sup> tetap sah
      </>
    ),
    col: C.gold,
  },
  {
    title: 'Metode Hückel',
    detail: (
      <>
        <i style={{fontFamily: FONT.serif}}>α</i> dan <i style={{fontFamily: FONT.serif}}>β</i> meramal energi π butadiena &amp; benzena
      </>
    ),
    col: C.amber,
  },
  {title: 'Aturan 4n + 2', detail: 'lingkaran Frost memisahkan aromatik dari antiaromatik', col: C.mint},
  {title: 'Konjugasi → warna', detail: 'rantai makin panjang, celah HOMO–LUMO makin kecil', col: C.pink},
  {title: 'Donasi & donasi balik', detail: 'ikatan logam–CO dan cara kerja katalis', col: C.blue},
  {title: 'Berikutnya: simetri', detail: 'kunci di balik semua pencocokan orbital — grup titik', col: C.violet},
];

const Icon: React.FC<{i: number; x: number; y: number; t: number}> = ({i, x, y, t}) => {
  if (i === 0) {
    // orbital p pusat + dua 1s luar dengan fase yang cocok
    const s = 0.5 + 0.5 * Math.sin(t * 2.4);
    return (
      <g>
        <POrb x={x} y={y} L={34} w={13} ang={90} />
        <circle cx={x + 52} cy={y} r={14 + 2 * s} fill={C.gold} opacity={0.75} />
        <circle cx={x - 52} cy={y} r={14 + 2 * s} fill={C.violet} opacity={0.75} />
        <circle cx={x} cy={y} r={60} fill="none" stroke={C.cyan} strokeWidth={2} strokeDasharray="5 7" opacity={0.3 + 0.4 * s} transform={`rotate(${t * 20} ${x} ${y})`} />
      </g>
    );
  }
  if (i === 1) {
    // PES metana: dua pita (t₂ ≈ 14 eV lebih besar, a₁ ≈ 23 eV)
    const sweep = ((t * 0.3) % 1 + 1) % 1;
    const pts: string[] = [];
    for (let k = 0; k <= 120; k++) {
      const E = 10 + (16 * k) / 120;
      const s = 0.95 * Math.exp(-(((E - 14) / 0.9) ** 2)) + 0.45 * Math.exp(-(((E - 23) / 0.7) ** 2));
      pts.push(`${(x - 60 + k).toFixed(1)},${(y + 40 - s * 78).toFixed(1)}`);
    }
    const hx = x - 60 + 120 * sweep;
    return (
      <g>
        <line x1={x - 64} y1={y + 40} x2={x + 64} y2={y + 40} stroke={C.muted} strokeWidth={2} />
        <path d={`M${pts.join(' L')}`} fill="none" stroke={C.gold} strokeWidth={3} strokeLinejoin="round" />
        <rect x={hx - 3} y={y - 44} width={6} height={84} fill={C.amber} opacity={0.3 * cyc(sweep)} />
        <text x={x - 30} y={y + 62} textAnchor="middle" fontFamily={FONT.mono} fontSize={16} fill={C.muted}>
          14
        </text>
        <text x={x + 45} y={y + 62} textAnchor="middle" fontFamily={FONT.mono} fontSize={16} fill={C.muted}>
          23
        </text>
      </g>
    );
  }
  if (i === 2) {
    // etilena: α + β (ikatan, bawah) & α − β (antiikatan, atas)
    const j = 2 * Math.sin(t * 3);
    return (
      <g>
        <line x1={x - 40} y1={y} x2={x + 40} y2={y} stroke={C.muted} strokeWidth={2} strokeDasharray="5 5" />
        <line x1={x - 30} y1={y - 38} x2={x + 30} y2={y - 38} stroke={C.red} strokeWidth={5} strokeLinecap="round" />
        <line x1={x - 30} y1={y + 38} x2={x + 30} y2={y + 38} stroke={C.cyan} strokeWidth={14} strokeOpacity={0.15 + 0.1 * Math.sin(t * 3)} strokeLinecap="round" />
        <line x1={x - 30} y1={y + 38} x2={x + 30} y2={y + 38} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" />
        <Spin x={x - 8} y={y + 22 + j} up len={26} width={3.5} />
        <Spin x={x + 8} y={y + 22 - j} up={false} len={26} width={3.5} />
        <text x={x + 46} y={y + 6} fontFamily={FONT.serif} fontStyle="italic" fontSize={22} fill={C.ink}>
          α
        </text>
        <text x={x + 38} y={y - 32} fontFamily={FONT.serif} fontStyle="italic" fontSize={18} fill={C.red}>
          α−β
        </text>
        <text x={x + 38} y={y + 50} fontFamily={FONT.serif} fontStyle="italic" fontSize={18} fill={C.cyan}>
          α+β
        </text>
      </g>
    );
  }
  if (i === 3) {
    // lingkaran Frost benzena: titik sudut bawah → tingkat; 6 e⁻ di 3 MO ikatan
    const R = 50;
    const ys = [1, 0.5, 0.5, -0.5, -0.5, -1].map((v) => y + R * v);
    const xs = [0, -0.866, 0.866, -0.866, 0.866, 0].map((v) => x + R * v);
    return (
      <g>
        <circle cx={x} cy={y} r={R} fill="none" stroke={C.muted} strokeWidth={2} opacity={0.6} />
        <polygon points={[0, 2, 4, 5, 3, 1].map((k) => `${xs[k]},${ys[k]}`).join(' ')} fill="none" stroke={C.mint} strokeWidth={2.5} opacity={0.7} />
        {xs.map((px, k) => (
          <line key={k} x1={px - 12} y1={ys[k]} x2={px + 12} y2={ys[k]} stroke={k < 3 ? C.cyan : C.red} strokeWidth={4} strokeLinecap="round" />
        ))}
        {[0, 1, 2].map((k) => (
          <g key={k} opacity={0.75 + 0.25 * Math.sin(t * 3 + k)}>
            <circle cx={xs[k] - 5} cy={ys[k] - 7} r={3.5} fill={C.cyan} />
            <circle cx={xs[k] + 5} cy={ys[k] - 7} r={3.5} fill={C.pink} />
          </g>
        ))}
      </g>
    );
  }
  if (i === 4) {
    // rantai terkonjugasi + cahaya warna jingga
    const ph = ((t * 0.5) % 1 + 1) % 1;
    return (
      <g>
        <circle cx={x} cy={y} r={56} fill={wlColor(600)} opacity={0.12 + 0.06 * Math.sin(t * 2)} />
        <Polyene x={x} y={y + 6} n={7} bond={22} t={t} cloud={0.8} />
        <path
          d={Array.from({length: 30}, (_, k) => `${k ? 'L' : 'M'}${(x - 40 + k * 2.8).toFixed(1)},${(y - 36 + 6 * Math.sin(k * 0.8 - t * 8)).toFixed(1)}`).join(' ')}
          fill="none"
          stroke={wlColor(450)}
          strokeWidth={3}
          opacity={cyc(ph)}
        />
      </g>
    );
  }
  if (i === 5) {
    // M–C≡O: donasi σ (CO → M) & donasi balik (M → π* CO)
    const ph = ((t * 0.6) % 1 + 1) % 1;
    return (
      <g>
        <circle cx={x - 40} cy={y} r={22} fill="url(#po-metal)" />
        <circle cx={x + 8} cy={y} r={15} fill="#59627a" />
        <circle cx={x + 44} cy={y} r={15} fill={C.red} />
        <line x1={x + 22} y1={y - 5} x2={x + 30} y2={y - 5} stroke="#c9d3f2" strokeWidth={3} />
        <line x1={x + 22} y1={y + 5} x2={x + 30} y2={y + 5} stroke="#c9d3f2" strokeWidth={3} />
        <path d={`M${x - 6},${y - 22} Q${x - 18},${y - 48} ${x - 34},${y - 24}`} fill="none" stroke={C.cyan} strokeWidth={2.5} opacity={0.7} />
        <path d={`M${x - 34},${y + 24} Q${x - 4},${y + 52} ${x + 26},${y + 22}`} fill="none" stroke={C.pink} strokeWidth={2.5} opacity={0.7} />
        <Dot x={x - 6 - 28 * ph} y={y - 22 - 18 * Math.sin(Math.PI * ph)} r={4} color={C.cyan} opacity={cyc(ph)} />
        <Dot x={x - 34 + 60 * ph} y={y + 24 + 20 * Math.sin(Math.PI * ph)} r={4} color={C.pink} opacity={cyc((ph + 0.5) % 1)} />
        <text x={x - 40} y={y + 6} textAnchor="middle" fontFamily={FONT.sans} fontWeight={700} fontSize={16} fill="#1d2440">
          M
        </text>
      </g>
    );
  }
  // i === 6: teaser simetri — molekul segitiga (NH₃ dari atas) + bidang cermin + sumbu putar C₃
  const rot = t * 0.5;
  const R = 70;
  const pts = [0, 1, 2].map((k) => [x + R * Math.cos(rot + (2 * Math.PI * k) / 3 - Math.PI / 2), y + R * Math.sin(rot + (2 * Math.PI * k) / 3 - Math.PI / 2)]);
  const mAng = rot - Math.PI / 2;
  const arc = (t * 0.9) % (2 * Math.PI);
  return (
    <g>
      <circle cx={x} cy={y} r={110} fill="url(#soft-violet)" opacity={0.35 + 0.1 * Math.sin(t * 2)} />
      {pts.map((p, k) => (
        <line key={k} x1={x} y1={y} x2={p[0]} y2={p[1]} stroke="#c9d3f2" strokeWidth={6} strokeLinecap="round" />
      ))}
      {pts.map((p, k) => (
        <g key={k}>
          <circle cx={p[0]} cy={p[1]} r={16} fill="#f2f5ff" />
        </g>
      ))}
      <circle cx={x} cy={y} r={22} fill={C.blue} />
      <line x1={x - 120 * Math.cos(mAng)} y1={y - 120 * Math.sin(mAng)} x2={x + 120 * Math.cos(mAng)} y2={y + 120 * Math.sin(mAng)} stroke={C.violet} strokeWidth={3} strokeDasharray="10 7" />
      <path
        d={`M${x + 98},${y} A98,98 0 0 1 ${x + 98 * Math.cos(0.4 + arc * 0.25)},${y + 98 * Math.sin(0.4 + arc * 0.25)}`}
        fill="none"
        stroke={C.gold}
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.8}
      />
      <text x={x + 112} y={y - 10} fontFamily={FONT.serif} fontStyle="italic" fontSize={26} fill={C.gold}>
        C₃
      </text>
      <text x={x - 132} y={y - 84} fontFamily={FONT.serif} fontStyle="italic" fontSize={26} fill={C.violet}>
        σ
        <tspan baselineShift="sub" fontSize={17}>
          v
        </tspan>
      </text>
    </g>
  );
};

export const Recap: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const intro = ramp(t, cue(0) - 0.4, cue(0) + 0.6);
  const at = [cue(1), cue(2), cue(3), cue(4), wordOf(4, 'panjang'), cue(5), wordOf(6, 'simetri')];
  const next = [...at.slice(1), dur + 9];
  const lit = at.map((a) => ramp(t, a - 0.3, a + 0.5, BACK));
  const cur = (i: number) => Math.min(1, ramp(t, at[i] - 0.3, at[i] + 0.4)) * (1 - 0.35 * ramp(t, next[i] - 0.3, next[i] + 0.4));
  const finale = ramp(t, at[6] - 0.3, at[6] + 0.6);
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <defs>
          <radialGradient id="po-metal" cx="36%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#f2f5ff" />
            <stop offset="35%" stopColor="#a9b4d4" />
            <stop offset="80%" stopColor="#5a6688" />
            <stop offset="100%" stopColor="#2a3150" />
          </radialGradient>
        </defs>
        <Glow x={960} y={540} r={760} color="cyan" opacity={0.05 + 0.03 * Math.sin(t)} />
        {ROWS.map((r, i) => {
          const b = box(i);
          const hot = cur(i);
          const big = i === 6;
          const ix = b.x + (big ? 160 : 100);
          return (
            <g key={i} opacity={intro * (0.12 + 0.88 * lit[i])}>
              <rect
                x={b.x}
                y={b.y - b.h / 2}
                width={CW}
                height={b.h}
                rx={22}
                fill="rgba(12,18,40,0.72)"
                stroke={r.col}
                strokeWidth={2.5}
                strokeOpacity={0.25 + 0.6 * hot + (big ? 0.3 * finale * (0.6 + 0.4 * Math.sin(t * 4)) : 0)}
              />
              <rect x={b.x} y={b.y - b.h / 2 + 22} width={6} height={b.h - 44} rx={3} fill={r.col} opacity={0.4 + 0.6 * hot} />
              {!big ? <circle cx={ix} cy={b.y} r={64} fill="rgba(6,10,24,0.8)" stroke={r.col} strokeOpacity={0.3 + 0.4 * hot} strokeWidth={2} /> : null}
              <g opacity={lit[i]}>
                <Icon i={i} x={ix} y={b.y} t={t} />
              </g>
            </g>
          );
        })}
      </Stage>
      {ROWS.map((r, i) => {
        const b = box(i);
        const big = i === 6;
        const left = b.x + (big ? 330 : 190);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left,
              top: b.y,
              width: CW - (left - b.x) - 26,
              transform: `translate(${(1 - lit[i]) * -24}px, -50%)`,
              opacity: lit[i] * intro * (0.6 + 0.4 * cur(i)),
            }}
          >
            <div style={{fontFamily: FONT.sans, fontSize: big ? 44 : 36, fontWeight: 700, color: r.col, lineHeight: 1.15}}>{r.title}</div>
            <div style={{fontFamily: FONT.sans, fontSize: big ? 32 : 28, color: C.ink, lineHeight: 1.28, marginTop: 6}}>{r.detail}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
