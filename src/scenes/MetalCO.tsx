import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, cyc, mix, ramp, slot} from '../anim';
import {Atom, Bond, Card, DrawPath, Formula, Glow, NuTilde, Spring, Stage, Sup} from '../components/primitives';
import {Label2, MOLevel} from '../components/moC';
import {RichLabel, lobePath} from '../components/vbD';
import {Electron} from '../components/viz';
import {DClover, MetalBall} from '../components/poC';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 10: donasi σ (HOMO CO, lobus besar di C → d kosong logam) & donasi balik (d terisi → π* CO);
// ikatan C–O melemah: ν(CO) 2143 cm⁻¹ (bebas) → ≈ 2000 cm⁻¹ atau kurang (Housecroft; AUDIT).
const AY = 470; // sumbu M–C–O
const CX = 770;
const OX0 = 910;

// diagram MO mini (kanan)
const DMX = 1380;
const DCX = 1690;
const Y_PIS = 330;
const Y_DE = 400;
const Y_DF = 490;
const Y_SG = 580;

// spektrum IR mini
const IX = 1250;

const IW = 540;
const IB = 600;
const nuX = (nu: number) => IX + ((2250 - nu) / 400) * IW;

/** Integral fase untuk frekuensi yang berubah linear dari f0 ke f1 pada [a, b]. */
const phaseOf = (t: number, f0: number, f1: number, a: number, b: number) => {
  if (t <= a) return f0 * t;
  if (t <= b) return f0 * t + ((f1 - f0) * (t - a) ** 2) / (2 * (b - a));
  return f0 * t + (f1 - f0) * ((b - a) / 2 + (t - b));
};

