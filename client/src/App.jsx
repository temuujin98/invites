import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Sparkles } from 'lucide-react'
import PublicInvitation from './PublicInvitation'
import CreatorApp from '../../app/src/CreatorApp.jsx'

const studioUrl = '/studio'
const ease = [0.22, 1, 0.36, 1]

/* ---------------- Data ---------------- */

const showreel = [
  { name: 'ТЭМҮҮЛЭН × НОМИН', date: '2026.09.18 · УЛААНБААТАР', tone: 'lavender', type: 'Хуримын урилга' },
  { name: 'LUNAR 27', date: 'БЯМБА · 21:00 · SKY LOUNGE', tone: 'coral', type: 'Төрсөн өдрийн урилга' },
  { name: 'GALA NIGHT', date: 'БААСАН · 19:30 · SHANGRI-LA', tone: 'gold', type: 'Хүлээн авалтын урилга' },
  { name: 'АМАРАА × НОМИН', date: '2026.08.09 · ТАНСАГ ӨРГӨӨ', tone: 'sage', type: 'Ёслолын урилга' },
]

const featureBlocks = [
  {
    eyebrow: 'ЗАГВАР',
    title: 'Хязгааргүй гоё загварууд',
    copy: 'Хурим, төрсөн өдөр, ёслол — арга хэмжээ бүрд зориулсан мэргэжлийн загваруудаас сонгоод өөрийн өнгө, үсэг, мэдээллээр минутын дотор өөриймшүүлнэ.',
    cta: 'Загварууд үзэх',
    href: '#showcase',
    visual: 'fan',
  },
  {
    eyebrow: 'ХУВААЛЦАХ',
    title: 'Нэг холбоос. Хаана ч.',
    copy: 'Урилга бүр өөрийн гэсэн вэб хуудастай. Мессенжер, имэйл, QR — аль ч сувгаар илгээхэд зочны гар утсанд төгс харагдана.',
    cta: 'Урилга үүсгэх',
    href: studioUrl,
    visual: 'phone',
  },
  {
    eyebrow: 'RSVP',
    title: 'Хариу бодит цагт',
    copy: 'Хэн ирэх, хэдүүлээ ирэхийг зочид нэг товчоор хариулна. Та бүх хариуг нэг самбараас шууд харж, ширээгээ төлөвлөнө.',
    cta: 'Хэрхэн ажилладаг вэ',
    href: '#audience',
    visual: 'rsvp',
  },
  {
    eyebrow: 'ЗАСВАР',
    title: 'Өөрчлөлт шууд түгээгдэнэ',
    copy: 'Огноо, байршил өөрчлөгдсөн ч холбоос хэвээрээ. Нэг удаа зассанаар бүх зочинд хамгийн сүүлийн мэдээлэл автоматаар очно.',
    cta: 'Үнэгүй эхлэх',
    href: studioUrl,
    visual: 'editor',
  },
]

const audiences = [
  { key: 'Хурим', copy: 'Ханиудын нэрс, ёслолын хөтөлбөр, байршлын зураг бүхий тансаг урилга. Зочдын хариуг нэг дороос хянана.', card: { name: 'ТЭМҮҮЛЭН × НОМИН', date: '2026.09.18', tone: 'lavender', type: 'Хурим' } },
  { key: 'Төрсөн өдөр', copy: 'Найзуудаа нэг холбоосоор урь. Тоглоомтой, өнгөлөг, залуу дизайнууд таны үдэшлэгт тон нэмнэ.', card: { name: 'LUNAR 27', date: 'SAT 21:00', tone: 'coral', type: 'Төрсөн өдөр' } },
  { key: 'Ёслол', copy: 'Хүндэтгэлийн ёслол, ойн баяр, нэрийн баярт зориулсан сонгодог хэв маягийн урилгууд.', card: { name: 'АМАРАА × НОМИН', date: 'УЛААНБААТАР', tone: 'sage', type: 'Ёслол' } },
  { key: 'Байгууллага', copy: 'Нээлт, хүлээн авалт, багийн арга хэмжээ — брэндийн өнгөөр урилга бүтээж, оролцогчдоо бүртгэ.', card: { name: 'GALA NIGHT', date: 'FRI 19:30', tone: 'gold', type: 'Хүлээн авалт' } },
]

