import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Badge, Formula, Glow, Label, Stage} from '../components/primitives';
import {Lvl, NodeLine, PChain, Pair, nodeXs} from '../components/poB';
import {RichLabel} from '../components/vbD';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 06: etilena α ± β; butadiena α ± 1,62β, α ± 0,62β dengan koefisien Hückel dan simpul 0–3;
// 4 e⁻ di ψ₁, ψ₂ (HOMO ψ₂, LUMO ψ₃); lebih rendah 0,47β daripada dua etilena.
const YA = 500; // garis α
const B = 150; // px per |β|
const yE = (x: number) => YA + x * B; // x = koefisien β (positif = lebih rendah karena β < 0)

const ETH = [
  {lab: 'π', c: [0.707, 0.707], e: 1, txt: 'α + β', col: C.cyan},
  {lab: 'π*', c: [0.707, -0.707], e: -1, txt: 'α − β', col: C.red},
];
const BUT = [
  {c: [0.372, 0.602, 0.602, 0.372], e: 1.618, txt: 'α + 1,62β', col: C.cyan},
  {c: [0.602, 0.372, -0.372, -0.602], e: 0.618, txt: 'α + 0,62β', col: C.cyan},
  {c: [0.602, -0.372, -0.372, 0.602], e: -0.618, txt: 'α − 0,62β', col: C.red},
  {c: [0.372, -0.602, 0.602, -0.372], e: -1.618, txt: 'α − 1,62β', col: C.red},
];
// tata letak
const EX = 270; // pusat garis etilena
const EC = 410; // lobus etilena pertama
const BX = 965; // pusat garis butadiena
const BC = 1120; // lobus butadiena pertama
const DX = 125;

