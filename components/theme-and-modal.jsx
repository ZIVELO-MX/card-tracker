// Theme system + Edit Profile Modal + Desktop topbar upgrade
// This file augments the existing components with theme switching.

// ─────────────────────────────────────────────────────────────
// Theme definitions
// ─────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg: '#0A1628',
    bgSoft: '#0D1E35',
    surface: '#152238',
    surfaceHi: '#1A2B45',
    border: '#1E3A5F',
    text: '#F5F5F5',
    textMute: '#8A95A8',
    textDim: '#5A6778',
    green: '#00C853',
    coral: '#FF5A5F',
  },
  light: {
    bg: '#F5F3EE',
    bgSoft: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceHi: '#F9F7F1',
    border: '#E3DDD0',
    text: '#0A1628',
    textMute: '#6B7280',
    textDim: '#9CA3AF',
    green: '#059669',
    coral: '#DC2626',
  },
};

function applyTheme(name) {
  const t = THEMES[name] || THEMES.dark;
  Object.assign(window.SK, t);
  // Light mode pattern is subtle cream
  if (name === 'light') {
    window.HEX_PATTERN = `url("data:image/svg+xml,%3Csvg width='56' height='64' viewBox='0 0 56 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23E3DDD0' stroke-width='1'%3E%3Cpath d='M28 1L54 16v32L28 63 2 48V16z'/%3E%3Cpath d='M28 17L42 25v16L28 49 14 41V25z'/%3E%3C/g%3E%3C/svg%3E")`;
  } else {
    window.HEX_PATTERN = `url("data:image/svg+xml,%3Csvg width='56' height='64' viewBox='0 0 56 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%230F1F35' stroke-width='1'%3E%3Cpath d='M28 1L54 16v32L28 63 2 48V16z'/%3E%3Cpath d='M28 17L42 25v16L28 49 14 41V25z'/%3E%3C/g%3E%3C/svg%3E")`;
  }
}

