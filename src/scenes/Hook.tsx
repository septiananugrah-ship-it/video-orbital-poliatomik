import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp} from '../anim';
import {Badge, DrawPath, Glow, Label, Stage} from '../components/primitives';
import {Stars} from '../components/grupA';
import {RichLabel} from '../components/vbD';
import {Electron, PhotonPacket} from '../components/viz';
import {Render3D, TETRA, VbDefs, add, hybrid, methane, mul, proj, type Cam} from '../components/vbC';
import {CH4_BANDS, MolCloud, PoADefs, ch4Signal} from '../components/poA';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Pembuka: metana dengan empat sp³ identik → prediksi satu energi ionisasi → PES: dua pita (≈ 14 & ≈ 23 eV)
// → "siapa yang benar?" → awan elektron yang menyebar ke seluruh molekul: orbital milik bersama.
const BOX = {x: 1010, y: 760, w: 760, h: 300, e0: 10, e1: 27};
const ex = (E: number) => BOX.x + ((E - BOX.e0) / (BOX.e1 - BOX.e0)) * BOX.w;
const ey = (v: number) => BOX.y - v * BOX.h;
const MY = 440;
const LAMP = {x: 200, y: 230};
const DET = {x: 860, y: 250};

const specPath = (f: (E: number) => number, e0: number, e1: number) => {
  const n = Math.max(2, Math.round((e1 - e0) * 14));
  return Array.from({length: n + 1}, (_, i) => {
    const E = e0 + ((e1 - e0) * i) / n;
    return `${i ? 'L' : 'M'}${ex(E).toFixed(1)},${ey(f(E)).toFixed(1)}`;
  }).join(' ');
};
const areaOf = (e0: number, e1: number) => `${specPath(ch4Signal, e0, e1)} L${ex(e1)},${BOX.y} L${ex(e0)},${BOX.y} Z`;
const predSignal = (E: number) => 1.05 * Math.exp(-(((E - 14) / 0.55) ** 2));

