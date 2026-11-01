import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EASE_IN_OUT, mix, rand, ramp} from '../anim';
import {Glow, Stage} from '../components/primitives';
import {VbDefs} from '../components/vbA';
import {SpinUD} from '../components/grupA';
import {MoADefs} from '../components/moA';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

const Letters: React.FC<{text: string; t: number; start: number; step: number; style: React.CSSProperties}> = ({text, t, start, step, style}) => (
  <div style={{display: 'flex', justifyContent: 'center', ...style}}>
    {text.split('').map((ch, i) => {
      const p = ramp(t, start + i * step, start + i * step + 0.9);
      return (
        <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', opacity: p, translate: `0px ${(1 - p) * 40}px`, scale: String(0.92 + 0.08 * p)}}>
          {ch}
        </span>
      );
    })}
  </div>
);

// Rumus & simbol ikatan yang melayang samar di latar.
const sub = (s: number, v: string, col?: string) => (
  <tspan fontSize={s * 0.6} baselineShift="sub" fill={col}>
    {v}
  </tspan>
);
const FLOATS: ((s: number) => React.ReactNode)[] = [
  () => <tspan fill={C.gold}>α</tspan>,
  () => <tspan fill={C.cyan}>β</tspan>,
  () => (
    <>
      <tspan fill={C.cyan}>α + 2β</tspan>
    </>
  ),
  (s) => (
    <>
      <tspan fill={C.ink}>CH</tspan>
      {sub(s, '4')}
    </>
  ),
  (s) => (
    <>
      <tspan fill={C.ink}>BeH</tspan>
      {sub(s, '2')}
    </>
  ),
  () => <tspan fill={C.amber}>π</tspan>,
  (s) => (
    <>
      <tspan fill={C.violet}>ψ = Σ c</tspan>
      {sub(s, 'i', C.violet)}
      <tspan fill={C.violet}>φ</tspan>
      {sub(s, 'i', C.violet)}
    </>
  ),
  () => <tspan fill={C.gold}>4n + 2</tspan>,
  (s) => (
    <>
      <tspan fill={C.ink}>H</tspan>
      {sub(s, '2')}
      <tspan fill={C.ink}>O</tspan>
    </>
  ),
  (s) => (
    <>
      <tspan fill={C.cyan}>t</tspan>
      {sub(s, '2', C.cyan)}
    </>
  ),
  () => <tspan fill={C.red}>α − β</tspan>,
  () => <tspan fill={C.mint}>LUMO</tspan>,
];

// Lingkaran Frost samar (benzena): heksagon di dalam lingkaran, tingkat energi di setiap sudut.
const FrostGhost: React.FC<{x: number; y: number; r: number; t: number; p: number}> = ({x, y, r, t, p}) => {
  const vs = Array.from({length: 6}, (_, k) => {
    const a = Math.PI / 2 + (k * Math.PI) / 3; // sudut terbawah = α + 2β
    return [x + r * Math.cos(a), y + r * Math.sin(a)] as [number, number];
  });
  return (
    <g opacity={p}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={C.muted} strokeWidth={2} strokeDasharray="6 8" strokeDashoffset={-t * 10} />
      <path d={`M${vs.map((v) => v.join(',')).join(' L')} Z`} fill="none" stroke={C.ink} strokeOpacity={0.5} strokeWidth={3} />
      {vs.map(([vx, vy], k) => {
        const bond = vy > y + 1;
        const col = bond ? C.cyan : C.red;
        return (
          <g key={k}>
            <line x1={vx - 40} y1={vy} x2={vx + 40} y2={vy} stroke={col} strokeWidth={5} strokeLinecap="round" />
            {bond ? [-1, 1].map((s) => <SpinUD key={s} x={vx + s * 11} y={vy - 2 + 3 * Math.sin(t * 2.2 + k + s)} up={s < 0} len={34} width={3.5} />) : null}
          </g>
        );
      })}
      <line x1={x - r - 40} y1={y} x2={x + r + 40} y2={y} stroke={C.muted} strokeWidth={2} strokeDasharray="4 8" />
      <text x={x - r - 52} y={y} textAnchor="end" dominantBaseline="central" fontFamily={FONT.serif} fontStyle="italic" fontSize={34} fill={C.gold}>
        α
      </text>
    </g>
  );
};

