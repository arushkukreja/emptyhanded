// Shared design tokens + icons + placeholders for EmptyHanded
// Tokens
const EH = {
  navy: '#0F172A',
  navyMute: '#1E293B',
  navySoft: '#334155',
  amber: '#F59E0B',
  amberSoft: '#FEF3C7',
  amberDeep: '#B45309',
  bg: '#FAFAF9',
  bgAlt: '#F5F4F1',
  card: '#FFFFFF',
  ink: '#0F172A',
  inkMute: '#475569',
  inkSoft: '#94A3B8',
  line: '#E7E5E0',
  lineSoft: '#EFEDE8',
  shadow: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.10)',
  shadowLg: '0 1px 2px rgba(15,23,42,0.04), 0 24px 48px -24px rgba(15,23,42,0.18)',
  radius: 16,
};

// Minimal lucide-style line icons
const Icon = ({ d, size = 20, stroke = 'currentColor', fill = 'none', sw = 1.75, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);

const Icons = {
  gift: (p) => <Icon {...p} d={<><path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></>}/>,
  cake: (p) => <Icon {...p} d={<><path d="M20 21V10H4v11"/><path d="M3 21h18"/><path d="M4 14c2 1 3 0 4 0s2 1 4 1 3-1 4-1 2 1 4 0"/><path d="M12 4v2"/><circle cx="12" cy="3" r="1"/></>}/>,
  heart: (p) => <Icon {...p} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
  heartFill: (p) => <Icon {...p} fill="currentColor" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
  ring: (p) => <Icon {...p} d={<><circle cx="12" cy="15" r="6"/><path d="M9 9 6.5 3h11L15 9"/></>}/>,
  baby: (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><circle cx="9" cy="11" r=".5" fill="currentColor"/><circle cx="15" cy="11" r=".5" fill="currentColor"/><path d="M9 15c.83.67 1.83 1 3 1s2.17-.33 3-1"/></>}/>,
  cap: (p) => <Icon {...p} d={<><path d="m22 10-10-5L2 10l10 5 10-5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/></>}/>,
  home: (p) => <Icon {...p} d={<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></>}/>,
  tree: (p) => <Icon {...p} d={<><path d="m12 2 4 6h-2l4 6h-2l4 6H4l4-6H6l4-6H8l4-6z"/><path d="M12 20v2"/></>}/>,
  calendar: (p) => <Icon {...p} d={<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>}/>,
  plus: (p) => <Icon {...p} d="M12 5v14M5 12h14"/>,
  sparkle: (p) => <Icon {...p} d={<><path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="M19 16v4M17 18h4M5 4v2M4 5h2"/></>}/>,
  mail: (p) => <Icon {...p} d={<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>}/>,
  arrow: (p) => <Icon {...p} d="M5 12h14M13 6l6 6-6 6"/>,
  check: (p) => <Icon {...p} d="M20 6 9 17l-5-5"/>,
  chevR: (p) => <Icon {...p} d="m9 6 6 6-6 6"/>,
  chevL: (p) => <Icon {...p} d="m15 6-6 6 6 6"/>,
  refresh: (p) => <Icon {...p} d={<><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/></>}/>,
  bell: (p) => <Icon {...p} d={<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>}/>,
  search: (p) => <Icon {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>}/>,
  filter: (p) => <Icon {...p} d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z"/>,
  // Personality archetype icons
  book: (p) => <Icon {...p} d={<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5V22h16"/></>}/>,
  utensils: (p) => <Icon {...p} d={<><path d="M3 2v7a3 3 0 0 0 3 3v10"/><path d="M6 2v10"/><path d="M9 2v7a3 3 0 0 1-3 3"/><path d="M18 2c-1.5 0-3 1.5-3 4v6h3v10"/></>}/>,
  dumbbell: (p) => <Icon {...p} d={<><path d="M6.5 6.5 17.5 17.5"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></>}/>,
  laptop: (p) => <Icon {...p} d={<><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/></>}/>,
  palette: (p) => <Icon {...p} d={<><path d="M12 2a10 10 0 1 0 10 10c0-2-1.5-3-3-3h-2a2 2 0 0 1 0-4c1 0 2-1 2-2 0-2-3-3-7-3z"/><circle cx="7" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="7" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/></>}/>,
  plane: (p) => <Icon {...p} d="m22 2-7 20-4-9-9-4 20-7z"/>,
  mountain: (p) => <Icon {...p} d="m3 20 6-10 4 6 3-4 5 8H3z"/>,
  leaf: (p) => <Icon {...p} d={<><path d="M11 20A7 7 0 0 1 4 13c0-7 9-11 17-11 0 9-4 18-11 18z"/><path d="M2 22 11 13"/></>}/>,
  diamond: (p) => <Icon {...p} d="M6 3h12l4 6-10 12L2 9z"/>,
  feather: (p) => <Icon {...p} d={<><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><path d="M16 8 2 22"/><path d="M17.5 15H9"/></>}/>,
};

// Occasion meta
const occasions = [
  { id: 'birthday', label: 'Birthday', icon: 'cake' },
  { id: 'anniversary', label: 'Anniversary', icon: 'heart' },
  { id: 'wedding', label: 'Wedding', icon: 'ring' },
  { id: 'baby', label: 'Baby shower', icon: 'baby' },
  { id: 'graduation', label: 'Graduation', icon: 'cap' },
  { id: 'housewarming', label: 'Housewarming', icon: 'home' },
  { id: 'holiday', label: 'Holiday', icon: 'tree' },
];

const archetypes = [
  { id: 'homebody', label: 'Homebody', icon: 'home' },
  { id: 'foodie', label: 'Foodie', icon: 'utensils' },
  { id: 'fitness', label: 'Fitness', icon: 'dumbbell' },
  { id: 'tech', label: 'Tech Person', icon: 'laptop' },
  { id: 'creative', label: 'Creative', icon: 'palette' },
  { id: 'traveler', label: 'Traveler', icon: 'plane' },
  { id: 'outdoorsy', label: 'Outdoorsy', icon: 'mountain' },
  { id: 'minimalist', label: 'Minimalist', icon: 'leaf' },
  { id: 'luxury', label: 'Luxury Seeker', icon: 'diamond' },
  { id: 'reader', label: 'Reader', icon: 'book' },
];

// Product image placeholder — warm tinted card with iconographic shape
const ProductPlaceholder = ({ tone = 0, label = 'Product', icon = 'gift', height = 220, radius = 14 }) => {
  const palettes = [
    { bg: '#F5EFE6', fg: '#B89271' }, // sand
    { bg: '#EEF2F0', fg: '#5F7D74' }, // sage
    { bg: '#F2EBE3', fg: '#8B6B4F' }, // taupe
    { bg: '#EEEAE4', fg: '#5C5247' }, // stone
    { bg: '#F7EFE3', fg: '#B07A3A' }, // honey
    { bg: '#ECE6DC', fg: '#6E5E47' }, // clay
  ];
  const p = palettes[tone % palettes.length];
  const I = Icons[icon] || Icons.gift;
  return (
    <div style={{
      height, borderRadius: radius, background: p.bg,
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* subtle stripe texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.5,
        backgroundImage: `repeating-linear-gradient(135deg, transparent 0 14px, rgba(255,255,255,0.35) 14px 15px)`,
      }}/>
      <div style={{ position: 'relative', color: p.fg, opacity: 0.85 }}>
        <I size={Math.min(72, height/3)} sw={1.25} stroke={p.fg}/>
      </div>
    </div>
  );
};

// Avatar circle
const Avatar = ({ name = 'A', tone = 0, size = 36 }) => {
  const tones = [
    ['#FDE6B8', '#B45309'],
    ['#E8E2D6', '#5C5247'],
    ['#DCEAE0', '#3F6B53'],
    ['#E6DEEE', '#5B4E78'],
    ['#F3DCDC', '#9B4A4A'],
  ];
  const [bg, fg] = tones[tone % tones.length];
  const initials = name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, background: bg,
      color: fg, fontSize: size * 0.4, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      letterSpacing: '-0.01em',
    }}>{initials}</div>
  );
};

// Logo lockup
const Logo = ({ size = 22, color = EH.navy }) => (
  <div style={{ display:'flex', alignItems:'center', gap: 10, color }}>
    <div style={{
      width: size + 8, height: size + 8, borderRadius: 8, background: EH.navy,
      display:'flex', alignItems:'center', justifyContent:'center', position:'relative',
    }}>
      <svg width={size-4} height={size-4} viewBox="0 0 24 24" fill="none" stroke={EH.amber} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12v10H4V12"/>
        <path d="M2 7h20v5H2z"/>
        <path d="M12 22V7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    </div>
    <span style={{ fontWeight: 800, fontSize: size, letterSpacing: '-0.02em' }}>EmptyHanded</span>
  </div>
);

Object.assign(window, { EH, Icon, Icons, occasions, archetypes, ProductPlaceholder, Avatar, Logo });
