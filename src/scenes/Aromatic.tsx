import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, mix, ramp, slot} from '../anim';
import {Bond, Card, Formula, Glow, Stage, Sup, V} from '../components/primitives';
import {Check} from '../components/moB';
import {Label2} from '../components/moC';
import {RichLabel} from '../components/vbD';
import {Stamp} from '../components/grupD';
import {FrostCircle, Thermometer, frostPts} from '../components/poC';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Bab 08: lingkaran Frost cincin 3–7, aturan 4n + 2; C₃H₃⁺, C₆H₆, C₅H₅⁻, C₇H₇⁺ = aromatik;
// siklobutadiena 4 e⁻ → dua MO nonikatan degenerat, 2 e⁻ tak berpasangan → antiaromatik,
// diamati pada suhu sangat rendah, terdistorsi persegi panjang (AUDIT).
type Ring = {n: number; x: number; name: [string, ('sub' | 'sup')?][]; sub: string};
const RINGS: Ring[] = [
  {n: 3, x: 300, name: [['C'], ['3', 'sub'], ['H'], ['3', 'sub'], ['+', 'sup']], sub: 'kation siklopropenil'},
  {n: 4, x: 630, name: [['C'], ['4', 'sub'], ['H'], ['4', 'sub']], sub: 'siklobutadiena'},
  {n: 5, x: 960, name: [['C'], ['5', 'sub'], ['H'], ['5', 'sub'], ['−', 'sup']], sub: 'anion siklopentadienil'},
  {n: 6, x: 1290, name: [['C'], ['6', 'sub'], ['H'], ['6', 'sub']], sub: 'benzena'},
  {n: 7, x: 1620, name: [['C'], ['7', 'sub'], ['H'], ['7', 'sub'], ['+', 'sup']], sub: 'kation tropilium'},
];
const CY = 330;
const R0 = 116;

