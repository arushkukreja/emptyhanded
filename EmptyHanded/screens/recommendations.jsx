// Recommendations — v2: saved first, editorial layout, more life
const Recs = () => {
  const [saved, setSaved] = React.useState(new Set([0, 3]));
  const [hovered, setHovered] = React.useState(null);
  const [regen, setRegen] = React.useState(false);
  const [regenCount, setRegenCount] = React.useState(0);

  const toggleSave = (i) => {
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const picks = [
    { name:'Linen-bound journal, dusk blue', price:'$48', range:'$25–$75', why:'She carries a notebook everywhere. The cover is dyed in small batches — it gets better with every year.', icon:'book', img:2, retailer:'Baronfig', match:98 },
    { name:'Handthrown ceramic pour-over, oat', price:'$62', range:'$25–$75', why:'Slow mornings. Her last mug broke in September — you mentioned it on a walk.', icon:'utensils', img:0, retailer:'East Fork', match:94 },
    { name:'Vinyl: Bill Evans — Sunday at the Village Vanguard', price:'$34', range:'$25–$75', why:'Jazz piano + slow mornings. The most beloved live jazz record ever pressed.', icon:'palette', img:4, retailer:'Amazon', match:91 },
    { name:'Cashmere reading socks, fog grey', price:'$58', range:'$25–$75', why:'A homebody who keeps the thermostat at 67. Her favorite pair is full of holes.', icon:'leaf', img:1, retailer:'Amazon', match:88 },
  ];

  const savedPicks = [
    { name:'Hand-bound poetry chapbook set', price:'$42', img:3, icon:'feather', who:'Maya' },
    { name:'Small-batch black tea sampler, six tins', price:'$54', img:5, icon:'utensils', who:'Maya' },
  ];

  const handleRegen = () => {
    setRegen(true);
    setTimeout(() => { setRegen(false); setRegenCount(c => c+1); }, 1400);
  };

  return (
    <div style={{ fontFamily:'Plus Jakarta Sans, sans-serif', background: EH.bg, color: EH.ink, minHeight:'100%' }}>
      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes matchGrow {
          from { width:0; }
          to   { width:var(--w); }
        }
      `}</style>

      {/* Nav */}
      <div style={{ padding:'18px 56px', borderBottom:`1px solid ${EH.lineSoft}`, background: EH.card, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <Logo/>
        <div style={{ display:'flex', gap:16, alignItems:'center' }}>
          <span style={{ fontSize:13, color: EH.inkMute, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}><Icons.chevL size={14}/> Back to calendar</span>
          <Avatar name="Alex Rivera" tone={1} size={36}/>
        </div>
      </div>

      {/* ── WARM HERO HEADER ── */}
      <div style={{
        background:`linear-gradient(160deg, #fef9ee 0%, #fef3c7 40%, #fde68a 100%)`,
        padding:'40px 56px 36px',
        borderBottom:`1px solid ${EH.amberSoft}`,
      }}>
        <div style={{ fontSize:13, color: EH.amberDeep, marginBottom:14, display:'flex', alignItems:'center', gap:8, fontWeight:500 }}>
          <span style={{ cursor:'pointer', opacity:0.7 }}>Calendar</span>
          <Icons.chevR size={12} stroke={EH.amberDeep}/>
          <span style={{ fontWeight:700 }}>Maya's birthday</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:20 }}>
          <div>
            <div style={{ display:'flex', gap:16, alignItems:'center', marginBottom:12 }}>
              <div style={{
                width:64, height:64, borderRadius:999,
                background:'rgba(245,158,11,0.2)', border:'2.5px solid rgba(245,158,11,0.4)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:22, fontWeight:800, color: EH.amberDeep,
              }}>MP</div>
              <div>
                <h1 style={{ fontSize:34, fontWeight:800, letterSpacing:'-0.025em', margin:0, color: EH.navy }}>Gifts for Maya's birthday</h1>
                <div style={{ fontSize:14, color: EH.amberDeep, marginTop:5, display:'flex', gap:10, alignItems:'center', fontWeight:600 }}>
                  <Icons.calendar size={14}/>
                  <span>Tue, Oct 23 · in 7 days · turns 32</span>
                </div>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {['homebody','reader','creative','$25–$75'].map(t => (
                <span key={t} style={{
                  padding:'5px 12px', borderRadius:999,
                  background:'rgba(255,255,255,0.65)', backdropFilter:'blur(4px)',
                  color: EH.amberDeep, fontSize:12, fontWeight:700,
                  border:'1px solid rgba(245,158,11,0.25)',
                }}>{t}</span>
              ))}
            </div>
          </div>
          <button onClick={handleRegen} style={{
            background: EH.navy, color:'#fff', border:'none',
            padding:'13px 20px', borderRadius:14, fontFamily:'inherit',
            fontWeight:600, fontSize:14, cursor:'pointer',
            display:'inline-flex', gap:9, alignItems:'center',
            boxShadow:'0 8px 24px -8px rgba(15,23,42,0.35)',
          }}>
            <Icons.refresh size={16} stroke={EH.amber} style={{ animation: regen ? 'spin 0.9s linear infinite' : 'none' }}/>
            {regen ? 'Finding new ideas…' : 'Regenerate recommendations'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'36px 40px 80px' }}>

        {/* ── SAVED FIRST (favorites above all) ── */}
        <div style={{ marginBottom:48 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:16 }}>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <Icons.heartFill size={17} fill={EH.amber} stroke={EH.amber}/>
              <h2 style={{ fontSize:20, fontWeight:800, letterSpacing:'-0.015em', margin:0, color: EH.navy }}>
                Saved for Maya
              </h2>
              <span style={{ padding:'3px 9px', borderRadius:999, background: EH.amberSoft, color: EH.amberDeep, fontSize:11, fontWeight:700 }}>{saved.size + savedPicks.length}</span>
            </div>
            <span style={{ fontSize:13, color: EH.inkMute, cursor:'pointer' }}>See all</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12 }}>
            {savedPicks.map((p,i) => (
              <div key={i} style={{
                background: EH.card, borderRadius:14, padding:12,
                border:`1px solid ${EH.line}`,
                display:'flex', gap:12, alignItems:'center', cursor:'pointer',
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = EH.shadow}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ width:60, flexShrink:0 }}>
                  <ProductPlaceholder height={60} radius={8} icon={p.icon} tone={p.img}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color: EH.navy, lineHeight:1.3,
                    overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{p.name}</div>
                  <div style={{ fontSize:12, color: EH.inkMute, marginTop:4, fontWeight:600 }}>{p.price}</div>
                </div>
                <Icons.heartFill size={14} fill={EH.amber} stroke={EH.amber}/>
              </div>
            ))}
            {/* Add your own */}
            <div style={{
              border:`1.5px dashed ${EH.line}`, borderRadius:14, padding:'12px 16px',
              display:'flex', gap:8, alignItems:'center', justifyContent:'center',
              color: EH.inkSoft, fontSize:13, cursor:'pointer',
              transition:'border-color .15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = EH.amber}
              onMouseLeave={e => e.currentTarget.style.borderColor = EH.line}
            >
              <Icons.plus size={14}/> Add your own idea
            </div>
          </div>
        </div>

        {/* ── RECOMMENDATIONS ── */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:24 }}>
            <h2 style={{ fontSize:20, fontWeight:800, letterSpacing:'-0.015em', margin:0, color: EH.navy }}>
              Recommended for Maya
            </h2>
            <span style={{ fontSize:13, color: EH.inkSoft }}>Sorted by how well they fit her profile</span>
          </div>

          {/* Featured pick — large horizontal */}
          {picks.slice(0,1).map((p,i) => {
            const isSaved = saved.has(i);
            return (
              <div key={i}
                onMouseEnter={() => setHovered('feat')} onMouseLeave={() => setHovered(null)}
                style={{
                  background: EH.card, borderRadius:22, marginBottom:20,
                  border:`1px solid ${EH.line}`,
                  boxShadow: hovered==='feat' ? EH.shadowLg : EH.shadow,
                  transform: hovered==='feat' ? 'translateY(-2px)' : 'none',
                  transition:'all .22s ease',
                  display:'grid', gridTemplateColumns:'340px 1fr', overflow:'hidden',
                }}>
                <div style={{ position:'relative' }}>
                  <ProductPlaceholder height={320} radius={0} icon={p.icon} tone={p.img}/>
                  <div style={{
                    position:'absolute', top:16, left:16, padding:'5px 12px',
                    borderRadius:999, background: EH.amber, color: EH.navy, fontSize:11, fontWeight:800,
                  }}>{p.range}</div>
                  <div style={{
                    position:'absolute', top:16, right:16,
                    background:'rgba(255,255,255,0.88)', backdropFilter:'blur(4px)',
                    padding:'4px 10px', borderRadius:999, fontSize:11, fontWeight:700, color: EH.amberDeep,
                  }}>✦ Best match {p.match}%</div>
                </div>
                <div style={{ padding:'32px 32px', display:'flex', flexDirection:'column', gap:16 }}>
                  <div style={{ fontSize:11, fontWeight:700, color: EH.amberDeep, letterSpacing:'0.1em' }}>PICK 01 · FEATURED</div>
                  <h3 style={{ margin:0, fontSize:26, fontWeight:800, letterSpacing:'-0.02em', color: EH.navy, lineHeight:1.15 }}>{p.name}</h3>
                  <div style={{ fontSize:20, fontWeight:700, color: EH.navy }}>{p.price}</div>
                  <div style={{
                    padding:'16px 18px', background: EH.bgAlt, borderRadius:12,
                    fontSize:14, lineHeight:1.6, color: EH.inkMute, fontStyle:'italic',
                    borderLeft:`3px solid ${EH.amber}`,
                  }}>
                    <span style={{ fontStyle:'normal', fontWeight:700, color: EH.amberDeep, fontSize:10, letterSpacing:'0.1em', display:'block', marginBottom:4 }}>WHY THIS FITS MAYA</span>
                    {p.why}
                  </div>
                  {/* Match bar */}
                  <div>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, fontWeight:700, color: EH.inkSoft, marginBottom:6 }}>
                      <span>Profile match</span><span style={{ color: EH.amberDeep }}>{p.match}%</span>
                    </div>
                    <div style={{ height:5, background: EH.bgAlt, borderRadius:99 }}>
                      <div style={{ height:5, width:`${p.match}%`, borderRadius:99, background:`linear-gradient(90deg, ${EH.amber}, ${EH.amberDeep})`, transition:'width 1s ease' }}/>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:10, marginTop:'auto' }}>
                    <button style={{
                      flex:1, background: EH.navy, color:'#fff', border:'none',
                      padding:'14px 0', borderRadius:12, fontFamily:'inherit',
                      fontWeight:600, fontSize:14, cursor:'pointer',
                      display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                    }}>View on {p.retailer} <Icons.arrow size={14}/></button>
                    <button onClick={() => toggleSave(i)} style={{
                      width:50, border:`1px solid ${EH.line}`, background: EH.card,
                      borderRadius:12, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                      color: isSaved ? EH.amber : EH.inkSoft, transition:'all .15s',
                    }}>
                      {isSaved ? <Icons.heartFill size={20}/> : <Icons.heart size={20}/>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Other picks — 3 col */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
            {picks.slice(1).map((p,i) => {
              const idx = i + 1;
              const isSaved = saved.has(idx);
              const isHov = hovered === idx;
              return (
                <div key={idx}
                  onMouseEnter={() => setHovered(idx)} onMouseLeave={() => setHovered(null)}
                  style={{
                    background: EH.card, borderRadius:18, overflow:'hidden',
                    border:`1px solid ${EH.line}`,
                    boxShadow: isHov ? EH.shadowLg : EH.shadow,
                    transform: isHov ? 'translateY(-3px) scale(1.005)' : 'none',
                    transition:'all .2s ease',
                    display:'flex', flexDirection:'column',
                  }}>
                  <div style={{ position:'relative' }}>
                    <ProductPlaceholder height={180} radius={0} icon={p.icon} tone={p.img}/>
                    <button onClick={() => toggleSave(idx)} style={{
                      position:'absolute', top:10, right:10, width:36, height:36, borderRadius:999,
                      background:'rgba(255,255,255,0.9)', backdropFilter:'blur(4px)',
                      border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                      color: isSaved ? EH.amber : EH.inkSoft, transition:'all .15s',
                      boxShadow:'0 2px 8px rgba(0,0,0,0.1)',
                    }}>{isSaved ? <Icons.heartFill size={16}/> : <Icons.heart size={16}/>}</button>
                    <div style={{
                      position:'absolute', top:10, left:10, padding:'4px 10px',
                      borderRadius:999, background: EH.amber, color: EH.navy, fontSize:10, fontWeight:800,
                    }}>{p.range}</div>
                    <div style={{
                      position:'absolute', bottom:10, right:10,
                      background:'rgba(255,255,255,0.85)', backdropFilter:'blur(4px)',
                      padding:'3px 8px', borderRadius:999, fontSize:10, fontWeight:700, color: EH.amberDeep,
                    }}>{p.match}% match</div>
                  </div>
                  <div style={{ padding:'16px 16px 18px', flex:1, display:'flex', flexDirection:'column', gap:10 }}>
                    <div style={{ fontSize:10, fontWeight:700, color: EH.inkSoft, letterSpacing:'0.1em' }}>PICK {String(idx+1).padStart(2,'0')}</div>
                    <h3 style={{ margin:0, fontSize:15, fontWeight:700, letterSpacing:'-0.01em', color: EH.navy, lineHeight:1.3 }}>{p.name}</h3>
                    <div style={{ fontSize:16, fontWeight:700, color: EH.navy }}>{p.price}</div>
                    <div style={{
                      fontSize:12, color: EH.inkMute, fontStyle:'italic', lineHeight:1.5,
                      padding:'10px 12px', background: EH.bgAlt, borderRadius:8,
                      borderLeft:`2.5px solid ${EH.amber}`,
                    }}>{p.why}</div>
                    <button style={{
                      marginTop:'auto', background: EH.navy, color:'#fff', border:'none',
                      padding:'11px 0', borderRadius:10, fontFamily:'inherit', fontWeight:600, fontSize:13,
                      cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                    }}>View on {p.retailer} <Icons.arrow size={13}/></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

window.Recs = Recs;