// ─────────────────────────────────────────────────────────────
// Theme toggle button (for desktop topbar)
// ─────────────────────────────────────────────────────────────
function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  return (
    <button onClick={onToggle} title={isDark ? 'Modo claro' : 'Modo oscuro'} style={{
      position: 'relative',
      width: 68, height: 32,
      borderRadius: 16,
      background: SK.surfaceHi,
      border: `1px solid ${SK.border}`,
      cursor: 'pointer',
      padding: 2,
      display: 'flex', alignItems: 'center',
      transition: 'background 0.2s',
    }}>
      {/* Track icons */}
      <div style={{
        position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
        opacity: isDark ? 0.35 : 0, transition: 'opacity 0.2s',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill={SK.textMute}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </div>
      <div style={{
        position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
        opacity: isDark ? 0 : 0.4, transition: 'opacity 0.2s',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={SK.textMute} strokeWidth="2.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" fill={SK.textMute}/>
          <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
          <line x1="4" y1="12" x2="2" y2="12"/><line x1="22" y1="12" x2="20" y2="12"/>
          <line x1="5" y1="5" x2="6.5" y2="6.5"/><line x1="17.5" y1="17.5" x2="19" y2="19"/>
          <line x1="5" y1="19" x2="6.5" y2="17.5"/><line x1="17.5" y1="6.5" x2="19" y2="5"/>
        </svg>
      </div>
      {/* Knob */}
      <div style={{
        position: 'absolute',
        top: 3, left: isDark ? 3 : 39,
        width: 24, height: 24, borderRadius: 12,
        background: SK.gold,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'left 0.25s cubic-bezier(.4, 1.6, .6, 1)',
        boxShadow: `0 2px 6px -1px ${SK.goldDeep}`,
      }}>
        {isDark ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill={SK.bg}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={SK.bg} strokeWidth="3" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" fill={SK.bg}/>
            <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
            <line x1="4" y1="12" x2="2" y2="12"/><line x1="22" y1="12" x2="20" y2="12"/>
          </svg>
        )}
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Command Palette — ⌘K search overlay
// ─────────────────────────────────────────────────────────────
function CmdPalette({ onClose }) {
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); onClose(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const items = [];

    // Number lookup
    const num = parseInt(q.replace('#', ''));
    if (!isNaN(num) && num >= 1 && num <= 992) {
      let countryCode = null;
      let sub = 'Colección general';
      if (num <= 20) {
        countryCode = '__especiales__';
        sub = 'Especiales · Copa & Sedes';
      } else if (num <= 980) {
        const idx = Math.floor((num - 21) / 20);
        countryCode = COUNTRIES[idx]?.code || null;
        sub = countryCode ? `${COUNTRIES[idx].name} · Álbum` : 'Colección general';
      } else {
        countryCode = '__coca_cola__';
        sub = 'Coca-Cola · Patrocinador';
      }
      items.push({ type: 'sticker', label: `Estampa #${String(num).padStart(3, '0')}`, sub, num, countryCode });
    }

    // Country search
    for (const c of COUNTRIES) {
      if (c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)) {
        items.push({ type: 'country', label: c.name, sub: `Grupo ${c.group} · ${c.total} estampas`, flag: c.flag, code: c.code });
      }
    }

    // Type search
    const types = [
      { key: 'escudo', label: 'Escudo', sub: 'Tipo · 1 por selección' },
      { key: 'equipo', label: 'Equipo', sub: 'Tipo · foto grupal' },
      { key: 'especial', label: 'Especial', sub: 'Copa & Sedes 2026 · 001–020' },
      { key: 'jugador', label: 'Jugador', sub: 'Tipo · silueta geométrica' },
    ];
    for (const t of types) {
      if (t.label.toLowerCase().includes(q) || t.key.includes(q)) {
        items.push({ type: 'stype', label: t.label, sub: t.sub, key: t.key });
      }
    }

    return items.slice(0, 8);
  }, [query]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const navigateFromResult = (r) => {
    if (!r) return;
    const detail = { nav: 'album', countryCode: null };
    if (r.type === 'country') detail.countryCode = r.code;
    if (r.type === 'sticker') detail.countryCode = r.countryCode || null;
    if (r.type === 'stype' && r.key === 'especial') detail.countryCode = '__especiales__';
    window.dispatchEvent(new CustomEvent('stickio:navigate', { detail }));
    onClose();
  };

  React.useEffect(() => {
    const onKey = (e) => {
      if (!results.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, results.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        navigateFromResult(results[activeIndex]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [results, activeIndex]);

  const SUGGESTIONS = ['México', 'Argentina', 'España', 'Brasil', '#001', 'Escudo', 'Copa 2026'];

  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, zIndex: 200,
        background: 'rgba(5, 11, 20, 0.72)',
        backdropFilter: 'blur(5px)',
        animation: 'fadeIn 0.15s ease',
      }}/>
      <div style={{
        position: 'absolute', top: '18%', left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 201, width: 560,
        background: SK.surface, border: `1px solid ${SK.border}`,
        borderRadius: 16,
        boxShadow: `0 28px 70px -14px rgba(0,0,0,0.7), 0 0 0 1px ${SK.gold}18`,
        overflow: 'hidden',
        animation: 'modalIn 0.2s cubic-bezier(.2,1.2,.4,1)',
      }}>
        {/* Input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '16px 20px', borderBottom: `1px solid ${SK.border}`,
        }}>
          <Icon.Search s={18} c={SK.gold}/>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por número, país o tipo..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontFamily: SK.fBody, fontSize: 15, color: SK.text,
            }}
          />
          <span style={{
            fontFamily: SK.fMono, fontSize: 10, color: SK.textDim,
            background: SK.bgSoft, padding: '3px 7px', borderRadius: 5,
            border: `1px solid ${SK.border}`, letterSpacing: 0.5, flexShrink: 0,
          }}>ESC</span>
        </div>

        {/* Suggestions (no query) */}
        {!query && (
          <div style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600, marginBottom: 10 }}>Sugerencias</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => setQuery(s)} style={{
                  padding: '6px 12px', background: SK.bgSoft, border: `1px solid ${SK.border}`,
                  borderRadius: 8, cursor: 'pointer', fontFamily: SK.fBody, fontSize: 12, color: SK.textMute,
                  transition: 'background 0.12s, color 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = SK.surfaceHi; e.currentTarget.style.color = SK.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = SK.bgSoft; e.currentTarget.style.color = SK.textMute; }}
                >{s}</button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div style={{ maxHeight: 340, overflow: 'auto' }}>
            {results.map((r, i) => (
              <div key={i}
                onClick={() => navigateFromResult(r)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '10px 20px', cursor: 'pointer',
                  borderBottom: i < results.length - 1 ? `1px solid ${SK.border}22` : 'none',
                  background: i === activeIndex ? SK.surfaceHi : 'transparent',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                  background: SK.bgSoft, border: `1px solid ${SK.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: SK.fMono, fontSize: r.type === 'country' ? 20 : 11,
                  color: SK.gold, fontWeight: 700,
                }}>
                  {r.type === 'country' ? r.flag : r.type === 'sticker' ? `#${r.num}` : '★'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: SK.fHead, fontSize: 14, fontWeight: 700, color: SK.text }}>{r.label}</div>
                  <div style={{ fontFamily: SK.fMono, fontSize: 11, color: SK.textMute, marginTop: 2 }}>{r.sub}</div>
                </div>
                <div style={{
                  fontFamily: SK.fMono, fontSize: 9, color: SK.textDim,
                  textTransform: 'uppercase', letterSpacing: 0.8,
                  background: SK.bgSoft, padding: '2px 7px', borderRadius: 5,
                  border: `1px solid ${SK.border}`,
                }}>
                  {r.type === 'country' ? 'País' : r.type === 'sticker' ? 'Estampa' : 'Tipo'}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {query && results.length === 0 && (
          <div style={{ padding: '32px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>🔍</div>
            <div style={{ fontFamily: SK.fHead, fontSize: 16, fontWeight: 700, color: SK.textMute }}>Sin resultados para "{query}"</div>
            <div style={{ fontFamily: SK.fBody, fontSize: 12, color: SK.textDim, marginTop: 6 }}>Intenta con un número (1–980), nombre de país o tipo de estampa</div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          padding: '10px 20px', borderTop: `1px solid ${SK.border}`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          {[['↵', 'seleccionar'], ['↑↓', 'navegar'], ['ESC', 'cerrar']].map(([k, l]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{
                fontFamily: SK.fMono, fontSize: 10, color: SK.textDim,
                background: SK.bgSoft, padding: '2px 6px', borderRadius: 4,
                border: `1px solid ${SK.border}`,
              }}>{k}</span>
              <span style={{ fontFamily: SK.fBody, fontSize: 11, color: SK.textDim }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Desktop topbar V2 — with theme toggle
// ─────────────────────────────────────────────────────────────
function DesktopTopbarV2({ title, sub, theme, onToggleTheme, userData }) {
  const [cmdOpen, setCmdOpen] = React.useState(false);
  const [hovUser, setHovUser] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(() => window.getUnreadCount ? window.getUnreadCount() : 0);
  const [bellOpen, setBellOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(() => window.readNotifications ? window.readNotifications() : []);
  const safeName = userData?.name || userData?.username || null;
  const initials = safeName
    ? safeName.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  const firstName = safeName ? safeName.split(' ')[0] : 'Yo';
  const handleLogout = async () => {
    if (window.supabase?.auth) await window.supabase.auth.signOut();
  };

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(o => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  React.useEffect(() => {
    const update = () => {
      setUnreadCount(window.getUnreadCount ? window.getUnreadCount() : 0);
      setNotifications(window.readNotifications ? window.readNotifications() : []);
    };
    window.addEventListener('stickio:notification-added', update);
    window.addEventListener('stickio:notification-updated', update);
    return () => {
      window.removeEventListener('stickio:notification-added', update);
      window.removeEventListener('stickio:notification-updated', update);
    };
  }, []);

  return (
    <>
    {cmdOpen && <CmdPalette onClose={() => setCmdOpen(false)}/>}
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '22px 36px',
    }}>
      <div>
        <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>{sub}</div>
        <div style={{ fontFamily: SK.fHead, fontSize: 28, fontWeight: 700, color: SK.text, marginTop: 2 }}>{title}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div onClick={() => setCmdOpen(true)} style={{
          background: SK.surface, border: `1px solid ${SK.border}`,
          borderRadius: 10, padding: '9px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          width: 260, cursor: 'pointer',
          transition: 'border-color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = SK.textDim}
        onMouseLeave={e => e.currentTarget.style.borderColor = SK.border}
        >
          <Icon.Search s={16} c={SK.textMute}/>
          <span style={{ flex: 1, fontFamily: SK.fBody, fontSize: 13, color: SK.textDim }}>Buscar estampas...</span>
          <span style={{
            fontFamily: SK.fMono, fontSize: 10, color: SK.textDim,
            background: SK.bgSoft, padding: '2px 6px', borderRadius: 4,
            border: `1px solid ${SK.border}`,
          }}>⌘K</span>
        </div>

        <ThemeToggle theme={theme} onToggle={onToggleTheme}/>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              const next = !bellOpen;
              setBellOpen(next);
              if (next && window.markAllRead) window.markAllRead();
            }}
            style={{
              background: SK.surface, border: `1px solid ${SK.border}`,
              width: 40, height: 40, borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <Icon.Bell s={18} c={SK.text}/>
            {unreadCount > 0 && (
              <div style={{
                position: 'absolute', top: -4, right: -4,
                background: SK.coral, color: '#fff',
                borderRadius: 10, minWidth: 16, height: 16,
                fontSize: 10, fontFamily: SK.fMono, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 3px', lineHeight: 1,
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </button>

          {bellOpen && (
            <div
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                width: 320, maxHeight: 400, overflowY: 'auto',
                background: SK.surface, border: `1px solid ${SK.border}`,
                borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                zIndex: 220, padding: '8px 0',
              }}
              onMouseLeave={() => setBellOpen(false)}
            >
              {notifications.length === 0 ? (
                <EmptyState icon="🔔" title="Sin notificaciones" sub="Aquí aparecerán tus logros y alertas"/>
              ) : notifications.slice(0, 20).map((n, idx) => (
                <div key={n.id || `${n.ts}-${idx}`} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '10px 16px',
                  background: n.read ? 'transparent' : `${SK.gold}12`,
                  borderBottom: idx === Math.min(notifications.length, 20) - 1 ? 'none' : `1px solid ${SK.border}`,
                }}>
                  <span style={{ fontSize: 18 }}>{(window.NOTIFICATION_TYPES?.[n.type] || {}).icon || '🔔'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: SK.text, lineHeight: 1.4 }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: SK.textMute, marginTop: 2 }}>{window.timeAgo ? window.timeAgo(n.ts) : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ position: 'relative', paddingBottom: 8 }}
          onMouseEnter={() => setHovUser(true)}
          onMouseLeave={() => setHovUser(false)}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: hovUser ? SK.surfaceHi : SK.surface,
            border: `1px solid ${hovUser ? SK.gold + '44' : SK.border}`,
            padding: '6px 14px 6px 6px', borderRadius: 24,
            cursor: 'pointer',
            transition: 'background 0.15s, border-color 0.15s',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 14,
              background: SK.gold, color: theme === 'dark' ? SK.bg : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: SK.fHead, fontSize: 12, fontWeight: 700,
            }}>{initials}</div>
            <span style={{ fontSize: 13, fontWeight: 500, color: SK.text }}>{firstName}</span>
          </div>
          {hovUser && (
            <div style={{
              position: 'absolute', top: '100%', right: 0,
              background: SK.surface, border: `1px solid ${SK.border}`,
              borderRadius: 12, padding: 6, minWidth: 160,
              boxShadow: '0 8px 24px -6px rgba(0,0,0,0.4)',
              zIndex: 100,
              animation: 'fadeIn 0.12s ease-out',
            }}>
              <button onClick={handleLogout} style={{
                width: '100%', padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'transparent', border: 'none', borderRadius: 8,
                color: SK.coral, fontFamily: SK.fBody, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = SK.coral + '18'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

// Shell v2 — uses the v2 topbar
function DesktopShellV2({ children, active, onNav, title, sub, theme, onToggleTheme }) {
  return (
    <div style={{
      width: DESKTOP_W, height: DESKTOP_H,
      background: SK.bg,
      backgroundImage: HEX_PATTERN,
      display: 'flex',
      color: SK.text, fontFamily: SK.fBody,
      overflow: 'hidden',
    }}>
      <DesktopSidebar active={active} onNav={onNav}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DesktopTopbarV2 title={title} sub={sub} theme={theme} onToggleTheme={onToggleTheme}/>
        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Edit Profile Modal
// ─────────────────────────────────────────────────────────────
function EditProfileModal({ open, onClose, userData, onSave }) {
  const [name, setName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');
  const [avatar, setAvatar] = React.useState('AM');
  const [privacy, setPrivacy] = React.useState('public');
  const [notifs, setNotifs] = React.useState(true);
  const [countryCode, setCountryCode] = React.useState('');
  const [focus, setFocus] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [availability, setAvailability] = React.useState({ username: null, phone: null, whatsapp: null });

  const avatarOptions = ['AM', 'A!', 'AX', '⚽', '★', '♦'];

  React.useEffect(() => {
    if (!open) return;
    const nameVal = userData?.name || userData?.username || '';
    const usernameVal = userData?.username || '';
    setName(nameVal);
    setUsername(usernameVal);
    setEmail(userData?.email || '');
    setLocation(userData?.location || '');
    setPhone(userData?.phone || '');
    setWhatsapp(userData?.whatsapp || '');
    setBio(userData?.bio || '');
    setCountryCode(userData?.country_code || '');
    setErrorMsg('');
    setSaving(false);
    setAvailability({ username: null, phone: null, whatsapp: null });
    const initials = nameVal.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    setAvatar(initials || 'AM');
    // Cargar preferencias guardadas en localStorage
    if (userData?.id) {
      try {
        const saved = JSON.parse(localStorage.getItem(`stickio_settings_${userData.id}`) || '{}');
        if (saved.privacy) setPrivacy(saved.privacy);
        if (typeof saved.notifs === 'boolean') setNotifs(saved.notifs);
      } catch (_) {}
    }
  }, [open, userData]);

  if (!open) return null;

  const inputStyle = (f) => ({
    width: '100%',
    background: SK.bgSoft,
    border: `1px solid ${focus === f ? SK.gold : SK.border}`,
    borderRadius: 10, padding: '12px 14px',
    fontFamily: SK.fBody, fontSize: 14, color: SK.text,
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  });

  const labelStyle = {
    fontSize: 10, textTransform: 'uppercase', letterSpacing: 1,
    color: SK.textMute, fontWeight: 700, marginBottom: 6, display: 'block',
  };

  const normalizedPhone = window.normalizeIntlPhone ? window.normalizeIntlPhone(phone) : phone.replace(/\D/g, '');
  const normalizedWhatsapp = window.normalizeIntlPhone ? window.normalizeIntlPhone(whatsapp) : whatsapp.replace(/\D/g, '');
  const phoneOk = window.isValidIntlPhone ? window.isValidIntlPhone(phone) : true;
  const whatsappOk = window.isValidIntlPhone ? window.isValidIntlPhone(whatsapp) : true;
  const canSave = !saving && phoneOk && whatsappOk && String(name || '').trim().length > 1 && String(username || '').trim().length > 1;

  const runAvailabilityCheck = async (field, rawValue) => {
    if (!userData?.id || !window.checkProfileFieldAvailability) return;
    const v = String(rawValue || '').trim();
    if (!v) {
      setAvailability(prev => ({ ...prev, [field]: null }));
      return;
    }
    setAvailability(prev => ({ ...prev, [field]: 'checking' }));
    const res = await window.checkProfileFieldAvailability(userData.id, field, rawValue);
    setAvailability(prev => ({ ...prev, [field]: res.available ? 'ok' : (res.message || 'not_ok') }));
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, zIndex: 100,
        background: 'rgba(5, 11, 20, 0.72)',
        backdropFilter: 'blur(6px)',
        animation: 'fadeIn 0.2s ease',
      }}/>

      {/* Modal */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 101,
        width: 640, maxHeight: '90%',
        background: SK.surface,
        border: `1px solid ${SK.border}`,
        borderRadius: 20,
        boxShadow: '0 32px 80px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,184,65,0.1)',
        display: 'flex', flexDirection: 'column',
        animation: 'modalIn 0.25s cubic-bezier(.2, 1.2, .4, 1)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '22px 28px 18px',
          borderBottom: `1px solid ${SK.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 11, color: SK.gold, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700 }}>
              cuenta
            </div>
            <div style={{ fontFamily: SK.fHead, fontSize: 24, fontWeight: 700, color: SK.text, marginTop: 2 }}>
              Editar perfil
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: 10,
            background: SK.bgSoft, border: `1px solid ${SK.border}`,
            color: SK.textMute, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body — scrollable */}
        <div style={{ padding: '24px 28px', overflow: 'auto', flex: 1 }}>
          {/* Avatar row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 40,
              border: `2px solid ${SK.gold}`,
              background: SK.bgSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: SK.fHead, fontSize: 30, fontWeight: 700,
              color: SK.gold, flexShrink: 0,
              boxShadow: `0 4px 16px -4px ${SK.goldDeep}`,
            }}>{avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ ...labelStyle }}>Avatar</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {avatarOptions.map(a => (
                  <button key={a} onClick={() => setAvatar(a)} style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: avatar === a ? `${SK.gold}22` : SK.bgSoft,
                    border: `1px solid ${avatar === a ? SK.gold : SK.border}`,
                    color: avatar === a ? SK.gold : SK.textMute,
                    fontFamily: SK.fHead, fontSize: 15, fontWeight: 700,
                    cursor: 'pointer',
                  }}>{a}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Name + Username */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Nombre</label>
              <input
                value={name} onChange={e => setName(e.target.value)}
                onFocus={() => setFocus('name')} onBlur={() => setFocus(null)}
                style={inputStyle('name')}
              />
            </div>
            <div>
              <label style={labelStyle}>Username</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: SK.textMute, fontFamily: SK.fMono, fontSize: 14, pointerEvents: 'none',
                }}>@</span>
                 <input
                   value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                  onFocus={() => setFocus('username')} onBlur={() => { setFocus(null); runAvailabilityCheck('username', username); }}
                  style={{ ...inputStyle('username'), paddingLeft: 28, fontFamily: SK.fMono }}
                />
                <div style={{ fontSize: 10, marginTop: 4, color: availability.username === 'ok' ? SK.green : availability.username === 'checking' ? SK.textDim : availability.username ? SK.coral : SK.textDim }}>
                  {availability.username === 'ok' ? 'Username disponible.' : availability.username === 'checking' ? 'Verificando username...' : availability.username || ''}
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Biografía</label>
            <textarea
              value={bio} onChange={e => setBio(e.target.value.slice(0, 160))}
              onFocus={() => setFocus('bio')} onBlur={() => setFocus(null)}
              rows={3}
              style={{ ...inputStyle('bio'), resize: 'vertical', minHeight: 72, fontFamily: SK.fBody, lineHeight: 1.5 }}
            />
            <div style={{
              fontFamily: SK.fMono, fontSize: 11, marginTop: 4, textAlign: 'right',
              color: bio.length >= 160 ? SK.coral : SK.textDim,
            }}>{bio.length} / 160</div>
          </div>

           {/* Location + Email */}
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
             <div>
               <label style={labelStyle}>Ubicación</label>
               <input
                value={location} onChange={e => setLocation(e.target.value)}
                onFocus={() => setFocus('location')} onBlur={() => setFocus(null)}
                style={inputStyle('location')}
              />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
             <input
               type="email"
               value={email}
               disabled
               style={{
                 ...inputStyle('email'),
                 color: SK.textDim,
                 opacity: 0.7,
                 cursor: 'not-allowed',
               }}
              />
             </div>
           </div>

           {/* Country */}
           <div style={{ marginBottom: 14 }}>
             <label style={labelStyle}>País (álbum)</label>
             <select
               value={countryCode}
               onChange={e => setCountryCode(e.target.value)}
               style={{
                 ...inputStyle('country'),
                 cursor: 'pointer',
                 appearance: 'none',
                 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                 backgroundRepeat: 'no-repeat',
                 backgroundPosition: 'right 12px center',
                 paddingRight: 34,
               }}
             >
               <option value="">— Sin seleccionar —</option>
               {(window.COUNTRIES || []).map(c => (
                 <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
               ))}
             </select>
           </div>

           {/* Contact numbers */}
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
             <div>
               <label style={labelStyle}>WhatsApp</label>
               <input
                 value={whatsapp}
                 onChange={e => setWhatsapp(e.target.value)}
                 onFocus={() => setFocus('whatsapp')} onBlur={() => { setFocus(null); runAvailabilityCheck('whatsapp', whatsapp); }}
                 placeholder="5491155555555"
                 style={{ ...inputStyle('whatsapp'), borderColor: !whatsappOk ? SK.coral : (focus === 'whatsapp' ? SK.gold : SK.border), fontFamily: SK.fMono }}
               />
                <div style={{ fontSize: 10, color: !whatsappOk ? SK.coral : SK.textDim, marginTop: 4 }}>
                  {!whatsappOk ? 'Formato inválido (10-15 dígitos).' : 'Formato internacional, sin + ni espacios.'}
                </div>
                {whatsappOk && availability.whatsapp && (
                  <div style={{ fontSize: 10, marginTop: 2, color: availability.whatsapp === 'ok' ? SK.green : availability.whatsapp === 'checking' ? SK.textDim : SK.coral }}>
                    {availability.whatsapp === 'ok' ? 'WhatsApp disponible.' : availability.whatsapp === 'checking' ? 'Verificando WhatsApp...' : availability.whatsapp}
                  </div>
                )}
              </div>
              <div>
                <label style={labelStyle}>Teléfono</label>
                <input
                 value={phone}
                 onChange={e => setPhone(e.target.value)}
                 onFocus={() => setFocus('phone')} onBlur={() => { setFocus(null); runAvailabilityCheck('phone', phone); }}
                 placeholder="525511223344"
                 style={{ ...inputStyle('phone'), borderColor: !phoneOk ? SK.coral : (focus === 'phone' ? SK.gold : SK.border), fontFamily: SK.fMono }}
               />
                <div style={{ fontSize: 10, color: !phoneOk ? SK.coral : SK.textDim, marginTop: 4 }}>
                  {!phoneOk ? 'Formato inválido (10-15 dígitos).' : 'Opcional, se usa como fallback de contacto.'}
                </div>
                {phoneOk && availability.phone && (
                  <div style={{ fontSize: 10, marginTop: 2, color: availability.phone === 'ok' ? SK.green : availability.phone === 'checking' ? SK.textDim : SK.coral }}>
                    {availability.phone === 'ok' ? 'Teléfono disponible.' : availability.phone === 'checking' ? 'Verificando teléfono...' : availability.phone}
                  </div>
                )}
              </div>
           </div>

          {/* Privacy */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Privacidad del perfil</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { v: 'public', t: 'Público', d: 'Cualquiera puede ver tu colección' },
                { v: 'friends', t: 'Amigos', d: 'Solo quienes intercambien contigo' },
              ].map(o => {
                const on = privacy === o.v;
                return (
                  <button key={o.v} onClick={() => setPrivacy(o.v)} style={{
                    textAlign: 'left', cursor: 'pointer',
                    background: on ? `${SK.gold}12` : SK.bgSoft,
                    border: `1px solid ${on ? SK.gold : SK.border}`,
                    borderRadius: 10, padding: '12px 14px',
                    position: 'relative',
                  }}>
                    <div style={{
                      fontFamily: SK.fHead, fontWeight: 700, fontSize: 13,
                      color: on ? SK.gold : SK.text,
                      textTransform: 'uppercase', letterSpacing: 0.8,
                    }}>{o.t}</div>
                    <div style={{ fontSize: 11, color: SK.textMute, marginTop: 3 }}>{o.d}</div>
                    {on && (
                      <div style={{
                        position: 'absolute', top: 10, right: 10,
                        width: 16, height: 16, borderRadius: 8, background: SK.gold,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={SK.bg} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notifications toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px',
            background: SK.bgSoft,
            border: `1px solid ${SK.border}`,
            borderRadius: 10,
          }}>
            <div>
              <div style={{ fontFamily: SK.fBody, fontSize: 14, fontWeight: 600, color: SK.text }}>
                Notificaciones de intercambio
              </div>
              <div style={{ fontSize: 12, color: SK.textMute, marginTop: 2 }}>
                Alertas cuando alguien quiera trade con tus repetidas
              </div>
            </div>
            <button onClick={() => setNotifs(!notifs)} style={{
              width: 44, height: 24, borderRadius: 12,
              background: notifs ? SK.gold : SK.border,
              border: 'none', padding: 2, cursor: 'pointer',
              transition: 'background 0.2s',
              display: 'flex', alignItems: 'center',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 10,
                background: notifs ? SK.bg : SK.textMute,
                transform: notifs ? 'translateX(20px)' : 'translateX(0)',
                transition: 'transform 0.2s',
              }}/>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '18px 28px',
          borderTop: `1px solid ${SK.border}`,
          background: SK.bgSoft,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <button onClick={async () => {
            if (window.supabase?.auth) await window.supabase.auth.signOut();
            window.location.reload();
          }} style={{
            background: 'none', border: 'none',
            color: SK.coral, fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: SK.fBody,
            textTransform: 'uppercase', letterSpacing: 0.8,
          }}>Cerrar sesión</button>
           <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
             {errorMsg && (
               <div style={{ fontSize: 12, color: SK.coral, fontWeight: 600 }}>{errorMsg}</div>
             )}
             <div style={{ display: 'flex', gap: 10 }}>
             <button onClick={onClose} style={{
               padding: '10px 20px',
               background: 'transparent', color: SK.text,
              border: `1px solid ${SK.border}`, borderRadius: 10,
              fontFamily: SK.fHead, fontWeight: 700, fontSize: 12,
              textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
            }}>Cancelar</button>
             <button disabled={!canSave} onClick={async () => {
               if (!onSave) { onClose(); return; }
               setSaving(true);
               setErrorMsg('');
               try {
                 const { error, message } = await onSave({
                   name,
                   username,
                   email,
                   bio,
                   location,
                   phone: normalizedPhone,
                   whatsapp: normalizedWhatsapp,
                   country_code: countryCode || null,
                 });
                 if (error) {
                   setErrorMsg(message || 'No se pudo guardar el perfil.');
                   return;
                 }
                 // Guardar preferencias locales (privacy/notifs no tienen columna en DB aún)
                 if (userData?.id) {
                   try {
                     localStorage.setItem(`stickio_settings_${userData.id}`, JSON.stringify({ privacy, notifs }));
                   } catch (_) {}
                 }
                 onClose();
               } catch (err) {
                 setErrorMsg('Error inesperado. Intenta de nuevo.');
               } finally {
                 setSaving(false);
               }
             }} style={{
               padding: '10px 22px',
               background: canSave ? SK.gold : SK.border, color: canSave ? SK.bg : SK.textMute,
               border: 'none', borderRadius: 10,
               fontFamily: SK.fHead, fontWeight: 700, fontSize: 12,
               textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
               boxShadow: canSave ? `0 4px 14px -4px ${SK.goldDeep}` : 'none',
              }}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
             </div>
           </div>
         </div>
       </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn { from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
      `}</style>
    </>
  );
}

Object.assign(window, {
  THEMES, applyTheme, ThemeToggle,
  DesktopTopbarV2, DesktopShellV2,
  EditProfileModal,
});