export const Butadiene: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  // ---------- etilena ----------
  const eth = ramp(t, cue(0) - 0.4, cue(0) + 0.6);
  const split = ramp(t, wordOf(0, 'memberi') - 0.3, wordOf(0, 'memberi') + 1.0, EASE_IN_OUT);
  const eLab = [ramp(t, wordOf(0, 'ditambah') - 0.2, wordOf(0, 'ditambah') + 0.5), ramp(t, wordOf(0, 'dikurangi') - 0.2, wordOf(0, 'dikurangi') + 0.5)];
  const eEl = (k: number) => ramp(t, wordOf(0, 'dikurangi') + 0.5 + k * 0.3, wordOf(0, 'dikurangi') + 1.0 + k * 0.3);

  // ---------- butadiena ----------
  const bu = ramp(t, cue(1) - 0.4, cue(1) + 0.6);
  const spread = ramp(t, wordOf(1, 'pi') - 0.3, wordOf(1, 'pi') + 1.3, EASE_IN_OUT);
  const bLab = [wordOf(2, 'satu'), wordOf(2, 'nol'), wordOf(2, 'cerminnya'), wordOf(2, 'cerminnya') + 0.35].map((w) => ramp(t, w - 0.2, w + 0.5));
  const nodeT = [wordOf(3, 'tanpa'), wordOf(3, 'satu'), wordOf(3, 'dua'), wordOf(3, 'tiga')];
  const nodeP = nodeT.map((w) => ramp(t, w - 0.25, w + 0.5, BACK));
  const nodeLit = (i: number) => ramp(t, nodeT[i] - 0.25, nodeT[i] + 0.3) * (1 - ramp(t, nodeT[i] + 1.0, nodeT[i] + 1.8));
  const rule = slot(t, wordOf(3, 'Makin', 0) - 0.2, cue(4) + 0.3);
  const tFill = wordOf(4, 'Empat', 0);
  const bEl = (k: number) => ramp(t, tFill - 0.3 + k * 0.3, tFill + 0.2 + k * 0.3);
  const hl = ramp(t, tFill + 0.9, tFill + 1.5);
  const cmp = ramp(t, wordOf(4, 'lebih') - 0.4, wordOf(4, 'lebih') + 0.5);
  const card = slot(t, wordOf(4, 'rangkap') - 0.4, dur + 1);
  const sprd = ramp(t, wordOf(4, 'menyebar') - 0.4, wordOf(4, 'menyebar') + 0.6);
  const piStarDim = 1 - 0.8 * card;

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={1300} y={500} r={480} color="cyan" opacity={(0.06 + 0.03 * Math.sin(t * 0.8)) * bu} />
        <Glow x={420} y={500} r={340} color="gold" opacity={(0.05 + 0.03 * Math.sin(t)) * eth} />

        {/* garis α bersama */}
        <g opacity={eth}>
          <line x1={180} y1={YA} x2={Math.max(720, mix(720, 1730, bu))} y2={YA} stroke={C.muted} strokeWidth={2} strokeDasharray="8 10" strokeDashoffset={-t * 10} opacity={0.6} />
          <text x={150} y={YA} textAnchor="end" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={36} fill={C.muted}>
            α
          </text>
        </g>

        {/* ===== etilena ===== */}
        <g opacity={eth}>
          <Label x={470} y={212} size={32} color={C.ink} weight={700}>
            etilena
          </Label>
          <Label x={470} y={250} size={22} color={C.muted} opacity={1 - card}>
            2 orbital p → 2 orbital π
          </Label>
          {ETH.map((m, i) => {
            const y = mix(YA, yE(m.e), split);
            const c = i === 0 ? m.c : [m.c[0], mix(0.707, m.c[1], split)];
            const op = i === 1 ? piStarDim : 1;
            return (
              <g key={i} opacity={op}>
                <Lvl x={EX} y={y} w={120} color={m.col} p={split} t={t} lit={i === 0 ? 0.3 * cmp : 0} />
                <RichLabel x={EX - 78} y={y} parts={i === 0 ? [['π']] : [['π'], ['*', 'sup']]} size={34} color={m.col} anchor="end" font="serif" italic opacity={split} />
                <PChain x0={EC} y={y} dx={DX} c={c} L={90} opacity={i === 1 ? split : 1} />
                {i === 1 ? nodeXs(EC, DX, c).map((x, k) => <NodeLine key={k} x={x} y={y} p={split} t={t} h={60} />) : null}
                <text x={600} y={y} dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={32} fill={m.col} opacity={eLab[i]} style={{paintOrder: 'stroke', stroke: 'rgba(4,6,12,0.85)', strokeWidth: 4}}>
                  {m.txt}
                </text>
              </g>
            );
          })}
          <Pair x={EX} y={yE(1)} a={eEl(0)} b={eEl(1)} t={t} />
        </g>

        {/* garis bantu: tingkat π etilena (α + β) dibandingkan dengan butadiena */}
        <g opacity={cmp}>
          <line x1={705} y1={yE(1)} x2={mix(705, BX + 90, cmp)} y2={yE(1)} stroke={C.amber} strokeWidth={3} strokeDasharray="10 8" strokeDashoffset={-t * 18} />
          <Label x={790} y={yE(1) + 24} size={22} color={C.amber} weight={600}>
            π etilena (α + β)
          </Label>
        </g>

        {/* ===== butadiena ===== */}
        <g opacity={bu}>
          <Label x={BX} y={200} size={32} color={C.ink} weight={700}>
            butadiena
          </Label>
          {BUT.map((m, i) => {
            const y = mix(YA, yE(m.e), spread);
            const c = m.c.map((v) => mix(0.5, v, spread));
            const lit = nodeLit(i);
            const glow = (k: number) => 0.9 * lit + (i < 2 ? sprd * (0.35 + 0.65 * Math.max(0, Math.cos(2 * Math.PI * (k / 4 - t * 0.45)))) : 0);
            return (
              <g key={i}>
                <Lvl x={BX} y={y} w={130} color={m.col} p={spread} t={t} lit={Math.max(lit, i === 1 ? 0.6 * hl : 0, i === 2 ? 0.6 * hl : 0)} />
                <RichLabel x={BX - 84} y={y} parts={[['ψ'], [String(i + 1), 'sub']]} size={36} color={m.col} anchor="end" font="serif" italic opacity={spread} />
                <PChain x0={BC} y={y} dx={DX} c={c} L={90} glow={glow} />
                {nodeXs(BC, DX, m.c).map((x, k) => (
                  <NodeLine key={k} x={x} y={y} p={nodeP[i] * spread} t={t} h={58} />
                ))}
                <text x={BC + 3 * DX + 62} y={y} dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={32} fill={m.col} opacity={bLab[i]} style={{paintOrder: 'stroke', stroke: 'rgba(4,6,12,0.85)', strokeWidth: 4}}>
                  {m.txt}
                </text>
                <Label x={BX - 84} y={y + 32} size={20} color={C.red} anchor="end" opacity={nodeP[i] > 0 ? Math.min(1, nodeP[i]) : 0}>
                  {`${i} simpul`}
                </Label>
              </g>
            );
          })}
          <Pair x={BX} y={yE(1.618)} a={bEl(0)} b={bEl(1)} t={t} />
          <Pair x={BX} y={yE(0.618)} a={bEl(2)} b={bEl(3)} t={t} />
          <g opacity={hl}>
            <Label x={BX - 160} y={yE(0.618)} size={22} color={C.gold} weight={700} anchor="end" font="mono">
              HOMO
            </Label>
            <Label x={BX - 160} y={yE(-0.618)} size={22} color={C.mint} weight={700} anchor="end" font="mono">
              LUMO
            </Label>
          </g>
        </g>
      </Stage>
      <Badge x={470} y={835} text="simpul bertambah → energi naik" color={C.red} opacity={rule} />
      <Formula x={430} y={370} p={card} accent={C.mint} size={56} caption={<span>butadiena lebih rendah 0,47β · π menyebar</span>}>
        <span>
          4α + 4,47β <span style={{color: C.mint}}>&lt;</span> 4α + 4β
        </span>
      </Formula>
    </AbsoluteFill>
  );
};
