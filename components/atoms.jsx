// Reusable atoms

// Escudo artwork — abstract shield shape with country color
function EscudoArt({ countryColor = '#1E3A5F', state = 'have' }) {
  const c = state === 'missing' ? SK.textDim : countryColor;
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" style={{ display: 'block' }}>
      <path d="M32 6 L56 16 L56 34 Q56 52 32 60 Q8 52 8 34 L8 16 Z" fill={c} opacity={state === 'missing' ? 0.15 : 0.25}/>
      <path d="M32 6 L56 16 L56 34 Q56 52 32 60 Q8 52 8 34 L8 16 Z" fill="none" stroke={c} strokeWidth="2.5" opacity={state === 'missing' ? 0.3 : 0.9}/>
      {state !== 'missing' && <>
        <line x1="32" y1="10" x2="32" y2="58" stroke={c} strokeWidth="1.5" opacity="0.4"/>
        <line x1="10" y1="26" x2="54" y2="26" stroke={c} strokeWidth="1.5" opacity="0.4"/>
      </>}
      {state === 'missing' && <text x="32" y="37" textAnchor="middle" fontSize="18" fill={SK.textDim}>?</text>}
    </svg>
  );
}

// Equipo artwork — abstract team group silhouette
function EquipoArt({ countryColor = '#1E3A5F', state = 'have', variant = 0 }) {
  const c = state === 'missing' ? SK.textDim : countryColor;
  const positions = variant === 0
    ? [[12,38],[20,30],[28,26],[36,26],[44,30],[52,38],[16,50],[32,44],[48,50],[24,50],[40,50]]
    : [[10,42],[18,32],[26,24],[32,20],[38,24],[46,32],[54,42],[14,52],[32,52],[50,52],[32,36]];
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" style={{ display: 'block' }}>
      <rect x="0" y="54" width="64" height="10" fill={c} opacity="0.12"/>
      {state === 'missing'
        ? <text x="32" y="37" textAnchor="middle" fontSize="18" fill={SK.textDim}>?</text>
        : positions.map(([x, y], i) => (
          <g key={i} fill={c} opacity={0.7 + (i % 3) * 0.1}>
            <ellipse cx={x} cy={y - 7} rx="3.5" ry="4"/>
            <rect x={x - 4} y={y - 3} width="8" height="9" rx="2"/>
          </g>
        ))
      }
    </svg>
  );
}

// Especial artwork — trophy / stadium / event icons
function EspecialArt({ subtype = 'trophy', state = 'have' }) {
  const c = state === 'missing' ? SK.textDim : SK.gold;
  if (state === 'missing') return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" style={{ display: 'block' }}>
      <text x="32" y="37" textAnchor="middle" fontSize="18" fill={SK.textDim}>?</text>
    </svg>
  );
  if (subtype === 'trophy') return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" style={{ display: 'block' }}>
      <path d="M20 10 H44 V30 Q44 46 32 50 Q20 46 20 30 Z" fill={c} opacity="0.25"/>
      <path d="M20 10 H44 V30 Q44 46 32 50 Q20 46 20 30 Z" fill="none" stroke={c} strokeWidth="2.5"/>
      <path d="M20 14 Q12 14 12 22 Q12 30 20 30" fill="none" stroke={c} strokeWidth="2"/>
      <path d="M44 14 Q52 14 52 22 Q52 30 44 30" fill="none" stroke={c} strokeWidth="2"/>
      <line x1="32" y1="50" x2="32" y2="56" stroke={c} strokeWidth="2.5"/>
      <rect x="22" y="56" width="20" height="4" rx="2" fill={c} opacity="0.8"/>
    </svg>
  );
  if (subtype === 'stadium') return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" style={{ display: 'block' }}>
      <ellipse cx="32" cy="40" rx="28" ry="12" fill={c} opacity="0.12" stroke={c} strokeWidth="2"/>
      <ellipse cx="32" cy="40" rx="18" ry="7" fill="none" stroke={c} strokeWidth="1.5" opacity="0.6"/>
      <rect x="6" y="24" width="52" height="16" rx="2" fill={c} opacity="0.08" stroke={c} strokeWidth="1.5"/>
      <rect x="14" y="28" width="6" height="8" rx="1" fill={c} opacity="0.5"/>
      <rect x="24" y="28" width="6" height="8" rx="1" fill={c} opacity="0.5"/>
      <rect x="34" y="28" width="6" height="8" rx="1" fill={c} opacity="0.5"/>
      <rect x="44" y="28" width="6" height="8" rx="1" fill={c} opacity="0.5"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" style={{ display: 'block' }}>
      <polygon points="32,10 38,26 56,26 42,36 48,54 32,44 16,54 22,36 8,26 26,26" fill={c} opacity="0.8"/>
    </svg>
  );
}

