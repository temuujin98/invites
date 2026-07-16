import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, ChevronDown, Play, Sparkles } from 'lucide-react'

const cards = [
  { name: 'ТЭМҮҮЛЭН', date: '2026.09.18', tone: 'from-[#f1d8ff] to-[#8560ef]', type: 'Хурим' },
  { name: 'LUNAR 27', date: 'SAT · 21:00', tone: 'from-[#ffc9ac] to-[#ed6578]', type: 'Төрсөн өдөр' },
  { name: 'АМАРАА × НОМИН', date: 'УЛААНБААТАР', tone: 'from-[#d9f6c8] to-[#58a986]', type: 'Ёслол' },
]

function InvitationOrbit() {
  const reduceMotion = useReducedMotion()
  return <div className="orbit-wrap" aria-label="Урилгын загваруудын тойрог carousel">
    <div className="orbit-shadow" />
    <motion.div className="orbit" animate={reduceMotion ? {} : { rotateY: 360 }} transition={{ duration: 22, ease: 'linear', repeat: Infinity }}>
      {cards.map((card, index) => <article key={card.name} className={`invite-card bg-linear-to-br ${card.tone}`} style={{ transform: `rotateY(${index * 120}deg) translateZ(16rem)` }}>
        <span>{card.type}</span>
        <div><p className="card-name">{card.name}</p><p className="card-date">{card.date}</p></div>
        <i>i</i>
      </article>)}
    </motion.div>
  </div>
}

export default function App() {
  const reduceMotion = useReducedMotion()
  const fadeUp = { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 } }
  return <main className="page-shell">
    <nav className="nav" aria-label="Үндсэн цэс">
      <a className="brand" href="#top"><span>i</span> INVITES.MN</a>
      <div className="nav-links"><a href="#how">Хэрхэн ажиллах вэ</a><a href="#templates">Загварууд</a></div>
      <a className="button button-small" href="http://localhost:5174">Нэвтрэх <ArrowUpRight size={16} /></a>
    </nav>

    <section id="top" className="hero">
      <div className="hero-copy">
        <motion.p {...fadeUp} transition={{ duration: .6 }} className="eyebrow"><Sparkles size={14} /> Цаг хугацаанаас илүү</motion.p>
        <motion.h1 {...fadeUp} transition={{ duration: .7, delay: .08 }}>МӨЧ БҮРИЙГ<br /><em>УРЬ.</em></motion.h1>
        <motion.div {...fadeUp} transition={{ duration: .7, delay: .18 }} className="hero-bottom">
          <p>Хэдхэн үйлдлээр дурсамжтай үйл явдлаа хөдөлгөөнтэй, чинийх болсон урилга болго.</p>
          <a className="button" href="http://localhost:5174">Урилга үүсгэх <ArrowUpRight size={18} /></a>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, delay: .12 }} className="hero-visual"><InvitationOrbit /></motion.div>
      <a href="#how" className="scroll-cue">Доош гүйлгэх <ChevronDown size={17} /></a>
    </section>

    <section id="how" className="statement">
      <p className="eyebrow">01 — энгийн</p>
      <h2>Сонго.<br />Бол.<br /><span>Илгээ.</span></h2>
      <p className="statement-text">Загвараа сонгоод, өөрийн түүхээр дүүргэ. Хуваалцахад бэлэн холбоос таных болно.</p>
    </section>

    <section id="templates" className="feature-grid">
      <div className="feature feature-large"><Play size={18} fill="currentColor" /><p>Нээлтийн<br />тэр агшин.</p><span>Motion-led templates</span></div>
      <div className="feature"><p>RSVP</p><span>Зочдын хариу, нэг дор</span></div>
      <div className="feature violet"><p>QR</p><span>Нэг scan. Бүх мэдээлэл.</span></div>
    </section>

    <footer><a className="brand" href="#top"><span>i</span> INVITES.MN</a><p>Дурсах мөч тань эндээс эхэлнэ.</p><a href="http://localhost:5174">Эхлэх <ArrowUpRight size={15}/></a></footer>
  </main>
}
