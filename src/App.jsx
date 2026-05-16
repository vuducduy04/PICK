import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import './App.css';

// ============ DATA ============
const ALL_RESTAURANTS = [
  {
    id: 'saffron', name: 'Saffron & Smoke',
    address: '412 Valencia St, San Francisco',
    distanceKm: 0.4, type: 'Restaurant',
    photos: [
      { from: '#3a1f12', via: '#7a3a1e', to: '#d97c3a', label: 'TANDOOR · LOW LIGHT' },
      { from: '#2a1410', via: '#5e2d1a', to: '#e09545', label: 'ROOM · INTERIOR' },
      { from: '#1a0e08', via: '#3a2110', to: '#c47a30', label: 'DISH 01' },
    ],
  },
  {
    id: 'tokyo', name: 'Little Tokyo Diner',
    address: '239 16th St, Mission Bay',
    distanceKm: 0.8, type: 'Bistro',
    photos: [
      { from: '#0e1a24', via: '#1f3a4d', to: '#e85a5a', label: 'NEON · COUNTER' },
      { from: '#0a141a', via: '#1a2a38', to: '#7ec9d6', label: 'BAR · NIGHT' },
      { from: '#10181e', via: '#2a3a48', to: '#f0a050', label: 'SKEWERS' },
    ],
  },
  {
    id: 'bocca', name: 'Bocca della Verità',
    address: '1140 Folsom St, SoMa',
    distanceKm: 1.2, type: 'Restaurant',
    photos: [
      { from: '#1a1208', via: '#5a3a18', to: '#e8c074', label: 'WARM · WOOD' },
      { from: '#120a06', via: '#3a240e', to: '#d4a050', label: 'PASTA · TABLE' },
      { from: '#1f160a', via: '#62421e', to: '#f0d090', label: 'PATIO · LIGHTS' },
    ],
  },
  {
    id: 'verde', name: 'Verde Cantina',
    address: '2890 Mission St, Mission District',
    distanceKm: 0.6, type: 'Bar',
    photos: [
      { from: '#0f1f14', via: '#2a5238', to: '#a8d063', label: 'GREEN · DAY' },
      { from: '#0a1810', via: '#1f4030', to: '#88c050', label: 'AGAVE WALL' },
      { from: '#101a14', via: '#2e4a38', to: '#c0d878', label: 'PATIO · LIVE' },
    ],
  },
  {
    id: 'okatsu', name: 'Café Okatsu',
    address: '188 Octavia Blvd, Hayes Valley',
    distanceKm: 1.1, type: 'Cafe',
    photos: [
      { from: '#1a140e', via: '#3a2e1f', to: '#d0a878', label: 'CERAMIC · LIGHT' },
      { from: '#141008', via: '#2e2418', to: '#b89065', label: 'POUR-OVER' },
      { from: '#181410', via: '#3a3024', to: '#e0c89c', label: 'BENCH · WINDOW' },
    ],
  },
  {
    id: 'pho', name: 'Pho Mama',
    address: '1750 Mission St, Mission District',
    distanceKm: 0.9, type: 'Restaurant',
    photos: [
      { from: '#1a0e0e', via: '#6a2a1f', to: '#f0a050', label: 'STEAM · BROTH' },
      { from: '#150a0a', via: '#4a1f18', to: '#e08858', label: 'BOWL' },
      { from: '#1a0e08', via: '#5a2818', to: '#f0b070', label: 'STALL · NEON' },
    ],
  },
  {
    id: 'frizz', name: 'Frizz · Boba Bar',
    address: '655 Polk St, Lower Nob Hill',
    distanceKm: 2.1, type: 'Bubble Tea Shop',
    photos: [
      { from: '#1a0e1f', via: '#3a1f4d', to: '#f088c0', label: 'PINK · NEON' },
      { from: '#150a18', via: '#2a1a3a', to: '#d870b0', label: 'CUPS' },
      { from: '#1f0e2a', via: '#4a2860', to: '#e898d0', label: 'COUNTER' },
    ],
  },
  {
    id: 'mie', name: 'Mie & Mie',
    address: '1300 Fillmore St, Lower Pac Heights',
    distanceKm: 2.4, type: 'Bakery',
    photos: [
      { from: '#1a140a', via: '#52421e', to: '#e8c878', label: 'GOLD · CRUST' },
      { from: '#160e08', via: '#3a2a18', to: '#d0a868', label: 'LOAF' },
      { from: '#1a1410', via: '#4a3a28', to: '#e8d098', label: 'WINDOW · MORN' },
    ],
  },
  {
    id: 'elio', name: "Elio's Gelateria",
    address: '590 Castro St, Castro',
    distanceKm: 3.1, type: 'Gelato',
    photos: [
      { from: '#0e1820', via: '#1f3a52', to: '#a0d0e0', label: 'ICE · PASTEL' },
      { from: '#0a1418', via: '#1a2e3a', to: '#88b8c8', label: 'SCOOPS' },
      { from: '#10202a', via: '#2a4858', to: '#b8d8e0', label: 'CABINET' },
    ],
  },
  {
    id: 'hasan', name: 'Hasan Ocakbaşı',
    address: '528 Green St, North Beach',
    distanceKm: 3.6, type: 'Restaurant',
    photos: [
      { from: '#1f120a', via: '#7a3a10', to: '#f0883a', label: 'EMBERS · GRILL' },
      { from: '#180e08', via: '#5a2810', to: '#e07028', label: 'KEBAB' },
      { from: '#1a0e08', via: '#62301a', to: '#f09c50', label: 'LAVASH' },
    ],
  },
  {
    id: 'tide', name: 'Tide & Table',
    address: 'Pier 9, Embarcadero',
    distanceKm: 4.4, type: 'Restaurant',
    photos: [
      { from: '#0a1822', via: '#1f3a52', to: '#d0e0e8', label: 'FOG · BAY' },
      { from: '#0e1a24', via: '#28425a', to: '#b0c8d8', label: 'DECK' },
      { from: '#10202c', via: '#324a60', to: '#c0d8e0', label: 'OYSTERS' },
    ],
  },
  {
    id: 'kosa', name: 'Kosa Coffee',
    address: '899 Bush St, Lower Nob Hill',
    distanceKm: 1.8, type: 'Cafe',
    photos: [
      { from: '#141008', via: '#2e2418', to: '#c8a070', label: 'TILE · WARM' },
      { from: '#181210', via: '#3a2818', to: '#b88860', label: 'CUP · BAR' },
      { from: '#1a1410', via: '#3a2a1f', to: '#d0a878', label: 'PATIO' },
    ],
  },
];

