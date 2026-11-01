import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {EASE_IN_OUT, cyc, mix, ramp, slot} from '../anim';
import {DrawPath, Formula, Frac, Glow, Stage, V} from '../components/primitives';
import {Label2} from '../components/moC';
import {TestTube} from '../components/grupD';
import {PhotonPacket, wlColor} from '../components/viz';
import {Carrot, Eye, Leaf} from '../components/poC';
import {useScene} from '../SceneContext';
import {C} from '../theme';

// Bab 09: rantai terkonjugasi makin panjang → tingkat π makin rapat, celah HOMO–LUMO mengecil
// (analog partikel dalam kotak). Butadiena menyerap UV (≈ 217 nm); β-karoten 11 C=C, λmaks ≈ 450 nm
// (biru) → tampak jingga (AUDIT).
const STAGES = [2, 3, 5, 8, 11];
const NMAX = 22;
const chainX = (i: number) => 170 + i * 75;
const chainY = (i: number) => 236 + (i % 2 ? -22 : 22);

// diagram tingkat Hückel poliena linear (N = 2k atom C): E = α + 2β cos(jπ/(N+1))
const LX = 330;
const LW = 170;
const LY0 = 590;
const LS = 100; // px per |β|
const levY = (N: number, j: number) => LY0 + LS * 2 * Math.cos((j * Math.PI) / (N + 1));

// kotak partikel
const BX = 880;
const BTOP = 380;
const BBOT = 790;
const CBOX = 2.0e6;
const boxL = (k: number) => 160 + 28 * k;

// spektrum serapan
const SX = 1250;
const SW = 540;
const SB = 640; // garis dasar
const nmX = (nm: number) => SX + ((nm - 200) / 500) * SW;
const gauss = (x: number, m: number, s: number) => Math.exp(-(((x - m) / s) ** 2) / 2);
const absBut = (nm: number) => gauss(nm, 217, 13);
const absCar = (nm: number) => (0.78 * gauss(nm, 425, 14) + 1.0 * gauss(nm, 452, 15) + 0.86 * gauss(nm, 479, 14)) / 1.26;

