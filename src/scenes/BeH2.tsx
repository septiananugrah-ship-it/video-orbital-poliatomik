import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp} from '../anim';
import {Atom, Badge, Bond, Glow, Label, Stage} from '../components/primitives';
import {Check, EAxis, MODiagram, moLab, type MOElec, type MOLevel, type MOLink} from '../components/moB';
import {RichLabel} from '../components/vbD';
import {Electron} from '../components/viz';
import {PhaseP, PhaseS, PoADefs, lobeD} from '../components/poA';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Bab 2: BeH₂ (gas, lurus). Dua orbital kelompok H (sefase / berlawanan) ↔ 2s / 2p_z Be,
// diagram MO (σg, σu ikatan; 2p_x, 2p_y nonikatan; σg*, σu*), 4 elektron, awan terdelokalisasi.
const X0 = 960;
const MOL_Y = 300;
const RA = 500; // baris sefase
const RB = 760; // baris berlawanan
const HS = 165; // jarak H dari Be di baris orbital
const HR = 80; // jari-jari 1s H
const SR = 105; // jari-jari 2s Be
const PL = 150; // panjang lobus 2p_z

const G = {cx: 1440, D: 300, aw: 66, agap: 12, lw: 110, gap: 24, fs: 26, spin: 36, sp: 12};

