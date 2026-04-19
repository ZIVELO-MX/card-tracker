// Mobile — Album, Trade, Profile screens

// ─────────────────────────────────────────────────────────────
// Generate demo sticker data for a country
// ─────────────────────────────────────────────────────────────
function stickersFor(country, startNum) {
  const arr = [];
  for (let i = 0; i < country.total; i++) {
    const num = startNum + i;
    let state = 'missing';
    let count = 0;
    if (i < country.have) {
      state = 'have';
      count = 1;
      if ((num * 7) % 11 === 0) { state = 'duplicate'; count = 2 + (num % 3); }
    }

    let type = 'jugador';
    let player = '';
    if (i === 0) {
      type = 'escudo';
      player = `Escudo · ${country.name}`;
    } else if (i === 1) {
      type = 'equipo';
      player = 'Foto Equipo';
    } else {
      const idx = i - 2;
      player = PLAYERS[idx % PLAYERS.length] + ' ' + String.fromCharCode(65 + (idx % 6));
    }

    arr.push({ num, player, country, state, count, type });
  }
  return arr;
}

const SPECIAL_SUBTYPES = [
  'trophy','stadium','trophy','stadium','trophy','stadium',
  'trophy','stadium','trophy','stadium','trophy','stadium',
  'trophy','stadium','trophy','stadium','trophy','stadium',
  'trophy','stadium',
];

const SPECIAL_NAMES = [
  'Copa 2026','Estadio 1','Mascota Oficial','Estadio 2',
  'Ceremonia','Estadio 3','Trofeo','Estadio 4',
  'Cartel Oficial','Estadio 5','Historia','Estadio 6',
  'Inauguración','Ciudad 1','Final','Ciudad 2',
  'Árbitros','Ciudad 3','Staff Técnico','Ciudad 4',
];

function specialStickers() {
  return Array.from({ length: 20 }, (_, i) => ({
    num: i + 1,
    player: SPECIAL_NAMES[i] || `Especial ${i + 1}`,
    country: null,
    state: i < 8 ? 'have' : 'missing',
    count: 1,
    type: 'especial',
    subtype: SPECIAL_SUBTYPES[i],
  }));
}

