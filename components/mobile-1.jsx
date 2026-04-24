// Mobile screens — 390x844

const MOBILE_W = 390;
const MOBILE_H = 844;
window.MOBILE_W = MOBILE_W;
window.MOBILE_H = MOBILE_H;

// ─────────────────────────────────────────────────────────────
// Bottom nav
// ─────────────────────────────────────────────────────────────
function BottomNav({ active, onNav }) {
  const items = [
    { id: 'home', label: 'Inicio', Icon: Icon.Home },
    { id: 'album', label: 'Álbum', Icon: Icon.Grid },
    { id: 'trade', label: 'Trade', Icon: Icon.Swap },
    { id: 'marketplace', label: 'Market', Icon: Icon.Store },
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
function PhoneShell({ children, showNav = true, active, onNav }) {
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
function LoginScreen({ onLogin, onRegister, onForgot }) {
  const [email, setEmail] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const [focus, setFocus] = React.useState(null);
  const [errMsg, setErrMsg] = React.useState(null);
  const [infoMsg, setInfoMsg] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSlowLoader, setShowSlowLoader] = React.useState(false);
  const slowLoaderTimerRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      if (slowLoaderTimerRef.current) clearTimeout(slowLoaderTimerRef.current);
    };
  }, []);

  const resolveLoginEmail = async (value) => {
    const raw = (value || '').trim();
    if (!raw) return null;
    if (raw.includes('@')) return raw;
    if (!window.supabase?.from) return null;
    const { data, error } = await window.supabase
      .from('profiles')
      .select('*')
      .or(`username.eq.${raw},id.eq.${raw}`)
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return data.email || null;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setErrMsg(null);
    setInfoMsg(null);
    if (!window.supabase?.auth) {
      setErrMsg('Supabase no está configurado.');
      return;
    }
    setIsSubmitting(true);
    setShowSlowLoader(false);
    slowLoaderTimerRef.current = setTimeout(() => {
      setShowSlowLoader(true);
    }, 900);

    try {
      const loginEmail = await resolveLoginEmail(email);
      if (!loginEmail) {
        setErrMsg('No encontramos ese usuario. Usa tu email para entrar.');
        return;
      }
      const { data, error } = await window.supabase.auth.signInWithPassword({ email: loginEmail, password: pwd });
      if (error) {
        const msg = error.message || '';
        if (msg.toLowerCase().includes('invalid login') || msg.toLowerCase().includes('credentials')) {
          setErrMsg('Email o contraseña incorrectos.');
        } else {
          setErrMsg('No pudimos iniciar sesión. Intenta nuevamente.');
        }
        return;
      }
      onLogin(data.user);
    } finally {
      if (slowLoaderTimerRef.current) {
        clearTimeout(slowLoaderTimerRef.current);
        slowLoaderTimerRef.current = null;
      }
      setShowSlowLoader(false);
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    setErrMsg(null);
    setInfoMsg(null);
    if (!email) {
      setErrMsg('Ingresa tu email para reestablecer la contraseña.');
      return;
    }
    if (!window.supabase?.auth) {
      setErrMsg('Supabase no está configurado.');
      return;
    }
    const resetEmail = await resolveLoginEmail(email);
    if (!resetEmail) {
      setErrMsg('Ingresa el email asociado a tu cuenta.');
      return;
    }
    const { error } = await window.supabase.auth.resetPasswordForEmail(resetEmail);
    if (error) {
      setErrMsg('No pudimos enviar el correo. Intenta nuevamente.');
      return;
    }
    setInfoMsg('Te enviamos un link para reestablecer tu contraseña.');
  };

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
            }}>Email o usuario</label>
            <input
              value={email} onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocus('email')} onBlur={() => setFocus(null)}
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
          <button onClick={handleSubmit} disabled={isSubmitting} style={{
            width: '100%', padding: '14px 0',
            background: isSubmitting ? `${SK.gold}cc` : SK.gold, color: SK.bg,
            border: 'none', borderRadius: 10,
            fontFamily: SK.fHead, fontWeight: 700, fontSize: 16,
            textTransform: 'uppercase', letterSpacing: 1.2,
            cursor: isSubmitting ? 'default' : 'pointer',
            boxShadow: `0 4px 14px -4px ${SK.goldDeep}`,
          }}>{isSubmitting ? 'Entrando...' : 'Entrar'}</button>

          {showSlowLoader && (
            <div style={{
              marginTop: 10,
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 10px',
              background: SK.bgSoft,
              border: `1px solid ${SK.border}`,
              borderRadius: 10,
            }}>
              <LoadingSpinner size={14}/>
              <span style={{ fontSize: 11, color: SK.textMute }}>Conectando con Supabase...</span>
            </div>
          )}

          {errMsg && (
            <div style={{ marginTop: 10, fontSize: 12, color: SK.coral, fontWeight: 600 }}>
              {errMsg}
            </div>
          )}
          {infoMsg && (
            <div style={{ marginTop: 10, fontSize: 12, color: SK.green, fontWeight: 600 }}>
              {infoMsg}
            </div>
          )}

          <div style={{ textAlign: 'right', margin: '8px 0 18px' }}>
            <button onClick={onForgot || handleReset} style={{
              background: 'none', border: 'none', padding: 0,
              fontSize: 12, color: SK.textMute, cursor: 'pointer', fontWeight: 500,
              opacity: isSubmitting ? 0.55 : 1,
            }}>¿Olvidaste tu contraseña?</button>
          </div>

        </div>

        <div style={{ fontSize: 13, color: SK.textMute, fontFamily: SK.fBody }}>
          ¿No tienes cuenta? <span onClick={onRegister} style={{ color: SK.gold, fontWeight: 600, cursor: 'pointer' }}>Regístrate</span>
        </div>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 8 }}>
            <a href="privacy.html" target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: SK.textDim, textDecoration: 'none', letterSpacing: 0.4 }}>Privacidad</a>
            <a href="terms.html" target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: SK.textDim, textDecoration: 'none', letterSpacing: 0.4 }}>Términos</a>
          </div>
          <div style={{ fontSize: 10, color: SK.textDim, letterSpacing: 0.6, textTransform: 'uppercase' }}>By ZIVELO</div>
          <div style={{ fontSize: 9, color: SK.textDim, marginTop: 3 }}>© 2026 ZIVELO. All rights reserved.</div>
        </div>
      </div>
    </PhoneShell>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 1B — Register
