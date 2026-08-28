// Add Event / Recipient Profile Flow — interactive multi-step form
const AddEvent = () => {
  const [step, setStep] = React.useState(1);
  const [occasion, setOccasion] = React.useState('birthday');
  const [name, setName] = React.useState('Maya Patel');
  const [date, setDate] = React.useState('2026-10-23');
  const [relationship, setRelationship] = React.useState('sister-in-law');
  const [ageRange, setAgeRange] = React.useState('30s');
  const [archs, setArchs] = React.useState(['homebody', 'reader', 'creative']);
  const [interests, setInterests] = React.useState('Ceramics, jazz piano, slow mornings. Always reading two books at once.');
  const [budget, setBudget] = React.useState('thoughtful');

  const toggleArch = (id) => {
    setArchs(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', background: EH.bg, color: EH.ink, minHeight:'100%' }}>
      {/* Slim header */}
      <div style={{
        padding: '20px 48px', borderBottom: `1px solid ${EH.lineSoft}`,
        display:'flex', justifyContent:'space-between', alignItems:'center', background: EH.card,
      }}>
        <Logo />
        <div style={{ display:'flex', alignItems:'center', gap: 12, fontSize: 13, color: EH.inkMute, cursor:'pointer' }}>
          Save & exit <Icons.arrow size={14}/>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 32px 80px' }}>
        {/* Progress */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: EH.inkSoft, letterSpacing:'0.1em' }}>STEP {step} OF 2</div>
            <div style={{ fontSize: 12, color: EH.inkMute }}>Takes about 90 seconds</div>
          </div>
          <div style={{ display:'flex', gap: 8 }}>
            {[1,2].map(i => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: i <= step ? EH.amber : EH.line,
                transition: 'background .3s',
              }}/>
            ))}
          </div>
          <div style={{ display:'flex', gap: 48, marginTop: 14 }}>
            <ProgLabel n="1" t="The occasion" active={step>=1} done={step>1}/>
            <ProgLabel n="2" t="Their personality" active={step>=2}/>
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: EH.card, borderRadius: 24, padding: 40,
          border: `1px solid ${EH.line}`, boxShadow: EH.shadow,
        }}>
          {step === 1 && (
            <>
              <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing:'-0.025em', margin:'0 0 8px', color: EH.navy }}>
                What’s the occasion?
              </h1>
              <p style={{ fontSize: 15, color: EH.inkMute, margin:'0 0 32px', lineHeight: 1.5 }}>
                We’ll send a gentle reminder 7 days before, so you have time to choose well.
              </p>

              {/* Occasion grid */}
              <Label>Occasion type</Label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 10, marginBottom: 32 }}>
                {occasions.map(o => {
                  const I = Icons[o.icon];
                  const sel = occasion === o.id;
                  return (
                    <button key={o.id} onClick={() => setOccasion(o.id)} style={{
                      background: sel ? EH.navy : EH.bg,
                      color: sel ? '#fff' : EH.navy,
                      border: `1px solid ${sel ? EH.navy : EH.line}`,
                      borderRadius: 14, padding: '16px 12px',
                      fontFamily:'inherit', fontWeight: 600, fontSize: 13,
                      cursor:'pointer', display:'flex', flexDirection:'column',
                      gap: 10, alignItems:'center', transition:'all .15s',
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: sel ? 'rgba(245,158,11,0.2)' : EH.card,
                        color: sel ? EH.amber : EH.navy,
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}>
                        <I size={20}/>
                      </div>
                      <span>{o.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Name + date */}
              <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap: 16 }}>
                <div>
                  <Label>Who’s it for?</Label>
                  <Field>
                    <input value={name} onChange={e => setName(e.target.value)}
                      placeholder="First and last name"
                      style={inputStyle}/>
                  </Field>
                </div>
                <div>
                  <Label>When?</Label>
                  <Field>
                    <Icons.calendar size={18} stroke={EH.inkSoft} style={{ marginLeft: 4 }}/>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)}
                      style={inputStyle}/>
                  </Field>
                </div>
              </div>

              {/* Recurring */}
              <div style={{ marginTop: 18, display:'flex', gap: 10, alignItems:'center', fontSize: 13, color: EH.inkMute }}>
                <div style={{
                  width: 36, height: 20, borderRadius: 999, background: EH.amber,
                  position:'relative', cursor:'pointer',
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 999, background: '#fff',
                    position:'absolute', top: 2, right: 2,
                  }}/>
                </div>
                Repeat this every year
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing:'-0.025em', margin:'0 0 8px', color: EH.navy }}>
                Tell us about {name.split(' ')[0]}.
              </h1>
              <p style={{ fontSize: 15, color: EH.inkMute, margin:'0 0 32px', lineHeight: 1.5 }}>
                Be specific. “Likes coffee” gets generic. “Makes pour-over every morning, loves Ethiopian beans” gets the good stuff.
              </p>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16, marginBottom: 28 }}>
                <div>
                  <Label>Relationship</Label>
                  <Field>
                    <select value={relationship} onChange={e => setRelationship(e.target.value)} style={inputStyle}>
                      {['sister-in-law','partner','parent','sibling','best friend','friend','colleague','child','grandparent'].map(r =>
                        <option key={r}>{r}</option>)}
                    </select>
                  </Field>
                </div>
                <div>
                  <Label>Age range</Label>
                  <div style={{ display:'flex', gap: 6, flexWrap:'wrap' }}>
                    {['<18','20s','30s','40s','50s','60+'].map(a => (
                      <button key={a} onClick={() => setAgeRange(a)} style={{
                        padding:'10px 14px', borderRadius: 10,
                        border: `1px solid ${ageRange === a ? EH.navy : EH.line}`,
                        background: ageRange === a ? EH.navy : EH.card,
                        color: ageRange === a ? '#fff' : EH.navy,
                        fontFamily:'inherit', fontSize: 13, fontWeight: 600, cursor:'pointer',
                      }}>{a}</button>
                    ))}
                  </div>
                </div>
              </div>

              <Label>Personality <span style={{ color: EH.inkSoft, fontWeight: 500, marginLeft: 4 }}>pick a few — {archs.length} selected</span></Label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap: 8, marginBottom: 28 }}>
                {archetypes.map(a => {
                  const I = Icons[a.icon];
                  const sel = archs.includes(a.id);
                  return (
                    <button key={a.id} onClick={() => toggleArch(a.id)} style={{
                      background: sel ? EH.amberSoft : EH.card,
                      color: sel ? EH.amberDeep : EH.inkMute,
                      border: `1px solid ${sel ? EH.amber : EH.line}`,
                      borderRadius: 12, padding: '14px 8px', fontFamily:'inherit',
                      fontWeight: 600, fontSize: 12, cursor:'pointer',
                      display:'flex', flexDirection:'column', alignItems:'center', gap: 6,
                      transition:'all .15s',
                    }}>
                      <I size={20}/>
                      <span>{a.label}</span>
                    </button>
                  );
                })}
              </div>

              <Label>Interests, hobbies, things they love</Label>
              <Field rows>
                <textarea value={interests} onChange={e => setInterests(e.target.value)}
                  rows={3}
                  placeholder="The more specific, the better the picks..."
                  style={{ ...inputStyle, resize:'none', padding: '12px 14px', lineHeight: 1.5 }}/>
              </Field>

              <Label style={{ marginTop: 20 }}>Budget</Label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 8 }}>
                {[
                  { id:'token', label:'Token', sub:'Under $25' },
                  { id:'thoughtful', label:'Thoughtful', sub:'$25–$75' },
                  { id:'generous', label:'Generous', sub:'$75–$200' },
                  { id:'extravagant', label:'Extravagant', sub:'$200+' },
                ].map(b => {
                  const sel = budget === b.id;
                  return (
                    <button key={b.id} onClick={() => setBudget(b.id)} style={{
                      padding:'14px 12px', borderRadius: 12,
                      border: `1px solid ${sel ? EH.navy : EH.line}`,
                      background: sel ? EH.navy : EH.card,
                      color: sel ? '#fff' : EH.navy,
                      fontFamily:'inherit', cursor:'pointer', textAlign:'left',
                    }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{b.label}</div>
                      <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{b.sub}</div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Nav */}
        <div style={{
          marginTop: 24, display:'flex', justifyContent:'space-between', alignItems:'center',
        }}>
          {step > 1 ? (
            <button onClick={() => setStep(s => s-1)} style={{
              background:'transparent', border:'none', color: EH.inkMute,
              fontFamily:'inherit', fontWeight: 600, fontSize: 14, cursor:'pointer',
              display:'inline-flex', gap: 6, alignItems:'center',
            }}><Icons.chevL size={16}/> Back</button>
          ) : <div/>}
          <button onClick={() => setStep(s => Math.min(2, s+1))} style={{
            background: EH.navy, color: '#fff', border:'none',
            padding:'14px 24px', borderRadius: 999, fontFamily:'inherit',
            fontWeight: 600, fontSize: 14, cursor:'pointer',
            display:'inline-flex', gap: 8, alignItems:'center',
          }}>
            {step === 1 ? 'Continue' : 'Generate gift ideas'}
            {step === 1 ? <Icons.arrow size={16}/> : <Icons.sparkle size={16}/>}
          </button>
        </div>
      </div>
    </div>
  );
};

const Label = ({ children, style }) => (
  <div style={{ fontSize: 12, fontWeight: 700, color: EH.navy, letterSpacing:'0.04em', marginBottom: 10, ...style }}>
    {children}
  </div>
);

const Field = ({ children, rows }) => (
  <div style={{
    background: EH.bg, border: `1px solid ${EH.line}`, borderRadius: 12,
    padding: rows ? 0 : '4px 12px', display:'flex', alignItems:'center', gap: 8,
  }}>{children}</div>
);

const inputStyle = {
  flex: 1, border: 'none', outline: 'none', background:'transparent',
  fontFamily:'inherit', fontSize: 14, color: EH.navy, padding: '12px 4px', width:'100%',
};

const ProgLabel = ({ n, t, active, done }) => (
  <div style={{ display:'flex', gap: 10, alignItems:'center', flex: 1 }}>
    <div style={{
      width: 22, height: 22, borderRadius: 999,
      background: done ? EH.amber : (active ? EH.navy : EH.line),
      color: done ? EH.navy : (active ? '#fff' : EH.inkSoft),
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize: 11, fontWeight: 700,
    }}>{done ? <Icons.check size={12} sw={2.5}/> : n}</div>
    <div style={{ fontSize: 13, fontWeight: 600, color: active ? EH.navy : EH.inkSoft }}>{t}</div>
  </div>
);

window.AddEvent = AddEvent;
