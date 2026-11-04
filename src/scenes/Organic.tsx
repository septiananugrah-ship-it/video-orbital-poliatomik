import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BACK, EASE_IN_OUT, cyc, mix, ramp, rand} from '../anim';
import {Glow, Label, Stage} from '../components/primitives';
import {Level, TArrow} from '../components/grupD';
import {Battery, Bulb} from '../components/vbD';
import {PhotonPacket, wlColor} from '../components/viz';
import {Dot, Hole, PoDefs, Polyene} from '../components/poD';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Bab 12: elektronika organik — semikonduktor terkonjugasi, sel surya organik (pendonor → penerima),
// OLED (elektron + lubang → foton), piksel merah/hijau/biru dari panjang konjugasi.

const PIX = [
  {nm: 625, gap: 120, n: 10, name: 'merah', conj: 'konjugasi panjang'},
  {nm: 530, gap: 155, n: 7, name: 'hijau', conj: 'sedang'},
  {nm: 460, gap: 195, n: 4, name: 'biru', conj: 'konjugasi pendek'},
];

const Layer: React.FC<{x: number; y: number; w: number; h: number; fill: string; label: string; op?: number; lit?: number; stroke?: string}> = ({x, y, w, h, fill, label, op = 1, lit = 0, stroke}) => (
  <g opacity={op}>
    <rect x={x} y={y} width={w} height={h} rx={6} fill={fill} stroke={stroke ?? '#ffffff22'} strokeWidth={2} />
    {lit > 0.01 ? <rect x={x} y={y} width={w} height={h} rx={6} fill="#fff" opacity={0.15 * lit} /> : null}
    <text x={x + w + 18} y={y + h / 2} dominantBaseline="central" fontFamily={FONT.sans} fontSize={26} fill={C.muted}>
      {label}
    </text>
  </g>
);