// Diagram MO metana samar: C (2s, 2p) kiri, kelompok 4 H kanan, a₁/t₂ ikatan & antiikatan di tengah.
const MethaneGhost: React.FC<{x: number; y: number; t: number; p: number}> = ({x, y, t, p}) => {
  const L = [
    {y: -190, n: 1, col: C.red},
    {y: -120, n: 3, col: C.red},
    {y: 110, n: 3, col: C.cyan},
    {y: 190, n: 1, col: C.cyan},
  ];
  const lw = 44;
  return (
    <g opacity={p}>
      {[
        [x - 190, y - 10, 1],
        [x - 190, y - 70, 3],
        [x + 190, y + 20, 4],
      ].map(([ax, ay, n], k) => (
        <g key={k}>
          {Array.from({length: n}, (_, j) => (
            <line key={j} x1={ax - (n * 34) / 2 + j * 34 + 4} y1={ay} x2={ax - (n * 34) / 2 + j * 34 + 30} y2={ay} stroke={C.blue} strokeWidth={4} strokeLinecap="round" />
          ))}
          {L.map((l, i) => (
            <line
              key={i}
              x1={ax + (k < 2 ? 1 : -1) * ((n * 34) / 2)}
              y1={ay}
              x2={x + (k < 2 ? -1 : 1) * ((l.n * (lw + 10)) / 2)}
              y2={y + l.y}
              stroke={C.muted}
              strokeWidth={1.6}
              strokeDasharray="6 8"
              strokeDashoffset={-t * 10}
              opacity={(k === 0 && l.n === 3) || (k === 1 && l.n === 1) ? 0 : 0.6}
            />
          ))}
        </g>
      ))}
      {L.map((l, i) => (
        <g key={i}>
          {Array.from({length: l.n}, (_, j) => {
            const cx = x - ((l.n - 1) * (lw + 10)) / 2 + j * (lw + 10);
            return (
              <g key={j}>
                <line x1={cx - lw / 2} y1={y + l.y} x2={cx + lw / 2} y2={y + l.y} stroke={l.col} strokeWidth={5} strokeLinecap="round" />
                {l.col === C.cyan
                  ? [-1, 1].map((s) => <SpinUD key={s} x={cx + s * 9} y={y + l.y - 2 + 2.5 * Math.sin(t * 2.4 + i + j + s)} up={s < 0} len={30} width={3} />)
                  : null}
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
};

// Awan π benzena: cincin titik yang beredar di atas heksagon.
const PiRing: React.FC<{x: number; y: number; r: number; t: number; p: number}> = ({x, y, r, t, p}) => (
  <g opacity={p}>
    <ellipse cx={x} cy={y} rx={r * 1.35} ry={r * 1.05} fill="url(#soft-cyan)" opacity={0.18} />
    {Array.from({length: 90}, (_, i) => {
      const a = rand(i * 2.7) * Math.PI * 2 + t * (0.25 + 0.15 * rand(i));
      const rr = r * (0.8 + 0.45 * rand(i * 4.1)) * (1 + 0.03 * Math.sin(t * 1.5));
      return <circle key={i} cx={x + rr * Math.cos(a)} cy={y + rr * 0.78 * Math.sin(a)} r={1.6 + 2 * rand(i * 6.3)} fill={C.cyan} opacity={0.25 + 0.25 * Math.sin(t * 2 + i)} />;
    })}
    {Array.from({length: 6}, (_, k) => {
      const a = Math.PI / 6 + (k * Math.PI) / 3 + t * 0.05;
      const b = a + Math.PI / 3;
      return (
        <line key={k} x1={x + r * 0.62 * Math.cos(a)} y1={y + r * 0.62 * 0.78 * Math.sin(a)} x2={x + r * 0.62 * Math.cos(b)} y2={y + r * 0.62 * 0.78 * Math.sin(b)} stroke={C.ink} strokeOpacity={0.35} strokeWidth={4} />
      );
    })}
  </g>
);

export const Title: React.FC = () => {
  const {t} = useScene();
  const bg = ramp(t, 0.1, 2.0, EASE_IN_OUT);
  const sub = ramp(t, 2.6, 3.6);
  const line = ramp(t, 1.8, 3.2, EASE_IN_OUT);
  const meet = ramp(t, 0.2, 4.0, EASE_IN_OUT);
  const flashP = ramp(t, 3.6, 5.2);
  return (
    <AbsoluteFill>
      <Stage>
        <VbDefs />
        <Glow x={960} y={470} r={640} color="gold" opacity={0.12 * bg} />
        <MoADefs />
        <FrostGhost x={330} y={500} r={170} t={t} p={0.3 * bg * (0.85 + 0.15 * Math.sin(t * 0.9))} />
        <MethaneGhost x={1590} y={500} t={t} p={0.28 * bg} />
        {/* awan π yang beredar di belakang judul */}
        <PiRing x={960} y={470} r={mix(150, 250, meet)} t={t} p={0.9 * ramp(t, 0.6, 4.6, EASE_IN_OUT)} />
        <circle cx={960} cy={470} r={420 * flashP + 80} fill="url(#vbA-flash)" opacity={0.35 * Math.max(0, 1 - Math.abs(t - 4.0) / 1.2) * bg} />
        {FLOATS.map((f, i) => {
          const x = 140 + ((rand(i * 3.3) * 1640 + t * (14 + rand(i) * 18)) % 1640);
          const y = 150 + rand(i * 5.1 + 2) * 680;
          const edge = Math.min(1, (x - 140) / 120, (1780 - x) / 120);
          const s = 40 + rand(i * 7.7) * 26;
          return (
            <text key={i} x={x} y={y} fontFamily={FONT.serif} fontSize={s} fill={C.ink} opacity={0.16 * bg * Math.max(0, edge)} textAnchor="middle">
              {f(s)}
            </text>
          );
        })}
      </Stage>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingBottom: 120}}>
        <Letters
          text="ORBITAL MILIK BERSAMA"
          t={t}
          start={0.6}
          step={0.05}
          style={{fontFamily: FONT.sans, fontWeight: 800, fontSize: 120, letterSpacing: 4, lineHeight: 1.08, color: C.gold, textShadow: '0 0 60px rgba(255,194,74,0.45)'}}
        />
        <div style={{width: 700 * line, height: 2, margin: '30px 0 24px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`}} />
        <div style={{fontFamily: FONT.sans, fontSize: 36, color: C.muted, letterSpacing: 1, opacity: sub, translate: `0px ${(1 - sub) * 16}px`}}>
          Kimia Kuantum · Orbital Molekul Poliatomik &amp; Hückel
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
