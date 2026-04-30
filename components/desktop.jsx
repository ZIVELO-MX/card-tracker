// Desktop screens — 1440px wide

const DESKTOP_W = 1440;
const DESKTOP_H = 900;
window.DESKTOP_W = DESKTOP_W;
window.DESKTOP_H = DESKTOP_H;

function AdminDesktop({ onNav, userData, theme, onToggleTheme, fetchStats, stats: appStats = null }) {
  const [adminStats, setAdminStats] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    if (!fetchStats) return;
    setLoading(true);
    fetchStats().then((data) => {
      if (!alive) return;
      setAdminStats(data);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [fetchStats]);

  return (
    <DesktopShell active="admin" onNav={onNav} title="Admin" sub="Resumen de actividad" theme={theme} onToggleTheme={onToggleTheme} userData={userData} stats={appStats}>
      <div style={{ padding: '28px 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
          {[
            { label: 'Usuarios totales', value: adminStats?.total_users ?? '—', color: SK.gold },
            { label: 'Nuevos (7d)', value: adminStats?.new_users_7d ?? '—', color: SK.green },
            { label: 'Nuevos (24h)', value: adminStats?.new_users_24h ?? '—', color: SK.coral },
          ].map(s => (
            <div key={s.label} style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontFamily: SK.fMono, fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
          <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>uso</div>
            <div style={{ fontFamily: SK.fHead, fontSize: 18, fontWeight: 700, color: SK.text, marginTop: 6 }}>Promedios</div>
            <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: SK.textMute }}>
                <span>Estampas promedio</span>
                <span style={{ fontFamily: SK.fMono, color: SK.text }}>{adminStats?.avg_have ?? '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: SK.textMute }}>
                <span>Repetidas promedio</span>
                <span style={{ fontFamily: SK.fMono, color: SK.text }}>{adminStats?.avg_duplicates ?? '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: SK.textMute }}>
                <span>Usuarios con colección</span>
                <span style={{ fontFamily: SK.fMono, color: SK.text }}>{adminStats?.users_with_collection ?? '—'}</span>
              </div>
            </div>
          </div>

          <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>estado</div>
            <div style={{ fontFamily: SK.fHead, fontSize: 18, fontWeight: 700, color: SK.text, marginTop: 6 }}>Marketplace</div>
            <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: SK.textMute }}>
                <span>Publicaciones activas</span>
                <span style={{ fontFamily: SK.fMono, color: SK.text }}>{adminStats?.market_active ?? '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: SK.textMute }}>
                <span>Publicaciones totales</span>
                <span style={{ fontFamily: SK.fMono, color: SK.text }}>{adminStats?.market_total ?? '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div style={{ marginTop: 16, fontSize: 12, color: SK.textMute }}>
            Cargando estadísticas...
          </div>
        )}
      </div>
    </DesktopShell>
  );
}

// Sidebar
function DesktopSidebar({ active, onNav, stats = null }) {
  const [hovId, setHovId] = React.useState(null);
  const items = [
    { id: 'home',        label: 'Inicio',       Icon: Icon.Home  },
    { id: 'album',       label: 'Álbum',         Icon: Icon.Grid  },
    { id: 'trade',       label: 'Intercambios',  Icon: Icon.Swap  },
    { id: 'marketplace', label: 'Marketplace',   Icon: Icon.Store },
    { id: 'profile',     label: 'Perfil',        Icon: Icon.User  },
  ];
  return (
    <div style={{
      width: 240, flexShrink: 0,
      background: SK.surface,
      borderRight: `1px solid ${SK.border}`,
      padding: '28px 14px 24px',
      display: 'flex', flexDirection: 'column',
      height: '100%',
    }}>
      <div style={{ marginBottom: 34, paddingLeft: 4 }}>
        <Logo size={28}/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map(it => {
          const on = active === it.id;
          const hov = !on && hovId === it.id;
          return (
            <button key={it.id} onClick={() => onNav(it.id)}
              onMouseEnter={() => setHovId(it.id)}
              onMouseLeave={() => setHovId(null)}
              style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px',
              background: on ? `${SK.gold}18` : hov ? SK.surfaceHi : 'transparent',
              border: 'none', borderRadius: 10,
              color: on ? SK.gold : hov ? SK.text : SK.textMute,
              fontFamily: SK.fBody, fontSize: 14, fontWeight: on ? 700 : 500,
              cursor: 'pointer', textAlign: 'left',
              textTransform: 'uppercase', letterSpacing: 0.8,
              position: 'relative',
              transition: 'background 0.15s ease-out, color 0.15s ease-out, transform 0.15s ease-out',
              transform: hov ? 'translateX(2px)' : 'none',
            }}>
              {on && <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, background: SK.gold, borderRadius: 2 }}/>}
              <it.Icon s={18} c={on ? SK.gold : hov ? SK.text : SK.textMute} filled={on}/>
              {it.label}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div style={{
          background: SK.bgSoft, border: `1px solid ${SK.border}`,
          borderRadius: 12, padding: 14,
        }}>
          <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 6 }}>PROGRESO</div>
          <div style={{ fontFamily: SK.fMono, fontSize: 18, fontWeight: 700, color: SK.gold, marginBottom: 6 }}>
            {(stats?.have ?? 0)}/{(stats?.total ?? 992)}
          </div>
          <ProgressBar value={stats?.have ?? 0} max={stats?.total ?? 992} height={3}/>
        </div>
      </div>
    </div>
  );
}

function DesktopTopbar({ title, sub, onCmdOpen, userData }) {
  const [unreadCount, setUnreadCount] = React.useState(() => window.getUnreadCount ? window.getUnreadCount() : 0);
  const [bellOpen, setBellOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(() => window.readNotifications ? window.readNotifications() : []);
  const safeName = userData?.name || userData?.username || null;
  const initials = safeName
    ? safeName.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  const firstName = safeName ? safeName.split(' ')[0] : 'Yo';
  const [hovUser, setHovUser] = React.useState(false);

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

  const handleLogout = async () => {
    if (window.supabase?.auth) await window.supabase.auth.signOut();
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '22px 36px',
    }}>
      <div>
        <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>{sub}</div>
        <div style={{ fontFamily: SK.fHead, fontSize: 28, fontWeight: 700, color: SK.text, marginTop: 2 }}>{title}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div onClick={onCmdOpen} style={{
          background: SK.surface, border: `1px solid ${SK.border}`,
          borderRadius: 10, padding: '9px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          width: 280, cursor: 'pointer',
          transition: 'border-color 0.15s ease-out',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = SK.gold + '66'}
        onMouseLeave={e => e.currentTarget.style.borderColor = SK.border}
        >
          <Icon.Search s={16} c={SK.textMute}/>
          <span style={{ flex: 1, fontFamily: SK.fBody, fontSize: 13, color: SK.textDim }}>Buscar estampas...</span>
          <span style={{ fontFamily: SK.fMono, fontSize: 10, color: SK.textDim, background: SK.bgSoft, padding: '2px 6px', borderRadius: 4, border: `1px solid ${SK.border}` }}>⌘K</span>
        </div>
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
            <AvatarBubble userData={userData} size={28} />
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
  );
}

function DesktopShell({ children, active, onNav, title, sub, theme, onToggleTheme, userData, stats = null }) {
  const [cmdOpen, setCmdOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(v => !v); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div style={{
      width: DESKTOP_W, height: DESKTOP_H,
      background: SK.bg,
      backgroundImage: HEX_PATTERN,
      display: 'flex',
      color: SK.text, fontFamily: SK.fBody,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <DesktopSidebar active={active} onNav={onNav} stats={stats}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DesktopTopbar title={title} sub={sub} theme={theme} onToggleTheme={onToggleTheme} onCmdOpen={() => setCmdOpen(true)} userData={userData}/>
        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
      </div>
      {cmdOpen && <CmdPalette onClose={() => setCmdOpen(false)}/>}
    </div>
  );
}

const timeAgo = window.timeAgo;

function activityIcon(type) {
  const map = {
    add: 'check',
    dup: 'dup',
    remove: 'remove',
    listing: 'listing',
    closed: 'closed',
  };
  return map[type] || 'check';
}

function activityText(event) {
  const cfg = window.ACTIVITY_TYPES?.[event.type];
  if (!cfg?.label) return `Movimiento: ${event.id || ''}`;
  return cfg.label(event.id || '');
}

function extractRecentStickerIds(log = []) {
  const ids = [];
  const seen = new Set();
  for (const ev of log) {
    if (ev.type !== 'add' && ev.type !== 'dup') continue;
    if (!ev.id || seen.has(ev.id)) continue;
    ids.push(ev.id);
    seen.add(ev.id);
    if (ids.length >= 3) break;
  }
  return ids;
}

function ActivityRow({ icon, text, time, last = false }) {
  const IconMap = {
    check: <Icon.Check s={14} c={SK.green}/>,
    dup: <Icon.Copy s={14} c={SK.coral}/>,
    remove: <Icon.X s={14} c={SK.coral}/>,
    listing: <Icon.Store s={14} c={SK.gold}/>,
    closed: <Icon.Clock s={14} c={SK.textMute}/>,
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px',
      borderBottom: last ? 'none' : `1px solid ${SK.border}`,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 14,
        background: SK.bgSoft, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>{IconMap[icon] || IconMap.check}</div>
      <div style={{ flex: 1, fontSize: 13, color: SK.textMute, fontFamily: SK.fBody }}>{text}</div>
      <div style={{ fontFamily: SK.fMono, fontSize: 11, color: SK.textDim }}>{time}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP — Dashboard
// ─────────────────────────────────────────────────────────────
function DashboardDesktop({ onNav, onNavToCountry, stats, collection = {}, activityLog = [], theme, onToggleTheme, userData }) {
  const { have, total, missing, duplicates } = stats;
  const pct = ((have / total) * 100).toFixed(1);

  const topCountries = React.useMemo(() => {
    const withProgress = COUNTRIES.map(c => {
      const haveCount = Array.from({ length: c.total }, (_, i) =>
        (collection[`${c.code}${String(i + 1).padStart(2, '0')}`] || 0) > 0 ? 1 : 0
      ).reduce((a, b) => a + b, 0);
      return {
        ...c,
        have: haveCount,
        pct: c.total ? haveCount / c.total : 0,
      };
    });

    const hasAnyProgress = withProgress.some(c => c.have > 0);
    if (!hasAnyProgress) {
      return [...withProgress]
        .sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name))
        .slice(0, 6);
    }

    return [...withProgress]
      .sort((a, b) => {
        if (b.pct !== a.pct) return b.pct - a.pct;
        if (b.have !== a.have) return b.have - a.have;
        return a.group.localeCompare(b.group) || a.name.localeCompare(b.name);
      })
      .slice(0, 6);
  }, [collection]);

  const recentStickerItems = React.useMemo(() => {
    const idsFromLog = extractRecentStickerIds(activityLog);
    const fallbackIds = Object.entries(collection)
      .filter(([, qty]) => qty >= 1)
      .map(([id]) => id)
      .reverse();
    const ids = [...idsFromLog];
    for (const id of fallbackIds) {
      if (ids.length >= 3) break;
      if (!ids.includes(id)) ids.push(id);
    }
    return ids.slice(0, 3).map(id => {
      const qty = collection[id] || 1;
      const info = window.stickerInfoFromId ? window.stickerInfoFromId(id) : { num: 0, country: null, label: id };
      return { id, qty, info };
    });
  }, [activityLog, collection]);

  return (
    <DesktopShell active="home" onNav={onNav} title="Tu álbum" sub="Dashboard — temporada 2026" theme={theme} onToggleTheme={onToggleTheme} userData={userData} stats={stats}>
      <div style={{ padding: '28px 36px' }}>
        {/* Top grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 22, marginBottom: 22 }}>
          {/* Hero */}
          <div style={{
            background: SK.surface,
            border: `1px solid ${SK.gold}22`,
            borderRadius: 16,
            padding: 28,
            display: 'flex', alignItems: 'center', gap: 32,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, right: 0, background: SK.gold, color: SK.bg, fontFamily: SK.fHead, fontWeight: 700, fontSize: 11, padding: '5px 14px', borderRadius: '0 16px 0 8px', letterSpacing: 1.2 }}>MUNDIAL 2026</div>

            <div style={{ position: 'relative', width: 200, height: 200, flexShrink: 0 }}>
              <DonutProgress value={have} max={total} size={200} stroke={12}/>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontFamily: SK.fMono, fontSize: 48, fontWeight: 700, color: SK.text, letterSpacing: -1.5, lineHeight: 1 }}>{have}</div>
                <div style={{ fontFamily: SK.fMono, fontSize: 18, color: SK.textMute, marginTop: 4 }}>/ {total}</div>
                <div style={{ fontFamily: SK.fMono, fontSize: 14, color: SK.gold, fontWeight: 600, marginTop: 6 }}>{pct}%</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600 }}>tu progreso</div>
              <div style={{ fontFamily: SK.fHead, fontSize: 38, fontWeight: 700, lineHeight: 1.05, color: SK.text, marginTop: 8 }}>
                {have === 0 ? 'Empieza tu álbum' : pct >= 100 ? '¡Álbum completo!' : pct >= 75 ? '¡Casi lo tienes!' : pct >= 25 ? 'Vas por buen camino' : '¡Buen comienzo!'}
              </div>
              <div style={{ fontSize: 14, color: SK.textMute, marginTop: 12, lineHeight: 1.5, maxWidth: 360 }}>
                Te faltan <span style={{ color: SK.gold, fontWeight: 700, fontFamily: SK.fMono }}>{missing}</span> estampas para completar el álbum.
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <button onClick={() => onNav('album')} style={{
                  background: SK.gold, color: SK.bg, border: 'none',
                  padding: '10px 20px', borderRadius: 10,
                  fontFamily: SK.fHead, fontWeight: 700, fontSize: 13,
                  textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
                }}>Agregar estampas</button>
                <button onClick={() => onNav('album')} style={{
                  background: 'transparent', color: SK.text,
                  border: `1px solid ${SK.border}`,
                  padding: '10px 20px', borderRadius: 10,
                  fontFamily: SK.fHead, fontWeight: 700, fontSize: 13,
                  textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
                }}>Ver álbum</button>
              </div>
            </div>
          </div>

          {/* Stats stack */}
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr 1fr', gap: 12 }}>
            <BigStat label="Tengo" value={have} color={SK.gold} IconC={Icon.Check}/>
            <BigStat label="Faltan" value={missing} color={SK.textMute} IconC={Icon.Clock}/>
            <BigStat label="Repetidas" value={duplicates} color={SK.coral} IconC={Icon.Copy} trend={duplicates > 0 ? `${duplicates} para intercambio` : null}/>
          </div>
        </div>

        {/* Countries row */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>continúa coleccionando</div>
              <div style={{ fontFamily: SK.fHead, fontSize: 22, fontWeight: 700, color: SK.text, marginTop: 2 }}>Por selección</div>
            </div>
            <button onClick={() => onNav('album')} style={{ background: 'none', border: 'none', color: SK.gold, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600 }}>
              Ver todas ({COUNTRIES.length}) <Icon.ChevronRight s={14} c={SK.gold}/>
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
            {topCountries.map(c => <DashboardTeamCard key={c.code} country={c} onNavToCountry={onNavToCountry}/>)}
          </div>
        </div>

        {/* Activity + featured */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 22 }}>
          <div>
            <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>actividad reciente</div>
            <div style={{ fontFamily: SK.fHead, fontSize: 22, fontWeight: 700, color: SK.text, marginTop: 2, marginBottom: 12 }}>Últimos movimientos</div>
            <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, overflow: 'hidden' }}>
              {activityLog.length === 0 ? (
                <EmptyState icon="📋" title="Sin actividad" sub="Las estampas que marques aparecerán aquí"/>
              ) : activityLog.slice(0, 5).map((ev, idx, arr) => (
                <ActivityRow
                  key={`${ev.ts}-${idx}`}
                  icon={activityIcon(ev.type)}
                  text={activityText(ev)}
                  time={timeAgo(ev.ts)}
                  last={idx === arr.length - 1}
                />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>recientes</div>
            <div style={{ fontFamily: SK.fHead, fontSize: 22, fontWeight: 700, color: SK.text, marginTop: 2, marginBottom: 12 }}>Últimas marcadas</div>
            {recentStickerItems.length === 0 ? (
              <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12 }}>
                <EmptyState icon="✨" title="Sin estampas aún" sub="Marcá estampas en el Álbum"/>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {recentStickerItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <StickerCard
                      num={item.info.num || 0}
                      player={item.info.label || item.id}
                      country={item.info.country || null}
                      type={item.info.type || 'jugador'}
                      subtype={item.info.subtype}
                      state={item.qty >= 2 ? 'duplicate' : 'have'}
                      count={item.qty}
                      size="sm"
                    />
                    <div style={{
                      fontFamily: SK.fMono, fontSize: 10, color: SK.textMute,
                      textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{item.id}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DesktopShell>
  );
}

function DashboardTeamCard({ country, onNavToCountry }) {
  const pct = Math.round(((country.have || 0) / country.total) * 100);
  return (
    <button
      onClick={() => onNavToCountry?.(country.code)}
      style={{
      background: SK.surface,
      border: `1px solid ${SK.border}`,
      borderRadius: 12,
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      width: '100%',
      cursor: 'pointer',
      textAlign: 'left',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 28 }}>{country.flag}</span>
        <span style={{ fontFamily: SK.fMono, fontSize: 11, color: SK.textMute }}>
          {country.have}/{country.total}
        </span>
      </div>
      <div style={{ fontFamily: SK.fHead, fontWeight: 700, fontSize: 14, color: SK.text, textTransform: 'uppercase' }}>
        {country.name}
      </div>
      <ProgressBar value={country.have || 0} max={country.total}/>
      <div style={{ fontFamily: SK.fMono, fontSize: 11, color: SK.gold, fontWeight: 600 }}>{pct}%</div>
    </button>
  );
}

function BigStat({ label, value, color, IconC, trend }) {
  return (
    <div style={{
      background: SK.surface, border: `1px solid ${SK.border}`,
      borderRadius: 12, padding: '14px 18px',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <IconC s={18} c={color}/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>{label}</div>
        <div style={{ fontFamily: SK.fMono, fontSize: 28, fontWeight: 700, color, letterSpacing: -0.5, lineHeight: 1, marginTop: 2 }}>{value}</div>
      </div>
      <div style={{ fontFamily: SK.fBody, fontSize: 11, color: SK.textMute, textAlign: 'right', maxWidth: 100 }}>
        {trend}
      </div>
    </div>
  );
}

function EspecialesRailEntry({ active, onSelect }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button onClick={onSelect}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
      display: 'flex', alignItems: 'center', gap: 10,
      width: '100%', padding: '10px 10px',
      background: active ? `${SK.gold}18` : hov ? SK.surfaceHi : 'transparent',
      border: 'none', borderRadius: 8,
      cursor: 'pointer', textAlign: 'left',
      marginBottom: 6, position: 'relative',
      transition: 'background 0.15s ease-out',
    }}>
      {active && <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, background: SK.gold, borderRadius: 2 }}/>}
      <span style={{ fontSize: 20 }}>🏆</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: SK.fHead, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: active ? SK.gold : hov ? SK.text : SK.textMute, letterSpacing: 0.5, transition: 'color 0.15s ease-out' }}>Especiales</div>
        <div style={{ fontFamily: SK.fMono, fontSize: 10, color: SK.textMute, marginTop: 1 }}>001–020 · Copa & Sedes</div>
      </div>
    </button>
  );
}