export const Organic: React.FC = () => {
  const {t, cue, wordOf, dur} = useScene();
  const out = 1 - ramp(t, dur - 0.9, dur - 0.1, EASE_IN_OUT);
  const p0 = Math.min(ramp(t, -0.4, 0.6), 1 - ramp(t, cue(1) - 0.7, cue(1) - 0.1, EASE_IN_OUT));
  const pS = Math.min(ramp(t, cue(1) - 0.1, cue(1) + 0.6), 1 - ramp(t, cue(3) - 0.7, cue(3) - 0.1, EASE_IN_OUT));
  const pO = ramp(t, cue(3) - 0.1, cue(3) + 0.6);
  const pOR = Math.min(pO, 1 - ramp(t, cue(4) - 0.6, cue(4), EASE_IN_OUT)); // diagram kanan OLED
  const pPix = ramp(t, cue(4), cue(4) + 0.6);

  /* ---------------- fase 0: semikonduktor terkonjugasi ---------------- */
  const semi = ramp(t, wordOf(0, 'semikonduktor') - 0.3, wordOf(0, 'semikonduktor') + 0.5, BACK);

  /* ---------------- fase S: sel surya ---------------- */
  const tPh = wordOf(1, 'cahaya');
  const tUp = wordOf(1, 'mengangkat');
  const tHop = wordOf(2, 'melompat');
  const tCur = wordOf(2, 'arus');
  const phIn = ramp(t, tPh - 0.4, tUp, EASE_IN_OUT);
  const up = ramp(t, tUp, tUp + 0.8, EASE_IN_OUT);
  const hop = ramp(t, tHop, tHop + 0.9, EASE_IN_OUT);
  const leave = ramp(t, tCur - 0.3, tCur + 0.9, EASE_IN_OUT);
  const cur = ramp(t, tCur - 0.2, tCur + 0.8);
  const DX = 1170; // pendonor
  const AX = 1570; // penerima
  const dL = 420;
  const dH = 680;
  const aL = 500;
  const aH = 760;
  // elektron utama
  let ex = DX;
  let ey = mix(dH, dL, up);
  ex = mix(ex, AX, hop);
  ey = mix(ey, aL, hop);
  ex = mix(ex, 1790, leave);
  const eOp = ramp(t, tUp - 0.5, tUp - 0.1) * (1 - leave);
  // siklus berikutnya (setelah arus mengalir)
  const loopOn = ramp(t, tCur + 0.6, tCur + 1.4);
  const loopPh = ((((t - tCur) * 0.32) % 1) + 1) % 1;
  const lUp = ramp(loopPh, 0.15, 0.35, EASE_IN_OUT);
  const lHop = ramp(loopPh, 0.45, 0.7, EASE_IN_OUT);
  const lx = mix(DX, AX, lHop) + 220 * ramp(loopPh, 0.75, 1);
  const ly = mix(mix(dH, dL, lUp), aL, lHop);

  // kabel sel surya: anode (atas) → kiri → bulb → katode (bawah)
  const wire: [number, number][] = [
    [270, 398],
    [150, 398],
    [150, 720],
    [270, 720],
  ];
  const wireLen = wire.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - wire[i][0], p[1] - wire[i][1]), 0);
  const along = (u: number): [number, number] => {
    let d = u * wireLen;
    for (let i = 1; i < wire.length; i++) {
      const L = Math.hypot(wire[i][0] - wire[i - 1][0], wire[i][1] - wire[i - 1][1]);
      if (d <= L) return [mix(wire[i - 1][0], wire[i][0], d / L), mix(wire[i - 1][1], wire[i][1], d / L)];
      d -= L;
    }
    return wire[wire.length - 1];
  };

  /* ---------------- fase O: OLED ---------------- */
  const tMeet = wordOf(3, 'bertemu');
  const oPh = ((((t - cue(3)) * 0.42) % 1) + 1) % 1; // siklus rekombinasi
  const inj = ramp(oPh, 0, 0.45, EASE_IN_OUT);
  const drop = ramp(oPh, 0.5, 0.62, EASE_IN_OUT);
  const flash = Math.max(0, 1 - Math.abs(oPh - 0.62) * 7);
  const emitOn = ramp(t, tMeet - 0.3, tMeet + 0.4);
  const gcol = wlColor(530);

  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <PoDefs />
        <Glow x={960} y={540} r={760} color="gold" opacity={0.04 + 0.02 * Math.sin(t)} />

        {/* ======================= FASE 0 ======================= */}
        {p0 > 0.001 ? (
          <g opacity={p0}>
            <Glow x={960} y={500} r={520} color="cyan" opacity={0.14} />
            <g transform={`translate(0 ${6 * Math.sin(t * 1.2)})`}>
              <Polyene x={960} y={500} n={16} bond={70} t={t} cloud={1} />
            </g>
            {/* pita: tingkat-tingkat merapat */}
            {Array.from({length: 8}, (_, k) => {
              const y = 640 + k * 9;
              return <line key={k} x1={760} x2={1160} y1={y} y2={y} stroke={k < 4 ? C.gold : C.mint} strokeWidth={3} opacity={0.15 + 0.5 * semi} />;
            })}
            <Label x={960} y={330} size={34} color={C.amber}>
              molekul terkonjugasi
            </Label>
          </g>
        ) : null}

        {/* ======================= FASE S ======================= */}
        {pS > 0.001 ? (
          <g opacity={pS}>
            {/* matahari */}
            <circle cx={470} cy={250} r={70 + 4 * Math.sin(t * 2)} fill="url(#soft-gold)" opacity={0.9} />
            <circle cx={470} cy={250} r={30} fill="#ffd77a" />
            {[0, 1, 2].map((k) => {
              const ph = (((t * 0.5 + k / 3) % 1) + 1) % 1;
              return <PhotonPacket key={k} x={400 + k * 70} y={290 + ph * 120} wavelength={22} color={wlColor(560 + k * 40)} amp={10} len={70} angle={90} opacity={0.9 * cyc(ph)} phase={-t * 10} />;
            })}
            {/* tumpukan sel surya */}
            <Layer x={270} y={380} w={400} h={36} fill="rgba(140,180,255,0.25)" label="anode transparan" />
            <Layer x={270} y={416} w={400} h={250} fill="rgba(30,36,70,0.9)" label="" lit={0.2 * cur} />
            {Array.from({length: 22}, (_, k) => {
              const x = 290 + rand(k * 3.1) * 360;
              const y = 436 + rand(k * 5.7) * 210;
              const don = k % 2 === 0;
              return <circle key={k} cx={x + 4 * Math.sin(t + k)} cy={y} r={14 + 6 * rand(k)} fill={don ? C.amber : C.violet} opacity={0.45} />;
            })}
            <Layer x={270} y={666} w={400} h={54} fill="#5a6688" label="katode logam" />
            <text x={688} y={510} fontFamily={FONT.sans} fontSize={26} fill={C.amber}>
              pendonor
            </text>
            <text x={688} y={570} fontFamily={FONT.sans} fontSize={26} fill={C.violet}>
              penerima
            </text>
            {/* kabel + lampu */}
            <path d={'M' + wire.map((p) => p.join(',')).join(' L')} fill="none" stroke="#8c96bb" strokeWidth={5} strokeLinejoin="round" />
            <rect x={120} y={510} width={60} height={110} fill="#04060c" />
            <Bulb x={150} y={555} on={cur} t={t} r={30} />
            {Array.from({length: 7}, (_, k) => {
              // elektron mengalir dari katode lewat kabel menuju anode
              const ph = (((t * 0.22 + k / 7) % 1) + 1) % 1;
              const [x, y] = along(1 - ph);
              return <Dot key={k} x={x} y={y} r={6} opacity={cur * cyc(ph)} />;
            })}

            {/* diagram dua molekul */}
            <Level x1={DX - 90} x2={DX + 90} y={dL} color={C.mint} lit={up} />
            <Level x1={DX - 90} x2={DX + 90} y={dH} color={C.gold} lit={phIn} />
            <Level x1={AX - 90} x2={AX + 90} y={aL} color={C.mint} lit={hop} />
            <Level x1={AX - 90} x2={AX + 90} y={aH} color={C.gold} />
            <Label x={DX - 110} y={dL} size={28} anchor="end" color={C.mint} weight={700}>
              LUMO
            </Label>
            <Label x={DX - 110} y={dH} size={28} anchor="end" color={C.gold} weight={700}>
              HOMO
            </Label>
            <Label x={AX + 110} y={aL} size={28} anchor="start" color={C.mint} weight={700}>
              LUMO
            </Label>
            <Label x={AX + 110} y={aH} size={28} anchor="start" color={C.gold} weight={700}>
              HOMO
            </Label>
            <Label x={DX} y={830} size={32} color={C.amber} weight={700}>
              pendonor
            </Label>
            <Label x={AX} y={830} size={32} color={C.violet} weight={700}>
              penerima
            </Label>
            <line x1={DX + 100} y1={dL} x2={AX - 100} y2={dL} stroke={C.muted} strokeWidth={1.5} strokeDasharray="5 6" opacity={0.6 * hop} />
            <Label x={1370} y={dL + 40} size={24} color={C.muted} opacity={ramp(t, tHop + 0.6, tHop + 1.2)}>
              sedikit lebih rendah
            </Label>
            {/* foton masuk */}
            <PhotonPacket x={DX - 40 + 40 * phIn} y={mix(240, dH - 70, phIn)} wavelength={26} color={wlColor(600)} amp={12} len={110} angle={90} opacity={Math.min(ramp(t, tPh - 0.6, tPh - 0.2), 1 - ramp(t, tUp - 0.2, tUp + 0.2))} phase={-t * 12} />
            {/* elektron utama */}
            <TArrow x1={DX} y1={dH - 18} x2={DX} y2={dL + 22} p={up} color={C.cyan} width={3} opacity={0.6 * (1 - hop)} dash="6 6" />
            <Hole x={DX} y={dH - 18} opacity={ramp(t, tUp, tUp + 0.4) * (1 - 0.6 * leave)} />
            <Dot x={ex} y={ey - 18} r={11} opacity={eOp} />
            <TArrow x1={1700} y1={aL - 60} x2={1790} y2={aL - 60} p={cur} color={C.cyan} width={4} />
            <Label x={1745} y={aL - 100} size={24} color={C.cyan} opacity={cur}>
              ke kabel
            </Label>
            {/* siklus berikutnya */}
            <Dot x={lx} y={ly - 18} r={10} opacity={loopOn * cyc(loopPh) * (1 - ramp(loopPh, 0.85, 1))} />
            <Hole x={DX} y={dH - 18} r={9} opacity={loopOn * 0.7 * Math.min(lUp, 1 - ramp(loopPh, 0.8, 1))} />
          </g>
        ) : null}

        {/* ======================= FASE O ======================= */}
        {pO > 0.001 ? (
          <g opacity={pO}>
            {/* tumpukan OLED (cahaya keluar ke atas lewat anode transparan) */}
            <Layer x={260} y={360} w={400} h={34} fill="rgba(200,215,255,0.12)" label="kaca" />
            <Layer x={260} y={394} w={400} h={40} fill="rgba(140,180,255,0.28)" label="anode (+)" />
            <Layer x={260} y={434} w={400} h={70} fill="rgba(255,194,74,0.18)" label="transpor lubang" />
            <Layer x={260} y={504} w={400} h={80} fill="rgba(94,240,176,0.16)" label="lapisan emisi" lit={emitOn * flash} stroke={`${gcol}`} />
            <Layer x={260} y={584} w={400} h={70} fill="rgba(79,214,255,0.16)" label="transpor elektron" />
            <Layer x={260} y={654} w={400} h={50} fill="#5a6688" label="katode (−)" />
            <Battery x={170} y={540} />
            <path d="M260,414 L170,414 L170,510 M170,570 L170,680 L260,680" fill="none" stroke="#8c96bb" strokeWidth={4} />
            {/* pasangan elektron & lubang */}
            {[0, 1, 2].map((k) => {
              const ph = (((t - cue(3)) * 0.42 + k / 3) % 1 + 1) % 1;
              const a = ramp(ph, 0, 0.5, EASE_IN_OUT);
              const x = 330 + k * 130 + 10 * Math.sin(t + k);
              const ey2 = mix(680, 556, a);
              const hy = mix(414, 532, a);
              const f = Math.max(0, 1 - Math.abs(ph - 0.55) * 7);
              const vis = cyc(ph) * (1 - ramp(ph, 0.5, 0.58));
              return (
                <g key={k}>
                  <Dot x={x} y={ey2} r={8} opacity={vis} />
                  <Hole x={x} y={hy} r={9} opacity={vis} />
                  <circle cx={x} cy={544} r={10 + 50 * f} fill={gcol} opacity={0.5 * f * emitOn} />
                  <PhotonPacket x={x} y={mix(500, 270, ramp(ph, 0.55, 0.95))} wavelength={20} color={gcol} amp={10} len={70} angle={-90} opacity={emitOn * cyc(Math.max(0, (ph - 0.55) / 0.45))} phase={t * 10} />
                </g>
              );
            })}

            {/* kanan (baris 3): diagram rekombinasi */}
            <g opacity={pOR}>
              <Level x1={1180} x2={1420} y={420} color={C.mint} lit={1 - drop} />
              <Level x1={1180} x2={1420} y={680} color={C.gold} lit={drop} />
              <Label x={1160} y={420} size={28} anchor="end" color={C.mint} weight={700}>
                LUMO
              </Label>
              <Label x={1160} y={680} size={28} anchor="end" color={C.gold} weight={700}>
                HOMO
              </Label>
              <Label x={1700} y={380} size={26} color={C.cyan}>
                elektron dari katode
              </Label>
              <Label x={960} y={720} size={26} color={C.gold}>
                lubang dari anode
              </Label>
              {(() => {
                const exx = mix(1700, 1300, inj);
                const eyy = mix(402, 662, drop);
                const hx = mix(960, 1300, inj);
                const vis = cyc(oPh) * (1 - ramp(oPh, 0.6, 0.66));
                return (
                  <g>
                    <TArrow x1={1300} y1={432} x2={1300} y2={660} p={drop} color={C.cyan} width={3} opacity={0.5 * (1 - ramp(oPh, 0.7, 0.9))} dash="6 6" />
                    <Dot x={exx} y={eyy} r={11} opacity={vis} />
                    <Hole x={hx} y={662} opacity={vis} />
                    <circle cx={1300} cy={662} r={14 + 70 * flash} fill={gcol} opacity={0.45 * flash} />
                    <PhotonPacket x={mix(1360, 1700, ramp(oPh, 0.62, 1))} y={560} wavelength={26} color={gcol} amp={14} len={130} opacity={emitOn * cyc(Math.max(0, (oPh - 0.62) / 0.38))} phase={-t * 12} />
                  </g>
                );
              })()}
              <Label x={1300} y={550} size={30} color={C.ink} opacity={emitOn}>
                ΔE
              </Label>
              <Label x={1640} y={620} size={28} color={gcol} opacity={emitOn}>
                cahaya
              </Label>
            </g>

            {/* kanan (baris 4): piksel merah, hijau, biru */}
            <g opacity={pPix}>
              {PIX.map((px, k) => {
                const cx = 1060 + k * 300;
                const col = wlColor(px.nm);
                const ap = ramp(t, cue(4) + k * 0.25, cue(4) + 0.6 + k * 0.25, BACK);
                const lumo = 470 - px.gap / 2;
                const homo = 470 + px.gap / 2;
                const ph = (((t * 0.5 + k * 0.3) % 1) + 1) % 1;
                return (
                  <g key={k} opacity={ap}>
                    <Level x1={cx - 70} x2={cx + 70} y={lumo} color={C.mint} />
                    <Level x1={cx - 70} x2={cx + 70} y={homo} color={C.gold} />
                    <TArrow x1={cx - 40} y1={lumo + 6} x2={cx - 40} y2={homo - 4} color={col} width={4} />
                    <PhotonPacket x={cx + 40 + 30 * ph} y={470} wavelength={px.nm / 26} color={col} amp={10} len={70} angle={0} opacity={0.9 * cyc(ph)} phase={-t * 12} />
                    <rect x={cx - 52} y={590} width={104} height={104} rx={12} fill={col} opacity={0.75 + 0.15 * Math.sin(t * 2 + k)} />
                    <rect x={cx - 70} y={572} width={140} height={140} rx={18} fill={col} opacity={0.15} />
                    <Polyene x={cx} y={772} n={px.n} bond={26} t={t} cloud={0.7} />
                    <Label x={cx} y={835} size={24} color={C.muted}>
                      {px.conj}
                    </Label>
                  </g>
                );
              })}
              <Label x={1360} y={318} size={30} color={C.ink} opacity={ramp(t, wordOf(4, 'celah') - 0.2, wordOf(4, 'celah') + 0.5)}>
                celah HOMO–LUMO
              </Label>
            </g>
          </g>
        ) : null}
      </Stage>

      {p0 > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 960,
            top: 790,
            transform: `translate(-50%,-50%) scale(${0.9 + 0.1 * semi})`,
            opacity: p0 * semi,
            padding: '12px 30px',
            borderRadius: 999,
            border: `2px solid ${C.mint}`,
            background: `${C.mint}18`,
            color: C.mint,
            fontFamily: FONT.sans,
            fontWeight: 700,
            fontSize: 36,
            whiteSpace: 'nowrap',
          }}
        >
          semikonduktor organik
        </div>
      ) : null}
      {pS > 0.001 ? (
        <div style={{position: 'absolute', left: 1370, top: 250, transform: 'translate(-50%,-50%)', opacity: pS * ramp(t, cue(1) + 0.2, cue(1) + 0.8), fontFamily: FONT.sans, fontSize: 36, fontWeight: 700, color: C.gold, whiteSpace: 'nowrap'}}>
          sel surya organik
        </div>
      ) : null}
      {pO > 0.001 ? (
        <div style={{position: 'absolute', left: 1370, top: 250, transform: 'translate(-50%,-50%)', opacity: pO * ramp(t, cue(3) + 0.2, cue(3) + 0.8), fontFamily: FONT.sans, fontSize: 36, fontWeight: 700, color: gcol, whiteSpace: 'nowrap'}}>
          OLED · prosesnya terbalik
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
