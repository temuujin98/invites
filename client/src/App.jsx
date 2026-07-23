import { ArrowDown } from 'lucide-react'
import PublicInvitation from './PublicInvitation'
import AdminApp from '../../app/src/AdminApp.jsx'
import CreateGallery from './pages/CreateGallery'
import CreateEditor from './pages/CreateEditor'
import ConfirmPage from './pages/ConfirmPage'
import PayPage from './pages/PayPage'
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

/* Landing: header with one CTA + fullscreen typographic hero. Nothing else. */
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
          <a href="/create" aria-label="Урилга үүсгэх"><ScrollIndicator /></a>
          <p className="kmeta-right">3 МИНУТАД БЭЛЭН<br />ЗАГВАР · ХОЛБООС · RSVP</p>
        </div>
      </header>
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
  if (path.startsWith('/my')) return <MyPage />
  return <Landing />
}
