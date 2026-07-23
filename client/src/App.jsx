import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
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

const stats = [
  { value: '3 мин', label: 'Урилга үүсгэх дундаж хугацаа' },
  { value: '20+', label: 'Бэлэн загвар' },
  { value: '100%', label: 'Гар утсанд тохирсон' },
]

const marqueeWords = ['ХУРИМ', 'ТӨРСӨН ӨДӨР', 'ЁСЛОЛ', 'ХҮЛЭЭН АВАЛТ', 'ТӨГСӨЛТ', 'ОЙН БАЯР', 'НЭЭЛТ', 'НЭРИЙН БАЯР']

const ease = [0.22, 1, 0.36, 1]

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

/*
 * Hero: Leonardo-style 3D typography room the camera flies INTO on scroll.
 * The whole scene scales up + rotates while fading, so scrolling feels like
 * pushing through the wall of letters. Copy fades and lifts out of the way.
 */
function Hero({ reduceMotion }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  const sceneScale = useTransform(p, [0, 1], [1, 2.1])
  const sceneRotate = useTransform(p, [0, 1], [0, -6])
  const sceneOpacity = useTransform(p, [0, 0.7], [1, 0])
  const copyY = useTransform(p, [0, 0.6], [0, -120])
  const copyOpacity = useTransform(p, [0, 0.45], [1, 0])

  const wallVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  }
  const wallItem = {
    hidden: { opacity: 0, scale: 1.4, filter: 'blur(8px)' },
    show: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 1.1, ease } },
  }

  const copyContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.6 } },
  }
  const copyItem = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  }

  return (
    <section id="top" ref={ref} className="hero">
      <div className="hero-sticky">
        <motion.div
          className="hero-scene"
          style={reduceMotion ? undefined : { scale: sceneScale, rotate: sceneRotate, opacity: sceneOpacity }}
          aria-hidden="true"
        >
          <motion.div
            className="scene"
            variants={reduceMotion ? undefined : wallVariants}
            initial={reduceMotion ? false : 'hidden'}
            animate={reduceMotion ? false : 'show'}
          >
            <motion.p className="wall ceiling" variants={reduceMotion ? undefined : wallItem}>МӨЧ БҮР<br />ТАНЫХ</motion.p>
            <motion.p className="wall floor" variants={reduceMotion ? undefined : wallItem}>УРИЛГА<br />БОЛГО</motion.p>
            <motion.p className="wall left" variants={reduceMotion ? undefined : wallItem}>ТАНЫ<br />МӨЧ</motion.p>
            <motion.p className="wall right" variants={reduceMotion ? undefined : wallItem}>УРЬЖ<br />БАЙНА</motion.p>
          </motion.div>
          <div className="hero-veil" />
        </motion.div>

        <motion.div
          className="hero-copy"
          style={reduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}
          variants={reduceMotion ? undefined : copyContainer}
          initial={reduceMotion ? false : 'hidden'}
          animate={reduceMotion ? false : 'show'}
        >
          <motion.p className="hero-badge" variants={reduceMotion ? undefined : copyItem}>
            <Sparkles size={13} /> DIGITAL УРИЛГЫН ПЛАТФОРМ
          </motion.p>
          <motion.h1 variants={reduceMotion ? undefined : copyItem}>Мөч бүрийг урилга<br />болгодог платформ</motion.h1>
          <motion.div className="hero-actions" variants={reduceMotion ? undefined : copyItem}>
            <a className="button button-white" href={studioUrl}>Урилга үүсгэх</a>
            <a className="button button-ghost" href="#showcase">Загварууд үзэх</a>
          </motion.div>
        </motion.div>

        <motion.div
          className="scroll-hint"
          aria-hidden="true"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={reduceMotion ? false : { opacity: [0, 1, 1, 0.4], y: [0, 6, 0] }}
          transition={reduceMotion ? undefined : { duration: 2.2, repeat: Infinity, delay: 1.4 }}
        >
          <span />
        </motion.div>
      </div>
    </section>
  )
}

