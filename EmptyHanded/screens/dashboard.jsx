// Dashboard — v2: favorites on top, immersive urgent card, timeline list

const Dashboard = ({ empty = false }) => {
  const [activeTab, setActiveTab] = React.useState('all');

  const saved = [
    { name:'Linen-bound journal', who:'Maya', price:'$48', icon:'book', tone:2 },
    { name:'Ceramic pour-over, oat', who:'Maya', price:'$62', icon:'utensils', tone:0 },
    { name:'Bill Evans vinyl', who:'Maya', price:'$34', icon:'palette', tone:4 },
    { name:'Olive wood serving board', who:'David', price:'$74', icon:'leaf', tone:1 },
    { name:'Cashmere baby blanket', who:'Jordan', price:'$89', icon:'baby', tone:3 },
    { name:'Walnut wine rack', who:'Sam', price:'$55', icon:'home', tone:5 },
  ];

  const events = [
    { name:'Maya Patel', rel:'sister-in-law', occ:'Birthday', date:'Tue, Oct 23', days:7, tone:0, picks:5 },
    { name:'David & Lila', rel:'parents', occ:'Anniversary · 25yr', date:'Mon, Nov 4', days:19, tone:2, picks:4 },
    { name:'Jordan Chen', rel:'best friend', occ:'Baby shower', date:'Sat, Nov 16', days:31, tone:3, picks:6 },
    { name:'Sam Park', rel:'brother', occ:'Housewarming', date:'Sun, Dec 1', days:46, tone:4, picks:3 },
  ];

  const urgencyColor = (d) => d <= 7 ? EH.amber : d <= 21 ? '#fb923c' : EH.inkSoft;
  const urgencyBg = (d) => d <= 7 ? EH.amberSoft : d <= 21 ? '#ffedd5' : EH.bgAlt;

  if (empty) {
    return (
      <DashShell>
        <div style={{
          maxWidth:520, margin:'120px auto', textAlign:'center',
          background: EH.card, padding:'56px 40px', borderRadius:28,
          border:`1px solid ${EH.line}`, boxShadow: EH.shadow,
        }}>
          <div style={{
            width:80, height:80, borderRadius:999, background: EH.amberSoft,
            display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 24px', color: EH.amberDeep,
          }}><Icons.gift size={36} sw={1.5}/></div>
          <h2 style={{ fontSize:28, fontWeight:800, letterSpacing:'-0.02em', margin:'0 0 12px', color: EH.navy }}>No upcoming occasions.</h2>
          <p style={{ fontSize:16, lineHeight:1.55, color: EH.inkMute, margin:'0 0 32px' }}>
            Someone's birthday is coming up. <em>Trust us.</em><br/>Add the people who matter — we'll handle the rest.
          </p>
          <button style={{
            background: EH.navy, color:'#fff', border:'none', padding:'14px 26px',
            borderRadius:999, fontFamily:'inherit', fontWeight:600, fontSize:15, cursor:'pointer',
            display:'inline-flex', gap:8, alignItems:'center',
          }}><Icons.plus size={18}/> Add your first occasion</button>
        </div>
      </DashShell>
    );
  }

  return (
    <DashShell>
      <div style={{ padding:'0 0 96px' }}>

        {/* ── SAVED PICKS STRIP (favorites above all) ── */}
        <div style={{ borderBottom:`1px solid ${EH.lineSoft}`, padding:'20px 56px 22px', background: EH.card }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <Icons.heartFill size={16} stroke={EH.amber} fill={EH.amber}/>
              <span style={{ fontWeight:700, fontSize:14, color: EH.navy }}>Saved picks</span>
              <span style={{
                padding:'2px 8px', borderRadius:999, background: EH.amberSoft,
                color: EH.amberDeep, fontSize:11, fontWeight:700,
              }}>{saved.length}</span>
            </div>
            <span style={{ fontSize:13, color: EH.inkMute, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
              See all <Icons.chevR size={13}/>
            </span>
          </div>
          <div style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:4 }}>
            {saved.map((g,i) => (
              <div key={i} style={{
                flexShrink:0, width:160, background: EH.bg,
                borderRadius:14, padding:10, cursor:'pointer',
                border:`1px solid ${EH.lineSoft}`,
                transition:'transform .15s, box-shadow .15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=EH.shadow; }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}
              >
                <ProductPlaceholder height={90} radius={10} icon={g.icon} tone={g.tone}/>
                <div style={{ marginTop:8 }}>
                  <div style={{ fontSize:12, fontWeight:700, color: EH.navy, lineHeight:1.3,
                    overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{g.name}</div>
                  <div style={{ fontSize:11, color: EH.inkMute, marginTop:4, display:'flex', justifyContent:'space-between' }}>
                    <span>{g.who}</span><span style={{ fontWeight:600, color: EH.navy }}>{g.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── GREETING + TABS ── */}
        <div style={{ padding:'32px 56px 0', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
          <div>
            <div style={{ fontSize:13, color: EH.inkMute, marginBottom:4 }}>Good afternoon, Alex.</div>
            <h1 style={{ fontSize:32, fontWeight:800, letterSpacing:'-0.025em', margin:0, color: EH.navy }}>
              Upcoming <span style={{ color: EH.inkSoft, fontWeight:500, fontSize:28 }}>· {events.length} occasions</span>
            </h1>
          </div>
        </div>

        {/* ── URGENT HERO CARD ── */}
        <div style={{ padding:'24px 56px 0' }}>
          <div style={{
            background: `linear-gradient(135deg, ${EH.navy} 0%, #1e3a5f 60%, #0f2744 100%)`,
            borderRadius:24, padding:'0', overflow:'hidden',
            boxShadow:'0 4px 8px rgba(15,23,42,0.08), 0 24px 56px -16px rgba(15,23,42,0.28)',
            display:'grid', gridTemplateColumns:'1fr auto',
          }}>
            {/* Left: person info */}
            <div style={{ padding:'32px 36px 32px' }}>
              <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:20 }}>
                <div style={{
                  padding:'5px 12px', borderRadius:999, background: EH.amber, color: EH.navy,
                  fontSize:11, fontWeight:800, letterSpacing:'0.06em',
                }}>⏰ IN 7 DAYS</div>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:600 }}>MOST URGENT</span>
              </div>
              <div style={{ display:'flex', gap:18, alignItems:'center', marginBottom:24 }}>
                <div style={{
                  width:72, height:72, borderRadius:999,
                  background:'rgba(245,158,11,0.2)',
                  border:'2.5px solid rgba(245,158,11,0.5)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:28, fontWeight:800, color: EH.amber, letterSpacing:'-0.02em',
                }}>MP</div>
                <div>
                  <div style={{ fontSize:28, fontWeight:800, color:'#fff', letterSpacing:'-0.02em', lineHeight:1.1 }}>Maya Patel's birthday</div>
                  <div style={{ fontSize:14, color:'rgba(255,255,255,0.55)', marginTop:6 }}>
                    Tuesday, Oct 23 · sister-in-law · turns 32
                  </div>
                </div>
              </div>
              {/* Saved gift preview row */}
              <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:24 }}>
                {[{icon:'book',tone:2},{icon:'utensils',tone:0},{icon:'palette',tone:4}].map((g,i)=>(
                  <div key={i} style={{ width:64, borderRadius:10, overflow:'hidden', border:'1.5px solid rgba(255,255,255,0.12)' }}>
                    <ProductPlaceholder height={64} radius={0} icon={g.icon} tone={g.tone}/>
                  </div>
                ))}
                <div style={{ marginLeft:4, fontSize:13, color:'rgba(255,255,255,0.5)', fontStyle:'italic' }}>
                  +2 more saved
                </div>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button style={{
                  background: EH.amber, color: EH.navy, border:'none', padding:'13px 22px',
                  borderRadius:12, fontFamily:'inherit', fontWeight:700, fontSize:14,
                  cursor:'pointer', display:'inline-flex', gap:7, alignItems:'center',
                }}>View gift picks <Icons.arrow size={15}/></button>
                <button style={{
                  background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.75)',
                  border:'1px solid rgba(255,255,255,0.14)', padding:'13px 18px',
                  borderRadius:12, fontFamily:'inherit', fontWeight:600, fontSize:14, cursor:'pointer',
                }}>Edit profile</button>
              </div>
            </div>
            {/* Right: large countdown */}
            <div style={{
              padding:'32px 40px',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              borderLeft:'1px solid rgba(255,255,255,0.07)',
              background:'rgba(255,255,255,0.03)',
              minWidth:180,
            }}>
              <div style={{ fontSize:96, fontWeight:800, color: EH.amber, lineHeight:1, letterSpacing:'-0.05em' }}>7</div>
              <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.45)', letterSpacing:'0.1em', marginTop:4 }}>DAYS LEFT</div>
            </div>
          </div>
        </div>

        {/* ── UPCOMING TIMELINE LIST ── */}
        <div style={{ padding:'32px 56px 0' }}>
          <div style={{ fontSize:12, fontWeight:700, color: EH.inkSoft, letterSpacing:'0.1em', marginBottom:18 }}>LATER THIS SEASON</div>
          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {events.slice(1).map((e,i) => {
              const isLast = i === events.slice(1).length - 1;
              return (
                <div key={i}
                  onMouseEnter={ev => ev.currentTarget.style.background='rgba(245,158,11,0.04)'}
                  onMouseLeave={ev => ev.currentTarget.style.background='transparent'}
                  style={{
                    display:'grid', gridTemplateColumns:'auto 1fr auto auto',
                    gap:20, alignItems:'center',
                    padding:'18px 20px', borderRadius:14,
                    borderBottom: isLast ? 'none' : `1px solid ${EH.lineSoft}`,
                    cursor:'pointer', transition:'background .15s',
                  }}>
                  {/* Avatar + timeline dot */}
                  <div style={{ position:'relative', display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{
                      position:'absolute', left:-21, top:'50%', transform:'translateY(-50%)',
                      width:10, height:10, borderRadius:999,
                      background: urgencyBg(e.days),
                      border:`2px solid ${urgencyColor(e.days)}`,
                    }}/>
                    <Avatar name={e.name} tone={e.tone} size={44}/>
                  </div>
                  {/* Info */}
                  <div>
                    <div style={{ fontSize:16, fontWeight:700, color: EH.navy, letterSpacing:'-0.01em' }}>{e.name}</div>
                    <div style={{ fontSize:13, color: EH.inkMute, marginTop:2 }}>
                      {e.occ} · {e.date} · {e.picks} saved picks
                    </div>
                  </div>
                  {/* Days badge */}
                  <div style={{
                    padding:'6px 14px', borderRadius:999,
                    background: urgencyBg(e.days), color: urgencyColor(e.days),
                    fontSize:12, fontWeight:700, whiteSpace:'nowrap',
                  }}>in {e.days}d</div>
                  {/* Arrow */}
                  <div style={{ color: EH.inkSoft }}><Icons.chevR size={18}/></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAB */}
      <div style={{ position:'absolute', bottom:32, right:32, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10 }}>
        <div style={{
          background: EH.navy, color:'#fff', padding:'6px 14px', borderRadius:8,
          fontSize:12, fontWeight:600, opacity:0.9,
        }}>Add occasion</div>
        <button style={{
          width:62, height:62, borderRadius:999, background: EH.amber,
          border:'none', color: EH.navy, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 12px 28px -6px rgba(245,158,11,0.6), 0 4px 10px -2px rgba(15,23,42,0.2)',
        }}>
          <Icons.plus size={28} sw={2.5}/>
        </button>
      </div>
    </DashShell>
  );
};

const DashShell = ({ children }) => (
  <div style={{ fontFamily:'Plus Jakarta Sans, sans-serif', background: EH.bg, color: EH.ink, minHeight:'100%', position:'relative' }}>
    <div style={{
      display:'flex', justifyContent:'space-between', alignItems:'center',
      padding:'18px 56px', borderBottom:`1px solid ${EH.lineSoft}`, background: EH.card,
    }}>
      <div style={{ display:'flex', gap:44, alignItems:'center' }}>
        <Logo/>
        <div style={{ display:'flex', gap:28, fontSize:14, fontWeight:600, color: EH.inkMute }}>
          <span style={{ color: EH.navy, position:'relative' }}>Calendar
            <span style={{ position:'absolute', bottom:-20, left:0, right:0, height:2.5, background: EH.amber, borderRadius:2 }}/>
          </span>
          <span style={{ cursor:'pointer' }}>Recipients</span>
          <span style={{ cursor:'pointer' }}>Saved gifts</span>
        </div>
      </div>
      <div style={{ display:'flex', gap:14, alignItems:'center' }}>
        <div style={{ width:36, height:36, borderRadius:999, background: EH.bgAlt, display:'flex', alignItems:'center', justifyContent:'center', color: EH.inkMute, cursor:'pointer' }}><Icons.search size={18}/></div>
        <div style={{ position:'relative' }}>
          <div style={{ width:36, height:36, borderRadius:999, background: EH.bgAlt, display:'flex', alignItems:'center', justifyContent:'center', color: EH.inkMute, cursor:'pointer' }}><Icons.bell size={18}/></div>
          <span style={{ position:'absolute', top:4, right:4, width:8, height:8, borderRadius:999, background: EH.amber, border:'2px solid #fff' }}/>
        </div>
        <Avatar name="Alex Rivera" tone={1} size={36}/>
      </div>
    </div>
    {children}
  </div>
);

window.Dashboard = Dashboard;
window.DashShell = DashShell;