// ─────────────────────────────────────────────────────────────
function RegisterScreen({ onRegister, onLogin }) {
  const [name, setName]               = React.useState('');
  const [username, setUsername]       = React.useState('');
  const [email, setEmail]             = React.useState('');
  const [pwd, setPwd]                 = React.useState('');
  const [confirmPwd, setConfirmPwd]   = React.useState('');
  const [country, setCountry]         = React.useState('');
  const [whatsapp, setWhatsapp]       = React.useState('');
  const [focus, setFocus]             = React.useState(null);
  const [showPwd, setShowPwd]         = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [errMsg, setErrMsg]           = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [emailSent, setEmailSent]     = React.useState(false);
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = React.useState(false);

  const selectedCountry = COUNTRIES.find(c => c.code === country) || null;
  const pwdMatch = pwd && confirmPwd && pwd === confirmPwd;
  const pwdMismatch = pwd && confirmPwd && pwd !== confirmPwd;
  const canSubmit = name && username && email && pwd && confirmPwd && pwdMatch && country && acceptTerms && acceptPrivacy;

  const EyeIcon = ({ show }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {show
        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      }
    </svg>
  );

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;
    setErrMsg(null);
    setIsSubmitting(true);
    const cleanName = name.trim();
    const cleanUsername = username.trim().toLowerCase();
    const cleanWhatsapp = whatsapp.trim();
    if (!window.supabase?.auth) {
      setErrMsg('Supabase no está configurado.');
      setIsSubmitting(false);
      return;
    }
    try {
      const { data: existing } = await window.supabase
        .from('profiles')
        .select('id')
        .ilike('username', cleanUsername)
        .limit(1);
      if (existing && existing.length) {
        setErrMsg('Ese usuario ya existe. Elegí otro.');
        return;
      }
      if (cleanWhatsapp) {
        const { data: existingPhone } = await window.supabase
          .from('profiles')
          .select('id')
          .eq('phone', cleanWhatsapp)
          .limit(1);
        if (existingPhone && existingPhone.length) {
          setErrMsg('Ese número de WhatsApp ya está registrado.');
          return;
        }
      }
      const { data, error } = await window.supabase.auth.signUp({
        email,
        password: pwd,
        options: {
          data: {
            username: cleanUsername,
            full_name: cleanName,
            display_name: cleanName,
            phone: cleanWhatsapp || null,
            whatsapp: cleanWhatsapp || null,
            country_code: selectedCountry?.code || null,
          },
        },
      });
      if (error) {
        const msg = error.message || '';
        if (msg.toLowerCase().includes('already registered')) {
          setErrMsg('Ese email ya está registrado. Inicia sesión o usa otro.');
        } else if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('email')) {
          setErrMsg('Revisa el email e intenta de nuevo.');
        } else {
          setErrMsg('No pudimos crear la cuenta. Intenta nuevamente.');
        }
        return;
      }
      if (data?.user) {
        const { error: profileErr } = await window.supabase.from('profiles').upsert({
          id: data.user.id,
          username: cleanUsername,
          display_name: cleanName,
          email,
          country_code: selectedCountry?.code || null,
          terms_accepted_at: new Date().toISOString(),
          privacy_accepted_at: new Date().toISOString(),
        }, { onConflict: 'id' });
        if (profileErr) {
          if (profileErr.code === '23505') {
            if (profileErr.message?.includes('username')) setErrMsg('Ese usuario ya existe. Elegí otro.');
            else if (profileErr.message?.includes('phone')) setErrMsg('Ese número ya está registrado.');
            else setErrMsg('Ya existe una cuenta con esos datos.');
          } else {
            setErrMsg('No pudimos guardar tu perfil. Intenta de nuevo.');
          }
          return;
        }
        if (cleanWhatsapp) {
          await window.supabase
            .from('profiles')
            .update({ phone: cleanWhatsapp, whatsapp: cleanWhatsapp })
            .eq('id', data.user.id);
        }
        if (!data.session) {
          setEmailSent(true);
          return;
        }
        onRegister({ id: data.user.id, name: cleanName, username: cleanUsername, country: selectedCountry, whatsapp: cleanWhatsapp || null, email });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) return (
    <PhoneShell showNav={false}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: `${SK.gold}22`, border: `2px solid ${SK.gold}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20, fontSize: 28,
        }}>✉️</div>
        <div style={{ fontFamily: SK.fHead, fontWeight: 700, fontSize: 24, color: SK.text, marginBottom: 10, textAlign: 'center' }}>
          Revisa tu correo
        </div>
        <div style={{ fontSize: 13, color: SK.textMute, lineHeight: 1.6, marginBottom: 6, textAlign: 'center' }}>
          Te enviamos un link de confirmación a
        </div>
        <div style={{ fontFamily: SK.fMono, fontSize: 13, color: SK.gold, fontWeight: 600, marginBottom: 20, textAlign: 'center' }}>
          {email}
        </div>
        <div style={{ fontSize: 12, color: SK.textMute, lineHeight: 1.6, marginBottom: 28, textAlign: 'center' }}>
          Haz clic en el enlace del correo para activar tu cuenta. Revisa también la carpeta de spam si no lo ves.
        </div>
        <button onClick={onLogin} style={{
          width: '100%', padding: '14px 0', background: SK.gold, color: SK.bg,
          border: 'none', borderRadius: 10,
          fontFamily: SK.fHead, fontWeight: 700, fontSize: 14,
          textTransform: 'uppercase', letterSpacing: 1.2, cursor: 'pointer',
        }}>Ir al inicio de sesión</button>
      </div>
    </PhoneShell>
  );

  return (
    <PhoneShell showNav={false}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '28px 24px 10px' }}>
          <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>crear cuenta</div>
          <div style={{ fontFamily: SK.fHead, fontSize: 26, fontWeight: 700, color: SK.text, marginTop: 4 }}>Regístrate gratis</div>
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 16, padding: 20 }}>

            {/* Nombre */}
            <div style={{ marginBottom: 14, position: 'relative' }}>
              <label style={{
                position: 'absolute', left: 14,
                top: (focus === 'name' || name) ? 6 : 18,
                fontSize: (focus === 'name' || name) ? 10 : 14,
                color: focus === 'name' ? SK.gold : SK.textMute,
                fontFamily: SK.fBody, fontWeight: 500,
                transition: 'all 0.15s', pointerEvents: 'none',
                textTransform: (focus === 'name' || name) ? 'uppercase' : 'none',
                letterSpacing: (focus === 'name' || name) ? 0.8 : 0,
              }}>Nombre</label>
              <input
                value={name} onChange={e => setName(e.target.value)}
                onFocus={() => setFocus('name')} onBlur={() => setFocus(null)}
                disabled={isSubmitting}
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${focus === 'name' ? SK.gold : SK.border}`,
                  borderRadius: 8, padding: '22px 14px 8px',
                  fontFamily: SK.fBody, fontSize: 14, color: SK.text,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Username */}
            <div style={{ marginBottom: 14, position: 'relative' }}>
              <label style={{
                position: 'absolute', left: 14,
                top: (focus === 'username' || username) ? 6 : 18,
                fontSize: (focus === 'username' || username) ? 10 : 14,
                color: focus === 'username' ? SK.gold : SK.textMute,
                fontFamily: SK.fBody, fontWeight: 500,
                transition: 'all 0.15s', pointerEvents: 'none',
                textTransform: (focus === 'username' || username) ? 'uppercase' : 'none',
                letterSpacing: (focus === 'username' || username) ? 0.8 : 0,
              }}>Usuario</label>
              <input
                value={username} onChange={e => setUsername(e.target.value)}
                onFocus={() => setFocus('username')} onBlur={() => setFocus(null)}
                disabled={isSubmitting}
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${focus === 'username' ? SK.gold : SK.border}`,
                  borderRadius: 8, padding: '22px 14px 8px',
                  fontFamily: SK.fBody, fontSize: 14, color: SK.text,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14, position: 'relative' }}>
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
                disabled={isSubmitting}
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${focus === 'email' ? SK.gold : SK.border}`,
                  borderRadius: 8, padding: '22px 14px 8px',
                  fontFamily: SK.fBody, fontSize: 14, color: SK.text,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 14, position: 'relative' }}>
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
                type={showPwd ? 'text' : 'password'}
                value={pwd} onChange={e => setPwd(e.target.value)}
                onFocus={() => setFocus('pwd')} onBlur={() => setFocus(null)}
                disabled={isSubmitting}
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${focus === 'pwd' ? SK.gold : SK.border}`,
                  borderRadius: 8, padding: '22px 40px 8px 14px',
                  fontFamily: SK.fBody, fontSize: 14, color: SK.text,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              <button onClick={() => setShowPwd(v => !v)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: SK.textMute, display: 'flex', alignItems: 'center', padding: 0,
              }}><EyeIcon show={showPwd}/></button>
            </div>

            {/* Confirm */}
            <div style={{ marginBottom: 14, position: 'relative' }}>
              <label style={{
                position: 'absolute', left: 14,
                top: (focus === 'confirm' || confirmPwd) ? 6 : 18,
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
                disabled={isSubmitting}
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${pwdMismatch ? SK.coral : focus === 'confirm' ? SK.gold : SK.border}`,
                  borderRadius: 8, padding: '22px 40px 8px 14px',
                  fontFamily: SK.fBody, fontSize: 14, color: SK.text,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              <button onClick={() => setShowConfirm(v => !v)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: SK.textMute, display: 'flex', alignItems: 'center', padding: 0,
              }}><EyeIcon show={showConfirm}/></button>
            </div>

            {/* Country */}
            <div style={{ marginBottom: 14, position: 'relative' }}>
              <label style={{
                position: 'absolute', left: 14,
                top: (focus === 'country' || country) ? 6 : 18,
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
                disabled={isSubmitting}
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${focus === 'country' ? SK.gold : SK.border}`,
                  borderRadius: 8, padding: '22px 14px 8px',
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
                <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, pointerEvents: 'none' }}>
                  {selectedCountry.flag}
                </div>
              )}
            </div>

            {/* WhatsApp (opcional) */}
            <div style={{ marginBottom: 18, position: 'relative' }}>
              <label style={{
                position: 'absolute', left: 14,
                top: (focus === 'whatsapp' || whatsapp) ? 6 : 18,
                fontSize: (focus === 'whatsapp' || whatsapp) ? 10 : 14,
                color: focus === 'whatsapp' ? SK.gold : SK.textMute,
                fontFamily: SK.fBody, fontWeight: 500,
                transition: 'all 0.15s', pointerEvents: 'none',
                textTransform: (focus === 'whatsapp' || whatsapp) ? 'uppercase' : 'none',
                letterSpacing: (focus === 'whatsapp' || whatsapp) ? 0.8 : 0,
              }}>WhatsApp (opcional)</label>
              <input
                value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
                onFocus={() => setFocus('whatsapp')} onBlur={() => setFocus(null)}
                disabled={isSubmitting}
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${focus === 'whatsapp' ? SK.gold : SK.border}`,
                  borderRadius: 8, padding: '22px 14px 8px',
                  fontFamily: SK.fBody, fontSize: 14, color: SK.text,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                  style={{ marginTop: 3 }}
                />
                <span style={{ fontSize: 11, color: SK.textMute, lineHeight: 1.4 }}>
                  Acepto los <a href="terms.html" target="_blank" rel="noreferrer" style={{ color: SK.gold, fontWeight: 600, textDecoration: 'none' }}>Términos y Condiciones</a>.
                </span>
              </label>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginTop: 8 }}>
                <input
                  type="checkbox"
                  checked={acceptPrivacy}
                  onChange={e => setAcceptPrivacy(e.target.checked)}
                  style={{ marginTop: 3 }}
                />
                <span style={{ fontSize: 11, color: SK.textMute, lineHeight: 1.4 }}>
                  Acepto la <a href="privacy.html" target="_blank" rel="noreferrer" style={{ color: SK.gold, fontWeight: 600, textDecoration: 'none' }}>Política de Privacidad</a>.
                </span>
              </label>
            </div>

            <button onClick={handleSubmit} disabled={!canSubmit || isSubmitting} style={{
              width: '100%', padding: '14px 0',
              background: canSubmit && !isSubmitting ? SK.gold : SK.border,
              color: canSubmit && !isSubmitting ? SK.bg : SK.textMute,
              border: 'none', borderRadius: 10,
              fontFamily: SK.fHead, fontWeight: 700, fontSize: 14,
              textTransform: 'uppercase', letterSpacing: 1.2,
              cursor: canSubmit && !isSubmitting ? 'pointer' : 'default',
            }}>{isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}</button>
            {errMsg && (
              <div style={{ marginTop: 10, fontSize: 12, color: SK.coral, fontWeight: 600, textAlign: 'center' }}>
                {errMsg}
              </div>
            )}
          </div>

          <div style={{ fontSize: 13, color: SK.textMute, textAlign: 'center', marginTop: 18 }}>
            ¿Ya tienes cuenta? <span onClick={onLogin} style={{ color: SK.gold, fontWeight: 600, cursor: 'pointer' }}>Inicia sesión</span>
          </div>
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <div style={{ fontSize: 10, color: SK.textDim, letterSpacing: 0.6, textTransform: 'uppercase' }}>By ZIVELO</div>
            <div style={{ fontSize: 9, color: SK.textDim, marginTop: 3 }}>© 2026 ZIVELO. All rights reserved.</div>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 1C — Reset Password Request
