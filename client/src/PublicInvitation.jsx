/* eslint-disable react-hooks/set-state-in-effect */
/*
 * Guest page. Loads the invitation, plays the paid intro and background
 * music, then hands the data to the template's layout — every template
 * picks its layout through `layout` in templates.js.
 */
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import { getTemplate, buildDemoInvitation } from './templates'
import { CurtainIntro, EnvelopeIntro, MusicPlayer } from './invite/shared'
import DefaultLayout from './invite/DefaultLayout'
import WeddingLayout from './invite/WeddingLayout'

const layouts = {
  wedding: WeddingLayout,
}

export default function PublicInvitation({ demoTemplateId }) {
  const [invitation, setInvitation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [introDone, setIntroDone] = useState(false)
  const [error, setError] = useState('')
  const slug = window.location.pathname.split('/').filter(Boolean).at(-1)
  const invitedGuest = new URLSearchParams(window.location.search).get('g') || ''

  useEffect(() => {
    if (demoTemplateId) {
      const demo = buildDemoInvitation(demoTemplateId)
      if (demo) setInvitation(demo)
      else setError('Загвар олдсонгүй')
      setLoading(false)
      return undefined
    }
    if (!supabase || !slug) { setLoading(false); return undefined }
    let alive = true
    supabase
      .from('invitations')
      .select('id, event_type, title, message, event_at, venue, theme, template_id, options')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle()
      .then(({ data, error: requestError }) => {
        if (!alive) return
        if (requestError || !data) setError('Энэ урилга олдсонгүй эсвэл идэвхгүй байна')
        else {
          setInvitation(data)
          supabase.rpc('increment_views', { invite_slug: slug }).then(() => {})
        }
        setLoading(false)
      })
    return () => { alive = false }
  }, [slug, demoTemplateId])

  if (!isSupabaseConfigured) {
    return <main className="pv"><p className="pv-loading">Тохиргоо дутуу байна.</p></main>
  }

  if (loading) {
    return <main className="pv"><p className="pv-loading">Урилгыг ачаалж байна…</p></main>
  }

  if (!invitation) {
    return (
      <main className="pv">
        <div className="pv-content">
          <a className="pv-brand" href="/"><img src="/brand/invites.mn/logo-wordmark-light.png" alt="INVITES.MN" /></a>
          <h1 className="pv-missing">{error || 'Урилга олдсонгүй'}</h1>
          <a className="pv-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>
        </div>
      </main>
    )
  }

  const template = getTemplate(invitation.template_id)
  const layout = template?.layout || 'classic'
  const Layout = layouts[layout] || DefaultLayout
  const tone = invitation.theme || 'lavender'
  const options = invitation.options || {}
  const gallery = options.gallery || (options.coverUrl ? [options.coverUrl] : [])
  const showIntro = (options.intro === 'curtain' || options.intro === 'envelope') && !introDone
  const bank = options.bank
  const bankParts = typeof bank === 'object'
    ? [bank.bank, bank.number, bank.holder].filter(Boolean)
    : bank ? [bank] : []
  const mapHref = options.mapUrl
    || (invitation.venue ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation.venue)}` : '')
  const bgUrl = invitation.template_id ? `/backgrounds/${invitation.template_id}.jpg` : ''

  return (
    <main className={`pv tone-${tone} layout-${layout}`} style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined}>
      <div className="pv-veil" aria-hidden="true" />
      {showIntro && (options.intro === 'envelope'
        ? <EnvelopeIntro eventType={invitation.event_type} guest={invitedGuest} onDone={() => setIntroDone(true)} />
        : <CurtainIntro eventType={invitation.event_type} guest={invitedGuest} color={options.introColor} onDone={() => setIntroDone(true)} />)}
      {options.music?.id && <MusicPlayer music={options.music} />}

      <Layout
        invitation={invitation}
        options={options}
        gallery={gallery}
        bankParts={bankParts}
        mapHref={mapHref}
        invitedGuest={invitedGuest}
        demo={Boolean(demoTemplateId)}
      />
    </main>
  )
}
