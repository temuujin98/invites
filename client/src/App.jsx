import { ArrowDown, ArrowUpRight } from 'lucide-react'
import PublicInvitation from './PublicInvitation'
import CreatorApp from '../../app/src/CreatorApp.jsx'

const studioUrl = '/studio'

const marqueeRow1 = ['ХУРИМ', 'ТӨРСӨН ӨДӨР', 'ЁСЛОЛ', 'ХҮЛЭЭН АВАЛТ', 'ТӨГСӨЛТ', 'ОЙН БАЯР']
const marqueeRow2 = ['НЭГ ХОЛБООС', 'RSVP БОДИТ ЦАГТ', 'ГАР УТСАНД ТӨГС', 'ҮНЭГҮЙ ЭХЛЭХ']

const services = [
  { num: '01', title: 'УРИЛГА ҮҮСГЭХ', tags: ['20+ загвар', '3 минут', 'Кирилл типографи'] },
  { num: '02', title: 'ХОЛБООС ХУВААЛЦАХ', tags: ['Мессенжер', 'Имэйл', 'QR код'] },
  { num: '03', title: 'RSVP ХЯНАХ', tags: ['Бодит цагт', 'Зочдын тоо', 'Нэг самбар'] },
  { num: '04', title: 'ШУУД ЗАСВАР', tags: ['Холбоос хэвээр', 'Авто шинэчлэл', 'Хязгааргүй'] },
]

function ScrollIndicator() {
  return (
    <div className="spin-badge" aria-hidden="true">
      <svg viewBox="0 0 144 144" className="spin-text">
        <defs>
          <path id="spin-circle" d="M 72,72 m -52,0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0" />
        </defs>
        <text>
          <textPath href="#spin-circle">SCROLL DOWN • SCROLL DOWN • SCROLL DOWN • </textPath>
        </text>
      </svg>
      <ArrowDown size={22} strokeWidth={2.5} />
    </div>
  )
}

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

export default function App() {
  if (window.location.pathname.startsWith('/studio')) return <CreatorApp />
  if (window.location.pathname.startsWith('/i/')) return <PublicInvitation />
  return (
    <main className="kpage">

      <nav className="knav" aria-label="Үндсэн хэсэг">
        <a className="knav-brand" href="#top"><img src="/brand/invites.mn/logo-wordmark-light.png" alt="INVITES.MN" /></a>
        <div className="knav-pill">
          <a href="#services">БОЛОМЖ</a>
          <a href="#cta">ЭХЛЭХ</a>
          <a href={studioUrl}>НЭВТРЭХ</a>
        </div>
        <div className="knav-social">
          <a href="https://instagram.com" aria-label="Instagram">IG</a>
          <a href="https://facebook.com" aria-label="Facebook">FB</a>
          <a href="mailto:hello@invites.mn" aria-label="Имэйл">@</a>
        </div>
      </nav>

      <header id="top" className="khero">
        <h1>УРИЛГА</h1>
        <div className="khero-meta">
          <p className="kmeta-left">УЛААНБААТАР,<br />МОНГОЛ УЛС</p>
          <ScrollIndicator />
          <p className="kmeta-right">DIGITAL УРИЛГЫН ПЛАТФОРМ<br />ЗАГВАР · ХОЛБООС · RSVP</p>
        </div>
      </header>

      <section className="kskew" aria-hidden="true">
        <MarqueeRow items={marqueeRow1} className="krow-1" />
        <MarqueeRow items={marqueeRow2} reverse className="krow-2" />
      </section>

      <section id="services" className="kservices">
        <p className="ksection-label">// БОЛОМЖУУД</p>
        {services.map((service) => (
          <a className="kservice" href={studioUrl} key={service.num}>
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

      <section id="cta" className="kcta">
        <h2>ОДОО<br />ЭХЭЛЦГЭЭЕ</h2>
        <a className="kcta-button" href={studioUrl}>УРИЛГА ҮҮСГЭХ</a>
        <p className="kcta-note">Бүртгэл үнэгүй · 3 минутад бэлэн</p>
      </section>

      <footer className="kfooter">
        <p>© 2026 INVITES.MN — БҮХ ЭРХ ХУУЛИАР ХАМГААЛАГДСАН</p>
        <div className="kfooter-links">
          <a href="https://instagram.com">INSTAGRAM</a>
          <a href="https://facebook.com">FACEBOOK</a>
          <a href="mailto:hello@invites.mn">HELLO@INVITES.MN</a>
        </div>
      </footer>

    </main>
  )
}