// Abstract sticker artwork — geometric silhouette, NOT a real player
function StickerArt({ seed = 0, countryColor = '#1E3A5F', state = 'have' }) {
  // Pseudo-random pose based on seed
  const poses = [
    // Running
    <g key="run"><ellipse cx="32" cy="20" rx="7" ry="8"/><rect x="26" y="28" width="12" height="18" rx="3"/><path d="M28 46 L24 62" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/><path d="M36 46 L40 62" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/><path d="M26 32 L18 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/><path d="M38 32 L46 28" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></g>,
    // Kicking
    <g key="kick"><ellipse cx="30" cy="18" rx="7" ry="8"/><rect x="24" y="26" width="12" height="20" rx="3"/><path d="M26 46 L20 62" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/><path d="M36 46 L48 54" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/><circle cx="50" cy="56" r="4" fill={SK.text} opacity="0.8"/><path d="M24 30 L14 36" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/><path d="M36 30 L44 24" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></g>,
    // Standing arms crossed
    <g key="stand"><ellipse cx="32" cy="20" rx="7" ry="8"/><rect x="26" y="28" width="12" height="20" rx="3"/><path d="M28 48 L26 62" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/><path d="M36 48 L38 62" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/><path d="M27 34 L38 40 L37 44" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/><path d="M37 34 L26 40 L27 44" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/></g>,
    // Goalkeeper dive
    <g key="dive"><ellipse cx="24" cy="22" rx="7" ry="8"/><rect x="22" y="30" width="20" height="10" rx="3" transform="rotate(15 32 35)"/><path d="M40 40 L52 44" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/><path d="M36 44 L42 58" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/><path d="M20 30 L10 22" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/><path d="M28 34 L34 28" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></g>,
    // Header
    <g key="head"><ellipse cx="32" cy="14" rx="7" ry="8"/><circle cx="32" cy="6" r="3" fill={SK.text} opacity="0.8"/><rect x="26" y="22" width="12" height="20" rx="3"/><path d="M28 42 L24 60" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/><path d="M36 42 L40 60" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/><path d="M26 26 L16 22" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/><path d="M38 26 L48 22" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></g>,
  ];
  const pose = poses[seed % poses.length];
  const silColor = state === 'missing' ? SK.textDim : countryColor;
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" style={{ display: 'block' }}>
      {/* Field band */}
      <rect x="0" y="48" width="64" height="16" fill={state === 'missing' ? '#0A1628' : countryColor} opacity={state === 'missing' ? 0.2 : 0.18}/>
      <line x1="0" y1="48" x2="64" y2="48" stroke={silColor} strokeWidth="0.5" opacity="0.4"/>
      <g style={{ color: silColor }} fill={silColor}>{pose}</g>
    </svg>
  );
}

