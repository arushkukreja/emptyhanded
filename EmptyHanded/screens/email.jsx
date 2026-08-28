// Email reminder template
const EmailTemplate = () => {
  const picks = [
    { name: 'Linen-bound journal, dusk blue', price: '$48', why: 'She carries one everywhere', icon: 'book', img: 2 },
    { name: 'Handthrown ceramic pour-over, oat', price: '$62', why: 'For her slow mornings', icon: 'utensils', img: 0 },
    { name: 'Vinyl: Sunday at the Village Vanguard', price: '$34', why: 'Jazz piano lover', icon: 'palette', img: 4 },
  ];
  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', background: '#EEEAE3', minHeight:'100%', padding: '32px 24px' }}>
      {/* Mail client chrome */}
      <div style={{
        maxWidth: 520, margin: '0 auto 14px', display:'flex', gap: 12,
        alignItems:'center', fontSize: 12, color: '#6B6358',
      }}>
        <Icons.mail size={14} stroke="#6B6358"/>
        <span>Inbox · 12:04 PM</span>
        <span style={{ marginLeft:'auto' }}>From: hello@emptyhanded.co</span>
      </div>

      <div style={{
        maxWidth: 520, margin: '0 auto', background: '#fff', borderRadius: 18,
        overflow:'hidden', boxShadow: '0 12px 32px -8px rgba(15,23,42,0.18)',
        border: `1px solid ${EH.line}`,
      }}>
        {/* Subject line preview */}
        <div style={{ padding:'16px 28px 12px', borderBottom: `1px solid ${EH.lineSoft}` }}>
          <div style={{ fontSize: 12, color: EH.inkSoft, fontWeight: 600, marginBottom: 4 }}>SUBJECT</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: EH.navy, letterSpacing:'-0.005em' }}>
            Maya’s birthday is in 7 days 🎁
          </div>
        </div>

        {/* Logo bar */}
        <div style={{ background: EH.navy, padding: '18px 28px', textAlign:'center' }}>
          <Logo color="#fff" size={18}/>
        </div>

        {/* Body */}
        <div style={{ padding: '36px 28px 28px' }}>
          <div style={{
            display:'inline-flex', gap: 8, alignItems:'center',
            padding:'6px 12px', borderRadius: 999, background: EH.amberSoft,
            color: EH.amberDeep, fontSize: 11, fontWeight: 700, letterSpacing:'0.06em',
            marginBottom: 20,
          }}>
            <Icons.calendar size={12} stroke={EH.amberDeep}/>
            7 DAYS UNTIL MAYA’S BIRTHDAY
          </div>
          <h1 style={{
            fontSize: 28, fontWeight: 800, letterSpacing:'-0.025em',
            margin:'0 0 12px', color: EH.navy, lineHeight: 1.1, textWrap: 'balance',
          }}>
            Hey Alex — don’t show up empty handed.
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: EH.inkMute, margin: '0 0 28px' }}>
            Maya turns 32 next Tuesday. Based on what you told us — a homebody, a reader, a slow-mornings sort of person — here are three picks we think she’ll actually use.
          </p>

          {/* Picks */}
          <div style={{ display:'flex', flexDirection:'column', gap: 14, marginBottom: 28 }}>
            {picks.map((p, i) => (
              <div key={i} style={{
                display:'flex', gap: 14, padding: 14, background: EH.bg,
                borderRadius: 14, border: `1px solid ${EH.lineSoft}`,
                alignItems:'center',
              }}>
                <div style={{ width: 76, flexShrink: 0 }}>
                  <ProductPlaceholder height={76} radius={10} icon={p.icon} tone={p.img}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: EH.amberDeep, letterSpacing:'0.06em', marginBottom: 3 }}>PICK {String(i+1).padStart(2,'0')}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: EH.navy, lineHeight: 1.3 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: EH.inkMute, fontStyle:'italic', marginTop: 2 }}>{p.why} · {p.price}</div>
                </div>
                <button style={{
                  background: EH.navy, color:'#fff', border:'none',
                  padding:'10px 14px', borderRadius: 8, fontFamily:'inherit',
                  fontWeight: 600, fontSize: 12, cursor:'pointer', whiteSpace:'nowrap',
                }}>Buy →</button>
              </div>
            ))}
          </div>

          {/* Secondary CTA */}
          <div style={{ textAlign:'center', padding: '16px 0 8px' }}>
            <a style={{
              color: EH.amberDeep, fontSize: 13, fontWeight: 600,
              borderBottom: `1px solid ${EH.amber}`, paddingBottom: 1, cursor:'pointer',
            }}>See 4 more picks or swap one out →</a>
          </div>

          <div style={{
            borderTop: `1px dashed ${EH.line}`, marginTop: 28, paddingTop: 20,
            fontSize: 12, color: EH.inkSoft, lineHeight: 1.55, textAlign:'center',
          }}>
            Already got something? <span style={{ color: EH.navy, fontWeight: 600, cursor:'pointer' }}>Mark Maya as covered.</span><br/>
            Reminder showing up too late? <span style={{ color: EH.navy, fontWeight: 600, cursor:'pointer' }}>Get them earlier.</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '24px 28px 28px', background: EH.bgAlt, textAlign:'center' }}>
          <Logo size={14}/>
          <div style={{ fontSize: 11, color: EH.inkSoft, marginTop: 14, lineHeight: 1.6 }}>
            You’re receiving this because you added Maya to your EmptyHanded calendar.<br/>
            Links may earn us a small commission — it doesn’t change the price you pay.
          </div>
          <div style={{ fontSize: 11, color: EH.inkSoft, marginTop: 12, display:'flex', justifyContent:'center', gap: 14 }}>
            <span>Manage reminders</span><span>·</span><span>Unsubscribe</span>
          </div>
        </div>
      </div>
    </div>
  );
};

window.EmailTemplate = EmailTemplate;
