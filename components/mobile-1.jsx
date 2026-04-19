// Mobile screens — 390x844

const MOBILE_W = 390;
const MOBILE_H = 844;
window.MOBILE_W = MOBILE_W;
window.MOBILE_H = MOBILE_H;

// ─────────────────────────────────────────────────────────────
// Status bar (mobile chrome)
// ─────────────────────────────────────────────────────────────
function MobileStatus() {
  return (
    <div style={{
      height: 44, padding: '0 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: SK.fBody, fontSize: 15, fontWeight: 600, color: SK.text,
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: SK.fMono }}>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="18" height="12" viewBox="0 0 18 12"><path fill={SK.text} d="M1 8h2v3H1zM5 6h2v5H5zM9 4h2v7H9zM13 2h2v9h-2z"/></svg>
        <svg width="16" height="11" viewBox="0 0 16 11"><path fill={SK.text} d="M8 2.7a6.5 6.5 0 0 1 4.6 1.9l1.2-1.3a8.1 8.1 0 0 0-11.6 0l1.2 1.3A6.5 6.5 0 0 1 8 2.7zm0 3.2a3.3 3.3 0 0 1 2.3 1l1.2-1.3a5 5 0 0 0-7 0l1.2 1.3A3.3 3.3 0 0 1 8 5.9zm0 3.2a1.4 1.4 0 0 0-1 .4l1 1 1-1a1.4 1.4 0 0 0-1-.4z"/></svg>
        <svg width="26" height="12" viewBox="0 0 26 12">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke={SK.text} opacity="0.4"/>
          <rect x="2" y="2" width="18" height="8" rx="1.5" fill={SK.text}/>
          <rect x="23" y="4" width="2" height="4" rx="0.5" fill={SK.text} opacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom nav
// ─────────────────────────────────────────────────────────────
function BottomNav({ active, onNav }) {
  const items = [
    { id: 'home', label: 'Inicio', Icon: Icon.Home },
    { id: 'album', label: 'Álbum', Icon: Icon.Grid },
    { id: 'trade', label: 'Trade', Icon: Icon.Swap },
    { id: 'profile', label: 'Perfil', Icon: Icon.User },
  ];
  return (
    <div style={{
      flexShrink: 0,
      background: SK.surface,
      borderTop: `1px solid ${SK.border}`,
      paddingBottom: 18,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 12px 6px' }}>
        {items.map(it => {
          const on = active === it.id;
          const c = on ? SK.gold : SK.textMute;
          return (
            <button key={it.id} onClick={() => onNav(it.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '6px 12px',
            }}>
              <it.Icon s={22} c={c} filled={on}/>
              <span style={{
                fontFamily: SK.fBody, fontSize: 10, fontWeight: on ? 700 : 500,
                color: c, letterSpacing: 0.3, textTransform: 'uppercase',
              }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Phone shell — puts content inside a device frame
// ─────────────────────────────────────────────────────────────
function PhoneShell({ children, showNav = true, active, onNav, noStatus = false }) {
  return (
    <div style={{
      width: MOBILE_W, height: MOBILE_H,
      background: SK.bg,
      backgroundImage: HEX_PATTERN,
      display: 'flex', flexDirection: 'column',
      color: SK.text, fontFamily: SK.fBody,
      overflow: 'hidden',
      position: 'relative',
    }}>
      {!noStatus && <MobileStatus/>}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      {showNav && <BottomNav active={active} onNav={onNav}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 1 — Login
// ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const [focus, setFocus] = React.useState(null);

  return (
    <PhoneShell showNav={false}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '40px 28px 28px',
        alignItems: 'center', justifyContent: 'center', gap: 28,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <LogoMark size={52}/>
          </div>
          <div style={{
            fontFamily: SK.fHead, fontWeight: 700, fontSize: 42, color: SK.text,
            letterSpacing: 0.5, textTransform: 'lowercase', lineHeight: 1,
          }}>stickio</div>
          <div style={{
            fontFamily: SK.fBody, fontSize: 14, color: SK.textMute,
            marginTop: 10, letterSpacing: 0.2,
          }}>Tu álbum, organizado.</div>
        </div>

        {/* Form */}
        <div style={{
          width: '100%',
          background: SK.surface,
          border: `1px solid ${SK.border}`,
          borderRadius: 16,
          padding: 22,
        }}>
          {/* Email */}
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <label style={{
              position: 'absolute', left: 14,
              top: (focus === 'email' || email) ? 6 : 18,
              fontSize: (focus === 'email' || email) ? 10 : 14,
              color: focus === 'email' ? SK.gold : SK.textMute,
              fontFamily: SK.fBody, fontWeight: 500,
              transition: 'all 0.15s', pointerEvents: 'none',
              textTransform: (focus === 'email' || email) ? 'uppercase' : 'none',
              letterSpacing: (focus === 'email' || email) ? 0.8 : 0,
            }}>Email</label>
            <input
              value={email} onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocus('email')} onBlur={() => setFocus(null)}
              style={{
                width: '100%',
                background: SK.bgSoft,
                border: `1px solid ${focus === 'email' ? SK.gold : SK.border}`,
                borderRadius: 8,
                padding: '22px 14px 8px',
                fontFamily: SK.fBody, fontSize: 14, color: SK.text,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          {/* Password */}
          <div style={{ marginBottom: 18, position: 'relative' }}>
            <label style={{
              position: 'absolute', left: 14,
              top: (focus === 'pwd' || pwd) ? 6 : 18,
              fontSize: (focus === 'pwd' || pwd) ? 10 : 14,
              color: focus === 'pwd' ? SK.gold : SK.textMute,
              fontFamily: SK.fBody, fontWeight: 500,
              transition: 'all 0.15s', pointerEvents: 'none',
              textTransform: (focus === 'pwd' || pwd) ? 'uppercase' : 'none',
              letterSpacing: (focus === 'pwd' || pwd) ? 0.8 : 0,
            }}>Contraseña</label>
            <input
              type="password"
              value={pwd} onChange={e => setPwd(e.target.value)}
              onFocus={() => setFocus('pwd')} onBlur={() => setFocus(null)}
              style={{
                width: '100%',
                background: SK.bgSoft,
                border: `1px solid ${focus === 'pwd' ? SK.gold : SK.border}`,
                borderRadius: 8,
                padding: '22px 14px 8px',
                fontFamily: SK.fBody, fontSize: 14, color: SK.text,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* CTA */}
          <button onClick={onLogin} style={{
            width: '100%', padding: '14px 0',
            background: SK.gold, color: SK.bg,
            border: 'none', borderRadius: 10,
            fontFamily: SK.fHead, fontWeight: 700, fontSize: 16,
            textTransform: 'uppercase', letterSpacing: 1.2,
            cursor: 'pointer',
            boxShadow: `0 4px 14px -4px ${SK.goldDeep}`,
          }}>Entrar</button>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            margin: '18px 0 14px',
          }}>
            <div style={{ flex: 1, height: 1, background: SK.border }}/>
            <span style={{ fontSize: 10, color: SK.textMute, fontFamily: SK.fBody, letterSpacing: 1, textTransform: 'uppercase' }}>o continúa con</span>
            <div style={{ flex: 1, height: 1, background: SK.border }}/>
          </div>

          <button onClick={onLogin} style={{
            width: '100%', padding: '12px 0',
            background: 'transparent', color: SK.text,
            border: `1px solid ${SK.border}`, borderRadius: 10,
            fontFamily: SK.fBody, fontWeight: 500, fontSize: 14,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <Icon.Google s={18}/>
            Continuar con Google
          </button>
        </div>

        <div style={{ fontSize: 13, color: SK.textMute, fontFamily: SK.fBody }}>
          ¿No tienes cuenta? <span style={{ color: SK.gold, fontWeight: 600, cursor: 'pointer' }}>Regístrate</span>
        </div>
      </div>
    </PhoneShell>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 2 — Dashboard
// ─────────────────────────────────────────────────────────────
function DashboardScreen({ onNav, stats }) {
  const { have, total, missing, duplicates } = stats;
  const pct = ((have / total) * 100).toFixed(1);

  return (
    <PhoneShell active="home" onNav={onNav}>
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 90 }}>
        {/* Header */}
        <div style={{
          padding: '4px 20px 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Logo size={24}/>
          <button style={{
            background: SK.surface, border: `1px solid ${SK.border}`,
            width: 40, height: 40, borderRadius: 20,
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
              border: `2px solid ${SK.bg}`,
            }}>3</div>
          </button>
        </div>

        {/* Hero donut */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{
            background: SK.surface,
            border: `1px solid ${SK.gold}22`,
            borderRadius: 16,
            padding: '24px 20px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Corner tag */}
            <div style={{
              position: 'absolute', top: 0, right: 0,
              background: SK.gold, color: SK.bg,
              fontFamily: SK.fHead, fontWeight: 700, fontSize: 10,
              padding: '4px 10px',
              borderRadius: '0 16px 0 8px',
              letterSpacing: 1,
            }}>TEMPORADA 26</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
                <DonutProgress value={have} max={total} size={140} stroke={10}/>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ fontFamily: SK.fMono, fontSize: 34, fontWeight: 700, color: SK.text, letterSpacing: -1, lineHeight: 1 }}>{have}</div>
                  <div style={{ fontFamily: SK.fMono, fontSize: 14, color: SK.textMute, marginTop: 2 }}>/ {total}</div>
                  <div style={{ fontFamily: SK.fMono, fontSize: 12, color: SK.gold, fontWeight: 600, marginTop: 4 }}>{pct}%</div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>tu progreso</div>
                <div style={{ fontFamily: SK.fHead, fontSize: 26, fontWeight: 700, lineHeight: 1.05, color: SK.text, marginTop: 6 }}>Vas por buen camino</div>
                <div style={{ fontSize: 13, color: SK.textMute, marginTop: 8, lineHeight: 1.4 }}>
                  Faltan <span style={{ color: SK.gold, fontWeight: 600, fontFamily: SK.fMono }}>{missing}</span> para completar el álbum.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <StatCard label="Tengo" value={have} color={SK.gold} IconC={Icon.Check}/>
          <StatCard label="Faltan" value={missing} color={SK.textMute} IconC={Icon.Clock}/>
          <StatCard label="Repetidas" value={duplicates} color={SK.coral} IconC={Icon.Copy}/>
        </div>

        {/* Continue collecting */}
        <div style={{ padding: '0 0 18px' }}>
          <div style={{
            padding: '0 20px 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>continúa coleccionando</div>
              <div style={{ fontFamily: SK.fHead, fontSize: 20, fontWeight: 700, color: SK.text, marginTop: 2 }}>Por selección</div>
            </div>
            <button style={{ background: 'none', border: 'none', color: SK.gold, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, fontWeight: 600 }}>
              Ver todas <Icon.ChevronRight s={14} c={SK.gold}/>
            </button>
          </div>
          <div style={{
            display: 'flex', gap: 10, overflowX: 'auto',
            padding: '0 20px 4px', scrollbarWidth: 'none',
          }}>
            {COUNTRIES.slice(0, 6).map(c => (
              <TeamCard key={c.code} country={c}/>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600, marginBottom: 4 }}>actividad reciente</div>
          <div style={{ fontFamily: SK.fHead, fontSize: 20, fontWeight: 700, color: SK.text, marginBottom: 12 }}>Últimos movimientos</div>
          <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <ActivityRow icon="check" text={<span>Añadiste <b style={{ color: SK.text }}>#042 Delantero</b></span>} time="hace 2h"/>
            <ActivityRow icon="swap"  text={<span>Intercambio con <b style={{ color: SK.text }}>@carlos_mx</b></span>} time="ayer"/>
            <ActivityRow icon="trophy" text={<span>Desbloqueaste <b style={{ color: SK.text }}>25% completado</b></span>} time="2d"/>
            <ActivityRow icon="dup" text={<span>Repetida <b style={{ color: SK.text }}>#118 Mediocampista</b></span>} time="3d" last/>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button style={{
        position: 'absolute', right: 20, bottom: 96,
        width: 56, height: 56, borderRadius: 28,
        background: SK.gold, border: 'none',
        boxShadow: `0 8px 24px -4px ${SK.goldDeep}, 0 0 0 6px ${SK.gold}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', zIndex: 10,
      }}>
        <Icon.Plus s={26} c={SK.bg}/>
      </button>
    </PhoneShell>
  );
}

function StatCard({ label, value, color, IconC }) {
  return (
    <div style={{
      background: SK.surface, border: `1px solid ${SK.border}`,
      borderRadius: 12, padding: '12px 10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <IconC s={12} c={color}/>
        <span style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontFamily: SK.fMono, fontSize: 26, fontWeight: 700, color, letterSpacing: -0.5, lineHeight: 1 }}>{value}</div>
    </div>
  );
}

function TeamCard({ country }) {
  const pct = Math.round((country.have / country.total) * 100);
  return (
    <div style={{
      flexShrink: 0, width: 120,
      background: SK.surface, border: `1px solid ${SK.border}`,
      borderRadius: 12, padding: 12,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 28 }}>{country.flag}</span>
        <span style={{ fontFamily: SK.fMono, fontSize: 11, color: SK.textMute }}>
          {country.have}/{country.total}
        </span>
      </div>
      <div style={{ fontFamily: SK.fHead, fontWeight: 700, fontSize: 14, color: SK.text, textTransform: 'uppercase' }}>{country.name}</div>
      <ProgressBar value={country.have} max={country.total}/>
      <div style={{ fontFamily: SK.fMono, fontSize: 11, color: SK.gold, fontWeight: 600 }}>{pct}%</div>
    </div>
  );
}

function ActivityRow({ icon, text, time, last }) {
  const IconMap = {
    check: <Icon.Check s={14} c={SK.green}/>,
    swap: <Icon.Swap s={14} c={SK.gold}/>,
    trophy: <Icon.Trophy s={14} c={SK.gold}/>,
    dup: <Icon.Copy s={14} c={SK.coral}/>,
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
      }}>{IconMap[icon]}</div>
      <div style={{ flex: 1, fontSize: 13, color: SK.textMute, fontFamily: SK.fBody }}>{text}</div>
      <div style={{ fontFamily: SK.fMono, fontSize: 11, color: SK.textDim }}>{time}</div>
    </div>
  );
}

Object.assign(window, { LoginScreen, DashboardScreen, PhoneShell, BottomNav, MobileStatus, MOBILE_W, MOBILE_H });
