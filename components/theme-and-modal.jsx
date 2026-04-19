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
// Desktop topbar V2 — with theme toggle
// ─────────────────────────────────────────────────────────────
function DesktopTopbarV2({ title, sub, theme, onToggleTheme }) {
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
          width: 260,
        }}>
          <Icon.Search s={16} c={SK.textMute}/>
          <input placeholder="Buscar estampas..." style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            color: SK.text, fontFamily: SK.fBody, fontSize: 13,
          }}/>
          <span style={{
            fontFamily: SK.fMono, fontSize: 10, color: SK.textDim,
            background: SK.bgSoft, padding: '2px 6px', borderRadius: 4,
            border: `1px solid ${SK.border}`,
          }}>⌘K</span>
        </div>

        <ThemeToggle theme={theme} onToggle={onToggleTheme}/>

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
            background: SK.gold, color: theme === 'dark' ? SK.bg : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: SK.fHead, fontSize: 12, fontWeight: 700,
          }}>AM</div>
          <span style={{ fontSize: 13, fontWeight: 500, color: SK.text }}>Alex</span>
        </div>
      </div>
    </div>
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
function EditProfileModal({ open, onClose }) {
  const [name, setName] = React.useState('Alex Moreno');
  const [username, setUsername] = React.useState('alex_stickio');
  const [bio, setBio] = React.useState('Coleccionando desde marzo 2026. Especialidad en selecciones de CONMEBOL.');
  const [location, setLocation] = React.useState('Ciudad de México');
  const [email, setEmail] = React.useState('alex.moreno@example.com');
  const [avatar, setAvatar] = React.useState('AM');
  const [privacy, setPrivacy] = React.useState('public');
  const [notifs, setNotifs] = React.useState(true);
  const [focus, setFocus] = React.useState(null);

  const avatarOptions = ['AM', 'A!', 'AX', '⚽', '★', '♦'];

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
                <button style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: SK.bgSoft,
                  border: `1px dashed ${SK.border}`,
                  color: SK.textMute,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
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
                  value={username} onChange={e => setUsername(e.target.value.replace(/\s/g, '_').toLowerCase())}
                  onFocus={() => setFocus('username')} onBlur={() => setFocus(null)}
                  style={{ ...inputStyle('username'), paddingLeft: 28, fontFamily: SK.fMono }}
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Biografía</label>
            <textarea
              value={bio} onChange={e => setBio(e.target.value)}
              onFocus={() => setFocus('bio')} onBlur={() => setFocus(null)}
              rows={3}
              style={{ ...inputStyle('bio'), resize: 'vertical', minHeight: 72, fontFamily: SK.fBody, lineHeight: 1.5 }}
            />
            <div style={{
              fontFamily: SK.fMono, fontSize: 11, color: SK.textDim, marginTop: 4, textAlign: 'right',
            }}>{bio.length} / 160</div>
          </div>

          {/* Location + Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
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
                value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocus('email')} onBlur={() => setFocus(null)}
                style={inputStyle('email')}
              />
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
          <button style={{
            background: 'none', border: 'none',
            color: SK.coral, fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: SK.fBody,
            textTransform: 'uppercase', letterSpacing: 0.8,
          }}>Cerrar sesión</button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{
              padding: '10px 20px',
              background: 'transparent', color: SK.text,
              border: `1px solid ${SK.border}`, borderRadius: 10,
              fontFamily: SK.fHead, fontWeight: 700, fontSize: 12,
              textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
            }}>Cancelar</button>
            <button onClick={onClose} style={{
              padding: '10px 22px',
              background: SK.gold, color: SK.bg,
              border: 'none', borderRadius: 10,
              fontFamily: SK.fHead, fontWeight: 700, fontSize: 12,
              textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
              boxShadow: `0 4px 14px -4px ${SK.goldDeep}`,
            }}>Guardar cambios</button>
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
