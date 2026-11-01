import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp} from '../anim';
import {Formula, Glow, Label, Stage} from '../components/primitives';
import {MODiagram, type MOElec, type MOLevel} from '../components/moB';
import {CUBE_TETRA, PesV, pesY, type Peak} from '../components/poB';
import {Render3D, VbDefs, ball, bond, cloud, hybrid, mul, pOrb, sphere, type Cam, type Item, type V3} from '../components/vbC';
import {RichLabel} from '../components/vbD';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 03: metana — empat 1s H → orbital kelompok a₁ + t₂; diagram MO; 8 elektron; PES 23 eV (a₁, 2 e⁻) & 14 eV (t₂, 6 e⁻);
// penutup: sp³ dan MO memberi kerapatan total yang sama.
const DH = 1.09;
const HPOS: V3[] = CUBE_TETRA.map((v) => mul(v, DH));
const AXES: V3[] = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];
/** tanda 1s H ke-h pada pola k (0 = a₁ semua +, 1..3 = t₂ x/y/z) */
const sgn = (k: number, h: number) => (k === 0 ? 1 : Math.sign(CUBE_TETRA[h][k - 1]));

// panel orbital kelompok
const PX = [880, 1180, 1420, 1660];
const ROW1 = 370;
const ROW2 = 610;

// spektrum PES CH₄ (He II skematis): t₂ lebar (Jahn–Teller) ≈ 14 eV, a₁ ≈ 23 eV, luas ≈ 3 : 1
const PEAKS: Peak[] = [
  [13.75, 0.74, 0.3],
  [14.45, 0.86, 0.32],
  [22.9, 0.46, 0.34],
];
const BOX = {x: 1270, y0: 235, y1: 815, e0: 10, e1: 26, w: 400};

/** H 1s berwarna fase: bobot emas (+) dan ungu (−) bersilang-pudar. */
const hSpheres = (cam: Cam, wGold: number[], r: number, op: number, neutral = 0): Item[] => {
  const out: Item[] = [];
  HPOS.forEach((p, h) => {
    const g = wGold[h];
    if (neutral > 0.001) out.push(sphere(cam, {center: p, r, color: 'blue', opacity: 0.6 * op * neutral}) as Item);
    if ((1 - neutral) * g > 0.001) out.push(sphere(cam, {center: p, r, color: 'gold', opacity: 0.62 * op * (1 - neutral) * g}) as Item);
    if ((1 - neutral) * (1 - g) > 0.001) out.push(sphere(cam, {center: p, r, color: 'violet', opacity: 0.62 * op * (1 - neutral) * (1 - g)}) as Item);
  });
  return out.filter(Boolean);
};

const skeleton = (cam: Cam, op: number, cR = 0.36, hR = 0.24): Item[] =>
  [
    ...HPOS.map((p) => bond(cam, {a: [0, 0, 0], b: p, opacity: op, width: 0.1})),
    ball(cam, {pos: [0, 0, 0], el: 'C', r: cR, opacity: op}),
    ...HPOS.map((p) => ball(cam, {pos: p, el: 'H', r: hR, opacity: op, label: hR > 0.2 ? 'H' : null})),
  ].filter((x): x is Item => !!x);

/** Bobot pola a₁/t₂ yang ditampilkan: w[k] (jumlah = 1). */
const goldOf = (w: number[]) => HPOS.map((_, h) => w.reduce((s, wk, k) => s + wk * (sgn(k, h) > 0 ? 1 : 0), 0));

