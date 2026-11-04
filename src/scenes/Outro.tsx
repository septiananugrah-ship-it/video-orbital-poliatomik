import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, cyc, rand, ramp} from '../anim';
import {Glow, Stage} from '../components/primitives';
import {HexIcon, POrb, Spin} from '../components/vbD';
import {Render3D, VbDefs, methane} from '../components/vbC';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

const REFS = [
  'RPS Kimia Kuantum S1 Kimia UNESA — pertemuan 11: orbital molekul poliatomik',
  'P. Atkins & J. de Paula, Physical Chemistry — orbital molekul poliatomik, metode Hückel',
  'C. E. Housecroft & A. G. Sharpe, Inorganic Chemistry — orbital kelompok (SALC), BeH₂, CH₄, H₂O, donasi balik',
  'E. Hückel, Z. Phys. 70, 204 (1931) — metode Hückel',
  'A. A. Frost & B. Musulin, J. Chem. Phys. 21, 572 (1953) — lingkaran Frost',
  'Spektrum fotoelektron CH₄ ≈ 14 & 23 eV; H₂O ≈ 12,6 / 14,7 / 18,5 / 32,2 eV',
  'M. J. S. Dewar (1951); J. Chatt & L. A. Duncanson (1953) — donasi & donasi balik',
  'CO bebas ν ≈ 2143 cm⁻¹ · β-karoten λmaks ≈ 450 nm (heksana)',
  'Energi delokalisasi benzena 2β ≈ 150 kJ/mol (β ≈ −75 kJ/mol, nilai empiris)',
];

