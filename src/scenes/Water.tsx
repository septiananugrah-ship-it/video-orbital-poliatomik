import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp, slot} from '../anim';
import {Formula, Glow, Label, Stage} from '../components/primitives';
import {EAxis} from '../components/moB';
import {Lvl, Pair, PesV, pesY, type Peak} from '../components/poB';
import {Render3D, VbDefs, add, ball, bond, mul, norm, pOrb, proj, rotY, type Cam, type Item, type V3} from '../components/vbC';
import {RichLabel} from '../components/vbD';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 04: air — 8 e⁻ valensi di 4 MO (2a₁, 1b₂, 3a₁, 1b₁); PES 32,2 / 18,5 / 14,7 / 12,6 eV; HOMO 1b₁ = p O ⊥ bidang,
// nonikatan = pasangan bebas; ikatan hidrogen lewat orbital itu.
const BOX = {x: 1010, y0: 205, y1: 840, e0: 6, e1: 34, w: 360};
const PEAKS: Peak[] = [
  // 1b₁: tajam (nonikatan)
  [12.62, 1.0, 0.11],
  [13.02, 0.32, 0.1],
  // 3a₁: deret getaran lebar
  [13.9, 0.22, 0.22],
  [14.4, 0.4, 0.24],
  [14.9, 0.44, 0.24],
  [15.4, 0.3, 0.24],
  [15.9, 0.14, 0.24],
  // 1b₂: lebar
  [17.9, 0.22, 0.3],
  [18.5, 0.36, 0.32],
  [19.1, 0.26, 0.3],
  [19.7, 0.1, 0.3],
  // 2a₁: lebar & lemah
  [32.2, 0.3, 0.55],
];
// tingkat MO pada energi Koopmans (−IE) → panah ke puncak mendatar
type MO = {lab: [string, ('sub' | 'sup')?][]; E: number; peakX: number; word: string};
const MOS: MO[] = [
  {lab: [['2a'], ['1', 'sub']], E: 32.2, peakX: 0.3, word: 'puluh'},
  {lab: [['1b'], ['2', 'sub']], E: 18.5, peakX: 0.4, word: 'lima'},
  {lab: [['3a'], ['1', 'sub']], E: 14.7, peakX: 0.48, word: 'tujuh'},
  {lab: [['1b'], ['1', 'sub']], E: 12.6, peakX: 1.0, word: 'enam'},
];
const MX = 520; // pusat garis MO
const LW = 160;

// geometri air: O di pusat, bidang molekul = bidang xy, p_z tegak lurus bidang
const RH = 0.96;
const HA = (104.5 / 2) * (Math.PI / 180);
const O1: V3 = [0, 0, 0];
const H1: V3 = [-RH * Math.sin(HA), RH * Math.cos(HA), 0];
const H2: V3 = [RH * Math.sin(HA), RH * Math.cos(HA), 0];
// molekul kedua (donor H) di atas lobus atas
const O2: V3 = [0.12, 0.25, 2.8];
const DA = norm([-0.1, 0, -1]);
const HB1: V3 = add(O2, mul(DA, RH));
const HB2: V3 = add(O2, mul(rotY(DA, (104.5 * Math.PI) / 180), RH));

