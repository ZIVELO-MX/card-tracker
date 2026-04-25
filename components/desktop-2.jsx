// Desktop — Login, Trade, Profile

const DESKTOP_W = window.DESKTOP_W || 1440;
const DESKTOP_H = window.DESKTOP_H || 900;

// ─────────────────────────────────────────────────────────────
// DESKTOP — Login (split layout)
// ─────────────────────────────────────────────────────────────
function LoginDesktop({ onLogin, onRegister, onForgot }) {
  const [email, setEmail] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const [focus, setFocus] = React.useState(null);
  const [showPwd, setShowPwd] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState(null);
  const [infoMsg, setInfoMsg] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSlowLoader, setShowSlowLoader] = React.useState(false);
  const slowLoaderTimerRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      if (slowLoaderTimerRef.current) {
        clearTimeout(slowLoaderTimerRef.current);
      }
    };
  }, []);

  const EyeIcon = ({ show }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {show
        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      }
    </svg>
  );

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
            Lleva el registro de cada estampa, detecta repetidas e intercambia con otros coleccionistas por @usuario.
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
              disabled={isSubmitting}
              placeholder=""
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
              disabled={isSubmitting}
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
              opacity: isSubmitting ? 0.55 : 1,
            }}><EyeIcon show={showPwd}/></button>
          </div>

          <div style={{ textAlign: 'right', marginBottom: 22 }}>
            <button onClick={onForgot || handleReset} style={{
              background: 'none', border: 'none', padding: 0,
              fontSize: 12, color: SK.textMute, cursor: 'pointer', fontWeight: 500,
              opacity: isSubmitting ? 0.55 : 1,
            }}>¿Olvidaste tu contraseña?</button>
          </div>

          {/* CTA */}
           <button onClick={handleSubmit} disabled={isSubmitting} style={{
              width: '100%', padding: '16px 0',
              background: isSubmitting ? `${SK.gold}cc` : SK.gold, color: SK.bg,
              border: 'none', borderRadius: 10,
              fontFamily: SK.fHead, fontWeight: 700, fontSize: 16,
              textTransform: 'uppercase', letterSpacing: 1.5,
              cursor: isSubmitting ? 'default' : 'pointer',
              boxShadow: `0 6px 18px -4px ${SK.goldDeep}`,
            }}>{isSubmitting ? 'Entrando...' : 'Entrar'}</button>

           {showSlowLoader && (
             <div style={{
               marginTop: 10,
               display: 'flex', alignItems: 'center', gap: 10,
               padding: '10px 12px',
               background: SK.surface,
               border: `1px solid ${SK.border}`,
               borderRadius: 10,
             }}>
               <LoadingSpinner size={16}/>
               <span style={{ fontSize: 12, color: SK.textMute }}>Conectando con Supabase...</span>
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

          <div style={{ fontSize: 13, color: SK.textMute, textAlign: 'center', marginTop: 28 }}>
            ¿No tienes cuenta? <span onClick={onRegister} style={{ color: SK.gold, fontWeight: 600, cursor: 'pointer' }}>Regístrate</span>
          </div>
        </div>
        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 8 }}>
            <a href="privacy.html" target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: SK.textDim, textDecoration: 'none', letterSpacing: 0.4 }}>Privacidad</a>
            <a href="terms.html" target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: SK.textDim, textDecoration: 'none', letterSpacing: 0.4 }}>Términos</a>
          </div>
          <div style={{ fontSize: 11, color: SK.textDim, letterSpacing: 0.6, textTransform: 'uppercase' }}>By ZIVELO</div>
          <div style={{ fontSize: 10, color: SK.textDim, marginTop: 4 }}>© 2026 ZIVELO. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP — Register (split layout)
