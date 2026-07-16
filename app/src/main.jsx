import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowUpRight, Plus, ShieldCheck } from 'lucide-react'
import './styles.css'

function App() {
  return <main>
    <header><a href="http://localhost:5173"><i>i</i> INVITES.MN</a><span>STUDIO / BETA</span></header>
    <section className="welcome"><p><ShieldCheck size={15}/> Secure creation workspace</p><h1>Таны дараагийн<br/><em>урилга.</em></h1><a className="primary" href="#create"><Plus size={18}/> Урилга үүсгэх</a></section>
    <section id="create" className="panel"><div><p className="label">01 / NEW INVITATION</p><h2>Эхлэхэд бэлэн</h2><p className="muted">Нэвтрэх, OTP, Google OAuth, template сонголт болон Bonum төлбөрийн secure server endpoints дараагийн шатанд холбогдоно.</p></div><a className="open" href="http://localhost:5173">Landing руу <ArrowUpRight size={17}/></a></section>
  </main>
}
createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
