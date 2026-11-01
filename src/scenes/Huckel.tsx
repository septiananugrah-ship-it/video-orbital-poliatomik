import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Formula, Glow, Label, Stage, Sub} from '../components/primitives';
import {Check, EAxis, XMark} from '../components/moB';
import {ArcLink, Lvl, Medallion, Pair, arcMid} from '../components/poB';
import {Render3D, VbDefs, ball, bond, pOrb, proj, type Cam, type Item, type V3} from '../components/vbC';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 05: metode Hückel — lencana 1931; kerangka σ redup, orbital p tegak menyala (hanya elektron π);
// α (energi p satu C), β (interaksi tetangga), tak bertetangga = 0; α + β di bawah α karena β < 0.
const CS: V3[] = [
  [-1.85, -0.36, 0],
  [-0.62, 0.36, 0],
  [0.62, -0.36, 0],
  [1.85, 0.36, 0],
];
const HS: [V3, number][] = [
  [[-2.8, 0.2, 0], 0],
  [[-1.88, -1.45, 0], 0],
  [[-0.6, 1.45, 0], 1],
  [[0.6, -1.45, 0], 2],
  [[2.8, -0.2, 0], 3],
  [[1.88, 1.45, 0], 3],
];
const PL = 0.95;

export const Huckel: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  // lencana: besar di tengah → kecil di pojok kanan atas
  const med = ramp(t, wordOf(0, 'Erich') - 0.6, wordOf(0, 'Erich') + 0.5, BACK);
  const mv = ramp(t, cue(1) - 0.9, cue(1) + 0.3, EASE_IN_OUT);
  const mol = mv;

  // molekul
  const sigDim = ramp(t, wordOf(1, 'pisahkan') - 0.3, wordOf(1, 'sigma') + 0.4, EASE_IN_OUT);
  const pOn = ramp(t, wordOf(1, 'hanya') - 0.4, wordOf(1, 'hanya') + 0.7, BACK);
  const pPre = ramp(t, wordOf(1, 'pi', 1) - 0.4, wordOf(1, 'pi', 1) + 0.6);
  const cam: Cam = {cx: 760, cy: 585, s: 150, yaw: -0.1 + 0.1 * Math.sin(t * 0.27), pitch: -0.62};
  const pLen = PL * Math.max(pOn, 0.0001);
  const glowAlpha = ramp(t, wordOf(2, 'Alfa') - 0.3, wordOf(2, 'Alfa') + 0.4) * (1 - ramp(t, cue(3) - 0.2, cue(3) + 0.4));
  const items: Item[] = [
    ...CS.slice(0, 3).map((c, i) => bond(cam, {a: c, b: CS[i + 1], width: 0.12, opacity: 1 - 0.65 * sigDim, order: i === 1 ? 1 : 2})),
    ...HS.map(([h, k]) => bond(cam, {a: CS[k], b: h, width: 0.09, opacity: 1 - 0.7 * sigDim})),
    ...CS.map((c) => ball(cam, {pos: c, el: 'C', r: 0.3, opacity: 1 - 0.45 * sigDim})),
    ...HS.map(([h]) => ball(cam, {pos: h, el: 'H', r: 0.2, label: null, opacity: 1 - 0.65 * sigDim})),
    ...(pOn > 0.01
      ? CS.flatMap((c, k) => pOrb(cam, {origin: c, dir: [0, 0, 1], len: pLen, wid: 0.34, opacity: 0.82, glow: 0.4 + 0.3 * Math.sin(t * 2.2 + k) + (k === 0 ? 1.4 * glowAlpha : 0)}))
      : []),
  ].filter((x): x is Item => !!x);
  const tips = CS.map((c) => proj([c[0], c[1], PL * 0.95], cam));
  const ctr = CS.map((c) => proj(c, cam));

  // parameter
  const tA = wordOf(2, 'Alfa');
  const tB = wordOf(2, 'Beta');
  const cA = slot(t, tA - 0.3, tB - 0.1);
  const cB = slot(t, tB - 0.1, cue(3));
  const c0 = slot(t, cue(3) + 0.1, cue(4) - 0.1);
  const betaArc = (i: number) => ramp(t, tB + 0.2 + i * 0.35, tB + 0.8 + i * 0.35) * (1 - 0.6 * ramp(t, cue(4) - 0.3, cue(4) + 0.4));
  const zeroP = (i: number) => ramp(t, wordOf(3, 'tidak', 0) - 0.3 + i * 0.4, wordOf(3, 'tidak', 0) + 0.4 + i * 0.4) * (1 - ramp(t, cue(4) - 0.3, cue(4) + 0.3, EASE_IN_OUT));

  // sumbu energi
  const en = ramp(t, cue(4) - 0.4, cue(4) + 0.6);
  const yA = 440;
  const yB = 440 + 190 * ramp(t, wordOf(4, 'ditambah') - 0.3, wordOf(4, 'ditambah') + 0.8, EASE_IN_OUT);
  const neg = ramp(t, wordOf(4, 'negatif') - 0.3, wordOf(4, 'negatif') + 0.4, BACK);
  const stab = ramp(t, wordOf(4, 'stabil') - 0.3, wordOf(4, 'stabil') + 0.5);
  const lblCross = ramp(t, wordOf(1, 'hanya') - 0.3, wordOf(1, 'hanya') + 0.3);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <VbDefs />
        <Glow x={760} y={560} r={460} color="violet" opacity={(0.06 + 0.03 * Math.sin(t * 0.7)) * mol} />

        {/* ===== molekul (butadiena datar) ===== */}
        <g opacity={mol}>
          <Render3D items={items} />
          {/* α: satu orbital p */}
          <g opacity={glowAlpha}>
            <circle cx={tips[0].X} cy={tips[0].Y - 10} r={56 + 4 * Math.sin(t * 4)} fill="none" stroke={C.gold} strokeWidth={3} strokeDasharray="6 6" strokeDashoffset={-t * 14} />
            <text x={tips[0].X - 70} y={tips[0].Y - 46} textAnchor="end" fontFamily={FONT.serif} fontStyle="italic" fontSize={56} fill={C.gold} style={{paintOrder: 'stroke', stroke: 'rgba(4,6,12,0.85)', strokeWidth: 6}}>
              α
            </text>
          </g>
          {/* β: tetangga */}
          {[0, 1, 2].map((i) => {
            const [mx, my] = arcMid(tips[i].X, tips[i].Y, tips[i + 1].X, tips[i + 1].Y, 44);
            return (
              <g key={i}>
                <ArcLink x1={tips[i].X} y1={tips[i].Y} x2={tips[i + 1].X} y2={tips[i + 1].Y} lift={44} color={C.amber} p={betaArc(i)} t={t} />
                <text x={mx} y={my - 22} textAnchor="middle" fontFamily={FONT.serif} fontStyle="italic" fontSize={44} fill={C.amber} opacity={betaArc(i)} style={{paintOrder: 'stroke', stroke: 'rgba(4,6,12,0.85)', strokeWidth: 5}}>
                  β
                </text>
              </g>
            );
          })}
          {/* tak bertetangga = 0 */}
          {(
            [
              [0, 2, 150],
              [1, 3, 150],
            ] as const
          ).map(([a, b, lift], i) => {
            const p = zeroP(i);
            const [mx, my] = arcMid(tips[a].X, tips[a].Y, tips[b].X, tips[b].Y, lift);
            return (
              <g key={i}>
                <ArcLink x1={tips[a].X} y1={tips[a].Y} x2={tips[b].X} y2={tips[b].Y} lift={lift} color={C.red} p={p} t={t} dash="10 9" width={3} />
                <g opacity={p}>
                  <circle cx={mx} cy={my} r={30} fill="rgba(10,12,26,0.92)" stroke={C.red} strokeWidth={3} />
                  <text x={mx} y={my + 2} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.sans} fontWeight={700} fontSize={36} fill={C.red}>
                    0
                  </text>
                </g>
                <XMark x={mx + 46} y={my - 6} r={13} p={ramp(t, wordOf(3, 'berinteraksi') - 0.2 + i * 0.3, wordOf(3, 'berinteraksi') + 0.4 + i * 0.3) * p} width={5} />
              </g>
            );
          })}
          {/* nomor atom */}
          {ctr.map((p, k) => (
            <text key={k} x={p.X} y={p.Y + 58} textAnchor="middle" fontFamily={FONT.mono} fontSize={22} fill={C.muted} opacity={0.4 + 0.6 * pOn} style={{paintOrder: 'stroke', stroke: 'rgba(4,6,12,0.85)', strokeWidth: 4}}>
              C{['₁', '₂', '₃', '₄'][k]}
            </text>
          ))}
          <Label x={760} y={845} size={30} color={C.muted} weight={600} opacity={sigDim * (1 - lblCross)}>
            kerangka σ: diabaikan
          </Label>
          <Label x={760} y={845} size={32} color={C.amber} weight={700} opacity={lblCross * Math.max(pPre, pOn) * (1 - en)}>
            hanya elektron π · orbital p ⊥ bidang
          </Label>
        </g>

        {/* ===== lencana ===== */}
        <Medallion
          x={mix(960, 1685, mv)}
          y={mix(480, 255, mv)}
          r={mix(190, 78, mv)}
          t={t}
          opacity={med * (1 - 0.35 * en)}
          name="Erich Hückel"
          year="1931"
        />

        {/* ===== sumbu energi: α dan α + β ===== */}
        <g opacity={en}>
          <EAxis x={1290} y0={780} y1={405} />
          <Lvl x={1500} y={yA} w={190} color={C.muted} t={t} />
          <text x={1612} y={yA} dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={44} fill={C.muted}>
            α
          </text>
          <Lvl x={1500} y={yB} w={190} color={C.cyan} t={t} p={ramp(t, wordOf(4, 'ditambah') - 0.3, wordOf(4, 'ditambah') + 0.4)} lit={stab} />
          <text x={1612} y={yB} dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={44} fill={C.cyan} opacity={ramp(t, wordOf(4, 'ditambah') - 0.1, wordOf(4, 'ditambah') + 0.5)}>
            α + β
          </text>
          {/* panah β ke bawah */}
          <g opacity={ramp(t, wordOf(4, 'ditambah'), wordOf(4, 'ditambah') + 0.6)}>
            <line x1={1365} y1={yA + 8} x2={1365} y2={yB - 22} stroke={C.amber} strokeWidth={4} strokeLinecap="round" />
            <path d={`M${1353},${yB - 26} L${1365},${yB - 6} L${1377},${yB - 26} Z`} fill={C.amber} />
            <text x={1345} y={(yA + yB) / 2} textAnchor="end" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={40} fill={C.amber}>
              β
            </text>
          </g>
          <Pair x={1500} y={yB} a={stab} b={ramp(t, wordOf(4, 'stabil') + 0.2, wordOf(4, 'stabil') + 0.8)} t={t} />
          <g opacity={stab}>
            <Check x={1430} y={yB + 62} r={16} p={stab} />
            <Label x={1456} y={yB + 62} size={30} color={C.mint} weight={700} anchor="start">
              lebih stabil
            </Label>
          </g>
        </g>
      </Stage>

      {/* kartu parameter (satu per momen) */}
      <Formula x={1530} y={520} p={cA} accent={C.gold} caption="energi elektron di orbital p satu C">
        <span style={{color: C.gold, fontStyle: 'italic'}}>α</span>
      </Formula>
      <Formula x={1530} y={520} p={cB} accent={C.amber} caption="interaksi dua C bertetangga">
        <span style={{color: C.amber, fontStyle: 'italic'}}>β</span>
      </Formula>
      <Formula x={1530} y={520} p={c0} accent={C.red} caption="tidak bertetangga → tidak berinteraksi">
        <span>
          C<Sub>1</Sub>···C<Sub>3</Sub>, C<Sub>2</Sub>···C<Sub>4</Sub> : <span style={{color: C.red}}>0</span>
        </span>
      </Formula>
      <Formula x={1440} y={280} p={neg * en} accent={C.amber} size={56}>
        <span>
          <span style={{color: C.amber, fontStyle: 'italic'}}>β</span> &lt; 0
        </span>
      </Formula>
    </AbsoluteFill>
  );
};