export const Aromatic: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);

  // baris 0: lingkaran Frost muncul berurutan
  const tF = wordOf(0, 'Frost');
  const drawK = (k: number) => ramp(t, tF - 0.6 + k * 0.35, tF + 0.9 + k * 0.35);
  const sRule = slot(t, wordOf(0, 'empat') - 0.3, cue(2) - 0.1);
  const ns = ramp(t, wordOf(1, 'Dua') - 0.2, wordOf(1, 'sepuluh') + 0.4);
  // baris 1: pengisian 6 e⁻
  const fill = (w: number, eMax: number) => eMax * ramp(t, w - 0.2, w + 1.3, (x) => x);
  const e3 = fill(wordOf(1, 'Dua'), 2);
  const e6 = fill(wordOf(1, 'Benzena'), 6);
  const e5 = fill(wordOf(1, 'siklopentadienil'), 6);
  const e7 = fill(wordOf(1, 'tropilium'), 6);
  const ok = ramp(t, wordOf(1, 'enam', 1) - 0.3, wordOf(1, 'enam', 1) + 0.5);
  const ok3 = ramp(t, wordOf(1, 'sepuluh') - 0.2, wordOf(1, 'sepuluh') + 0.5);
  const elec: Record<number, number> = {3: e3, 4: 0, 5: e5, 6: e6, 7: e7};
  const glowRing: Record<number, number> = {
    3: ramp(t, wordOf(1, 'Dua') - 0.2, wordOf(1, 'Dua') + 0.6),
    4: 0,
    5: ramp(t, wordOf(1, 'siklopentadienil') - 0.2, wordOf(1, 'siklopentadienil') + 0.6),
    6: ramp(t, wordOf(1, 'Benzena') - 0.2, wordOf(1, 'Benzena') + 0.6),
    7: ramp(t, wordOf(1, 'tropilium') - 0.2, wordOf(1, 'tropilium') + 0.6),
  };

  // baris 2–4: fokus siklobutadiena
  const focus = ramp(t, cue(2) - 0.4, cue(2) + 1.0, EASE_IN_OUT);
  const others = 1 - ramp(t, cue(2) - 0.5, cue(2) + 0.3, EASE_IN_OUT);
  const cbX = mix(630, 560, focus);
  const cbY = mix(CY, 450, focus);
  const cbR = mix(R0, 190, focus);
  const cbLw = mix(56, 96, focus);
  const cbSpin = mix(34, 50, focus);
  const e4 =
    2 * ramp(t, wordOf(2, 'empat') - 0.2, wordOf(2, 'empat') + 0.9, (x) => x) +
    ramp(t, wordOf(3, 'satu-satu') - 0.3, wordOf(3, 'satu-satu') + 0.3) +
    ramp(t, wordOf(3, 'satu-satu') + 0.4, wordOf(3, 'satu-satu') + 1.0);
  const nonb = ramp(t, wordOf(3, 'berikatan') - 0.4, wordOf(3, 'berikatan') + 0.5);
  const unp = ramp(t, wordOf(3, 'berpasangan') - 0.4, wordOf(3, 'berpasangan') + 0.4);
  const eLab = ramp(t, cue(2) + 0.6, cue(2) + 1.6);
  const s4n = slot(t, wordOf(2, 'empat') - 0.1, dur + 1);
  const unstable = ramp(t, wordOf(4, 'tidak') - 0.3, wordOf(4, 'tidak') + 0.5);
  const stamp = ramp(t, wordOf(4, 'antiaromatik') - 0.2, wordOf(4, 'antiaromatik') + 0.35, BACK);
  const cold = ramp(t, wordOf(4, 'suhu') - 0.4, wordOf(4, 'suhu') + 0.5);
  const rect = ramp(t, wordOf(4, 'persegi') - 0.3, wordOf(4, 'persegi') + 1.4, EASE_IN_OUT);
  const molIn = ramp(t, cue(2) + 0.2, cue(2) + 1.2);

  const cbPts = frostPts(cbX, cbY, cbR, 4); // 0 bawah, 1 kanan, 2 atas, 3 kiri

  // molekul C₄H₄: persegi → persegi panjang
  const MX = 1540;
  const MY = 440;
  const hw = mix(74, 94, rect) + 1.5 * Math.sin(t * 7) * unstable;
  const hh = mix(74, 56, rect) - 1.5 * Math.sin(t * 7) * unstable;
  const cs: [number, number][] = [
    [MX - hw, MY - hh],
    [MX + hw, MY - hh],
    [MX + hw, MY + hh],
    [MX - hw, MY + hh],
  ];

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        {/* lima lingkaran Frost */}
        {RINGS.map((r, i) => {
          const isCB = r.n === 4;
          const op = isCB ? drawK(i) : drawK(i) * others;
          const x = isCB ? cbX : r.x;
          const y = isCB ? cbY : CY;
          const R = isCB ? cbR : R0;
          return (
            <g key={r.n}>
              <Glow x={x} y={y} r={R * 1.5} color={r.n === 4 ? 'red' : 'mint'} opacity={op * (isCB ? unstable * (0.22 + 0.12 * pulse) : glowRing[r.n] * ok * (0.12 + 0.08 * pulse))} />
              <FrostCircle cx={x} cy={y} R={R} n={r.n} e={isCB ? e4 : elec[r.n]} t={t + i} opacity={op} draw={drawK(i)} lw={isCB ? cbLw : 56} spin={isCB ? cbSpin : 34} />
              <g opacity={op * (isCB ? 1 - focus : 1)}>
                <RichLabel x={r.x} y={CY + R0 + 56} parts={r.name} size={32} weight={700} color={C.ink} />
                <Label2 x={r.x} y={CY + R0 + 94} size={20} color={C.muted} weight={500}>
                  {r.sub}
                </Label2>
              </g>
            </g>
          );
        })}
        <Label2 x={300 - R0 - 34} y={CY} size={24} color={C.muted} anchor="end" font="serif" opacity={drawK(0) * others}>
          α
        </Label2>
        {/* jumlah elektron & centang */}
        {RINGS.filter((r) => r.n !== 4).map((r) => {
          const p = r.n === 3 ? ok3 : ok;
          const ne = r.n === 3 ? 2 : 6;
          return (
            <g key={`ok${r.n}`} opacity={others}>
              <RichLabel x={r.x - 14} y={CY + R0 + 140} parts={[[`${ne} e`], ['−', 'sup']]} size={28} weight={700} color={C.mint} opacity={p} />
              <Check x={r.x + 46} y={CY + R0 + 140} r={16} p={p} width={6} />
            </g>
          );
        })}
        <Label2 x={630} y={CY + R0 + 140} size={26} color={C.muted} opacity={drawK(1) * others * ok}>
          ?
        </Label2>

        {/* siklobutadiena: label energi */}
        <g opacity={eLab}>
          <Label2 x={cbPts[0][0] + cbLw / 2 + 22} y={cbPts[0][1]} size={26} color={C.cyan} anchor="start" font="serif">
            α + 2β
          </Label2>
          <Label2 x={cbPts[2][0] + cbLw / 2 + 22} y={cbPts[2][1]} size={26} color={C.red} anchor="start" font="serif">
            α − 2β
          </Label2>
          <Label2 x={cbPts[3][0] - cbLw / 2 - 18} y={cbPts[3][1]} size={26} color={C.muted} anchor="end" font="serif">
            α
          </Label2>
          <Label2 x={cbPts[2][0]} y={cbPts[2][1] - 52} size={24} color={C.muted} weight={500}>
            siklobutadiena · 4 elektron π
          </Label2>
        </g>
        <g opacity={nonb}>
          <rect x={cbPts[3][0] - cbLw / 2 - 12} y={cbY - 34} width={cbLw + 24} height={68} rx={14} fill={C.muted} opacity={0.1 + 0.06 * pulse} />
          <rect x={cbPts[1][0] - cbLw / 2 - 12} y={cbY - 34} width={cbLw + 24} height={68} rx={14} fill={C.muted} opacity={0.1 + 0.06 * pulse} />
          <Label2 x={cbX} y={cbY - 46} size={24} color={C.ink} weight={600}>
            2 MO nonikatan
          </Label2>
          <Label2 x={cbX} y={cbY + 46} size={21} color={C.muted} weight={500}>
            energi sama (degenerat)
          </Label2>
        </g>
        <g opacity={unp}>
          <Glow x={cbPts[3][0]} y={cbY} r={70} color="gold" opacity={0.25 + 0.15 * pulse} />
          <Glow x={cbPts[1][0]} y={cbY} r={70} color="gold" opacity={0.25 + 0.15 * pulse} />
          <Label2 x={cbPts[1][0] + cbLw / 2 + 24} y={cbY - 18} size={28} color={C.gold} anchor="start" weight={700}>
            tak berpasangan
          </Label2>
          <Label2 x={cbPts[1][0] + cbLw / 2 + 24} y={cbY + 18} size={20} color={C.muted} anchor="start" weight={500}>
            ↑ dan ↑ di dua orbital
          </Label2>
        </g>

        {/* molekul C₄H₄ */}
        <g opacity={molIn}>
          <Glow x={MX} y={MY} r={190} color="red" opacity={unstable * (0.15 + 0.12 * pulse)} />
          {cs.map((p, k) => {
            const q = cs[(k + 1) % 4];
            const short = k % 2 === 1; // sisi tegak
            return (
              <g key={`b${k}`}>
                <Bond x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} order={1} width={10} opacity={short ? 1 - rect : 1} />
                {short ? <Bond x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} order={2} width={10} opacity={rect} /> : null}
              </g>
            );
          })}
          <rect x={MX - hw + 26} y={MY - hh + 26} width={2 * hw - 52} height={2 * hh - 52} rx={6} fill="none" stroke={C.amber} strokeWidth={3} strokeDasharray="8 8" strokeDashoffset={-t * 14} opacity={0.7 * (1 - rect)} />
          {cs.map((p, k) => {
            const dx = Math.sign(p[0] - MX);
            const dy = Math.sign(p[1] - MY);
            return (
              <g key={`a${k}`}>
                <line x1={p[0]} y1={p[1]} x2={p[0] + dx * 40} y2={p[1] + dy * 40} stroke="#8b97b8" strokeWidth={6} strokeLinecap="round" />
                <circle cx={p[0] + dx * 46} cy={p[1] + dy * 46} r={14} fill="#f2f5ff" />
                <circle cx={p[0]} cy={p[1]} r={20} fill="#4a5266" stroke="#8ea0c8" strokeWidth={2} />
              </g>
            );
          })}
          <RichLabel x={MX} y={MY + 140} parts={[['C'], ['4', 'sub'], ['H'], ['4', 'sub']]} size={32} weight={700} />
          <Label2 x={MX} y={MY + 178} size={22} color={C.amber} weight={600} opacity={rect}>
            persegi → persegi panjang
          </Label2>
        </g>
        {/* suhu sangat rendah */}
        <Thermometer x={1190} y={460} h={220} level={0.12} t={t} opacity={cold} />
        <g opacity={cold}>
          <Label2 x={1190} y={610} size={24} color={C.blue} weight={700}>
            suhu sangat rendah
          </Label2>
          <Label2 x={1190} y={642} size={19} color={C.muted} weight={500}>
            (isolasi matriks)
          </Label2>
        </g>
      </Stage>

      {/* kartu aturan 4n + 2 */}
      <Formula x={960} y={790} p={sRule} size={84} caption={<span style={{opacity: ns}}>n = 0, 1, 2, … → 2, 6, 10 elektron π: semua MO ikatan terisi penuh</span>}>
        <V>4n</V> + 2
      </Formula>
      <Card x={1360} y={790} opacity={s4n} accent={C.red} style={{padding: '18px 34px'}}>
        <div style={{fontSize: 56, fontFamily: '"Source Serif 4", serif', textAlign: 'center', whiteSpace: 'nowrap'}}>
          4 e<Sup>−</Sup> = <V>4n</V>
          <span style={{fontSize: 34, color: C.muted}}> (n = 1)</span>
        </div>
        <div style={{fontSize: 26, color: C.red, textAlign: 'center', marginTop: 6}}>
          bukan <V>4n</V> + 2
        </div>
      </Card>
      <Stamp x={1370} y={225} p={stamp} text="ANTIAROMATIK" color={C.red} size={52} rot={-7} sub="sangat tidak stabil" />
    </AbsoluteFill>
  );
};
