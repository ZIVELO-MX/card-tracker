// Desktop — Login, Trade, Profile

// ─────────────────────────────────────────────────────────────
// DESKTOP — Login (split layout)
// ─────────────────────────────────────────────────────────────
function LoginDesktop({ onLogin, onRegister }) {
  const [email, setEmail] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const [focus, setFocus] = React.useState(null);
  const [showPwd, setShowPwd] = React.useState(false);

  const EyeIcon = ({ show }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {show
        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      }
    </svg>
  );

  return (
    <div style={{
      width: DESKTOP_W, height: DESKTOP_H,
      background: SK.bg,
      display: 'flex',
      color: SK.text, fontFamily: SK.fBody,
      overflow: 'hidden',
    }}>
      {/* Left — brand panel */}
      <div style={{
        flex: 1.1,
        background: SK.bgSoft,
        backgroundImage: HEX_PATTERN,
        borderRight: `1px solid ${SK.border}`,
        padding: '48px 64px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
      }}>
        <Logo size={32}/>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            fontSize: 12, color: SK.gold, textTransform: 'uppercase',
            letterSpacing: 2, fontWeight: 700, marginBottom: 14,
          }}>Temporada 2026</div>
          <div style={{
            fontFamily: SK.fHead, fontWeight: 700, fontSize: 64,
            lineHeight: 1, color: SK.text, maxWidth: 520,
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>Tu álbum,<br/><span style={{ color: SK.gold }}>organizado.</span></div>
          <div style={{
            fontSize: 16, color: SK.textMute, marginTop: 20,
            maxWidth: 440, lineHeight: 1.5,
          }}>
            Lleva el registro de cada estampa, detecta repetidas e intercambia con otros coleccionistas por QR.
          </div>

          {/* Floating sticker preview */}
          <div style={{
            display: 'flex', gap: 14, marginTop: 44, alignItems: 'flex-end',
          }}>
            <div style={{ transform: 'rotate(-6deg)', width: 110 }}>
              <StickerCard num={7} country={COUNTRIES[0]} player="Delantero A" state="have" size="md"/>
            </div>
            <div style={{ transform: 'rotate(2deg) translateY(-12px)', width: 130 }}>
              <StickerCard num={42} country={COUNTRIES[1]} player="Portero C" state="duplicate" count={3} size="lg"/>
            </div>
            <div style={{ transform: 'rotate(8deg)', width: 110 }}>
              <StickerCard num={118} country={COUNTRIES[3]} player="Mediocampista" state="missing" size="md"/>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 40, position: 'relative', zIndex: 2 }}>
          {[
            { k: '980', l: 'estampas' },
            { k: '48', l: 'países' },
            { k: '120K+', l: 'coleccionistas' },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontFamily: SK.fMono, fontSize: 24, fontWeight: 700, color: SK.gold, letterSpacing: -0.5 }}>{s.k}</div>
              <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div style={{
        flex: 1,
        padding: '48px 80px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div style={{ maxWidth: 380, width: '100%', margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600 }}>
            Bienvenido de vuelta
          </div>
          <div style={{ fontFamily: SK.fHead, fontWeight: 700, fontSize: 36, color: SK.text, marginTop: 6, marginBottom: 34 }}>
            Entra a tu álbum
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <label style={{
              position: 'absolute', left: 16,
              top: (focus === 'email' || email) ? 8 : 22,
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
                width: '100%', background: SK.surface,
                border: `1px solid ${focus === 'email' ? SK.gold : SK.border}`,
                borderRadius: 10, padding: '26px 16px 10px',
                fontFamily: SK.fBody, fontSize: 14, color: SK.text,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 10, position: 'relative' }}>
            <label style={{
              position: 'absolute', left: 16,
              top: (focus === 'pwd' || pwd) ? 8 : 22,
              fontSize: (focus === 'pwd' || pwd) ? 10 : 14,
              color: focus === 'pwd' ? SK.gold : SK.textMute,
              fontFamily: SK.fBody, fontWeight: 500,
              transition: 'all 0.15s', pointerEvents: 'none',
              textTransform: (focus === 'pwd' || pwd) ? 'uppercase' : 'none',
              letterSpacing: (focus === 'pwd' || pwd) ? 0.8 : 0,
            }}>Contraseña</label>
            <input
              type={showPwd ? 'text' : 'password'}
              value={pwd} onChange={e => setPwd(e.target.value)}
              onFocus={() => setFocus('pwd')} onBlur={() => setFocus(null)}
              style={{
                width: '100%', background: SK.surface,
                border: `1px solid ${focus === 'pwd' ? SK.gold : SK.border}`,
                borderRadius: 10, padding: '26px 44px 10px 16px',
                fontFamily: SK.fBody, fontSize: 14, color: SK.text,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
            <button onClick={() => setShowPwd(v => !v)} style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: showPwd ? SK.gold : SK.textMute, padding: 4,
              display: 'flex', alignItems: 'center',
            }}><EyeIcon show={showPwd}/></button>
          </div>

          <div style={{ textAlign: 'right', marginBottom: 22 }}>
            <a style={{ fontSize: 12, color: SK.textMute, cursor: 'pointer', fontWeight: 500 }}>¿Olvidaste tu contraseña?</a>
          </div>

          {/* CTA */}
          <button onClick={onLogin} style={{
            width: '100%', padding: '16px 0',
            background: SK.gold, color: SK.bg,
            border: 'none', borderRadius: 10,
            fontFamily: SK.fHead, fontWeight: 700, fontSize: 16,
            textTransform: 'uppercase', letterSpacing: 1.5,
            cursor: 'pointer',
            boxShadow: `0 6px 18px -4px ${SK.goldDeep}`,
          }}>Entrar</button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0 16px' }}>
            <div style={{ flex: 1, height: 1, background: SK.border }}/>
            <span style={{ fontSize: 10, color: SK.textMute, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 600 }}>o continúa con</span>
            <div style={{ flex: 1, height: 1, background: SK.border }}/>
          </div>

          <button onClick={onLogin} style={{
            width: '100%', padding: '14px 0',
            background: 'transparent', color: SK.text,
            border: `1px solid ${SK.border}`, borderRadius: 10,
            fontFamily: SK.fBody, fontWeight: 500, fontSize: 14,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <Icon.Google s={18}/>
            Continuar con Google
          </button>

          <div style={{ fontSize: 13, color: SK.textMute, textAlign: 'center', marginTop: 28 }}>
            ¿No tienes cuenta? <span onClick={onRegister} style={{ color: SK.gold, fontWeight: 600, cursor: 'pointer' }}>Regístrate</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP — Register (split layout)
// ─────────────────────────────────────────────────────────────
function RegisterDesktop({ onRegister, onLogin }) {
  const [username, setUsername]       = React.useState('');
  const [email, setEmail]             = React.useState('');
  const [pwd, setPwd]                 = React.useState('');
  const [confirmPwd, setConfirmPwd]   = React.useState('');
  const [country, setCountry]         = React.useState('');
  const [focus, setFocus]             = React.useState(null);
  const [showPwd, setShowPwd]         = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const selectedCountry = COUNTRIES.find(c => c.code === country) || null;
  const pwdMatch = pwd && confirmPwd && pwd === confirmPwd;
  const pwdMismatch = pwd && confirmPwd && pwd !== confirmPwd;
  const canSubmit = username && email && pwd && confirmPwd && pwdMatch && country;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onRegister({ name: username, username, email, country: selectedCountry });
  };

  const EyeIcon = ({ show }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {show
        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      }
    </svg>
  );


  return (
    <div style={{
      width: DESKTOP_W, height: DESKTOP_H,
      background: SK.bg, display: 'flex',
      color: SK.text, fontFamily: SK.fBody, overflow: 'hidden',
    }}>
      {/* Left — brand panel (same as login) */}
      <div style={{
        flex: 1.1, background: SK.bgSoft, backgroundImage: HEX_PATTERN,
        borderRight: `1px solid ${SK.border}`,
        padding: '48px 64px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
      }}>
        <Logo size={32}/>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: 12, color: SK.gold, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, marginBottom: 14 }}>
            Únete ahora
          </div>
          <div style={{ fontFamily: SK.fHead, fontWeight: 700, fontSize: 64, lineHeight: 1, color: SK.text, maxWidth: 520, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Tu colección,<br/><span style={{ color: SK.gold }}>empieza hoy.</span>
          </div>
          <div style={{ fontSize: 16, color: SK.textMute, marginTop: 20, maxWidth: 440, lineHeight: 1.5 }}>
            Registra cada estampa, encuentra tus repetidas e intercambia con coleccionistas de todo el mundo.
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 44, alignItems: 'flex-end' }}>
            <div style={{ transform: 'rotate(-4deg)', width: 110 }}>
              <StickerCard num={21} country={COUNTRIES[0]} player="Escudo" state="have" type="escudo" size="md"/>
            </div>
            <div style={{ transform: 'rotate(3deg) translateY(-12px)', width: 130 }}>
              <StickerCard num={22} country={COUNTRIES[8]} player="Foto Equipo" state="have" type="equipo" size="lg"/>
            </div>
            <div style={{ transform: 'rotate(7deg)', width: 110 }}>
              <StickerCard num={5} player="Copa 2026" state="have" type="especial" subtype="trophy" size="md"/>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 40, position: 'relative', zIndex: 2 }}>
          {[{ k: '980', l: 'estampas' }, { k: '48', l: 'países' }, { k: '120K+', l: 'coleccionistas' }].map(s => (
            <div key={s.l}>
              <div style={{ fontFamily: SK.fMono, fontSize: 24, fontWeight: 700, color: SK.gold, letterSpacing: -0.5 }}>{s.k}</div>
              <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, padding: '48px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: 380, width: '100%', margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600 }}>
            Crea tu cuenta
          </div>
          <div style={{ fontFamily: SK.fHead, fontWeight: 700, fontSize: 36, color: SK.text, marginTop: 6, marginBottom: 28 }}>
            Regístrate gratis
          </div>

          {/* Username */}
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <label style={{
              position: 'absolute', left: 16,
              top: (focus === 'username' || username) ? 8 : 22,
              fontSize: (focus === 'username' || username) ? 10 : 14,
              color: focus === 'username' ? SK.gold : SK.textMute,
              fontFamily: SK.fBody, fontWeight: 500,
              transition: 'all 0.15s', pointerEvents: 'none',
              textTransform: (focus === 'username' || username) ? 'uppercase' : 'none',
              letterSpacing: (focus === 'username' || username) ? 0.8 : 0,
            }}>Nombre de usuario</label>
            <input
              value={username} onChange={e => setUsername(e.target.value)}
              onFocus={() => setFocus('username')} onBlur={() => setFocus(null)}
              style={{
                width: '100%', background: SK.surface,
                border: `1px solid ${focus === 'username' ? SK.gold : SK.border}`,
                borderRadius: 10, padding: '26px 16px 10px',
                fontFamily: SK.fBody, fontSize: 14, color: SK.text,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <label style={{
              position: 'absolute', left: 16,
              top: (focus === 'email' || email) ? 8 : 22,
              fontSize: (focus === 'email' || email) ? 10 : 14,
              color: focus === 'email' ? SK.gold : SK.textMute,
              fontFamily: SK.fBody, fontWeight: 500,
              transition: 'all 0.15s', pointerEvents: 'none',
              textTransform: (focus === 'email' || email) ? 'uppercase' : 'none',
              letterSpacing: (focus === 'email' || email) ? 0.8 : 0,
            }}>Correo electrónico</label>
            <input
              value={email} onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocus('email')} onBlur={() => setFocus(null)}
              style={{
                width: '100%', background: SK.surface,
                border: `1px solid ${focus === 'email' ? SK.gold : SK.border}`,
                borderRadius: 10, padding: '26px 16px 10px',
                fontFamily: SK.fBody, fontSize: 14, color: SK.text,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <label style={{
              position: 'absolute', left: 16,
              top: (focus === 'pwd' || pwd) ? 8 : 22,
              fontSize: (focus === 'pwd' || pwd) ? 10 : 14,
              color: focus === 'pwd' ? SK.gold : SK.textMute,
              fontFamily: SK.fBody, fontWeight: 500,
              transition: 'all 0.15s', pointerEvents: 'none',
              textTransform: (focus === 'pwd' || pwd) ? 'uppercase' : 'none',
              letterSpacing: (focus === 'pwd' || pwd) ? 0.8 : 0,
            }}>Contraseña</label>
            <input
              type={showPwd ? 'text' : 'password'}
              value={pwd} onChange={e => setPwd(e.target.value)}
              onFocus={() => setFocus('pwd')} onBlur={() => setFocus(null)}
              style={{
                width: '100%', background: SK.surface,
                border: `1px solid ${focus === 'pwd' ? SK.gold : SK.border}`,
                borderRadius: 10, padding: '26px 44px 10px 16px',
                fontFamily: SK.fBody, fontSize: 14, color: SK.text,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
            <button onClick={() => setShowPwd(v => !v)} style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: showPwd ? SK.gold : SK.textMute, padding: 4,
              display: 'flex', alignItems: 'center',
            }}><EyeIcon show={showPwd}/></button>
          </div>

          {/* Confirm password */}
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <label style={{
              position: 'absolute', left: 16,
              top: (focus === 'confirm' || confirmPwd) ? 8 : 22,
              fontSize: (focus === 'confirm' || confirmPwd) ? 10 : 14,
              color: focus === 'confirm' ? SK.gold : SK.textMute,
              fontFamily: SK.fBody, fontWeight: 500,
              transition: 'all 0.15s', pointerEvents: 'none',
              textTransform: (focus === 'confirm' || confirmPwd) ? 'uppercase' : 'none',
              letterSpacing: (focus === 'confirm' || confirmPwd) ? 0.8 : 0,
            }}>Confirmar contraseña</label>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)}
              onFocus={() => setFocus('confirm')} onBlur={() => setFocus(null)}
              style={{
                width: '100%', background: SK.surface,
                border: `1px solid ${pwdMismatch ? SK.coral : focus === 'confirm' ? SK.gold : pwdMatch ? SK.green : SK.border}`,
                borderRadius: 10, padding: '26px 44px 10px 16px',
                fontFamily: SK.fBody, fontSize: 14, color: SK.text,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
            <button onClick={() => setShowConfirm(v => !v)} style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: showConfirm ? SK.gold : SK.textMute, padding: 4,
              display: 'flex', alignItems: 'center',
            }}><EyeIcon show={showConfirm}/></button>
            {pwdMismatch && (
              <div style={{ fontSize: 11, color: SK.coral, marginTop: 5, paddingLeft: 4 }}>Las contraseñas no coinciden</div>
            )}
            {pwdMatch && (
              <div style={{ fontSize: 11, color: SK.green, marginTop: 5, paddingLeft: 4 }}>✓ Las contraseñas coinciden</div>
            )}
          </div>

          {/* Country */}
          <div style={{ marginBottom: 22, position: 'relative' }}>
            <label style={{
              position: 'absolute', left: 16,
              top: (focus === 'country' || country) ? 8 : 22,
              fontSize: (focus === 'country' || country) ? 10 : 14,
              color: focus === 'country' ? SK.gold : SK.textMute,
              fontFamily: SK.fBody, fontWeight: 500,
              transition: 'all 0.15s', pointerEvents: 'none',
              textTransform: (focus === 'country' || country) ? 'uppercase' : 'none',
              letterSpacing: (focus === 'country' || country) ? 0.8 : 0,
              zIndex: 1,
            }}>País</label>
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              onFocus={() => setFocus('country')} onBlur={() => setFocus(null)}
              style={{
                width: '100%', background: SK.surface,
                border: `1px solid ${focus === 'country' ? SK.gold : SK.border}`,
                borderRadius: 10, padding: '26px 16px 10px',
                fontFamily: SK.fBody, fontSize: 14,
                color: country ? SK.text : 'transparent',
                outline: 'none', boxSizing: 'border-box',
                appearance: 'none', cursor: 'pointer',
              }}
            >
              <option value="" disabled/>
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
              ))}
            </select>
            {selectedCountry && (
              <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 20, pointerEvents: 'none' }}>
                {selectedCountry.flag}
              </div>
            )}
          </div>

          {/* CTA */}
          <button onClick={handleSubmit} style={{
            width: '100%', padding: '16px 0',
            background: canSubmit ? SK.gold : SK.border,
            color: canSubmit ? SK.bg : SK.textMute,
            border: 'none', borderRadius: 10,
            fontFamily: SK.fHead, fontWeight: 700, fontSize: 16,
            textTransform: 'uppercase', letterSpacing: 1.5,
            cursor: canSubmit ? 'pointer' : 'default',
            boxShadow: canSubmit ? `0 6px 18px -4px ${SK.goldDeep}` : 'none',
            transition: 'all 0.2s',
          }}>Crear cuenta</button>

          <div style={{ fontSize: 13, color: SK.textMute, textAlign: 'center', marginTop: 24 }}>
            ¿Ya tienes cuenta? <span onClick={onLogin} style={{ color: SK.gold, fontWeight: 600, cursor: 'pointer' }}>Inicia sesión</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP — Trade (two-column)