const steps = [
  { num: '01', title: 'ЗАГВАРАА СОНГО', copy: 'Бэлэн загваруудаас сонгоод нэр, огноо, байршлаа оруул.' },
  { num: '02', title: 'ХОЛБООСОО ХУВААЛЦ', copy: 'Нэг товчоор нийтлээд холбоосоо зочдодоо илгээ.' },
  { num: '03', title: 'RSVP-ЭЭ ХЯНА', copy: 'Хэн ирэхийг бодит цагт хараад арга хэмжээгээ төлөвлө.' },
]

const templates = [
  { name: 'ТЭМҮҮЛЭН', date: '2026 09 18', tone: 'lavender', type: 'Хурим' },
  { name: 'LUNAR 27', date: 'SAT 21 00', tone: 'coral', type: 'Төрсөн өдөр' },
  { name: 'АМАРАА × НОМИН', date: 'УЛААНБААТАР', tone: 'sage', type: 'Ёслол' },
  { name: 'МИШЭЭЛ 1', date: '2026 11 02', tone: 'midnight', type: 'Ойн баяр' },
  { name: 'GALA NIGHT', date: 'FRI 19 30', tone: 'gold', type: 'Хүлээн авалт' },
  { name: 'СҮРЭН × БАТ', date: '2026 08 09', tone: 'rose', type: 'Хурим' },
  { name: 'GRAD 26', date: 'UB · JUNE', tone: 'ocean', type: 'Төгсөлт' },
  { name: 'НАРАН', date: '2026 10 24', tone: 'lavender', type: 'Нэрийн баяр' },
]

const stats = [
  { value: '3 мин', label: 'Урилга үүсгэх дундаж хугацаа' },
  { value: '20+', label: 'Бэлэн загвар' },
  { value: '100%', label: 'Гар утсанд тохирсон' },
]

/* ---------------- Shared bits ---------------- */

function InviteCard({ card, big }) {
  return (
    <article className={`stream-card ${card.tone} ${big ? 'stream-card-big' : ''}`}>
      <span>{card.type}</span>
      <div>
        <p className="card-name">{card.name}</p>
        <p className="card-date">{card.date}</p>
      </div>
      <i>i</i>
    </article>
  )
}