export const BeH2: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  // ---------- molekul ----------
  const mol = ramp(t, cue(0) - 0.6, cue(0) + 0.8, BACK);
  const lin = ramp(t, wordOf(0, 'lurus') - 0.3, wordOf(0, 'lurus') + 0.5);
  const gas = ramp(t, wordOf(0, 'gas') - 0.3, wordOf(0, 'gas') + 0.5);

  // ---------- orbital kelompok ----------
  const hIn = ramp(t, wordOf(1, 'hidrogen') - 0.4, wordOf(1, 'hidrogen') + 0.5);
  const phA = ramp(t, wordOf(1, 'sefase') - 0.3, wordOf(1, 'sefase') + 0.5);
  const phB = ramp(t, wordOf(1, 'berlawanan') - 0.3, wordOf(1, 'berlawanan') + 0.5);
  const sIn = ramp(t, wordOf(2, 'dua', 0) - 0.4, wordOf(2, 'dua', 0) + 0.5, BACK);
  const sOv = ramp(t, wordOf(2, 'berilium') - 0.2, wordOf(2, 'berilium') + 0.6);
  const pIn = ramp(t, wordOf(2, 'dua', 1) - 0.4, wordOf(2, 'dua', 1) + 0.5, BACK);
  const pOv = ramp(t, wordOf(2, 'dua', 1) + 0.3, wordOf(2, 'dua', 1) + 1.1);

  // ---------- MO terbentang & diagram ----------
  const shrink = ramp(t, cue(3) - 0.5, cue(3) + 1.0, EASE_IN_OUT);
  const env = ramp(t, wordOf(3, 'membentang') - 0.4, wordOf(3, 'atom') + 0.4);
  const molabel = ramp(t, wordOf(3, 'orbital') - 0.2, wordOf(3, 'orbital') + 0.5);
  const dia = ramp(t, cue(3) + 0.1, cue(3) + 1.0);
  const lv = (k: number) => ramp(t, cue(3) + 0.3 + k * 0.25, cue(3) + 0.9 + k * 0.25);
  const lk = ramp(t, cue(3) + 1.0, cue(3) + 2.4, EASE_IN_OUT);
  const tF = wordOf(4, 'Empat');
  const eFly = (k: number) => ramp(t, tF - 0.2 + k * 0.45, tF + 0.7 + k * 0.45, EASE_IN_OUT);
  const roam = ramp(t, tF + 0.4, tF + 1.6);
  const lock = ramp(t, wordOf(4, 'terkunci') - 0.3, wordOf(4, 'terkunci') + 0.4) * (1 - ramp(t, wordOf(4, 'terdelokalisasi') - 0.6, wordOf(4, 'terdelokalisasi'), EASE_IN_OUT));
  const strike = ramp(t, wordOf(4, 'saja') - 0.1, wordOf(4, 'saja') + 0.5, EASE_IN_OUT);
  const deloc = ramp(t, wordOf(4, 'terdelokalisasi') - 0.3, wordOf(4, 'terdelokalisasi') + 0.5, BACK);

  const sc = mix(1, 0.7, shrink);
  const PX = mix(960, 500, shrink);
  const PY = 560;
  const panel = `translate(${PX} ${PY}) scale(${sc}) translate(${-X0} ${-PY})`;
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);

  // ---------- data diagram ----------
  const levels: MOLevel[] = [
    {id: 'sus', kind: 'sgs', y: 250, label: moLab('σ', 'u', true), p: lv(5)},
    {id: 'sgs', kind: 'sgs', y: 330, label: moLab('σ', 'g', true), p: lv(4)},
    {id: 'nb', kind: 'ao', y: 445, n: 2, label: [['2p'], ['x', 'sub'], [', 2p'], ['y', 'sub']], p: lv(3)},
    {id: 'p2', kind: 'ao', y: 445, n: 3, side: 'L', label: [['2p']], p: lv(0)},
    {id: 's2', kind: 'ao', y: 560, side: 'L', label: [['2s']], p: lv(0)},
    {id: 'hg', kind: 'ao', y: 650, n: 2, side: 'R', label: [['1s H (×2)']], p: lv(0)},
    {id: 'su', kind: 'sg', y: 745, label: moLab('σ', 'u'), p: lv(2), lit: deloc * pulse},
    {id: 'sg', kind: 'sg', y: 825, label: moLab('σ', 'g'), p: lv(1), lit: deloc * pulse},
  ];
  const links: MOLink[] = [
    {a: 's2', b: 'sg', p: lk},
    {a: 's2', b: 'sgs', p: lk},
    {a: 'p2', b: 'su', p: lk},
    {a: 'p2', b: 'sus', p: lk},
    {a: 'p2', b: 'nb', p: lk},
    {a: 'hg', b: 'sg', p: lk},
    {a: 'hg', b: 'su', p: lk},
    {a: 'hg', b: 'sgs', p: lk},
    {a: 'hg', b: 'sus', p: lk},
  ];
  const elec: MOElec[] = [
    {at: 'sg', up: true, p: eFly(0), src: 's2'},
    {at: 'sg', up: false, p: eFly(1), src: 's2'},
    {at: 'su', up: true, p: eFly(2), src: 'hg', sk: 0},
    {at: 'su', up: false, p: eFly(3), src: 'hg', sk: 1},
  ].map((e) => ({...e, o: lv(0)}));

  // ---------- orbital baris (koordinat panel) ----------
  const HA = X0 - HS;
  const HB = X0 + HS;
  const envPath = (y: number) => `M${HA - HR - 10},${y} C${HA - HR - 10},${y - 120} ${HB + HR + 10},${y - 120} ${HB + HR + 10},${y} C${HB + HR + 10},${y + 120} ${HA - HR - 10},${y + 120} ${HA - HR - 10},${y} Z`;

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <PoADefs />
        <Glow x={PX} y={560} r={520 * sc} color="cyan" opacity={0.08 + 0.05 * env} />

        <g transform={panel}>
          {/* ---------- molekul H–Be–H ---------- */}
          <g opacity={mol} transform={`translate(0 ${4 * Math.sin(t * 1.1)})`}>
            <Bond x1={X0 - 230} y1={MOL_Y} x2={X0 + 230} y2={MOL_Y} width={12} />
            <Atom x={X0 - 230} y={MOL_Y} el="H" r={34} />
            <Atom x={X0} y={MOL_Y} el="Be" r={46} label="Be" />
            <Atom x={X0 + 230} y={MOL_Y} el="H" r={34} />
            <Label x={X0 - 230} y={MOL_Y + 62} size={24} color={C.muted} font="serif" italic>
              A
            </Label>
            <Label x={X0 + 230} y={MOL_Y + 62} size={24} color={C.muted} font="serif" italic>
              B
            </Label>
            <g opacity={lin}>
              <path d={`M${X0 - 60},${MOL_Y + 2} A60,60 0 0 0 ${X0 + 60},${MOL_Y + 2}`} fill="none" stroke={C.gold} strokeWidth={3} strokeDasharray="6 6" strokeDashoffset={-t * 10} />
              <Label x={X0} y={MOL_Y + 84} size={26} color={C.gold} weight={600}>
                180°
              </Label>
            </g>
            <g opacity={gas}>
              <RichLabel x={X0} y={MOL_Y - 92} parts={[['BeH'], ['2', 'sub'], [' (gas) · molekul lurus']]} size={36} color={C.ink} />
            </g>
            {/* ikatan "terkunci" di antara dua atom saja — dicoret */}
            <g opacity={lock}>
              <rect x={X0 - 262} y={MOL_Y - 50} width={300} height={100} rx={40} fill="none" stroke={C.amber} strokeWidth={3} strokeDasharray="10 8" strokeDashoffset={-t * 12} />
              <line x1={X0 - 270} y1={MOL_Y + 46} x2={X0 - 270 + 320 * strike} y2={MOL_Y + 46 - 92 * strike} stroke={C.red} strokeWidth={6} strokeLinecap="round" opacity={Math.min(1, strike * 5)} />
            </g>
          </g>

          {/* ---------- awan MO yang membentang (sian) ---------- */}
          {[RA, RB].map((y, k) => (
            <g key={k} opacity={env}>
              <path d={envPath(y)} fill={C.cyan} fillOpacity={0.1 + 0.05 * pulse} stroke={C.cyan} strokeWidth={3} strokeOpacity={0.7} strokeDasharray="12 8" strokeDashoffset={-t * 14} />
              {k === 1 ? <line x1={X0} y1={y - 110} x2={X0} y2={y + 110} stroke={C.muted} strokeWidth={2} strokeDasharray="5 7" opacity={0.7} /> : null}
            </g>
          ))}

          {/* ---------- baris A: sefase ↔ 2s ---------- */}
          <PhaseS x={HA} y={RA} r={HR} sign={1} ph={phA} t={t} opacity={hIn} />
          <PhaseS x={HB} y={RA} r={HR} sign={1} ph={phA} t={t} opacity={hIn} />
          <PhaseS x={X0} y={RA} r={SR} sign={1} t={t} opacity={sIn * 0.95} />
          <g opacity={sOv}>
            {[HA, HB].map((hx, k) => (
              <g key={k}>
                <clipPath id={`beh2-a${k}`}>
                  <circle cx={hx} cy={RA} r={HR} />
                </clipPath>
                <circle cx={X0} cy={RA} r={SR} fill={C.cyan} fillOpacity={0.45 + 0.35 * pulse} clipPath={`url(#beh2-a${k})`} />
              </g>
            ))}
          </g>

          {/* ---------- baris B: berlawanan ↔ 2p_z ---------- */}
          <PhaseS x={HA} y={RB} r={HR} sign={1} ph={phB} t={t} opacity={hIn} />
          <PhaseS x={HB} y={RB} r={HR} sign={-1} ph={phB} t={t} opacity={hIn} />
          <PhaseP x={X0} y={RB} L={PL} ang={Math.PI} t={t} opacity={pIn * 0.95} />
          <g opacity={pOv}>
            {[
              [HA, Math.PI],
              [HB, 0],
            ].map(([hx, a], k) => (
              <g key={k}>
                <clipPath id={`beh2-b${k}`}>
                  <circle cx={hx} cy={RB} r={HR} />
                </clipPath>
                <path d={lobeD(X0, RB, a, PL)} fill={C.cyan} fillOpacity={0.45 + 0.35 * pulse} clipPath={`url(#beh2-b${k})`} />
              </g>
            ))}
          </g>

          {/* elektron yang berkeliaran di seluruh tiga atom */}
          {[RA, RB].map((y, k) =>
            [0, 1].map((j) => {
              const ph = t * (0.9 + 0.2 * j) + j * Math.PI + k;
              return <Electron key={`${k}${j}`} x={X0 + (HS + 40) * Math.sin(ph)} y={y + 40 * Math.sin(ph * 2.1 + j) * (j ? 1 : -1)} r={8} opacity={roam} />;
            }),
          )}

          {/* label baris */}
          <g opacity={phA}>
            <RichLabel x={HA - HR - 30} y={RA} parts={[['1s'], ['A', 'sub'], [' + 1s'], ['B', 'sub']]} size={38} color={C.gold} anchor="end" font="serif" />
            <Label x={HA - HR - 30} y={RA + 44} size={28} color={C.muted} anchor="end">
              sefase
            </Label>
          </g>
          <g opacity={phB}>
            <RichLabel x={HA - HR - 30} y={RB} parts={[['1s'], ['A', 'sub'], [' − 1s'], ['B', 'sub']]} size={38} color={C.violet} anchor="end" font="serif" />
            <Label x={HA - HR - 30} y={RB + 44} size={28} color={C.muted} anchor="end">
              berlawanan fase
            </Label>
          </g>
          {/* pasangan simetri ↔ lalu nama MO */}
          {[
            {y: RA, p: sOv, be: [['↔ 2s Be']] as [string, ('sub' | 'sup')?][], mo: moLab('σ', 'g')},
            {y: RB, p: pOv, be: [['↔ 2p'], ['z', 'sub'], [' Be']] as [string, ('sub' | 'sup')?][], mo: moLab('σ', 'u')},
          ].map((r, k) => (
            <g key={k}>
              <g opacity={r.p * (1 - molabel)}>
                <Check x={HB + HR + 40} y={r.y - 4} r={16} p={r.p} width={6} />
                <RichLabel x={HB + HR + 70} y={r.y} parts={r.be} size={32} color={C.ink} anchor="start" />
              </g>
              <g opacity={molabel}>
                <RichLabel x={HB + HR + 40} y={r.y} parts={r.mo} size={44} color={C.cyan} anchor="start" font="serif" italic />
                <Label x={HB + HR + 40} y={r.y + 48} size={28} color={C.cyan} anchor="start">
                  ikatan
                </Label>
              </g>
            </g>
          ))}
        </g>

        {/* ---------- diagram MO BeH₂ ---------- */}
        <g opacity={dia}>
          <EAxis x={1010} y0={870} y1={240} />
          <Label x={G.cx - G.D} y={200} size={28} color={C.ink} weight={700}>
            Be
          </Label>
          <RichLabel x={G.cx} y={200} parts={[['BeH'], ['2', 'sub']]} size={28} color={C.cyan} />
          <Label x={G.cx + G.D} y={200} size={28} color={C.ink} weight={700}>
            2 H
          </Label>
          <MODiagram g={G} levels={levels} links={links} elec={elec} t={t} />
          <Label x={G.cx} y={407} size={20} color={C.muted} opacity={lv(3)}>
            nonikatan
          </Label>
        </g>
      </Stage>

      <Badge x={500} y={850} text="terdelokalisasi: milik ketiga atom" color={C.cyan} opacity={deloc} scale={0.85 + 0.15 * deloc} />
    </AbsoluteFill>
  );
};