// ─────────────────────────────────────────────────────────────
function TradeDesktop({ onNav }) {
  const [tab, setTab] = React.useState('qr');

  return (
    <DesktopShell active="trade" onNav={onNav} title="Intercambios" sub="Trade · 23 repetidas disponibles">
      <div style={{ padding: '28px 36px' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 24, borderBottom: `1px solid ${SK.border}`, marginBottom: 24 }}>
          {[['qr', 'Mi QR'], ['scan', 'Escanear'], ['history', 'Historial']].map(([id, label]) => {
            const on = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)} style={{
                padding: '12px 2px', background: 'none', border: 'none',
                borderBottom: `2px solid ${on ? SK.gold : 'transparent'}`,
                color: on ? SK.text : SK.textMute,
                fontFamily: SK.fHead, fontSize: 14, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: 1,
                cursor: 'pointer', marginBottom: -1,
              }}>{label}</button>
            );
          })}
        </div>

        {tab === 'qr' && <TradeQrDesktop/>}
        {tab === 'scan' && <TradeScanDesktop/>}
        {tab === 'history' && <TradeHistoryDesktop/>}
      </div>
    </DesktopShell>
  );
}

function TradeQrDesktop() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 24 }}>
      {/* QR card */}
      <div style={{
        background: SK.surface, border: `2px solid ${SK.gold}`,
        borderRadius: 16, padding: 32,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
      }}>
        <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600 }}>
          Tu código de intercambio
        </div>
        <QRPlaceholder size={280}/>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: SK.fHead, fontSize: 20, fontWeight: 700, color: SK.text, textTransform: 'uppercase', letterSpacing: 1 }}>
            @alex_stickio
          </div>
          <div style={{ fontFamily: SK.fMono, fontSize: 12, color: SK.textMute, marginTop: 4 }}>
            ID: STK-8F2A-9X4D
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          color: SK.coral, fontSize: 13, fontWeight: 600,
          background: `${SK.coral}15`, padding: '8px 14px', borderRadius: 20,
        }}>
          <Icon.Clock s={14} c={SK.coral}/>
          <span>Expira en <span style={{ fontFamily: SK.fMono }}>23h 45m</span></span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
          <button style={{
            padding: '12px', background: SK.gold, color: SK.bg,
            border: 'none', borderRadius: 10,
            fontFamily: SK.fHead, fontWeight: 700, fontSize: 13,
            textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Icon.Share s={16} c={SK.bg}/> Compartir
          </button>
          <button style={{
            padding: '12px', background: 'transparent', color: SK.gold,
            border: `1.5px solid ${SK.gold}`, borderRadius: 10,
            fontFamily: SK.fHead, fontWeight: 700, fontSize: 13,
            textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
          }}>Regenerar</button>
        </div>
      </div>

      {/* Duplicates list */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>disponibles para intercambio</div>
            <div style={{ fontFamily: SK.fHead, fontSize: 22, fontWeight: 700, color: SK.text, marginTop: 2 }}>Tus repetidas · 23</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['Todas', 'Por país', 'Más duplicadas'].map((f, i) => (
              <button key={f} style={{
                padding: '6px 12px',
                background: i === 0 ? `${SK.gold}18` : 'transparent',
                color: i === 0 ? SK.gold : SK.textMute,
                border: `1px solid ${i === 0 ? SK.gold + '44' : SK.border}`,
                borderRadius: 16,
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, overflow: 'hidden' }}>
          {/* Header row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '90px 1fr 80px 80px 100px',
            padding: '12px 18px', gap: 14,
            borderBottom: `1px solid ${SK.border}`, background: SK.bgSoft,
            fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700,
          }}>
            <div>Número</div>
            <div>Jugador</div>
            <div>País</div>
            <div style={{ textAlign: 'center' }}>Extras</div>
            <div style={{ textAlign: 'right' }}>Acción</div>
          </div>
          {[
            { num: 7, country: COUNTRIES[0], player: 'Delantero A', count: 3 },
            { num: 42, country: COUNTRIES[1], player: 'Portero C', count: 2 },
            { num: 118, country: COUNTRIES[3], player: 'Mediocampista B', count: 4 },
            { num: 56, country: COUNTRIES[2], player: 'Defensor F', count: 2 },
            { num: 201, country: COUNTRIES[4], player: 'Lateral D', count: 2 },
            { num: 88, country: COUNTRIES[6], player: 'Extremo E', count: 3 },
            { num: 312, country: COUNTRIES[5], player: 'Central A', count: 2 },
          ].map((d, i, arr) => (
            <div key={d.num} style={{
              display: 'grid', gridTemplateColumns: '90px 1fr 80px 80px 100px',
              padding: '14px 18px', gap: 14, alignItems: 'center',
              borderBottom: i < arr.length - 1 ? `1px solid ${SK.border}` : 'none',
            }}>
              <div style={{
                fontFamily: SK.fMono, fontSize: 13, fontWeight: 700, color: SK.gold,
                background: SK.bgSoft, padding: '5px 10px', borderRadius: 6,
                textAlign: 'center', border: `1px solid ${SK.border}`,
              }}>#{String(d.num).padStart(3, '0')}</div>
              <div style={{ fontSize: 13, color: SK.text, fontWeight: 500 }}>{d.player}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 18 }}>{d.country.flag}</span>
                <span style={{ fontFamily: SK.fMono, fontSize: 11, color: SK.textMute }}>{d.country.code}</span>
              </div>
              <div style={{
                justifySelf: 'center',
                background: SK.coral, color: '#fff',
                fontFamily: SK.fMono, fontSize: 11, fontWeight: 700,
                padding: '4px 10px', borderRadius: 10,
              }}>+{d.count - 1}</div>
              <button style={{
                background: 'transparent', color: SK.gold,
                border: `1px solid ${SK.gold}44`, borderRadius: 6,
                padding: '6px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: 0.5,
                justifySelf: 'end',
              }}>Ofrecer</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TradeScanDesktop() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24 }}>
      <div style={{
        background: SK.surface, border: `1px solid ${SK.border}`,
        borderRadius: 16, padding: 32,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
      }}>
        <div style={{
          position: 'relative',
          width: 400, height: 400,
          background: '#000',
          borderRadius: 16, overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 55% 45%, #1a2a3a 0%, #000 70%)' }}/>
          {[
            { top: 20, left: 20, borderTop: `4px solid ${SK.gold}`, borderLeft: `4px solid ${SK.gold}` },
            { top: 20, right: 20, borderTop: `4px solid ${SK.gold}`, borderRight: `4px solid ${SK.gold}` },
            { bottom: 20, left: 20, borderBottom: `4px solid ${SK.gold}`, borderLeft: `4px solid ${SK.gold}` },
            { bottom: 20, right: 20, borderBottom: `4px solid ${SK.gold}`, borderRight: `4px solid ${SK.gold}` },
          ].map((s, i) => (
            <div key={i} style={{ position: 'absolute', width: 40, height: 40, borderRadius: 6, ...s }}/>
          ))}
          <div style={{
            position: 'absolute', left: 30, right: 30, top: '50%',
            height: 2, background: SK.gold, boxShadow: `0 0 16px ${SK.gold}`,
            animation: 'scan 2s ease-in-out infinite',
          }}/>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: SK.fHead, fontSize: 22, fontWeight: 700, color: SK.text, textTransform: 'uppercase', letterSpacing: 1 }}>
            Apunta al QR de tu amigo
          </div>
          <div style={{ fontSize: 14, color: SK.textMute, marginTop: 8, maxWidth: 360 }}>
            Mantén el código centrado dentro del marco. La detección es automática.
          </div>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>cómo funciona</div>
        <div style={{ fontFamily: SK.fHead, fontSize: 22, fontWeight: 700, color: SK.text, marginTop: 2, marginBottom: 16 }}>Intercambio en 3 pasos</div>
        {[
          { n: '01', t: 'Escanea el QR', d: 'Apunta tu cámara al código del otro coleccionista.' },
          { n: '02', t: 'Selecciona estampas', d: 'Elige qué repetidas ofrecer y qué quieres recibir.' },
          { n: '03', t: 'Confirma el trade', d: 'Ambos confirman y el historial queda registrado.' },
        ].map(s => (
          <div key={s.n} style={{
            background: SK.surface, border: `1px solid ${SK.border}`,
            borderRadius: 12, padding: 18, marginBottom: 10,
            display: 'flex', gap: 16, alignItems: 'center',
          }}>
            <div style={{
              fontFamily: SK.fMono, fontSize: 22, fontWeight: 700, color: SK.gold,
              background: `${SK.gold}15`, width: 48, height: 48, borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{s.n}</div>
            <div>
              <div style={{ fontFamily: SK.fHead, fontSize: 15, fontWeight: 700, color: SK.text, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.t}</div>
              <div style={{ fontSize: 13, color: SK.textMute, marginTop: 4, lineHeight: 1.4 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes scan { 0%, 100% { top: 30px; } 50% { top: calc(100% - 32px); } }`}</style>
    </div>
  );
}

function TradeHistoryDesktop() {
  const history = [
    { date: '15 abr', user: '@carlos_mx', given: 3, got: 3, net: '+0' },
    { date: '12 abr', user: '@sofia_co', given: 2, got: 4, net: '+2' },
    { date: '08 abr', user: '@diego_ar', given: 5, got: 3, net: '-2' },
    { date: '02 abr', user: '@luna_es', given: 1, got: 2, net: '+1' },
    { date: '28 mar', user: '@pablo_br', given: 4, got: 4, net: '+0' },
  ];
  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>historial</div>
      <div style={{ fontFamily: SK.fHead, fontSize: 22, fontWeight: 700, color: SK.text, marginTop: 2, marginBottom: 14 }}>47 intercambios realizados</div>
      <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, overflow: 'hidden' }}>
        {history.map((h, i, a) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '80px 1fr 100px 100px 80px',
            padding: '16px 20px', gap: 14, alignItems: 'center',
            borderBottom: i < a.length - 1 ? `1px solid ${SK.border}` : 'none',
          }}>
            <div style={{ fontFamily: SK.fMono, fontSize: 12, color: SK.textMute }}>{h.date}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: SK.bgSoft, border: `1px solid ${SK.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: SK.gold, fontFamily: SK.fHead, fontSize: 12, fontWeight: 700 }}>
                {h.user[1].toUpperCase()}
              </div>
              <span style={{ fontFamily: SK.fMono, fontSize: 13, color: SK.text }}>{h.user}</span>
            </div>
            <div style={{ fontFamily: SK.fMono, fontSize: 13, color: SK.textMute }}>↑ {h.given} dadas</div>
            <div style={{ fontFamily: SK.fMono, fontSize: 13, color: SK.textMute }}>↓ {h.got} recibidas</div>
            <div style={{
              fontFamily: SK.fMono, fontSize: 13, fontWeight: 700,
              color: h.net.startsWith('+') ? SK.green : h.net.startsWith('-') ? SK.coral : SK.textMute,
              textAlign: 'right',
            }}>{h.net}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP — Profile
// ─────────────────────────────────────────────────────────────
function ProfileDesktop({ onNav, stats, userData }) {
  const { have, total, duplicates } = stats;
  const pct = ((have / total) * 100).toFixed(1);

  const user = userData || { name: 'Alex Moreno', username: 'alex_stickio', country: COUNTRIES[0] };
  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <DesktopShell active="profile" onNav={onNav} title="Perfil" sub="Tu identidad de coleccionista">
      <div style={{ padding: '28px 36px' }}>
        {/* Hero card */}
        <div style={{
          background: SK.surface,
          border: `1px solid ${SK.gold}22`,
          borderRadius: 16,
          padding: 32,
          display: 'flex', gap: 28,
          marginBottom: 22,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 120, height: 120, borderRadius: 60,
              border: `3px solid ${SK.gold}`,
              background: SK.bgSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: SK.fHead, fontSize: 44, fontWeight: 700,
              color: SK.gold,
              boxShadow: `0 8px 24px -6px ${SK.goldDeep}`,
            }}>{initials}</div>
            {user.country && (
              <div style={{
                position: 'absolute', bottom: 4, right: 4,
                width: 32, height: 32, borderRadius: 16,
                background: SK.surface, border: `2px solid ${SK.bg}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
              }}>{user.country.flag}</div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: SK.gold, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700 }}>
              Coleccionista · Nivel 7
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <div style={{ fontFamily: SK.fHead, fontSize: 38, fontWeight: 700, color: SK.text, lineHeight: 1 }}>
                {user.name}
              </div>
              {user.country && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: SK.bgSoft, border: `1px solid ${SK.border}`,
                  padding: '4px 10px', borderRadius: 20,
                  fontSize: 13, color: SK.textMute, fontFamily: SK.fBody, fontWeight: 500,
                }}>
                  <span style={{ fontSize: 18 }}>{user.country.flag}</span>
                  {user.country.name}
                </div>
              )}
            </div>
            <div style={{ fontFamily: SK.fMono, fontSize: 14, color: SK.textMute, marginTop: 6 }}>@{user.username}</div>
            <div style={{ fontSize: 14, color: SK.textMute, marginTop: 14, lineHeight: 1.5, maxWidth: 480 }}>
              Coleccionando desde marzo 2026 · Especialidad en selecciones de CONMEBOL.
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button style={{
                padding: '10px 20px', background: SK.gold, color: SK.bg,
                border: 'none', borderRadius: 10,
                fontFamily: SK.fHead, fontWeight: 700, fontSize: 13,
                textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
              }}>Editar perfil</button>
              <button style={{
                padding: '10px 20px', background: 'transparent', color: SK.text,
                border: `1px solid ${SK.border}`, borderRadius: 10,
                fontFamily: SK.fHead, fontWeight: 700, fontSize: 13,
                textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
              }}>Compartir perfil</button>
            </div>
          </div>
          {/* Big progress ring */}
          <div style={{ position: 'relative', width: 160, height: 160, flexShrink: 0, alignSelf: 'center' }}>
            <DonutProgress value={have} max={total} size={160} stroke={10}/>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: SK.fMono, fontSize: 32, fontWeight: 700, color: SK.text, lineHeight: 1 }}>{pct}%</div>
              <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginTop: 4 }}>completado</div>
            </div>
          </div>
        </div>

        {/* Stats grid 4 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          <ProfileStat label="Estampas" value={have} sub={`de ${total}`} color={SK.text}/>
          <ProfileStat label="Completado" value={`${pct}%`} sub="del álbum" color={SK.gold}/>
          <ProfileStat label="Intercambios" value={47} sub="realizados" color={SK.text} icon={<Icon.Swap s={14} c={SK.gold}/>}/>
          <ProfileStat label="Países" value="8/10" sub="completos" color={SK.green}/>
        </div>

        {/* Two-column: achievements + foil */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>logros</div>
            <div style={{ fontFamily: SK.fHead, fontSize: 22, fontWeight: 700, color: SK.text, marginTop: 2, marginBottom: 14 }}>Insignias</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <Badge label="Primera" desc="Estampa" unlocked icon="star"/>
              <Badge label="25%" desc="Del álbum" unlocked icon="pct"/>
              <Badge label="Primer" desc="Trade" unlocked icon="swap"/>
              <Badge label="50%" desc="Del álbum" unlocked icon="pct"/>
              <Badge label="10 Trades" desc="Completados" unlocked icon="swap"/>
              <Badge label="Foil" desc="Coleccionista" unlocked icon="star"/>
              <Badge label="???" desc="Bloqueado" locked icon="trophy"/>
              <Badge label="???" desc="Bloqueado" locked icon="trophy"/>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>destacadas</div>
            <div style={{ fontFamily: SK.fHead, fontSize: 22, fontWeight: 700, color: SK.text, marginTop: 2, marginBottom: 14 }}>Colección foil</div>
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

Object.assign(window, { LoginDesktop, RegisterDesktop, TradeDesktop, ProfileDesktop });