export const Color: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);
  const pulse = 0.5 + 0.5 * Math.sin(t * 3);

  // parameter tahap u ∈ [0, 4] (2 → 11 ikatan rangkap)
  const stepA = [2.0, 3.3, 4.6, 5.9].reduce((a, s) => a + ramp(t, s - 0.5, s + 0.4, EASE_IN_OUT), 0);
  const reset = ramp(t, cue(1) - 0.3, cue(1) + 0.6, EASE_IN_OUT);
  const stepB = [1.2, 2.5, 3.8, 5.1].reduce((a, s) => a + ramp(t, cue(1) + s - 0.5, cue(1) + s + 0.4, EASE_IN_OUT), 0);
  const tBut = wordOf(2, 'Butadiena');
  const tCar = wordOf(2, 'karoten');
  const dB = ramp(t, tBut - 0.3, tBut + 0.8, EASE_IN_OUT);
  const uK = ramp(t, tCar - 0.4, tCar + 1.2, EASE_IN_OUT);
  const u = Math.max(0, Math.min(4, stepA * (1 - reset) + stepB - 4 * dB + 4 * uK));
  const k = interpolate(u, [0, 1, 2, 3, 4], STAGES);
  const N = 2 * k;
  const wS = STAGES.map((_, s) => Math.max(0, 1 - Math.abs(u - s)));

  const inChain = ramp(t, 0.2, 1.2);
  const inLev = ramp(t, 0.6, 1.6);
  const gapIn = ramp(t, wordOf(0, 'celah') - 0.4, wordOf(0, 'celah') + 0.4);
  const boxIn = ramp(t, cue(1) - 0.4, cue(1) + 0.6) * (1 - ramp(t, wordOf(2, 'biru') - 0.9, wordOf(2, 'biru') - 0.25, EASE_IN_OUT));
  const specIn = ramp(t, cue(2) - 0.4, cue(2) + 0.6);
  const butDraw = ramp(t, wordOf(2, 'ultraviolet') - 0.6, wordOf(2, 'ultraviolet') + 0.6);
  const carDraw = ramp(t, wordOf(2, 'biru') - 0.6, wordOf(2, 'nanometer') + 0.2);
  const sHc = slot(t, wordOf(2, 'biru') - 0.2, cue(3) - 0.05);
  const carrotIn = ramp(t, cue(3) - 0.2, cue(3) + 0.7) * (1 - ramp(t, cue(4) - 0.5, cue(4) + 0.1, EASE_IN_OUT));
  const seeOrange = ramp(t, wordOf(3, 'jingga') - 0.4, wordOf(3, 'jingga') + 0.4);
  const wortel = ramp(t, wordOf(3, 'wortel') - 0.3, wordOf(3, 'wortel') + 0.5);
  const iconsIn = ramp(t, cue(4) - 0.1, cue(4) + 0.7);
  const ic = (w: string) => ramp(t, wordOf(4, w) - 0.3, wordOf(4, w) + 0.5);
  const same = ramp(t, wordOf(4, 'prinsip') - 0.3, wordOf(4, 'prinsip') + 0.5);

  // HOMO/LUMO kontinu (rata-rata berbobot antar tahap)
  const homoY = STAGES.reduce((a, kk, s) => a + wS[s] * levY(2 * kk, kk), 0);
  const lumoY = STAGES.reduce((a, kk, s) => a + wS[s] * levY(2 * kk, kk + 1), 0);

  // rantai
  const bondPts = Array.from({length: NMAX - 1}, (_, i) => i);
  const vis = (i: number) => Math.max(0, Math.min(1, N - 1 - i));

  // kotak partikel
  const L = boxL(k);
  const bx0 = BX - L / 2;
  const bx1 = BX + L / 2;

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        {/* rantai terkonjugasi */}
        <g opacity={inChain}>
          {bondPts.map((i) => {
            const v = vis(i);
            if (v <= 0.001) return null;
            const x1 = chainX(i);
            const y1 = chainY(i);
            const x2 = mix(x1, chainX(i + 1), v);
            const y2 = mix(y1, chainY(i + 1), v);
            const dbl = i % 2 === 0;
            const len = Math.hypot(chainX(i + 1) - x1, chainY(i + 1) - y1);
            const nx = (-(chainY(i + 1) - y1) / len) * 10 * (i % 4 === 0 ? 1 : -1);
            const ny = ((chainX(i + 1) - x1) / len) * 10 * (i % 4 === 0 ? 1 : -1);
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9aa6c8" strokeWidth={6} strokeLinecap="round" />
                {dbl ? <line x1={x1 + nx * 1.2 + (x2 - x1) * 0.12} y1={y1 + ny * 1.2 + (y2 - y1) * 0.12} x2={x2 + nx * 1.2 - (x2 - x1) * 0.12} y2={y2 + ny * 1.2 - (y2 - y1) * 0.12} stroke={C.amber} strokeWidth={5} strokeLinecap="round" opacity={v} /> : null}
              </g>
            );
          })}
          {Array.from({length: NMAX}, (_, i) => {
            const v = Math.max(0, Math.min(1, N - i));
            return v > 0.001 ? <circle key={i} cx={chainX(i)} cy={chainY(i)} r={9} fill="#5a6378" stroke="#9fb0d6" strokeWidth={2} opacity={v} /> : null;
          })}
          {/* elektron π mengalir di sepanjang rantai */}
          {[0, 1, 2, 3].map((q) => {
            const ph = (t * 0.22 + q / 4) % 1;
            const pos = ph * (N - 1);
            const i = Math.min(NMAX - 2, Math.floor(pos));
            const f = pos - i;
            const x = mix(chainX(i), chainX(i + 1), f);
            const y = mix(chainY(i), chainY(i + 1), f) - 22;
            return <circle key={q} cx={x} cy={y} r={6} fill={C.amber} opacity={0.8 * cyc(ph)} />;
          })}
          {STAGES.map((kk, s) => (
            <Label2 key={kk} x={1750} y={168} size={26} color={C.amber} anchor="end" weight={700} opacity={wS[s]}>
              {`${kk} ikatan C=C terkonjugasi${kk === 2 ? ' (butadiena)' : kk === 11 ? ' (β-karoten)' : ''}`}
            </Label2>
          ))}
        </g>

        {/* diagram tingkat π */}
        <g opacity={inLev}>
          <Label2 x={LX} y={350} size={24} color={C.muted} weight={500}>
            orbital π (Hückel)
          </Label2>
          <line x1={LX - LW / 2 - 30} y1={LY0} x2={LX + LW / 2 + 30} y2={LY0} stroke={C.muted} strokeWidth={1.5} strokeDasharray="6 8" strokeDashoffset={-t * 12} opacity={0.5} />
          {STAGES.map((kk, s) => {
            if (wS[s] <= 0.001) return null;
            const n2 = 2 * kk;
            return (
              <g key={kk} opacity={wS[s]}>
                {Array.from({length: n2}, (_, jj) => {
                  const j = jj + 1;
                  const y = levY(n2, j);
                  const col = j === kk ? C.gold : j === kk + 1 ? C.mint : j <= kk ? C.cyan : C.red;
                  return (
                    <g key={j}>
                      <line x1={LX - LW / 2} y1={y} x2={LX + LW / 2} y2={y} stroke={col} strokeWidth={j === kk || j === kk + 1 ? 5 : 3.5} strokeLinecap="round" />
                      {j <= kk ? (
                        <>
                          <circle cx={LX - 14} cy={y - 7 + 1.2 * Math.sin(t * 2 + j)} r={4.5} fill={C.cyan} />
                          <circle cx={LX + 14} cy={y - 7 + 1.2 * Math.sin(t * 2 + j + 1)} r={4.5} fill={C.pink} />
                        </>
                      ) : null}
                    </g>
                  );
                })}
              </g>
            );
          })}
          <Label2 x={LX - LW / 2 - 14} y={homoY} size={20} color={C.gold} anchor="end" weight={700}>
            HOMO
          </Label2>
          <Label2 x={LX - LW / 2 - 14} y={lumoY} size={20} color={C.mint} anchor="end" weight={700}>
            LUMO
          </Label2>
          <g opacity={gapIn}>
            <rect x={LX + LW / 2 + 14} y={lumoY} width={30} height={homoY - lumoY} rx={6} fill={C.gold} opacity={0.12 + 0.08 * pulse} />
            <line x1={LX + LW / 2 + 29} y1={homoY - 4} x2={LX + LW / 2 + 29} y2={lumoY + 12} stroke={C.gold} strokeWidth={4} />
            <path d={`M${LX + LW / 2 + 29},${lumoY + 2} l-9,14 l18,0 Z`} fill={C.gold} />
            <Label2 x={LX + LW / 2 + 54} y={(homoY + lumoY) / 2} size={28} color={C.gold} anchor="start" font="serif" weight={600}>
              ΔE
            </Label2>
          </g>
          <Label2 x={LX} y={836} size={22} color={C.muted} weight={500} opacity={gapIn}>
            rantai panjang → celah kecil
          </Label2>
        </g>

        {/* analogi partikel dalam kotak */}
        <g opacity={boxIn}>
          <Label2 x={BX} y={350} size={24} color={C.violet} weight={600}>
            partikel dalam kotak
          </Label2>
          <path d={`M${bx0},${BTOP + 20} L${bx0},${BBOT} L${bx1},${BBOT} L${bx1},${BTOP + 20}`} fill="none" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
          <rect x={bx0 - 18} y={BTOP + 20} width={18} height={BBOT - BTOP - 20} fill={C.violet} opacity={0.18} />
          <rect x={bx1} y={BTOP + 20} width={18} height={BBOT - BTOP - 20} fill={C.violet} opacity={0.18} />
          {[1, 2, 3, 4, 5, 6].map((n) => {
            const y = BBOT - (CBOX * n * n) / (L * L);
            const op = Math.max(0, Math.min(1, (y - BTOP - 20) / 40));
            if (op <= 0.001) return null;
            const amp = 12 * Math.cos(t * (1.2 + 0.4 * n));
            const pts: string[] = [];
            for (let q = 0; q <= 60; q++) {
              const xx = bx0 + (L * q) / 60;
              pts.push(`${q ? 'L' : 'M'}${xx.toFixed(1)},${(y - amp * Math.sin((n * Math.PI * q) / 60)).toFixed(1)}`);
            }
            return (
              <g key={n} opacity={op}>
                <line x1={bx0 + 6} y1={y} x2={bx1 - 6} y2={y} stroke={C.violet} strokeWidth={2.5} opacity={0.75} />
                <path d={pts.join(' ')} fill="none" stroke={C.violet} strokeWidth={2.5} opacity={0.9} />
                <Label2 x={bx1 + 30} y={y} size={18} color={C.muted} anchor="start" weight={500} font="serif">
                  {`n = ${n}`}
                </Label2>
              </g>
            );
          })}
          <line x1={bx0} y1={BBOT + 26} x2={bx1} y2={BBOT + 26} stroke={C.muted} strokeWidth={2} />
          <path d={`M${bx0},${BBOT + 26} l12,-7 l0,14 Z M${bx1},${BBOT + 26} l-12,-7 l0,14 Z`} fill={C.muted} />
          <Label2 x={BX} y={BBOT + 52} size={22} color={C.muted} font="serif" weight={500}>
            L (panjang rantai)
          </Label2>
        </g>

        {/* wortel & mata */}
        <g opacity={carrotIn}>
          <Carrot x={830} y={610} s={1.1} t={t} opacity={1} />
          <Glow x={830} y={610} r={170} color="gold" opacity={seeOrange * (0.18 + 0.1 * pulse)} />
          {/* cahaya putih masuk */}
          {[450, 530, 610].map((nm, q) => {
            const ph = (t * 0.32 + q / 3) % 1;
            const absorbed = nm === 450;
            const sx = mix(560, 790, Math.min(1, ph * 1.6));
            const sy = mix(400, 570, Math.min(1, ph * 1.6));
            const ph2 = Math.max(0, ph * 1.6 - 1) / 0.6;
            return (
              <g key={nm}>
                <PhotonPacket x={sx} y={sy} wavelength={nm / 18} color={wlColor(nm)} len={110} amp={14} angle={36} phase={-t * 14} opacity={cyc(Math.min(1, ph * 1.6)) * (absorbed ? 1 : 0.9)} />
                {!absorbed ? <PhotonPacket x={mix(880, 1040, ph2)} y={mix(550, 450, ph2)} wavelength={nm / 18} color={wlColor(nm === 530 ? 590 : 615)} len={110} amp={14} angle={-32} phase={-t * 14} opacity={cyc(Math.min(0.999, ph2)) * seeOrange} /> : null}
              </g>
            );
          })}
          <Label2 x={600} y={370} size={22} color={C.ink} weight={500}>
            cahaya putih
          </Label2>
          <Label2 x={680} y={790} size={22} color={wlColor(450)} weight={700} opacity={seeOrange}>
            biru diserap
          </Label2>
          <Eye x={1100} y={420} s={0.8} t={t} iris={C.amber} opacity={seeOrange} />
          <Label2 x={1090} y={500} size={24} color={C.amber} weight={700} opacity={seeOrange}>
            terlihat: jingga
          </Label2>
          <Label2 x={1090} y={532} size={19} color={C.muted} weight={500} opacity={seeOrange}>
            warna komplementer biru
          </Label2>
          <Label2 x={900} y={834} size={28} color={C.amber} weight={700} opacity={wortel}>
            warna wortel
          </Label2>
        </g>

        {/* prinsip yang sama */}
        <g opacity={iconsIn}>
          <TestTube x={680} y={580} w={80} h={250} color={C.violet} t={t} opacity={ic('Pewarna')} seed={3} />
          <Label2 x={680} y={740} size={22} color={C.ink} weight={600} opacity={ic('Pewarna')}>
            pewarna
          </Label2>
          <Leaf x={880} y={580} s={1} t={t} opacity={ic('daun')} />
          <Label2 x={880} y={740} size={22} color={C.ink} weight={600} opacity={ic('daun')}>
            pigmen daun
          </Label2>
          <Eye x={1080} y={580} s={0.9} t={t} iris={C.blue} opacity={ic('penglihatan')} />
          <Label2 x={1080} y={740} size={22} color={C.ink} weight={600} opacity={ic('penglihatan')}>
            penglihatan
          </Label2>
          <Label2 x={880} y={400} size={32} color={C.gold} weight={700} opacity={same}>
            prinsip yang sama
          </Label2>
          <Label2 x={880} y={800} size={20} color={C.muted} weight={500} opacity={same}>
            konjugasi panjang → celah kecil → menyerap cahaya tampak
          </Label2>
        </g>

        {/* spektrum serapan */}
        <g opacity={specIn}>
          <Label2 x={SX + SW / 2} y={SB - 300} size={24} color={C.muted} weight={500}>
            spektrum serapan
          </Label2>
          <rect x={nmX(200)} y={SB + 8} width={nmX(380) - nmX(200)} height={24} fill="#3a2a6a" opacity={0.8} />
          <rect x={nmX(380)} y={SB + 8} width={nmX(700) - nmX(380)} height={24} fill="url(#rainbow-h)" />
          <Label2 x={(nmX(200) + nmX(380)) / 2} y={SB + 20} size={18} color={C.ink} weight={700}>
            UV
          </Label2>
          {[200, 300, 400, 500, 600, 700].map((nm) => (
            <g key={nm}>
              <line x1={nmX(nm)} y1={SB + 34} x2={nmX(nm)} y2={SB + 44} stroke={C.muted} strokeWidth={2} />
              <Label2 x={nmX(nm)} y={SB + 62} size={18} color={C.muted} weight={500} font="mono">
                {nm}
              </Label2>
            </g>
          ))}
          <Label2 x={SX + SW / 2} y={SB + 96} size={20} color={C.muted} weight={500}>
            λ (nm)
          </Label2>
          <line x1={SX} y1={SB} x2={SX + SW} y2={SB} stroke={C.muted} strokeWidth={2} />
          {/* pita biru yang diserap β-karoten */}
          <rect x={nmX(410)} y={SB - 230} width={nmX(495) - nmX(410)} height={230} rx={8} fill={wlColor(450)} opacity={carDraw * (0.08 + 0.06 * pulse) + seeOrange * 0.1} />
          <DrawPath
            d={Array.from({length: 121}, (_, q) => {
              const nm = 200 + (q / 120) * 120;
              return `${q ? 'L' : 'M'}${nmX(nm).toFixed(1)},${(SB - 200 * absBut(nm)).toFixed(1)}`;
            }).join(' ')}
            p={butDraw}
            stroke="#b48cff"
            width={4}
            len={1200}
          />
          <DrawPath
            d={Array.from({length: 201}, (_, q) => {
              const nm = 330 + (q / 200) * 260;
              return `${q ? 'L' : 'M'}${nmX(nm).toFixed(1)},${(SB - 200 * absCar(nm)).toFixed(1)}`;
            }).join(' ')}
            p={carDraw}
            stroke={wlColor(450)}
            width={5}
            len={1600}
          />
          <g opacity={butDraw}>
            <line x1={nmX(217)} y1={SB - 205} x2={nmX(217)} y2={SB} stroke="#b48cff" strokeWidth={1.5} strokeDasharray="4 6" opacity={0.6} />
            <Label2 x={nmX(217) + 26} y={SB - 140} size={21} color="#c9adff" anchor="start" weight={600}>
              butadiena
            </Label2>
            <Label2 x={nmX(217) + 26} y={SB - 112} size={19} color="#c9adff" anchor="start" weight={500}>
              ≈ 217 nm (UV)
            </Label2>
          </g>
          <g opacity={carDraw}>
            <Label2 x={nmX(452)} y={SB - 232} size={22} color={wlColor(470)} weight={700}>
              β-karoten ≈ 450 nm
            </Label2>
          </g>
        </g>
      </Stage>

      <Formula x={BX} y={560} p={sHc} size={60} accent={wlColor(450)} caption="celah kecil → λ panjang (cahaya tampak)">
        Δ<V>E</V> = <Frac n={<V>hc</V>} d={<V>λ</V>} />
      </Formula>
    </AbsoluteFill>
  );
};
