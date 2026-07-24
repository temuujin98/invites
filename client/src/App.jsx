import { ArrowDown, ArrowUpRight } from 'lucide-react'
import PublicInvitation from './PublicInvitation'
import AdminApp from '../../app/src/AdminApp.jsx'
import CreateGallery from './pages/CreateGallery'
import CreateEditor from './pages/CreateEditor'
import ConfirmPage from './pages/ConfirmPage'
import PayPage from './pages/PayPage'
import EditPage from './pages/EditPage'
import MyPage from './pages/MyPage'

function ScrollIndicator() {
  return (
    <div className="spin-badge" aria-hidden="true">
      <svg viewBox="0 0 144 144" className="spin-text">
        <defs>
          <path id="spin-circle" d="M 72,72 m -52,0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0" />
        </defs>
        <text>
          <textPath href="#spin-circle">УРИЛГА ҮҮСГЭ • УРИЛГА ҮҮСГЭ • УРИЛГА ҮҮСГЭ • </textPath>
        </text>
      </svg>
      <ArrowDown size={22} strokeWidth={2.5} />
    </div>
  )
}

const marqueeRow1 = ['ХУРИМ', 'ТӨРСӨН ӨДӨР', 'ЁСЛОЛ', 'ХҮЛЭЭН АВАЛТ', 'ТӨГСӨЛТ', 'ОЙН БАЯР']
const marqueeRow2 = ['НЭГ ХОЛБООС', 'RSVP БОДИТ ЦАГТ', 'ГАР УТСАНД ТӨГС', '3 МИНУТАД БЭЛЭН']

const services = [
  { num: '01', title: 'ЗАГВАРАА СОНГО', tags: ['6 загвар', 'Загвар бүр өөрийн үнэтэй', 'Кирилл типографи'] },
  { num: '02', title: 'МЭДЭЭЛЛЭЭ ОРУУЛ', tags: ['Нэр · Огноо · Байршил', 'Шууд харагдац'] },
  { num: '03', title: 'ИМЭЙЛЭЭР БАТАЛГААЖУУЛ', tags: ['Gmail', 'Бүртгэл автоматаар үүснэ'] },
  { num: '04', title: 'ТӨЛӨӨД ХУВААЛЦ', tags: ['Нэг холбоос', 'RSVP бодит цагт'] },
]

function MarqueeRow({ items, reverse, className }) {
  const content = [...items, ...items, ...items]
  return (
    <div className={`kmarquee ${className || ''}`}>
      <div className={`kmarquee-track ${reverse ? 'reverse' : ''}`}>
        {content.map((item, index) => <span key={index}>{item}<em>✦</em></span>)}
      </div>
    </div>
  )
}

/* Landing: header CTA + hero, then how-it-works sections all leading to /create */
function Landing() {
  return (
    <main className="kpage">
      <nav className="knav" aria-label="Үндсэн хэсэг">
        <a className="knav-brand" href="/"><img src="/brand/invites.mn/logo-wordmark-light.png" alt="INVITES.MN" /></a>
        <a className="kbutton kbutton-small" href="/create">Урилга үүсгэх</a>
      </nav>
      <header className="khero">
        <h1>УРИЛГА</h1>
        <div className="khero-meta">
          <p className="kmeta-left">DIGITAL УРИЛГЫН<br />ПЛАТФОРМ</p>
          <a href="#services" aria-label="Доош гүйлгэх"><ScrollIndicator /></a>
          <p className="kmeta-right">3 МИНУТАД БЭЛЭН<br />ЗАГВАР · ХОЛБООС · RSVP</p>
        </div>
      </header>

      <section className="kskew" aria-hidden="true">
        <MarqueeRow items={marqueeRow1} className="krow-1" />
        <MarqueeRow items={marqueeRow2} reverse className="krow-2" />
      </section>

      <section id="services" className="kservices">
        <p className="ksection-label">// ХЭРХЭН АЖИЛЛАДАГ ВЭ</p>
        {services.map((service) => (
          <a className="kservice" href="/create" key={service.num}>
            <span className="kservice-num">{service.num}</span>
            <div className="kservice-body">
              <h2>{service.title}</h2>
              <div className="kservice-tags">
                {service.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
            <ArrowUpRight className="kservice-arrow" size={54} strokeWidth={2.5} />
          </a>
        ))}
      </section>

      <section className="kcta">
        <h2>ОДОО<br />ЭХЭЛЦГЭЭЕ</h2>
        <a className="kcta-button" href="/create">УРИЛГА ҮҮСГЭХ</a>
        <p className="kcta-note">Загвараа сонгоод 3 минутад бэлэн</p>
      </section>

      <footer className="kfooter">
        <p>© 2026 INVITES.MN — БҮХ ЭРХ ХУУЛИАР ХАМГААЛАГДСАН</p>
        <div className="kfooter-links">
          <a href="/my">МИНИЙ УРИЛГУУД</a>
          <a href="mailto:hello@invites.mn">HELLO@INVITES.MN</a>
        </div>
      </footer>
    </main>
  )
}

export default function App() {
  const path = window.location.pathname
  if (path.startsWith('/i/')) return <PublicInvitation />
  if (path.startsWith('/admin')) return <AdminApp />
  if (path.startsWith('/create/confirm')) return <ConfirmPage />
  if (path.startsWith('/create/')) return <CreateEditor templateId={path.split('/')[2]} />
  if (path === '/create') return <CreateGallery />
  if (path.startsWith('/pay/')) return <PayPage invitationId={path.split('/')[2]} />
  if (path.startsWith('/edit/')) return <EditPage invitationId={path.split('/')[2]} />
  if (path.startsWith('/my')) return <MyPage />
  return <Landing />
}
