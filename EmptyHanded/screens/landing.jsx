// Landing page — v2: animated hero background
const Landing = () => {
  const [email, setEmail] = React.useState('');
  const [hovered, setHovered] = React.useState(null);
  const [submitted, setSubmitted] = React.useState(false);

  const steps = [
    { n: '01', t: 'Add an occasion', d: 'Birthday, anniversary, baby shower — drop the date and recipient. Takes about 8 seconds.', icon: 'calendar' },
    { n: '02', t: 'Build their profile', d: 'A homebody who loves bourbon. A foodie minimalist. The more specific, the better the matches.', icon: 'sparkle' },
    { n: '03', t: 'Get perfect picks', d: 'Seven days before the event, three thoughtful gift ideas in your inbox. One click to buy.', icon: 'mail' },
  ];

  const testimonials = [
    { q: 'I forgot my sister-in-law\'s birthday three years running. This year I looked like the favorite.', who: 'Maya R.', role: 'mother of two, recovering gift-procrastinator' },
    { q: 'The recommendations are eerily good. It suggested an obscure pottery book for my dad. He cried.', who: 'James O.', role: 'son who finally gets it' },
    { q: 'Cheaper than the bottle of wine I usually panic-buy at the gas station.', who: 'Priya K.', role: 'wedding season survivor' },
  ];

  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', background: EH.bg, color: EH.ink, minHeight: '100%' }}>
      <style>{`
        @keyframes orbDrift1 {
          0%,100% { transform: translate(0px,0px) scale(1); }
          33%      { transform: translate(50px,-40px) scale(1.09); }
          66%      { transform: translate(-20px,28px) scale(0.94); }
        }
        @keyframes orbDrift2 {
          0%,100% { transform: translate(0px,0px) scale(1); }
          40%      { transform: translate(-38px,32px) scale(1.12); }
          70%      { transform: translate(28px,-22px) scale(0.91); }
        }
        @keyframes orbDrift3 {
          0%,100% { transform: translate(0px,0px) scale(1); }
          50%      { transform: translate(22px,40px) scale(1.07); }
        }
        @keyframes cardFloat {
          0%,100% { transform: rotate(2.5deg) translateY(0px); }
          50%      { transform: rotate(2.5deg) translateY(-11px); }
        }
        @keyframes cardFloatBack {
          0%,100% { transform: rotate(-3deg) translateY(-4px); }
          50%      { transform: rotate(-3deg) translateY(7px); }
        }
        @keyframes dotPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.6; transform:scale(0.7); }
        }
        @keyframes grain {
          0%,100% { transform: translate(0,0); }
          10%      { transform: translate(-2%,-3%); }
          20%      { transform: translate(3%,2%); }
          30%      { transform: translate(-1%,4%); }
          40%      { transform: translate(2%,-2%); }
          50%      { transform: translate(-3%,1%); }
          60%      { transform: translate(1%,3%); }
          70%      { transform: translate(2%,-1%); }
          80%      { transform: translate(-2%,2%); }
          90%      { transform: translate(1%,-3%); }
        }
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Nav */}
      <nav style={{
        display:'flex', justifyContent:'space-between', alignItems:'center',
        padding: '22px 64px', borderBottom: `1px solid ${EH.lineSoft}`,
        position:'relative', zIndex: 10, background: EH.bg,
      }}>
        <Logo />
        <div style={{ display:'flex', gap: 32, alignItems:'center', fontSize: 14, color: EH.inkMute, fontWeight: 500 }}>
          <span style={{ cursor:'pointer' }}>How it works</span>
          <span style={{ cursor:'pointer' }}>Pricing</span>
          <span style={{ cursor:'pointer' }}>Sign in</span>
          <button style={{
            background: EH.navy, color: '#fff', border: 'none', padding: '10px 20px',
            borderRadius: 999, fontWeight: 600, fontSize: 14, cursor:'pointer', fontFamily:'inherit',
          }}>Get started</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ position:'relative', overflow:'hidden' }}>
        {/* Animated orbs */}
        <div aria-hidden="true" style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
          <div style={{
            position:'absolute', top:'-18%', right:'-10%',
            width: 760, height: 760, borderRadius:'50%',
            background: 'radial-gradient(circle at 40% 40%, rgba(245,158,11,0.26) 0%, rgba(245,158,11,0.06) 45%, transparent 70%)',
            animation: 'orbDrift1 14s ease-in-out infinite',
          }}/>
          <div style={{
            position:'absolute', bottom:'-30%', left:'-14%',
            width: 860, height: 860, borderRadius:'50%',
            background: 'radial-gradient(circle at 60% 60%, rgba(15,23,42,0.07) 0%, rgba(30,41,59,0.03) 50%, transparent 70%)',
            animation: 'orbDrift2 18s ease-in-out infinite',
          }}/>
          <div style={{
            position:'absolute', top:'25%', left:'38%',
            width: 420, height: 420, borderRadius:'50%',
            background: 'radial-gradient(circle at center, rgba(254,243,199,0.65) 0%, transparent 70%)',
            animation: 'orbDrift3 10s ease-in-out infinite',
          }}/>
          {/* Noise grain overlay */}
          <div style={{
            position:'absolute', inset:'-60%',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
            backgroundSize: '180px 180px',
            opacity: 0.6,
            animation: 'grain 8s steps(1) infinite',
            pointerEvents:'none',
          }}/>
        </div>

        {/* Hero content */}
        <div style={{ position:'relative', zIndex:1, padding: '96px 64px 88px', display:'grid', gridTemplateColumns:'1.05fr 0.95fr', gap: 64, alignItems:'center' }}>
          <div>
            <div style={{
              display:'inline-flex', alignItems:'center', gap: 8,
              padding: '6px 14px', borderRadius: 999,
              background: EH.amberSoft, color: EH.amberDeep,
              fontSize: 12, fontWeight: 600, letterSpacing: '0.02em', marginBottom: 28,
            }}>
              <span style={{ width:6, height:6, borderRadius:999, background: EH.amber, animation:'dotPulse 2s ease-in-out infinite' }}/>
              AI-curated picks, hand-feeling warmth
            </div>
            <h1 style={{
              fontSize: 78, lineHeight: 0.96, fontWeight: 800, letterSpacing: '-0.036em',
              margin: 0, color: EH.navy, textWrap: 'balance',
            }}>
              Never show up<br/>empty handed <span style={{ color: EH.amber, fontStyle:'italic', fontWeight:700 }}>again.</span>
            </h1>
            <p style={{ fontSize:19, lineHeight:1.55, color: EH.inkMute, marginTop:24, maxWidth:520 }}>
              Add the people who matter. We learn what they love.
              Seven days before any birthday, anniversary, or shower — three thoughtful gifts land in your inbox.
            </p>

            <div style={{
              marginTop: 36, display:'flex', gap:8, maxWidth:480,
              background:'rgba(255,255,255,0.85)', backdropFilter:'blur(8px)',
              padding: 6, borderRadius: 999,
              boxShadow: '0 2px 4px rgba(15,23,42,0.04), 0 12px 32px -12px rgba(245,158,11,0.2)',
              border: `1px solid ${EH.line}`,
            }}>
              <input value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@goodfriend.com"
                style={{ flex:1, border:'none', outline:'none', padding:'14px 20px', fontSize:15, fontFamily:'inherit', background:'transparent', color: EH.ink }}/>
              <button
                onClick={() => setSubmitted(true)}
                onMouseEnter={() => setHovered('cta')} onMouseLeave={() => setHovered(null)}
                style={{
                  background: submitted ? '#16a34a' : EH.navy, color:'#fff', border:'none',
                  padding:'12px 22px', borderRadius:999, fontWeight:600, fontSize:14,
                  cursor:'pointer', fontFamily:'inherit',
                  transform: hovered==='cta' ? 'scale(1.02)' : 'scale(1)',
                  transition:'all .18s ease',
                  display:'flex', alignItems:'center', gap:6,
                }}>
                {submitted ? 'Check your inbox' : 'Start free'}
                {!submitted ? <Icons.arrow size={16}/> : <Icons.check size={16}/>}
              </button>
            </div>
            <div style={{ marginTop:14, fontSize:13, color: EH.inkSoft, display:'flex', gap:18 }}>
              <span style={{ display:'flex', alignItems:'center', gap:6 }}><Icons.check size={14} stroke={EH.amber}/> Free forever for 3 people</span>
              <span style={{ display:'flex', alignItems:'center', gap:6 }}><Icons.check size={14} stroke={EH.amber}/> No card required</span>
            </div>
          </div>

          {/* Floating hero cards */}
          <div style={{ position:'relative', height:500 }}>
            {/* Back card */}
            <div style={{
              position:'absolute', inset:'2% 4% 22% -2%',
              background: EH.card, borderRadius:22,
              boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
              border: `1px solid ${EH.line}`, padding:24,
              animation: 'cardFloatBack 9s ease-in-out infinite',
              zIndex:0, opacity:0.75,
            }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', color: EH.inkSoft, marginBottom:12 }}>NEXT UP</div>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <Avatar name="David K" tone={2} size={40}/>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color: EH.navy }}>David & Lila's anniversary</div>
                  <div style={{ fontSize:12, color: EH.inkMute }}>Nov 4 · 5 years · 19 days away</div>
                </div>
              </div>
            </div>
            {/* Front card */}
            <div style={{
              position:'absolute', inset:'10% -4% 4% 8%',
              background: '#fff', borderRadius:22,
              boxShadow: '0 4px 8px rgba(15,23,42,0.06), 0 24px 56px -16px rgba(245,158,11,0.24)',
              border: `1px solid ${EH.line}`,
              padding:28, animation:'cardFloat 7s ease-in-out infinite',
              zIndex:1, display:'flex', flexDirection:'column', gap:16,
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', color: EH.inkSoft }}>UPCOMING</div>
                <div style={{ padding:'4px 12px', borderRadius:999, background: EH.amber, color: EH.navy, fontSize:11, fontWeight:800 }}>⏰ in 7 days</div>
              </div>
              <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                <Avatar name="Maya Patel" tone={0} size={52}/>
                <div>
                  <div style={{ fontWeight:800, fontSize:20, letterSpacing:'-0.015em', color: EH.navy }}>Maya's birthday</div>
                  <div style={{ fontSize:13, color: EH.inkMute }}>Tuesday, Oct 23 · turns 32</div>
                </div>
              </div>
              <div style={{ borderTop:`1px dashed ${EH.line}`, paddingTop:16, display:'flex', gap:12, alignItems:'center' }}>
                <ProductPlaceholder height={76} radius={10} icon="book" tone={2}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, fontWeight:700, color: EH.amberDeep, letterSpacing:'0.06em', marginBottom:4 }}>TOP PICK</div>
                  <div style={{ fontSize:14, fontWeight:700, color: EH.navy, lineHeight:1.3 }}>Linen-bound journal, dusk blue</div>
                  <div style={{ fontSize:12, color: EH.inkMute, fontStyle:'italic', marginTop:3 }}>Because she always carries a notebook</div>
                </div>
              </div>
              <button style={{
                background: EH.navy, color:'#fff', border:'none', padding:'12px 0',
                borderRadius:12, fontFamily:'inherit', fontWeight:600, fontSize:14, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              }}>View all picks <Icons.arrow size={14}/></button>
            </div>
            {/* Amber sparkle badge */}
            <div style={{
              position:'absolute', right:20, top:-10, zIndex:2,
              width:54, height:54, borderRadius:999, background: EH.amber,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 12px 24px -6px rgba(245,158,11,0.5)',
              transform:'rotate(12deg)',
            }}>
              <Icons.sparkle size={24} stroke="#fff" sw={2.2}/>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker bar */}
      <div style={{
        background: EH.navy, color:'rgba(255,255,255,0.7)', fontSize:12, fontWeight:600,
        padding:'10px 0', overflow:'hidden', whiteSpace:'nowrap', letterSpacing:'0.06em',
      }}>
        <div style={{ display:'inline-flex', gap:0, animation:'tickerScroll 22s linear infinite' }}>
          {Array(6).fill(null).map((_,i) =>
            <span key={i} style={{ paddingRight:64 }}>
              🎁 Birthdays · Anniversaries · Baby Showers · Graduations · Housewarmings · Holidays · Weddings &nbsp;·&nbsp;
            </span>
          )}
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding:'80px 64px 96px', background: EH.bgAlt }}>
        <div style={{ maxWidth:680, marginBottom:52 }}>
          <div style={{ fontSize:11, fontWeight:700, color: EH.amberDeep, letterSpacing:'0.14em', marginBottom:12 }}>HOW IT WORKS</div>
          <h2 style={{ fontSize:44, fontWeight:800, letterSpacing:'-0.025em', margin:0, lineHeight:1.06, color: EH.navy }}>
            Three small steps. A reputation as the world's most thoughtful friend.
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20 }}>
          {steps.map((s,i) => {
            const I = Icons[s.icon];
            return (
              <div key={i} style={{
                background: EH.card, borderRadius:22, padding:30,
                border:`1px solid ${EH.line}`, boxShadow: EH.shadow,
                display:'flex', flexDirection:'column', gap:18, minHeight:240,
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div style={{
                    width:50, height:50, borderRadius:14, background: EH.amberSoft,
                    color: EH.amberDeep, display:'flex', alignItems:'center', justifyContent:'center',
                  }}><I size={22}/></div>
                  <div style={{ fontSize:12, fontWeight:700, color: EH.inkSoft, letterSpacing:'0.08em' }}>{s.n}</div>
                </div>
                <h3 style={{ margin:0, fontSize:22, fontWeight:700, letterSpacing:'-0.015em', color: EH.navy }}>{s.t}</h3>
                <p style={{ margin:0, fontSize:15, lineHeight:1.55, color: EH.inkMute }}>{s.d}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Social proof */}
      <div style={{ padding:'80px 64px', borderTop:`1px solid ${EH.lineSoft}` }}>
        <div style={{
          display:'flex', alignItems:'center', gap:36, justifyContent:'center',
          marginBottom:52, opacity:0.65, flexWrap:'wrap',
        }}>
          <div style={{ fontSize:11, fontWeight:700, color: EH.inkSoft, letterSpacing:'0.12em' }}>AS SEEN IN</div>
          {['the morning brew','lifehacker','product hunt','kinfolk','apartment therapy'].map((n,i) =>
            <div key={i} style={{ fontFamily:'Plus Jakarta Sans', fontWeight:700, fontSize:17, color: EH.navySoft, letterSpacing:'-0.02em', fontVariant:'small-caps' }}>{n}</div>
          )}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20 }}>
          {testimonials.map((t,i) => (
            <div key={i} style={{
              background: i===1 ? EH.navy : EH.card,
              color: i===1 ? '#fff' : EH.navy,
              borderRadius:22, padding:30,
              border:`1px solid ${i===1 ? EH.navy : EH.line}`,
              display:'flex', flexDirection:'column', gap:20,
            }}>
              <div style={{ color: EH.amber, fontSize:16, letterSpacing:3 }}>★★★★★</div>
              <p style={{ margin:0, fontSize:17, lineHeight:1.5, letterSpacing:'-0.005em' }}>"{t.q}"</p>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:'auto' }}>
                <Avatar name={t.who} tone={i+1} size={36}/>
                <div>
                  <div style={{ fontSize:13, fontWeight:700 }}>{t.who}</div>
                  <div style={{ fontSize:12, opacity:0.6 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ padding:'96px 64px', background: EH.navy, color:'#fff' }}>
        <div style={{ textAlign:'center', maxWidth:640, margin:'0 auto 56px' }}>
          <div style={{ fontSize:11, fontWeight:700, color: EH.amber, letterSpacing:'0.14em', marginBottom:12 }}>PRICING</div>
          <h2 style={{ fontSize:46, fontWeight:800, letterSpacing:'-0.025em', margin:0, lineHeight:1.04 }}>
            One price. About what a forgettable card costs.
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, maxWidth:880, margin:'0 auto' }}>
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:22, padding:32 }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#94A3B8', letterSpacing:'0.08em', marginBottom:16 }}>FREE</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:8 }}>
              <span style={{ fontSize:58, fontWeight:800, letterSpacing:'-0.03em' }}>$0</span>
              <span style={{ color:'#94A3B8' }}>forever</span>
            </div>
            <p style={{ color:'#CBD5E1', fontSize:14, lineHeight:1.5, margin:'0 0 24px' }}>For the once-a-year reminder you actually wanted.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:12, fontSize:14 }}>
              {['Up to 3 recipients','7-day email reminders','Three AI gift picks per event','Affiliate links to buy'].map((f,i) =>
                <div key={i} style={{ display:'flex', gap:10, alignItems:'center' }}><Icons.check size={16} stroke={EH.amber}/><span style={{ color:'#E2E8F0' }}>{f}</span></div>
              )}
            </div>
            <button style={{ marginTop:28, width:'100%', background:'transparent', border:'1px solid rgba(255,255,255,0.18)', color:'#fff', padding:14, borderRadius:12, fontFamily:'inherit', fontWeight:600, fontSize:14, cursor:'pointer' }}>Get started free</button>
          </div>
          <div style={{ background:'#fff', color: EH.navy, borderRadius:22, padding:32, position:'relative', boxShadow:'0 32px 72px -16px rgba(0,0,0,0.45)' }}>
            <div style={{ position:'absolute', top:-13, right:24, background: EH.amber, color: EH.navy, padding:'6px 14px', borderRadius:999, fontSize:11, fontWeight:800, letterSpacing:'0.06em' }}>RECOMMENDED</div>
            <div style={{ fontSize:12, fontWeight:700, color: EH.amberDeep, letterSpacing:'0.08em', marginBottom:16 }}>UNLIMITED</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:8 }}>
              <span style={{ fontSize:58, fontWeight:800, letterSpacing:'-0.03em' }}>$4.99</span>
              <span style={{ color: EH.inkMute }}>/ month</span>
            </div>
            <p style={{ color: EH.inkMute, fontSize:14, lineHeight:1.5, margin:'0 0 24px' }}>For the friend, partner, parent, and sibling who has earned your effort.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:12, fontSize:14 }}>
              {['Unlimited recipients & events','Five picks per event, refresh anytime','Earlier reminders — 14 days out','Group gifts & wishlist sharing','Concierge: ask a human for help'].map((f,i) =>
                <div key={i} style={{ display:'flex', gap:10, alignItems:'center' }}><Icons.check size={16} stroke={EH.amberDeep}/><span>{f}</span></div>
              )}
            </div>
            <button style={{ marginTop:28, width:'100%', background: EH.navy, color:'#fff', border:'none', padding:14, borderRadius:12, fontFamily:'inherit', fontWeight:600, fontSize:14, cursor:'pointer' }}>Start 14-day free trial</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding:'44px 64px 32px', background: EH.bg, borderTop:`1px solid ${EH.lineSoft}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <Logo size={18}/>
        <div style={{ display:'flex', gap:28, fontSize:13, color: EH.inkMute }}>
          <span>About</span><span>Privacy</span><span>Terms</span><span>Affiliate disclosure</span><span>hello@emptyhanded.co</span>
        </div>
        <div style={{ fontSize:13, color: EH.inkSoft }}>© 2026</div>
      </div>
    </div>
  );
};

window.Landing = Landing;
