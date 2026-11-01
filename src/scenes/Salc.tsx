import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp} from '../anim';
import {Atom, Badge, DrawPath, Glow, Label, Stage} from '../components/primitives';
import {Check} from '../components/moB';
import {RichLabel} from '../components/vbD';
import {PhaseP, PhaseS, PoADefs, StepPill} from '../components/poA';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 1: orbital kelompok (SALC). Contoh skematis: atom pusat + empat 1s H di sudut persegi.
// (1) gabungkan 1s H menjadi orbital kelompok berpola fase; (2) cocokkan dengan s, p_x, p_y pusat;
// pola berselang tak punya pasangan → nonikatan.
const HPOS: [number, number][] = [
  [1, -1],
  [-1, -1],
  [-1, 1],
  [1, 1],
]; // kanan-atas, kiri-atas, kiri-bawah, kanan-bawah
const PAT: (1 | -1)[][] = [
  [1, 1, 1, 1], // semua sefase  ↔ s
  [1, -1, -1, 1], // kanan + / kiri −  ↔ p_x
  [1, 1, -1, -1], // atas + / bawah −  ↔ p_y
  [1, -1, 1, -1], // berselang → tak berpasangan
];
const TX = [800, 1080, 1360, 1640];
const TY = 390;
const BY = 745;
const D = 120; // jarak H dari pusat (molekul besar, satuan lokal)
const d = 50; // jarak di ubin

