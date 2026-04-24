// Mobile — Album, Trade, Profile screens

// ─────────────────────────────────────────────────────────────
// Generate demo sticker data for a country
// ─────────────────────────────────────────────────────────────
function stickersFor(country, startNum) {
  const arr = [];
  for (let i = 0; i < country.total; i++) {
    const num = i + 1; // local 1-20 numbering per country section
    let state = 'missing';
    let count = 0;
    if (i < country.have) {
      state = 'have';
      count = 1;
      if ((num * 7) % 11 === 0) { state = 'duplicate'; count = 2 + (num % 3); }
    }

    let type = 'jugador';
    let player = '';
    let position = null;
    if (num === 1) {
      type = 'escudo';
      player = `Escudo · ${country.name}`;
    } else if (num === 13) {
      type = 'equipo';
      player = 'Foto Equipo';
    } else {
      const idx = num < 13 ? num - 2 : num - 3;
      player = PLAYERS[idx % PLAYERS.length] + ' ' + String.fromCharCode(65 + (idx % 6));
      if (num === 2) position = 'POR';
      else if (num >= 3 && num <= 7) position = 'DEF';
      else if ((num >= 8 && num <= 12) || num === 14) position = 'MED';
      else if (num >= 15 && num <= 20) position = 'DEL';
    }

    const id = `${country.code}${String(num).padStart(2, '0')}`;
    arr.push({ id, num, player, country, state, count, type, position });
  }
  return arr;
}

// FWC — Especiales (00–04), Balón y Países (05–08), Historia (09–19)
const SPECIAL_SUBTYPES = [
  'trophy','trophy','trophy','stadium','stadium',         // 00–04 FWC Especiales
  'stadium','trophy','stadium','trophy',                  // 05–08 FWC Balón y Países
  'trophy','stadium','trophy','stadium','trophy',         // 09–13 FWC Historia
  'stadium','trophy','stadium','trophy','stadium','trophy', // 14–19 FWC Historia
];

const SPECIAL_NAMES = [
  // FWC Especiales (nums 0-4 → displayed 000-004)
  'FWC · Especial 00', 'Copa del Mundo 2026', 'Mascota Oficial', 'Balón Oficial', 'Sede USA·MX·CA',
  // FWC Balón y Países (nums 5-8)
  'Balón Adidas', 'Mapa del Mundo', 'Logo FIFA WC 2026', 'Países Participantes',
  // FWC Historia (nums 9-19)
  'Historia 1930', 'Historia 1950', 'Historia 1966', 'Historia 1970',
  'Historia 1978', 'Historia 1986', 'Historia 1994', 'Historia 1998',
  'Historia 2002', 'Historia 2010', 'Historia 2018/22',
];

function specialStickers() {
  // 20 stickers: FWC Especiales (00-04) + Balón y Países (05-08) + Historia (09-19)
  return Array.from({ length: 20 }, (_, i) => ({
    id: `FWC${String(i).padStart(2, '0')}`,
    num: i,
    player: SPECIAL_NAMES[i] || `FWC ${i}`,
    country: null,
    state: i < 8 ? 'have' : 'missing',
    count: 1,
    type: 'especial',
    subtype: SPECIAL_SUBTYPES[i],
  }));
}

// CC — Coca-Cola (nums 1-12)
const CC_NAMES = [
  'Coca-Cola × FIFA', 'Refresca el Juego', 'Sabor Mundial', 'Fan Zone',
  'Celebración', 'Gol de Oro', 'Pausa Perfecta', 'The Coca-Cola Cup',
  'Red United', 'Jugando Juntos', 'El Momento', 'Sin Límites',
];

function ccStickers() {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `CC${String(i + 1).padStart(2, '0')}`,
    num: i + 1,
    player: CC_NAMES[i],
    country: null,
    state: i < 4 ? 'have' : 'missing',
    count: 1,
    type: 'especial',
    subtype: i % 2 === 0 ? 'stadium' : 'trophy',
  }));
}