function CocaColaRailEntry({ active, onSelect }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button onClick={onSelect}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
      display: 'flex', alignItems: 'center', gap: 10,
      width: '100%', padding: '10px 10px',
      background: active ? `${SK.gold}18` : hov ? SK.surfaceHi : 'transparent',
      border: 'none', borderRadius: 8,
      cursor: 'pointer', textAlign: 'left',
      marginBottom: 6, position: 'relative',
      transition: 'background 0.15s ease-out',
    }}>
      {active && <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, background: SK.gold, borderRadius: 2 }}/>}
      <span style={{ fontSize: 20 }}>🥤</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: SK.fHead, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: active ? SK.gold : hov ? SK.text : SK.textMute, letterSpacing: 0.5, transition: 'color 0.15s ease-out' }}>Coca-Cola</div>
        <div style={{ fontFamily: SK.fMono, fontSize: 10, color: SK.textMute, marginTop: 1 }}>CC 001–014 · Patrocinador</div>
      </div>
    </button>
  );
}

function DupConfirmModal({ sticker, qty, onConfirm, onCancel, onRemove }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
    }} onClick={onCancel}>
      <div style={{
        background: SK.surface, border: `1px solid ${SK.border}`,
        borderRadius: 16, padding: 32, maxWidth: 380, width: '90%',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontFamily: SK.fHead, fontSize: 20, fontWeight: 700, color: SK.text, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
          Agregar repetida
        </div>
        <div style={{ fontSize: 13, color: SK.textMute, marginBottom: 6, lineHeight: 1.5 }}>
          Ya tenés <span style={{ color: SK.gold, fontWeight: 700, fontFamily: SK.fMono }}>{qty}</span> de{' '}
          <span style={{ color: SK.text, fontWeight: 600 }}>#{String(sticker.num).padStart(3,'0')} {sticker.player}</span>.
        </div>
        <div style={{ fontFamily: SK.fMono, fontSize: 10, color: SK.textDim, marginBottom: 20 }}>ID: {sticker.id}</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '12px',
            background: SK.gold, color: SK.bg,
            border: 'none', borderRadius: 10,
            fontFamily: SK.fHead, fontWeight: 700, fontSize: 13,
            textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
          }}>+ Agregar repetida</button>
          <button onClick={onCancel} style={{
            flex: 1, padding: '12px',
            background: 'transparent', color: SK.text,
            border: `1px solid ${SK.border}`, borderRadius: 10,
            fontFamily: SK.fHead, fontWeight: 700, fontSize: 13,
            textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
          }}>Cancelar</button>
        </div>
        <button onClick={onRemove} style={{
          width: '100%', padding: '10px', marginTop: 8,
          background: 'transparent', color: SK.coral,
          border: `1px solid ${SK.coral}44`, borderRadius: 10,
          fontFamily: SK.fHead, fontWeight: 700, fontSize: 12,
          textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
        }}>– Quitar una</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP — Album