export const Methane: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);
  const yaw = 0.42 + 0.22 * t;

  // ---------- fase 1: orbital kelompok ----------
  const m0 = ramp(t, -0.3, 0.9);
  const sIn = ramp(t, wordOf(0, 'satu') - 0.3, wordOf(0, 'satu') + 0.7);
  const grp = ramp(t, wordOf(0, 'membentuk') - 0.4, wordOf(0, 'membentuk') + 0.8, EASE_IN_OUT);
  const tA1 = wordOf(1, 'sefase');
  const a1On = ramp(t, tA1 - 0.4, tA1 + 0.5);
  const s2On = ramp(t, wordOf(1, 'karbon') - 0.4, wordOf(1, 'karbon') + 0.6, BACK);
  const tT2 = wordOf(1, 'lainnya');
  const t2On = ramp(t, tT2 - 0.4, tT2 + 0.6);
  const p2On = ramp(t, wordOf(1, 'orbital') - 0.3, wordOf(1, 'orbital') + 0.7, BACK);
  const ph1 = 1 - ramp(t, cue(2) - 0.7, cue(2) + 0.1, EASE_IN_OUT);

  // pola yang tampil di molekul besar: netral → a₁ → t₂ x/y/z bergiliran (silang-pudar periodik)
  const cyc3 = Math.max(0, t - tT2) / 2.1;
  const tw = [0, 1, 2].map((k) => {
    const d0 = Math.abs((((cyc3 - k) % 3) + 4.5) % 3 - 1.5);
    return Math.max(0, Math.min(1, 1.6 - 1.6 * d0));
  });
  const twS = tw.reduce((a, b) => a + b, 0) || 1;
  const wPat = [1 - t2On, ...tw.map((v) => (t2On * v) / twS)];
  const bigGold = goldOf(wPat);
  const neutral = 1 - a1On;

  const bigCam: Cam = {cx: mix(960, 400, grp), cy: mix(540, 530, grp), s: mix(185, 150, grp), yaw, pitch: -0.34};
  const bigItems: Item[] = [
    ...skeleton(bigCam, 1),
    ...hSpheres(bigCam, bigGold, 0.52, sIn, neutral),
    sphere(bigCam, {center: [0, 0, 0], r: 0.62, color: 'gold', opacity: 0.55 * s2On * (1 - t2On)}),
    ...AXES.flatMap((ax, k) => pOrb(bigCam, {origin: [0, 0, 0], dir: ax, len: 1.05, wid: 0.4, opacity: 0.75 * p2On * wPat[k + 1]})),
  ].filter((x): x is Item => !!x);

  // ---------- fase 2: diagram MO ----------
  const ph2 = ramp(t, cue(2) - 0.3, cue(2) + 0.8) * (1 - ramp(t, cue(4) - 0.5, cue(4) + 0.3, EASE_IN_OUT));
  const lowLit = ramp(t, wordOf(2, 'rendah') - 0.3, wordOf(2, 'rendah') + 0.5);
  const setLit = ramp(t, wordOf(2, 'setara') - 0.3, wordOf(2, 'setara') + 0.5);
  const tDua = wordOf(3, 'Dua', 0);
  const tEnam = wordOf(3, 'Enam');
  const fa = (k: number) => ramp(t, tDua - 0.4 + k * 0.35, tDua + 0.6 + k * 0.35, EASE_IN_OUT);
  const ft = (k: number) => ramp(t, tEnam - 0.5 + k * 0.28, tEnam + 0.5 + k * 0.28, EASE_IN_OUT);
  const aoDim = 1 - 0.55 * ramp(t, cue(3) - 0.3, cue(3) + 0.6);
  const g = {cx: 610, D: 300, lw: 110, aw: 60, gap: 22, agap: 12, fs: 26, spin: 36};
  const levels: MOLevel[] = [
    {id: 'C2s', kind: 'ao', side: 'L', y: 650, label: [['2s']], lit: 0},
    {id: 'C2p', kind: 'ao', side: 'L', y: 360, n: 3, label: [['2p']]},
    {id: 'H', kind: 'ao', side: 'R', y: 420, n: 4, label: [['1s']]},
    {id: 'a1', kind: 'sg', y: 745, label: [['a'], ['1', 'sub']], lit: Math.max(lowLit * (1 - 0.6 * setLit), ramp(t, wordOf(3, 'rendah') - 0.2, wordOf(3, 'rendah') + 0.4))},
    {id: 't2', kind: 'sg', y: 530, n: 3, label: [['t'], ['2', 'sub']], lit: setLit},
    {id: 'a1s', kind: 'sgs', y: 285, label: [['a'], ['1', 'sub'], ['*', 'sup']]},
    {id: 't2s', kind: 'sgs', y: 205, n: 3, label: [['t'], ['2', 'sub'], ['*', 'sup']]},
  ];
  const lv = levels.map((L) => (L.kind === 'ao' ? {...L, p: aoDim} : L.kind === 'sgs' ? {...L, p: 0.55 + 0.45 * aoDim} : L));
  const links = ramp(t, cue(2) + 0.2, cue(2) + 1.6);
  const elec: MOElec[] = [
    {at: 'a1', src: 'C2s', up: true, p: fa(0)},
    {at: 'a1', src: 'C2s', up: false, p: fa(1)},
    {at: 't2', k: 0, src: 'C2p', sk: 0, up: true, p: ft(0)},
    {at: 't2', k: 1, src: 'C2p', sk: 1, up: true, p: ft(1)},
    {at: 't2', k: 2, src: 'H', sk: 0, up: true, p: ft(2)},
    {at: 't2', k: 0, src: 'H', sk: 1, up: false, p: ft(3)},
    {at: 't2', k: 1, src: 'H', sk: 3, up: false, p: ft(4)},
    {at: 't2', k: 2, src: 'H', sk: 2, up: false, p: ft(5)},
  ];

  // spektrum + panah
  const spec = ramp(t, cue(3) - 0.6, cue(3) + 0.4);
  const upto = interpolate(t, [cue(3) - 0.4, cue(3) + 1.6], [10, 26], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const arA = ramp(t, wordOf(3, 'puluh') - 0.3, wordOf(3, 'puluh') + 0.7);
  const arT = ramp(t, wordOf(3, 'empat') - 0.3, wordOf(3, 'empat') + 0.7);
  const yA = pesY(BOX, 22.9);
  const yT = pesY(BOX, 14.1);

  // ---------- fase 3: penutup ----------
  const ph3 = ramp(t, cue(4) - 0.2, cue(4) + 0.8);
  const same = ramp(t, wordOf(4, 'Kerapatan') - 0.3, wordOf(4, 'sama') + 0.4, EASE_IN_OUT);
  const eqP = ramp(t, wordOf(4, 'sama') - 0.2, wordOf(4, 'sama') + 0.5, BACK);
  const labL = ramp(t, wordOf(4, 'ikatan') - 0.3, wordOf(4, 'ikatan') + 0.5);
  const labR = ramp(t, wordOf(4, 'energi') - 0.3, wordOf(4, 'energi') + 0.5);
  const camL: Cam = {cx: 610, cy: 545, s: 140, yaw, pitch: -0.34};
  const camR: Cam = {cx: 1300, cy: 545, s: 140, yaw, pitch: -0.34};
  // MO yang tampil bergiliran di kanan: a₁, t₂x, t₂y, t₂z
  const c4 = Math.max(0, t - cue(4)) / 1.9;
  const w4 = [0, 1, 2, 3].map((k) => {
    const d0 = Math.abs((((c4 - k) % 4) + 6) % 4 - 2);
    return Math.max(0, Math.min(1, 1.5 - 1.5 * d0));
  });
  const w4s = w4.reduce((a, b) => a + b, 0) || 1;
  const w4n = w4.map((v) => v / w4s);
  const dimPic = 1 - 0.5 * same;
  const blob = (cam: Cam): Item[] =>
    [
      sphere(cam, {center: [0, 0, 0], r: 0.55, color: 'cyan', opacity: 0.32 * same}),
      ...HPOS.map((p) => cloud(cam, {center: mul(p, 0.62), axis: p, a: 0.78, b: 0.42, color: 'cyan', opacity: 0.38 * same})),
    ].filter((x): x is Item => !!x);
  const leftItems: Item[] = [
    ...skeleton(camL, 1, 0.32, 0.22),
    ...HPOS.flatMap((p) => hybrid(camL, {origin: [0, 0, 0], dir: p, len: 1.05, wid: 0.36, color: 'mint', opacity: 0.72 * dimPic})),
    ...blob(camL),
  ];
  const rightItems: Item[] = [
    ...skeleton(camR, 1, 0.32, 0.22),
    sphere(camR, {center: [0, 0, 0], r: 0.6, color: 'gold', opacity: 0.55 * w4n[0] * dimPic}),
    ...hSpheres(camR, goldOf(w4n), 0.46, dimPic),
    ...AXES.flatMap((ax, k) => pOrb(camR, {origin: [0, 0, 0], dir: ax, len: 1.0, wid: 0.38, opacity: 0.72 * w4n[k + 1] * dimPic})),
    ...blob(camR),
  ].filter((x): x is Item => !!x);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <VbDefs />
        <Glow x={bigCam.cx} y={bigCam.cy} r={380} color="cyan" opacity={(0.08 + 0.03 * Math.sin(t)) * ph1} />

        {/* ===== fase 1 ===== */}
        <g opacity={ph1 * m0}>
          <Render3D items={bigItems} />
          <Label x={bigCam.cx} y={mix(820, 800, grp)} size={30} color={C.blue} weight={600} opacity={sIn * (1 - a1On)}>
            4 × orbital 1s H
          </Label>
          <g opacity={a1On}>
            <RichLabel x={bigCam.cx} y={800} parts={[['a'], ['1', 'sub'], [': 2s C + semua 1s sefase']]} size={28} color={C.gold} opacity={1 - t2On} />
            <RichLabel x={bigCam.cx} y={800} parts={[['t'], ['2', 'sub'], [': 2p C + 1s berlawanan fase']]} size={28} color={C.gold} opacity={t2On} />
          </g>

          {/* panel orbital kelompok */}
          {PX.map((x, k) => {
            const app = ramp(t, wordOf(0, 'kelompok') - 0.2 + k * 0.22, wordOf(0, 'kelompok') + 0.6 + k * 0.22, BACK);
            if (app <= 0.001) return null;
            const lit = k === 0 ? a1On * (1 - 0.6 * t2On) : t2On;
            const dim = 0.55 + 0.45 * Math.max(lit, 1 - a1On);
            const cam1: Cam = {cx: x, cy: ROW1 + (1 - app) * 30, s: 66, yaw, pitch: -0.34};
            const cam2: Cam = {cx: x, cy: ROW2, s: 66, yaw, pitch: -0.34};
            const show2 = k === 0 ? s2On : p2On;
            const items1: Item[] = [...skeleton(cam1, 0.45, 0.2, 0.14), ...hSpheres(cam1, HPOS.map((_, h) => (sgn(k, h) > 0 ? 1 : 0)), 0.55, 1)];
            const items2: Item[] = [
              ball(cam2, {pos: [0, 0, 0], el: 'C', r: 0.24, label: null, opacity: 0.8}),
              k === 0 ? sphere(cam2, {center: [0, 0, 0], r: 0.72, color: 'gold', opacity: 0.6}) : null,
              ...(k > 0 ? pOrb(cam2, {origin: [0, 0, 0], dir: AXES[k - 1], len: 1.25, wid: 0.46, opacity: 0.8}) : []),
            ].filter((x): x is Item => !!x);
            return (
              <g key={k} opacity={app * dim}>
                <rect x={x - 112} y={ROW1 - 118} width={224} height={ROW2 - ROW1 + 236} rx={22} fill="rgba(14,20,44,0.55)" stroke={k === 0 ? C.gold : C.cyan} strokeOpacity={0.18 + 0.5 * lit} strokeWidth={2.5} />
                <Render3D items={items1} />
                <g opacity={show2}>
                  <Render3D items={items2} />
                  <text x={x} y={(ROW1 + ROW2) / 2 + 4} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontSize={30} fill={C.mint} opacity={0.6 + 0.4 * Math.sin(t * 3 + k)}>
                    ⇅
                  </text>
                  <RichLabel x={x} y={ROW2 + 92} parts={k === 0 ? [['2s']] : [['2p'], [['x', 'y', 'z'][k - 1], 'sub']]} size={28} color={C.ink} />
                </g>
              </g>
            );
          })}
          {/* judul kolom */}
          <g opacity={ramp(t, wordOf(0, 'kelompok') - 0.1, wordOf(0, 'kelompok') + 0.7)}>
            <RichLabel x={PX[0]} y={218} parts={[['a'], ['1', 'sub']]} size={40} color={C.gold} font="serif" weight={600} />
            <RichLabel x={PX[2]} y={218} parts={[['t'], ['2', 'sub'], [' (tiga setara)']]} size={36} color={C.cyan} font="serif" weight={600} />
            <line x1={PX[1] - 90} y1={246} x2={PX[3] + 90} y2={246} stroke={C.cyan} strokeOpacity={0.5} strokeWidth={2.5} strokeLinecap="round" />
            <circle cx={1410} cy={830} r={10} fill={C.gold} />
            <Label x={1428} y={830} size={24} color={C.gold} anchor="start">
              fase +
            </Label>
            <circle cx={1560} cy={830} r={10} fill={C.violet} />
            <Label x={1578} y={830} size={24} color={C.violet} anchor="start">
              fase −
            </Label>
          </g>
        </g>

        {/* ===== fase 2: diagram MO + spektrum ===== */}
        <g opacity={ph2}>
          <Glow x={g.cx} y={620} r={360} color="cyan" opacity={0.07 + 0.03 * Math.sin(t * 0.9)} />
          <Label x={g.cx - g.D} y={790} size={30} color={C.muted} weight={700} opacity={aoDim}>
            C
          </Label>
          <Label x={g.cx + g.D} y={790} size={30} color={C.muted} weight={700} opacity={aoDim}>
            4 H
          </Label>
          <g opacity={links * aoDim}>
            {(
              [
                ['C2s', 'a1'],
                ['C2s', 'a1s'],
                ['C2p', 't2'],
                ['C2p', 't2s'],
                ['H', 'a1'],
                ['H', 't2'],
                ['H', 'a1s'],
                ['H', 't2s'],
              ] as const
            ).map(([a, b], i) => {
              const A = lv.find((x) => x.id === a)!;
              const B = lv.find((x) => x.id === b)!;
              const left = A.side === 'L';
              const nA = A.n ?? 1;
              const nB = B.n ?? 1;
              const wA = nA * g.aw + (nA - 1) * g.agap;
              const wB = nB * g.lw + (nB - 1) * g.gap;
              const xa = left ? g.cx - g.D + wA / 2 + 4 : g.cx + g.D - wA / 2 - 4;
              const xb = left ? g.cx - wB / 2 - 4 : g.cx + wB / 2 + 4;
              return <line key={i} x1={xa} y1={A.y} x2={xb} y2={B.y} stroke={C.muted} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="7 7" />;
            })}
          </g>
          <MODiagram g={g} levels={lv} elec={elec} t={t} />
          <Label x={g.cx} y={160 + 8} size={24} color={C.red} opacity={0.7 * aoDim}>
            antiikatan (kosong)
          </Label>

          {/* spektrum fotoelektron */}
          <g opacity={spec}>
            <PesV b={BOX} peaks={PEAKS} upto={upto} t={t} ticks={[10, 15, 20, 25]} />
            <Label x={BOX.x + 170} y={858} size={23} color={C.muted}>
              energi ionisasi (eV) ↓
            </Label>
            {/* panah a₁ → 23 eV */}
            <g opacity={arA}>
              <line x1={g.cx + 70} y1={745} x2={mix(g.cx + 70, BOX.x - 18, arA)} y2={mix(745, yA, arA)} stroke={C.cyan} strokeWidth={4} strokeLinecap="round" strokeDasharray="12 8" strokeDashoffset={-t * 30} />
              <path d={`M${BOX.x - 14},${yA} l-20,-11 l0,22 Z`} fill={C.cyan} opacity={arA} />
              <Label x={BOX.x + 0.46 * BOX.w + 40} y={yA - 4} size={32} color={C.gold} weight={700} anchor="start">
                ≈ 23 eV
              </Label>
              <Label x={BOX.x + 0.46 * BOX.w + 40} y={yA + 38} size={26} color={C.cyan} weight={600} anchor="start">
                2 e⁻
              </Label>
            </g>
            {/* panah t₂ → 14 eV */}
            <g opacity={arT}>
              <line x1={g.cx + 200} y1={530} x2={mix(g.cx + 200, BOX.x - 18, arT)} y2={mix(530, yT, arT)} stroke={C.cyan} strokeWidth={4} strokeLinecap="round" strokeDasharray="12 8" strokeDashoffset={-t * 30} />
              <path d={`M${BOX.x - 14},${yT} l-20,-11 l0,22 Z`} fill={C.cyan} opacity={arT} />
              <Label x={BOX.x + 0.86 * BOX.w + 30} y={yT - 4} size={32} color={C.gold} weight={700} anchor="start">
                ≈ 14 eV
              </Label>
              <Label x={BOX.x + 0.86 * BOX.w + 30} y={yT + 38} size={26} color={C.cyan} weight={600} anchor="start">
                6 e⁻
              </Label>
            </g>
          </g>
        </g>

        {/* ===== fase 3: dua gambaran setara ===== */}
        <g opacity={ph3}>
          <Glow x={960} y={545} r={520} color="cyan" opacity={(0.05 + 0.08 * same) * (0.8 + 0.2 * Math.sin(t * 1.4))} />
          <Render3D items={leftItems} />
          <Render3D items={rightItems} />
          <Label x={610} y={330} size={30} color={C.mint} weight={700}>
            4 hibrida sp³
          </Label>
          <Label x={1300} y={330} size={30} color={C.cyan} weight={700}>
            orbital molekul (a₁ + 3 t₂)
          </Label>
          <g opacity={eqP} transform={`translate(955 545) scale(${0.6 + 0.4 * eqP})`}>
            <circle r={70} fill="url(#soft-gold)" opacity={0.5 + 0.2 * Math.sin(t * 3)} />
            <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={700} fontSize={120} fill={C.gold}>
              =
            </text>
          </g>
          {/* tingkat mini untuk gambar MO: yang menyala = MO yang tampil */}
          <g opacity={labR}>
            <line x1={1560} y1={650} x2={1640} y2={650} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" />
            <ellipse cx={1600} cy={650} rx={56} ry={18} fill={C.gold} opacity={0.3 * w4n[0]} />
            {[0, 1, 2].map((k) => (
              <g key={k}>
                <ellipse cx={1560 + k * 50} cy={530} rx={26} ry={16} fill={C.gold} opacity={0.35 * w4n[k + 1]} />
                <line x1={1542 + k * 50} y1={530} x2={1578 + k * 50} y2={530} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" />
              </g>
            ))}
            <RichLabel x={1660} y={650} parts={[['a'], ['1', 'sub']]} size={24} color={C.cyan} font="serif" anchor="start" />
            <RichLabel x={1680} y={530} parts={[['t'], ['2', 'sub']]} size={24} color={C.cyan} font="serif" anchor="start" />
            <Label x={1610} y={590} size={20} color={C.muted}>
              23 · 14 eV
            </Label>
          </g>
          <Label x={610} y={790} size={32} color={C.mint} weight={600} opacity={labL}>
            hibridisasi = gambaran ikatan
          </Label>
          <Label x={1300} y={790} size={32} color={C.cyan} weight={600} opacity={labR}>
            MO = energi tiap elektron
          </Label>
        </g>
      </Stage>
      <Formula x={955} y={215} p={same * ph3} accent={C.cyan} size={56}>
        <span style={{fontFamily: FONT.sans, fontWeight: 600}}>kerapatan elektron total sama</span>
      </Formula>
    </AbsoluteFill>
  );
};

