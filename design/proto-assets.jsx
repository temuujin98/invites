/* invites — Prototype: admin asset library (upload / processing / failure / delete-blocked) */

function ProtoAssets() {
  const { nav, toast } = useProto();
  const [assets, setAssets] = React.useState([
    { id: 1, name: 'altan-namar.png', type: 'PNG', size: '2.4 MB', used: 1, art: 'wedding', state: 'ready' },
    { id: 2, name: 'gerelt-udesh.mp4', type: 'MP4', size: '18.6 MB', used: 1, art: 'corporate', state: 'ready', video: true },
    { id: 3, name: 'tsetsegs.png', type: 'PNG', size: '1.9 MB', used: 2, art: 'birthday', state: 'ready' },
    { id: 4, name: 'bagachuud.png', type: 'PNG', size: '2.1 MB', used: 0, art: 'baby', state: 'ready' },
  ]);
  const [confirmDel, setConfirmDel] = React.useState(null);
  const uploadCount = React.useRef(0);
  const nextId = React.useRef(10);

  const upload = () => {
    const n = uploadCount.current++ % 3;
    const id = nextId.current++;
    if (n === 0) {
      // PNG: progress → ready
      setAssets(a => [...a, { id, name: 'tugsult.png', type: 'PNG', size: '2.8 MB', used: 0, art: 'graduation', state: 'uploading', progress: 0 }]);
      let p = 0;
      const iv = setInterval(() => {
        p += 25;
        if (p >= 100) {
          clearInterval(iv);
          setAssets(a => a.map(x => x.id === id ? { ...x, state: 'ready' } : x));
          toast('tugsult.png амжилттай орлоо', 'success');
        } else {
          setAssets(a => a.map(x => x.id === id ? { ...x, progress: p } : x));
        }
      }, 350);
    } else if (n === 1) {
      // MP4: upload → processing → ready
      setAssets(a => [...a, { id, name: 'shine-garaa.mp4', type: 'MP4', size: '24.2 MB', used: 0, art: 'opening', state: 'processing', video: true, progress: 0 }]);
      let p = 0;
      const iv = setInterval(() => {
        p += 18;
        if (p >= 100) {
          clearInterval(iv);
          setAssets(a => a.map(x => x.id === id ? { ...x, state: 'ready' } : x));
          toast('Видео боловсруулагдаж дууслаа', 'success');
        } else {
          setAssets(a => a.map(x => x.id === id ? { ...x, progress: p } : x));
        }
      }, 450);
    } else {
      // failure
      setAssets(a => [...a, { id, name: 'kharuul-tom.png', type: 'PNG', size: '64 MB', used: 0, art: 'birthday', state: 'uploading', progress: 0 }]);
      setTimeout(() => {
        setAssets(a => a.map(x => x.id === id ? { ...x, state: 'failed' } : x));
        toast('Файл оруулахад алдаа гарлаа — хэмжээ 50MB-аас их', 'danger');
      }, 900);
    }
  };

  const retry = (asset) => {
    setAssets(a => a.map(x => x.id === asset.id ? { ...x, state: 'uploading', progress: 30, size: '4.1 MB', name: asset.name.replace('-tom', '') } : x));
    setTimeout(() => {
      setAssets(a => a.map(x => x.id === asset.id ? { ...x, state: 'ready' } : x));
      toast('Дахин оруулалт амжилттай', 'success');
    }, 1100);
  };

  const del = () => {
    setAssets(a => a.filter(x => x.id !== confirmDel.id));
    setConfirmDel(null);
    toast('Файл устгагдлаа', 'success');
  };

  return (
    <div style={{ fontFamily: 'var(--font-family)', backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* slim admin topbar */}
      <div style={{ height: 52, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--color-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 7, backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>i</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>invites</span>
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-primary)', backgroundColor: '#CBB8F7', padding: '2px 6px', borderRadius: 4 }}>ADMIN</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginLeft: 12 }}>Файлын сан</span>
        </div>
        <span onClick={() => nav('editor')} style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>Загвар editor →</span>
      </div>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '32px 40px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.015em' }}>Файлын сан</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>Canva-аас экспортолсон фон файлууд — дарааллаар нь оруулбал гурван өөр төлөв (амжилт, видео боловсруулалт, алдаа) харагдана</div>
          </div>
          <span onClick={upload}><DSButton variant="accent" icon={<PlusIcon/>}>Файл оруулах</DSButton></span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <div onClick={upload} style={{
            borderRadius: 'var(--radius-md)', border: '1.5px dashed var(--color-border)',
            minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 8, cursor: 'pointer', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface)',
            transition: 'border-color 200ms ease-out',
          }}>
            <div style={{ color: 'var(--color-accent)' }}><AIc d={adminIcons.upload} size={20} /></div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)' }}>Файл чирж оруулах</div>
            <div style={{ fontSize: 10 }}>PNG, JPG, MP4 · 50MB хүртэл</div>
          </div>
          {assets.map(a => (
            <div key={a.id} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--color-surface)', border: a.state === 'failed' ? '1px solid var(--color-danger)' : '1px solid var(--color-border-muted)', animation: 'protoStepIn 240ms ease-out' }}>
              <div style={{ position: 'relative', height: 118 }}>
                <TplArt kind={a.art} scale={0.6} />
                {a.state !== 'ready' && (
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(253,252,250,0.88)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0 16px' }}>
                    {a.state === 'failed' ? (
                      <React.Fragment>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
                        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-danger)' }}>Оруулж чадсангүй</span>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-accent)', animation: `dsLoadPulse 1.2s ease-in-out ${i*0.15}s infinite` }}></div>)}
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                          {a.state === 'processing' ? 'Видео боловсруулж байна...' : 'Оруулж байна...'} {a.progress || 0}%
                        </span>
                        <div style={{ width: '100%', height: 3, borderRadius: 2, backgroundColor: 'var(--color-border-muted)' }}>
                          <div style={{ width: `${a.progress || 0}%`, height: '100%', borderRadius: 2, backgroundColor: 'var(--color-accent)', transition: 'width 300ms ease-out' }}></div>
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                )}
                {a.video && a.state === 'ready' && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 30, height: 30, borderRadius: '50%', backgroundColor: 'rgba(31,29,26,0.6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor"><path d="M3.5 2.5l6 3.5-6 3.5v-7z"/></svg>
                  </div>
                )}
                <span style={{ position: 'absolute', top: 6, left: 6, padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 600, backgroundColor: 'rgba(31,29,26,0.65)', color: '#fff' }}>{a.type}</span>
              </div>
              <div style={{ padding: '9px 11px' }}>
                <div style={{ fontSize: 11, fontWeight: 500, fontFamily: 'monospace', marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {a.state === 'failed' ? (
                    <span onClick={() => retry(a)} style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-accent)', cursor: 'pointer' }}>Дахин оролдох</span>
                  ) : (
                    <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{a.size} · {a.used > 0 ? `${a.used} загварт` : 'ашиглагдаагүй'}</span>
                  )}
                  {a.state === 'ready' && (a.used > 0 ? (
                    <span onClick={() => toast('Загварт ашиглагдаж байгаа тул устгах боломжгүй', 'warning')} title="Устгах хамгаалалттай" style={{ color: 'var(--color-text-muted)', display: 'inline-flex', cursor: 'pointer' }}>
                      <AIc d={adminIcons.lock} size={12} />
                    </span>
                  ) : (
                    <span onClick={() => setConfirmDel(a)}><ARowAction icon={adminIcons.trash} danger title="Устгах" /></span>
                  ))}
                  {a.state === 'failed' && (
                    <span onClick={() => setAssets(list => list.filter(x => x.id !== a.id))} style={{ fontSize: 11, color: 'var(--color-text-muted)', cursor: 'pointer' }}>Хасах</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ProtoModal open={!!confirmDel} title="Файл устгах уу?" desc={confirmDel ? `«${confirmDel.name}» бүрмөсөн устана. Ямар ч загварт ашиглагдаагүй байна.` : ''} confirmLabel="Устгах" danger onConfirm={del} onCancel={() => setConfirmDel(null)} />
    </div>
  );
}

Object.assign(window, { ProtoAssets });
