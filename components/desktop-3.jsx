// Desktop — Marketplace
// Tabs: Feed | Nueva publicación | Mis publicaciones

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function typeLabel(type) {
  if (type === 'have')     return { text: 'Tengo',      color: SK.green  };
  if (type === 'want')     return { text: 'Necesito',   color: SK.coral  };
  if (type === 'exchange') return { text: 'Intercambio',color: SK.gold   };
  return { text: type, color: SK.textMute };
}

function relativeTime(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)       return 'hace un momento';
  if (diff < 3600)     return `hace ${Math.floor(diff / 60)}m`;
  if (diff < 86400)    return `hace ${Math.floor(diff / 3600)}h`;
  return `hace ${Math.floor(diff / 86400)}d`;
}

function countryFlag(code) {
  if (!code) return null;
  const c = COUNTRIES.find(c => c.code === code);
  return c ? c.flag : null;
}

// ─────────────────────────────────────────────────────────────
// ListingCard — used in Feed
// ─────────────────────────────────────────────────────────────
function ListingCard({ listing, onContact, userId }) {
  const { text: typeText, color: typeColor } = typeLabel(listing.type);
  const displayUser = listing.profile?.username || listing.userName || '—';
  const initials = displayUser.slice(0, 2).toUpperCase();
  const isActive = listing.status === 'active';

  return (
    <div style={{
      background: SK.surface,
      border: `1px solid ${isActive ? SK.border : SK.border + '66'}`,
      borderRadius: 14,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      opacity: isActive ? 1 : 0.6,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Closed badge */}
      {!isActive && (
        <div style={{
          position: 'absolute', top: 0, right: 0,
          background: SK.textDim, color: SK.bg,
          fontFamily: SK.fMono, fontSize: 9, fontWeight: 700,
          padding: '4px 10px', borderRadius: '0 14px 0 6px',
          letterSpacing: 1, textTransform: 'uppercase',
        }}>Cerrado</div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 18,
          background: `${typeColor}22`,
          border: `2px solid ${typeColor}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: SK.fHead, fontSize: 13, fontWeight: 700,
          color: typeColor, flexShrink: 0,
        }}>{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: SK.fMono, fontSize: 13, fontWeight: 700, color: SK.text }}>
            @{displayUser}
          </div>
          <div style={{ fontSize: 11, color: SK.textMute, marginTop: 1 }}>
            {relativeTime(listing.created_at || listing.createdAt)}
          </div>
        </div>
        <div style={{
          background: `${typeColor}18`,
          color: typeColor,
          fontFamily: SK.fMono, fontSize: 10, fontWeight: 700,
          padding: '4px 10px', borderRadius: 20,
          textTransform: 'uppercase', letterSpacing: 0.8,
          border: `1px solid ${typeColor}33`,
          flexShrink: 0,
        }}>{typeText}</div>
      </div>

      {/* Location */}
      {listing.location && (listing.location.city || listing.location.state) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: SK.textMute }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: SK.textDim }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span>
            {[listing.location.city, listing.location.state].filter(Boolean).join(', ')}
            {listing.location.country && (
              <span style={{ marginLeft: 4 }}>
                {countryFlag(listing.location.country)}
              </span>
            )}
          </span>
        </div>
      )}

      {/* Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {listing.cards.map((card, i) => {
          const flag = countryFlag(card.country);
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: SK.bgSoft,
              border: `1px solid ${SK.border}`,
              borderRadius: 8, padding: '5px 10px',
            }}>
              <span style={{ fontFamily: SK.fMono, fontSize: 11, fontWeight: 700, color: SK.gold }}>
                #{String(card.num).padStart(3, '0')}
              </span>
              <span style={{ fontSize: 11, color: SK.textMute }}>{card.player}</span>
              {flag && <span style={{ fontSize: 13 }}>{flag}</span>}
            </div>
          );
        })}
      </div>

      {/* Description */}
      {listing.description && (
        <div style={{
          fontSize: 12, color: SK.textMute,
          lineHeight: 1.5,
          borderTop: `1px solid ${SK.border}`,
          paddingTop: 10,
        }}>
          {listing.description}
        </div>
      )}

      {/* Action */}
      {isActive && listing.user_id !== userId && listing.userId !== userId && (
        <button
          onClick={() => onContact && onContact(listing)}
          style={{
            alignSelf: 'flex-end',
            padding: '8px 18px',
            background: 'transparent',
            color: typeColor,
            border: `1.5px solid ${typeColor}55`,
            borderRadius: 8,
            fontFamily: SK.fHead, fontWeight: 700, fontSize: 12,
            textTransform: 'uppercase', letterSpacing: 0.8,
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
        >Contactar</button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab: Feed
// ─────────────────────────────────────────────────────────────
function MarketplaceFeed({ listings, onContact, userId }) {
  const [typeFilter, setTypeFilter]       = React.useState('all');
  const [countryFilter, setCountryFilter] = React.useState('all');
  const [search, setSearch]               = React.useState('');
  const [searchFocus, setSearchFocus]     = React.useState(false);

  const filtered = listings.filter(l => {
    if (typeFilter !== 'all' && l.type !== typeFilter) return false;
    if (countryFilter !== 'all' && !l.cards.some(c => c.country === countryFilter)) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const uName = (l.profile?.username || l.userName || '').toLowerCase();
      const inUser = uName.includes(q);
      const inDesc = (l.description || '').toLowerCase().includes(q);
      const inCard = l.cards.some(c => (c.player || '').toLowerCase().includes(q));
      const loc = l.location || {};
      const locCountryName = loc.country ? (COUNTRIES.find(c => c.code === loc.country)?.name || '') : '';
      const inLocation = (loc.city || '').toLowerCase().includes(q) ||
                         (loc.state || '').toLowerCase().includes(q) ||
                         locCountryName.toLowerCase().includes(q);
      if (!inUser && !inDesc && !inCard && !inLocation) return false;
    }
    return true;
  });

  const activeCount = listings.filter(l => l.status === 'active').length;

  const typeFilters = [
    { id: 'all',      label: 'Todos'      },
    { id: 'have',     label: 'Tengo'      },
    { id: 'want',     label: 'Necesito'   },
    { id: 'exchange', label: 'Intercambio'},
  ];

  const usedCountryCodes = [...new Set(listings.flatMap(l => l.cards.map(c => c.country)).filter(Boolean))];
  const countryOptions = COUNTRIES.filter(c => usedCountryCodes.includes(c.code));

  return (
    <div>
      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 22 }}>
        {[
          { label: 'Publicaciones activas', value: activeCount,                                         color: SK.text  },
          { label: 'Tengo',                 value: listings.filter(l => l.type === 'have').length,     color: SK.green },
          { label: 'Necesito',              value: listings.filter(l => l.type === 'want').length,     color: SK.coral },
          { label: 'Intercambios',          value: listings.filter(l => l.type === 'exchange').length, color: SK.gold  },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1,
            background: SK.surface, border: `1px solid ${SK.border}`,
            borderRadius: 10, padding: '12px 16px',
          }}>
            <div style={{ fontFamily: SK.fMono, fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + country filter row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        {/* Search bar */}
        <div style={{
          flex: 1, background: SK.surface,
          border: `1px solid ${searchFocus ? SK.gold : SK.border}`,
          borderRadius: 10, padding: '0 14px',
          display: 'flex', alignItems: 'center', gap: 8,
          transition: 'border-color 0.15s',
        }}>
          <Icon.Search s={15} c={SK.textMute}/>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            placeholder="Buscar por usuario, carta o descripción..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: SK.text, fontFamily: SK.fBody, fontSize: 13,
              padding: '10px 0',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', padding: 2,
            }}>
              <Icon.X s={14} c={SK.textMute}/>
            </button>
          )}
        </div>

        {/* Country filter */}
        <div style={{ position: 'relative', minWidth: 180 }}>
          <select
            value={countryFilter}
            onChange={e => setCountryFilter(e.target.value)}
            style={{
              width: '100%', height: '100%',
              background: SK.surface,
              border: `1px solid ${countryFilter !== 'all' ? SK.gold : SK.border}`,
              borderRadius: 10, padding: '0 14px',
              color: countryFilter !== 'all' ? SK.gold : SK.textMute,
              fontFamily: SK.fBody, fontSize: 13, fontWeight: countryFilter !== 'all' ? 600 : 400,
              outline: 'none', cursor: 'pointer',
              appearance: 'none', WebkitAppearance: 'none',
            }}
          >
            <option value="all">Todos los países</option>
            {countryOptions.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
            ))}
          </select>
          <div style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}>
            <Icon.ChevronRight s={12} c={SK.textMute} style={{ transform: 'rotate(90deg)' }}/>
          </div>
        </div>
      </div>

      {/* Type filter pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {typeFilters.map(f => {
          const on = typeFilter === f.id;
          return (
            <button key={f.id} onClick={() => setTypeFilter(f.id)} style={{
              padding: '7px 16px',
              background: on ? SK.gold : 'transparent',
              color: on ? SK.bg : SK.textMute,
              border: on ? 'none' : `1px solid ${SK.border}`,
              borderRadius: 20,
              fontFamily: SK.fBody, fontSize: 12, fontWeight: on ? 700 : 500,
              cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 0.5,
            }}>{f.label}</button>
          );
        })}
        <div style={{ marginLeft: 'auto', fontSize: 12, color: SK.textMute, alignSelf: 'center' }}>
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Listing grid */}
      {filtered.length === 0 ? (
        <div style={{
          background: SK.surface, border: `1px dashed ${SK.border}`,
          borderRadius: 14, padding: 40,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        }}>
          <Icon.Store s={36} c={SK.textDim}/>
          <div style={{ fontFamily: SK.fHead, fontSize: 18, fontWeight: 700, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Sin resultados
          </div>
          <div style={{ fontSize: 13, color: SK.textDim }}>No hay publicaciones para este filtro.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {filtered.map(l => <ListingCard key={l.id} listing={l} onContact={onContact} userId={userId}/>)}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab: Nueva publicación
// ─────────────────────────────────────────────────────────────
function MarketplaceNew({ userData, collection = {}, onPublish, publishing = false }) {
  const [type, setType]         = React.useState('have');
  const [cardInput, setCardInput] = React.useState('');
  const [cards, setCards]       = React.useState([]);
  const [desc, setDesc]         = React.useState('');
  const [locCountry, setLocCountry] = React.useState('');
  const [locState, setLocState] = React.useState('');
  const [locCity, setLocCity]   = React.useState('');
  const [focus, setFocus]       = React.useState(null);
  const [success, setSuccess]   = React.useState(false);
  const [dupSelect, setDupSelect] = React.useState('');

  const typeOptions = [
    { id: 'have',     label: 'Tengo',       desc: 'Oferezco estampas repetidas',   color: SK.green },
    { id: 'want',     label: 'Necesito',    desc: 'Busco estampas específicas',    color: SK.coral },
    { id: 'exchange', label: 'Intercambio', desc: 'Cambio mis extras por las tuyas',color: SK.gold  },
  ];

  const countryCodes = React.useMemo(() => COUNTRIES.map(c => c.code).sort((a, b) => b.length - a.length), []);

  const duplicateOptions = React.useMemo(() => {
    const entries = Object.entries(collection).filter(([, qty]) => qty >= 2);
    if (!entries.length) return [];

    const special = window.specialStickers ? window.specialStickers() : [];
    const coca = window.ccStickers ? window.ccStickers() : [];
    const specialMap = new Map([...special, ...coca].map(s => [s.id, s]));

    return entries.map(([id, qty]) => {
      const specialHit = specialMap.get(id);
      if (specialHit) {
        const num = specialHit.num || 0;
        return {
          id,
          num,
          player: specialHit.player || `Estampa #${String(num).padStart(3,'0')}`,
          country: null,
          label: `#${String(num).padStart(3,'0')} ${specialHit.player}`.trim(),
          qty,
        };
      }

      const code = countryCodes.find(c => id.startsWith(c));
      const country = code ? COUNTRIES.find(c => c.code === code) : null;
      const num = code ? parseInt(id.slice(code.length), 10) : (parseInt(id.replace(/\D/g, ''), 10) || 0);
      let player = `Estampa #${String(num).padStart(3,'0')}`;
      if (country && window.stickersFor) {
        const match = window.stickersFor(country).find(s => s.id === id);
        if (match && match.player) player = match.player;
      }
      const flag = country?.flag || '';
      return {
        id,
        num,
        player,
        country: country?.code || null,
        label: `#${String(num).padStart(3,'0')} ${flag} ${player}`.trim(),
        qty,
      };
    });
  }, [collection, countryCodes]);

  const addCard = () => {
    const raw = cardInput.trim();
    if (!raw) return;
    // Accept "#042 Nombre País" or just "042" or "42"
    const numMatch = raw.match(/(\d+)/);
    if (!numMatch) return;
    const num = parseInt(numMatch[1], 10);
    const rest = raw.replace(/^#?\d+\s*/, '').trim() || `Estampa #${String(num).padStart(3,'0')}`;
    const newCard = { num, player: rest, country: null };
    if (!cards.find(c => c.num === num && c.country === newCard.country)) {
      setCards(prev => [...prev, newCard]);
    }
    setCardInput('');
  };

  const addDuplicateCard = () => {
    if (!dupSelect) return;
    const selected = duplicateOptions.find(o => o.id === dupSelect);
    if (!selected) return;
    const newCard = { num: selected.num, player: selected.player, country: selected.country };
    if (!cards.find(c => c.num === newCard.num && c.country === newCard.country)) {
      setCards(prev => [...prev, newCard]);
    }
    setDupSelect('');
  };

  const removeCard = (num, country) => setCards(prev => prev.filter(c => !(c.num === num && c.country === country)));

  const canSubmit = cards.length > 0 && !publishing;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const listing = {
      type,
      cards,
      description: desc.trim(),
      location: locCountry ? { country: locCountry, state: locState.trim(), city: locCity.trim() } : null,
    };
    const result = await onPublish?.(listing);
    if (result?.error) return;
    setCards([]);
    setDesc('');
    setCardInput('');
    setLocCountry('');
    setLocState('');
    setLocCity('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Success toast */}
      {success && (
        <div style={{
          background: `${SK.green}18`,
          border: `1px solid ${SK.green}55`,
          borderRadius: 10, padding: '12px 18px',
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 20,
          color: SK.green, fontSize: 13, fontWeight: 600,
        }}>
          <Icon.Check s={16} c={SK.green}/>
          Publicación creada con éxito.
        </div>
      )}

      {/* Section: Tipo */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600, marginBottom: 10 }}>
          Tipo de oferta
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {typeOptions.map(t => {
            const on = type === t.id;
            return (
              <button key={t.id} onClick={() => setType(t.id)} style={{
                flex: 1, padding: '14px 16px',
                background: on ? `${t.color}15` : SK.surface,
                border: `2px solid ${on ? t.color : SK.border}`,
                borderRadius: 12, cursor: 'pointer', textAlign: 'left',
              }}>
                <div style={{ fontFamily: SK.fHead, fontSize: 15, fontWeight: 700, color: on ? t.color : SK.textMute, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {t.label}
                </div>
                <div style={{ fontSize: 11, color: SK.textDim, marginTop: 4, lineHeight: 1.4 }}>{t.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section: Estampas */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600, marginBottom: 10 }}>
          Estampas
        </div>

        {/* Input row */}
        {type === 'have' ? (
          duplicateOptions.length === 0 ? (
            <div style={{
              background: SK.bgSoft, border: `1px dashed ${SK.border}`,
              borderRadius: 10, padding: '16px',
              fontSize: 12, color: SK.textDim, textAlign: 'center',
            }}>
              No tenés repetidas aún — marcá estampas en el Álbum.
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <select
                  value={dupSelect}
                  onChange={e => setDupSelect(e.target.value)}
                  style={{
                    width: '100%', height: 44,
                    background: SK.surface,
                    border: `1px solid ${dupSelect ? SK.gold : SK.border}`,
                    borderRadius: 10, padding: '0 14px',
                    color: dupSelect ? SK.text : SK.textMute,
                    fontFamily: SK.fBody, fontSize: 13,
                    outline: 'none', cursor: 'pointer',
                    appearance: 'none', WebkitAppearance: 'none',
                  }}
                >
                  <option value="">Seleccionar repetida...</option>
                  {duplicateOptions.map(o => (
                    <option key={o.id} value={o.id}>{o.label} · x{o.qty}</option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <Icon.ChevronRight s={12} c={SK.textMute}/>
                </div>
              </div>
              <button onClick={addDuplicateCard} style={{
                padding: '0 18px', height: 44,
                background: SK.gold, color: SK.bg,
                border: 'none', borderRadius: 10,
                fontFamily: SK.fHead, fontWeight: 700, fontSize: 13,
                textTransform: 'uppercase', letterSpacing: 0.8,
                cursor: 'pointer',
              }}>Agregar</button>
            </div>
          )
        ) : (
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <div style={{
              flex: 1, background: SK.surface,
              border: `1px solid ${focus === 'card' ? SK.gold : SK.border}`,
              borderRadius: 10, padding: '0 14px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Icon.Tag s={14} c={SK.textDim}/>
              <input
                value={cardInput}
                onChange={e => setCardInput(e.target.value)}
                onFocus={() => setFocus('card')}
                onBlur={() => setFocus(null)}
                onKeyDown={e => e.key === 'Enter' && addCard()}
                placeholder="#042 Nombre o número"
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  color: SK.text, fontFamily: SK.fBody, fontSize: 13,
                  padding: '12px 0',
                }}
              />
            </div>
            <button onClick={addCard} style={{
              padding: '0 18px', height: 44,
              background: SK.gold, color: SK.bg,
              border: 'none', borderRadius: 10,
              fontFamily: SK.fHead, fontWeight: 700, fontSize: 13,
              textTransform: 'uppercase', letterSpacing: 0.8,
              cursor: 'pointer',
            }}>Agregar</button>
          </div>
        )}

        {/* Tags */}
        {cards.length === 0 ? (
          <div style={{
            background: SK.bgSoft, border: `1px dashed ${SK.border}`,
            borderRadius: 10, padding: '16px',
            fontSize: 12, color: SK.textDim, textAlign: 'center',
          }}>
            Agrega al menos una estampa. Escribe el número y presiona Enter o "Agregar".
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {cards.map(card => (
              <div key={`${card.num}-${card.country || 'x'}`} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: SK.surface, border: `1px solid ${SK.gold}55`,
                borderRadius: 8, padding: '5px 8px 5px 10px',
              }}>
                <span style={{ fontFamily: SK.fMono, fontSize: 11, fontWeight: 700, color: SK.gold }}>
                  #{String(card.num).padStart(3, '0')}
                </span>
                <span style={{ fontSize: 11, color: SK.textMute }}>{card.player}</span>
                <button onClick={() => removeCard(card.num, card.country)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: 2, display: 'flex', alignItems: 'center',
                  color: SK.textDim,
                }}>
                  <Icon.X s={12} c={SK.textDim}/>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section: Ubicación */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600, marginBottom: 10 }}>
          Ubicación <span style={{ color: SK.textDim, textTransform: 'none', letterSpacing: 0 }}>(para facilitar el encuentro)</span>
        </div>

        {/* Country select */}
        <div style={{ marginBottom: 10, position: 'relative' }}>
          <select
            value={locCountry}
            onChange={e => setLocCountry(e.target.value)}
            style={{
              width: '100%',
              background: SK.surface,
              border: `1px solid ${locCountry ? SK.gold : (focus === 'locCountry' ? SK.gold : SK.border)}`,
              borderRadius: 10, padding: '12px 14px',
              fontFamily: SK.fBody, fontSize: 13,
              color: locCountry ? SK.text : SK.textMute,
              outline: 'none', cursor: 'pointer',
              appearance: 'none', WebkitAppearance: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={() => setFocus('locCountry')}
            onBlur={() => setFocus(null)}
          >
            <option value="">Seleccionar país...</option>
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
            ))}
          </select>
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <Icon.ChevronRight s={12} c={SK.textMute}/>
          </div>
        </div>

        {/* State + City */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <input
            value={locState}
            onChange={e => setLocState(e.target.value)}
            onFocus={() => setFocus('locState')}
            onBlur={() => setFocus(null)}
            placeholder="Estado / Provincia"
            style={{
              background: SK.surface,
              border: `1px solid ${focus === 'locState' ? SK.gold : SK.border}`,
              borderRadius: 10, padding: '12px 14px',
              fontFamily: SK.fBody, fontSize: 13, color: SK.text,
              outline: 'none', boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
          />
          <input
            value={locCity}
            onChange={e => setLocCity(e.target.value)}
            onFocus={() => setFocus('locCity')}
            onBlur={() => setFocus(null)}
            placeholder="Ciudad / Barrio"
            style={{
              background: SK.surface,
              border: `1px solid ${focus === 'locCity' ? SK.gold : SK.border}`,
              borderRadius: 10, padding: '12px 14px',
              fontFamily: SK.fBody, fontSize: 13, color: SK.text,
              outline: 'none', boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
          />
        </div>
      </div>

      {/* Section: Descripción */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600, marginBottom: 10 }}>
          Descripción <span style={{ color: SK.textDim, textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>
        </div>
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          onFocus={() => setFocus('desc')}
          onBlur={() => setFocus(null)}
          placeholder="Ej: Busco jugadores de CONMEBOL, negociable..."
          rows={3}
          style={{
            width: '100%',
            background: SK.surface,
            border: `1px solid ${focus === 'desc' ? SK.gold : SK.border}`,
            borderRadius: 10, padding: '12px 14px',
            fontFamily: SK.fBody, fontSize: 13, color: SK.text,
            outline: 'none', resize: 'vertical',
            boxSizing: 'border-box', lineHeight: 1.5,
          }}
        />
      </div>

      {/* Preview */}
      {cards.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600, marginBottom: 10 }}>
            Vista previa
          </div>
          <ListingCard listing={{
            id: 'preview',
            userId: userData?.username,
            userName: userData?.username,
            type,
            cards,
            description: desc,
            location: locCountry ? { country: locCountry, state: locState, city: locCity } : null,
            status: 'active',
            createdAt: new Date().toISOString(),
          }}/>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        style={{
          width: '100%', padding: '16px 0',
          background: canSubmit ? SK.gold : SK.border,
          color: canSubmit ? SK.bg : SK.textMute,
          border: 'none', borderRadius: 10,
          fontFamily: SK.fHead, fontWeight: 700, fontSize: 15,
          textTransform: 'uppercase', letterSpacing: 1.2,
          cursor: canSubmit ? 'pointer' : 'default',
          boxShadow: canSubmit ? `0 6px 18px -4px ${SK.goldDeep}` : 'none',
          transition: 'all 0.2s',
        }}
      >{publishing ? 'Publicando...' : 'Publicar'}</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab: Mis publicaciones
// ─────────────────────────────────────────────────────────────
function MarketplaceMine({ listings, userData, userId, onClose }) {
  const safeUsername = userData?.username || null;
  const mine = listings.filter(l =>
    (userId && (l.user_id === userId || l.userId === userId))
    || (!!safeUsername && l.userName === safeUsername)
  );

  const activeCount = mine.filter(l => l.status === 'active').length;
  const closedCount = mine.filter(l => l.status === 'closed').length;

  const handleClose = (id) => {
    onClose && onClose(id);
  };

  if (mine.length === 0) {
    return (
      <div style={{
        background: SK.surface, border: `1px dashed ${SK.border}`,
        borderRadius: 14, padding: '48px 40px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, maxWidth: 480, margin: '0 auto',
      }}>
        <Icon.Store s={40} c={SK.textDim}/>
        <div style={{ fontFamily: SK.fHead, fontSize: 20, fontWeight: 700, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Sin publicaciones
        </div>
        <div style={{ fontSize: 13, color: SK.textDim, textAlign: 'center', lineHeight: 1.6 }}>
          Todavía no publicaste nada. Usa la pestaña "Nueva publicación" para empezar.
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Summary */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
        <div style={{
          background: SK.surface, border: `1px solid ${SK.border}`,
          borderRadius: 10, padding: '12px 18px', flex: 1,
        }}>
          <div style={{ fontFamily: SK.fMono, fontSize: 22, fontWeight: 700, color: SK.green, lineHeight: 1 }}>{activeCount}</div>
          <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginTop: 4 }}>Activas</div>
        </div>
        <div style={{
          background: SK.surface, border: `1px solid ${SK.border}`,
          borderRadius: 10, padding: '12px 18px', flex: 1,
        }}>
          <div style={{ fontFamily: SK.fMono, fontSize: 22, fontWeight: 700, color: SK.textMute, lineHeight: 1 }}>{closedCount}</div>
          <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginTop: 4 }}>Cerradas</div>
        </div>
      </div>

      {/* Listing table */}
      <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '100px 1fr 100px 120px',
          padding: '12px 20px', gap: 14,
          background: SK.bgSoft, borderBottom: `1px solid ${SK.border}`,
          fontSize: 10, color: SK.textMute, textTransform: 'uppercase',
          letterSpacing: 1, fontWeight: 700,
        }}>
          <div>Tipo</div>
          <div>Estampas</div>
          <div>Estado</div>
          <div style={{ textAlign: 'right' }}>Acción</div>
        </div>

        {mine.map((listing, i, arr) => {
          const { text: typeText, color: typeColor } = typeLabel(listing.type);
          const isActive = listing.status === 'active';
          return (
            <div key={listing.id} style={{
              display: 'grid', gridTemplateColumns: '100px 1fr 100px 120px',
              padding: '16px 20px', gap: 14, alignItems: 'center',
              borderBottom: i < arr.length - 1 ? `1px solid ${SK.border}` : 'none',
              opacity: isActive ? 1 : 0.6,
            }}>
              {/* Type */}
              <div style={{
                display: 'inline-flex',
                background: `${typeColor}18`,
                color: typeColor,
                fontFamily: SK.fMono, fontSize: 10, fontWeight: 700,
                padding: '4px 10px', borderRadius: 20,
                textTransform: 'uppercase', letterSpacing: 0.8,
                border: `1px solid ${typeColor}33`,
              }}>{typeText}</div>

              {/* Cards preview */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {listing.cards.slice(0, 3).map((card, ci) => {
                  const flag = countryFlag(card.country);
                  return (
                    <div key={ci} style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      background: SK.bgSoft, border: `1px solid ${SK.border}`,
                      borderRadius: 6, padding: '3px 8px',
                    }}>
                      <span style={{ fontFamily: SK.fMono, fontSize: 10, fontWeight: 700, color: SK.gold }}>
                        #{String(card.num).padStart(3,'0')}
                      </span>
                      {flag && <span style={{ fontSize: 11 }}>{flag}</span>}
                    </div>
                  );
                })}
                {listing.cards.length > 3 && (
                  <div style={{
                    background: SK.bgSoft, border: `1px solid ${SK.border}`,
                    borderRadius: 6, padding: '3px 8px',
                    fontFamily: SK.fMono, fontSize: 10, color: SK.textMute,
                  }}>+{listing.cards.length - 3}</div>
                )}
              </div>

              {/* Status badge */}
              <div style={{
                display: 'inline-flex',
                background: isActive ? `${SK.green}18` : `${SK.textDim}18`,
                color: isActive ? SK.green : SK.textDim,
                fontFamily: SK.fMono, fontSize: 10, fontWeight: 700,
                padding: '4px 10px', borderRadius: 20,
                textTransform: 'uppercase', letterSpacing: 0.8,
              }}>{isActive ? 'Activa' : 'Cerrada'}</div>

              {/* Action */}
              <div style={{ textAlign: 'right' }}>
                {isActive ? (
                  <button onClick={() => handleClose(listing.id)} style={{
                    background: 'transparent', color: SK.coral,
                    border: `1px solid ${SK.coral}44`, borderRadius: 6,
                    padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: SK.fBody,
                  }}>Cerrar</button>
                ) : (
                  <span style={{ fontSize: 11, color: SK.textDim }}>—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Contact modal
// ─────────────────────────────────────────────────────────────
function ContactModal({ listing, onClose }) {
  if (!listing) return null;
  const { text: typeText, color: typeColor } = typeLabel(listing.type);
  const displayUser = listing.profile?.username || listing.userName || '—';
  const displayName = listing.profile?.display_name || displayUser;
  const contactNumber = listing.profile?.whatsapp || listing.profile?.phone || null;
  const waHref = contactNumber
    ? `https://wa.me/${contactNumber}?text=${encodeURIComponent(`Hola ${displayName}, vi tu publicación en Stickio`)}`
    : null;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
    }} onClick={onClose}>
      <div style={{
        background: SK.surface,
        border: `1px solid ${SK.border}`,
        borderRadius: 16,
        padding: 32, maxWidth: 440, width: '90%',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontFamily: SK.fHead, fontSize: 20, fontWeight: 700, color: SK.text, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Contactar
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <Icon.X s={18} c={SK.textMute}/>
          </button>
        </div>

        <div style={{
          background: SK.bgSoft, border: `1px solid ${SK.border}`,
          borderRadius: 10, padding: '12px 16px', marginBottom: 20,
        }}>
          <div style={{ fontFamily: SK.fMono, fontSize: 13, color: SK.text, fontWeight: 700 }}>@{displayUser}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <div style={{
              background: `${typeColor}18`, color: typeColor,
              fontFamily: SK.fMono, fontSize: 10, fontWeight: 700,
              padding: '3px 8px', borderRadius: 12,
              border: `1px solid ${typeColor}33`,
            }}>{typeText}</div>
            <span style={{ fontSize: 11, color: SK.textMute }}>{listing.cards.length} estampa{listing.cards.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {waHref ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, padding: '12px', background: SK.gold, color: SK.bg,
                border: 'none', borderRadius: 10,
                fontFamily: SK.fHead, fontWeight: 700, fontSize: 13,
                textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
                textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >Abrir WhatsApp</a>
          ) : (
            <div style={{
              flex: 1, padding: '12px',
              background: SK.bgSoft, border: `1px solid ${SK.border}`,
              borderRadius: 10, textAlign: 'center',
              fontFamily: SK.fMono, fontSize: 13, color: SK.textMute,
              userSelect: 'all',
            }}>@{displayUser}</div>
          )}
          <button onClick={onClose} style={{
            flex: 1, padding: '12px', background: 'transparent', color: SK.text,
            border: `1px solid ${SK.border}`, borderRadius: 10,
            fontFamily: SK.fHead, fontWeight: 700, fontSize: 13,
            textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
          }}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP — Marketplace (main component)
// ─────────────────────────────────────────────────────────────
function MarketplaceDesktop({ onNav, userData, theme, onToggleTheme, collection = {}, stats = null, marketplaceListings = [], onMarketplaceListingsChange = () => {}, userId = null, marketplaceLoading = false, marketplaceError = null }) {
  const [tab, setTab]         = React.useState('feed');
  const [contact, setContact] = React.useState(null);
  const [publishing, setPublishing] = React.useState(false);
  const listings = marketplaceListings;
  const feedListings = React.useMemo(() => listings.filter(l => l.status === 'active'), [listings]);
  const safeUsername = userData?.username || null;
  const mineCount = listings.filter(l =>
    ((userId && (l.user_id === userId || l.userId === userId)) || (!!safeUsername && l.userName === safeUsername))
    && l.status === 'active'
  ).length;

  const handlePublish = async (newListing) => {
    if (!userId) return { error: 'Sin sesión' };
    setPublishing(true);
    const { data, error } = await window.createMarketplaceListing(userId, newListing);
    setPublishing(false);
    if (!error && data) {
      onMarketplaceListingsChange(prev => [data, ...(prev || [])]);
      setTab('mine');
    }
    return { error };
  };

  const handleClose = async (id) => {
    const { error } = await window.closeMarketplaceListing(id, userId);
    if (!error) {
      onMarketplaceListingsChange(prev => (prev || []).map(l =>
        l.id === id ? { ...l, status: 'closed', updated_at: new Date().toISOString() } : l
      ));
    }
  };

  const tabs = [
    { id: 'feed', label: 'Feed'              },
    { id: 'new',  label: 'Nueva publicación' },
    { id: 'mine', label: 'Mis publicaciones' },
  ];

  return (
    <DesktopShell active="marketplace" onNav={onNav} title="Marketplace" sub="Intercambia con la comunidad" theme={theme} onToggleTheme={onToggleTheme} userData={userData} stats={stats}>
      <div style={{ padding: '28px 36px' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 24, borderBottom: `1px solid ${SK.border}`, marginBottom: 28 }}>
          {tabs.map(t => {
            const on = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '12px 2px', background: 'none', border: 'none',
                borderBottom: `2px solid ${on ? SK.gold : 'transparent'}`,
                color: on ? SK.text : SK.textMute,
                fontFamily: SK.fHead, fontSize: 14, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: 1,
                cursor: 'pointer', marginBottom: -1,
              }}>{t.label}</button>
            );
          })}
        </div>

        {mineCount > 0 && tab !== 'mine' && (
          <div style={{
            background: SK.surface,
            border: `1px solid ${SK.border}`,
            borderRadius: 12,
            padding: '12px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 20,
          }}>
            <div>
              <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>tus publicaciones</div>
              <div style={{ fontFamily: SK.fHead, fontSize: 18, fontWeight: 700, color: SK.text, marginTop: 2 }}>
                {mineCount} activa{mineCount !== 1 ? 's' : ''}
              </div>
            </div>
            <button onClick={() => setTab('mine')} style={{
              padding: '8px 14px',
              background: SK.gold, color: SK.bg,
              border: 'none', borderRadius: 8,
              fontFamily: SK.fHead, fontWeight: 700, fontSize: 12,
              textTransform: 'uppercase', letterSpacing: 0.8, cursor: 'pointer',
            }}>Gestionar</button>
          </div>
        )}

        {/* Tab content */}
        {tab === 'feed' && (
          marketplaceLoading
            ? <div style={{ textAlign: 'center', padding: 40, color: SK.textMute, fontSize: 13 }}>Cargando publicaciones...</div>
            : marketplaceError
              ? <div style={{ background: SK.surface, border: `1px dashed ${SK.coral}55`, borderRadius: 12, padding: 28, textAlign: 'center', fontSize: 13, color: SK.coral }}>{marketplaceError}</div>
              : <MarketplaceFeed listings={feedListings} onContact={setContact} userId={userId}/>
        )}
        {tab === 'new' && (
          <MarketplaceNew
            userData={userData}
            collection={collection}
            onPublish={handlePublish}
            publishing={publishing}
          />
        )}
        {tab === 'mine' && (
          <MarketplaceMine
            listings={listings}
            userData={userData}
            userId={userId}
            onClose={handleClose}
          />
        )}
      </div>

      {/* Contact modal */}
      {contact && <ContactModal listing={contact} onClose={() => setContact(null)}/>}
    </DesktopShell>
  );
}

Object.assign(window, { MarketplaceDesktop });