/* Marquee band: continuous CSS scroll, plus a slight scroll-linked skew drift */
function MarqueeBand({ reduceMotion }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['6%', '-6%'])
  return (
    <div className="marquee" ref={ref} aria-hidden="true">
      <motion.div className="marquee-inner" style={reduceMotion ? undefined : { x }}>
        <div className={`marquee-track ${reduceMotion ? 'static' : ''}`}>
          {[...marqueeWords, ...marqueeWords].map((word, index) => <span key={index}>{word}<b>✦</b></span>)}
        </div>
      </motion.div>
    </div>
  )
}

/* Showcase strip: cards slide sideways driven by page scroll */
function ShowcaseStrip({ reduceMotion }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-34%'])
  return (
    <section id="showcase" ref={ref} className="showcase">
      <motion.div
        className="section-head"
        initial={reduceMotion ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease }}
      >
        <p className="eyebrow">ЗАГВАРУУД</p>
        <h2>Арга хэмжээ бүрд<br /><em>тохирсон загвар</em></h2>
      </motion.div>
      <motion.div className="showcase-track" style={reduceMotion ? undefined : { x }}>
        {streamCards.map((card, index) => (
          <motion.div
            key={card.name}
            initial={reduceMotion ? false : { opacity: 0, y: 60, rotate: index % 2 ? 3 : -3 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: index * 0.05, ease }}
          >
            <StreamCard card={card} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

/* Stats row: numbers pop in with a spring, one after another */
function StatsRow({ reduceMotion }) {
  return (
    <section className="stats">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="stat"
          initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 220, damping: 18, delay: index * 0.12 }}
        >
          <b>{stat.value}</b>
          <small>{stat.label}</small>
        </motion.div>
      ))}
    </section>
  )
}

export default function App() {
  const reduceMotion = useReducedMotion()
  if (window.location.pathname.startsWith('/studio')) return <CreatorApp />
  if (window.location.pathname.startsWith('/i/')) return <PublicInvitation />
  return (
    <main className="page-shell">
      <motion.nav
        className="nav"
        aria-label="Үндсэн хэсэг"
        initial={reduceMotion ? false : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease }}
      >
        <a className="brand" href="#top"><img src="/brand/invites.mn/logo-wordmark-light.png" alt="INVITES.MN" /></a>
        <div className="nav-links">
          <a href="#showcase">Загварууд</a>
          <a href="#features">Боломжууд</a>
        </div>
        <a className="button button-white button-small" href={studioUrl}>Нэвтрэх</a>
      </motion.nav>

      <Hero reduceMotion={reduceMotion} />

      <MarqueeBand reduceMotion={reduceMotion} />

      <ShowcaseStrip reduceMotion={reduceMotion} />

      <StatsRow reduceMotion={reduceMotion} />

      <section id="features" className="features">
        <motion.div
          className="section-head"
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="eyebrow">ЯАГААД INVITES.MN ГЭЖ</p>
          <h2>Урилга илгээхийн<br /><em>шинэ стандарт</em></h2>
        </motion.div>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              className="feature"
              initial={reduceMotion ? false : { opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, delay: index * 0.1, ease }}
              whileHover={reduceMotion ? undefined : { y: -6 }}
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
          transition={{ duration: 0.8, ease }}
        >
          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
          >
            Таны онцгой өдөр<br /><em>эндээс эхэлнэ</em>
          </motion.h2>
          <p>Бүртгэл үнэгүй. Эхний урилгаа одоо бүтээгээрэй.</p>
          <a className="button button-white" href={studioUrl}>Үнэгүй эхлэх</a>
        </motion.div>
      </section>

      <motion.footer
        initial={reduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <img src="/brand/invites.mn/logo-wordmark-light.png" alt="INVITES.MN" />
        <a href="mailto:hello@invites.mn">hello@invites.mn <ArrowUpRight size={14} /></a>
      </motion.footer>
    </main>
  )
}