// Sticker card — the central visual element
function StickerCard({ num, country, player, state, count = 1, size = 'md', type = 'jugador', subtype, onClick }) {
  const sizes = {
    sm: { p: 6, fNum: 9, fName: 8, fCountry: 7 },
    md: { p: 8, fNum: 11, fName: 10, fCountry: 8 },
    lg: { p: 10, fNum: 13, fName: 12, fCountry: 10 },
  };
  const s = sizes[size];

  const typeColors = {
    escudo:   SK.gold,
    equipo:   '#6EE7F9',
    especial: SK.gold,
    jugador:  SK.gold,
  };
  const accentColor = state === 'missing' ? SK.border : typeColors[type] || SK.gold;
  const border = state === 'missing'
    ? `1px dashed ${SK.border}`
    : type === 'escudo' ? `2px solid ${SK.gold}`
    : type === 'equipo' ? `2px solid #6EE7F9`
    : type === 'especial' ? `2px solid ${SK.gold}`
    : `2px solid ${SK.gold}`;
  const bg = state === 'missing' ? SK.bgSoft : SK.surface;
  const numColor = state === 'missing' ? SK.textMute : accentColor;

  const renderArt = () => {
    if (state === 'missing') return (
      <div style={{
        width: '80%', aspectRatio: 1,
        border: `1px dashed ${SK.textDim}`, borderRadius: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: SK.textDim, fontSize: 20,
      }}>?</div>
    );
    if (type === 'escudo')   return <EscudoArt countryColor={country?.color || SK.gold} state={state}/>;
    if (type === 'equipo')   return <EquipoArt countryColor={country?.color || SK.gold} state={state} variant={num % 2}/>;
    if (type === 'especial') return <EspecialArt subtype={subtype || (num % 2 === 0 ? 'stadium' : 'trophy')} state={state}/>;
    return <StickerArt seed={num} countryColor={country?.color || SK.gold} state={state}/>;
  };

  const typeLabel = { escudo: 'ESC', equipo: 'EQP', especial: 'ESP', jugador: null };

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        aspectRatio: '0.72',
        borderRadius: 8,
        border,
        background: bg,
        padding: s.p,
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
        opacity: state === 'missing' ? 0.85 : 1,
        transition: 'transform 0.15s ease',
        overflow: 'hidden',
      }}
    >
      {/* Type badge top-right */}
      {typeLabel[type] && state !== 'missing' && (
        <div style={{
          position: 'absolute', top: s.p, right: s.p,
          fontFamily: SK.fMono, fontSize: 7, fontWeight: 700,
          color: accentColor, letterSpacing: 0.5,
          background: `${accentColor}18`, padding: '1px 4px', borderRadius: 3,
        }}>{typeLabel[type]}</div>
      )}

      {/* Number top-left */}
      <div style={{
        fontFamily: SK.fMono, fontSize: s.fNum, fontWeight: 700,
        color: numColor, letterSpacing: 0.5,
      }}>
        {String(num).padStart(3, '0')}
      </div>

      {/* Repetida badge */}
      {state === 'duplicate' && (
        <div style={{
          position: 'absolute', top: -6, right: -6,
          background: SK.coral, color: '#fff',
          fontFamily: SK.fMono, fontSize: 10, fontWeight: 700,
          minWidth: 22, height: 22, borderRadius: 11,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `2px solid ${SK.bg}`,
          padding: '0 6px',
        }}>
          +{count - 1}
        </div>
      )}

      {/* Artwork */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
        {renderArt()}
      </div>

      {/* Name + country */}
      <div style={{ marginTop: 'auto', paddingTop: 4 }}>
        <div style={{
          fontFamily: SK.fBody, fontSize: s.fName, fontWeight: 600,
          color: state === 'missing' ? SK.textMute : SK.text,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          textTransform: 'uppercase', letterSpacing: 0.3,
        }}>
          {state === 'missing' ? '— — —' : player}
        </div>
        {country && (
          <div style={{
            fontFamily: SK.fBody, fontSize: s.fCountry, color: SK.textMute,
            display: 'flex', alignItems: 'center', gap: 3, marginTop: 1,
          }}>
            <span style={{ fontSize: s.fCountry + 2 }}>{country.flag}</span>
            <span>{country.code}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Logo mark
function LogoMark({ size = 28 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size}>
      {/* Sticker shape with folded corner */}
      <path d="M4 4 H22 L28 10 V28 H4 Z" fill={SK.gold}/>
      <path d="M22 4 V10 H28 Z" fill={SK.goldDeep}/>
      {/* Check */}
      <path d="M9 17 L14 22 L22 13" stroke={SK.bg} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function Logo({ size = 28, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <LogoMark size={size}/>
      <span style={{
        fontFamily: SK.fHead, fontWeight: 700, fontSize: size * 0.85,
        color: color || SK.text, letterSpacing: 0.5,
        textTransform: 'lowercase',
      }}>
        stickio
      </span>
    </div>
  );
}

// Progress bar
function ProgressBar({ value, max, color = SK.gold, height = 4 }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ width: '100%', height, background: SK.border, borderRadius: height / 2, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 0.4s ease' }}/>
    </div>
  );
}

// Donut progress — big circular progress ring
function DonutProgress({ value, max, size = 180, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = value / max;
  const offset = c * (1 - pct);
  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={SK.border} strokeWidth={stroke}/>
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={SK.gold} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

// Icons — simple geometric only
const Icon = {
  Bell: ({ s = 20, c = SK.text }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  ),
  Check: ({ s = 16, c = SK.gold }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Clock: ({ s = 16, c = SK.textMute }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Copy: ({ s = 16, c = SK.coral }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  ChevronRight: ({ s = 16, c = SK.textMute }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Plus: ({ s = 24, c = SK.bg }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Home: ({ s = 22, c = SK.textMute, filled }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={filled ? c : 'none'} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10l9-7 9 7v11a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/>
    </svg>
  ),
  Grid: ({ s = 22, c = SK.textMute, filled }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={filled ? c : 'none'} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Swap: ({ s = 22, c = SK.textMute, filled }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={filled ? c : 'none'} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  ),
  User: ({ s = 22, c = SK.textMute, filled }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={filled ? c : 'none'} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Search: ({ s = 18, c = SK.textMute }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Trophy: ({ s = 20, c = SK.gold }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
      <path d="M6 3h12v8a6 6 0 0 1-12 0z"/><line x1="12" y1="17" x2="12" y2="21"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
    </svg>
  ),
  Share: ({ s = 18, c = SK.gold }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  QrCamera: ({ s = 22, c = SK.gold }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  Google: ({ s = 18 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24">
      <path fill="#F5F5F5" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"/>
    </svg>
  ),
};

// Flag "chip" — rounded rectangle with flag emoji or CSS stripes
function FlagChip({ country, size = 28 }) {
  return (
    <div style={{
      width: size, height: size * 0.72, borderRadius: 4,
      background: SK.surfaceHi, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.7, overflow: 'hidden',
      border: `1px solid ${SK.border}`,
    }}>
      {country.flag}
    </div>
  );
}

Object.assign(window, {
  StickerArt, EscudoArt, EquipoArt, EspecialArt,
  StickerCard, LogoMark, Logo,
  ProgressBar, DonutProgress, Icon, FlagChip,
});