// ─────────────────────────────────────────────────────────────
function AlbumDesktop({ onNav, initialCountry = null, theme, onToggleTheme, collection = {}, setCollection = () => {}, onStickerChange = () => {}, userData, stats = null }) {
  const [filter, setFilter] = React.useState('Todos');
  const [activeCountry, setActiveCountry] = React.useState(initialCountry || 'MX');
  const [activeGroup, setActiveGroup] = React.useState('Todos');
  const [animateCountry, setAnimateCountry] = React.useState(false);
  const [animateFilter, setAnimateFilter] = React.useState(false);
  const [hovFilter, setHovFilter] = React.useState(null);
  const [hovCountry, setHovCountry] = React.useState(null);
  const [hovGroup, setHovGroup] = React.useState(null);
  const [dupModal, setDupModal] = React.useState(null);

  const haveByCountry = React.useMemo(() => {
    const map = {};
    COUNTRIES.forEach(c => {
      map[c.code] = Array.from({ length: 20 }, (_, i) =>
        (collection[`${c.code}${String(i + 1).padStart(2, '0')}`] || 0) > 0 ? 1 : 0
      ).reduce((a, b) => a + b, 0);
    });
    return map;
  }, [collection]);

  const GROUPS = ['Todos', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  const visibleCountries = activeGroup === 'Todos'
    ? COUNTRIES
    : COUNTRIES.filter(c => c.group === activeGroup);

  const isEspeciales = activeCountry === '__especiales__';
  const isCoca = activeCountry === '__coca_cola__';
  const country = (!isEspeciales && !isCoca)
    ? (COUNTRIES.find(c => c.code === activeCountry) || COUNTRIES[0])
    : { flag: isCoca ? '🥤' : '🏆', name: isCoca ? 'Coca-Cola' : 'Copa & Sedes 2026', total: isCoca ? 14 : 20, group: isCoca ? 'CC' : 'FWC', color: isCoca ? '#F40009' : SK.gold };
  const stickers = isEspeciales
    ? specialStickers()
    : isCoca
    ? ccStickers()
    : stickersFor(country);

  const getQty = (s) => s.id in collection ? collection[s.id] : 0;

  const handleStickerClick = (s) => {
    const qty = getQty(s);
    if (qty === 0) {
      setCollection(prev => ({ ...prev, [s.id]: 1 }));
      onStickerChange(s.id, 1);
    } else {
      setDupModal(s);
    }
  };

  const handleAddDuplicate = () => {
    const nextQty = (collection[dupModal.id] ?? getQty(dupModal)) + 1;
    setCollection(prev => ({ ...prev, [dupModal.id]: nextQty }));
    onStickerChange(dupModal.id, nextQty);
    setDupModal(null);
  };

  const handleRemoveOne = () => {
    const current = dupModal.id in collection ? collection[dupModal.id] : getQty(dupModal);
    const nextQty = Math.max(0, current - 1);
    setCollection(prev => ({ ...prev, [dupModal.id]: nextQty }));
    onStickerChange(dupModal.id, nextQty);
    setDupModal(null);
  };

  const mergedStickers = stickers.map(s => {
    const qty = s.id in collection ? collection[s.id] : 0;
    return { ...s, state: qty === 0 ? 'missing' : qty === 1 ? 'have' : 'duplicate', count: qty };
  });

  const filterFn = (s) => {
    if (filter === 'Tengo') return s.state === 'have' || s.state === 'duplicate';
    if (filter === 'Falta') return s.state === 'missing';
    if (filter === 'Repetidas') return s.state === 'duplicate';
    return true;
  };

  const filtered = mergedStickers.filter(filterFn);
  const activeHave = React.useMemo(
    () => mergedStickers.reduce((acc, s) => acc + (s.count > 0 ? 1 : 0), 0),
    [mergedStickers]
  );
  const activeDuplicates = React.useMemo(
    () => mergedStickers.reduce((acc, s) => acc + (s.count >= 2 ? 1 : 0), 0),
    [mergedStickers]
  );

  const handleGroupChange = (g) => {
    setActiveGroup(g);
    const first = g === 'Todos' ? COUNTRIES[0] : COUNTRIES.find(c => c.group === g);
    if (first) setActiveCountry(first.code);
  };

  React.useEffect(() => {
    setAnimateCountry(true);
    const id = setTimeout(() => setAnimateCountry(false), 180);
    return () => clearTimeout(id);
  }, [activeCountry]);

  React.useEffect(() => {
    setAnimateFilter(true);
    const id = setTimeout(() => setAnimateFilter(false), 160);
    return () => clearTimeout(id);
  }, [filter]);

  React.useEffect(() => {
    if (initialCountry) setActiveCountry(initialCountry);
  }, [initialCountry]);

  return (
    <DesktopShell active="album" onNav={onNav} title="Álbum" sub="Colección completa · 980 estampas · 12 grupos" theme={theme} onToggleTheme={onToggleTheme} userData={userData} stats={stats}>
      <div style={{ display: 'flex', height: '100%' }}>
        {/* Country rail */}
        <div style={{
          width: 240, flexShrink: 0,
          borderRight: `1px solid ${SK.border}`,
          padding: '16px 12px', overflow: 'auto',
          display: 'flex', flexDirection: 'column', gap: 0,
        }}>
          {/* Group filter */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600, padding: '0 8px 8px' }}>Grupo</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '0 4px' }}>
              {GROUPS.map(g => {
                const on = activeGroup === g;
                const hov = !on && hovGroup === g;
                return (
                  <button key={g} onClick={() => handleGroupChange(g)}
                    onMouseEnter={() => setHovGroup(g)}
                    onMouseLeave={() => setHovGroup(null)}
                    style={{
                    padding: '4px 8px',
                    background: on ? SK.gold : hov ? SK.surfaceHi : SK.bgSoft,
                    color: on ? SK.bg : hov ? SK.text : SK.textMute,
                    border: `1px solid ${on ? SK.gold : hov ? SK.textDim : SK.border}`,
                    borderRadius: 6,
                    fontFamily: SK.fMono, fontSize: 11, fontWeight: on ? 700 : 500,
                    cursor: 'pointer',
                    minWidth: 32, textAlign: 'center',
                transition: 'background 0.15s ease-out, color 0.15s ease-out, border-color 0.15s ease-out, transform 0.15s ease-out, box-shadow 0.15s ease-out',
                transform: on ? 'scale(1.03)' : hov ? 'translateY(-1px)' : 'none',
                boxShadow: on ? `0 6px 14px -10px ${SK.gold}88` : hov ? '0 6px 14px -12px rgba(0,0,0,0.6)' : 'none',
              }}>{g === 'Todos' ? 'All' : g}</button>
              );
            })}
          </div>
        </div>

          <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600, padding: '0 8px 8px' }}>
            Selecciones {activeGroup !== 'Todos' ? `· Grupo ${activeGroup}` : `· ${COUNTRIES.length}`}
          </div>

          {/* Especiales entry */}
          {activeGroup === 'Todos' && <EspecialesRailEntry active={activeCountry === '__especiales__'} onSelect={() => setActiveCountry('__especiales__')}/>}

          {visibleCountries.map(c => {
            const on = c.code === activeCountry;
            const hov = !on && hovCountry === c.code;
            const haveCount = haveByCountry[c.code] ?? c.have;
            const pct = Math.round((haveCount / c.total) * 100);
            return (
              <button key={c.code} onClick={() => setActiveCountry(c.code)}
                onMouseEnter={() => setHovCountry(c.code)}
                onMouseLeave={() => setHovCountry(null)}
                style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '10px 10px',
                background: on ? `${SK.gold}18` : hov ? SK.surfaceHi : 'transparent',
                border: 'none', borderRadius: 8,
                cursor: 'pointer', textAlign: 'left',
                color: on ? SK.text : hov ? SK.text : SK.textMute,
                marginBottom: 2,
                position: 'relative',
                transition: 'background 0.15s ease-out, color 0.15s ease-out, transform 0.15s ease-out, box-shadow 0.15s ease-out',
                transform: on ? 'translateX(2px)' : hov ? 'translateX(2px)' : 'none',
                boxShadow: on ? `0 6px 14px -10px ${SK.gold}66` : hov ? '0 6px 14px -12px rgba(0,0,0,0.6)' : 'none',
              }}>
                {on && <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, background: SK.gold, borderRadius: 2 }}/>}
                <span style={{ fontSize: 20 }}>{c.flag}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: SK.fHead, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: on ? SK.text : hov ? SK.text : SK.textMute, letterSpacing: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'color 0.15s ease-out' }}>{c.name}</div>
                  <div style={{ fontFamily: SK.fMono, fontSize: 10, color: SK.textMute, marginTop: 1 }}>{haveCount}/{c.total} · {pct}%</div>
                </div>
                <div style={{ fontFamily: SK.fMono, fontSize: 9, color: SK.textDim, fontWeight: 700, flexShrink: 0 }}>
                  {c.group}
                </div>
              </button>
            );
          })}

          {/* CC Coca-Cola entry — last section */}
          {activeGroup === 'Todos' && <CocaColaRailEntry active={isCoca} onSelect={() => setActiveCountry('__coca_cola__')}/>}
        </div>

        {/* Main */}
          <div style={{
            flex: 1, padding: 28, overflow: 'auto',
            transform: animateCountry ? 'translateY(2px)' : 'none',
            opacity: animateCountry ? 0.94 : 1,
            transition: 'transform 0.2s ease, opacity 0.2s ease',
          }}>
          {/* Country header */}
          <div style={{
            background: SK.surface, border: `1px solid ${SK.border}`,
            borderRadius: 16, padding: 22, marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 20,
          }}>
            <div style={{ fontSize: 64 }}>{country.flag}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>
                {isEspeciales ? 'FWC · 000–019' : isCoca ? 'CC · 001–014 · Patrocinador' : `Grupo ${country.group} · Selección`}
              </div>
              <div style={{ fontFamily: SK.fHead, fontSize: 34, fontWeight: 700, color: SK.text, textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: 1.05 }}>
                {country.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, maxWidth: 420 }}>
                <ProgressBar value={activeHave} max={country.total} height={6}/>
                <span style={{ fontFamily: SK.fMono, fontSize: 14, color: SK.gold, fontWeight: 700, minWidth: 60, textAlign: 'right' }}>
                  {activeHave}/{country.total}
                </span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 18 }}>
              {[
                { l: 'Tengo', v: activeHave, c: SK.gold },
                { l: 'Faltan', v: country.total - activeHave, c: SK.textMute },
                { l: 'Repetidas', v: activeDuplicates, c: SK.coral },
              ].map(s => (
                <div key={s.l} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: SK.fMono, fontSize: 22, fontWeight: 700, color: s.c, lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {['Todos', 'Tengo', 'Falta', 'Repetidas', 'Especiales'].map(f => {
              const on = filter === f;
              const hov = !on && hovFilter === f;
              return (
                <button key={f} onClick={() => setFilter(f)}
                  onMouseEnter={() => setHovFilter(f)}
                  onMouseLeave={() => setHovFilter(null)}
                  style={{
                  padding: '8px 16px',
                  background: on ? SK.gold : hov ? SK.surfaceHi : 'transparent',
                  color: on ? SK.bg : hov ? SK.text : SK.textMute,
                  border: on ? 'none' : `1px solid ${hov ? SK.textDim : SK.border}`,
                  borderRadius: 20,
                  fontFamily: SK.fBody, fontSize: 12, fontWeight: on ? 700 : 500,
                  cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: 0.5,
                  transition: 'background 0.15s ease-out, color 0.15s ease-out, border-color 0.15s ease-out, transform 0.15s ease-out, box-shadow 0.15s ease-out',
                  transform: on ? 'scale(1.03)' : hov ? 'translateY(-1px)' : 'none',
                  boxShadow: on ? `0 6px 14px -10px ${SK.gold}88` : hov ? '0 6px 14px -12px rgba(0,0,0,0.6)' : 'none',
                }}>{f}</button>
              );
            })}
          </div>

          {/* Grid — 6 cols desktop, or empty state */}
          {filtered.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '60px 20px', gap: 14,
            }}>
              <div style={{ fontSize: 48, lineHeight: 1 }}>
                {filter === 'Repetidas' ? '📦' : filter === 'Falta' ? '🏆' : '🔍'}
              </div>
              <div style={{ fontFamily: SK.fHead, fontSize: 22, fontWeight: 700, color: SK.text, textAlign: 'center' }}>
                {filter === 'Repetidas' && 'Sin repetidas aquí'}
                {filter === 'Falta' && '¡Colección completa!'}
                {filter !== 'Repetidas' && filter !== 'Falta' && 'Sin estampas para mostrar'}
              </div>
              <div style={{ fontFamily: SK.fBody, fontSize: 13, color: SK.textMute, textAlign: 'center', maxWidth: 320, lineHeight: 1.5 }}>
                {filter === 'Repetidas' && `No tienes repetidas de ${country.name}. ¡Buen trabajo!`}
                {filter === 'Falta' && `Tienes todas las estampas de ${country.name}.`}
                {filter !== 'Repetidas' && filter !== 'Falta' && 'Prueba con otro filtro o selecciona otro país.'}
              </div>
              {filter !== 'Todos' && (
                <button onClick={() => setFilter('Todos')} style={{
                  padding: '10px 22px',
                  background: SK.gold, color: SK.bg,
                  border: 'none', borderRadius: 10,
                  fontFamily: SK.fHead, fontWeight: 700, fontSize: 12,
                  textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
                  marginTop: 4,
                }}>Ver todas las estampas</button>
              )}
            </div>
          ) : (
           <div style={{
             display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12,
             transform: animateFilter ? 'scale(0.99)' : 'none',
             opacity: animateFilter ? 0.96 : 1,
             transition: 'transform 0.2s ease, opacity 0.2s ease',
           }}>
            {filtered.map(s => <StickerCard key={s.id || s.num} {...s} size="md" onClick={() => handleStickerClick(s)}/>)}
          </div>
          )}
        </div>
      </div>
      {dupModal && (
        <DupConfirmModal
          sticker={dupModal}
          qty={getQty(dupModal)}
          onConfirm={handleAddDuplicate}
          onCancel={() => setDupModal(null)}
          onRemove={handleRemoveOne}
        />
      )}
    </DesktopShell>
  );
}

Object.assign(window, { DashboardDesktop, AlbumDesktop, AdminDesktop, DesktopShell, DESKTOP_W, DESKTOP_H });
