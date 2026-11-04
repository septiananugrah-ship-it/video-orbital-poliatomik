import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, ramp, rand} from '../anim';
import {DrawPath, Glow, Label, Stage} from '../components/primitives';
import {Level, TestTube} from '../components/grupD';
import {Spin} from '../components/vbD';
import {Render3D, VbDefs, ball, bond, cloud, pOrb, type Cam, type Item, type V3} from '../components/vbC';
import {Dot, Duo, MetalSurface, PoDefs, qbez, qpath} from '../components/poD';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 11: katalis — aliran elektron antar orbital perbatasan, kurva gunung berapi Sabatier,
// pita d menggeser titik, DFT di komputer, karbon terdoping nitrogen.

/* ------------------------- kurva Sabatier ------------------------- */
const VX0 = 640;
const VX1 = 1280;
const VY0 = 790;
const VH = 430;
const act = (u: number) => 1 - 1.7 * Math.sqrt((u - 0.5) ** 2 + 0.004);
const vpt = (u: number): [number, number] => [VX0 + u * (VX1 - VX0), VY0 - act(u) * VH];
const VOLCANO = 'M' + Array.from({length: 121}, (_, k) => vpt(0.02 + (0.96 * k) / 120).map((v) => v.toFixed(1)).join(',')).join(' L');

/* ------------------------- grafena ------------------------- */
type GAtom = {p: V3; n: number};
const GRAPH: {atoms: GAtom[]; bonds: [number, number][]} = (() => {
  const atoms: GAtom[] = [];
  const a1: [number, number] = [Math.sqrt(3), 0];
  const a2: [number, number] = [Math.sqrt(3) / 2, 1.5];
  for (let i = -8; i <= 8; i++)
    for (let j = -6; j <= 6; j++)
      for (const s of [0, 1]) {
        const x = i * a1[0] + j * a2[0];
        const y = i * a1[1] + j * a2[1] + (s ? 1 : 0);
        if (Math.abs(x) < 7.4 && Math.abs(y) < 4.2) atoms.push({p: [x, y, 0], n: 0});
      }
  const deg = (i: number) => atoms.filter((b) => Math.hypot(atoms[i].p[0] - b.p[0], atoms[i].p[1] - b.p[1]) < 1.05).length - 1;
  const keep = atoms.map((_, i) => deg(i) >= 2);
  const kept = atoms.filter((_, i) => keep[i]);
  atoms.length = 0;
  atoms.push(...kept);
  const bonds: [number, number][] = [];
  for (let a = 0; a < atoms.length; a++)
    for (let b = a + 1; b < atoms.length; b++) {
      const d = Math.hypot(atoms[a].p[0] - atoms[b].p[0], atoms[a].p[1] - atoms[b].p[1]);
      if (d < 1.05) bonds.push([a, b]);
    }
  // atom N: titik dekat sasaran tertentu
  const targets: [number, number][] = [
    [-3.5, 1],
    [0.0, -0.5],
    [3.4, 1.5],
    [-1.8, -2.6],
    [2.6, -2.4],
  ];
  targets.forEach(([tx, ty], k) => {
    let best = 0;
    let bd = 1e9;
    atoms.forEach((a, idx) => {
      const d = Math.hypot(a.p[0] - tx, a.p[1] - ty);
      if (d < bd) {
        bd = d;
        best = idx;
      }
    });
    atoms[best].n = k + 1;
  });
  return {atoms, bonds};
})();
const NIDX = GRAPH.atoms.map((a, i) => (a.n ? i : -1)).filter((i) => i >= 0);
const neighborsOf = (i: number) => GRAPH.bonds.filter(([a, b]) => a === i || b === i).map(([a, b]) => (a === i ? b : a));