export const Hook: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();

  // ---------- metana sp³ ----------
  const molIn = ramp(t, -0.2, 1.4, BACK);
  const lobesIn = ramp(t, wordOf(0, 'empat', 1) - 0.4, wordOf(0, 'sp') + 0.4);
  const ident = ramp(t, wordOf(0, 'identik') - 0.3, wordOf(0, 'identik') + 0.5);
  const tagPulse = ramp(t, wordOf(0, 'sama') - 0.3, wordOf(0, 'sama') + 0.4);
  const toLeft = ramp(t, cue(1) - 0.6, cue(1) + 0.8, EASE_IN_OUT);
  const toCenter = ramp(t, cue(4) - 0.5, cue(4) + 1.0, EASE_IN_OUT);
  const mx = mix(mix(960, 470, toLeft), 960, toCenter);
  const spread = ramp(t, wordOf(4, 'menyebar') - 0.6, wordOf(4, 'molekul') + 0.8, EASE_IN_OUT);
  const lobeFade = 1 - 0.85 * spread;
  const cam: Cam = {cx: mx, cy: MY + 5 * Math.sin(t * 0.9), s: 150, yaw: 0.5 + t * 0.32, pitch: 0.34};

  // ---------- prediksi & spektrum ----------
  const specIn = ramp(t, cue(1) + 0.1, cue(1) + 1.0) * (1 - ramp(t, cue(4) - 0.4, cue(4) + 0.6, EASE_IN_OUT));
  const pred = ramp(t, wordOf(1, 'energi') - 0.6, wordOf(1, 'sama') + 0.4);
  const predDim = 1 - 0.65 * ramp(t, cue(2) + 0.2, cue(2) + 1.2, EASE_IN_OUT);
  const appIn = ramp(t, wordOf(2, 'spektroskopi') - 0.5, wordOf(2, 'spektroskopi') + 0.5) * (1 - ramp(t, cue(3) + 0.5, cue(3) + 1.5, EASE_IN_OUT));
  const tE = wordOf(2, 'empat');
  const tT = Math.max(tE + 0.6, wordOf(2, 'tiga'));
  const eUpto = interpolate(t, [wordOf(2, 'menunjukkan'), tE + 0.35, tT + 0.35, tT + 1.6], [BOX.e0, 15.8, 24.2, BOX.e1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const n14 = ramp(t, tE - 0.1, tE + 0.5, BACK);
  const n23 = ramp(t, tT - 0.1, tT + 0.5, BACK);
  const strong = ramp(t, wordOf(3, 'kuat') - 0.4, wordOf(3, 'kuat') + 0.4);
  const areas = ramp(t, wordOf(3, 'lain') - 0.3, wordOf(3, 'lain') + 0.6);
  const ask = ramp(t, wordOf(3, 'Siapa') - 0.3, wordOf(3, 'Siapa') + 0.5, BACK) * (1 - ramp(t, cue(4) - 0.4, cue(4) + 0.4, EASE_IN_OUT));
  const title = ramp(t, wordOf(4, 'milik') - 0.6, wordOf(4, 'bersama') + 0.6);
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);

  // ---------- benda 3D ----------
  const C0: [number, number, number] = [0, 0, 0];
  const items = [
    ...methane(cam, {opacity: molIn}),
    ...TETRA.flatMap((d, i) => hybrid(cam, {origin: C0, dir: d, len: 1.42, wid: 0.5, color: 'mint', opacity: 0.5 * lobesIn * lobeFade * molIn, glow: tagPulse * (0.6 + 0.4 * Math.sin(t * 3 + i)), small: 0.3})),
  ];
  const tips = TETRA.map((d) => proj(add(C0, mul(d, 1.62)), cam));

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <VbDefs />
        <PoADefs />
        <Stars t={t} n={60} y1={880} opacity={0.6 * molIn} />
        <Glow x={mx} y={MY} r={380} color="mint" opacity={0.12 * lobesIn * lobeFade} />

        {/* ---------- alat PES mini ---------- */}
        <g opacity={appIn}>
          <circle cx={LAMP.x} cy={LAMP.y} r={90} fill="url(#soft-violet)" opacity={0.35 + 0.15 * Math.sin(t * 5)} />
          <rect x={LAMP.x - 60} y={LAMP.y - 44} width={120} height={88} rx={18} fill="rgba(30,24,64,0.95)" stroke={C.violet} strokeWidth={3} />
          <ellipse cx={LAMP.x + 60} cy={LAMP.y} rx={14} ry={28} fill="#cdbfff" opacity={0.55 + 0.25 * Math.sin(t * 6)} />
          <Label x={LAMP.x} y={LAMP.y + 76} size={24} color={C.violet} weight={600}>
            lampu UV
          </Label>
          {[0, 1, 2].map((k) => {
            const ph = (((t * 0.7 + k / 3) % 1) + 1) % 1;
            const x = mix(LAMP.x + 80, mx - 90, ph);
            const y = mix(LAMP.y + 20, MY - 70, ph);
            return <PhotonPacket key={k} x={x} y={y} wavelength={14} color="#b9a4ff" amp={12} len={80} angle={42} opacity={cyc(ph)} phase={-t * 12} />;
          })}
          {Array.from({length: 6}, (_, k) => {
            const ph = (((t * 0.45 + k / 6) % 1) + 1) % 1;
            const x0 = mx + 70;
            const y0 = MY - 80;
            const x = (1 - ph) ** 2 * x0 + 2 * (1 - ph) * ph * (x0 + 140) + ph * ph * DET.x;
            const y = (1 - ph) ** 2 * y0 + 2 * (1 - ph) * ph * (y0 - 160) + ph * ph * DET.y;
            return <Electron key={k} x={x} y={y} r={7} opacity={cyc(ph)} />;
          })}
          <rect x={DET.x - 10} y={DET.y - 30} width={86} height={60} rx={10} fill="rgba(14,20,44,0.95)" stroke={C.mint} strokeWidth={3} />
          <rect x={DET.x - 2} y={DET.y - 22} width={70} height={44} rx={6} fill={C.mint} opacity={0.15 + 0.35 * (0.5 + 0.5 * Math.sin(t * 7))} />
          <Label x={DET.x + 33} y={DET.y - 56} size={24} color={C.mint} weight={600}>
            detektor
          </Label>
        </g>

        {/* ---------- spektrum ---------- */}
        <g opacity={specIn}>
          <line x1={BOX.x} y1={BOX.y} x2={BOX.x + BOX.w + 16} y2={BOX.y} stroke={C.muted} strokeWidth={3} />
          <line x1={BOX.x} y1={BOX.y} x2={BOX.x} y2={BOX.y - BOX.h - 40} stroke={C.muted} strokeWidth={3} />
          {[10, 15, 20, 25].map((E) => (
            <g key={E}>
              <line x1={ex(E)} y1={BOX.y} x2={ex(E)} y2={BOX.y + 10} stroke={C.muted} strokeWidth={2} />
              <Label x={ex(E)} y={BOX.y + 30} size={22} color={C.muted} font="mono">
                {String(E)}
              </Label>
            </g>
          ))}
          <Label x={BOX.x + BOX.w} y={BOX.y + 66} size={24} color={C.muted} anchor="end" weight={600}>
            energi ionisasi (eV) →
          </Label>
          <g transform={`rotate(-90 ${BOX.x - 30} ${BOX.y - 150})`}>
            <Label x={BOX.x - 30} y={BOX.y - 150} size={21} color={C.muted}>
              jumlah elektron
            </Label>
          </g>
          {/* prediksi: satu puncak */}
          <g opacity={pred * predDim}>
            <path d={specPath(predSignal, BOX.e0, BOX.e1)} fill="none" stroke={C.mint} strokeWidth={3} strokeDasharray="10 9" strokeDashoffset={-t * 14} />
            <Label x={ex(14) + 40} y={ey(1.05) - 30} size={26} color={C.mint} weight={600} anchor="start" opacity={1 - ramp(t, cue(2) - 0.2, cue(2) + 0.6, EASE_IN_OUT)}>
              prediksi: satu energi ionisasi?
            </Label>
          </g>
          {/* isi pita (luas ∝ jumlah elektron) */}
          <path d={areaOf(11, 17)} fill={C.cyan} opacity={0.28 * areas} />
          <path d={areaOf(21, 25)} fill={C.violet} opacity={0.4 * areas + 0.15 * strong * (0.5 + 0.5 * Math.sin(t * 4))} />
          <path d={specPath(ch4Signal, BOX.e0, eUpto)} fill="none" stroke={C.gold} strokeWidth={10} strokeOpacity={0.12} strokeLinejoin="round" />
          <path d={specPath(ch4Signal, BOX.e0, eUpto)} fill="none" stroke={C.gold} strokeWidth={3.5} strokeLinejoin="round" />
          <circle cx={ex(eUpto)} cy={ey(ch4Signal(eUpto))} r={7} fill="#fff6d0" opacity={ramp(eUpto, 10.1, 10.4) * (1 - ramp(eUpto, 26.5, 27))} />
          <g opacity={n14} transform={`translate(0 ${(1 - n14) * 10})`}>
            <Label x={ex(14)} y={ey(1) - 30} size={30} color={C.ink} weight={700} font="mono">
              ≈ 14 eV
            </Label>
          </g>
          <g opacity={n23} transform={`translate(0 ${(1 - n23) * 10})`}>
            <Label x={ex(23)} y={ey(CH4_BANDS[1].h) - 30} size={30} color={C.ink} weight={700} font="mono">
              ≈ 23 eV
            </Label>
          </g>
          <g opacity={areas}>
            <RichLabel x={ex(14) + 62} y={ey(0.42)} parts={[['6 e'], ['−', 'sup']]} size={32} color={C.cyan} anchor="start" />
            <RichLabel x={ex(23) + 46} y={ey(0.25)} parts={[['2 e'], ['−', 'sup']]} size={32} color={C.violet} anchor="start" />
          </g>
          <g opacity={strong}>
            <Label x={ex(23)} y={ey(CH4_BANDS[1].h) - 120} size={26} color={C.violet} weight={700}>
              terikat jauh lebih kuat
            </Label>
            <DrawPath d={`M${ex(23)},${ey(CH4_BANDS[1].h) - 98} L${ex(23)},${ey(CH4_BANDS[1].h) - 60}`} p={strong} stroke={C.violet} width={4} />
          </g>
        </g>

        {/* ---------- awan milik bersama ---------- */}
        <MolCloud cx={mx} cy={MY} rx={330} ry={280} t={t} p={spread} n={150} />

        {/* ---------- metana 3D ---------- */}
        <Render3D items={items} />
        {/* nomor lobus: empat yang sama */}
        <g opacity={lobesIn * lobeFade * (1 - toLeft * 0.4)}>
          {tips.map((q, i) => (
            <g key={i} transform={`translate(${q.X} ${q.Y}) scale(${1 + 0.18 * tagPulse * Math.max(0, Math.sin(t * 4 - i * 0.6))})`}>
              <circle r={19} fill="rgba(8,14,30,0.9)" stroke={C.mint} strokeWidth={2.5} />
              <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT.mono} fontSize={20} fontWeight={600} fill={C.mint}>
                {i + 1}
              </text>
            </g>
          ))}
        </g>
        <g opacity={ident * (1 - toCenter)}>
          <RichLabel x={mx} y={MY + 290} parts={[['hibridisasi: 4 orbital sp'], ['3', 'sup'], [' identik']]} size={34} color={C.mint} />
          <Label x={mx} y={MY + 340} size={26} color={C.muted} opacity={1 - toLeft * 0.2}>
            4 ikatan C–H yang sama persis
          </Label>
        </g>
      </Stage>

      {/* tanda tanya besar */}
      <div
        style={{
          position: 'absolute',
          left: 790,
          top: 470,
          transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * ask}) rotate(${4 * Math.sin(t * 1.3)}deg)`,
          opacity: ask,
          fontFamily: FONT.sans,
          fontWeight: 800,
          fontSize: 220,
          color: C.gold,
          textShadow: '0 0 60px rgba(255,194,74,0.5)',
        }}
      >
        ?
      </div>
      <Badge x={960} y={130} text="siapa yang benar?" color={C.gold} opacity={ask} scale={0.85 + 0.15 * ask} />

      {/* judul gagasan */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 770, textAlign: 'center', opacity: title, translate: `0px ${(1 - title) * 24}px`}}>
        <div style={{fontFamily: FONT.sans, fontWeight: 800, fontSize: 72, letterSpacing: 6, color: C.gold, textShadow: '0 0 50px rgba(255,194,74,0.4)'}}>ORBITAL MILIK BERSAMA</div>
        <div style={{width: 720 * title, height: 2, margin: '14px auto 0', background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`}} />
      </div>
    </AbsoluteFill>
  );
};