export const Water: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);
  const yOf = (E: number) => pesY(BOX, E);

  // ---------- diagram MO ----------
  const dIn = ramp(t, -0.2, 1.0);
  const lvP = (i: number) => ramp(t, 0.2 + i * 0.25, 0.9 + i * 0.25);
  const tE = wordOf(0, 'delapan');
  const tEnd = wordOf(0, 'terisi') + 0.4;
  const eP = (k: number) => ramp(t, mix(tE, tEnd, k / 8) - 0.2, mix(tE, tEnd, k / 8) + 0.45);
  const anti = ramp(t, 0.8, 1.8) * (1 - ramp(t, cue(2) - 0.5, cue(2) + 0.3, EASE_IN_OUT));
  const homo = ramp(t, wordOf(2, 'tertinggi') - 0.3, wordOf(2, 'tertinggi') + 0.5);
  const non = ramp(t, wordOf(3, 'nonikatan') - 0.3, wordOf(3, 'nonikatan') + 0.5);

  // ---------- spektrum ----------
  const spec = ramp(t, cue(1) - 0.5, cue(1) + 0.4) * (1 - ramp(t, cue(2) - 0.4, cue(2) + 0.4, EASE_IN_OUT));
  const wE = MOS.map((m) => wordOf(1, m.word));
  const upto = interpolate(t, [cue(1), wordOf(1, 'enam') + 0.3, wordOf(1, 'tujuh') + 0.3, wordOf(1, 'lima') + 0.3, wordOf(1, 'puluh') + 0.7], [6, 13.5, 16.3, 20.2, 34], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const four = ramp(t, wordOf(1, 'puncak') - 0.3, wordOf(1, 'puncak') + 0.5);

  // ---------- 3D: orbital 1b₁ ----------
  const m3 = ramp(t, cue(2) - 0.3, cue(2) + 0.8);
  const pz = ramp(t, wordOf(2, 'tegak') - 0.3, wordOf(2, 'tegak') + 0.8, BACK);
  const plane = ramp(t, wordOf(2, 'bidang') - 0.3, wordOf(2, 'bidang') + 0.6);
  const noH = ramp(t, wordOf(2, 'hidrogen') - 0.4, wordOf(2, 'hidrogen') + 0.5);
  const hb = ramp(t, cue(4) - 0.2, wordOf(4, 'hidrogen') - 0.2, EASE_IN_OUT);
  const hbLine = ramp(t, wordOf(4, 'hidrogen') - 0.3, wordOf(4, 'hidrogen') + 0.5);
  const zoom = ramp(t, cue(4) - 0.6, cue(4) + 0.8, EASE_IN_OUT);
  const cam: Cam = {cx: 1330, cy: mix(560, 690, zoom), s: mix(225, 150, zoom), yaw: 0.35 + 0.16 * t, pitch: -0.42};
  const lobeLen = 1.2 * pz;
  const off: V3 = mul([2.4, 0.5, -0.3], 1 - hb);
  const w2 = (p: V3) => add(p, off);
  const items: Item[] = [
    bond(cam, {a: O1, b: H1, width: 0.12}),
    bond(cam, {a: O1, b: H2, width: 0.12}),
    ball(cam, {pos: O1, el: 'O', r: 0.29}),
    ball(cam, {pos: H1, el: 'H', r: 0.24}),
    ball(cam, {pos: H2, el: 'H', r: 0.24}),
    ...(lobeLen > 0.02 ? pOrb(cam, {origin: O1, dir: [0, 0, 1], len: lobeLen, wid: 0.33, opacity: 0.8, glow: 0.6 + 0.4 * Math.sin(t * 2.4) + 0.6 * hbLine}) : []),
    bond(cam, {a: w2(O2), b: w2(HB1), width: 0.12, opacity: hb}),
    bond(cam, {a: w2(O2), b: w2(HB2), width: 0.12, opacity: hb}),
    ball(cam, {pos: w2(O2), el: 'O', r: 0.36, opacity: hb}),
    ball(cam, {pos: w2(HB1), el: 'H', r: 0.24, opacity: hb}),
    ball(cam, {pos: w2(HB2), el: 'H', r: 0.24, opacity: hb}),
  ].filter((x): x is Item => !!x);
  // bidang molekul (persegi panjang di bidang xy)
  const corners: V3[] = [
    [-1.55, -1.0, 0],
    [1.55, -1.0, 0],
    [1.55, 1.45, 0],
    [-1.55, 1.45, 0],
  ];
  const poly = corners.map((q) => proj(q, cam)).map((p) => `${p.X.toFixed(1)},${p.Y.toFixed(1)}`).join(' ');
  const pH1 = proj(H1, cam);
  const pH2 = proj(H2, cam);
  const tip = proj([0, 0, lobeLen * 0.93], cam);
  const pHb = proj(w2(HB1), cam);
  const lab3D = 1 - zoom;

  const lvCol = (i: number) => (i === 3 ? interpolateColors(homo, [0, 1], [C.muted, C.gold]) : C.cyan);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <VbDefs />
        <Glow x={MX} y={520} r={360} color="cyan" opacity={0.07 + 0.03 * Math.sin(t * 0.8)} />
        <Glow x={1330} y={540} r={400} color="gold" opacity={(0.06 + 0.03 * Math.sin(t * 1.1)) * m3} />

        {/* ===== diagram MO ===== */}
        <g opacity={dIn}>
          <EAxis x={270} y0={860} y1={215} />
          {/* antiikatan kosong */}
          <g opacity={anti}>
            <Lvl x={MX} y={245} w={LW} color={C.red} t={t} opacity={0.6} />
            <Lvl x={MX} y={290} w={LW} color={C.red} t={t} opacity={0.6} />
            <RichLabel x={MX - LW / 2 - 18} y={245} parts={[['2b'], ['2', 'sub']]} size={24} color={C.red} anchor="end" font="serif" opacity={0.7} />
            <RichLabel x={MX - LW / 2 - 18} y={290} parts={[['4a'], ['1', 'sub']]} size={24} color={C.red} anchor="end" font="serif" opacity={0.7} />
            <Label x={MX + LW / 2 + 18} y={268} size={22} color={C.red} anchor="start" opacity={0.7}>
              kosong
            </Label>
          </g>
          {MOS.map((m, i) => {
            const y = yOf(m.E);
            const col = lvCol(i);
            const lit = i === 3 ? Math.max(homo, non) : 0;
            return (
              <g key={i}>
                <Lvl x={MX} y={y} w={LW} color={col} p={lvP(i)} lit={lit} t={t} />
                <RichLabel x={MX - LW / 2 - 18} y={y} parts={m.lab} size={30} color={col} anchor="end" font="serif" italic weight={600} opacity={lvP(i)} />
                <Pair x={MX} y={y} a={eP(i * 2)} b={eP(i * 2 + 1)} t={t} />
              </g>
            );
          })}
          <Label x={MX} y={870} size={26} color={C.muted} opacity={ramp(t, tE - 0.2, tE + 0.5)}>
            8 elektron valensi · 4 MO terisi
          </Label>
          {/* label HOMO & nonikatan */}
          <g opacity={homo}>
            <Label x={MX + LW / 2 + 22} y={yOf(12.6) - 2} size={26} color={C.gold} weight={700} anchor="start">
              HOMO
            </Label>
          </g>
          <g opacity={non}>
            <Label x={MX + LW / 2 + 22} y={yOf(12.6) + 32} size={22} color={C.muted} weight={600} anchor="start">
              nonikatan
            </Label>
          </g>
        </g>

        {/* ===== spektrum fotoelektron ===== */}
        <g opacity={spec}>
          <PesV b={BOX} peaks={PEAKS} upto={upto} t={t} ticks={[10, 15, 20, 25, 30]} />
          <Label x={BOX.x + 180} y={872} size={23} color={C.muted}>
            energi ionisasi (eV) ↓
          </Label>
          <Label x={BOX.x + 230} y={215} size={28} color={C.cyan} weight={700} opacity={four}>
            4 puncak
          </Label>
          {MOS.map((m, i) => {
            const a = ramp(t, wE[i] - 0.2, wE[i] + 0.6);
            const n = ramp(t, wE[i] - 0.1, wE[i] + 0.5, BACK);
            const y = yOf(m.E);
            const x0 = MX + LW / 2 + 14;
            const x1 = BOX.x - 18;
            return (
              <g key={i}>
                <g opacity={a}>
                  <line x1={x0} y1={y} x2={mix(x0, x1, a)} y2={y} stroke={lvCol(i)} strokeWidth={3.5} strokeDasharray="10 8" strokeDashoffset={-t * 28} strokeLinecap="round" />
                  <path d={`M${x1 + 4},${y} l-20,-11 l0,22 Z`} fill={lvCol(i)} />
                </g>
                <g opacity={Math.min(1, n)} transform={`translate(${BOX.x + m.peakX * BOX.w + 26} ${y}) scale(${0.8 + 0.2 * n})`}>
                  <text x={0} y={0} textAnchor="start" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={700} fontSize={30} fill={C.gold} style={{paintOrder: 'stroke', stroke: 'rgba(4,6,12,0.85)', strokeWidth: 4}}>
                    {['32,2', '18,5', '14,7', '12,6'][i]} eV
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        {/* ===== 3D: HOMO 1b₁ ===== */}
        <g opacity={m3}>
          <polygon points={poly} fill={C.cyan} fillOpacity={0.05 + 0.08 * plane} stroke={C.cyan} strokeOpacity={0.2 + 0.4 * plane} strokeWidth={2} strokeDasharray="10 8" />
          <Render3D items={items} />
          {/* H berada di bidang simpul: tidak tumpang-tindih */}
          <g opacity={noH * (1 - hb)}>
            {[pH1, pH2].map((p, i) => (
              <circle key={i} cx={p.X} cy={p.Y} r={48} fill="none" stroke={C.red} strokeWidth={3} strokeDasharray="8 7" strokeDashoffset={t * 12} opacity={0.85} />
            ))}
          </g>
          <g opacity={lab3D}>
            <Label x={1330} y={862} size={25} color={C.red} opacity={noH}>
              H di bidang simpul p → tumpang-tindih nol
            </Label>
            <Label x={1640} y={mix(560, 655, zoom) + 6} size={24} color={C.cyan} anchor="start" opacity={plane}>
              bidang molekul
            </Label>
            <RichLabel x={1420} y={300} parts={[['p'], ['z', 'sub'], [' O ⊥ bidang']]} size={28} color={C.gold} anchor="start" opacity={pz} />
          </g>
          {/* ikatan hidrogen */}
          <g opacity={hbLine}>
            <line x1={tip.X} y1={tip.Y} x2={pHb.X} y2={pHb.Y} stroke={C.mint} strokeWidth={5} strokeDasharray="9 9" strokeDashoffset={t * 20} strokeLinecap="round" />
            {[0, 1, 2].map((k) => {
              const ph = (((t * 0.6 + k / 3) % 1) + 1) % 1;
              return <circle key={k} cx={mix(tip.X, pHb.X, ph)} cy={mix(tip.Y, pHb.Y, ph)} r={9} fill="url(#soft-gold)" opacity={cyc(ph)} />;
            })}
            <Label x={(tip.X + pHb.X) / 2 + 70} y={(tip.Y + pHb.Y) / 2} size={30} color={C.mint} weight={700} anchor="start">
              ikatan hidrogen
            </Label>
            <Label x={(tip.X + pHb.X) / 2 + 70} y={(tip.Y + pHb.Y) / 2 + 36} size={22} color={C.muted} anchor="start">
              elektron 1b₁ didonorkan
            </Label>
          </g>
        </g>
        {/* penghubung: tingkat 1b₁ ↔ orbital 3D */}
        <path
          d={`M${MX + LW / 2 + 130},${yOf(12.6)} Q${1000},${yOf(12.6) - 60} ${1210},${mix(420, 520, zoom)}`}
          fill="none"
          stroke={C.gold}
          strokeWidth={3}
          strokeDasharray="8 9"
          strokeDashoffset={-t * 20}
          opacity={0.6 * homo * m3}
        />
      </Stage>
      <Formula x={790} y={225} p={slot(t, wordOf(3, 'pasangan') - 0.3, cue(4) + 0.2)} accent={C.gold} size={56}>
        <span style={{fontFamily: FONT.sans, fontWeight: 600}}>
          nonikatan <span style={{color: C.gold}}>=</span> pasangan bebas
        </span>
      </Formula>
    </AbsoluteFill>
  );
};

