import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Glow, Stage} from './components/primitives';
import {C, FONT, H, W} from './theme';

/** Gambar sampul video (2560×1440 lewat skala 4/3, lihat Root.tsx). */
const Cover: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 70% at 70% 45%, #4a2f0a 0%, ${C.bg2} 45%, ${C.bg} 100%)`}}>
    <Stage>
      <Glow x={1420} y={460} r={560} color="gold" opacity={0.22} />
      <circle cx={1420} cy={400} r={170} fill="none" stroke={C.muted} strokeWidth={3} strokeDasharray="8 10" />
      <polygon points="1420.0,230.0 1272.8,315.0 1272.8,485.0 1420.0,570.0 1567.2,485.0 1567.2,315.0" fill="none" stroke={C.gold} strokeWidth={8} strokeLinejoin="round" />
      <circle cx={1420} cy={400} r={100} fill="none" stroke={C.amber} strokeWidth={6} opacity={0.9} />
      {[[230, 1], [315, 2], [485, 2], [570, 1]].map(([y, n], i) =>
        Array.from({length: n}, (_, j) => {
          const cx = 1720 + (n === 2 ? (j ? 40 : -40) : 0);
          return <line key={`${y}-${j}`} x1={cx - 32} y1={y} x2={cx + 32} y2={y} stroke={i < 2 ? C.red : C.cyan} strokeWidth={6} strokeLinecap="round" />;
        }),
      )}
      <text x={1420} y={680} textAnchor="middle" fontFamily={FONT.mono} fontSize={30} fill={C.muted}>
        benzena · lingkaran Frost · α + 2β
      </text>
    </Stage>
    <div style={{position: 'absolute', left: 110, top: 220, width: 900}}>
      <div style={{fontFamily: FONT.mono, fontSize: 30, letterSpacing: 8, color: C.gold}}>KIMIA KUANTUM · ORBITAL POLIATOMIK</div>
      <div style={{fontFamily: FONT.sans, fontSize: 70, fontWeight: 800, color: C.ink, lineHeight: 1.05, marginTop: 10}}>Orbital Poliatomik &amp; Hückel</div>
      <div style={{fontFamily: FONT.sans, fontSize: 140, fontWeight: 800, color: C.gold, lineHeight: 1, marginTop: 24, textShadow: '0 0 50px rgba(255,194,74,0.45)'}}>
        Orbital
        <br />
        Milik Bersama
      </div>
      <div style={{display: 'flex', gap: 14, marginTop: 44}}>
        {[
          ['Hückel', C.cyan],
          ['benzena', C.violet],
          ['katalis', C.amber],
        ].map(([t, col]) => (
          <div key={t} style={{padding: '10px 22px', borderRadius: 999, border: `2px solid ${col}`, color: col, fontFamily: FONT.sans, fontWeight: 600, fontSize: 30}}>
            {t}
          </div>
        ))}
      </div>
    </div>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 60%, rgba(0,0,0,0.6) 100%)'}} />
  </AbsoluteFill>
);

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.bg}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${2560 / W})`, transformOrigin: '0 0'}}>
      <Cover />
    </div>
  </AbsoluteFill>
);