const TYPES = ['Any', 'Restaurant', 'Bistro', 'Cafe', 'Bubble Tea Shop', 'Bakery', 'Bar', 'Pub', 'Gelato'];
const LOCATIONS = ['Your current location', 'Pick a location'];
const SORT_OPTIONS = [
  { value: 'added-desc', label: 'Recently added' },
  { value: 'added-asc', label: 'Earliest added' },
  { value: 'name-asc', label: 'Name (A → Z)' },
  { value: 'name-desc', label: 'Name (Z → A)' },
  { value: 'distance-asc', label: 'Distance (near → far)' },
  { value: 'distance-desc', label: 'Distance (far → near)' },
];

const fmtDist = (km) => `${km.toFixed(1)} km away`;

// ============ ICONS ============
const Icon = {
  Home: ({ size = 22, weight = 1.9 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={weight} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 11L12 3.5 20.5 11" /><path d="M5.5 9.5V20a.5.5 0 00.5.5h4V14h4v6.5h4a.5.5 0 00.5-.5V9.5" />
    </svg>
  ),
  List: ({ size = 22 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="5" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="5" cy="17.5" r="1.1" fill="currentColor" stroke="none" />
      <path d="M9 6.5h11M9 12h11M9 17.5h11" />
    </svg>
  ),
  Diamond: ({ size = 22 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M3 9 L7 3 L17 3 L21 9 L12 22 Z" fill="currentColor" />
      <g fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="0.9" strokeLinejoin="round" strokeLinecap="round">
        <path d="M3 9 L21 9" /><path d="M7 3 L12 9 L17 3" />
        <path d="M12 9 L12 22" /><path d="M3 9 L12 22" /><path d="M21 9 L12 22" />
      </g>
    </svg>
  ),
  Moon: ({ size = 22 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 14a9 9 0 11-11-11 7 7 0 0011 11z" />
    </svg>
  ),
  Sun: ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M4.6 19.4L6 18M18 6l1.4-1.4" />
    </svg>
  ),
  Filter: ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  ),
  Chevron: ({ size = 16 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  ),
  ChevronDown: ({ size = 14 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  Check: ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12l5 5L20 6" />
    </svg>
  ),
  Lock: ({ size = 14 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7a4 4 0 018 0v3.5" />
    </svg>
  ),
  MapPin: ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s-7-7.5-7-13a7 7 0 1114 0c0 5.5-7 13-7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  Close: ({ size = 18 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  Trash: ({ size = 16 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6M9 6V4h6v2" />
    </svg>
  ),
};

// ============ HERO PLACEHOLDER ============
function Hero({ photo }) {
  return (
    <div className="hero-ph" aria-hidden="true">
      <div className="hero-grad" style={{ background: `linear-gradient(155deg, ${photo.from} 0%, ${photo.via} 55%, ${photo.to} 100%)` }} />
      <div className="hero-noise" />
      <div className="hero-stripes" />
      <div className="hero-tag">▢ photo · {photo.label}</div>
    </div>
  );
}

// ============ CARD ============
function Card({ r, photoIdx, style, drag, isTop, onPointerDown, onPointerMove, onPointerUp }) {
  const photo = r.photos[photoIdx] || r.photos[0];
  const tilt = drag ? drag.dx * 0.06 : 0;
  const dxAbs = drag ? Math.min(1, Math.abs(drag.dx) / 140) : 0;
  const yesOp = drag && drag.dx > 0 ? dxAbs : 0;
  const noOp = drag && drag.dx < 0 ? dxAbs : 0;
  const transform = drag
    ? `translate3d(${drag.dx}px, ${drag.dy * 0.4}px, 0) rotate(${tilt}deg)`
    : style?.transform || '';

  return (
    <div
      className={`card ${isTop ? 'card-top' : 'card-back'}`}
      style={{
        transform,
        transition: drag ? 'none' : 'transform 360ms cubic-bezier(.22,1,.36,1), opacity 280ms',
        ...style,
      }}
      onPointerDown={isTop ? onPointerDown : undefined}
      onPointerMove={isTop ? onPointerMove : undefined}
      onPointerUp={isTop ? onPointerUp : undefined}
      onPointerCancel={isTop ? onPointerUp : undefined}
    >
      <Hero photo={photo} />
      <div className="progress">
        {r.photos.map((_, i) => <span key={i} className={i === photoIdx ? 'on' : ''} />)}
      </div>
      <div className="card-scrim" />
      <div className="edge yes" style={{ opacity: yesOp }} />
      <div className="edge no" style={{ opacity: noOp }} />
      <div className="stamp stamp-yes" style={{ opacity: yesOp, transform: `rotate(-12deg) scale(${0.85 + yesOp * 0.2})` }}>PICK</div>
      <div className="stamp stamp-no"  style={{ opacity: noOp,  transform: `rotate(10deg) scale(${0.85 + noOp * 0.2})` }}>PASS</div>
      <div className="card-info">
        <div className="meta">
          <span className="type-chip">{r.type}</span>
        </div>
        <h2 className="name">{r.name}</h2>
        <div className="addr">{r.address}</div>
        <div className="dist">{fmtDist(r.distanceKm)}</div>
      </div>
    </div>
  );
}

// ============ TOP BARS ============
function Brand() {
  return <div className="brand"><span>PIC</span><span className="k">K</span></div>;
}

function TopBarHome({ darkMode, onDiamond, onMoon }) {
  return (
    <div className="topbar">
      <Brand />
      <div className="topbar-actions">
        <button className="tb-icon" onClick={onDiamond} aria-label="Subscription"><Icon.Diamond /></button>
        <button className="tb-icon" onClick={onMoon} aria-label="Toggle theme">
          {darkMode ? <Icon.Sun /> : <Icon.Moon />}
        </button>
      </div>
    </div>
  );
}

function TopBarList({ sort, onSortOpen, onDiamond, darkMode, onMoon }) {
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label || sort;
  return (
    <div className="topbar list-mode">
      <button className="sort-btn" onClick={onSortOpen} aria-label="Sort order">
        <span className="sm">Sort by</span>
        <span>{sortLabel}</span>
        <Icon.ChevronDown size={14} />
      </button>
      <div className="topbar-actions">
        <button className="tb-icon" onClick={onDiamond} aria-label="Subscription"><Icon.Diamond /></button>
        <button className="tb-icon" onClick={onMoon} aria-label="Toggle theme">
          {darkMode ? <Icon.Sun /> : <Icon.Moon />}
        </button>
      </div>
    </div>
  );
}

// ============ HOME SCREEN ============
function HomeScreen({ deck, onAccept, onPass, photoIdx, setPhotoIdx, totalCap, totalSeen, onReset }) {
  const [drag, setDrag] = useState(null);
  const [flyOut, setFlyOut] = useState(null);
  const dragRef = useRef(null);
  const cardRectRef = useRef(null);
  const top = deck[0];

  const handlePointerDown = useCallback((e) => {
    if (!top) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    cardRectRef.current = rect;
    dragRef.current = { startX: e.clientX, startY: e.clientY, dx: 0, dy: 0, t0: Date.now() };
    setDrag({ dx: 0, dy: 0 });
  }, [top]);

  const handlePointerMove = useCallback((e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    dragRef.current.dx = dx;
    dragRef.current.dy = dy;
    setDrag({ dx, dy });
  }, []);

  const commit = useCallback((dir, dy = 0) => {
    if (!top) return;
    setFlyOut({ dir, dy });
    setDrag(null);
    setTimeout(() => {
      if (dir === 'right') onAccept(top); else onPass(top);
      setFlyOut(null);
    }, 320);
  }, [top, onAccept, onPass]);

  const handlePointerUp = useCallback((e) => {
    if (!dragRef.current) return;
    const { startX, dx, dy, t0 } = dragRef.current;
    const totalMove = Math.abs(dx) + Math.abs(dy);
    const elapsed = Date.now() - t0;
    dragRef.current = null;

    if (totalMove < 10 && elapsed < 350) {
      const rect = cardRectRef.current;
      if (rect) {
        const localX = startX - rect.left;
        if (localX > rect.width / 2) {
          setPhotoIdx((i) => Math.min(top.photos.length - 1, i + 1));
        } else {
          setPhotoIdx((i) => Math.max(0, i - 1));
        }
      }
      setDrag(null);
      return;
    }

    if (Math.abs(dx) > 110) {
      commit(dx > 0 ? 'right' : 'left', dy);
    } else {
      setDrag(null);
    }
  }, [top, commit, setPhotoIdx]);

  if (!top) {
    return (
      <div className="home">
        <div className="empty">
          <div className="empty-eyebrow">{totalSeen >= totalCap ? 'Daily limit' : 'All caught up'}</div>
          <div className="empty-title">
            {totalSeen >= totalCap ? '100 picks for today.' : "That's everyone nearby."}
          </div>
          <div className="empty-sub">
            {totalSeen >= totalCap
              ? 'Free plan resets every 8 hours. Upgrade for unlimited picks.'
              : 'Adjust your filters to widen the search.'}
          </div>
          <button className="empty-btn" onClick={onReset}>Reshuffle deck</button>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="deck">
        {deck.slice(0, 3).reverse().map((r, idx, arr) => {
          const depth = arr.length - 1 - idx;
          const isTop = depth === 0;
          const isFlying = isTop && flyOut;
          const scale = 1 - depth * 0.04;
          const y = depth * 10;
          const baseStyle = {
            transform: isFlying
              ? `translate3d(${flyOut.dir === 'right' ? 600 : -600}px, ${flyOut.dy * 0.6}px, 0) rotate(${flyOut.dir === 'right' ? 20 : -20}deg)`
              : `translate3d(0, ${y}px, 0) scale(${scale})`,
            opacity: isFlying ? 0 : 1,
            zIndex: 10 - depth,
          };
          return (
            <Card
              key={r.id}
              r={r}
              photoIdx={isTop && !isFlying ? photoIdx : 0}
              style={baseStyle}
              drag={isTop && !isFlying ? drag : null}
              isTop={isTop && !isFlying}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />
          );
        })}
      </div>
    </div>
  );
}

// ============ LIST ROW ============
function ListRow({ r, onDelete, onOpen }) {
  const [tx, setTx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startRef = useRef(null);

  const onDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY, base: tx, locked: null, moved: 0 };
    setDragging(true);
  };
  const onMove = (e) => {
    if (!startRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    startRef.current.moved = Math.max(startRef.current.moved, Math.abs(dx) + Math.abs(dy));
    if (startRef.current.locked === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      startRef.current.locked = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    if (startRef.current.locked === 'x') {
      setTx(Math.max(-130, Math.min(0, startRef.current.base + dx)));
    }
  };
  const onUp = () => {
    if (!startRef.current) { setDragging(false); return; }
    const moved = startRef.current.moved;
    const wasOpen = startRef.current.base < -10;
    setDragging(false);
    startRef.current = null;
    if (tx < -60) { setTx(-92); return; }
    if (moved < 8 && !wasOpen) { setTx(0); onOpen(r); return; }
    setTx(0);
  };

  const handleDelete = () => {
    setTx(-400);
    setTimeout(() => onDelete(r.id), 240);
  };

  return (
    <div className="list-row-wrap">
      <button className="row-delete" onClick={handleDelete} aria-label={`Remove ${r.name}`}>
        <Icon.Trash size={16} /> Remove
      </button>
      <div
        className={`list-row ${dragging ? 'dragging' : ''}`}
        style={{ transform: `translateX(${tx}px)` }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div className="row-thumb"><Hero photo={r.photos[0]} /></div>
        <div className="row-body">
          <div className="row-name">{r.name}</div>
          <div className="row-addr">{r.address}</div>
          <div className="row-dist">{fmtDist(r.distanceKm)}</div>
        </div>
        <div className="row-tail">
          <span className="badge">{r.type}</span>
          <span className="row-chevron"><Icon.Chevron /></span>
        </div>
      </div>
    </div>
  );
}

// ============ LIST SCREEN ============
function ListScreen({ items, onDelete, onOpen }) {
  return (
    <div className="list-screen">
      <div className="list-summary">
        <span className="count">{items.length}</span>
        <span className="sub">on your list</span>
      </div>
      {items.length === 0 ? (
        <div className="list-empty">
          <div className="big">Nothing here yet.</div>
          <div>Swipe right on a card to add it.</div>
        </div>
      ) : (
        <div className="list-rows">
          {items.map((r) => (
            <ListRow key={r.id} r={r} onDelete={onDelete} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  );
}

// ============ BOTTOM NAV ============
function BottomNav({ tab, setTab, onFilter }) {
  return (
    <div className="bottomnav-wrap">
      <button className="bnav-filter" onClick={onFilter} aria-label="Filters">
        <Icon.Filter size={22} />
        <span className="bnav-lbl">Filter</span>
      </button>
      <div className="bottomnav">
        <button className={`bnav-btn ${tab === 'home' ? 'on' : ''}`} onClick={() => setTab('home')} aria-label="Home">
          <Icon.Home size={22} />
          <span className="bnav-lbl">Home</span>
        </button>
        <button className={`bnav-btn ${tab === 'list' ? 'on' : ''}`} onClick={() => setTab('list')} aria-label="Your list">
          <Icon.List size={22} />
          <span className="bnav-lbl">List</span>
        </button>
      </div>
    </div>
  );
}

// ============ SUBSCRIPTION SHEET ============
function SubscriptionSheet({ onClose, plan, onUpgrade, closing }) {
  return (
    <>
      <div className={`sheet-backdrop${closing ? ' closing' : ''}`} onClick={onClose} />
      <div className={`sheet${closing ? ' closing' : ''}`} role="dialog" aria-label="Subscription">
        <div className="sheet-handle" />
        <div className="sheet-head">
          <div className="sheet-title">Subscription</div>
          <button className="sheet-done" onClick={onClose}>Done</button>
        </div>
        <div className="sub-grid">
          <div className="sub-col">
            <div className="sub-eyebrow">Free</div>
            <div className="sub-name">PICK Basic</div>
            <div className="sub-price">$0 forever</div>
            <ul className="sub-list">
              <li><span className="bullet" /><span>100 places max (8h reset)</span></li>
              <li><span className="bullet" /><span>Default filters only</span></li>
            </ul>
            <button className="sub-cta current" disabled>
              {plan === 'basic' ? 'Your current plan' : 'Downgrade'}
            </button>
          </div>
          <div className="sub-col plus">
            <div className="sub-eyebrow">Premium</div>
            <div className="sub-name">PICK Plus</div>
            <div className="sub-price"><b>$4.99</b> / month</div>
            <ul className="sub-list">
              <li><span className="bullet" /><span>Infinite restaurants</span></li>
              <li><span className="bullet" /><span>Advanced filters</span></li>
              <li><span className="bullet" /><span>Choose your favor area</span></li>
              <li><span className="bullet" /><span>No ads</span></li>
            </ul>
            <button className="sub-cta upgrade" onClick={plan === 'plus' ? undefined : onUpgrade}>
              {plan === 'plus' ? "You're on Plus" : 'Upgrade your plan'}
            </button>
          </div>
        </div>
        <div className="sub-footer">Cancel any time. Auto-renews monthly.</div>
      </div>
    </>
  );
}

// ============ FILTER SHEET ============
function FilterSheet({ onClose, filters, setFilters, plan, closing }) {
  const [expand, setExpand] = useState(null);

  return (
    <>
      <div className={`sheet-backdrop${closing ? ' closing' : ''}`} onClick={onClose} />
      <div className={`sheet${closing ? ' closing' : ''}`} role="dialog" aria-label="Filters">
        <div className="sheet-handle" />
        <div className="sheet-head">
          <div className="sheet-title">Filters</div>
          <button className="sheet-done" onClick={onClose}>Done</button>
        </div>
        <div className="filter-list">
          {/* Location */}
          <div className="filter-group">
            <button className="filter-row" onClick={() => setExpand(expand === 'location' ? null : 'location')}>
              <div className="lbl">
                <div className="ttl">Location</div>
                <div className="val">{filters.location}</div>
              </div>
              <div className="right"><Icon.ChevronDown /></div>
            </button>
            {expand === 'location' && (
              <div className="filter-options">
                {LOCATIONS.map((loc) => {
                  const locked = loc === 'Pick a location' && plan !== 'plus';
                  const on = filters.location === loc;
                  return (
                    <button
                      key={loc}
                      className={`option-row ${on ? 'on' : ''} ${locked ? 'disabled' : ''}`}
                      onClick={() => {
                        if (locked) return;
                        setFilters((f) => ({ ...f, location: loc }));
                        setExpand(null);
                      }}
                    >
                      <span>{loc}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        {locked && <span className="pro">PLUS</span>}
                        {on && <Icon.Check />}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Maximum distance */}
          <div className="filter-group">
            <div className="slider-row">
              <div className="lbl-line">
                <div className="ttl">Maximum distance</div>
                <div className="val">{filters.maxKm} km</div>
              </div>
              <input
                type="range" min="0" max="10" step="1"
                value={filters.maxKm}
                style={{ '--pct': `${(filters.maxKm / 10) * 100}%` }}
                className="slider"
                onChange={(e) => setFilters((f) => ({ ...f, maxKm: Number(e.target.value) }))}
              />
              <div className="slider-ticks">
                <span>0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10 km</span>
              </div>
            </div>
          </div>

          {/* Type */}
          <div className="filter-group">
            <button className="filter-row" onClick={() => setExpand(expand === 'type' ? null : 'type')}>
              <div className="lbl">
                <div className="ttl">Type</div>
                <div className="val">{filters.type}</div>
              </div>
              <div className="right"><Icon.ChevronDown /></div>
            </button>
            {expand === 'type' && (
              <div className="filter-options">
                {TYPES.map((tp) => {
                  const on = filters.type === tp;
                  const isFreeAllowed = tp === 'Any' || tp === 'Restaurant' || tp === 'Cafe';
                  const locked = plan !== 'plus' && !isFreeAllowed;
                  return (
                    <button
                      key={tp}
                      className={`option-row ${on ? 'on' : ''} ${locked ? 'disabled' : ''}`}
                      onClick={() => {
                        if (locked) return;
                        setFilters((f) => ({ ...f, type: tp }));
                        setExpand(null);
                      }}
                    >
                      <span className="lock-l">
                        {locked && <span className="lock"><Icon.Lock size={13} /></span>}
                        <span>{tp}</span>
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        {locked && <span className="pro">PLUS</span>}
                        {on && <Icon.Check />}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ============ SORT SHEET ============
function SortSheet({ onClose, sort, setSort, closing }) {
  return (
    <>
      <div className={`sheet-backdrop${closing ? ' closing' : ''}`} onClick={onClose} />
      <div className={`sheet${closing ? ' closing' : ''}`} role="dialog" aria-label="Sort">
        <div className="sheet-handle" />
        <div className="sheet-head">
          <div className="sheet-title">Sort list by</div>
          <button className="sheet-done" onClick={onClose}>Done</button>
        </div>
        <div className="sort-list">
          <div className="filter-group">
            {SORT_OPTIONS.map((o, i) => (
              <button
                key={o.value}
                className={`option-row ${sort === o.value ? 'on' : ''}`}
                style={{ borderTop: i === 0 ? 'none' : '0.5px solid var(--line-2)', borderRadius: 0, padding: '14px 16px' }}
                onClick={() => { setSort(o.value); onClose(); }}
              >
                <span>{o.label}</span>
                {sort === o.value && <Icon.Check />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ============ MAP SHEET ============
function MapSheet({ r, onClose, closing }) {
  const seedRoads = useMemo(() => {
    if (!r) return [];
    let s = 0;
    for (let i = 0; i < r.id.length; i++) s = (s * 31 + r.id.charCodeAt(i)) >>> 0;
    const rng = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
    return Array.from({ length: 7 }, () => ({
      x: rng() * 100, y: rng() * 100,
      w: 30 + rng() * 50, h: 4 + rng() * 4,
      a: Math.floor(rng() * 4) * 45,
    }));
  }, [r?.id]);

  if (!r) return null;
  return (
    <div className={`map-sheet${closing ? ' closing' : ''}`} role="dialog" aria-label={`Map: ${r.name}`}>
      <div className="map-canvas">
        <div className="map-grid" />
        {seedRoads.map((rd, i) => (
          <div key={i} className="map-road" style={{
            left: `${rd.x}%`, top: `${rd.y}%`,
            width: `${rd.w}%`, height: `${rd.h}px`,
            transform: `rotate(${rd.a}deg)`,
          }} />
        ))}
        <div className="map-you" title="You are here" />
        <div className="map-pin">
          <span className="pin-label">{r.name}</span>
          <span className="pin-glyph"><Icon.MapPin size={20} /></span>
        </div>
      </div>
      <button className="map-close" onClick={onClose} aria-label="Close map"><Icon.Close size={18} /></button>
      <div className="map-detail">
        <div className="eyebrow">{r.type}</div>
        <div className="name">{r.name}</div>
        <div className="addr">{r.address}</div>
        <div className="dist">{fmtDist(r.distanceKm)}</div>
        <div className="map-cta-row">
          <button className="map-cta ghost" onClick={onClose}>Back to list</button>
          <button className="map-cta primary">Open in Maps</button>
        </div>
      </div>
    </div>
  );
}

// ============ APP ROOT ============
export default function App() {
  const TOTAL_CAP = 100;
  const [tab, setTab] = useState('home');
  const [sheet, setSheet] = useState(null);
  const [closingSheet, setClosingSheet] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [plan, setPlan] = useState('basic');
  const [mapPlace, setMapPlace] = useState(null);
  const [closingMap, setClosingMap] = useState(null);

  const SHEET_DURATION = 280;

  const openSheet = (name) => {
    setClosingSheet(null);
    setSheet(name);
  };
  const closeSheet = () => {
    if (!sheet) return;
    setClosingSheet(sheet);
    setSheet(null);
    setTimeout(() => setClosingSheet(null), SHEET_DURATION);
  };
  const openMap = (r) => setMapPlace(r);
  const closeMap = () => {
    if (!mapPlace) return;
    setClosingMap(mapPlace);
    setMapPlace(null);
    setTimeout(() => setClosingMap(null), SHEET_DURATION);
  };
  const [filters, setFilters] = useState({
    location: 'Your current location',
    maxKm: 5,
    type: 'Restaurant',
  });
  const [sort, setSort] = useState('added-desc');
  const [photoIdx, setPhotoIdx] = useState(0);
  const [accepted, setAccepted] = useState([]);
  const [seenIds, setSeenIds] = useState([]);
  const [toast, setToast] = useState(null);

  const filteredDeck = useMemo(() => {
    return ALL_RESTAURANTS.filter((r) => {
      if (filters.maxKm < r.distanceKm) return false;
      if (filters.type === 'Any') {
        if (plan !== 'plus') return r.type === 'Restaurant' || r.type === 'Cafe';
        return true;
      }
      return r.type === filters.type;
    });
  }, [filters, plan]);

  const deck = useMemo(() => {
    const acceptedIds = new Set(accepted.map((a) => a.r.id));
    const capped = plan === 'plus' ? Infinity : TOTAL_CAP;
    const totalSeen = seenIds.length + accepted.length;
    if (totalSeen >= capped) return [];
    return filteredDeck.filter((r) => !seenIds.includes(r.id) && !acceptedIds.has(r.id));
  }, [filteredDeck, seenIds, accepted, plan]);

  useEffect(() => { setPhotoIdx(0); }, [deck[0]?.id]);

  const totalSeen = seenIds.length + accepted.length;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const onAccept = useCallback((r) => {
    setAccepted((a) => [{ r, addedAt: Date.now() }, ...a]);
    setSeenIds((s) => [...s, r.id]);
    showToast(`Added ${r.name}`);
  }, []);

  const onPass = useCallback((r) => {
    setSeenIds((s) => [...s, r.id]);
  }, []);

  const onReset = () => setSeenIds([]);
  const onDelete = (id) => setAccepted((a) => a.filter((x) => x.r.id !== id));

  const sortedList = useMemo(() => {
    const items = accepted.slice();
    switch (sort) {
      case 'added-desc': return items.map((x) => x.r);
      case 'added-asc': return items.slice().reverse().map((x) => x.r);
      case 'name-asc': return items.slice().sort((a, b) => a.r.name.localeCompare(b.r.name)).map((x) => x.r);
      case 'name-desc': return items.slice().sort((a, b) => b.r.name.localeCompare(a.r.name)).map((x) => x.r);
      case 'distance-asc': return items.slice().sort((a, b) => a.r.distanceKm - b.r.distanceKm).map((x) => x.r);
      case 'distance-desc': return items.slice().sort((a, b) => b.r.distanceKm - a.r.distanceKm).map((x) => x.r);
      default: return items.map((x) => x.r);
    }
  }, [accepted, sort]);

  // slide direction: Home=left(0), List=right(100%)
  const homeX = tab === 'home' ? '0%' : '-100%';
  const listX = tab === 'list' ? '0%' : '100%';

  return (
    <div className="app" data-dark={darkMode}>
      {/* Top bar — two panes slide horizontally */}
      <div className="slide-wrap-topbar">
        <div className="slide-pane" style={{ transform: `translateX(${homeX})` }}>
          <TopBarHome darkMode={darkMode} onDiamond={() => openSheet('subscription')} onMoon={() => setDarkMode((d) => !d)} />
        </div>
        <div className="slide-pane" style={{ transform: `translateX(${listX})` }}>
          <TopBarList sort={sort} onSortOpen={() => openSheet('sort')} onDiamond={() => openSheet('subscription')} darkMode={darkMode} onMoon={() => setDarkMode((d) => !d)} />
        </div>
      </div>

      {/* Main content — two panes slide horizontally */}
      <div className="slide-wrap-screens">
        <div className="slide-pane" style={{ transform: `translateX(${homeX})` }}>
          <HomeScreen deck={deck} onAccept={onAccept} onPass={onPass} photoIdx={photoIdx} setPhotoIdx={setPhotoIdx} totalCap={TOTAL_CAP} totalSeen={totalSeen} onReset={onReset} />
        </div>
        <div className="slide-pane" style={{ transform: `translateX(${listX})` }}>
          <ListScreen items={sortedList} onDelete={onDelete} onOpen={openMap} />
        </div>
      </div>

      {toast && (
        <div className="toast">
          <span className="pill"><Icon.Check size={12} /></span>
          {toast}
        </div>
      )}

      <BottomNav tab={tab} setTab={setTab} onFilter={() => openSheet('filter')} />

      {(sheet === 'subscription' || closingSheet === 'subscription') && (
        <SubscriptionSheet
          closing={closingSheet === 'subscription'}
          plan={plan}
          onClose={closeSheet}
          onUpgrade={() => { setPlan('plus'); closeSheet(); showToast('Welcome to PICK Plus'); }}
        />
      )}
      {(sheet === 'filter' || closingSheet === 'filter') && (
        <FilterSheet
          closing={closingSheet === 'filter'}
          plan={plan}
          filters={filters}
          setFilters={setFilters}
          onClose={closeSheet}
        />
      )}
      {(sheet === 'sort' || closingSheet === 'sort') && (
        <SortSheet
          closing={closingSheet === 'sort'}
          sort={sort}
          setSort={setSort}
          onClose={closeSheet}
        />
      )}
      {(mapPlace || closingMap) && (
        <MapSheet
          r={mapPlace || closingMap}
          closing={!mapPlace && !!closingMap}
          onClose={closeMap}
        />
      )}
    </div>
  );
}