/* Leonardo s-tween preset: blocks scale from 0.9 + fade as they enter */
function Tween({ children, className, delay = 0, y = 40 }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

/* ---------------- Hero: 3D typography room fly-through ---------------- */

function Hero({ reduceMotion }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const sceneScale = useTransform(p, [0, 1], [1, 2.1])
  const sceneRotate = useTransform(p, [0, 1], [0, -6])
  const sceneOpacity = useTransform(p, [0, 0.7], [1, 0])
  const copyScale = useTransform(p, [0, 0.5], [1, 0.9])
  const copyOpacity = useTransform(p, [0, 0.4], [1, 0])

  const wallVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }
  const wallItem = { hidden: { opacity: 0, scale: 1.4, filter: 'blur(8px)' }, show: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 1.1, ease } } }
  const copyContainer = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.6 } } }
  const copyItem = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }

  return (
    <section id="top" ref={ref} className="hero">
      <div className="hero-sticky">
        <motion.div className="hero-scene" style={reduceMotion ? undefined : { scale: sceneScale, rotate: sceneRotate, opacity: sceneOpacity }} aria-hidden="true">
          <motion.div className="scene" variants={reduceMotion ? undefined : wallVariants} initial={reduceMotion ? false : 'hidden'} animate={reduceMotion ? false : 'show'}>
            <motion.p className="wall ceiling" variants={reduceMotion ? undefined : wallItem}>МӨЧ БҮР<br />ТАНЫХ</motion.p>
            <motion.p className="wall floor" variants={reduceMotion ? undefined : wallItem}>УРИЛГА<br />БОЛГО</motion.p>
            <motion.p className="wall left" variants={reduceMotion ? undefined : wallItem}>ТАНЫ<br />МӨЧ</motion.p>
            <motion.p className="wall right" variants={reduceMotion ? undefined : wallItem}>УРЬЖ<br />БАЙНА</motion.p>
          </motion.div>
          <div className="hero-veil" />
        </motion.div>

        <motion.div
          className="hero-copy"
          style={reduceMotion ? undefined : { scale: copyScale, opacity: copyOpacity }}
          variants={reduceMotion ? undefined : copyContainer}
          initial={reduceMotion ? false : 'hidden'}
          animate={reduceMotion ? false : 'show'}
        >
          <motion.p className="hero-badge" variants={reduceMotion ? undefined : copyItem}><Sparkles size={13} /> DIGITAL УРИЛГЫН ПЛАТФОРМ</motion.p>
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

/* ---------------- Showreel: full-width carousel (Leonardo video reel) ---------------- */

function Showreel({ reduceMotion }) {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const active = showreel[index]

  useEffect(() => {
    if (reduceMotion) return undefined
    const timer = setInterval(() => { setDir(1); setIndex((current) => (current + 1) % showreel.length) }, 4500)
    return () => clearInterval(timer)
  }, [reduceMotion])

  function go(step) {
    setDir(step)
    setIndex((current) => (current + step + showreel.length) % showreel.length)
  }

  return (
    <section className={`showreel tone-${active.tone}`}>
      <button className="reel-arrow left" aria-label="Өмнөх" onClick={() => go(-1)}><ArrowLeft size={18} /></button>
      <div className="reel-stage">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={active.name}
            className="reel-slide"
            custom={dir}
            initial={reduceMotion ? false : { opacity: 0, x: 90 * dir, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -90 * dir, scale: 0.94 }}
            transition={{ duration: 0.55, ease }}
          >
            <InviteCard card={active} big />
            <p className="reel-caption">{active.type}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <button className="reel-arrow right" aria-label="Дараах" onClick={() => go(1)}><ArrowRight size={18} /></button>
      <div className="reel-dots" role="tablist" aria-label="Урилгын жишээ">
        {showreel.map((slide, dotIndex) => (
          <button
            key={slide.name}
            role="tab"
            aria-selected={dotIndex === index}
            aria-label={slide.name}
            className={dotIndex === index ? 'active' : ''}
            onClick={() => { setDir(dotIndex > index ? 1 : -1); setIndex(dotIndex) }}
          />
        ))}
      </div>
    </section>
  )
}

/* ---------------- Feature block visuals (pure CSS, no images) ---------------- */

function FanVisual() {
  return (
    <div className="visual-fan" aria-hidden="true">
      <InviteCard card={{ name: 'НАРАН', date: '2026 10 24', tone: 'sage', type: 'Нэрийн баяр' }} />
      <InviteCard card={{ name: 'LUNAR 27', date: 'SAT 21 00', tone: 'coral', type: 'Төрсөн өдөр' }} />
      <InviteCard card={{ name: 'ТЭМҮҮЛЭН', date: '2026 09 18', tone: 'lavender', type: 'Хурим' }} />
    </div>
  )
}

function PhoneVisual() {
  return (
    <div className="visual-phone" aria-hidden="true">
      <div className="phone">
        <div className="phone-notch" />
        <div className="phone-card lavender">
          <span>ХУРИМ</span>
          <b>ТЭМҮҮЛЭН × НОМИН</b>
          <small>2026.09.18 · УЛААНБААТАР</small>
        </div>
        <div className="phone-link">invites.mn/temuulen-nomin</div>
      </div>
    </div>
  )
}

function RsvpVisual() {
  const rows = [
    { name: 'Сүрэн', extra: '+1 зочин', yes: true },
    { name: 'Мишээл', extra: 'ганцаараа', yes: true },
    { name: 'Бат-Эрдэнэ', extra: 'ирж чадахгүй', yes: false },
    { name: 'Номин', extra: '+2 зочин', yes: true },
  ]
  return (
    <div className="visual-rsvp" aria-hidden="true">
      <div className="rsvp-panel">
        <p>ИРСЭН ХАРИУ · 24</p>
        {rows.map((row) => (
          <div className="rsvp-row" key={row.name}>
            <span className={`rsvp-mark ${row.yes ? 'yes' : 'no'}`}>{row.yes ? <Check size={11} /> : '×'}</span>
            <b>{row.name}</b>
            <small>{row.extra}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

function EditorVisual() {
  return (
    <div className="visual-editor" aria-hidden="true">
      <div className="editor-panel">
        <p>УРИЛГА ЗАСАХ</p>
        <div className="editor-field"><small>Нэр</small><span>Тэмүүлэн × Номин</span></div>
        <div className="editor-field"><small>Огноо</small><span>2026.09.18 · 18:00</span></div>
        <div className="editor-field active"><small>Байршил</small><span>Тансаг өргөө|</span></div>
      </div>
      <div className="editor-mini lavender">
        <span>ХУРИМ</span>
        <b>ТЭМҮҮЛЭН × НОМИН</b>
        <small>ТАНСАГ ӨРГӨӨ</small>
      </div>
    </div>
  )
}

const visuals = { fan: FanVisual, phone: PhoneVisual, rsvp: RsvpVisual, editor: EditorVisual }

/* Leonardo-style alternating full-height feature block with scale+fade tween */
function FeatureBlock({ block, flip }) {
  const Visual = visuals[block.visual]
  return (
    <section className={`feature-block ${flip ? 'flip' : ''}`}>
      <Tween className="feature-inner">
        <div className="feature-copy">
          <p className="eyebrow">{block.eyebrow}</p>
          <h2>{block.title}</h2>
          <p className="feature-text">{block.copy}</p>
          <a className="button button-white" href={block.href}>{block.cta}</a>
        </div>
        <div className="feature-visual"><Visual /></div>
      </Tween>
    </section>
  )
}

/* ---------------- Audience tabs (Leonardo roles switcher) ---------------- */

function AudienceTabs({ reduceMotion }) {
  const [index, setIndex] = useState(0)
  const active = audiences[index]
  return (
    <section id="audience" className="audience">
      <Tween className="section-head">
        <p className="eyebrow">ХЭНД ЗОРИУЛАГДСАН БЭ</p>
        <h2>Арга хэмжээ бүрд<br /><em>нэг платформ</em></h2>
      </Tween>
      <div className="audience-grid">
        <div className="audience-tabs" role="tablist" aria-label="Арга хэмжээний төрөл">
          {audiences.map((audience, tabIndex) => (
            <button
              key={audience.key}
              role="tab"
              aria-selected={tabIndex === index}
              className={tabIndex === index ? 'active' : ''}
              onClick={() => setIndex(tabIndex)}
            >
              {audience.key}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={active.key}
            className="audience-body"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -14 }}
            transition={{ duration: 0.4, ease }}
          >
            <p>{active.copy}</p>
            <InviteCard card={active.card} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ---------------- Steps (Leonardo "Get started" cards) ---------------- */

function Steps() {
  return (
    <section className="steps">
      <Tween className="section-head">
        <p className="eyebrow">ЭХЛЭХЭД АМАРХАН</p>
        <h2>Гуравхан алхам —<br /><em>урилга бэлэн</em></h2>
      </Tween>
      <div className="steps-grid">
        {steps.map((step, index) => (
          <Tween key={step.num} delay={index * 0.12}>
            <article className="step-card">
              <span className="step-num">{step.num}</span>
              <b>{step.title}</b>
              <small>{step.copy}</small>
            </article>
          </Tween>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Template strip: scroll-driven slide ---------------- */

function ShowcaseStrip({ reduceMotion }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-34%'])
  return (
    <section id="showcase" ref={ref} className="showcase">
      <Tween className="section-head">
        <p className="eyebrow">ЗАГВАРУУД</p>
        <h2>Арга хэмжээ бүрд<br /><em>тохирсон загвар</em></h2>
      </Tween>
      <motion.div className="showcase-track" style={reduceMotion ? undefined : { x }}>
        {templates.map((card, index) => (
          <motion.div
            key={card.name}
            initial={reduceMotion ? false : { opacity: 0, y: 60, rotate: index % 2 ? 3 : -3 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: index * 0.05, ease }}
          >
            <InviteCard card={card} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

/* ---------------- App ---------------- */

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
          <a href="#audience">Хэнд зориулагдсан</a>
        </div>
        <a className="button button-white button-small" href={studioUrl}>Нэвтрэх</a>
      </motion.nav>

      <Hero reduceMotion={reduceMotion} />

      <Showreel reduceMotion={reduceMotion} />

      {featureBlocks.map((block, index) => (
        <FeatureBlock key={block.title} block={block} flip={index % 2 === 1} />
      ))}

      <AudienceTabs reduceMotion={reduceMotion} />

      <Steps />

      <ShowcaseStrip reduceMotion={reduceMotion} />

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

      <section className="cta-band">
        <Tween className="cta-inner">
          <h2>Таны онцгой өдөр<br /><em>эндээс эхэлнэ</em></h2>
          <p>Бүртгэл үнэгүй. Эхний урилгаа одоо бүтээгээрэй.</p>
          <a className="button button-white" href={studioUrl}>Үнэгүй эхлэх</a>
        </Tween>
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