// ─────────────────────────────────────────────────────────────
function RegisterDesktop({ onRegister, onLogin }) {
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

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;
    setErrMsg(null);

    const normalizeText = (text) =>
      text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

    const cleanEmail = email.trim().toLowerCase();
    const emailRe = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRe.test(cleanEmail)) {
      setErrMsg('El email no es válido. Debe tener formato: nombre@dominio.com');
      return;
    }
    const blockedDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'throwaway.email'];
    if (blockedDomains.includes(cleanEmail.split('@')[1]?.toLowerCase())) {
      setErrMsg('No aceptamos emails desechables. Usa un email permanente.');
      return;
    }

    if (pwd.length < 6) {
      setErrMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);
    const cleanName     = normalizeText(name);
    const cleanUsername = normalizeText(username).replace(/\s+/g, '').toLowerCase();
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
        email: cleanEmail,
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
          setErrMsg('Ese email ya está registrado. Inicia sesión o usa otro correo.');
        } else if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('email')) {
          setErrMsg('Revisa el email e intenta de nuevo.');
        } else {
          setErrMsg('No pudimos crear la cuenta. Intenta nuevamente.');
        }
        return;
      }
      // Si Supabase retorna user sin identities = email enumeration protection activo
      // (el email ya existía pero Supabase no revela el error — igual envía un correo)
      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        setErrMsg('Ese email ya está registrado. Inicia sesión o usa otro correo.');
        return;
      }
      if (data?.user) {
        // Intentar crear/actualizar el perfil. Si falla por RLS (sin sesión activa),
        // el perfil se creará via trigger o al primer login. No bloquear el flujo.
        const { error: profileErr } = await window.supabase.from('profiles').upsert({
          id: data.user.id,
          username: cleanUsername,
          display_name: cleanName,
          email: cleanEmail,
          country_code: selectedCountry?.code || null,
          terms_accepted_at: new Date().toISOString(),
          privacy_accepted_at: new Date().toISOString(),
        }, { onConflict: 'id' });
        if (profileErr) {
          if (profileErr.code === '23505') {
            if (profileErr.message?.includes('username')) {
              setErrMsg('Ese usuario ya existe. Elegí otro.');
              return;
            } else if (profileErr.message?.includes('phone')) {
              setErrMsg('Ese número ya está registrado.');
              return;
            }
            // Otro conflicto único — la cuenta se creó igual, mostrar confirmación
          }
          // Si el error es de permisos (RLS sin sesión activa), no bloquear el flujo
        }
        // Intentar guardar whatsapp/phone independientemente del resultado del upsert
        if (cleanWhatsapp) {
          await window.supabase
            .from('profiles')
            .update({ phone: cleanWhatsapp, whatsapp: cleanWhatsapp })
            .eq('id', data.user.id);
        }
        // Supabase requiere confirmación de email — session es null hasta que confirmen
        // signUp fue exitoso — el correo de confirmación ya fue enviado por Supabase
        if (!data.session) {
          setEmailSent(true);
          return;
        }
        onRegister({ id: data.user.id, name: cleanName, username: cleanUsername, country: selectedCountry, whatsapp: cleanWhatsapp || null, email: cleanEmail });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const EyeIcon = ({ show }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {show
        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      }
    </svg>
  );


  if (emailSent) return (
    <div style={{
      width: DESKTOP_W, height: DESKTOP_H,
      background: SK.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: SK.text, fontFamily: SK.fBody,
      position: 'relative',
    }}>
      {/* Fondo difuminado */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: HEX_PATTERN, opacity: 0.5 }}/>

      {/* Modal centrado */}
      <div style={{
        position: 'relative', zIndex: 10,
        background: SK.surface,
        border: `1px solid ${SK.border}`,
        borderRadius: 20,
        padding: '48px 52px',
        maxWidth: 480, width: '100%',
        textAlign: 'center',
        boxShadow: `0 32px 80px rgba(0,0,0,0.5)`,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: `${SK.gold}22`, border: `2px solid ${SK.gold}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: 32,
        }}>✉️</div>

        <div style={{ fontFamily: SK.fHead, fontWeight: 700, fontSize: 30, color: SK.text, marginBottom: 12 }}>
          ¡Revisa tu correo!
        </div>
        <div style={{ fontSize: 14, color: SK.textMute, lineHeight: 1.6, marginBottom: 8 }}>
          Te enviamos un link de confirmación a
        </div>
        <div style={{ fontFamily: SK.fMono, fontSize: 15, color: SK.gold, fontWeight: 600, marginBottom: 20 }}>
          {cleanEmail || email}
        </div>
        <div style={{ fontSize: 13, color: SK.textMute, lineHeight: 1.7, marginBottom: 36 }}>
          Haz clic en el enlace del correo para activar tu cuenta.
          Revisa también la carpeta de <strong style={{ color: SK.text }}>spam</strong> si no lo ves.
        </div>

        <button onClick={onLogin} style={{
          width: '100%', padding: '14px 32px', background: SK.gold, color: SK.bg,
          border: 'none', borderRadius: 10,
          fontFamily: SK.fHead, fontWeight: 700, fontSize: 15,
          textTransform: 'uppercase', letterSpacing: 1.2, cursor: 'pointer',
        }}>Ir al inicio de sesión</button>
      </div>
    </div>
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
      <div style={{ flex: 1, padding: '20px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
        <div style={{ maxWidth: 380, width: '100%', margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600 }}>
            Crea tu cuenta
          </div>
          <div style={{ fontFamily: SK.fHead, fontWeight: 700, fontSize: 36, color: SK.text, marginTop: 6, marginBottom: 16 }}>
            Regístrate gratis
          </div>

          {/* Nombre (display name) */}
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <label style={{
              position: 'absolute', left: 16,
              top: (focus === 'name' || name) ? 8 : 22,
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
              style={{
                width: '100%', background: SK.surface,
                border: `1px solid ${focus === 'name' ? SK.gold : SK.border}`,
                borderRadius: 10, padding: '26px 16px 10px',
                fontFamily: SK.fBody, fontSize: 14, color: SK.text,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
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
            {(focus === 'username' || username) && (
              <span style={{
                position: 'absolute', left: 16, bottom: 11,
                fontSize: 14, color: SK.textMute, pointerEvents: 'none',
                fontFamily: SK.fBody, lineHeight: 1,
              }}>@</span>
            )}
            <input
              value={username}
              onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
              onFocus={() => setFocus('username')} onBlur={() => setFocus(null)}
              style={{
                width: '100%', background: SK.surface,
                border: `1px solid ${focus === 'username' ? SK.gold : SK.border}`,
                borderRadius: 10, padding: '26px 16px 10px',
                paddingLeft: (focus === 'username' || username) ? 28 : 16,
                fontFamily: SK.fMono, fontSize: 14, color: SK.text,
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

          {/* WhatsApp */}
          <div style={{ marginBottom: 22, position: 'relative' }}>
            <label style={{
              position: 'absolute', left: 84,
              top: (focus === 'whatsapp' || whatsapp) ? 8 : 22,
              fontSize: (focus === 'whatsapp' || whatsapp) ? 10 : 14,
              color: focus === 'whatsapp' ? SK.gold : SK.textMute,
              fontFamily: SK.fBody, fontWeight: 500,
              transition: 'all 0.15s', pointerEvents: 'none',
              textTransform: (focus === 'whatsapp' || whatsapp) ? 'uppercase' : 'none',
              letterSpacing: (focus === 'whatsapp' || whatsapp) ? 0.8 : 0,
              zIndex: 1,
            }}>WhatsApp <span style={{ color: SK.textDim, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>(opcional)</span></label>

            {/* Flag + dial code prefix */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: 76,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
              borderRight: `1px solid ${focus === 'whatsapp' ? SK.gold : SK.border}`,
              pointerEvents: 'none',
              transition: 'border-color 0.15s',
            }}>
              {selectedCountry ? (
                <>
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{selectedCountry.flag}</span>
                  <span style={{ fontSize: 10, fontFamily: SK.fMono, color: SK.textMute, lineHeight: 1 }}>+{selectedCountry.dial}</span>
                </>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#25D366' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.132.558 4.13 1.532 5.864L.073 23.927l6.184-1.622A11.935 11.935 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 0 1-5.003-1.372l-.358-.213-3.716.974.993-3.62-.234-.373A9.794 9.794 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                </svg>
              )}
            </div>

            <input
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value.replace(/[^\d\s\-\+\(\)]/g, ''))}
              onFocus={() => setFocus('whatsapp')}
              onBlur={() => setFocus(null)}
              placeholder=""
              style={{
                width: '100%', background: SK.surface,
                border: `1px solid ${focus === 'whatsapp' ? SK.gold : SK.border}`,
                borderRadius: 10, padding: '26px 16px 10px 84px',
                fontFamily: SK.fMono, fontSize: 14, color: SK.text,
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
            />
          </div>

           {/* Legal */}
           <div style={{ marginBottom: 16 }}>
             <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
               <input
                 type="checkbox"
                 checked={acceptTerms}
                 onChange={e => setAcceptTerms(e.target.checked)}
                 style={{ marginTop: 3 }}
               />
               <span style={{ fontSize: 12, color: SK.textMute, lineHeight: 1.4 }}>
                 Acepto los <a href="terms.html" target="_blank" rel="noreferrer" style={{ color: SK.gold, fontWeight: 600, textDecoration: 'none' }}>Términos y Condiciones</a>.
               </span>
             </label>
             <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginTop: 10 }}>
               <input
                 type="checkbox"
                 checked={acceptPrivacy}
                 onChange={e => setAcceptPrivacy(e.target.checked)}
                 style={{ marginTop: 3 }}
               />
               <span style={{ fontSize: 12, color: SK.textMute, lineHeight: 1.4 }}>
                 Acepto la <a href="privacy.html" target="_blank" rel="noreferrer" style={{ color: SK.gold, fontWeight: 600, textDecoration: 'none' }}>Política de Privacidad</a>.
               </span>
             </label>
           </div>

           {/* CTA */}
           <button onClick={handleSubmit} disabled={isSubmitting || !canSubmit} style={{
              width: '100%', padding: '16px 0',
              background: (canSubmit && !isSubmitting) ? SK.gold : SK.border,
              color: (canSubmit && !isSubmitting) ? SK.bg : SK.textMute,
              border: 'none', borderRadius: 10,
             fontFamily: SK.fHead, fontWeight: 700, fontSize: 16,
             textTransform: 'uppercase', letterSpacing: 1.5,
             cursor: (canSubmit && !isSubmitting) ? 'pointer' : 'default',
             boxShadow: (canSubmit && !isSubmitting) ? `0 6px 18px -4px ${SK.goldDeep}` : 'none',
             transition: 'all 0.2s',
           }}>{isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}</button>

           {errMsg && (
             <div style={{ marginTop: 10, fontSize: 12, color: SK.coral, fontWeight: 600, textAlign: 'center' }}>
               {errMsg}
             </div>
           )}

          <div style={{ fontSize: 13, color: SK.textMute, textAlign: 'center', marginTop: 24 }}>
            ¿Ya tienes cuenta? <span onClick={onLogin} style={{ color: SK.gold, fontWeight: 600, cursor: 'pointer' }}>Inicia sesión</span>
          </div>
        </div>
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 8 }}>
            <a href="privacy.html" target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: SK.textDim, textDecoration: 'none', letterSpacing: 0.4 }}>Privacidad</a>
            <a href="terms.html" target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: SK.textDim, textDecoration: 'none', letterSpacing: 0.4 }}>Términos</a>
          </div>
          <div style={{ fontSize: 11, color: SK.textDim, letterSpacing: 0.6, textTransform: 'uppercase' }}>By ZIVELO</div>
          <div style={{ fontSize: 10, color: SK.textDim, marginTop: 4 }}>© 2026 ZIVELO. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP — Reset Password (request + update)
// ─────────────────────────────────────────────────────────────
function ResetPasswordRequestDesktop({ onBack }) {
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
    <div style={{
      width: DESKTOP_W, height: DESKTOP_H,
      background: SK.bg, display: 'flex',
      color: SK.text, fontFamily: SK.fBody, overflow: 'hidden',
    }}>
      <div style={{ flex: 1, padding: '48px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600 }}>
            reestablecer
          </div>
          <div style={{ fontFamily: SK.fHead, fontWeight: 700, fontSize: 32, color: SK.text, marginTop: 6, marginBottom: 24 }}>
            Recuperar contraseña
          </div>

          <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 16, padding: 22 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: SK.textMute, fontWeight: 600 }}>Email</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${SK.border}`,
                  borderRadius: 10, padding: '12px 14px',
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

          <div style={{ marginTop: 18, textAlign: 'center' }}>
            <button onClick={onBack} style={{
              background: 'none', border: 'none', color: SK.textMute,
              fontSize: 12, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1,
            }}>Volver al login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordDesktop({ onDone }) {
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
    <div style={{
      width: DESKTOP_W, height: DESKTOP_H,
      background: SK.bg, display: 'flex',
      color: SK.text, fontFamily: SK.fBody, overflow: 'hidden',
    }}>
      <div style={{ flex: 1, padding: '48px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600 }}>
            nueva contraseña
          </div>
          <div style={{ fontFamily: SK.fHead, fontWeight: 700, fontSize: 32, color: SK.text, marginTop: 6, marginBottom: 24 }}>
            Elige una nueva contraseña
          </div>

          <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 16, padding: 22 }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: SK.textMute, fontWeight: 600 }}>Nueva contraseña</label>
              <input
                type="password"
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${SK.border}`,
                  borderRadius: 10, padding: '12px 14px',
                  fontFamily: SK.fBody, fontSize: 14, color: SK.text,
                  outline: 'none', boxSizing: 'border-box',
                  marginTop: 6,
                }}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: SK.textMute, fontWeight: 600 }}>Confirmar contraseña</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${match || !confirm ? SK.border : SK.coral}`,
                  borderRadius: 10, padding: '12px 14px',
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
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP — Trade (two-column)
// ─────────────────────────────────────────────────────────────
function TradeDesktop({ onNav, theme, onToggleTheme, collection = {}, userData, stats = null, tradeOffers = [], onTradeOffersChange = () => {}, userId = null, tradeUser = null, onTradeUserConsumed = () => {} }) {
  const [tab, setTab] = React.useState('scan');

  return (
    <DesktopShell active="trade" onNav={onNav} title="Intercambios" sub={`Trade · ${Object.values(collection).filter(q => q >= 2).length} repetidas disponibles`} theme={theme} onToggleTheme={onToggleTheme} userData={userData} stats={stats}>
      <div style={{ padding: '28px 36px' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 24, borderBottom: `1px solid ${SK.border}`, marginBottom: 24 }}>
          {[['scan', 'Buscar @'], ['history', 'Historial']].map(([id, label]) => {
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

        {tab === 'scan' && (
          <TradeScanDesktop
            collection={collection}
            userId={userId}
            onTradeOffersChange={onTradeOffersChange}
            initialUser={tradeUser}
            onInitialUserConsumed={onTradeUserConsumed}
            tradeOffers={tradeOffers}
          />
        )}
        {tab === 'history' && (
          <TradeHistoryDesktop
            tradeOffers={tradeOffers}
            userId={userId}
            onTradeOffersChange={onTradeOffersChange}
          />
        )}
      </div>
    </DesktopShell>
  );
}

function stickerInfoFromId(id) {
  const country = COUNTRIES.find(c => id.startsWith(c.code) && /^\d+$/.test(id.slice(c.code.length)));
  if (country) {
    const num = parseInt(id.slice(country.code.length), 10);
    const type = num === 1 ? 'escudo' : (num === 13 ? 'equipo' : 'jugador');
    const label = num === 1 ? `Escudo · ${country.name}` : num === 13 ? 'Foto Equipo' : `Jugador #${String(num).padStart(2,'0')}`;
    let position = null;
    if (num === 2) position = 'POR';
    else if (num >= 3 && num <= 7) position = 'DEF';
    else if ((num >= 8 && num <= 12) || num === 14) position = 'MED';
    else if (num >= 15 && num <= 20) position = 'DEL';
    return { num, label, country, type, subtype: null, position };
  }
  if (id.startsWith('FWC')) {
    const num = parseInt(id.slice(3), 10);
    const subtype = num % 2 === 0 ? 'trophy' : 'stadium';
    return { num, label: `FWC · #${id.slice(3)}`, country: null, type: 'especial', subtype };
  }
  if (id.startsWith('CC')) {
    const num = parseInt(id.slice(2), 10);
    const subtype = num % 2 === 0 ? 'stadium' : 'trophy';
    return { num, label: `Coca-Cola · #${id.slice(2)}`, country: null, type: 'especial', subtype };
  }
  return { num: 0, label: id, country: null, type: 'jugador', subtype: null };
}

function TradeScanDesktop({ collection = {}, userId = null, onTradeOffersChange = () => {}, initialUser = null, onInitialUserConsumed = () => {}, tradeOffers = [] }) {
  const [query, setQuery] = React.useState(initialUser ? `@${initialUser}` : '');
  const [loading, setLoading] = React.useState(false);
  const [partner, setPartner] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [fromItems, setFromItems] = React.useState([]);
  const [toItems, setToItems] = React.useState([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [recentPartners, setRecentPartners] = React.useState([]);

  // Calcular los últimos 5 usuarios con quienes se hizo trade (accepted)
  React.useEffect(() => {
    if (!userId || !window.supabase?.from) return;
    const accepted = (tradeOffers || [])
      .filter(o => o.status === 'accepted' && (o.from_user === userId || o.to_user === userId))
      .sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0));
    // IDs únicos del otro usuario, máximo 5
    const seen = new Set();
    const partnerIds = [];
    for (const o of accepted) {
      const pid = o.from_user === userId ? o.to_user : o.from_user;
      if (pid && !seen.has(pid)) { seen.add(pid); partnerIds.push(pid); }
      if (partnerIds.length >= 5) break;
    }
    if (partnerIds.length === 0) { setRecentPartners([]); return; }
    window.supabase.from('profiles')
      .select('id, username, display_name')
      .in('id', partnerIds)
      .then(({ data }) => {
        if (!data) return;
        // Preservar el orden (más reciente primero)
        const byId = Object.fromEntries(data.map(p => [p.id, p]));
        setRecentPartners(partnerIds.map(id => byId[id]).filter(Boolean));
      });
  }, [tradeOffers, userId]);

  // Función compartida de búsqueda por username
  async function searchUser(username) {
    if (!window.supabase?.from) return;
    setLoading(true);
    setError(null);
    setPartner(null);
    try {
      const { data: profile, error: pErr } = await window.supabase
        .from('profiles')
        .select('id, username, display_name')
        .ilike('username', username)
        .maybeSingle();
      if (pErr || !profile) { setError('Usuario no encontrado'); return; }
      if (profile.id === userId) { setError('Ese usuario eres tú. Busca otro coleccionista.'); return; }
      const { data: colData } = await window.supabase
        .from('collections').select('sticker_id, quantity').eq('user_id', profile.id).gte('quantity', 1);
      const collectionMap = {};
      (colData || []).forEach(r => { collectionMap[r.sticker_id] = r.quantity; });
      const duplicates = (colData || []).filter(r => r.quantity >= 2).map(r => ({ id: r.sticker_id, qty: r.quantity, ...stickerInfoFromId(r.sticker_id) }));
      setPartner({ id: profile.id, username: profile.username, name: profile.display_name || profile.username, duplicates, collectionMap });
    } catch {
      setError('No pudimos completar la búsqueda. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  // Auto-buscar cuando viene un usuario desde el link compartido
  React.useEffect(() => {
    if (!initialUser) return;
    onInitialUserConsumed();
    searchUser(initialUser);
  }, [initialUser]);

  const cleanQuery = query.replace(/^@/, '').replace(/[^a-z0-9_.]/gi, '').toLowerCase().slice(0, 30);
  const canSearch = cleanQuery.length >= 2 && !loading;

  const myDuplicates = React.useMemo(() =>
    Object.entries(collection)
      .filter(([, qty]) => qty >= 2)
      .map(([id, qty]) => ({ id, qty, ...stickerInfoFromId(id) })),
    [collection]
  );

  const iNeedFromPartner = React.useMemo(() => {
    if (!partner) return [];
    return partner.duplicates.filter(d => (collection[d.id] || 0) === 0);
  }, [partner, collection]);

  const theyNeedFromMe = React.useMemo(() => {
    if (!partner) return [];
    return myDuplicates.filter(d => (partner.collectionMap?.[d.id] || 0) === 0);
  }, [myDuplicates, partner]);

  const togglePick = (list, setList, id) => {
    setList(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  async function handleSearch() {
    if (!canSearch) return;
    await searchUser(cleanQuery);
  }

  async function handlePropose() {
    if (!userId || !partner?.id || fromItems.length === 0 || toItems.length === 0) return;
    setSubmitting(true);
    const { data, error: proposeErr } = await window.proposeTrade(
      userId,
      partner.id,
      fromItems.map(id => ({ id, qty: 1 })),
      toItems.map(id => ({ id, qty: 1 }))
    );
    setSubmitting(false);
    if (proposeErr) {
      setError('No se pudo enviar la propuesta.');
      return;
    }
    if (data?.id) onTradeOffersChange(prev => [data, ...(prev || [])]);
    setModalOpen(false);
    setFromItems([]);
    setToItems([]);
    setError(null);
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600, marginBottom: 4 }}>buscar coleccionista</div>
          <div style={{ fontFamily: SK.fHead, fontSize: 22, fontWeight: 700, color: SK.text, marginBottom: 16 }}>Conectar por @usuario</div>

          {/* Accesos rápidos: últimos trades */}
          {recentPartners.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600, marginBottom: 8 }}>Trades recientes</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {recentPartners.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setQuery(`@${p.username}`); searchUser(p.username); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '7px 12px',
                      background: SK.surface, border: `1px solid ${SK.border}`,
                      borderRadius: 20, cursor: 'pointer',
                      fontFamily: SK.fMono, fontSize: 12, color: SK.text,
                      transition: 'border-color 0.15s, background 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = SK.gold; e.currentTarget.style.background = SK.bgSoft; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = SK.border; e.currentTarget.style.background = SK.surface; }}
                  >
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: SK.gold, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, color: SK.bg, flexShrink: 0,
                      fontFamily: SK.fHead,
                    }}>
                      {(p.username || '?')[0].toUpperCase()}
                    </div>
                    <span>@{p.username}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, padding: 20, marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: SK.textMute, marginBottom: 12, lineHeight: 1.4 }}>
              Ingresa el nombre de usuario del coleccionista para ver sus repetidas y proponer un intercambio.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontFamily: SK.fMono, fontSize: 14, color: SK.textMute, pointerEvents: 'none' }}>@</span>
                <input
                  value={cleanQuery}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="usuario"
                  style={{ width: '100%', background: SK.bgSoft, border: `1px solid ${SK.border}`, borderRadius: 10, padding: '10px 12px 10px 28px', fontFamily: SK.fMono, fontSize: 13, color: SK.text, outline: 'none' }}
                />
              </div>
              <button
                disabled={!canSearch}
                onClick={handleSearch}
                style={{ padding: '10px 18px', background: canSearch ? SK.gold : SK.border, color: canSearch ? SK.bg : SK.textMute, border: 'none', borderRadius: 10, fontFamily: SK.fHead, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, cursor: canSearch ? 'pointer' : 'default', whiteSpace: 'nowrap' }}
              >{loading ? 'Buscando...' : 'Buscar'}</button>
            </div>
            {error && <div style={{ marginTop: 10, fontSize: 12, color: SK.coral, fontWeight: 600 }}>{error}</div>}
          </div>

          {partner && (
            <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: SK.fMono, fontSize: 14, color: SK.text }}>@{partner.username}</div>
                  <div style={{ fontSize: 12, color: SK.textMute, marginTop: 2 }}>{partner.name}</div>
                </div>
                <button
                  onClick={() => setModalOpen(true)}
                  disabled={!iNeedFromPartner.length || !theyNeedFromMe.length || !userId}
                  style={{ padding: '10px 14px', background: (!iNeedFromPartner.length || !theyNeedFromMe.length || !userId) ? SK.border : SK.gold, color: (!iNeedFromPartner.length || !theyNeedFromMe.length || !userId) ? SK.textMute : SK.bg, border: 'none', borderRadius: 8, fontFamily: SK.fHead, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, cursor: (!iNeedFromPartner.length || !theyNeedFromMe.length || !userId) ? 'default' : 'pointer' }}
                >Proponer trade</button>
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: SK.textMute }}>
                Matches: {iNeedFromPartner.length} que te faltan · {theyNeedFromMe.length} que le faltan
              </div>
            </div>
          )}
        </div>

        <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, padding: 20, minHeight: 400 }}>
          {!partner ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 360, gap: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 48 }}>🔍</div>
              <div style={{ fontFamily: SK.fHead, fontSize: 18, fontWeight: 700, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 0.5 }}>Busca un coleccionista</div>
              <div style={{ fontSize: 13, color: SK.textDim, maxWidth: 260, lineHeight: 1.5 }}>Aquí aparecerán las repetidas disponibles y las que te faltan del usuario buscado.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 8 }}>Sus repetidas que te faltan</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {iNeedFromPartner.length === 0 ? <span style={{ fontSize: 12, color: SK.textDim }}>No hay matches en este lado.</span> : iNeedFromPartner.map(d => (
                    <span key={d.id} style={{ fontSize: 11, color: SK.text, background: SK.bgSoft, border: `1px solid ${SK.border}`, borderRadius: 8, padding: '4px 8px' }}>{d.id} · x{d.qty}</span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 8 }}>Tus repetidas que le faltan</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {theyNeedFromMe.length === 0 ? <span style={{ fontSize: 12, color: SK.textDim }}>No hay matches en este lado.</span> : theyNeedFromMe.map(d => (
                    <span key={d.id} style={{ fontSize: 11, color: SK.text, background: SK.bgSoft, border: `1px solid ${SK.border}`, borderRadius: 8, padding: '4px 8px' }}>{d.id} · x{d.qty}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setModalOpen(false)}>
          <div style={{ width: 760, maxWidth: '95%', background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 16, padding: 20 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: SK.fHead, fontSize: 18, fontWeight: 700, color: SK.text, textTransform: 'uppercase' }}>Proponer intercambio</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
              <div>
                <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 8 }}>Ofreces</div>
                <div style={{ maxHeight: 240, overflow: 'auto', border: `1px solid ${SK.border}`, borderRadius: 10 }}>
                  {theyNeedFromMe.map(d => (
                    <label key={d.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 10px', borderBottom: `1px solid ${SK.border}` }}>
                      <input type="checkbox" checked={fromItems.includes(d.id)} onChange={() => togglePick(fromItems, setFromItems, d.id)}/>
                      <span style={{ fontFamily: SK.fMono, fontSize: 12, color: SK.text }}>{d.id}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 8 }}>Solicitas</div>
                <div style={{ maxHeight: 240, overflow: 'auto', border: `1px solid ${SK.border}`, borderRadius: 10 }}>
                  {iNeedFromPartner.map(d => (
                    <label key={d.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 10px', borderBottom: `1px solid ${SK.border}` }}>
                      <input type="checkbox" checked={toItems.includes(d.id)} onChange={() => togglePick(toItems, setToItems, d.id)}/>
                      <span style={{ fontFamily: SK.fMono, fontSize: 12, color: SK.text }}>{d.id}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
              <button onClick={() => setModalOpen(false)} style={{ padding: '10px 14px', background: 'transparent', border: `1px solid ${SK.border}`, color: SK.text, borderRadius: 8, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handlePropose} disabled={submitting || fromItems.length === 0 || toItems.length === 0} style={{ padding: '10px 14px', background: (submitting || fromItems.length === 0 || toItems.length === 0) ? SK.border : SK.gold, color: (submitting || fromItems.length === 0 || toItems.length === 0) ? SK.textMute : SK.bg, border: 'none', borderRadius: 8, cursor: (submitting || fromItems.length === 0 || toItems.length === 0) ? 'default' : 'pointer' }}>{submitting ? 'Enviando...' : 'Enviar propuesta'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TradeHistoryDesktop({ tradeOffers = [], userId = null, onTradeOffersChange = () => {} }) {
  const accepted = tradeOffers.filter(o => o.status === 'accepted');
  const pendingReceived = tradeOffers.filter(o => o.to_user === userId && o.status === 'pending');

  const applyStatus = (offerId, nextStatus) => {
    onTradeOffersChange(prev => (prev || []).map(o => o.id === offerId ? { ...o, status: nextStatus, updated_at: new Date().toISOString() } : o));
  };

  const handleRespond = async (offerId, accept) => {
    const { error } = await window.respondToOffer(offerId, accept);
    if (!error) applyStatus(offerId, accept ? 'accepted' : 'rejected');
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>historial</div>
      <div style={{ fontFamily: SK.fHead, fontSize: 22, fontWeight: 700, color: SK.text, marginTop: 2, marginBottom: 14 }}>{accepted.length} intercambios aceptados</div>

      {pendingReceived.length > 0 && (
        <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 8 }}>Ofertas recibidas pendientes</div>
          {pendingReceived.map(o => {
            const partner = o.from_profile?.username || 'usuario';
            return (
              <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 0', borderTop: `1px solid ${SK.border}` }}>
                <div style={{ fontSize: 12, color: SK.text }}>@{partner} · ofrece {o.from_items?.length || 0} / pide {o.to_items?.length || 0}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleRespond(o.id, false)} style={{ padding: '6px 10px', border: `1px solid ${SK.coral}55`, background: 'transparent', color: SK.coral, borderRadius: 6, cursor: 'pointer' }}>Rechazar</button>
                  <button onClick={() => handleRespond(o.id, true)} style={{ padding: '6px 10px', border: 'none', background: SK.gold, color: SK.bg, borderRadius: 6, cursor: 'pointer' }}>Aceptar</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, overflow: 'hidden' }}>
        {accepted.length === 0 ? (
          <EmptyState icon="🤝" title="Sin intercambios aceptados" sub="Cuando cierres un trato aparecerá aquí"/>
        ) : accepted.slice(0, 20).map((o, i) => {
          const isFromMe = o.from_user === userId;
          const partner = isFromMe ? (o.to_profile?.username || 'usuario') : (o.from_profile?.username || 'usuario');
          const given = isFromMe ? (o.from_items?.length || 0) : (o.to_items?.length || 0);
          const got = isFromMe ? (o.to_items?.length || 0) : (o.from_items?.length || 0);
          const net = got - given;
          const tone = net > 0 ? SK.green : net < 0 ? SK.coral : SK.textMute;
          return (
            <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 100px 100px 80px', padding: '14px 18px', gap: 12, borderBottom: i < Math.min(accepted.length, 20) - 1 ? `1px solid ${SK.border}` : 'none', alignItems: 'center' }}>
              <div style={{ fontFamily: SK.fMono, fontSize: 11, color: SK.textMute }}>{window.timeAgo ? window.timeAgo(new Date(o.created_at).getTime()) : ''}</div>
              <div style={{ fontFamily: SK.fMono, fontSize: 12, color: SK.text }}>@{partner}</div>
              <div style={{ fontFamily: SK.fMono, fontSize: 12, color: SK.textMute }}>↑ {given}</div>
              <div style={{ fontFamily: SK.fMono, fontSize: 12, color: SK.textMute }}>↓ {got}</div>
              <div style={{ fontFamily: SK.fMono, fontSize: 12, color: tone, textAlign: 'right', fontWeight: 700 }}>{net > 0 ? `+${net}` : `${net}`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP — Profile
// ─────────────────────────────────────────────────────────────
function ProfileDesktop({ onNav, stats, achievements = [], userData, theme, onToggleTheme, onUpdateUser = () => {}, collection = {}, activityLog = [], tradeOffers = [], userId = null }) {
  const { have, total, duplicates } = stats;
  const pct = ((have / total) * 100).toFixed(1);
  const [editOpen, setEditOpen] = React.useState(false);

  const user = userData || {};
  const safeName = (user.name || user.username || 'Coleccionista').trim();
  const safeUsername = (user.username || 'usuario').trim();
  const initials = safeName.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const recentStickerItems = React.useMemo(() => {
    const ids = [];
    const seen = new Set();
    for (const ev of activityLog) {
      if (ev.type !== 'add' && ev.type !== 'dup') continue;
      if (!ev.id || seen.has(ev.id)) continue;
      ids.push(ev.id);
      seen.add(ev.id);
      if (ids.length >= 3) break;
    }
    const fallbackIds = Object.entries(collection)
      .filter(([, qty]) => qty >= 1)
      .map(([id]) => id)
      .reverse();
    for (const id of fallbackIds) {
      if (ids.length >= 3) break;
      if (!ids.includes(id)) ids.push(id);
    }
    return ids.slice(0, 3).map(id => {
      const qty = collection[id] || 1;
      const info = stickerInfoFromId(id);
      return { id, qty, info };
    });
  }, [activityLog, collection]);

  const tradeCount = React.useMemo(() =>
    (tradeOffers || []).filter(o => o.status === 'accepted' && (o.from_user === userId || o.to_user === userId)).length,
    [tradeOffers, userId]
  );

  return (
    <>
    <DesktopShell active="profile" onNav={onNav} title="Perfil" sub="Tu identidad de coleccionista" theme={theme} onToggleTheme={onToggleTheme} userData={userData}>
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
            <div style={{ border: `3px solid ${SK.gold}`, borderRadius: 60, boxShadow: `0 8px 24px -6px ${SK.goldDeep}` }}>
              <AvatarBubble userData={user} size={120} />
            </div>
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
              Coleccionista en Stickio
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <div style={{ fontFamily: SK.fHead, fontSize: 38, fontWeight: 700, color: SK.text, lineHeight: 1 }}>
                {safeName}
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
            <div style={{ fontFamily: SK.fMono, fontSize: 14, color: SK.textMute, marginTop: 6 }}>@{safeUsername}</div>
            {userData?.bio && (
              <div style={{ fontSize: 14, color: SK.textMute, marginTop: 14, lineHeight: 1.5, maxWidth: 480 }}>
                {userData.bio}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button onClick={() => setEditOpen(true)} style={{
                padding: '10px 20px', background: SK.gold, color: SK.bg,
                border: 'none', borderRadius: 10,
                fontFamily: SK.fHead, fontWeight: 700, fontSize: 13,
                textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
              }}>Editar perfil</button>
              <button onClick={() => {
                const username = userData?.username;
                if (!username) return;
                const base = window.location.origin + window.location.pathname;
                const link = `${base}#trade=@${username}`;
                const msg = `¡Hola! Te invito a intercambiar figuritas conmigo en Stickio.\nMirá mis repetidas y proponé un trade aquí: ${link}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
              }} style={{
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
          <ProfileStat label="Intercambios" value={tradeCount} sub="realizados" color={SK.text} icon={<Icon.Swap s={14} c={SK.gold}/>}/>
          <ProfileStat label="Países" value={`${stats.countriesComplete ?? 0}/${COUNTRIES.length}`} sub="completos" color={SK.green}/>
        </div>

        {/* Two-column: achievements + foil */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>logros</div>
            <div style={{ fontFamily: SK.fHead, fontSize: 22, fontWeight: 700, color: SK.text, marginTop: 2, marginBottom: 14 }}>Insignias</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {(achievements.length ? achievements : [
                { id: 'first', label: 'Primera', desc: 'Estampa', unlocked: true, icon: 'star' },
                { id: 'pct25', label: '25%', desc: 'Del álbum', unlocked: false, icon: 'pct' },
                { id: 'pct50', label: '50%', desc: 'Del álbum', unlocked: false, icon: 'pct' },
                { id: 'complete', label: '100%', desc: 'Completo', unlocked: false, icon: 'trophy' },
                { id: 'dup5', label: '5', desc: 'Repetidas', unlocked: false, icon: 'swap' },
                { id: 'dup20', label: '20', desc: 'Repetidas', unlocked: false, icon: 'swap' },
                { id: 'country1', label: '1', desc: 'Pais completo', unlocked: false, icon: 'star' },
                { id: 'country5', label: '5', desc: 'Paises completos', unlocked: false, icon: 'star' },
              ]).map(a => (
                <Badge key={a.id} label={a.label} desc={a.desc} unlocked={a.unlocked} locked={!a.unlocked} icon={a.icon}/>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>recientes</div>
            <div style={{ fontFamily: SK.fHead, fontSize: 22, fontWeight: 700, color: SK.text, marginTop: 2, marginBottom: 14 }}>Últimas marcadas</div>
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
    <EditProfileModal
      open={editOpen}
      onClose={() => setEditOpen(false)}
      userData={userData}
      onSave={onUpdateUser}
    />
    </>
  );
}

Object.assign(window, { LoginDesktop, RegisterDesktop, ResetPasswordRequestDesktop, ResetPasswordDesktop, TradeDesktop, ProfileDesktop, stickerInfoFromId });