export const Salc: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  // ---------- molekul ----------
  const molIn = ramp(t, cue(0) - 0.8, cue(0) + 0.6, BACK);
  const toSide = ramp(t, cue(1) - 0.4, cue(1) + 1.0, EASE_IN_OUT);
  const mx = mix(960, 330, toSide);
  const my = mix(470, 430, toSide);
  const ms = mix(1.25, 0.85, toSide);
  const P = (u: number, v: number): [number, number] => [mx + u * ms, my + v * ms];

  // satu per satu: garis pasangan yang tergambar bergiliran lalu kusut
  const pairs: [number, number][] = [];
  for (let a = 0; a < 5; a++) for (let b = a + 1; b < 5; b++) pairs.push([a, b]);
  const tangle0 = cue(0) + 0.6;
  const tangle1 = Math.max(tangle0 + 2, wordOf(0, 'satu', 1) + 0.6);
  const tangleOut = 1 - ramp(t, wordOf(0, 'cara') - 0.3, wordOf(0, 'rapi') + 0.2, EASE_IN_OUT);
  const neat = ramp(t, wordOf(0, 'rapi') - 0.3, wordOf(0, 'rapi') + 0.5) * (1 - ramp(t, cue(1) - 0.3, cue(1) + 0.3, EASE_IN_OUT));
  const ptOf = (k: number): [number, number] => (k === 0 ? P(0, 0) : P(HPOS[k - 1][0] * D, HPOS[k - 1][1] * D));

  // ---------- langkah 1: orbital kelompok ----------
  const s1 = ramp(t, cue(1) - 0.2, cue(1) + 0.6);
  const ring = ramp(t, wordOf(1, 'luar') - 0.3, wordOf(1, 'luar') + 0.6);
  const hGlow = ramp(t, wordOf(1, 'hidrogen') - 0.3, wordOf(1, 'hidrogen') + 0.4);
  const tk = wordOf(1, 'kelompok');
  const fly = (k: number) => ramp(t, tk - 0.5 + k * 0.22, tk + 0.6 + k * 0.22, EASE_IN_OUT);
  const tile = (k: number) => ramp(t, tk - 0.2 + k * 0.22, tk + 0.6 + k * 0.22);
  const phT = [wordOf(2, 'sefase'), wordOf(2, 'positif'), wordOf(2, 'positif') + 0.45, wordOf(2, 'negatif')];
  const ph = (k: number) => ramp(t, phT[k] - 0.3, phT[k] + 0.5);
  const legend = ramp(t, wordOf(2, 'fase', 0) - 0.3, wordOf(2, 'fase', 0) + 0.5);

  // ---------- langkah 2: cocokkan ----------
  const s2 = ramp(t, cue(3) - 0.2, cue(3) + 0.6);
  const lit1 = 1 - 0.6 * s2;
  const cen = (k: number) => ramp(t, wordOf(3, 'pusat') - 0.4 + k * 0.25, wordOf(3, 'pusat') + 0.4 + k * 0.25, BACK);
  const arr = (k: number) => ramp(t, wordOf(3, 'simetrinya') - 0.2 + k * 0.35, wordOf(3, 'simetrinya') + 0.6 + k * 0.35);
  const ok = (k: number) => ramp(t, wordOf(3, 'sama') + k * 0.3, wordOf(3, 'sama') + 0.5 + k * 0.3);
  const split = ramp(t, wordOf(4, 'ikatan') - 0.3, wordOf(4, 'antiikatan') + 0.4);
  const lone = ramp(t, wordOf(4, 'tidak') - 0.3, wordOf(4, 'pasangan') + 0.3);
  const nb = ramp(t, wordOf(4, 'nonikatan') - 0.3, wordOf(4, 'nonikatan') + 0.4, BACK);

  const centrals = [
    <PhaseS key="s" x={TX[0]} y={BY} r={50} sign={1} t={t} />,
    <PhaseP key="px" x={TX[1]} y={BY} L={82} ang={0} t={t} />,
    <PhaseP key="py" x={TX[2]} y={BY} L={82} ang={-Math.PI / 2} t={t} />,
  ];
  const cLab: [string, ('sub' | 'sup')?][][] = [[['s']], [['p'], ['x', 'sub']], [['p'], ['y', 'sub']]];
  const cLabX = [TX[0] + 74, TX[1] + 96, TX[2] + 56];

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <PoADefs />
        <Glow x={mx} y={my} r={330 * ms} color="cyan" opacity={0.1 + 0.03 * Math.sin(t)} />

        {/* ---------- molekul skematis ---------- */}
        <g opacity={molIn}>
          {/* garis pasangan "satu per satu" */}
          <g opacity={tangleOut}>
            {pairs.map(([a, b], i) => {
              const p = ramp(t, mix(tangle0, tangle1, i / pairs.length), mix(tangle0, tangle1, (i + 1) / pairs.length));
              const [x1, y1] = ptOf(a);
              const [x2, y2] = ptOf(b);
              const bend = 30 * Math.sin(i * 2.3 + t * 0.8);
              const cx = (x1 + x2) / 2 + bend;
              const cy = (y1 + y2) / 2 - bend;
              return <DrawPath key={i} d={`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`} p={p} stroke={i % 2 ? C.amber : C.pink} width={3} opacity={0.75} />;
            })}
          </g>
          {/* lingkaran pengelompok atom luar */}
          <circle
            cx={mx}
            cy={my}
            r={(D * 1.41 + 70) * ms}
            fill="none"
            stroke={C.gold}
            strokeWidth={3}
            strokeDasharray="14 10"
            strokeDashoffset={-t * 18}
            opacity={0.8 * ring}
          />
          {HPOS.map(([u, v], k) => {
            const [x, y] = P(u * D, v * D);
            return (
              <g key={k}>
                <circle cx={x} cy={y} r={70 * ms} fill="url(#soft-gold)" opacity={0.35 * hGlow * (0.7 + 0.3 * Math.sin(t * 3 + k))} />
                <PhaseS x={x} y={y} r={56 * ms} sign={1} ph={0} t={t} />
                <Label x={x + u * 62 * ms} y={y + v * 62 * ms} size={24 * ms + 4} color={C.ink} weight={700}>
                  H
                </Label>
              </g>
            );
          })}
          <Atom x={mx} y={my} el="C" r={34 * ms} label="A" glow={0.5} />
        </g>
        <g opacity={molIn * (1 - 0.3 * s2)}>
          <Label x={mx} y={my + 250 * ms} size={26} color={C.muted}>
            atom pusat A + 4 atom H (skematis)
          </Label>
        </g>
        <Label x={960} y={190} size={34} color={C.gold} weight={600} opacity={neat}>
          ada cara yang lebih rapi
        </Label>
        <g opacity={ring * (1 - 0.4 * s2)}>
          <Label x={mx} y={my - (D * 1.41 + 100) * ms} size={26} color={C.gold} weight={600}>
            orbital kelompok
          </Label>
        </g>

        {/* ---------- ubin orbital kelompok ---------- */}
        <g opacity={legend}>
          <circle cx={1105} cy={226} r={13} fill="url(#poA-gold)" stroke={C.gold} strokeWidth={2.5} />
          <Label x={1128} y={226} size={24} color={C.gold} anchor="start" weight={600}>
            fase +
          </Label>
          <circle cx={1260} cy={226} r={13} fill="url(#poA-violet)" stroke={C.violet} strokeWidth={2.5} />
          <Label x={1283} y={226} size={24} color={C.violet} anchor="start" weight={600}>
            fase −
          </Label>
        </g>
        {TX.map((x, k) => {
          const tp = tile(k);
          const isLone = k === 3;
          const litK = Math.max(lit1, isLone ? lone : arr(k));
          return (
            <g key={k} opacity={tp * (0.45 + 0.55 * litK)}>
              <rect x={x - 115} y={TY - 115} width={230} height={230} rx={22} fill="rgba(12,18,40,0.8)" stroke={isLone ? C.muted : C.gold} strokeOpacity={0.25 + 0.5 * ph(k)} strokeWidth={2} />
              <circle cx={x} cy={TY} r={8} fill="none" stroke={C.muted} strokeWidth={2} strokeDasharray="3 3" />
              <Label x={x} y={TY + 150} size={24} color={k === 0 ? C.gold : isLone ? C.muted : C.ink} weight={600} opacity={ph(k)}>
                {['semua sefase', 'berlawanan', 'berlawanan', 'berselang'][k]}
              </Label>
              <Label x={x} y={TY + 180} size={21} color={C.muted} opacity={ph(k)}>
                {['+ + + +', 'kiri − · kanan +', 'atas + · bawah −', '+ − + −'][k]}
              </Label>
            </g>
          );
        })}
        {/* bola 1s yang terbang dari molekul ke ubin */}
        {TX.map((x, k) =>
          HPOS.map(([u, v], j) => {
            const f = fly(k);
            if (f <= 0.001) return null;
            const [hx, hy] = P(u * D, v * D);
            const px = mix(hx, x + u * d, f);
            const py = mix(hy, TY + v * d, f) - 60 * Math.sin(Math.PI * f);
            return <PhaseS key={`${k}${j}`} x={px} y={py} r={mix(56 * ms, 32, f)} sign={PAT[k][j]} ph={ph(k)} t={t} opacity={Math.min(1, f * 3) * (0.5 + 0.5 * Math.max(lit1, k === 3 ? lone : arr(k)))} />;
          }),
        )}

        {/* ---------- orbital atom pusat & pencocokan ---------- */}
        {centrals.map((el, k) => (
          <g key={k} opacity={cen(k)} transform={`translate(${TX[k]} ${BY}) scale(${0.7 + 0.3 * cen(k)}) translate(${-TX[k]} ${-BY})`}>
            {el}
            <RichLabel x={cLabX[k]} y={BY} parts={cLab[k]} size={34} color={C.ink} font="serif" italic anchor="start" />
          </g>
        ))}
        <g opacity={cen(0)}>
          <Label x={TX[0]} y={BY + 84} size={22} color={C.muted}>
            orbital atom pusat
          </Label>
        </g>
        {[0, 1, 2].map((k) => {
          const x = TX[k];
          return (
            <g key={k}>
              <DrawPath d={`M${x},${TY + 205} L${x},${BY - 100}`} p={arr(k)} stroke={C.mint} width={4} />
              <path d={`M${x - 10},${BY - 112} L${x},${BY - 96} L${x + 10},${BY - 112}`} fill="none" stroke={C.mint} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={ramp(arr(k), 0.85, 1)} />
              <Check x={x - 48} y={(TY + 205 + BY - 100) / 2} r={16} p={ok(k)} width={6} />
              {/* tingkat ikatan & antiikatan */}
              <g opacity={split}>
                <line x1={x + 34} y1={TY + 222} x2={x + 34 + 56 * split} y2={TY + 222} stroke={C.red} strokeWidth={5} strokeLinecap="round" />
                <line x1={x + 34} y1={TY + 268} x2={x + 34 + 56 * split} y2={TY + 268} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" />
                <circle cx={x + 62} cy={TY + 268} r={14} fill="url(#soft-cyan)" opacity={0.5 + 0.3 * Math.sin(t * 3 + k)} />
              </g>
            </g>
          );
        })}
        {/* kolom keempat: tak berpasangan */}
        <g opacity={lone}>
          <circle cx={TX[3]} cy={BY} r={52} fill="none" stroke={C.muted} strokeWidth={3} strokeDasharray="8 8" strokeDashoffset={-t * 12} />
          <text x={TX[3]} y={BY + 2} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontSize={54} fontWeight={700} fill={C.muted}>
            ?
          </text>
          <Label x={TX[3]} y={TY + 236} size={22} color={C.muted}>
            tak ada pasangan
          </Label>
        </g>
        <g opacity={split}>
          <Label x={TX[0] + 100} y={TY + 222} size={20} color={C.red} anchor="start">
            antiikatan
          </Label>
          <Label x={TX[0] + 100} y={TY + 268} size={20} color={C.cyan} anchor="start">
            ikatan
          </Label>
        </g>
      </Stage>

      <StepPill x={100} y={712} n="1" color={C.gold} p={s1} lit={1 - 0.7 * s2} text={<>gabungkan atom luar → orbital kelompok</>} />
      <StepPill x={100} y={826} n="2" color={C.mint} p={s2} lit={s2} text={<>cocokkan dengan orbital pusat yang simetrinya sama</>} />
      <Badge x={TX[3]} y={BY + 95} text="nonikatan" color={C.muted} opacity={nb} scale={0.85 + 0.15 * nb} />
    </AbsoluteFill>
  );
};
