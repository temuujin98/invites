import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowRight, Bell, CalendarDays, ChevronDown, CircleHelp, Grid2X2, Heart, Home, Image, LayoutTemplate, LogOut, MoreHorizontal, Plus, Settings, Users } from 'lucide-react'
import './styles.css'

const invitations = [
  { title: 'Тэмүүлэн × Номин', type: 'Хурим', date: '2026.09.18', status: 'Ноорог', color: 'lavender' },
  { title: 'Lunar 27', type: 'Төрсөн өдөр', date: '2026.08.21', status: 'Ноорог', color: 'coral' },
]

function InvitationPreview({ invitation }) {
  return <div className={`invite-preview ${invitation.color}`} aria-hidden="true"><span>{invitation.type}</span><div><strong>{invitation.title}</strong><small>{invitation.date}</small></div><i>i</i></div>
}


function TemplateGallery({ onClose }) {
  const [selected, setSelected] = useState('Luxe violet')
  const templates = [
    { name: 'Luxe violet', type: 'Хурим', style: 'lavender' },
    { name: 'Sunset club', type: 'Төрсөн өдөр', style: 'coral' },
    { name: 'Green room', type: 'Ёслол', style: 'sage' },
    { name: 'Mono', type: 'Байгууллага', style: 'mono' },
  ]
  return <section className="template-overlay"><div className="template-head"><div><p className="eyebrow">01 / ЗАГВАР СОНГОХ</p><h1>Таны мөчид<br />таарах өнгө аяс.</h1><p>Дараа нь бүх текст, зураг болон хэсгийг өөрийнхөөрөө засна.</p></div><button className="text-button" onClick={onClose}>Буцах <ArrowRight size={15} /></button></div><div className="template-grid">{templates.map((template) => <button key={template.name} className={selected === template.name ? 'template-card selected' : 'template-card'} onClick={() => setSelected(template.name)}><InvitationPreview invitation={{ title: template.name === 'Luxe violet' ? 'Тэмүүлэн × Номин' : template.name, type: template.type, date: 'ТАНЫ АРГА ХЭМЖЭЭ', color: template.style }} /><span>{template.type}</span><b>{template.name}</b></button>)}</div><div className="template-footer"><span>Сонгосон загвар: <b>{selected}</b></span><button className="create-button">Энэ загвараар эхлэх <ArrowRight size={17} /></button></div></section>
}
function App() {
  const [activeTab, setActiveTab] = useState('Миний урилга')
  const [menuOpen, setMenuOpen] = useState(false)
  return <div className="studio-shell">
    <aside className="sidebar">
      <a className="studio-brand" href="http://localhost:5173"><img src="http://localhost:5173/brand/invites.mn/Logo (3).png" alt="INVITES.MN" /></a><p className="studio-kicker">CREATOR STUDIO</p>
      <nav aria-label="Studio navigation">{[[Grid2X2, 'Миний урилга'], [LayoutTemplate, 'Загварууд'], [Users, 'Зочид']].map(([Icon, label]) => <button key={label} className={activeTab === label ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab(label)}><Icon size={18} />{label}</button>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item" onClick={() => setMenuOpen(!menuOpen)}><Settings size={18} />Тохиргоо</button><a className="help-link" href="mailto:hello@invites.mn"><CircleHelp size={17} />Тусламж хэрэгтэй юу?</a><button className="profile" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}><span className="avatar">A</span><span><b>Ариунболд</b><small>Free plan</small></span><ChevronDown size={16} /></button>{menuOpen && <div className="profile-menu"><button><LogOut size={15} />Гарах</button></div>}</div>
    </aside>
    <main className="studio-main">{activeTab === 'Загварууд' && <TemplateGallery onClose={() => setActiveTab('Миний урилга')} />}
      <header className="topbar"><div className="crumb"><Home size={15} /><span>/</span><b>{activeTab}</b></div><div className="top-actions"><button className="icon-button" aria-label="Мэдэгдэл"><Bell size={18} /></button><a className="view-site" href="http://localhost:5173">Сайт харах <ArrowRight size={16} /></a></div></header>
      <section className="dashboard-head"><div><p className="eyebrow">ТАНЫ ОРОН ЗАЙ</p><h1>Сайн байна уу, Ариунболд.</h1><p className="lead">Таны дараагийн дурсамжтай мөч эндээс эхэлнэ.</p></div><button className="create-button" onClick={() => setActiveTab('Загварууд')}><Plus size={18} />Шинэ урилга</button></section>
      <section className="metric-grid" aria-label="Урилгын тойм"><div className="metric"><span className="metric-icon purple"><LayoutTemplate size={18} /></span><p>Нийт урилга</p><b>2</b><small>Эхлүүлсэн бүтээлүүд</small></div><div className="metric"><span className="metric-icon orange"><CalendarDays size={18} /></span><p>Дараагийн арга хэмжээ</p><b>18</b><small>2026 оны 9 сар</small></div><div className="metric"><span className="metric-icon pink"><Heart size={18} /></span><p>Ирсэн RSVP</p><b>—</b><small>Урилга идэвхжсэний дараа</small></div></section>
      <section className="invitation-section"><div className="section-title"><div><h2>Таны урилга</h2><p>Үргэлжлүүлэн засах эсвэл шинэ загвар сонгоорой.</p></div><button className="text-button">Бүгдийг харах <ArrowRight size={15} /></button></div><div className="invitation-grid">{invitations.map((invitation) => <article className="invitation-card" key={invitation.title}><InvitationPreview invitation={invitation} /><div className="invitation-info"><div><span className="draft-dot" />{invitation.status}</div><button aria-label={`${invitation.title} цэс`}><MoreHorizontal size={20} /></button></div><h3>{invitation.title}</h3><p>{invitation.type} · {invitation.date}</p><button className="continue-button">Үргэлжлүүлэх <ArrowRight size={16} /></button></article>)}<button className="new-card"><span><Plus size={23} /></span><b>Шинэ урилга үүсгэх</b><small>Загвараа сонгоод эхлээрэй</small></button></div></section>
      <section className="start-banner"><div className="banner-art"><Image size={26} /><span>✦</span></div><div><p className="eyebrow">САНАЛ БОЛГОХ</p><h2>Бэлэн загвараар хурдан эхлээрэй.</h2><p>Таны арга хэмжээнд тохирох урилгыг хэдхэн алхмаар бүтээнэ.</p></div><button className="light-button" onClick={() => setActiveTab('Загварууд')}>Загварууд үзэх <ArrowRight size={16} /></button></section>
    </main>
  </div>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)