import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, ramp, slot} from '../anim';
import {DrawPath, Formula, Glow, Label, Stage, Part} from '../components/primitives';
import {Lvl, Pair, circlePath} from '../components/poB';
import {Render3D, VbDefs, ball, bond, pOrb, proj, type Cam, type Item, type V3} from '../components/vbC';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 07: benzena — 6 orbital p → 6 orbital π; lingkaran Frost (segi enam, satu sudut di bawah):
// α + 2β, α + β (×2), α − β (×2), α − 2β; 6 e⁻ di 3 MO ikatan; MO terendah = donat sefase; stabil 2β ≈ 150 kJ/mol.
const RC = 1.4;
const ring: V3[] = Array.from({length: 6}, (_, k) => [RC * Math.cos((k * Math.PI) / 3), RC * Math.sin((k * Math.PI) / 3), 0]);
const hyd: V3[] = ring.map((p) => [p[0] * 1.57, p[1] * 1.57, 0]);

const FX = 1130;
const FY = 520;
const FR = 200;
// sudut segi enam (sudut layar, y ke bawah): k=0 di bawah, lalu berputar
const VX = Array.from({length: 6}, (_, k) => {
  const a = Math.PI / 2 + (k * Math.PI) / 3;
  return {x: FX + FR * Math.cos(a), y: FY + FR * Math.sin(a), k};
});
// urutan tingkat dari bawah: 0 (α+2β), 1 & 5 (α+β), 2 & 4 (α−β), 3 (α−2β)
const LEVEL_OF = [0, 1, 2, 3, 2, 1];
const LABELS = [
  {y: FY + FR, txt: 'α + 2β', col: C.cyan},
  {y: FY + FR / 2, txt: 'α + β', col: C.cyan},
  {y: FY - FR / 2, txt: 'α − β', col: C.red},
  {y: FY - FR, txt: 'α − 2β', col: C.red},
];
const HEX = (() => {
  const pts = [0, 1, 2, 3, 4, 5, 0].map((k) => VX[k]);
  return 'M' + pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L');
})();

const torus = (cam: Cam, z: number) => {
  const pts = Array.from({length: 73}, (_, i) => {
    const a = (i / 72) * 2 * Math.PI;
    const p = proj([RC * Math.cos(a), RC * Math.sin(a), z], cam);
    return `${p.X.toFixed(1)},${p.Y.toFixed(1)}`;
  });
  return 'M' + pts.join(' L') + ' Z';
};