// ─────────────────────────────────────────────────────────────
// SCREEN 3 — Album
// ─────────────────────────────────────────────────────────────
function AlbumScreen({ onNav, initialCountry = null, collection = {}, setCollection = () => {}, onStickerChange = () => {} }) {
  const [filter, setFilter] = React.useState('Todos');
  const [query, setQuery] = React.useState('');
  const [dupModal, setDupModal] = React.useState(null);
  const [countrySearch, setCountrySearch] = React.useState('');
  const [selectedCountry, setSelectedCountry] = React.useState(null);

  const filters = ['Todos', 'Tengo', 'Falta', 'Repetidas', 'Por país', 'Especiales'];

  // Build sections
  const sections = [
    { id: 'fwc', label: 'Copa & Sedes 2026', flag: '🏆', total: 20, stickers: specialStickers() },
    ...COUNTRIES.map((c, i) => ({
      id: c.code,
      country: c,
      stickers: stickersFor(c, 1 + i * 20),
    })),
    { id: 'cc', label: 'Coca-Cola', flag: '🥤', total: 12, stickers: ccStickers() },
  ];

  const [countryOrder, setCountryOrder] = React.useState(() => {
    if (!initialCountry) return null;
    return [
      ...sections.filter(sec => sec.id === initialCountry),
      ...sections.filter(sec => sec.id !== initialCountry),
    ];
  });

  React.useEffect(() => {
    if (!initialCountry) {
      setCountryOrder(null);
      return;
    }
    setCountryOrder([
      ...sections.filter(sec => sec.id === initialCountry),
      ...sections.filter(sec => sec.id !== initialCountry),
    ]);
  }, [initialCountry]);

  const handleStickerTap = (s) => {
    const qty = collection[s.id] || 0;
    if (qty === 0) {
      setCollection(prev => ({ ...prev, [s.id]: 1 }));
      onStickerChange(s.id, 1);
    }
    else setDupModal(s);
  };

  const handleAddDuplicate = () => {
    const nextQty = (collection[dupModal.id] || 0) + 1;
    setCollection(prev => ({ ...prev, [dupModal.id]: nextQty }));
    onStickerChange(dupModal.id, nextQty);
    setDupModal(null);
  };

  const handleRemoveOne = () => {
    const nextQty = Math.max(0, (collection[dupModal.id] || 0) - 1);
    setCollection(prev => ({ ...prev, [dupModal.id]: nextQty }));
    onStickerChange(dupModal.id, nextQty);
    setDupModal(null);
  };

  const filterFn = (s) => {
    if (filter === 'Tengo') return s.state === 'have' || s.state === 'duplicate';
    if (filter === 'Falta') return s.state === 'missing';
    if (filter === 'Repetidas') return s.state === 'duplicate';
    return true;
  };

  const countryPickerCountries = COUNTRIES.filter(c =>
    !countrySearch || c.name.toLowerCase().includes(countrySearch.toLowerCase()) || c.flag.includes(countrySearch)
  );

  const activeSections = (() => {
    const base = countryOrder || sections;
    if (filter === 'Especiales') return base.filter(s => s.id === 'fwc' || s.id === 'cc');
    if (filter === 'Por país' && selectedCountry) return base.filter(s => s.id === selectedCountry);
    if (filter === 'Por país') return base.filter(s => s.country);
    return base;
  })();

  return (
    <PhoneShell active="album" onNav={onNav}>
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 16 }}>
        {/* Header */}
        <div style={{ padding: '6px 20px 14px' }}>
          <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>colección</div>
          <div style={{ fontFamily: SK.fHead, fontSize: 28, fontWeight: 700, color: SK.text, marginTop: 2 }}>Mi álbum</div>
        </div>

        {/* Search */}
        {filter !== 'Por país' && <div style={{ padding: '0 20px 12px' }}>
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
            {query ? (
              <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: SK.textMute, fontSize: 16, lineHeight: 1 }}>×</button>
            ) : null}
          </div>
        </div>}

        {/* Filter chips */}
        <div style={{
          display: 'flex', gap: 8, padding: '0 20px 14px',
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          {filters.map(f => {
            const on = filter === f;
            return (
              <button key={f} onClick={() => {
                setFilter(f);
                if (f !== 'Por país') { setSelectedCountry(null); setCountrySearch(''); }
              }} style={{
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

        {/* Country picker — visible when filter === 'Por país' */}
        {filter === 'Por país' && (
          <div style={{ padding: '0 20px 14px' }}>
            {/* Country search input */}
            <div style={{
              background: SK.surface, border: `1px solid ${selectedCountry ? SK.gold : SK.border}`,
              borderRadius: 10, padding: '9px 12px',
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
            }}>
              <span style={{ fontSize: 15 }}>🌍</span>
              <input
                placeholder="Buscar país..."
                value={countrySearch}
                onChange={e => { setCountrySearch(e.target.value); setSelectedCountry(null); }}
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  color: SK.text, fontFamily: SK.fBody, fontSize: 13,
                }}
              />
              {(countrySearch || selectedCountry) && (
                <button onClick={() => { setCountrySearch(''); setSelectedCountry(null); }} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: SK.textMute, fontSize: 16, lineHeight: 1, padding: 0,
                }}>×</button>
              )}
            </div>
            {/* Selected country pill */}
            {selectedCountry && (() => {
              const c = COUNTRIES.find(x => x.code === selectedCountry);
              return c ? (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: `${SK.gold}22`, border: `1px solid ${SK.gold}55`,
                  borderRadius: 20, padding: '5px 12px', marginBottom: 10,
                }}>
                  <span style={{ fontSize: 16 }}>{c.flag}</span>
                  <span style={{ fontFamily: SK.fBody, fontSize: 12, fontWeight: 700, color: SK.gold, textTransform: 'uppercase', letterSpacing: 0.5 }}>{c.name}</span>
                  <button onClick={() => setSelectedCountry(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: SK.gold, fontSize: 14, lineHeight: 1, padding: 0, marginLeft: 2 }}>×</button>
                </div>
              ) : null;
            })()}
            {/* Flag grid */}
            {!selectedCountry && (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
                maxHeight: 220, overflowY: 'auto', scrollbarWidth: 'none',
              }}>
                {countryPickerCountries.map(c => {
                  const have = Array.from({ length: c.total || 20 }, (_, i) =>
                    (collection[`${c.code}${String(i + 1).padStart(2, '0')}`] || 0) > 0 ? 1 : 0
                  ).reduce((a, b) => a + b, 0);
                  const pct = Math.round((have / (c.total || 20)) * 100);
                  return (
                    <button key={c.code} onClick={() => setSelectedCountry(c.code)} style={{
                      background: SK.surface, border: `1px solid ${SK.border}`,
                      borderRadius: 10, padding: '8px 4px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                      cursor: 'pointer',
                    }}>
                      <span style={{ fontSize: 22 }}>{c.flag}</span>
                      <span style={{
                        fontFamily: SK.fBody, fontSize: 9, fontWeight: 600, color: SK.textMute,
                        textTransform: 'uppercase', letterSpacing: 0.3,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        maxWidth: '100%',
                      }}>{c.name.split(' ')[0]}</span>
                      <span style={{ fontFamily: SK.fMono, fontSize: 9, color: pct === 100 ? SK.gold : SK.textDim, fontWeight: 700 }}>{pct}%</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Sections */}
        {activeSections.map((sec, si) => {
          const merged = sec.stickers.map(s => {
            const qty = s.id in collection ? collection[s.id] : 0;
            return { ...s, state: qty === 0 ? 'missing' : qty === 1 ? 'have' : 'duplicate', count: qty };
          });
          const filtered = merged.filter(filterFn).filter(s => {
            if (!query) return true;
            return String(s.num).includes(query) || s.player.toLowerCase().includes(query.toLowerCase());
          });
          const haveCount = merged.reduce((acc, s) => acc + (s.count > 0 ? 1 : 0), 0);
          const totalCount = sec.country?.total || sec.total || merged.length;
          const headerFlag = sec.country?.flag || sec.flag;
          const headerTitle = sec.country?.name || sec.label || 'Especiales';
          if (!filtered.length) return null;
          return (
            <div key={sec.id || sec.country?.code || si} style={{ padding: '0 20px 22px' }}>
              {/* Section header */}
              <div style={{
                background: SK.surface, border: `1px solid ${SK.border}`,
                borderRadius: 12, padding: 14, marginBottom: 12,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ fontSize: 32 }}>{headerFlag}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: SK.fHead, fontSize: 18, fontWeight: 700, color: SK.text, textTransform: 'uppercase' }}>
                    {headerTitle}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                    <div style={{ flex: 1 }}><ProgressBar value={haveCount} max={totalCount}/></div>
                    <span style={{ fontFamily: SK.fMono, fontSize: 12, color: SK.gold, fontWeight: 600 }}>
                      {haveCount}/{totalCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {filtered.map(s => (
                  <StickerCard key={s.num} {...s} size="md" onClick={() => handleStickerTap(s)}/>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {dupModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          zIndex: 9999,
        }} onClick={() => setDupModal(null)}>
          <div style={{
            width: '100%', maxWidth: MOBILE_W,
            background: SK.surface,
            borderTop: `1px solid ${SK.border}`,
            borderRadius: '16px 16px 0 0',
            padding: '18px 20px 22px',
            boxShadow: '0 -10px 30px rgba(0,0,0,0.3)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: SK.fHead, fontSize: 16, fontWeight: 700, color: SK.text, textTransform: 'uppercase', letterSpacing: 0.6 }}>
              Repetidas
            </div>
            <div style={{ fontSize: 12, color: SK.textMute, marginTop: 6, lineHeight: 1.4 }}>
              Ya tenés <span style={{ color: SK.gold, fontWeight: 700, fontFamily: SK.fMono }}>{collection[dupModal.id] || 0}</span> de
              <span style={{ color: SK.text, fontWeight: 600 }}> #{String(dupModal.num).padStart(3, '0')} {dupModal.player}</span>.
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button onClick={handleAddDuplicate} style={{
                flex: 1, padding: '12px 0',
                background: SK.gold, color: SK.bg,
                border: 'none', borderRadius: 10,
                fontFamily: SK.fHead, fontWeight: 700, fontSize: 12,
                textTransform: 'uppercase', letterSpacing: 1,
                cursor: 'pointer',
              }}>+ Agregar</button>
              <button onClick={handleRemoveOne} style={{
                flex: 1, padding: '12px 0',
                background: 'transparent', color: SK.coral,
                border: `1px solid ${SK.coral}55`, borderRadius: 10,
                fontFamily: SK.fHead, fontWeight: 700, fontSize: 12,
                textTransform: 'uppercase', letterSpacing: 1,
                cursor: 'pointer',
              }}>Quitar</button>
            </div>
            <button onClick={() => setDupModal(null)} style={{
              width: '100%', marginTop: 10,
              background: 'transparent', color: SK.textMute,
              border: 'none', padding: '6px 0',
              fontFamily: SK.fBody, fontSize: 12, cursor: 'pointer',
            }}>Cerrar</button>
          </div>
        </div>
      )}
    </PhoneShell>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 3.5 — Marketplace
// ─────────────────────────────────────────────────────────────
function MarketplaceScreen({ onNav, userData, collection = {}, marketplaceListings = [], onMarketplaceListingsChange = () => {}, userId = null }) {
  const listings = marketplaceListings;
  const feedListings = React.useMemo(() => listings.filter(l => l.status === 'active'), [listings]);
  const [tab, setTab] = React.useState('feed');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [newType, setNewType] = React.useState('have');
  const [newCards, setNewCards] = React.useState([]);
  const [newDesc, setNewDesc] = React.useState('');
  const [newLocCountry, setNewLocCountry] = React.useState('');
  const [newLocState, setNewLocState] = React.useState('');
  const [newLocCity, setNewLocCity] = React.useState('');
  const [dupSelect, setDupSelect] = React.useState('');
  const [manualCard, setManualCard] = React.useState('');
  const [publishing, setPublishing] = React.useState(false);
  const [pubError, setPubError] = React.useState(null);

  const tabs = [
    { id: 'feed', label: 'Feed' },
    { id: 'new', label: 'Nueva' },
    { id: 'mine', label: 'Mis posts' },
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
        const match = window.stickersFor(country, 1).find(s => s.id === id);
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

  const addSelectedCard = () => {
    if (!dupSelect) return;
    const selected = duplicateOptions.find(o => o.id === dupSelect);
    if (!selected) return;
    if (!newCards.find(c => c.id === selected.id)) {
      setNewCards(prev => [...prev, {
        id: selected.id,
        num: selected.num,
        player: selected.player,
        country: selected.country,
      }]);
    }
    setDupSelect('');
  };

  const removeCard = (id) => {
    setNewCards(prev => prev.filter(c => c.id !== id));
  };

  const addManualCard = () => {
    const raw = manualCard.trim();
    if (!raw) return;
    const numMatch = raw.match(/(\d+)/);
    if (!numMatch) return;
    const num = parseInt(numMatch[1], 10);
    const player = raw.replace(/^#?\d+\s*/, '').trim() || `Estampa #${String(num).padStart(3, '0')}`;
    const id = `MANUAL-${num}-${player.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    if (!newCards.find(c => c.id === id)) {
      setNewCards(prev => [...prev, { id, num, player, country: null }]);
    }
    setManualCard('');
  };

  const handlePublish = async () => {
    if (!userId || newCards.length === 0 || publishing) return;
    setPublishing(true);
    setPubError(null);
    const payload = {
      type: newType,
      cards: newCards,
      description: newDesc.trim(),
      location: newLocCountry ? {
        country: newLocCountry,
        state: newLocState.trim(),
        city: newLocCity.trim(),
      } : null,
    };
    const { data, error } = await window.createMarketplaceListing(userId, payload);
    setPublishing(false);
    if (error || !data) {
      setPubError('No se pudo publicar. Intenta de nuevo.');
      return;
    }
    onMarketplaceListingsChange(prev => [data, ...(prev || [])]);
    setNewCards([]);
    setNewDesc('');
    setNewLocCountry('');
    setNewLocState('');
    setNewLocCity('');
    setTab('feed');
  };

  const handleCloseListing = async (listingId) => {
    const { error } = await window.closeMarketplaceListing(listingId);
    if (!error) {
      onMarketplaceListingsChange(prev => (prev || []).map(l =>
        l.id === listingId ? { ...l, status: 'closed', updated_at: new Date().toISOString() } : l
      ));
    }
  };

  const filtered = feedListings.filter(l => {
    if (typeFilter !== 'all' && l.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const inUser = (l.profile?.username || l.userName || '').toLowerCase().includes(q);
      const inDesc = (l.description || '').toLowerCase().includes(q);
      const inCard = (l.cards || []).some(c => (c.player || '').toLowerCase().includes(q));
      if (!inUser && !inDesc && !inCard) return false;
    }
    return true;
  });

  const mine = listings.filter(l =>
    (userId && (l.user_id === userId || l.userId === userId))
    || (!!userData?.username && l.userName === userData.username)
  );

  const contactHrefFor = (listing) => {
    const contactNumber = listing?.profile?.whatsapp || listing?.profile?.phone;
    if (!contactNumber) return null;
    const displayName = listing?.profile?.display_name || listing?.profile?.username || 'coleccionista';
    const msg = encodeURIComponent(`Hola ${displayName}, vi tu publicación en Stickio`);
    return `https://wa.me/${contactNumber}?text=${msg}`;
  };

  return (
    <PhoneShell active="marketplace" onNav={onNav}>
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 16 }}>
        <div style={{ padding: '6px 20px 14px' }}>
          <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>marketplace</div>
          <div style={{ fontFamily: SK.fHead, fontSize: 26, fontWeight: 700, color: SK.text, marginTop: 2 }}>Intercambios</div>
        </div>

        {/* Tabs */}
        <div style={{ padding: '0 20px 12px' }}>
          <div style={{
            background: SK.surface, border: `1px solid ${SK.border}`,
            borderRadius: 10, padding: 4,
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4,
          }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '9px 0',
                background: tab === t.id ? SK.gold : 'transparent',
                color: tab === t.id ? SK.bg : SK.textMute,
                border: 'none', borderRadius: 8,
                fontFamily: SK.fHead, fontWeight: 700, fontSize: 11,
                textTransform: 'uppercase', letterSpacing: 1,
                cursor: 'pointer',
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {tab === 'feed' && (
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{
              background: SK.surface, border: `1px solid ${SK.border}`,
              borderRadius: 10, padding: '10px 12px',
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
            }}>
              <Icon.Search s={16} c={SK.textMute}/>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por usuario, carta o descripción..."
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  color: SK.text, fontFamily: SK.fBody, fontSize: 13,
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              {[{ id: 'all', label: 'Todos' }, { id: 'have', label: 'Tengo' }, { id: 'want', label: 'Necesito' }, { id: 'exchange', label: 'Intercambio' }].map(f => {
                const on = typeFilter === f.id;
                return (
                  <button key={f.id} onClick={() => setTypeFilter(f.id)} style={{
                    padding: '6px 10px',
                    background: on ? SK.gold : 'transparent',
                    color: on ? SK.bg : SK.textMute,
                    border: on ? 'none' : `1px solid ${SK.border}`,
                    borderRadius: 16,
                    fontFamily: SK.fBody, fontSize: 11, fontWeight: on ? 700 : 500,
                    cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 0.4,
                  }}>{f.label}</button>
                );
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
              {filtered.map(l => (
                <div key={l.id} style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, padding: 14 }}>
                  <div style={{ fontFamily: SK.fMono, fontSize: 12, color: SK.text, fontWeight: 700 }}>@{l.profile?.username || l.userName || 'usuario'}</div>
                  <div style={{ fontSize: 11, color: SK.textMute, marginTop: 4 }}>{l.description}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {(l.cards || []).map((c, i) => (
                      <div key={i} style={{ background: SK.bgSoft, border: `1px solid ${SK.border}`, borderRadius: 8, padding: '4px 8px', fontSize: 11, color: SK.textMute }}>
                        #{String(c.num).padStart(3, '0')} {c.player}
                      </div>
                    ))}
                  </div>
                  {l.user_id !== userId && (
                    <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                      {contactHrefFor(l) ? (
                        <a href={contactHrefFor(l)} target="_blank" rel="noopener noreferrer" style={{ fontFamily: SK.fHead, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: SK.gold, textDecoration: 'none', border: `1px solid ${SK.gold}55`, borderRadius: 8, padding: '7px 10px' }}>
                          WhatsApp
                        </a>
                      ) : (
                        <span style={{ fontFamily: SK.fMono, fontSize: 11, color: SK.textMute, userSelect: 'all' }}>@{l.profile?.username || l.userName || 'usuario'}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'new' && (
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.1, fontWeight: 700, marginBottom: 10 }}>
                Nueva publicación
              </div>

              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                {[{ id: 'have', label: 'Tengo' }, { id: 'want', label: 'Necesito' }, { id: 'exchange', label: 'Intercambio' }].map(opt => {
                  const on = newType === opt.id;
                  return (
                    <button key={opt.id} onClick={() => setNewType(opt.id)} style={{ flex: 1, padding: '7px 6px', background: on ? SK.gold : 'transparent', color: on ? SK.bg : SK.textMute, border: on ? 'none' : `1px solid ${SK.border}`, borderRadius: 8, fontFamily: SK.fHead, fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {newType === 'have' && duplicateOptions.length === 0 ? (
                <div style={{ background: SK.bgSoft, border: `1px dashed ${SK.border}`, borderRadius: 10, padding: 12, fontSize: 11, color: SK.textDim, textAlign: 'center', marginBottom: 10 }}>
                  No tenés repetidas disponibles.
                </div>
              ) : (
                newType === 'have' ? (
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    <select value={dupSelect} onChange={e => setDupSelect(e.target.value)} style={{ flex: 1, background: SK.bgSoft, border: `1px solid ${SK.border}`, borderRadius: 8, color: SK.text, fontFamily: SK.fBody, fontSize: 12, padding: '9px 10px' }}>
                      <option value="">Seleccionar repetida...</option>
                      {duplicateOptions.map(o => (
                        <option key={o.id} value={o.id}>{o.label} · x{o.qty}</option>
                      ))}
                    </select>
                    <button onClick={addSelectedCard} style={{ background: SK.gold, color: SK.bg, border: 'none', borderRadius: 8, padding: '9px 10px', fontFamily: SK.fHead, fontWeight: 700, fontSize: 11 }}>Agregar</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    <input
                      value={manualCard}
                      onChange={e => setManualCard(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addManualCard()}
                      placeholder="#042 Nombre o número"
                      style={{ flex: 1, background: SK.bgSoft, border: `1px solid ${SK.border}`, borderRadius: 8, color: SK.text, fontFamily: SK.fBody, fontSize: 12, padding: '9px 10px' }}
                    />
                    <button onClick={addManualCard} style={{ background: SK.gold, color: SK.bg, border: 'none', borderRadius: 8, padding: '9px 10px', fontFamily: SK.fHead, fontWeight: 700, fontSize: 11 }}>Agregar</button>
                  </div>
                )
              )}

              {newCards.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {newCards.map(card => (
                    <div key={card.id} style={{ display: 'flex', alignItems: 'center', gap: 5, background: SK.bgSoft, border: `1px solid ${SK.border}`, borderRadius: 8, padding: '4px 8px' }}>
                      <span style={{ fontSize: 11, color: SK.text }}>#{String(card.num).padStart(3, '0')}</span>
                      <button onClick={() => removeCard(card.id)} style={{ border: 'none', background: 'none', color: SK.textDim, fontSize: 11, cursor: 'pointer' }}>×</button>
                    </div>
                  ))}
                </div>
              )}

              <textarea
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="Descripción opcional"
                rows={3}
                style={{ width: '100%', resize: 'vertical', background: SK.bgSoft, border: `1px solid ${SK.border}`, borderRadius: 8, color: SK.text, fontFamily: SK.fBody, fontSize: 12, padding: '9px 10px', marginBottom: 10 }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, marginBottom: 10 }}>
                <select value={newLocCountry} onChange={e => setNewLocCountry(e.target.value)} style={{ background: SK.bgSoft, border: `1px solid ${SK.border}`, borderRadius: 8, color: SK.text, fontFamily: SK.fBody, fontSize: 12, padding: '9px 10px' }}>
                  <option value="">País (opcional)</option>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                </select>
                <input value={newLocState} onChange={e => setNewLocState(e.target.value)} placeholder="Estado / Provincia" style={{ background: SK.bgSoft, border: `1px solid ${SK.border}`, borderRadius: 8, color: SK.text, fontFamily: SK.fBody, fontSize: 12, padding: '9px 10px' }}/>
                <input value={newLocCity} onChange={e => setNewLocCity(e.target.value)} placeholder="Ciudad" style={{ background: SK.bgSoft, border: `1px solid ${SK.border}`, borderRadius: 8, color: SK.text, fontFamily: SK.fBody, fontSize: 12, padding: '9px 10px' }}/>
              </div>

              {pubError && <div style={{ fontSize: 11, color: SK.coral, marginBottom: 8 }}>{pubError}</div>}

              <button
                onClick={handlePublish}
                disabled={!userId || newCards.length === 0 || publishing}
                style={{ width: '100%', background: (!userId || newCards.length === 0 || publishing) ? SK.border : SK.gold, color: (!userId || newCards.length === 0 || publishing) ? SK.textMute : SK.bg, border: 'none', borderRadius: 8, padding: '10px 0', fontFamily: SK.fHead, fontWeight: 700, fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase' }}
              >{publishing ? 'Publicando...' : 'Publicar'}</button>
            </div>
          </div>
        )}

        {tab === 'mine' && (
          <div style={{ padding: '0 20px 20px' }}>
            {mine.length === 0 ? (
              <div style={{ background: SK.surface, border: `1px dashed ${SK.border}`, borderRadius: 12, padding: 24, textAlign: 'center', color: SK.textDim }}>
                Sin publicaciones aún.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                {mine.map(l => (
                  <div key={l.id} style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, padding: 14 }}>
                    <div style={{ fontFamily: SK.fMono, fontSize: 12, color: SK.text, fontWeight: 700 }}>@{l.profile?.username || l.userName || 'usuario'}</div>
                    <div style={{ fontSize: 11, color: SK.textMute, marginTop: 4 }}>{l.description}</div>
                    {(l.cards || []).length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                        {(l.cards || []).slice(0, 4).map((c, i) => (
                          <div key={i} style={{ background: SK.bgSoft, border: `1px solid ${SK.border}`, borderRadius: 8, padding: '4px 8px', fontSize: 11, color: SK.textMute }}>
                            #{String(c.num).padStart(3, '0')}
                          </div>
                        ))}
                      </div>
                    )}
                    <button disabled={l.status === 'closed'} onClick={() => handleCloseListing(l.id)} style={{ marginTop: 10, background: 'transparent', color: l.status === 'closed' ? SK.textDim : SK.coral, border: `1px solid ${l.status === 'closed' ? SK.border : SK.coral + '55'}`, borderRadius: 8, padding: '7px 10px', fontFamily: SK.fHead, fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, cursor: l.status === 'closed' ? 'default' : 'pointer' }}>
                      {l.status === 'closed' ? 'Cerrada' : 'Cerrar'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PhoneShell>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 4 — Trade
// ─────────────────────────────────────────────────────────────
function TradeScreen({ onNav, collection = {}, userData = {}, tradeOffers = [], onTradeOffersChange = () => {}, userId = null }) {
  const [tab, setTab] = React.useState('scan');
  const pendingCount = tradeOffers.filter(o => o.to_user === userId && o.status === 'pending').length;

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
            {[['scan', 'Buscar @'], ['history', 'Historial']].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} style={{
                padding: '10px 0', position: 'relative',
                background: tab === id ? SK.gold : 'transparent',
                color: tab === id ? SK.bg : SK.textMute,
                border: 'none', borderRadius: 8,
                fontFamily: SK.fHead, fontWeight: 700, fontSize: 12,
                textTransform: 'uppercase', letterSpacing: 0.8,
                cursor: 'pointer',
              }}>
                {label}
                {id === 'history' && pendingCount > 0 && (
                  <div style={{
                    position: 'absolute', top: 4, right: 6,
                    background: SK.coral, color: '#fff',
                    borderRadius: 8, minWidth: 14, height: 14,
                    fontSize: 9, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 3px',
                  }}>{pendingCount}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {tab === 'scan'    && <ScanTab collection={collection} userId={userId} onTradeOffersChange={onTradeOffersChange}/>} 
        {tab === 'history' && <TradeHistoryMobile tradeOffers={tradeOffers} userId={userId} onTradeOffersChange={onTradeOffersChange}/>} 
      </div>
    </PhoneShell>
  );
}

function TradeHistoryMobile({ tradeOffers = [], userId = null, onTradeOffersChange = () => {} }) {
  const timeAgo = window.timeAgo;

  function fmtDate(ts) {
    if (!ts) return '—';
    return new Date(ts).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  }

  const incoming = tradeOffers.filter(o => o.to_user === userId && o.status === 'pending');
  const sent     = tradeOffers.filter(o => o.from_user === userId && o.status === 'pending');
  const accepted = tradeOffers.filter(o => o.status === 'accepted');

  const applyStatus = (offerId, nextStatus) => {
    onTradeOffersChange(prev => (prev || []).map(o =>
      o.id === offerId ? { ...o, status: nextStatus, updated_at: new Date().toISOString() } : o
    ));
  };

  const handleRespond = async (offerId, accept) => {
    const { error } = await window.respondToOffer(offerId, accept);
    if (!error) applyStatus(offerId, accept ? 'accepted' : 'rejected');
  };

  function Avatar({ username }) {
    return (
      <div style={{
        width: 36, height: 36, borderRadius: 18, flexShrink: 0,
        background: SK.bgSoft, border: `1px solid ${SK.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: SK.gold, fontFamily: SK.fHead, fontSize: 14, fontWeight: 700,
      }}>{(username || '?')[0].toUpperCase()}</div>
    );
  }

  const Section = ({ label, color, children }) => (
    <div style={{ padding: '0 20px 16px' }}>
      <div style={{ fontSize: 10, color: color || SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 700, marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );

  return (
    <div>
      {/* Incoming pending */}
      {incoming.length > 0 && (
        <Section label={`${incoming.length} propuesta${incoming.length !== 1 ? 's' : ''} recibida${incoming.length !== 1 ? 's' : ''}`} color={SK.coral}>
          <div style={{ background: SK.surface, border: `1px solid ${SK.coral}44`, borderRadius: 12, overflow: 'hidden' }}>
            {incoming.map((o, i, a) => {
              const partner = o.from_profile?.username || '?';
              return (
                <div key={o.id} style={{
                  padding: '14px',
                  borderBottom: i < a.length - 1 ? `1px solid ${SK.border}` : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <Avatar username={partner}/>
                    <div>
                      <div style={{ fontFamily: SK.fMono, fontSize: 13, color: SK.text }}>@{partner}</div>
                      <div style={{ fontSize: 11, color: SK.textMute }}>
                        Da {o.from_items?.length || 0} · Pide {o.to_items?.length || 0} · {timeAgo(new Date(o.created_at).getTime())}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <button onClick={() => handleRespond(o.id, false)} style={{
                      padding: '9px 0', background: 'transparent', color: SK.coral,
                      border: `1px solid ${SK.coral}66`, borderRadius: 8,
                      fontFamily: SK.fHead, fontSize: 11, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: 0.8, cursor: 'pointer',
                    }}>Rechazar</button>
                    <button onClick={() => handleRespond(o.id, true)} style={{
                      padding: '9px 0', background: SK.green, color: '#fff',
                      border: 'none', borderRadius: 8,
                      fontFamily: SK.fHead, fontSize: 11, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: 0.8, cursor: 'pointer',
                    }}>Aceptar</button>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Sent pending */}
      {sent.length > 0 && (
        <Section label={`${sent.length} propuesta${sent.length !== 1 ? 's' : ''} en espera`}>
          <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, overflow: 'hidden' }}>
            {sent.map((o, i, a) => {
              const partner = o.to_profile?.username || '?';
              return (
                <div key={o.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '14px',
                  borderBottom: i < a.length - 1 ? `1px solid ${SK.border}` : 'none',
                }}>
                  <Avatar username={partner}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: SK.fMono, fontSize: 13, color: SK.text }}>@{partner}</div>
                    <div style={{ fontSize: 11, color: SK.textMute }}>
                      Ofrezco {o.from_items?.length || 0} · Pido {o.to_items?.length || 0}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: SK.fMono, fontSize: 10, color: SK.gold, fontWeight: 700,
                    background: `${SK.gold}15`, padding: '4px 8px', borderRadius: 8,
                  }}>Esperando</div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Accepted history */}
      <Section label={`${accepted.length} intercambio${accepted.length !== 1 ? 's' : ''} completado${accepted.length !== 1 ? 's' : ''}`}>
        <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, overflow: 'hidden' }}>
          {accepted.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🤝</div>
              <div style={{ fontFamily: SK.fHead, fontSize: 14, fontWeight: 700, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Sin intercambios aún
              </div>
              <div style={{ fontSize: 12, color: SK.textDim, marginTop: 6 }}>
                Busca un @usuario y envía tu primera propuesta.
              </div>
            </div>
          ) : accepted.slice(0, 20).map((o, i, a) => {
            const isFromMe = o.from_user === userId;
            const partner  = (isFromMe ? o.to_profile?.username : o.from_profile?.username) || '?';
            const given    = isFromMe ? (o.from_items?.length || 0) : (o.to_items?.length  || 0);
            const got      = isFromMe ? (o.to_items?.length  || 0) : (o.from_items?.length || 0);
            const net      = got - given;
            return (
              <div key={o.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                borderBottom: i < a.length - 1 ? `1px solid ${SK.border}` : 'none',
              }}>
                <Avatar username={partner}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: SK.fMono, fontSize: 13, color: SK.text }}>@{partner}</div>
                  <div style={{ fontSize: 11, color: SK.textMute, marginTop: 2 }}>
                    ↑{given} dadas · ↓{got} recibidas · {fmtDate(o.updated_at || o.created_at)}
                  </div>
                </div>
                <div style={{
                  fontFamily: SK.fMono, fontSize: 13, fontWeight: 700, flexShrink: 0,
                  color: net > 0 ? SK.green : net < 0 ? SK.coral : SK.textMute,
                }}>{net > 0 ? `+${net}` : `${net}`}</div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

function ScanTab({ collection = {}, userId = null, onTradeOffersChange = () => {} }) {
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [partner, setPartner] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [fromItems, setFromItems] = React.useState([]);
  const [toItems, setToItems] = React.useState([]);
  const [submitting, setSubmitting] = React.useState(false);

  const cleanQuery = query.replace(/^@/, '').replace(/[^a-z0-9_.]/gi, '').toLowerCase().slice(0, 30);
  const canSearch = cleanQuery.length >= 2 && !loading;

  const myDuplicates = React.useMemo(() =>
    Object.entries(collection).filter(([, qty]) => qty >= 2).map(([id, qty]) => ({ id, qty })),
    [collection]
  );

  const needFromPartner = React.useMemo(() => {
    if (!partner) return [];
    return partner.duplicates.filter(d => (collection[d.id] || 0) === 0);
  }, [partner, collection]);

  const theyNeedFromMe = React.useMemo(() => {
    if (!partner) return [];
    return myDuplicates.filter(d => (partner.collectionMap?.[d.id] || 0) === 0);
  }, [myDuplicates, partner]);

  async function handleUsernameSearch(raw = cleanQuery) {
    const clean = (raw || '').replace(/^@/, '').replace(/[^a-z0-9_.]/gi, '').toLowerCase().slice(0, 30);
    if (!clean || !window.supabase?.from) return;
    setLoading(true);
    setError(null);
    setPartner(null);
    try {
      const { data: profile, error: pErr } = await window.supabase
        .from('profiles')
        .select('id, username, display_name')
        .ilike('username', clean)
        .maybeSingle();
      if (pErr || !profile) {
        setError('Usuario no encontrado');
        return;
      }
      if (profile.id === userId) {
        setError('Ese usuario eres tú.');
        return;
      }

      const { data: colData } = await window.supabase
        .from('collections')
        .select('sticker_id, quantity')
        .eq('user_id', profile.id)
        .gte('quantity', 1);

      const collectionMap = {};
      (colData || []).forEach(r => { collectionMap[r.sticker_id] = r.quantity; });
      const duplicates = (colData || []).filter(r => r.quantity >= 2).map(r => ({ id: r.sticker_id, qty: r.quantity }));

      setPartner({ id: profile.id, username: profile.username, name: profile.display_name || profile.username, duplicates, collectionMap });
    } catch {
      setError('No pudimos completar la búsqueda. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  const togglePick = (setList, id) => setList(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

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
      setError('No se pudo enviar la propuesta');
      return;
    }
    if (data?.id) onTradeOffersChange(prev => [data, ...(prev || [])]);
    setModalOpen(false);
    setFromItems([]);
    setToItems([]);
  }

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, padding: 14 }}>
        <div style={{ fontSize: 12, color: SK.textMute, marginBottom: 8 }}>Busca por @usuario para iniciar un intercambio:</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontFamily: SK.fMono, fontSize: 13, color: SK.textMute, pointerEvents: 'none' }}>@</span>
            <input
              value={cleanQuery}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUsernameSearch()}
              placeholder="usuario"
              style={{ width: '100%', background: SK.bgSoft, border: `1px solid ${SK.border}`, borderRadius: 8, padding: '10px 12px 10px 28px', color: SK.text, fontFamily: SK.fMono, fontSize: 13, outline: 'none' }}
            />
          </div>
          <button
            onClick={() => handleUsernameSearch()}
            disabled={!canSearch}
            style={{ background: canSearch ? SK.gold : SK.border, color: canSearch ? SK.bg : SK.textMute, border: 'none', borderRadius: 8, padding: '10px 12px', fontFamily: SK.fHead, fontWeight: 700, fontSize: 12 }}
          >{loading ? 'Buscando...' : 'Buscar'}</button>
        </div>
      </div>

      {error && <div style={{ fontSize: 12, color: SK.coral, fontWeight: 600 }}>{error}</div>}

      {partner && (
        <div style={{ background: SK.surface, border: `1px solid ${SK.border}`, borderRadius: 12, padding: 14 }}>
          <div style={{ fontFamily: SK.fMono, fontSize: 13, color: SK.text }}>@{partner.username}</div>
          <div style={{ fontSize: 12, color: SK.textMute, marginTop: 2 }}>{partner.name}</div>
          <div style={{ marginTop: 10, fontSize: 12, color: SK.textMute }}>Te faltan {needFromPartner.length} · Le faltan {theyNeedFromMe.length}</div>
          <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
            <div>
              <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 6 }}>Sus repetidas que te faltan</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {needFromPartner.length === 0 ? <span style={{ fontSize: 11, color: SK.textDim }}>No hay matches.</span> : needFromPartner.map(d => (
                  <span key={d.id} style={{ fontSize: 11, color: SK.text, background: SK.bgSoft, border: `1px solid ${SK.border}`, borderRadius: 8, padding: '4px 8px' }}>{d.id}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 6 }}>Tus repetidas que le faltan</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {theyNeedFromMe.length === 0 ? <span style={{ fontSize: 11, color: SK.textDim }}>No hay matches.</span> : theyNeedFromMe.map(d => (
                  <span key={d.id} style={{ fontSize: 11, color: SK.text, background: SK.bgSoft, border: `1px solid ${SK.border}`, borderRadius: 8, padding: '4px 8px' }}>{d.id}</span>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            disabled={!needFromPartner.length || !theyNeedFromMe.length || !userId}
            style={{ width: '100%', marginTop: 10, background: (!needFromPartner.length || !theyNeedFromMe.length || !userId) ? SK.border : SK.gold, color: (!needFromPartner.length || !theyNeedFromMe.length || !userId) ? SK.textMute : SK.bg, border: 'none', borderRadius: 8, padding: '10px 12px', fontFamily: SK.fHead, fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}
          >Proponer intercambio</button>
        </div>
      )}

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'flex-end' }} onClick={() => setModalOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: SK.surface, borderRadius: '16px 16px 0 0', padding: '16px 14px 20px', maxHeight: '75vh', overflow: 'auto' }}>
            <div style={{ fontFamily: SK.fHead, fontSize: 15, fontWeight: 700, color: SK.text, textTransform: 'uppercase', marginBottom: 10 }}>Proponer trade</div>
            <div style={{ display: 'grid', gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 6 }}>Ofreces</div>
                <div style={{ border: `1px solid ${SK.border}`, borderRadius: 8 }}>
                  {theyNeedFromMe.map(d => (
                    <label key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderBottom: `1px solid ${SK.border}` }}>
                      <input type="checkbox" checked={fromItems.includes(d.id)} onChange={() => togglePick(setFromItems, d.id)}/>
                      <span style={{ fontFamily: SK.fMono, fontSize: 12, color: SK.text }}>{d.id}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 6 }}>Solicitas</div>
                <div style={{ border: `1px solid ${SK.border}`, borderRadius: 8 }}>
                  {needFromPartner.map(d => (
                    <label key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderBottom: `1px solid ${SK.border}` }}>
                      <input type="checkbox" checked={toItems.includes(d.id)} onChange={() => togglePick(setToItems, d.id)}/>
                      <span style={{ fontFamily: SK.fMono, fontSize: 12, color: SK.text }}>{d.id}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={() => setModalOpen(false)} style={{ flex: 1, background: 'transparent', border: `1px solid ${SK.border}`, borderRadius: 8, padding: '10px 0', color: SK.text }}>Cancelar</button>
              <button onClick={handlePropose} disabled={submitting || fromItems.length === 0 || toItems.length === 0} style={{ flex: 1, background: (submitting || fromItems.length === 0 || toItems.length === 0) ? SK.border : SK.gold, border: 'none', borderRadius: 8, padding: '10px 0', color: (submitting || fromItems.length === 0 || toItems.length === 0) ? SK.textMute : SK.bg, fontFamily: SK.fHead, fontWeight: 700 }}>{submitting ? 'Enviando...' : 'Enviar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 5 — Profile
// ─────────────────────────────────────────────────────────────
function ProfileScreen({ onNav, stats, achievements = [], userData, onUpdateUser, tradeOffers = [], userId = null }) {
  const { have, total, duplicates } = stats;
  const pct = ((have / total) * 100).toFixed(1);
  const [editOpen, setEditOpen] = React.useState(false);
  const user = userData || {};
  const safeName = (user.name || user.username || 'Coleccionista').trim();
  const safeUsername = (user.username || 'usuario').trim();
  const initials = safeName.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const completedCountries = Number(stats?.countriesComplete || 0);
  const acceptedTrades = React.useMemo(
    () => tradeOffers.filter(o => o.status === 'accepted' && (o.from_user === userId || o.to_user === userId)).length,
    [tradeOffers, userId]
  );
  const memberSince = React.useMemo(() => {
    const ts = userData?.created_at;
    if (!ts) return 'Coleccionista en Stickio';
    const dt = new Date(ts);
    if (Number.isNaN(dt.getTime())) return 'Coleccionista en Stickio';
    const month = dt.toLocaleDateString('es-MX', { month: 'short' }).replace('.', '');
    return `Coleccionista desde ${month} ${dt.getFullYear()}`;
  }, [userData?.created_at]);
  const [form, setForm] = React.useState({
    name: safeName,
    username: safeUsername,
    email: userData?.email || '',
    bio: userData?.bio || '',
    location: userData?.location || '',
    whatsapp: userData?.whatsapp || '',
    phone: userData?.phone || '',
  });
  const [saving, setSaving] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [availability, setAvailability] = React.useState({ username: null, phone: null, whatsapp: null });

  React.useEffect(() => {
    setForm({
      name: safeName,
      username: safeUsername,
      email: userData?.email || '',
      bio: userData?.bio || '',
      location: userData?.location || '',
      whatsapp: userData?.whatsapp || '',
      phone: userData?.phone || '',
    });
    setSaving(false);
    setErrorMsg('');
    setAvailability({ username: null, phone: null, whatsapp: null });
  }, [userData]);

  const phoneOk = window.isValidIntlPhone ? window.isValidIntlPhone(form.phone) : true;
  const whatsappOk = window.isValidIntlPhone ? window.isValidIntlPhone(form.whatsapp) : true;
  const canSave = !saving && phoneOk && whatsappOk && String(form.name || '').trim().length > 1 && String(form.username || '').trim().length > 1;

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
              }}>{initials}</div>
            </div>
            <div style={{ fontFamily: SK.fHead, fontSize: 22, fontWeight: 700, color: SK.text }}>{safeName}</div>
            <div style={{ fontFamily: SK.fMono, fontSize: 13, color: SK.textMute, marginTop: 2 }}>@{safeUsername}</div>
            <div style={{ fontSize: 11, color: SK.gold, marginTop: 6, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>{memberSince}</div>
          </div>

          {/* Stats grid */}
          <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <ProfileStat label="Estampas" value={have} sub={`de ${total}`} color={SK.text}/>
            <ProfileStat label="Completado" value={`${pct}%`} sub="del álbum" color={SK.gold}/>
            <ProfileStat label="Intercambios" value={acceptedTrades} sub="realizados" color={SK.text} icon={<Icon.Swap s={14} c={SK.gold}/>}/>
            <ProfileStat label="Países" value={`${completedCountries}/${COUNTRIES.length}`} sub="completos" color={SK.green}/>
          </div>

        {/* Achievements */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ fontSize: 10, color: SK.textMute, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600 }}>logros</div>
          <div style={{ fontFamily: SK.fHead, fontSize: 20, fontWeight: 700, color: SK.text, marginTop: 2, marginBottom: 12 }}>Insignias desbloqueadas</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {(achievements.length ? achievements : [
              { id: 'first', label: 'Primera', desc: 'Estampa', unlocked: true, icon: 'star' },
              { id: 'pct25', label: '25%', desc: 'Del álbum', unlocked: false, icon: 'pct' },
              { id: 'swap', label: '5', desc: 'Repetidas', unlocked: false, icon: 'swap' },
              { id: 'complete', label: '100%', desc: 'Completo', unlocked: false, icon: 'trophy' },
            ]).map(a => (
              <Badge key={a.id} label={a.label} desc={a.desc} unlocked={a.unlocked} locked={!a.unlocked} icon={a.icon}/>
            ))}
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
            <button onClick={() => setEditOpen(true)} style={{
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
      {editOpen && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999,
        }} onClick={() => setEditOpen(false)}>
          <div style={{
            width: MOBILE_W - 40,
            background: SK.surface,
            border: `1px solid ${SK.border}`,
            borderRadius: 16,
            padding: 20,
            maxHeight: MOBILE_H - 120,
            overflow: 'auto',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: SK.fHead, fontSize: 18, fontWeight: 700, color: SK.text, textTransform: 'uppercase', letterSpacing: 0.6 }}>
              Editar perfil
            </div>
            <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
              <input
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre"
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${SK.border}`,
                  borderRadius: 10, padding: '10px 12px',
                  fontFamily: SK.fBody, fontSize: 13, color: SK.text,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              <input
                value={form.username}
                onChange={e => setForm(prev => ({ ...prev, username: e.target.value.replace(/\s/g, '_').toLowerCase() }))}
                onBlur={() => runAvailabilityCheck('username', form.username)}
                placeholder="Username"
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${SK.border}`,
                  borderRadius: 10, padding: '10px 12px',
                  fontFamily: SK.fBody, fontSize: 13, color: SK.text,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              {availability.username && (
                <div style={{ fontSize: 11, color: availability.username === 'ok' ? SK.green : availability.username === 'checking' ? SK.textDim : SK.coral }}>
                  {availability.username === 'ok' ? 'Username disponible.' : availability.username === 'checking' ? 'Verificando username...' : availability.username}
                </div>
              )}
              <input
                value={form.email}
                placeholder="Email"
                disabled
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${SK.border}`,
                  borderRadius: 10, padding: '10px 12px',
                  fontFamily: SK.fBody, fontSize: 13, color: SK.textDim,
                  outline: 'none', boxSizing: 'border-box',
                  opacity: 0.7, cursor: 'not-allowed',
                }}
              />
              <input
                value={form.location}
                onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Ubicación"
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${SK.border}`,
                  borderRadius: 10, padding: '10px 12px',
                  fontFamily: SK.fBody, fontSize: 13, color: SK.text,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              <input
                value={form.whatsapp}
                onChange={e => setForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                onBlur={() => runAvailabilityCheck('whatsapp', form.whatsapp)}
                placeholder="WhatsApp (internacional)"
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${whatsappOk ? SK.border : SK.coral}`,
                  borderRadius: 10, padding: '10px 12px',
                  fontFamily: SK.fMono, fontSize: 13, color: SK.text,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              {whatsappOk && availability.whatsapp && (
                <div style={{ fontSize: 11, color: availability.whatsapp === 'ok' ? SK.green : availability.whatsapp === 'checking' ? SK.textDim : SK.coral }}>
                  {availability.whatsapp === 'ok' ? 'WhatsApp disponible.' : availability.whatsapp === 'checking' ? 'Verificando WhatsApp...' : availability.whatsapp}
                </div>
              )}
              <input
                value={form.phone}
                onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                onBlur={() => runAvailabilityCheck('phone', form.phone)}
                placeholder="Teléfono (fallback)"
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${phoneOk ? SK.border : SK.coral}`,
                  borderRadius: 10, padding: '10px 12px',
                  fontFamily: SK.fMono, fontSize: 13, color: SK.text,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              {phoneOk && availability.phone && (
                <div style={{ fontSize: 11, color: availability.phone === 'ok' ? SK.green : availability.phone === 'checking' ? SK.textDim : SK.coral }}>
                  {availability.phone === 'ok' ? 'Teléfono disponible.' : availability.phone === 'checking' ? 'Verificando teléfono...' : availability.phone}
                </div>
              )}
              {(!whatsappOk || !phoneOk) && (
                <div style={{ fontSize: 11, color: SK.coral }}>
                  Usa formato internacional de 10 a 15 dígitos (sin + ni espacios).
                </div>
              )}
              <textarea
                value={form.bio}
                onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Bio"
                rows={3}
                style={{
                  width: '100%', background: SK.bgSoft,
                  border: `1px solid ${SK.border}`,
                  borderRadius: 10, padding: '10px 12px',
                  fontFamily: SK.fBody, fontSize: 13, color: SK.text,
                  outline: 'none', boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
              {errorMsg && <div style={{ fontSize: 11, color: SK.coral }}>{errorMsg}</div>}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button onClick={() => setEditOpen(false)} style={{
                flex: 1, padding: '10px 0',
                background: 'transparent', color: SK.text,
                border: `1px solid ${SK.border}`,
                borderRadius: 10, fontFamily: SK.fHead, fontWeight: 700, fontSize: 12,
                textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
              }}>Cancelar</button>
              <button disabled={!canSave} onClick={async () => {
                if (!onUpdateUser) { setEditOpen(false); return; }
                setSaving(true);
                setErrorMsg('');
                const { error, message } = await onUpdateUser({
                  ...userData,
                  name: form.name,
                  username: form.username,
                  email: form.email,
                  bio: form.bio,
                  location: form.location,
                  phone: window.normalizeIntlPhone ? window.normalizeIntlPhone(form.phone) : form.phone,
                  whatsapp: window.normalizeIntlPhone ? window.normalizeIntlPhone(form.whatsapp) : form.whatsapp,
                });
                setSaving(false);
                if (error) {
                  setErrorMsg(message || 'No se pudo guardar el perfil.');
                  return;
                }
                setEditOpen(false);
              }} style={{
                flex: 1, padding: '10px 0',
                background: canSave ? SK.gold : SK.border, color: canSave ? SK.bg : SK.textMute,
                border: 'none', borderRadius: 10,
                fontFamily: SK.fHead, fontWeight: 700, fontSize: 12,
                textTransform: 'uppercase', letterSpacing: 1,
                cursor: 'pointer',
              }}>{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </div>
        </div>
      )}
    </>
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

Object.assign(window, { AlbumScreen, TradeScreen, ProfileScreen, MarketplaceScreen, stickersFor, specialStickers, ccStickers });
