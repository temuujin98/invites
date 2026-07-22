import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight, CalendarDays, MousePointerClick, Share2, Sparkles } from 'lucide-react'
import PublicInvitation from './PublicInvitation'
import CreatorApp from '../../app/src/CreatorApp.jsx'

const studioUrl = '/studio'

const streamCards = [
  { name: 'ТЭМҮҮЛЭН', date: '2026 09 18', tone: 'lavender', type: 'Хурим' },
  { name: 'LUNAR 27', date: 'SAT 21 00', tone: 'coral', type: 'Төрсөн өдөр' },
  { name: 'АМАРАА × НОМИН', date: 'УЛААНБААТАР', tone: 'sage', type: 'Ёслол' },
  { name: 'МИШЭЭЛ 1', date: '2026 11 02', tone: 'midnight', type: 'Ойн баяр' },
  { name: 'GALA NIGHT', date: 'FRI 19 30', tone: 'gold', type: 'Хүлээн авалт' },
  { name: 'СҮРЭН × БАТ', date: '2026 08 09', tone: 'rose', type: 'Хурим' },
  { name: 'GRAD 26', date: 'UB · JUNE', tone: 'ocean', type: 'Төгсөлт' },
  { name: 'НАРАН', date: '2026 10 24', tone: 'lavender', type: 'Нэрийн баяр' },
]

const features = [
  { icon: Sparkles, title: 'Загвараа сонго', copy: 'Хурим, төрсөн өдөр, ёслолын бэлэн загваруудаас сонгоод хэдхэн минутад өөрийн урилгыг бүтээнэ.' },
  { icon: Share2, title: 'Нэг холбоосоор хуваалц', copy: 'Урилга бүр өөрийн гэсэн холбоостой. Мессенжер, имэйл — хаана ч илгээхэд гар утсанд төгс харагдана.' },
  { icon: CalendarDays, title: 'RSVP нэг дороос', copy: 'Хэн ирэх, хэдүүлээ ирэхийг зочид шууд хариулна. Та бүгдийг нэг самбараас хянана.' },
  { icon: MousePointerClick, title: 'Шууд засвар', copy: 'Огноо, байршил өөрчлөгдсөн ч холбоос хэвээрээ — зочдод үргэлж хамгийн сүүлийн мэдээлэл очно.' },
]

function StreamCard({ card }) {
  return (
    <article className={`stream-card ${card.tone}`}>
      <span>{card.type}</span>
      <div>
        <p className="card-name">{card.name}</p>
        <p className="card-date">{card.date}</p>
      </div>
      <i>i</i>
    </article>
  )
}

/* Leonardo-style 3D typography room: ceiling / floor / left / right walls */
function HeroScene({ reduceMotion }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 700], [0, 150])
  const opacity = useTransform(scrollY, [0, 650], [1, 0.15])
  return (
    <motion.div className="hero-scene" style={reduceMotion ? undefined : { y, opacity }} aria-hidden="true">
      <div className="scene">
        <p className="wall ceiling">МӨЧ БҮР<br />ТАНЫХ</p>
        <p className="wall floor">УРИЛГА<br />БОЛГО</p>
        <p className="wall left">ТАНЫ<br />МӨЧ</p>
        <p className="wall right">УРЬЖ<br />БАЙНА</p>
      </div>
      <div className="hero-veil" />
    </motion.div>
  )
}

/* Showcase strip: cards slide sideways driven by page scroll */
function ShowcaseStrip({ reduceMotion }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['4%', '-32%'])
  return (
    <section id="showcase" ref={ref} className="showcase">
      <motion.div
        className="section-head"
        initial={reduceMotion ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="eyebrow">ЗАГВАРУУД</p>
        <h2>Арга хэмжээ бүрд<br /><em>тохирсон загвар</em></h2>
      </motion.div>
      <motion.div className="showcase-track" style={reduceMotion ? undefined : { x }}>
        {streamCards.map((card) => <StreamCard key={card.name} card={card} />)}
      </motion.div>
    </section>
  )
}

export default function App() {
  const reduceMotion = useReducedMotion()
  if (window.location.pathname.startsWith('/studio')) return <CreatorApp />
  if (window.location.pathname.startsWith('/i/')) return <PublicInvitation />
  return (
    <main className="page-shell">
      <nav className="nav" aria-label="Үндсэн хэсэг">
        <a className="brand" href="#top"><img src="/brand/invites.mn/logo-wordmark-light.png" alt="INVITES.MN" /></a>
        <div className="nav-links">
          <a href="#showcase">Загварууд</a>
          <a href="#features">Боломжууд</a>
        </div>
        <a className="button button-white button-small" href={studioUrl}>Нэвтрэх</a>
      </nav>

      <section id="top" className="hero">
        <HeroScene reduceMotion={reduceMotion} />
        <motion.div
          className="hero-copy"
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1>Мөч бүрийг урилга<br />болгодог платформ</h1>
          <div className="hero-actions">
            <a className="button button-white" href={studioUrl}>Урилга үүсгэх</a>
            <a className="button button-ghost" href="#showcase">Загварууд үзэх</a>
          </div>
        </motion.div>
      </section>

      <ShowcaseStrip reduceMotion={reduceMotion} />

      <section id="features" className="features">
        <motion.div
          className="section-head"
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">ЯАГААД INVITES.MN ГЭЖ</p>
          <h2>Урилга илгээхийн<br /><em>шинэ стандарт</em></h2>
        </motion.div>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              className="feature"
              initial={reduceMotion ? false : { opacity: 0, x: index % 2 ? 48 : -48 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="feature-icon"><feature.icon size={19} /></span>
              <p>{feature.title}</p>
              <small>{feature.copy}</small>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <motion.div
          className="cta-inner"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-90px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2>Таны онцгой өдөр<br /><em>эндээс эхэлнэ</em></h2>
          <p>Бүртгэл үнэгүй. Эхний урилгаа одоо бүтээгээрэй.</p>
          <a className="button button-white" href={studioUrl}>Үнэгүй эхлэх</a>
        </motion.div>
      </section>

      <footer>
        <img src="/brand/invites.mn/logo-wordmark-light.png" alt="INVITES.MN" />
        <a href="mailto:hello@invites.mn">hello@invites.mn <ArrowUpRight size={14} /></a>
      </footer>
    </main>
  )
}