export const MetalCO: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);

  const coIn = ramp(t, 0.2, 1.2);
  const homo = ramp(t, wordOf(0, 'HOMO') - 0.3, wordOf(0, 'HOMO') + 0.5);
  const lumo = ramp(t, wordOf(0, 'LUMO') - 0.3, wordOf(0, 'LUMO') + 0.5);
  const mIn = ramp(t, wordOf(1, 'mendekati') - 0.5, wordOf(1, 'transisi') + 0.6, EASE_IN_OUT);
  const don = ramp(t, wordOf(1, 'mendonorkan') - 0.3, wordOf(1, 'mendonorkan') + 0.8);
  const dEmpty = ramp(t, wordOf(1, 'kosong') - 0.8, wordOf(1, 'kosong') + 0.2);
  const dFull = ramp(t, wordOf(2, 'terisi') - 0.6, wordOf(2, 'terisi') + 0.4);
  const back = ramp(t, wordOf(2, 'mengembalikan') - 0.3, wordOf(2, 'mengembalikan') + 0.9);
  const backLab = ramp(t, wordOf(2, 'balik', 2) - 0.4, wordOf(2, 'balik', 2) + 0.4);
  const weak = ramp(t, wordOf(3, 'melemahkan') - 0.4, wordOf(3, 'melemahkan') + 1.2, (x) => x);
  const springIn = ramp(t, cue(3) - 0.4, cue(3) + 0.5);
  const shift = ramp(t, wordOf(3, 'turun') - 0.2, wordOf(3, 'sekitar') + 0.4, EASE_IN_OUT);
  const panelMO = ramp(t, wordOf(1, 'mendonorkan') - 0.6, wordOf(1, 'mendonorkan') + 0.4) * (1 - ramp(t, cue(3) - 0.6, cue(3), EASE_IN_OUT));
  const panelIR = ramp(t, cue(3) - 0.1, cue(3) + 0.7) * (1 - ramp(t, cue(4) - 0.5, cue(4), EASE_IN_OUT));
  const panelCat = ramp(t, cue(4) - 0.1, cue(4) + 0.8);
  const sIR = slot(t, wordOf(3, 'turun') - 0.3, cue(4));
  const sDCD = slot(t, cue(4) - 0.05, dur + 1);
  const cat = ramp(t, wordOf(4, 'katalis') - 0.4, wordOf(4, 'katalis') + 0.5);

  // posisi
  const MX = mix(110, 470, mIn);
  const vib = phaseOf(t, 1.6, 0.95, wordOf(3, 'melemahkan') - 0.4, wordOf(3, 'melemahkan') + 1.2);
  const ampV = mix(5, 12, weak) * springIn;
  const OX = OX0 + 14 * weak * springIn + ampV * Math.sin(2 * Math.PI * vib);

  // jalur panah donasi
  const sigA: [number, number] = [CX - 110, AY + 64];
  const sigB: [number, number] = [MX + 46, AY + 74];
  const sigC: [number, number] = [(sigA[0] + sigB[0]) / 2, AY + 200];
  const bkA: [number, number] = [MX + 92, AY - 100];
  const bkB: [number, number] = [CX - 30, AY - 112];
  const bkC: [number, number] = [(bkA[0] + bkB[0]) / 2, AY - 240];
  const qb = (a: [number, number], c: [number, number], b: [number, number], u: number): [number, number] => [
    (1 - u) ** 2 * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0],
    (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1],
  ];
  const qd = (a: [number, number], c: [number, number], b: [number, number]) => `M${a[0]},${a[1]} Q${c[0]},${c[1]} ${b[0]},${b[1]}`;
  const head = (a: [number, number], c: [number, number], b: [number, number], col: string, op: number) => {
    const [px, py] = qb(a, c, b, 0.94);
    const ang = Math.atan2(b[1] - py, b[0] - px);
    const s = 18;
    const p1 = [b[0] - s * Math.cos(ang) + (s * 0.6) * Math.sin(ang), b[1] - s * Math.sin(ang) - (s * 0.6) * Math.cos(ang)];
    const p2 = [b[0] - s * Math.cos(ang) - (s * 0.6) * Math.sin(ang), b[1] - s * Math.sin(ang) + (s * 0.6) * Math.cos(ang)];
    return <path d={`M${b[0]},${b[1]} L${p1[0]},${p1[1]} L${p2[0]},${p2[1]} Z`} fill={col} opacity={op} />;
  };

  // spektrum IR
  const nuNow = mix(2143, 2000, shift);
  const irPath = (nu0: number, h: number) =>
    Array.from({length: 161}, (_, q) => {
      const nu = 2250 - (q / 160) * 400;
      return `${q ? 'L' : 'M'}${nuX(nu).toFixed(1)},${(IB - h * Math.exp(-(((nu - nu0) / 14) ** 2))).toFixed(1)}`;
    }).join(' ');

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        {/* ===== gambar ruang: logam + CO ===== */}
        <g transform={`translate(${CX - 70} ${AY}) scale(1.12) translate(${-(CX - 70)} ${-AY})`}>
        <Glow x={CX - 70} y={AY} r={140} color="gold" opacity={homo * (0.14 + 0.08 * pulse) * (1 - back * 0.5)} />
        {/* orbital d logam */}
        <g opacity={mIn}>
          <MetalBall x={MX} y={AY} r={58} label="M" />
          {/* d kosong (σ, sepanjang sumbu) */}
          <g opacity={dEmpty * (1 - 0.55 * dFull)}>
            <path d={lobePath(MX, AY, 130, 34, 90)} fill={C.cyan} fillOpacity={0.08 + 0.25 * don * (0.6 + 0.4 * pulse)} stroke={C.cyan} strokeWidth={2.5} strokeDasharray="8 7" />
            <path d={lobePath(MX, AY, 130, 34, 270)} fill={C.cyan} fillOpacity={0.06} stroke={C.cyan} strokeWidth={2.5} strokeDasharray="8 7" opacity={0.6} />
          </g>
          <DClover x={MX} y={AY} L={150} w={40} t={t} opacity={dFull} />
        </g>
        {/* CO: HOMO σ (lobus besar di C) */}
        <g opacity={coIn}>
          <path d={lobePath(CX, AY, 160, 58, 270)} fill={C.gold} fillOpacity={0.3 + 0.12 * homo * pulse} stroke={C.gold} strokeWidth={3} opacity={0.35 + 0.65 * homo} />
          <path d={lobePath(OX, AY, 50, 26, 90)} fill={C.violet} fillOpacity={0.3} stroke={C.violet} strokeWidth={2} opacity={0.3 + 0.7 * homo} />
        </g>
        {/* π* (LUMO): lobus lebih besar di C, fase berlawanan di O */}
        <g opacity={lumo}>
          <path d={lobePath(CX, AY, 118, 40, 0)} fill={C.gold} fillOpacity={0.32 + 0.2 * back * pulse} stroke={C.pink} strokeWidth={3} />
          <path d={lobePath(CX, AY, 118, 40, 180)} fill={C.violet} fillOpacity={0.32 + 0.2 * back * pulse} stroke={C.pink} strokeWidth={3} />
          <path d={lobePath(OX, AY, 78, 28, 0)} fill={C.violet} fillOpacity={0.32} stroke={C.pink} strokeWidth={2.5} />
          <path d={lobePath(OX, AY, 78, 28, 180)} fill={C.gold} fillOpacity={0.32} stroke={C.pink} strokeWidth={2.5} />
        </g>
        {/* tumpang tindih sefase d – π* */}
        <g opacity={dFull * lumo}>
          <ellipse cx={(MX + 100 + CX - 30) / 2} cy={AY - 100} rx={90} ry={44} fill={C.gold} opacity={0.1 + 0.1 * pulse} />
          <ellipse cx={(MX + 100 + CX - 30) / 2} cy={AY + 100} rx={90} ry={44} fill={C.violet} opacity={0.1 + 0.1 * pulse} />
          <Label2 x={(MX + 100 + CX - 30) / 2} y={214} size={20} color={C.muted} weight={500} opacity={backLab}>
            lobus d & π* sefase → tumpang tindih
          </Label2>
        </g>
        {/* ikatan C–O: rangkap tiga → pegas */}
        <g opacity={coIn}>
          <Bond x1={CX} y1={AY} x2={OX} y2={AY} order={3} width={13} opacity={1 - springIn} />
          <Spring x1={CX} y1={AY} x2={OX} y2={AY} coils={mix(7, 6, weak)} amp={mix(13, 17, weak)} width={5} opacity={springIn} />
          <Atom x={CX} y={AY} el="C" r={40} />
          <Atom x={OX} y={AY} el="O" r={40} />
        </g>
        <g opacity={coIn}>
          <Label2 x={CX - 120} y={AY - 62} size={22} color={C.gold} weight={700} opacity={homo * (1 - dFull)}>
            HOMO (σ)
          </Label2>
          <Label2 x={CX - 120} y={AY - 34} size={18} color={C.muted} weight={500} opacity={homo * (1 - dFull)}>
            lobus besar di C
          </Label2>
          <Label2 x={OX + 60} y={AY - 112} size={22} color={C.pink} weight={700} anchor="start" opacity={lumo}>
            LUMO = π*
          </Label2>
          <Label2 x={OX + 60} y={AY - 84} size={18} color={C.muted} weight={500} anchor="start" opacity={lumo}>
            lobus besar di C
          </Label2>
          <Label2 x={OX0 + 70} y={AY + 100} size={20} color={C.muted} weight={500} anchor="start" opacity={springIn}>
            gerak lambat
          </Label2>
        </g>
        <Label2 x={MX} y={AY + 230} size={22} color={C.ink} weight={600} opacity={mIn * (1 - panelCat)}>
          logam transisi
        </Label2>
        {/* donasi σ: C → M (sian) */}
        <g opacity={don}>
          <DrawPath d={qd(sigA, sigC, sigB)} p={don} stroke={C.cyan} width={6} len={900} />
          {head(sigA, sigC, sigB, C.cyan, don)}
          {[0, 1, 2].map((q) => {
            const ph = (t * 0.5 + q / 3) % 1;
            const [x, y] = qb(sigA, sigC, sigB, ph);
            return <Electron key={q} x={x} y={y} r={8} opacity={cyc(ph) * don} />;
          })}
          <Label2 x={sigC[0]} y={sigC[1] - 26} size={26} color={C.cyan} weight={700}>
            donasi σ
          </Label2>
        </g>
        {/* donasi balik: M → π* (merah muda) */}
        <g opacity={back}>
          <DrawPath d={qd(bkA, bkC, bkB)} p={back} stroke={C.pink} width={6} len={900} />
          {head(bkA, bkC, bkB, C.pink, back)}
          {[0, 1, 2].map((q) => {
            const ph = (t * 0.5 + q / 3) % 1;
            const [x, y] = qb(bkA, bkC, bkB, ph);
            return <Electron key={q} x={x} y={y} r={8} color={C.pink} opacity={cyc(ph) * back} />;
          })}
          <Label2 x={bkC[0]} y={bkC[1] + 16} size={26} color={C.pink} weight={700} opacity={backLab}>
            donasi balik (π)
          </Label2>
        </g>
        <Label2 x={OX0 + 70} y={AY + 66} size={22} color={C.red} weight={700} anchor="start" opacity={weak}>
          C–O melemah
        </Label2>

        </g>

        {/* ===== panel kanan 1: diagram MO mini ===== */}
        <g opacity={panelMO}>
          <Label2 x={DMX} y={232} size={24} color={C.ink} weight={700}>
            logam (d)
          </Label2>
          <Label2 x={DCX} y={232} size={24} color={C.ink} weight={700}>
            CO
          </Label2>
          <MOLevel x={DMX} y={Y_DE} w={110} color={C.cyan} t={t} lit={don} litColor={C.cyan} spin={36} />
          <Label2 x={DMX - 78} y={Y_DE} size={18} color={C.muted} anchor="end" weight={500}>
            d kosong
          </Label2>
          <MOLevel x={DMX} y={Y_DF} w={70} n={2} gap={14} color={C.blue} e={4} t={t} lit={back} litColor={C.pink} spin={34} />
          <Label2 x={DMX - 96} y={Y_DF} size={18} color={C.muted} anchor="end" weight={500}>
            d terisi
          </Label2>
          <MOLevel x={DCX} y={Y_PIS} w={70} n={2} gap={14} color={C.pink} t={t} lit={back} spin={34} />
          <Label2 x={DCX + 96} y={Y_PIS} size={20} color={C.mint} anchor="start" weight={700}>
            LUMO
          </Label2>
          <RichLabel x={DCX} y={Y_PIS - 34} parts={[['π'], ['*', 'sup']]} size={22} color={C.pink} />
          <MOLevel x={DCX} y={Y_SG} w={110} color={C.gold} e={2} t={t} lit={homo * (1 - back)} spin={36} />
          <Label2 x={DCX + 78} y={Y_SG} size={20} color={C.gold} anchor="start" weight={700}>
            HOMO
          </Label2>
          <Label2 x={DCX} y={Y_SG + 36} size={20} color={C.gold} weight={600}>
            σ
          </Label2>
          <g opacity={don}>
            <DrawPath d={`M${DCX - 70},${Y_SG - 8} L${DMX + 70},${Y_DE + 8}`} p={don} stroke={C.cyan} width={4} len={500} />
            {head([DCX - 70, Y_SG - 8], [(DCX + DMX) / 2, (Y_SG + Y_DE) / 2], [DMX + 70, Y_DE + 8], C.cyan, don)}
          </g>
          <g opacity={back}>
            <DrawPath d={`M${DMX + 90},${Y_DF - 8} L${DCX - 90},${Y_PIS + 8}`} p={back} stroke={C.pink} width={4} len={500} />
            {head([DMX + 90, Y_DF - 8], [(DCX + DMX) / 2, (Y_DF + Y_PIS) / 2], [DCX - 90, Y_PIS + 8], C.pink, back)}
          </g>
          <line x1={1250} y1={640} x2={1250} y2={280} stroke={C.muted} strokeWidth={2} opacity={0.6} />
          <path d="M1250,268 l-7,14 l14,0 Z" fill={C.muted} opacity={0.6} />
          <Label2 x={1250} y={252} size={20} color={C.muted} font="serif">
            E
          </Label2>
        </g>

        {/* ===== panel kanan 2: spektrum IR mini ===== */}
        <g opacity={panelIR}>
          <Label2 x={IX + IW / 2} y={262} size={24} color={C.ink} weight={700}>
            spektrum IR (regangan C–O)
          </Label2>
          <line x1={IX} y1={IB} x2={IX + IW} y2={IB} stroke={C.muted} strokeWidth={2} />
          {[2200, 2100, 2000, 1900].map((nu) => (
            <g key={nu}>
              <line x1={nuX(nu)} y1={IB} x2={nuX(nu)} y2={IB + 10} stroke={C.muted} strokeWidth={2} />
              <Label2 x={nuX(nu)} y={IB + 30} size={18} color={C.muted} font="mono" weight={500}>
                {nu}
              </Label2>
            </g>
          ))}
          <RichLabel x={IX + IW / 2} y={IB + 66} parts={[['bilangan gelombang (cm'], ['−1', 'sup'], [')']]} size={20} color={C.muted} weight={500} />
          <path d={irPath(2143, 210)} fill="none" stroke={C.muted} strokeWidth={2.5} strokeDasharray="6 7" opacity={0.7 * shift} />
          <path d={irPath(nuNow, 210)} fill="none" stroke={C.amber} strokeWidth={4.5} />
          <Label2 x={nuX(2143)} y={IB - 236} size={20} color={C.muted} weight={600}>
            CO bebas 2143
          </Label2>
          <Label2 x={nuX(nuNow)} y={IB - 236} size={22} color={C.amber} weight={700} opacity={shift}>
            M–CO ≈ 2000
          </Label2>
          <path d={`M${nuX(2143) + 20},${IB - 120} L${nuX(2000) - 26},${IB - 120}`} stroke={C.red} strokeWidth={3} opacity={shift} markerEnd="url(#arrow-red)" />
        </g>

        {/* ===== panel kanan 3: permukaan katalis ===== */}
        <g opacity={panelCat}>
          {Array.from({length: 2}, (_, row) =>
            Array.from({length: 8 - row}, (_, i) => (
              <MetalBall key={`${row}-${i}`} x={1250 + i * 72 + row * 36} y={600 + row * 56} r={34} label="" glow={0} />
            )),
          )}
          {[0, 2, 4, 6].map((i, q) => {
            const bx = 1250 + i * 72;
            const land = ramp(t, cue(4) + 0.2 + q * 0.5, cue(4) + 1.4 + q * 0.5, EASE_IN_OUT);
            const bob = 3 * Math.sin(t * 2.4 + q);
            const cy = mix(300, 540, land) + bob;
            return (
              <g key={i} opacity={Math.min(1, land * 3)} transform={`rotate(${(1 - land) * 40} ${bx} ${cy})`}>
                <line x1={bx} y1={cy} x2={bx} y2={cy - 46} stroke="#8b97b8" strokeWidth={7} />
                <circle cx={bx} cy={cy} r={18} fill="url(#atom-C)" />
                <circle cx={bx} cy={cy - 50} r={18} fill="url(#atom-O)" />
              </g>
            );
          })}
          <Label2 x={1500} y={740} size={24} color={C.ink} weight={700} opacity={cat}>
            permukaan katalis logam
          </Label2>
          <Label2 x={1500} y={420} size={20} color={C.muted} weight={500} opacity={cat}>
            CO terikat & teraktifkan
          </Label2>
        </g>
      </Stage>

      <Formula x={960} y={800} p={sIR} size={58} accent={C.amber}>
        <NuTilde />
        <span style={{fontFamily: FONT.serif}}>(C–O): 2143 → ≈ 2000 cm</span>
        <Sup>−1</Sup>
      </Formula>
      <Card x={960} y={800} opacity={sDCD} accent={C.cyan} style={{padding: '20px 40px'}}>
        <div style={{fontSize: 46, fontWeight: 700, textAlign: 'center'}}>
          model <span style={{color: C.cyan}}>donasi</span> & <span style={{color: C.pink}}>donasi balik</span>
        </div>
        <div style={{fontSize: 28, color: C.muted, textAlign: 'center', marginTop: 6}}>(Dewar–Chatt–Duncanson)</div>
      </Card>
    </AbsoluteFill>
  );
};
