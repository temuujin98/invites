import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Play } from 'lucide-react'

const cards = [
  { name: 'ТЭМҮҮЛЭН', date: '2026 09 18', tone: 'lavender', type: 'Хурим', angle: -46 },
  { name: 'LUNAR 27', date: 'SAT 21 00', tone: 'coral', type: 'Төрсөн өдөр', angle: 0 },
  { name: 'АМАРАА × НОМИН', date: 'УЛААНБААТАР', tone: 'sage', type: 'Ёслол', angle: 46 },
]

function InvitationArc() {
  const reduceMotion = useReducedMotion()
  return <div className="arc-wrap" aria-label="Урилгын загварууд">
    <div className="arc-shadow" />
    <motion.div className="arc" animate={reduceMotion ? {} : { rotateY: [-16, 24, -16] }} transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}>
      {cards.map((card) => <article key={card.name} className={`invite-card ${card.tone}`} style={{ transform: `rotateY(${card.angle}deg) translateZ(13rem)` }}>
        <span>{card.type}</span><div><p className="card-name">{card.name}</p><p className="card-date">{card.date}</p></div><i>i</i>
      </article>)}
    </motion.div>
  </div>
}

export default function App() {
  const reduceMotion = useReducedMotion()
  const fadeUp = { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 } }
  return <main className="page-shell">
    <nav className="nav" aria-label="Үндсэн хэсэг"><a className="brand" href="#top"><img src="/brand/invites.mn/Logo (3).png" alt="INVITES.MN" /></a><a className="button button-small" href="http://localhost:5174">Нэвтрэх <ArrowUpRight size={16} /></a></nav>
    <section id="top" className="hero"><div className="hero-copy"><motion.p {...fadeUp} transition={{ duration: .6 }} className="eyebrow">DIGITAL УРИЛГА</motion.p><motion.h1 {...fadeUp} transition={{ duration: .7, delay: .08 }}>МӨЧ БҮРИЙГ<br /><em>УРЬ</em></motion.h1><motion.div {...fadeUp} transition={{ duration: .7, delay: .18 }} className="hero-bottom"><p>Digital урилга</p><a className="button" href="http://localhost:5174">Урилга үүсгэх <ArrowUpRight size={18} /></a></motion.div></div><motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, delay: .12 }} className="hero-visual"><InvitationArc /></motion.div></section>
    <section id="templates" className="feature-grid"><div className="feature feature-large"><Play size={18} fill="currentColor" /><p>Хөдөлгөөнтэй<br />урилга</p><span>Motion templates</span></div><div className="feature"><p>RSVP</p><span>Зочдын хариу</span></div><div className="feature violet"><p>QR</p><span>Нэг scan бүх мэдээлэл</span></div></section>
    <footer><a className="brand" href="#top"><img src="/brand/invites.mn/Logo (3).png" alt="INVITES.MN" /></a><a href="http://localhost:5174">Эхлэх <ArrowUpRight size={15}/></a></footer>
  </main>
}