export const Catalyst: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  // fase (silang-pudar)
  const pA = Math.min(ramp(t, -0.4, 0.6), 1 - ramp(t, cue(1) - 0.7, cue(1) - 0.1, EASE_IN_OUT));
  const pB = Math.min(ramp(t, cue(1) - 0.1, cue(1) + 0.6), 1 - ramp(t, cue(3) - 0.7, cue(3) - 0.1, EASE_IN_OUT));
  const pC = Math.min(ramp(t, cue(3) - 0.1, cue(3) + 0.6), 1 - ramp(t, cue(4) - 0.7, cue(4) - 0.1, EASE_IN_OUT));
  const pD = ramp(t, cue(4) - 0.1, cue(4) + 0.7);

  /* ---------------- fase A: permukaan + aliran elektron ---------------- */
  const land = ramp(t, 0.6, wordOf(0, 'aliran'), EASE_IN_OUT);
  const molY = 300 + 175 * land + 4 * Math.sin(t * 2.2) * land;
  const molX = 500 + 30 * (1 - land) * Math.sin(t * 1.3);
  const flow1 = ramp(t, wordOf(0, 'aliran'), wordOf(0, 'aliran') + 1.2);
  const flow2 = ramp(t, wordOf(0, 'perbatasan'), wordOf(0, 'perbatasan') + 1.2);
  const lumoMark = ramp(t, wordOf(0, 'orbital'), wordOf(0, 'orbital') + 0.6);
  const HOMO: [number, number] = [1200, 640];
  const LUMO: [number, number] = [1200, 370];
  const DB: [number, number] = [1590, 540];
  const DT: [number, number] = [1590, 460];
  const c1: [number, number] = [1400, 700];
  const c2: [number, number] = [1400, 330];

  /* ---------------- fase B: Sabatier ---------------- */
  const curve = ramp(t, cue(1) + 0.1, cue(1) + 1.8, EASE_IN_OUT);
  const weak = ramp(t, wordOf(1, 'lemah') - 0.3, wordOf(1, 'lemah') + 0.5, BACK);
  const strong = ramp(t, wordOf(1, 'kuat') - 0.3, wordOf(1, 'kuat') + 0.5, BACK);
  const vigOut = 1 - ramp(t, cue(2) - 0.6, cue(2), EASE_IN_OUT);
  const best = ramp(t, wordOf(2, 'terbaik') - 0.2, wordOf(2, 'terbaik') + 0.6, BACK);
  const vig2 = ramp(t, cue(2), cue(2) + 0.6);
  const dband = ramp(t, wordOf(2, 'posisi') - 0.3, wordOf(2, 'posisi') + 0.5);
  const tShift = Math.max(0, t - wordOf(2, 'posisi'));
  const shift = Math.sin(tShift * 1.1) * ramp(t, wordOf(2, 'posisi'), wordOf(2, 'posisi') + 1.4); // −1..1
  const uMove = 0.5 + 0.34 * shift;

  /* ---------------- fase C: DFT ---------------- */
  const steps = [cue(3) + 0.4, wordOf(3, 'komputer'), wordOf(3, 'mensintesis')].map((a) => ramp(t, a - 0.2, a + 0.6));
  const camC: Cam = {cx: 650, cy: 520, s: 120, yaw: t * 0.55, pitch: -0.35 + 0.12 * Math.sin(t * 0.4), persp: 8};
  const hl = 0.5 + 0.5 * Math.sin((t - cue(3)) * 0.9); // 1 = HOMO, 0 = LUMO (silang-pudar)
  const ethyl: V3[] = [
    [-0.67, 0, 0],
    [0.67, 0, 0],
  ];
  const hpos: V3[] = [
    [-1.25, 0.92, 0],
    [-1.25, -0.92, 0],
    [1.25, 0.92, 0],
    [1.25, -0.92, 0],
  ];
  const itemsC: (Item | null)[] = [];
  if (pC > 0.001) {
    itemsC.push(bond(camC, {a: ethyl[0], b: ethyl[1], order: 2, width: 0.12}));
    hpos.forEach((h, k) => itemsC.push(bond(camC, {a: ethyl[k < 2 ? 0 : 1], b: h, width: 0.1})));
    ethyl.forEach((c) => itemsC.push(ball(camC, {pos: c, el: 'C', r: 0.32, label: null})));
    hpos.forEach((h) => itemsC.push(ball(camC, {pos: h, el: 'H', r: 0.22, label: null})));
    // HOMO π: kedua p sefase; LUMO π*: fase berlawanan
    ethyl.forEach((c, k) => {
      itemsC.push(...pOrb(camC, {origin: c, dir: [0, 0, 1], len: 1.05, wid: 0.42, opacity: 0.8 * hl}));
      itemsC.push(...pOrb(camC, {origin: c, dir: [0, 0, k === 0 ? 1 : -1], len: 1.05, wid: 0.42, opacity: 0.8 * (1 - hl)}));
    });
  }

  /* ---------------- fase D: grafena + N ---------------- */
  const camD: Cam = {cx: 960, cy: 540, s: 80, yaw: 0.18 + 0.12 * Math.sin(t * 0.25), pitch: -0.95, persp: 14};
  const nOn = (k: number) => ramp(t, wordOf(4, 'nitrogen') - 0.6 + k * 0.28, wordOf(4, 'nitrogen') + k * 0.28, BACK);
  const glowOn = ramp(t, wordOf(4, 'kerangka'), wordOf(4, 'kerangka') + 1.2);
  const nearN = new Map<number, number>();
  NIDX.forEach((i) => neighborsOf(i).forEach((j) => nearN.set(j, Math.max(nearN.get(j) ?? 0, nOn(GRAPH.atoms[i].n - 1)))));
  const itemsD: (Item | null)[] = [];
  if (pD > 0.001) {
    GRAPH.bonds.forEach(([a, b]) => itemsD.push(bond(camD, {a: GRAPH.atoms[a].p, b: GRAPH.atoms[b].p, width: 0.11, color: '#7f8bb0'})));
    GRAPH.atoms.forEach((a, i) => {
      const nk = a.n ? nOn(a.n - 1) : 0;
      const pos: V3 = [a.p[0], a.p[1], 0.8 * (1 - nk)];
      itemsD.push(ball(camD, {pos: a.p, el: 'C', r: 0.24, label: null, opacity: 1 - nk}));
      if (a.n) itemsD.push(ball(camD, {pos, el: 'N', r: 0.36, label: 'N', opacity: nk}));
      const near = nearN.get(i) ?? 0;
      const g = Math.max(a.n ? nk : 0, near * 0.8) * glowOn;
      if (g > 0.01) {
        const pulse = 0.75 + 0.25 * Math.sin(t * 2.6 + i);
        itemsD.push(...pOrb(camD, {origin: a.p, dir: [0, 0, 1], len: 0.8, wid: 0.28, opacity: 0.45 * g * pulse}));
        itemsD.push(cloud(camD, {center: [a.p[0], a.p[1], 0], axis: [1, 0, 0], a: 0.75, b: 0.75, color: 'cyan', opacity: 0.25 * g * pulse}));
      }
    });
  }
  const siteIdx = neighborsOf(NIDX[1])[0];

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <PoDefs />
        <VbDefs />
        <Glow x={960} y={560} r={720} color="cyan" opacity={0.05 + 0.02 * Math.sin(t * 0.8)} />

        {/* ======================= FASE A ======================= */}
        {pA > 0.001 ? (
          <g opacity={pA}>
            <Glow x={500} y={560} r={360} color="cyan" opacity={0.12} />
            <MetalSurface cx={500} y={560} cols={9} rows={5} sp={78} r={30} t={t} lit={(i, j) => (i === 4 && j === 0 ? flow1 * (0.6 + 0.4 * Math.sin(t * 3)) : 0)} />
            {/* ikatan permukaan–molekul */}
            <line x1={molX} y1={molY + 16} x2={500} y2={548} stroke={C.cyan} strokeWidth={14} strokeOpacity={0.15 * flow1} strokeLinecap="round" />
            <line x1={molX} y1={molY + 16} x2={500} y2={548} stroke={C.cyan} strokeWidth={3} strokeDasharray="6 6" opacity={0.8 * flow1} />
            <Duo x={molX} y={molY} d={40} r={20} col={C.blue} rot={6 * Math.sin(t * 1.1)} />
            {/* elektron bolak-balik */}
            {[0, 1, 2, 3].map((k) => {
              const ph = (((t * 0.6 + k / 4) % 1) + 1) % 1;
              const down = k % 2 === 0;
              const u = down ? ph : 1 - ph;
              const x = molX + (down ? -26 : 26) * Math.sin(Math.PI * u);
              const y = molY + 18 + (548 - molY - 18) * u;
              return <Dot key={k} x={x} y={y} r={5} color={down ? C.gold : C.mint} opacity={(down ? flow1 : flow2) * cyc(ph)} />;
            })}
            <Label x={500} y={850} size={30} color={C.muted}>
              permukaan katalis (logam)
            </Label>
            <Label x={500} y={molY - 50} size={28} color={C.blue} opacity={1 - 0.5 * land}>
              pereaksi
            </Label>

            {/* diagram orbital perbatasan */}
            <g>
              <Level x1={1120} x2={1280} y={LUMO[1]} color={C.mint} lit={lumoMark} />
              <Level x1={1120} x2={1280} y={HOMO[1]} color={C.gold} lit={lumoMark} />
              <Spin x={1185} y={HOMO[1] - 2 + 2 * Math.sin(t * 3)} up len={36} width={4} />
              <Spin x={1215} y={HOMO[1] - 2 - 2 * Math.sin(t * 3)} up={false} len={36} width={4} />
              <Label x={1100} y={LUMO[1]} size={30} anchor="end" color={C.mint} weight={700}>
                LUMO
              </Label>
              <Label x={1100} y={HOMO[1]} size={30} anchor="end" color={C.gold} weight={700}>
                HOMO
              </Label>
              <Label x={1200} y={760} size={30} color={C.blue}>
                pereaksi
              </Label>
              {/* pita d logam */}
              <rect x={1500} y={430} width={180} height={140} rx={10} fill={C.blue} opacity={0.12} />
              {Array.from({length: 9}, (_, k) => (
                <line key={k} x1={1515} x2={1665} y1={440 + k * 15} y2={440 + k * 15} stroke={k >= 3 ? C.blue : C.muted} strokeWidth={3} opacity={0.75} />
              ))}
              <line x1={1490} x2={1690} y1={477} y2={477} stroke={C.ink} strokeWidth={2} strokeDasharray="8 6" opacity={0.6} />
              <Label x={1590} y={605} size={28} color={C.blue}>
                orbital d logam
              </Label>
              <Label x={1590} y={760} size={30} color={C.muted}>
                katalis
              </Label>
              <DrawPath d={qpath(HOMO, c1, DB)} p={flow1} stroke={C.gold} width={5} len={700} />
              <DrawPath d={qpath(DT, c2, LUMO)} p={flow2} stroke={C.mint} width={5} len={700} />
              {[0, 1, 2].map((k) => {
                const ph = (((t * 0.45 + k / 3) % 1) + 1) % 1;
                const [x1, y1] = qbez(HOMO, c1, DB, ph);
                const [x2, y2] = qbez(DT, c2, LUMO, ph);
                return (
                  <g key={k}>
                    <Dot x={x1} y={y1} r={7} color={C.gold} opacity={flow1 * cyc(ph)} />
                    <Dot x={x2} y={y2} r={7} color={C.mint} opacity={flow2 * cyc(ph)} />
                  </g>
                );
              })}
              <Label x={1400} y={725} size={28} color={C.gold} opacity={flow1}>
                donasi
              </Label>
              <Label x={1400} y={315} size={28} color={C.mint} opacity={flow2}>
                donasi balik
              </Label>
            </g>
          </g>
        ) : null}

        {/* ======================= FASE B ======================= */}
        {pB > 0.001 ? (
          <g opacity={pB}>
            {/* sumbu */}
            <line x1={VX0 - 20} y1={VY0} x2={VX1 + 40} y2={VY0} stroke={C.muted} strokeWidth={3} />
            <path d={`M${VX1 + 50},${VY0} l-16,-9 l0,18 Z`} fill={C.muted} />
            <line x1={VX0 - 20} y1={VY0} x2={VX0 - 20} y2={VY0 - VH - 60} stroke={C.muted} strokeWidth={3} />
            <path d={`M${VX0 - 20},${VY0 - VH - 70} l-9,16 l18,0 Z`} fill={C.muted} />
            <Label x={(VX0 + VX1) / 2} y={VY0 + 40} size={28} color={C.muted}>
              kekuatan ikatan pereaksi–permukaan →
            </Label>
            <g transform={`rotate(-90 ${VX0 - 50} ${VY0 - VH / 2})`}>
              <Label x={VX0 - 50} y={VY0 - VH / 2} size={28} color={C.muted}>
                aktivitas katalis
              </Label>
            </g>
            <path d={`${VOLCANO} L${vpt(0.98)[0]},${VY0} L${vpt(0.02)[0]},${VY0} Z`} fill={C.gold} opacity={0.07 * curve} />
            <DrawPath d={VOLCANO} p={curve} stroke={C.gold} width={6} len={1600} />
            {/* label wilayah */}
            <Label x={VX0 + 120} y={VY0 - VH + 40} size={28} color={C.cyan} opacity={weak * (0.6 + 0.4 * vigOut)}>
              terlalu lemah
            </Label>
            <Label x={VX1 - 100} y={VY0 - VH + 40} size={28} color={C.red} opacity={strong * (0.6 + 0.4 * vigOut)}>
              terlalu kuat
            </Label>
            {/* titik */}
            {[
              [0.14, weak, C.cyan],
              [0.86, strong, C.red],
            ].map(([u, p, col], k) => {
              const [x, y] = vpt(u as number);
              return (
                <g key={k} opacity={(p as number) * (1 - 0.55 * dband)}>
                  <circle cx={x} cy={y} r={26} fill={col as string} opacity={0.18 + 0.08 * Math.sin(t * 3 + k)} />
                  <circle cx={x} cy={y} r={12} fill={col as string} />
                </g>
              );
            })}
            {(() => {
              const [x, y] = vpt(0.5);
              return (
                <g opacity={best}>
                  <circle cx={x} cy={y} r={40 + 6 * Math.sin(t * 3)} fill={C.gold} opacity={0.2} />
                  <circle cx={x} cy={y} r={14} fill={C.gold} />
                  <Label x={x} y={y - 56} size={32} color={C.gold} weight={700}>
                    terbaik di tengah
                  </Label>
                </g>
              );
            })()}
            {/* titik yang digeser pita d */}
            {(() => {
              const [x, y] = vpt(uMove);
              return (
                <g opacity={dband}>
                  <line x1={x} y1={y} x2={x} y2={VY0} stroke={C.blue} strokeWidth={2} strokeDasharray="5 6" opacity={0.6} />
                  <circle cx={x} cy={y} r={30} fill={C.blue} opacity={0.25} />
                  <circle cx={x} cy={y} r={13} fill={C.blue} stroke="#fff" strokeWidth={3} />
                </g>
              );
            })()}

            {/* vignet kiri: terlalu lemah (memantul) */}
            <g opacity={weak * vigOut}>
              <rect x={90} y={330} width={420} height={460} rx={22} fill="rgba(12,18,40,0.7)" stroke={C.cyan} strokeOpacity={0.5} strokeWidth={2} />
              <Label x={300} y={375} size={30} color={C.cyan} weight={700}>
                terlalu lemah
              </Label>
              <MetalSurface cx={300} y={640} cols={5} rows={3} sp={66} r={24} t={t} />
              {(() => {
                const ph = (((t - wordOf(1, 'lemah')) * 0.55) % 1 + 1) % 1;
                const h = Math.abs(Math.cos(Math.PI * ph));
                const y = 612 - 170 * h;
                const hit = Math.max(0, 1 - Math.abs(ph - 0.5) * 8);
                return (
                  <g>
                    <ellipse cx={300} cy={624} rx={30 + 60 * hit} ry={8 + 12 * hit} fill="none" stroke={C.cyan} strokeWidth={2} opacity={0.6 * hit} />
                    <Duo x={300 + 40 * Math.sin(t * 0.9)} y={y} d={34} r={16} col={C.blue} rot={40 * Math.sin(t * 2)} />
                  </g>
                );
              })()}
              <Label x={300} y={750} size={28} color={C.ink}>
                tidak menempel
              </Label>
            </g>
            {/* vignet kanan: terlalu kuat (tertancap) */}
            <g opacity={strong * vigOut}>
              <rect x={1410} y={330} width={420} height={460} rx={22} fill="rgba(12,18,40,0.7)" stroke={C.red} strokeOpacity={0.5} strokeWidth={2} />
              <Label x={1620} y={375} size={30} color={C.red} weight={700}>
                terlalu kuat
              </Label>
              <MetalSurface cx={1620} y={640} cols={5} rows={3} sp={66} r={24} t={t} lit={(i, j) => (j === 0 && (i === 1 || i === 3) ? 0.5 : 0)} />
              {[-1, 1].map((s) => {
                const x = 1620 + s * 40 + 1.5 * Math.sin(t * 9 + s);
                return (
                  <g key={s}>
                    <line x1={x} y1={598} x2={1620 + s * 40 - 8} y2={630} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
                    <circle cx={x} cy={594} r={16} fill={C.violet} />
                    <ellipse cx={x - 5} cy={589} rx={5} ry={3} fill="#fff" opacity={0.5} />
                  </g>
                );
              })}
              {/* pereaksi baru datang lalu tertolak karena situs penuh */}
              {(() => {
                const ph = (((t - wordOf(1, 'kuat')) * 0.4) % 1 + 1) % 1;
                const y = 430 + 110 * Math.sin(Math.PI * ph);
                return <Duo x={1620 + 90 * Math.cos(t * 0.8)} y={y} d={30} r={14} col={C.blue} rot={30 * Math.sin(t * 1.7)} opacity={0.75 * cyc(ph)} />;
              })()}
              <Label x={1620} y={750} size={28} color={C.ink}>
                produk tidak lepas
              </Label>
            </g>

            {/* kiri (baris 2): pita d logam bergeser */}
            <g opacity={dband * vig2}>
              <rect x={90} y={330} width={420} height={460} rx={22} fill="rgba(12,18,40,0.7)" stroke={C.blue} strokeOpacity={0.6} strokeWidth={2} />
              <Label x={300} y={375} size={30} color={C.blue} weight={700}>
                posisi orbital d logam
              </Label>
              <line x1={170} y1={590} x2={430} y2={590} stroke={C.ink} strokeWidth={2} strokeDasharray="8 6" opacity={0.6} />
              <Label x={440} y={566} size={22} color={C.muted} anchor="end">
                tingkat Fermi
              </Label>
              {(() => {
                const cy = 600 - 70 * shift;
                return (
                  <g>
                    <rect x={210} y={cy - 60} width={180} height={120} rx={12} fill={C.blue} opacity={0.18} />
                    {Array.from({length: 7}, (_, k) => (
                      <line key={k} x1={225} x2={375} y1={cy - 45 + k * 15} y2={cy - 45 + k * 15} stroke={C.blue} strokeWidth={3} opacity={0.8} />
                    ))}
                    <path d={`M140,${cy} l0,${-40} l-10,14 M140,${cy - 40} l10,14`} stroke={C.ink} strokeWidth={3} fill="none" opacity={0.5 + 0.5 * Math.max(0, Math.cos(tShift * 1.1))} />
                    <path d={`M140,${cy + 6} l0,40 l-10,-14 M140,${cy + 46} l10,-14`} stroke={C.ink} strokeWidth={3} fill="none" opacity={0.5 + 0.5 * Math.max(0, -Math.cos(tShift * 1.1))} />
                  </g>
                );
              })()}
              <Label x={300} y={740} size={26} color={C.ink}>
                naik → ikatan lebih kuat
              </Label>
            </g>
            {/* kanan (baris 2): katalis terbaik — menempel, bereaksi, lepas */}
            <g opacity={best * vig2}>
              <rect x={1410} y={330} width={420} height={460} rx={22} fill="rgba(12,18,40,0.7)" stroke={C.gold} strokeOpacity={0.6} strokeWidth={2} />
              <Label x={1620} y={375} size={30} color={C.gold} weight={700}>
                pas di tengah
              </Label>
              <MetalSurface cx={1620} y={640} cols={5} rows={3} sp={66} r={24} t={t} />
              {(() => {
                const ph = (((t - wordOf(2, 'terbaik')) * 0.3) % 1 + 1) % 1;
                const down = ramp(ph, 0, 0.3, EASE_IN_OUT);
                const sp = ramp(ph, 0.35, 0.6, EASE_IN_OUT);
                const up = ramp(ph, 0.65, 1, EASE_IN_OUT);
                const y = 440 + 158 * down - 200 * up;
                return (
                  <g opacity={cyc(ph)}>
                    <Duo x={1620} y={y} d={34} r={16} col={C.blue} col2={C.blue} split={0} opacity={1 - sp} />
                    <Duo x={1620} y={y} d={34} r={16} col={C.violet} col2={C.violet} split={10} opacity={sp} />
                  </g>
                );
              })()}
              <Label x={1620} y={750} size={28} color={C.ink}>
                menempel → bereaksi → lepas
              </Label>
            </g>
          </g>
        ) : null}

        {/* ======================= FASE C ======================= */}
        {pC > 0.001 ? (
          <g opacity={pC}>
            {/* monitor */}
            <rect x={232} y={218} width={836} height={556} rx={26} fill="#1a2240" stroke="#55628f" strokeWidth={3} />
            <rect x={260} y={246} width={780} height={500} rx={12} fill="url(#po-screen)" />
            <path d={`M600,774 L700,774 L730,840 L570,840 Z`} fill="#2a3352" />
            <rect x={520} y={836} width={260} height={14} rx={6} fill="#3a4466" />
            {/* kisi layar */}
            {Array.from({length: 9}, (_, k) => (
              <line key={k} x1={260 + k * 97.5} y1={310} x2={260 + k * 97.5} y2={746} stroke={C.cyan} strokeOpacity={0.06} strokeWidth={1} />
            ))}
            <Render3D items={itemsC} />
            {/* label HOMO / LUMO silang-pudar */}
            <Label x={300} y={350} size={32} anchor="start" color={C.gold} weight={700} opacity={hl}>
              HOMO · π
            </Label>
            <Label x={300} y={350} size={32} anchor="start" color={C.mint} weight={700} opacity={1 - hl}>
              LUMO · π*
            </Label>
            {/* bilah proses */}
            <rect x={300} y={700} width={700} height={14} rx={7} fill="#1c2748" />
            <rect x={300} y={700} width={700 * ((((t - cue(3)) * 0.22) % 1 + 1) % 1)} height={14} rx={7} fill={C.cyan} opacity={0.8} />
            {/* garis kode menggulir */}
            {Array.from({length: 5}, (_, k) => {
              const ph = (((t * 0.35 + k / 5) % 1) + 1) % 1;
              return <rect key={k} x={860} y={660 - ph * 260} width={60 + 80 * rand(k + 3)} height={7} rx={3} fill={C.cyan} opacity={0.35 * cyc(ph)} />;
            })}
            {/* jalur kanan */}
            {[0, 1].map((k) => (
              <DrawPath key={k} d={`M1290,${400 + k * 175} L1290,${470 + k * 175}`} p={steps[k + 1]} stroke={C.muted} width={3} len={80} dash="6 6" />
            ))}
            <g opacity={steps[0]}>
              <rect x={1224} y={316} width={132} height={86} rx={10} fill="#1a2240" stroke={C.cyan} strokeWidth={2} />
              <circle cx={1290} cy={358} r={22} fill={C.gold} opacity={0.5 + 0.3 * Math.sin(t * 3)} />
              <circle cx={1290} cy={358} r={10} fill={C.violet} opacity={0.8} />
            </g>
            <g opacity={steps[1]}>
              {[0, 1, 2, 3].map((k) => {
                const h = [40, 70, 30, 55][k] * (0.85 + 0.15 * Math.sin(t * 2 + k));
                return <rect key={k} x={1232 + k * 30} y={580 - h} width={22} height={h} rx={4} fill={k === 1 ? C.gold : C.muted} opacity={k === 1 ? 1 : 0.6} />;
              })}
            </g>
            <TestTube x={1290} y={720} w={60} h={150} color={C.mint} t={t} opacity={steps[2]} fill={0.8} />
          </g>
        ) : null}

        {/* ======================= FASE D ======================= */}
        {pD > 0.001 ? (
          <g opacity={pD}>
            <Glow x={960} y={600} r={560} color="cyan" opacity={0.1 * glowOn} />
            <Render3D items={itemsD} />
            {(() => {
              const a = GRAPH.atoms[siteIdx].p;
              const ph = (((t - wordOf(4, 'kerangka')) * 0.28) % 1 + 1) % 1;
              const h = 2.6 - 1.7 * ramp(ph, 0, 0.45, EASE_IN_OUT) + 1.6 * ramp(ph, 0.7, 1, EASE_IN_OUT);
              const items = [ball(camD, {pos: [a[0] - 0.3, a[1], h], el: 'O', r: 0.26, label: null}), ball(camD, {pos: [a[0] + 0.3, a[1], h], el: 'O', r: 0.26, label: null})];
              return <Render3D items={items} opacity={glowOn * cyc(ph)} />;
            })()}
          </g>
        ) : null}
      </Stage>

      {/* HTML di luar Stage */}
      {pC > 0.001 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: 650,
              top: 282,
              transform: 'translate(-50%,-50%)',
              opacity: pC * ramp(t, wordOf(3, 'fungsional') - 0.3, wordOf(3, 'fungsional') + 0.5),
              fontFamily: FONT.sans,
              fontSize: 30,
              fontWeight: 700,
              color: C.cyan,
              whiteSpace: 'nowrap',
              letterSpacing: 1,
            }}
          >
            teori fungsional kerapatan (DFT)
          </div>
          {['hitung orbital di komputer', 'pilih calon terbaik', 'baru disintesis di lab'].map((s, k) => (
            <div
              key={s}
              style={{
                position: 'absolute',
                left: 1390,
                top: [358, 545, 720][k],
                transform: `translate(${(1 - steps[k]) * -20}px,-50%)`,
                opacity: pC * steps[k],
                fontFamily: FONT.sans,
                fontSize: 32,
                color: [C.cyan, C.gold, C.mint][k],
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{color: C.muted, fontWeight: 400, marginRight: 12}}>{k + 1}</span>
              {s}
            </div>
          ))}
        </>
      ) : null}
      {pD > 0.001 ? (
        <>
          <div
            style={{
              position: 'absolute',
              right: 110,
              top: 196,
              opacity: pD * ramp(t, wordOf(4, 'nitrogen') - 0.2, wordOf(4, 'nitrogen') + 0.6),
              padding: '14px 26px',
              borderRadius: 16,
              background: 'rgba(10,16,36,0.82)',
              border: `1px solid ${C.blue}88`,
              fontFamily: FONT.sans,
              fontSize: 32,
              color: C.ink,
              whiteSpace: 'nowrap',
            }}
          >
            karbon terdoping <span style={{color: C.blue, fontWeight: 700}}>nitrogen</span>
            <div style={{fontSize: 26, color: C.muted, marginTop: 4}}>orbital di sekitar N menjadi situs aktif</div>
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