// ─────────────────────────────────────────────────────────────
// SCREEN 3 — Album
// ─────────────────────────────────────────────────────────────
function AlbumScreen({ onNav }) {
  const [filter, setFilter] = React.useState('Todos');
  const [query, setQuery] = React.useState('');

  const filters = ['Todos', 'Tengo', 'Falta', 'Repetidas', 'Por país', 'Especiales'];

  // Build sections
  const sections = COUNTRIES.slice(0, 3).map((c, i) => ({
    country: c,
    stickers: stickersFor(c, 1 + i * 20),
  }));

  const filterFn = (s) => {
    if (filter === 'Tengo') return s.state === 'have' || s.state === 'duplicate';
    if (filter === 'Falta') return s.state === 'missing';
    if (filter === 'Repetidas') return s.state === 'duplicate';
    return true;
  };

  return (
    <PhoneShell active="album" onNav={onNav}>
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 16 }}>
        {/* Header */}
        <div style={{ padding: '6px 20px 14px' }}>
          <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>colección</div>
          <div style={{ fontFamily: SK.fHead, fontSize: 28, fontWeight: 700, color: SK.text, marginTop: 2 }}>Mi álbum</div>
        </div>

        {/* Search */}
        <div style={{ padding: '0 20px 12px' }}>
          <div style={{
            background: SK.surface, border: `1px solid ${SK.border}`,
            borderRadius: 10, padding: '10px 12px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <Icon.Search s={16} c={SK.textMute}/>
            <input
              placeholder="Buscar por número o jugador..."
              value={query} onChange={e => setQuery(e.target.value)}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: SK.text, fontFamily: SK.fBody, fontSize: 13,
              }}
            />
          </div>
        </div>

        {/* Filter chips */}
        <div style={{
          display: 'flex', gap: 8, padding: '0 20px 14px',
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          {filters.map(f => {
            const on = filter === f;
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                flexShrink: 0,
                padding: '7px 14px',
                background: on ? SK.gold : 'transparent',
                color: on ? SK.bg : SK.textMute,
                border: on ? 'none' : `1px solid ${SK.border}`,
                borderRadius: 20,
                fontFamily: SK.fBody, fontSize: 12, fontWeight: on ? 700 : 500,
                cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>{f}</button>
            );
          })}
        </div>

        {/* Sections */}
        {sections.map((sec, si) => {
          const filtered = sec.stickers.filter(filterFn).filter(s => {
            if (!query) return true;
            return String(s.num).includes(query) || s.player.toLowerCase().includes(query.toLowerCase());
          });
          if (!filtered.length) return null;
          return (
            <div key={sec.country.code} style={{ padding: '0 20px 22px' }}>
              {/* Section header */}
              <div style={{
                background: SK.surface, border: `1px solid ${SK.border}`,
                borderRadius: 12, padding: 14, marginBottom: 12,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ fontSize: 32 }}>{sec.country.flag}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: SK.fHead, fontSize: 18, fontWeight: 700, color: SK.text, textTransform: 'uppercase' }}>
                    {sec.country.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                    <div style={{ flex: 1 }}><ProgressBar value={sec.country.have} max={sec.country.total}/></div>
                    <span style={{ fontFamily: SK.fMono, fontSize: 12, color: SK.gold, fontWeight: 600 }}>
                      {sec.country.have}/{sec.country.total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {filtered.map(s => (
                  <StickerCard key={s.num} {...s} size="md"/>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </PhoneShell>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 4 — Trade / QR
// ─────────────────────────────────────────────────────────────
function TradeScreen({ onNav }) {
  const [tab, setTab] = React.useState('qr');

  return (
    <PhoneShell active="trade" onNav={onNav}>
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 16 }}>
        {/* Header */}
        <div style={{ padding: '6px 20px 14px' }}>
          <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>intercambio</div>
          <div style={{ fontFamily: SK.fHead, fontSize: 28, fontWeight: 700, color: SK.text, marginTop: 2 }}>Trade</div>
        </div>

        {/* Tabs */}
        <div style={{ padding: '0 20px 18px' }}>
          <div style={{
            background: SK.surface, border: `1px solid ${SK.border}`,
            borderRadius: 10, padding: 4,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4,
          }}>
            {[['qr', 'Mi QR'], ['scan', 'Escanear']].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} style={{
                padding: '10px 0',
                background: tab === id ? SK.gold : 'transparent',
                color: tab === id ? SK.bg : SK.textMute,
                border: 'none', borderRadius: 8,
                fontFamily: SK.fHead, fontWeight: 700, fontSize: 13,
                textTransform: 'uppercase', letterSpacing: 1,
                cursor: 'pointer',
              }}>{label}</button>
            ))}
          </div>
        </div>

        {tab === 'qr' ? <QrTab/> : <ScanTab/>}
      </div>
    </PhoneShell>
  );
}

function QrTab() {
  return (
    <>
      <div style={{ padding: '0 20px 14px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: SK.textMute }}>
          Tienes <span style={{ color: SK.gold, fontWeight: 700, fontFamily: SK.fMono }}>23</span> repetidas para intercambiar
        </div>
      </div>

      {/* QR card */}
      <div style={{ padding: '0 20px 14px' }}>
        <div style={{
          background: SK.surface,
          border: `2px solid ${SK.gold}`,
          borderRadius: 16,
          padding: 22,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        }}>
          <QRPlaceholder size={220}/>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: SK.fHead, fontSize: 16, fontWeight: 700, color: SK.text, textTransform: 'uppercase', letterSpacing: 1 }}>
              @alex_stickio
            </div>
            <div style={{ fontFamily: SK.fMono, fontSize: 12, color: SK.textMute, marginTop: 4 }}>
              ID: STK-8F2A-9X4D
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: SK.coral, fontSize: 12, fontFamily: SK.fBody, fontWeight: 600,
          }}>
            <Icon.Clock s={14} c={SK.coral}/>
            <span>Expira en <span style={{ fontFamily: SK.fMono }}>23h 45m</span></span>
          </div>
        </div>
      </div>

      {/* Share button */}
      <div style={{ padding: '0 20px 20px' }}>
        <button style={{
          width: '100%', padding: '12px 0',
          background: 'transparent', color: SK.gold,
          border: `1.5px solid ${SK.gold}`, borderRadius: 10,
          fontFamily: SK.fHead, fontWeight: 700, fontSize: 14,
          textTransform: 'uppercase', letterSpacing: 1,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Icon.Share s={16} c={SK.gold}/>
          Compartir QR
        </button>
      </div>

      {/* Duplicates list */}
      <div style={{ padding: '0 20px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
        }}>
          <div style={{ flex: 1, height: 1, background: SK.border }}/>
          <span style={{ fontSize: 10, color: SK.textMute, fontFamily: SK.fBody, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Tus repetidas</span>
          <div style={{ flex: 1, height: 1, background: SK.border }}/>
        </div>
        <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, overflow: 'hidden' }}>
          {[
            { num: 7, country: COUNTRIES[0], player: 'Delantero A', count: 3 },
            { num: 42, country: COUNTRIES[1], player: 'Portero C', count: 2 },
            { num: 118, country: COUNTRIES[3], player: 'Mediocampista B', count: 4 },
            { num: 56, country: COUNTRIES[2], player: 'Defensor F', count: 2 },
          ].map((d, i, arr) => (
            <div key={d.num} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px',
              borderBottom: i < arr.length - 1 ? `1px solid ${SK.border}` : 'none',
            }}>
              <div style={{
                fontFamily: SK.fMono, fontSize: 13, fontWeight: 700, color: SK.gold,
                background: SK.bgSoft, padding: '4px 8px', borderRadius: 6,
                minWidth: 44, textAlign: 'center',
              }}>#{String(d.num).padStart(3, '0')}</div>
              <span style={{ fontSize: 22 }}>{d.country.flag}</span>
              <div style={{ flex: 1, fontSize: 13, color: SK.text, fontWeight: 500 }}>{d.player}</div>
              <div style={{
                background: SK.coral, color: '#fff',
                fontFamily: SK.fMono, fontSize: 11, fontWeight: 700,
                padding: '3px 8px', borderRadius: 10,
              }}>+{d.count - 1}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ScanTab() {
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <div style={{
        position: 'relative',
        width: 280, height: 280,
        background: '#000',
        borderRadius: 16, overflow: 'hidden',
      }}>
        {/* Fake camera texture */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 60% 40%, #1a2a3a 0%, #000 70%)' }}/>
        {/* Corner brackets */}
        {[['0 0', 'auto auto 0 0'], ['0 100%', 'auto 0 0 auto'], ['100% 0', '0 auto auto 0'], ['100% 100%', '0 0 auto auto']].map((_, i) => {
          const corners = [
            { top: 16, left: 16, borderTop: `3px solid ${SK.gold}`, borderLeft: `3px solid ${SK.gold}` },
            { top: 16, right: 16, borderTop: `3px solid ${SK.gold}`, borderRight: `3px solid ${SK.gold}` },
            { bottom: 16, left: 16, borderBottom: `3px solid ${SK.gold}`, borderLeft: `3px solid ${SK.gold}` },
            { bottom: 16, right: 16, borderBottom: `3px solid ${SK.gold}`, borderRight: `3px solid ${SK.gold}` },
          ];
          return <div key={i} style={{ position: 'absolute', width: 28, height: 28, borderRadius: 4, ...corners[i] }}/>;
        })}
        {/* Scan line */}
        <div style={{
          position: 'absolute', left: 24, right: 24, top: '50%',
          height: 2, background: SK.gold, boxShadow: `0 0 12px ${SK.gold}`,
          animation: 'scan 2s ease-in-out infinite',
        }}/>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: SK.fHead, fontSize: 18, fontWeight: 700, color: SK.text, textTransform: 'uppercase', letterSpacing: 1 }}>
          Apunta al QR de tu amigo
        </div>
        <div style={{ fontSize: 13, color: SK.textMute, marginTop: 8, maxWidth: 280 }}>
          Mantén el código centrado dentro del marco para iniciar el intercambio.
        </div>
      </div>
      <style>{`@keyframes scan { 0%, 100% { top: 24px; } 50% { top: calc(100% - 26px); } }`}</style>
    </div>
  );
}

// QR placeholder — deterministic block pattern
function QRPlaceholder({ size = 200 }) {
  const cells = 25;
  const blocks = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const v = (Math.sin(x * 9.7 + y * 3.3) * 10000) % 1;
      if (Math.abs(v) > 0.4) blocks.push({ x, y });
    }
  }
  const finder = (fx, fy) => (
    <g key={`f${fx}${fy}`}>
      <rect x={fx} y={fy} width={7} height={7} fill={SK.text}/>
      <rect x={fx + 1} y={fy + 1} width={5} height={5} fill={SK.bg}/>
      <rect x={fx + 2} y={fy + 2} width={3} height={3} fill={SK.text}/>
    </g>
  );
  return (
    <div style={{
      width: size, height: size,
      background: SK.text, padding: 12, borderRadius: 12,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg viewBox={`0 0 ${cells} ${cells}`} width="100%" height="100%">
        <rect width={cells} height={cells} fill={SK.text}/>
        {blocks.map(b => {
          // Skip finder-pattern areas
          const inFinder = (b.x < 8 && b.y < 8) || (b.x > cells - 9 && b.y < 8) || (b.x < 8 && b.y > cells - 9);
          if (inFinder) return null;
          return <rect key={`${b.x}-${b.y}`} x={b.x} y={b.y} width={1} height={1} fill={SK.bg}/>;
        })}
        {finder(0, 0)}
        {finder(cells - 7, 0)}
        {finder(0, cells - 7)}
        {/* Center logo spot */}
        <rect x={cells/2 - 3} y={cells/2 - 3} width={6} height={6} fill={SK.text}/>
        <rect x={cells/2 - 2.5} y={cells/2 - 2.5} width={5} height={5} fill={SK.gold}/>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 5 — Profile
// ─────────────────────────────────────────────────────────────
function ProfileScreen({ onNav, stats }) {
  const { have, total, duplicates } = stats;
  const pct = ((have / total) * 100).toFixed(1);

  return (
    <PhoneShell active="profile" onNav={onNav}>
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 16 }}>
        {/* Header */}
        <div style={{ padding: '20px 20px 20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 40,
              border: `2px solid ${SK.gold}`,
              background: SK.surface,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: SK.fHead, fontSize: 30, fontWeight: 700,
              color: SK.gold,
              boxShadow: `0 4px 16px -4px ${SK.goldDeep}`,
            }}>AM</div>
          </div>
          <div style={{ fontFamily: SK.fHead, fontSize: 22, fontWeight: 700, color: SK.text }}>Alex Moreno</div>
          <div style={{ fontFamily: SK.fMono, fontSize: 13, color: SK.textMute, marginTop: 2 }}>@alex_stickio</div>
          <div style={{ fontSize: 11, color: SK.gold, marginTop: 6, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
            Coleccionista desde mar 2026
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <ProfileStat label="Estampas" value={have} sub={`de ${total}`} color={SK.text}/>
          <ProfileStat label="Completado" value={`${pct}%`} sub="del álbum" color={SK.gold}/>
          <ProfileStat label="Intercambios" value={47} sub="realizados" color={SK.text} icon={<Icon.Swap s={14} c={SK.gold}/>}/>
          <ProfileStat label="Países" value="8/10" sub="completos" color={SK.green}/>
        </div>

        {/* Achievements */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>logros</div>
          <div style={{ fontFamily: SK.fHead, fontSize: 20, fontWeight: 700, color: SK.text, marginTop: 2, marginBottom: 12 }}>Insignias desbloqueadas</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            <Badge label="Primera" desc="Estampa" unlocked icon="star"/>
            <Badge label="25%" desc="Del álbum" unlocked icon="pct"/>
            <Badge label="Primer" desc="Trade" unlocked icon="swap"/>
            <Badge label="100%" desc="Completo" locked icon="trophy"/>
          </div>
        </div>

        {/* Featured collection */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>destacadas</div>
          <div style={{ fontFamily: SK.fHead, fontSize: 20, fontWeight: 700, color: SK.text, marginTop: 2, marginBottom: 12 }}>Edición foil</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[{ num: 1, c: COUNTRIES[0] }, { num: 2, c: COUNTRIES[3] }, { num: 3, c: COUNTRIES[1] }].map(f => (
              <FoilSticker key={f.num} num={f.num} country={f.c}/>
            ))}
          </div>
        </div>

        {/* Edit button */}
        <div style={{ padding: '0 20px 20px' }}>
          <button style={{
            width: '100%', padding: '12px 0',
            background: 'transparent', color: SK.text,
            border: `1px solid ${SK.border}`, borderRadius: 10,
            fontFamily: SK.fHead, fontWeight: 700, fontSize: 13,
            textTransform: 'uppercase', letterSpacing: 1,
            cursor: 'pointer',
          }}>Editar perfil</button>
        </div>
      </div>
    </PhoneShell>
  );
}

function ProfileStat({ label, value, sub, color, icon }) {
  return (
    <div style={{
      background: SK.surface, border: `1px solid ${SK.border}`,
      borderRadius: 12, padding: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        {icon}
        <span style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontFamily: SK.fMono, fontSize: 28, fontWeight: 700, color, letterSpacing: -0.5, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: SK.fBody, fontSize: 11, color: SK.textMute, marginTop: 4 }}>{sub}</div>
    </div>
  );
}

function Badge({ label, desc, unlocked, icon, locked }) {
  const IconMap = {
    star: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill={c}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    pct: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/></svg>,
    swap: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
    trophy: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill={c}><path d="M6 9H4a2 2 0 0 1-2-2V5h4zm12 0h2a2 2 0 0 0 2-2V5h-4zM6 3h12v8a6 6 0 0 1-12 0z" /><rect x="10" y="17" width="4" height="4"/></svg>,
  };
  const c = locked ? SK.textDim : SK.gold;
  return (
    <div style={{
      background: SK.surface,
      border: `1px solid ${locked ? SK.border : SK.gold + '44'}`,
      borderRadius: 12, padding: 10,
      textAlign: 'center',
      opacity: locked ? 0.5 : 1,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 20,
        background: locked ? SK.bgSoft : `${SK.gold}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 6px',
      }}>
        {IconMap[icon](c)}
      </div>
      <div style={{ fontFamily: SK.fHead, fontSize: 11, fontWeight: 700, color: locked ? SK.textMute : SK.text, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {locked ? '???' : label}
      </div>
      <div style={{ fontFamily: SK.fBody, fontSize: 9, color: SK.textMute, marginTop: 2 }}>
        {locked ? 'Bloqueado' : desc}
      </div>
    </div>
  );
}

function FoilSticker({ num, country }) {
  return (
    <div style={{
      position: 'relative',
      aspectRatio: '0.72',
      borderRadius: 8,
      padding: 2,
      background: `conic-gradient(from 45deg, ${SK.gold}, ${SK.goldDeep}, ${SK.gold}cc, ${SK.goldDeep}, ${SK.gold})`,
      boxShadow: `0 4px 16px -4px ${SK.goldDeep}`,
    }}>
      <div style={{
        width: '100%', height: '100%',
        background: SK.surface, borderRadius: 6,
        padding: 8, display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Shine */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
          background: `linear-gradient(180deg, ${SK.gold}18 0%, transparent 100%)`,
          pointerEvents: 'none',
        }}/>
        <div style={{
          fontFamily: SK.fMono, fontSize: 10, fontWeight: 700,
          color: SK.gold, letterSpacing: 0.5,
        }}>★ FOIL</div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <StickerArt seed={num} countryColor={country.color}/>
        </div>
        <div style={{
          fontFamily: SK.fHead, fontSize: 11, fontWeight: 700,
          color: SK.text, textTransform: 'uppercase', letterSpacing: 0.5,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <span>{country.flag}</span>
          <span style={{ fontFamily: SK.fMono, color: SK.gold, fontSize: 10 }}>#{String(num).padStart(3, '0')}</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AlbumScreen, TradeScreen, ProfileScreen, stickersFor, specialStickers, QRPlaceholder });
