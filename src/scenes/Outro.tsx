import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, cyc, rand, ramp} from '../anim';
import {Glow, Stage} from '../components/primitives';
import {MOStack, O2_MO} from '../components/moD';
import {POrb, RichLabel, Spin} from '../components/vbD';
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
        {/* hiasan: diagram MO O₂ mini (π* ↑↑), awan orbital melayang */}
        <g opacity={waves}>
          {/* kiri: diagram MO O₂ */}
          <RichLabel x={185} y={112} parts={[['O'], ['2', 'sub']]} size={26} color={C.red} weight={700} />
          <MOStack
            x={170}
            y={392}
            levels={O2_MO}
            scale={0.6}
            w={74}
            t={t}
            size={18}
            lit={(i) => (O2_MO[i].kind === 'piStar' ? 0.6 + 0.4 * Math.sin(t * 2.4) : 0)}
          />
          {/* tengah atas: dua elektron π* sejajar */}
          {[-1, 1].map((s) => (
            <g key={s}>
              <line x1={960 + s * 34 - 22} y1={104} x2={960 + s * 34 + 22} y2={104} stroke={C.pink} strokeWidth={5} strokeLinecap="round" />
              <line x1={960 + s * 34 - 22} y1={104} x2={960 + s * 34 + 22} y2={104} stroke={C.pink} strokeWidth={16} strokeOpacity={0.12 + 0.1 * Math.sin(t * 2)} strokeLinecap="round" />
              <Spin x={960 + s * 34} y={82 + 3 * Math.sin(t * 2 + s)} up len={34} width={4} />
            </g>
          ))}
          {/* kanan: awan σ ikatan + orbital π* */}
          {(() => {
            const pulse = 0.5 + 0.5 * Math.sin(t * 1.6);
            const bob = 6 * Math.sin(t * 0.9);
            return (
              <g>
                <ellipse cx={1740} cy={190 + bob} rx={74} ry={34} fill={C.cyan} opacity={0.14 + 0.08 * pulse} />
                <ellipse cx={1740} cy={190 + bob} rx={44} ry={22} fill={C.cyan} opacity={0.28 + 0.12 * pulse} />
                <circle cx={1716} cy={190 + bob} r={5} fill="#fff" />
                <circle cx={1764} cy={190 + bob} r={5} fill="#fff" />
                <g transform={`rotate(${8 * Math.sin(t * 0.7)} 1740 ${330 - bob})`}>
                  <POrb x={1714} y={330 - bob} L={44} w={15} />
                  <POrb x={1766} y={330 - bob} L={44} w={15} ang={180} />
                  <line x1={1740} y1={330 - bob - 56} x2={1740} y2={330 - bob + 56} stroke={C.red} strokeWidth={2} strokeDasharray="5 5" opacity={0.7} />
                </g>
              </g>
            );
          })()}
          {Array.from({length: 14}, (_, k) => {
            const ph = ((t * (0.035 + 0.02 * rand(k)) + rand(k * 3.1)) % 1 + 1) % 1;
            const x = 140 + ph * 1640 + 40 * rand(k * 5.1);
            const y = 900 + 110 * rand(k * 7.3) + 12 * Math.sin(t * 0.7 + k);
            const op = 0.3 * cyc(ph);
            const kind = k % 3;
            const rot = t * 20 * (rand(k * 2.2) - 0.5);
            return (
              <g key={k} opacity={op} transform={`rotate(${rot} ${x} ${y})`}>
                {kind === 0 ? (
                  <POrb x={x} y={y} L={30} w={11} ang={rand(k) * 60 - 30} />
                ) : kind === 1 ? (
                  <g>
                    <ellipse cx={x} cy={y} rx={40} ry={18} fill={C.cyan} opacity={0.5} />
                    <circle cx={x - 14} cy={y} r={4} fill="#fff" />
                    <circle cx={x + 14} cy={y} r={4} fill="#fff" />
                  </g>
                ) : (
                  <g>
                    <line x1={x - 26} y1={y} x2={x + 26} y2={y} stroke={C.red} strokeWidth={4} strokeLinecap="round" />
                    <line x1={x - 26} y1={y + 34} x2={x + 26} y2={y + 34} stroke={C.cyan} strokeWidth={4} strokeLinecap="round" />
                    <Spin x={x - 7} y={y + 20} up len={24} width={3} />
                    <Spin x={x + 7} y={y + 20} up={false} len={24} width={3} />
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
