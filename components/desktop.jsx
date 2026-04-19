// Desktop screens — 1440px wide

const DESKTOP_W = 1440;
const DESKTOP_H = 900;
window.DESKTOP_W = DESKTOP_W;
window.DESKTOP_H = DESKTOP_H;

// Sidebar
function DesktopSidebar({ active, onNav }) {
  const items = [
    { id: 'home', label: 'Inicio', Icon: Icon.Home },
    { id: 'album', label: 'Álbum', Icon: Icon.Grid },
    { id: 'trade', label: 'Intercambios', Icon: Icon.Swap },
    { id: 'profile', label: 'Perfil', Icon: Icon.User },
  ];
  return (
    <div style={{
      width: 240, flexShrink: 0,
      background: SK.surface,
      borderRight: `1px solid ${SK.border}`,
      padding: '28px 20px',
      display: 'flex', flexDirection: 'column',
      height: '100%',
    }}>
      <div style={{ marginBottom: 36 }}>
        <Logo size={28}/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map(it => {
          const on = active === it.id;
          return (
            <button key={it.id} onClick={() => onNav(it.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px',
              background: on ? `${SK.gold}18` : 'transparent',
              border: 'none', borderRadius: 10,
              color: on ? SK.gold : SK.textMute,
              fontFamily: SK.fBody, fontSize: 14, fontWeight: on ? 700 : 500,
              cursor: 'pointer', textAlign: 'left',
              textTransform: 'uppercase', letterSpacing: 0.8,
              position: 'relative',
            }}>
              {on && <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, background: SK.gold, borderRadius: 2 }}/>}
              <it.Icon s={18} c={on ? SK.gold : SK.textMute} filled={on}/>
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
          <div style={{ fontFamily: SK.fMono, fontSize: 18, fontWeight: 700, color: SK.gold, marginBottom: 6 }}>247/980</div>
          <ProgressBar value={247} max={980} height={3}/>
        </div>
      </div>
    </div>
  );
}

function DesktopTopbar({ title, sub }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '22px 36px',
      borderBottom: `1px solid ${SK.border}`,
    }}>
      <div>
        <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>{sub}</div>
        <div style={{ fontFamily: SK.fHead, fontSize: 28, fontWeight: 700, color: SK.text, marginTop: 2 }}>{title}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          background: SK.surface, border: `1px solid ${SK.border}`,
          borderRadius: 10, padding: '9px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          width: 280,
        }}>
          <Icon.Search s={16} c={SK.textMute}/>
          <input placeholder="Buscar estampas..." style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            color: SK.text, fontFamily: SK.fBody, fontSize: 13,
          }}/>
          <span style={{ fontFamily: SK.fMono, fontSize: 10, color: SK.textDim, background: SK.bgSoft, padding: '2px 6px', borderRadius: 4, border: `1px solid ${SK.border}` }}>⌘K</span>
        </div>
        <button style={{
          background: SK.surface, border: `1px solid ${SK.border}`,
          width: 40, height: 40, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', cursor: 'pointer',
        }}>
          <Icon.Bell s={18} c={SK.text}/>
          <div style={{
            position: 'absolute', top: -2, right: -2,
            background: SK.coral, color: '#fff',
            fontSize: 10, fontFamily: SK.fMono, fontWeight: 700,
            minWidth: 18, height: 18, borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>3</div>
        </button>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: SK.surface, border: `1px solid ${SK.border}`,
          padding: '6px 14px 6px 6px', borderRadius: 24,
          cursor: 'pointer',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 14,
            background: SK.gold, color: SK.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: SK.fHead, fontSize: 12, fontWeight: 700,
          }}>AM</div>
          <span style={{ fontSize: 13, fontWeight: 500, color: SK.text }}>Alex</span>
        </div>
      </div>
    </div>
  );
}

