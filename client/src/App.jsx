import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Play } from 'lucide-react'
import PublicInvitation from './PublicInvitation'

const cards = [
  { name: 'ТЭМҮҮЛЭН', date: '2026 09 18', tone: 'lavender', type: 'Хурим', angle: 0 },
  { name: 'LUNAR 27', date: 'SAT 21 00', tone: 'coral', type: 'Төрсөн өдөр', angle: 120 },
  { name: 'АМАРАА × НОМИН', date: 'УЛААНБААТАР', tone: 'sage', type: 'Ёслол', angle: 240 },
]
function InvitationOrbit() { const reduceMotion = useReducedMotion(); return <div className="orbit-wrap" aria-hidden="true"><div className="orbit-shadow" /><motion.div className="orbit" animate={reduceMotion ? {} : { rotateY: 360 }} transition={{ duration: 24, ease: 'linear', repeat: Infinity }}>{cards.map((card) => <article key={card.name} className={`invite-card ${card.tone}`} style={{ transform: `rotateY(${card.angle}deg) translateZ(15rem)` }}><span>{card.type}</span><div><p className="card-name">{card.name}</p><p className="card-date">{card.date}</p></div><i>i</i></article>)}</motion.div></div> }
export default function App() { const reduceMotion = useReducedMotion(); if (window.location.pathname.startsWith('/i/')) return <PublicInvitation />; return <main className="page-shell"><nav className="nav" aria-label="Үндсэн хэсэг"><a className="brand" href="#top"><img src="/brand/invites.mn/logo-wordmark-light.png" alt="INVITES.MN" /></a><a className="button button-small" href={studioUrl}>Нэвтрэх <ArrowUpRight size={16} /></a></nav><section id="top" className="hero"><motion.div className="hero-copy" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.7}}><p>Digital урилга</p><a className="button" href={studioUrl}>Урилга үүсгэх <ArrowUpRight size={18} /></a></motion.div><div className="hero-visual"><InvitationOrbit /></div></section></main> }