export const Benzene: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  // ---------- cincin 3D ----------
  const rIn = ramp(t, cue(0) - 0.5, cue(0) + 0.6);
  const pIn = ramp(t, wordOf(0, 'orbital', 0) - 0.3, wordOf(0, 'orbital', 0) + 0.7, BACK);
  const donut = ramp(t, wordOf(3, 'tiga') - 0.3, wordOf(3, 'tiga') + 1.0, EASE_IN_OUT);
  const cam: Cam = {cx: 400, cy: 535, s: 132, yaw: 0.3 + 0.17 * t, pitch: -0.5};
  const breathe = 1 + 0.05 * Math.sin(t * 2.2);
  const items: Item[] = [
    ...ring.map((p, k) => bond(cam, {a: p, b: ring[(k + 1) % 6], width: 0.12, opacity: 0.85})),
    ...ring.map((p, k) => bond(cam, {a: p, b: hyd[k], width: 0.08, opacity: 0.6})),
    ...ring.map((p) => ball(cam, {pos: p, el: 'C', r: 0.26, label: null})),
    ...hyd.map((p) => ball(cam, {pos: p, el: 'H', r: 0.17, label: null, opacity: 0.85})),
    ...(pIn > 0.01 ? ring.flatMap((p, k) => pOrb(cam, {origin: p, dir: [0, 0, 1], len: 0.8 * pIn, wid: 0.3, opacity: 0.8 * (1 - donut), glow: 0.4 + 0.3 * Math.sin(t * 2 + k)})) : []),
  ].filter((x): x is Item => !!x);
  const tw = 0.62 * cam.s * breathe;

  // ---------- lingkaran Frost ----------
  const hexP = ramp(t, wordOf(1, 'segi') - 0.2, wordOf(1, 'segi') + 1.4, EASE_IN_OUT);
  const cirP = ramp(t, wordOf(1, 'lingkaran') - 0.2, wordOf(1, 'lingkaran') + 1.2, EASE_IN_OUT);
  const down = ramp(t, wordOf(1, 'bawah') - 0.3, wordOf(1, 'bawah') + 0.4) * (1 - ramp(t, wordOf(1, 'bawah') + 1.2, wordOf(1, 'bawah') + 2));
  const tS = wordOf(1, 'Setiap');
  const lvP = (lev: number) => ramp(t, tS - 0.2 + lev * 0.35, tS + 0.4 + lev * 0.35, BACK);
  const aLine = ramp(t, tS - 0.2, tS + 0.6);
  const lab = [wordOf(2, 'ditambah', 0), wordOf(2, 'ditambah', 1), wordOf(2, 'dikurangi', 0), wordOf(2, 'dikurangi', 1)].map((w) => ramp(t, w - 0.2, w + 0.5));
  const tE = wordOf(3, 'Enam');
  const tIk = wordOf(3, 'ikatan', 0);
  const fill = (k: number) => ramp(t, (k < 2 ? tE + k * 0.35 : tE + 0.8 + ((tIk - tE - 0.8) * (k - 2)) / 4) - 0.2, (k < 2 ? tE + k * 0.35 : tE + 0.8 + ((tIk - tE - 0.8) * (k - 2)) / 4) + 0.4);
  const empty = ramp(t, wordOf(3, 'Tidak') - 0.3, wordOf(3, 'Tidak') + 0.5);
  const lowLit = donut;

  // ---------- perbandingan & kartu ----------
  const ghost = ramp(t, wordOf(4, 'rangkap') - 0.3, wordOf(4, 'rangkap') + 0.7);
  const brk = ramp(t, wordOf(4, 'dua') - 0.3, wordOf(4, 'dua') + 0.6, BACK);
  const card = slot(t, wordOf(4, 'seratus') - 0.4, dur + 1);
  const capP = ramp(t, wordOf(4, 'resonansi') - 0.3, wordOf(4, 'resonansi') + 0.5);
  const pair = (i: number) => VX[i];

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <VbDefs />
        <Glow x={400} y={535} r={380} color="gold" opacity={(0.07 + 0.03 * Math.sin(t)) * rIn} />
        <Glow x={FX} y={FY} r={340} color="cyan" opacity={(0.05 + 0.03 * Math.sin(t * 0.8)) * hexP} />

        {/* ===== cincin benzena 3D ===== */}
        <g opacity={rIn}>
          {/* donat bawah (fase −) */}
          <path d={torus(cam, -0.5)} fill="none" stroke={C.violet} strokeWidth={tw} strokeLinejoin="round" opacity={0.3 * donut} />
          <path d={torus(cam, -0.5)} fill="none" stroke={C.violet} strokeWidth={tw * 0.4} strokeLinejoin="round" opacity={0.35 * donut} />
          <Render3D items={items} />
          {/* donat atas (fase +) */}
          <path d={torus(cam, 0.5)} fill="none" stroke={C.gold} strokeWidth={tw} strokeLinejoin="round" opacity={0.3 * donut} />
          <path d={torus(cam, 0.5)} fill="none" stroke={C.gold} strokeWidth={tw * 0.4} strokeLinejoin="round" opacity={0.4 * donut} />
          <Label x={400} y={830} size={28} color={C.amber} weight={600} opacity={pIn * (1 - donut)}>
            6 orbital p → 6 orbital π
          </Label>
          <Label x={400} y={830} size={28} color={C.gold} weight={600} opacity={donut}>
            MO terendah: semua sefase
          </Label>
        </g>

        {/* ===== lingkaran Frost ===== */}
        <DrawPath d={circlePath(FX, FY, FR)} p={cirP} stroke={C.muted} width={3} opacity={0.75} len={1400} />
        <DrawPath d={HEX} p={hexP} stroke={C.ink} width={3.5} opacity={0.85} len={1300} />
        <circle cx={VX[0].x} cy={VX[0].y} r={22 + 8 * Math.sin(t * 6)} fill="none" stroke={C.gold} strokeWidth={4} opacity={down} />
        <g opacity={aLine}>
          <line x1={FX - FR - 60} y1={FY} x2={FX + FR + 60} y2={FY} stroke={C.muted} strokeWidth={2} strokeDasharray="8 10" strokeDashoffset={-t * 10} opacity={0.7} />
          <text x={FX + FR + 84} y={FY} dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={34} fill={C.muted}>
            α
          </text>
        </g>
        {VX.map((v) => {
          const lev = LEVEL_OF[v.k];
          const col = lev < 2 ? C.cyan : C.red;
          return (
            <g key={v.k}>
              <circle cx={v.x} cy={v.y} r={7} fill={col} opacity={hexP} />
              <Lvl x={v.x} y={v.y} w={96} color={lev === 0 ? C.cyan : col} p={lvP(lev)} t={t} lit={lev === 0 ? lowLit : lev >= 2 ? 0.5 * empty * (0.6 + 0.4 * Math.sin(t * 4)) : 0} />
            </g>
          );
        })}
        {LABELS.map((L, i) => (
          <text key={i} x={FX + FR + 84} y={L.y} dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={34} fill={L.col} opacity={lab[i]} style={{paintOrder: 'stroke', stroke: 'rgba(4,6,12,0.85)', strokeWidth: 4}}>
            {L.txt}
          </text>
        ))}
        <Label x={FX} y={FY - FR - 46} size={22} color={C.red} opacity={empty * (1 - ramp(t, cue(4) - 0.4, cue(4) + 0.3))}>
          antiikatan: kosong
        </Label>
        {/* elektron: 2 di α+2β, lalu ↑ ↑ ↓ ↓ di pasangan degenerat (Hund) */}
        <Pair x={pair(0).x} y={pair(0).y} a={fill(0)} b={fill(1)} t={t} />
        <Pair x={pair(1).x} y={pair(1).y} a={fill(2)} b={fill(4)} t={t} />
        <Pair x={pair(5).x} y={pair(5).y} a={fill(3)} b={fill(5)} t={t} />

        {/* tiga ikatan rangkap terpisah: α + β */}
        <g opacity={ghost}>
          <line x1={FX - FR - 70} y1={FY + FR / 2} x2={FX + FR * 0.87 + 50} y2={FY + FR / 2} stroke={C.amber} strokeWidth={3} strokeDasharray="10 8" strokeDashoffset={-t * 18} />
          <Label x={FX} y={FY + FR / 2 - 26} size={22} color={C.amber} weight={600}>
            3 C=C terpisah
          </Label>
        </g>
        <g opacity={brk} transform={`translate(${FX - FR - 70} 0)`}>
          <line x1={0} y1={FY + FR / 2 + 6} x2={0} y2={FY + FR - 8} stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
          <path d={`M-11,${FY + FR - 26} L0,${FY + FR - 6} L11,${FY + FR - 26} Z`} fill={C.gold} />
          <text x={-18} y={FY + FR * 0.75} textAnchor="end" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={34} fill={C.gold} style={{paintOrder: 'stroke', stroke: 'rgba(4,6,12,0.85)', strokeWidth: 4}}>
            2e⁻ × β
          </text>
        </g>
      </Stage>
      <Formula
        x={FX}
        y={212}
        p={card}
        accent={C.gold}
        size={56}
        caption={<Part p={capP}>= energi resonansi (video ikatan valensi)</Part>}
      >
        <span>
          lebih stabil <span style={{color: C.gold}}>2|β|</span> ≈ 150 kJ/mol
        </span>
      </Formula>
    </AbsoluteFill>
  );
};