function DesktopShell({ children, active, onNav, title, sub }) {
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
        <DesktopTopbar title={title} sub={sub}/>
        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP — Dashboard
// ─────────────────────────────────────────────────────────────
function DashboardDesktop({ onNav, stats }) {
  const { have, total, missing, duplicates } = stats;
  const pct = ((have / total) * 100).toFixed(1);

  return (
    <DesktopShell active="home" onNav={onNav} title="Tu álbum" sub="Dashboard — temporada 2026">
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
            <div style={{ position: 'absolute', top: 0, right: 0, background: SK.gold, color: SK.bg, fontFamily: SK.fHead, fontWeight: 700, fontSize: 11, padding: '5px 14px', borderRadius: '0 16px 0 8px', letterSpacing: 1.2 }}>TEMPORADA 26</div>

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
                Vas por buen camino
              </div>
              <div style={{ fontSize: 14, color: SK.textMute, marginTop: 12, lineHeight: 1.5, maxWidth: 360 }}>
                Te faltan <span style={{ color: SK.gold, fontWeight: 700, fontFamily: SK.fMono }}>{missing}</span> estampas para completar el álbum. Tu ritmo: <span style={{ color: SK.text, fontWeight: 600 }}>8 por semana</span>.
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <button style={{
                  background: SK.gold, color: SK.bg, border: 'none',
                  padding: '10px 20px', borderRadius: 10,
                  fontFamily: SK.fHead, fontWeight: 700, fontSize: 13,
                  textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
                }}>Agregar estampas</button>
                <button style={{
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
            <BigStat label="Tengo" value={have} color={SK.gold} IconC={Icon.Check} trend="+12 esta semana"/>
            <BigStat label="Faltan" value={missing} color={SK.textMute} IconC={Icon.Clock} trend="-12 vs semana pasada"/>
            <BigStat label="Repetidas" value={duplicates} color={SK.coral} IconC={Icon.Copy} trend="23 listas para trade"/>
          </div>
        </div>

        {/* Countries row */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>continúa coleccionando</div>
              <div style={{ fontFamily: SK.fHead, fontSize: 22, fontWeight: 700, color: SK.text, marginTop: 2 }}>Por selección</div>
            </div>
            <button style={{ background: 'none', border: 'none', color: SK.gold, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600 }}>
              Ver todas (48) <Icon.ChevronRight s={14} c={SK.gold}/>
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
            {COUNTRIES.slice(0, 6).map(c => <TeamCard key={c.code} country={c}/>)}
          </div>
        </div>

        {/* Activity + featured */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 22 }}>
          <div>
            <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>actividad reciente</div>
            <div style={{ fontFamily: SK.fHead, fontSize: 22, fontWeight: 700, color: SK.text, marginTop: 2, marginBottom: 12 }}>Últimos movimientos</div>
            <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <ActivityRow icon="check" text={<span>Añadiste <b style={{ color: SK.text }}>#042 Delantero A</b> (🇲🇽 México)</span>} time="hace 2h"/>
              <ActivityRow icon="swap"  text={<span>Intercambio completado con <b style={{ color: SK.text }}>@carlos_mx</b> · 3 estampas</span>} time="ayer"/>
              <ActivityRow icon="trophy" text={<span>Desbloqueaste el logro <b style={{ color: SK.text }}>25% completado</b></span>} time="2d"/>
              <ActivityRow icon="dup" text={<span>Repetida detectada: <b style={{ color: SK.text }}>#118 Mediocampista B</b></span>} time="3d"/>
              <ActivityRow icon="check" text={<span>Añadiste <b style={{ color: SK.text }}>#207 Portero C</b> (🇦🇷 Argentina)</span>} time="5d" last/>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>destacadas</div>
            <div style={{ fontFamily: SK.fHead, fontSize: 22, fontWeight: 700, color: SK.text, marginTop: 2, marginBottom: 12 }}>Foil de la semana</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[{ num: 1, c: COUNTRIES[0] }, { num: 2, c: COUNTRIES[3] }, { num: 3, c: COUNTRIES[1] }].map(f => (
                <FoilSticker key={f.num} num={f.num} country={f.c}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DesktopShell>
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
  return (
    <button onClick={onSelect} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      width: '100%', padding: '10px 10px',
      background: active ? `${SK.gold}18` : 'transparent',
      border: 'none', borderRadius: 8,
      cursor: 'pointer', textAlign: 'left',
      marginBottom: 6, position: 'relative',
    }}>
      {active && <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, background: SK.gold, borderRadius: 2 }}/>}
      <span style={{ fontSize: 20 }}>🏆</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: SK.fHead, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: active ? SK.gold : SK.textMute, letterSpacing: 0.5 }}>Especiales</div>
        <div style={{ fontFamily: SK.fMono, fontSize: 10, color: SK.textMute, marginTop: 1 }}>001–020 · Copa & Sedes</div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP — Album
// ─────────────────────────────────────────────────────────────
function AlbumDesktop({ onNav }) {
  const [filter, setFilter] = React.useState('Todos');
  const [activeCountry, setActiveCountry] = React.useState('MX');
  const [activeGroup, setActiveGroup] = React.useState('Todos');

  const GROUPS = ['Todos', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  const visibleCountries = activeGroup === 'Todos'
    ? COUNTRIES
    : COUNTRIES.filter(c => c.group === activeGroup);

  const country = COUNTRIES.find(c => c.code === activeCountry) || COUNTRIES[0];
  // 001-020 reserved for speciales; country stickers start at 21
  const countryIndex = COUNTRIES.findIndex(c => c.code === activeCountry);
  const startNum = 21 + countryIndex * 20;
  const stickers = activeCountry === '__especiales__'
    ? specialStickers()
    : stickersFor(country, startNum);

  const filterFn = (s) => {
    if (filter === 'Tengo') return s.state === 'have' || s.state === 'duplicate';
    if (filter === 'Falta') return s.state === 'missing';
    if (filter === 'Repetidas') return s.state === 'duplicate';
    return true;
  };

  const filtered = stickers.filter(filterFn);

  const handleGroupChange = (g) => {
    setActiveGroup(g);
    const first = g === 'Todos' ? COUNTRIES[0] : COUNTRIES.find(c => c.group === g);
    if (first) setActiveCountry(first.code);
  };

  return (
    <DesktopShell active="album" onNav={onNav} title="Álbum" sub="Colección completa · 980 estampas · 12 grupos">
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
                return (
                  <button key={g} onClick={() => handleGroupChange(g)} style={{
                    padding: '4px 8px',
                    background: on ? SK.gold : SK.bgSoft,
                    color: on ? SK.bg : SK.textMute,
                    border: `1px solid ${on ? SK.gold : SK.border}`,
                    borderRadius: 6,
                    fontFamily: SK.fMono, fontSize: 11, fontWeight: on ? 700 : 500,
                    cursor: 'pointer',
                    minWidth: 32, textAlign: 'center',
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
            const pct = Math.round((c.have / c.total) * 100);
            return (
              <button key={c.code} onClick={() => setActiveCountry(c.code)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '10px 10px',
                background: on ? `${SK.gold}18` : 'transparent',
                border: 'none', borderRadius: 8,
                cursor: 'pointer', textAlign: 'left',
                color: on ? SK.text : SK.textMute,
                marginBottom: 2,
                position: 'relative',
              }}>
                {on && <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, background: SK.gold, borderRadius: 2 }}/>}
                <span style={{ fontSize: 20 }}>{c.flag}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: SK.fHead, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: on ? SK.text : SK.textMute, letterSpacing: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                  <div style={{ fontFamily: SK.fMono, fontSize: 10, color: SK.textMute, marginTop: 1 }}>{c.have}/{c.total} · {pct}%</div>
                </div>
                <div style={{ fontFamily: SK.fMono, fontSize: 9, color: SK.textDim, fontWeight: 700, flexShrink: 0 }}>
                  {c.group}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: 28, overflow: 'auto' }}>
          {/* Country header */}
          <div style={{
            background: SK.surface, border: `1px solid ${SK.border}`,
            borderRadius: 16, padding: 22, marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 20,
          }}>
            <div style={{ fontSize: 64 }}>{country.flag}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>
                {activeCountry === '__especiales__' ? 'Estampas · 001–020' : `Grupo ${country.group} · Selección`}
              </div>
              <div style={{ fontFamily: SK.fHead, fontSize: 34, fontWeight: 700, color: SK.text, textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: 1.05 }}>
                {activeCountry === '__especiales__' ? 'Copa & Sedes 2026' : country.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, maxWidth: 420 }}>
                <ProgressBar value={country.have} max={country.total} height={6}/>
                <span style={{ fontFamily: SK.fMono, fontSize: 14, color: SK.gold, fontWeight: 700, minWidth: 60, textAlign: 'right' }}>
                  {country.have}/{country.total}
                </span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 18 }}>
              {[
                { l: 'Tengo', v: country.have, c: SK.gold },
                { l: 'Faltan', v: country.total - country.have, c: SK.textMute },
                { l: 'Repetidas', v: 2, c: SK.coral },
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
              return (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '8px 16px',
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

          {/* Grid — 6 cols desktop */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
            {filtered.map(s => <StickerCard key={s.num} {...s} size="md"/>)}
          </div>
        </div>
      </div>
    </DesktopShell>
  );
}

Object.assign(window, { DashboardDesktop, AlbumDesktop, DesktopShell, DESKTOP_W, DESKTOP_H });
