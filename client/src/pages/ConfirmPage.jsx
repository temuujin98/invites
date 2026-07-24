/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { insertDraftInvitation } from '../lib/createInvitation'
import { loadDraft } from '../templates'
import { FunnelHeader } from '../components/Shared'

/*
 * Magic-link landing page only: when the emailed link brings the user
 * back with a session, the draft is saved and they continue to payment.
 * No UI decisions happen here.
 */
export default function ConfirmPage() {
  const [status, setStatus] = useState('waiting') // waiting | saving | failed | no-draft
  const inserting = useRef(false)

  useEffect(() => {
    if (!supabase) return undefined

    async function proceed(session) {
      if (inserting.current) return
      inserting.current = true
      setStatus('saving')
      const result = await insertDraftInvitation(session)
      if (result.error === 'no-draft') { setStatus('no-draft'); inserting.current = false; return }
      if (result.error) { setStatus('failed'); inserting.current = false; return }
      window.location.href = `/pay/${result.id}`
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) proceed(data.session)
      else if (!loadDraft()) setStatus('no-draft')
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) proceed(session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <main className="kpage funnel-page">
      <FunnelHeader label="БАТАЛГААЖУУЛАЛТ" />
      <section className="kpanel-center">
        <div className="kpanel">
          {!isSupabaseConfigured ? (
            <><h1>Тохиргоо дутуу</h1><p className="kpanel-copy">.env.local дахь Supabase URL болон key-г шалгана уу.</p></>
          ) : status === 'saving' ? (
            <><p className="kpanel-kicker">ТҮР ХҮЛЭЭНЭ ҮҮ</p><h1>Урилгыг хадгалж байна…</h1></>
          ) : status === 'failed' ? (
            <><h1>Алдаа гарлаа</h1><p className="kpanel-copy">Урилга хадгалагдсангүй. <a className="klink" href="/create">Дахин оролдох →</a></p></>
          ) : status === 'no-draft' ? (
            <><h1>Ноорог олдсонгүй</h1><p className="kpanel-copy">Урилгаа эхнээс нь үүсгээрэй. <a className="klink" href="/create">Загвар сонгох →</a></p></>
          ) : (
            <>
              <p className="kpanel-kicker">ИМЭЙЛЭЭ ШАЛГААРАЙ</p>
              <h1>Холбоос дээр дарахад энд үргэлжилнэ</h1>
              <p className="kpanel-copy">Имэйл рүү тань илгээсэн холбоос дээр дарснаар урилга тань хадгалагдаж, төлбөрийн хуудас руу орно.</p>
              <p className="kpanel-note">Имэйл ирээгүй бол СПАМ хавтсаа шалгаарай.</p>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