export const Outro: React.FC = () => {
  const {t, dur} = useScene();
  const a = ramp(t, 0, 1.6);
  const waves = ramp(t, 0, 4, EASE_IN_OUT);
  const refs = ramp(t, 2.4, 3.4);
  const out = 1 - ramp(t, dur - 1.6, dur - 0.1, EASE_IN_OUT);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <Stage>
        <Glow x={960} y={300} r={500} color="violet" opacity={0.15} />
        <VbDefs />
        {/* hiasan poliatomik: lingkaran Frost benzena, butadiena dengan simpul, CH₄ berputar */}
        <g opacity={waves}>
          {/* kiri: lingkaran Frost benzena (6 e⁻ di 3 MO ikatan) */}
          {(() => {
            const x = 200;
            const y = 255;
            const R = 80;
            const ys = [1, 0.5, 0.5, -0.5, -0.5, -1].map((v) => y + R * v);
            const xs = [0, -0.866, 0.866, -0.866, 0.866, 0].map((v) => x + R * v);
            return (
              <g>
                <circle cx={x} cy={y} r={R} fill="none" stroke={C.muted} strokeWidth={2.5} opacity={0.6} />
                <polygon points={[0, 2, 4, 5, 3, 1].map((k) => `${xs[k]},${ys[k]}`).join(' ')} fill="none" stroke={C.mint} strokeWidth={3} opacity={0.55} />
                <line x1={x - R - 30} y1={y} x2={x + R + 30} y2={y} stroke={C.muted} strokeWidth={1.5} strokeDasharray="5 6" opacity={0.5} />
                {xs.map((px, k) => (
                  <g key={k}>
                    <line x1={px - 20} y1={ys[k]} x2={px + 20} y2={ys[k]} stroke={k < 3 ? C.cyan : C.red} strokeWidth={14} strokeOpacity={0.12 + 0.08 * Math.sin(t * 2 + k)} strokeLinecap="round" />
                    <line x1={px - 20} y1={ys[k]} x2={px + 20} y2={ys[k]} stroke={k < 3 ? C.cyan : C.red} strokeWidth={5} strokeLinecap="round" />
                    {k < 3 ? (
                      <>
                        <Spin x={px - 7} y={ys[k] - 16 + 2 * Math.sin(t * 2.4 + k)} up len={24} width={3} />
                        <Spin x={px + 7} y={ys[k] - 16 - 2 * Math.sin(t * 2.4 + k)} up={false} len={24} width={3} />
                      </>
                    ) : null}
                  </g>
                ))}
                <text x={x} y={y + R + 42} textAnchor="middle" fontFamily={FONT.sans} fontSize={24} fill={C.mint}>
                  4n + 2
                </text>
              </g>
            );
          })()}
          {/* atas tengah: butadiena ψ₂ (satu simpul) */}
          {(() => {
            const ph = [1, 1, -1, -1];
            const bob = 3 * Math.sin(t * 1.4);
            return (
              <g transform={`translate(0 ${bob})`}>
                <line x1={960 - 105} y1={86} x2={960 + 105} y2={86} stroke="#c9d3f2" strokeWidth={4} opacity={0.6} />
                {ph.map((s, k) => (
                  <POrb key={k} x={960 - 105 + k * 70} y={86} L={34 * (k === 0 || k === 3 ? 0.8 : 1)} w={13} ang={s > 0 ? 0 : 180} glow={0.5 + 0.5 * Math.sin(t * 2)} />
                ))}
                <line x1={960} y1={40} x2={960} y2={132} stroke={C.red} strokeWidth={2.5} strokeDasharray="5 5" opacity={0.6 + 0.3 * Math.sin(t * 2)} />
              </g>
            );
          })()}
          {/* kanan: CH₄ berputar */}
          <Render3D items={methane({cx: 1720, cy: 270, s: 78, yaw: t * 0.5, pitch: -0.3 + 0.1 * Math.sin(t * 0.4), persp: 8})} />
          {Array.from({length: 12}, (_, k) => {
            const ph = ((t * (0.035 + 0.02 * rand(k)) + rand(k * 3.1)) % 1 + 1) % 1;
            const x = 140 + ph * 1640 + 40 * rand(k * 5.1);
            const y = 940 + 70 * rand(k * 7.3) + 12 * Math.sin(t * 0.7 + k);
            const op = 0.3 * cyc(ph);
            const kind = k % 3;
            const rot = t * 20 * (rand(k * 2.2) - 0.5);
            return (
              <g key={k} opacity={op} transform={`rotate(${rot} ${x} ${y})`}>
                {kind === 0 ? (
                  <HexIcon x={x} y={y} r={26} mode="ring" width={3} />
                ) : kind === 1 ? (
                  <g>
                    {[0, 1, 2, 3].map((j) => (
                      <POrb key={j} x={x - 36 + j * 24} y={y} L={16} w={7} ang={j < 2 ? 0 : 180} />
                    ))}
                  </g>
                ) : (
                  <g>
                    {[0, 1, 2].map((j) => {
                      const a = (j * 2 * Math.PI) / 3 + Math.PI / 2;
                      return <line key={j} x1={x} y1={y} x2={x + 26 * Math.cos(a)} y2={y + 26 * Math.sin(a)} stroke="#c9d3f2" strokeWidth={4} />;
                    })}
                    <line x1={x} y1={y} x2={x} y2={y - 28} stroke="#c9d3f2" strokeWidth={4} />
                    <circle cx={x} cy={y} r={9} fill="#59627a" />
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </Stage>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 150}}>
        <div style={{fontFamily: FONT.sans, fontSize: 30, letterSpacing: 18, color: C.ink, fontWeight: 300, opacity: a}}>KIMIA KUANTUM · ORBITAL POLIATOMIK</div>
        <div style={{fontFamily: FONT.sans, fontSize: 100, fontWeight: 800, color: C.gold, lineHeight: 1.05, opacity: a, textShadow: '0 0 50px rgba(255,194,74,0.4)'}}>ORBITAL MILIK BERSAMA</div>
        <div style={{marginTop: 22, fontFamily: FONT.sans, fontSize: 34, color: C.ink, opacity: ramp(t, 1.2, 2.2)}}>Terima kasih telah menonton</div>
        <div style={{marginTop: 46, textAlign: 'center', opacity: refs}}>
          <div style={{fontFamily: FONT.mono, fontSize: 20, letterSpacing: 4, color: C.muted, marginBottom: 14}}>RUJUKAN</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 56, rowGap: 6, width: 1720, textAlign: 'left'}}>
            {REFS.map((r, i) => (
              <div key={r} style={{fontFamily: FONT.sans, fontSize: 22, color: C.muted, lineHeight: 1.4, opacity: ramp(t, 2.4 + i * 0.08, 3.2 + i * 0.08)}}>
                {r}
              </div>
            ))}
          </div>
          <div style={{marginTop: 20, fontFamily: FONT.sans, fontSize: 22, color: C.muted, opacity: 0.8}}>
            Angka dari buku teks & NIST · diagram MO kualitatif; Hückel dalam satuan α, β · nilai ukur ditandai “≈” · ilustrasi orbital skematis
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