// ─────────────────────────────────────────────────────────────
function ResetPasswordRequestScreen({ onBack }) {
  const [email, setEmail] = React.useState('');
  const [errMsg, setErrMsg] = React.useState(null);
  const [infoMsg, setInfoMsg] = React.useState(null);

  const handleRequest = async () => {
    setErrMsg(null);
    setInfoMsg(null);
    if (!email) { setErrMsg('Ingresa tu email.'); return; }
    if (!window.supabase?.auth) { setErrMsg('Supabase no está configurado.'); return; }
    const { error } = await window.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname,
    });
    if (error) {
      setErrMsg('No pudimos enviar el correo. Intenta nuevamente.');
      return;
    }
    setInfoMsg('Te enviamos un link para reestablecer tu contraseña.');
  };

  return (
    <PhoneShell showNav={false}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '28px 24px 10px' }}>
          <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>reestablecer</div>
          <div style={{ fontFamily: SK.fHead, fontSize: 26, fontWeight: 700, color: SK.text, marginTop: 4 }}>Recuperar contraseña</div>
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: SK.textMute, fontWeight: 600 }}>Email</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${SK.border}`,
                  borderRadius: 8, padding: '12px 14px',
                  fontFamily: SK.fBody, fontSize: 14, color: SK.text,
                  outline: 'none', boxSizing: 'border-box',
                  marginTop: 6,
                }}
              />
            </div>
            <button onClick={handleRequest} style={{
              width: '100%', padding: '14px 0',
              background: SK.gold, color: SK.bg,
              border: 'none', borderRadius: 10,
              fontFamily: SK.fHead, fontWeight: 700, fontSize: 14,
              textTransform: 'uppercase', letterSpacing: 1.2,
              cursor: 'pointer',
            }}>Enviar link</button>

            {errMsg && (
              <div style={{ marginTop: 10, fontSize: 12, color: SK.coral, fontWeight: 600 }}>
                {errMsg}
              </div>
            )}
            {infoMsg && (
              <div style={{ marginTop: 10, fontSize: 12, color: SK.green, fontWeight: 600 }}>
                {infoMsg}
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={onBack} style={{
              background: 'none', border: 'none', color: SK.textMute,
              fontSize: 12, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1,
            }}>Volver al login</button>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 2 — Dashboard
// ─────────────────────────────────────────────────────────────
function DashboardScreen({ onNav, onNavToCountry, stats, collection = {}, activityLog = [] }) {
  const { have, total, missing, duplicates } = stats;
  const pct = ((have / total) * 100).toFixed(1);
  const [unreadCount, setUnreadCount] = React.useState(() => window.getUnreadCount ? window.getUnreadCount() : 0);
  const [bellOpen, setBellOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(() => window.readNotifications ? window.readNotifications() : []);

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

  return (
    <PhoneShell active="home" onNav={onNav}>
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 90 }}>
        {/* Header */}
        <div style={{
          padding: '4px 20px 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Logo size={24}/>
          <button
            onClick={() => {
              setBellOpen(true);
            }}
            style={{
              background: SK.surface, border: `1px solid ${SK.border}`,
              width: 40, height: 40, borderRadius: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', cursor: 'pointer',
            }}
          >
            <Icon.Bell s={18} c={SK.text}/>
            {unreadCount > 0 && (
              <div style={{
                position: 'absolute', top: -3, right: -3,
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
        </div>

        {bellOpen && (
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 300,
              background: 'rgba(0,0,0,0.5)',
            }}
            onClick={() => setBellOpen(false)}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: SK.surface, borderRadius: '16px 16px 0 0',
                maxHeight: '70vh', overflowY: 'auto',
                padding: '16px 0 32px',
                borderTop: `1px solid ${SK.border}`,
              }}
            >
              <div style={{ width: 40, height: 4, background: SK.border, borderRadius: 2, margin: '0 auto 16px' }}/>
              <div style={{
                padding: '0 16px 8px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontFamily: SK.fHead, fontSize: 14, fontWeight: 700, color: SK.textMute, textTransform: 'uppercase' }}>Notificaciones</div>
                  {unreadCount > 0 && (
                    <span style={{
                      background: `${SK.gold}22`, color: SK.gold,
                      border: `1px solid ${SK.gold}55`,
                      borderRadius: 999, padding: '2px 8px',
                      fontFamily: SK.fMono, fontSize: 10, fontWeight: 700,
                    }}>
                      {unreadCount} nuevas
                    </span>
                  )}
                </div>
                <button
                  onClick={() => { if (window.markAllRead) window.markAllRead(); }}
                  disabled={unreadCount === 0}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${unreadCount === 0 ? SK.border : `${SK.gold}66`}`,
                    color: unreadCount === 0 ? SK.textMute : SK.gold,
                    borderRadius: 999,
                    padding: '6px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.6,
                    cursor: unreadCount === 0 ? 'default' : 'pointer',
                  }}
                >
                  Marcar todo
                </button>
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: '0 8px' }}>
                  <EmptyState icon="🔔" title="Sin notificaciones" sub="Aquí aparecerán tus logros y alertas"/>
                </div>
              ) : notifications.slice(0, 20).map((n, idx) => (
                <div key={n.id || `${n.ts}-${idx}`} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '12px 16px',
                  background: n.read ? 'transparent' : `${SK.gold}12`,
                  borderBottom: idx === Math.min(notifications.length, 20) - 1 ? 'none' : `1px solid ${SK.border}`,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 14,
                    background: n.read ? SK.bgSoft : `${SK.gold}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 15 }}>{(window.NOTIFICATION_TYPES?.[n.type] || {}).icon || '🔔'}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: SK.text, lineHeight: 1.45, paddingRight: 4 }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: SK.textMute, marginTop: 2 }}>{window.timeAgo ? window.timeAgo(n.ts) : ''}</div>
                  </div>
                  {!n.read && <div style={{ width: 8, height: 8, borderRadius: 4, background: SK.gold, marginTop: 6, flexShrink: 0 }} />}
                </div>
              ))}
            </div>
          </div>
        )}

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
            }}>MUNDIAL 2026</div>

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
            {topCountries.map(c => (
              <TeamCard key={c.code} country={c} onNavToCountry={onNavToCountry}/>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600, marginBottom: 4 }}>actividad reciente</div>
          <div style={{ fontFamily: SK.fHead, fontSize: 20, fontWeight: 700, color: SK.text, marginBottom: 12 }}>Últimos movimientos</div>
          <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, overflow: 'hidden' }}>
            {activityLog.length === 0 ? (
              <EmptyState icon="📋" title="Sin actividad" sub="Las estampas que marques aparecerán aquí"/>
            ) : activityLog.slice(0, 5).map((ev, idx, arr) => (
              <ActivityRow
                key={`${ev.ts}-${idx}`}
                icon={activityIcon(ev.type)}
                text={<span>{activityText(ev)}</span>}
                time={timeAgo(ev.ts)}
                last={idx === arr.length - 1}
              />
            ))}
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

function TeamCard({ country, onNavToCountry }) {
  const pct = Math.round((country.have / country.total) * 100);
  return (
    <button
      onClick={() => onNavToCountry?.(country.code)}
      style={{
      flexShrink: 0, width: 120,
      background: SK.surface, border: `1px solid ${SK.border}`,
      borderRadius: 12, padding: 12,
      display: 'flex', flexDirection: 'column', gap: 8,
      cursor: 'pointer', textAlign: 'left',
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
    </button>
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

Object.assign(window, { LoginScreen, RegisterScreen, ResetPasswordRequestScreen, ResetPasswordScreen, DashboardScreen, PhoneShell, BottomNav, MobileStatus, MOBILE_W, MOBILE_H });
// ─────────────────────────────────────────────────────────────
// SCREEN 1C — Reset Password
// ─────────────────────────────────────────────────────────────
function ResetPasswordScreen({ onDone }) {
  const [pwd, setPwd] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [errMsg, setErrMsg] = React.useState(null);
  const [infoMsg, setInfoMsg] = React.useState(null);
  const match = pwd && confirm && pwd === confirm;

  const handleUpdate = async () => {
    setErrMsg(null);
    setInfoMsg(null);
    if (!pwd || !confirm) { setErrMsg('Completa ambos campos.'); return; }
    if (!match) { setErrMsg('Las contraseñas no coinciden.'); return; }
    if (!window.supabase?.auth) { setErrMsg('Supabase no está configurado.'); return; }
    const { error } = await window.supabase.auth.updateUser({ password: pwd });
    if (error) { setErrMsg('No pudimos actualizar la contraseña.'); return; }
    setInfoMsg('Contraseña actualizada. Ya puedes iniciar sesión.');
    setTimeout(() => onDone && onDone(), 800);
  };

  return (
    <PhoneShell showNav={false}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '28px 24px 10px' }}>
          <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>nueva contraseña</div>
          <div style={{ fontFamily: SK.fHead, fontSize: 26, fontWeight: 700, color: SK.text, marginTop: 4 }}>Reestablecer</div>
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: SK.textMute, fontWeight: 600 }}>Nueva contraseña</label>
              <input
                type="password"
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${SK.border}`,
                  borderRadius: 8, padding: '12px 14px',
                  fontFamily: SK.fBody, fontSize: 14, color: SK.text,
                  outline: 'none', boxSizing: 'border-box',
                  marginTop: 6,
                }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: SK.textMute, fontWeight: 600 }}>Confirmar</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${match || !confirm ? SK.border : SK.coral}`,
                  borderRadius: 8, padding: '12px 14px',
                  fontFamily: SK.fBody, fontSize: 14, color: SK.text,
                  outline: 'none', boxSizing: 'border-box',
                  marginTop: 6,
                }}
              />
            </div>
            <button onClick={handleUpdate} style={{
              width: '100%', padding: '14px 0',
              background: SK.gold, color: SK.bg,
              border: 'none', borderRadius: 10,
              fontFamily: SK.fHead, fontWeight: 700, fontSize: 14,
              textTransform: 'uppercase', letterSpacing: 1.2,
              cursor: 'pointer',
            }}>Actualizar</button>

            {errMsg && (
              <div style={{ marginTop: 10, fontSize: 12, color: SK.coral, fontWeight: 600 }}>
                {errMsg}
              </div>
            )}
            {infoMsg && (
              <div style={{ marginTop: 10, fontSize: 12, color: SK.green, fontWeight: 600 }}>
                {infoMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}
