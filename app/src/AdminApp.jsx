/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import './styles.css'

const statusLabels = {
  draft: 'Ноорог',
  pending_payment: 'Төлбөр хүлээгдэж буй',
  active: 'Идэвхтэй',
  paused: 'Түр хаагдсан',
  archived: 'Архивлагдсан',
}

function formatPrice(value) {
  return `${new Intl.NumberFormat('mn-MN').format(value || 0)}₮`
}

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('mn-MN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value))
}

const ADMIN_UNLOCK_KEY = 'invites.admin.unlocked'

function SignIn({ onAuthenticated }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setBusy(false)
    if (signInError) {
      setError('Имэйл эсвэл нууц үг буруу байна.')
      return
    }
    onAuthenticated()
  }

  async function resetPassword() {
    if (!email.trim()) {
      setError('Эхлээд админ имэйл хаягаа оруулна уу.')
      return
    }
    setBusy(true)
    setError('')
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin`,
    })
    setBusy(false)
    if (resetError) setError('Нууц үг шинэчлэх имэйл илгээж чадсангүй.')
    else setResetSent(true)
  }

  return (
    <section className="auth-overlay">
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">ADMIN</p>
        <h1>Админ нэвтрэлт</h1>
        <label>Админ имэйл
          <input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@invites.mn" />
        </label>
        <label>Нууц үг
          <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
        </label>
        {resetSent && <p className="form-note">Нууц үг шинэчлэх холбоосыг {email} хаяг руу илгээлээ.</p>}
        {error && <p className="form-error">{error}</p>}
        <button className="create-button" disabled={busy}>{busy ? 'Шалгаж байна…' : 'Нэвтрэх'}</button>
        <button className="text-button auth-reset" type="button" disabled={busy} onClick={resetPassword}>Нууц үг мартсан</button>
      </form>
    </section>
  )
}

function ResetPassword({ onComplete }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    if (password.length < 8) { setError('Нууц үг хамгийн багадаа 8 тэмдэгт байна.'); return }
    if (password !== confirmPassword) { setError('Нууц үгнүүд таарахгүй байна.'); return }
    setBusy(true)
    setError('')
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (updateError) { setError('Нууц үгийг шинэчилж чадсангүй. Холбоосоо дахин авна уу.'); return }
    window.history.replaceState({}, '', '/admin')
    onComplete()
  }

  return (
    <section className="auth-overlay">
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">ADMIN</p>
        <h1>Нууц үг шинэчлэх</h1>
        <label>Шинэ нууц үг
          <input type="password" autoComplete="new-password" required minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <label>Нууц үг давтах
          <input type="password" autoComplete="new-password" required minLength="8" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="create-button" disabled={busy}>{busy ? 'Хадгалж байна…' : 'Нууц үг хадгалах'}</button>
      </form>
    </section>
  )
}

export default function AdminApp() {
  const [session, setSession] = useState(null)
  const [checked, setChecked] = useState(false)
  const [adminUnlocked, setAdminUnlocked] = useState(() => sessionStorage.getItem(ADMIN_UNLOCK_KEY) === 'true')
  const [recoveringPassword, setRecoveringPassword] = useState(false)
  const [isAdmin, setIsAdmin] = useState(null) // null = checking
  const [invitations, setInvitations] = useState([])
  const [payments, setPayments] = useState([])
  const [error, setError] = useState('')
  const [openId, setOpenId] = useState(null)
  const [rsvpDetails, setRsvpDetails] = useState({})

  useEffect(() => {
    if (!supabase) return undefined
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setChecked(true) })
    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession)
      if (event === 'PASSWORD_RECOVERY') {
        sessionStorage.removeItem(ADMIN_UNLOCK_KEY)
        setAdminUnlocked(false)
        setRecoveringPassword(true)
      }
      if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem(ADMIN_UNLOCK_KEY)
        setAdminUnlocked(false)
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) { setIsAdmin(null); return }
    supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => setIsAdmin(Boolean(data)))
  }, [session])

  async function loadAll() {
    const [invitationsResult, paymentsResult] = await Promise.all([
      supabase.from('invitations').select('*, rsvps(count)').order('created_at', { ascending: false }),
      supabase.from('payments').select('*').order('created_at', { ascending: false }),
    ])
    if (invitationsResult.error || paymentsResult.error) setError('Өгөгдөл ачаалахад алдаа гарлаа.')
    setInvitations(invitationsResult.data || [])
    setPayments(paymentsResult.data || [])
  }

  useEffect(() => { if (isAdmin) loadAll() }, [isAdmin])

  async function setStatus(invitation, status) {
    const { error: updateError } = await supabase.from('invitations').update({ status }).eq('id', invitation.id)
    if (updateError) { setError('Төлөв өөрчлөхөд алдаа гарлаа.'); return }
    setInvitations((items) => items.map((item) => item.id === invitation.id ? { ...item, status } : item))
  }

  async function toggleRsvps(invitation) {
    const next = openId === invitation.id ? null : invitation.id
    setOpenId(next)
    if (next && !rsvpDetails[invitation.id]) {
      const { data } = await supabase
        .from('rsvps')
        .select('guest_name, guest_phone, wish, response, party_size, created_at')
        .eq('invitation_id', invitation.id)
        .order('created_at', { ascending: false })
      setRsvpDetails((current) => ({ ...current, [invitation.id]: data || [] }))
    }
  }

  function downloadCsv(invitation) {
    const rows = rsvpDetails[invitation.id] || []
    const header = 'Нэр,Утас,Хариу,Хүний тоо,Мэндчилгээ,Огноо'
    const lines = rows.map((rsvp) => [
      `"${(rsvp.guest_name || 'Нэргүй').replace(/"/g, '""')}"`,
      `"${(rsvp.guest_phone || '').replace(/"/g, '""')}"`,
      rsvp.response === 'attending' ? 'Ирнэ' : 'Үгүй',
      rsvp.party_size,
      `"${(rsvp.wish || '').replace(/"/g, '""')}"`,
      formatDate(rsvp.created_at),
    ].join(','))
    const blob = new Blob(['﻿' + [header, ...lines].join('\n')], { type: 'text/csv;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `rsvp-${invitation.slug}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  async function markPaid(invitation) {
    const { error: paymentError } = await supabase.from('payments').insert({
      invitation_id: invitation.id,
      amount: invitation.price,
      method: 'mock',
      status: 'paid',
      paid_at: new Date().toISOString(),
    })
    if (paymentError) { setError('Төлбөр бүртгэхэд алдаа гарлаа.'); return }
    await setStatus(invitation, 'active')
    loadAll()
  }

  const stats = useMemo(() => {
    const revenue = payments.filter((payment) => payment.status === 'paid').reduce((total, payment) => total + payment.amount, 0)
    const active = invitations.filter((invitation) => invitation.status === 'active').length
    const pending = invitations.filter((invitation) => invitation.status === 'pending_payment').length
    const rsvpTotal = invitations.reduce((total, invitation) => total + (invitation.rsvps?.[0]?.count || 0), 0)
    return { revenue, active, pending, rsvpTotal }
  }, [invitations, payments])

  function unlockAdmin() {
    sessionStorage.setItem(ADMIN_UNLOCK_KEY, 'true')
    setAdminUnlocked(true)
  }

  async function signOut() {
    sessionStorage.removeItem(ADMIN_UNLOCK_KEY)
    setAdminUnlocked(false)
    await supabase.auth.signOut()
  }

  if (!isSupabaseConfigured) return <div className="config-error"><h1>Тохиргоо дутуу</h1><p>.env.local шалгана уу.</p></div>
  if (!checked) return <div className="config-error"><p>Ачаалж байна…</p></div>
  if (recoveringPassword) return <ResetPassword onComplete={() => { setRecoveringPassword(false); unlockAdmin() }} />
  if (!session || !adminUnlocked) return <SignIn onAuthenticated={unlockAdmin} />
  if (isAdmin === null) return <div className="config-error"><p>Эрх шалгаж байна…</p></div>
  if (!isAdmin) {
    return (
      <div className="config-error">
        <h1>Хандах эрхгүй</h1>
        <p>{session.user.email} хаяг админ жагсаалтад алга байна.</p>
        <button className="create-button" onClick={signOut}>Гарах</button>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <a className="admin-brand" href="/"><img src="/brand/invites.mn/logo-wordmark-light.png" alt="INVITES.MN" /><span>ADMIN</span></a>
        <div className="admin-user">
          <span>{session.user.email}</span>
          <button className="text-button" onClick={signOut}>Гарах</button>
        </div>
      </header>

      <main className="admin-main">
        {error && <p className="form-error">{error}</p>}

        <section className="admin-stats">
          <div className="metric"><p>ОРЛОГО</p><b>{formatPrice(stats.revenue)}</b><small>Төлөгдсөн нийт</small></div>
          <div className="metric"><p>ИДЭВХТЭЙ УРИЛГА</p><b>{stats.active}</b><small>Нийт {invitations.length}-с</small></div>
          <div className="metric"><p>ТӨЛБӨР ХҮЛЭЭГДЭЖ БУЙ</p><b>{stats.pending}</b><small>Идэвхжүүлэхэд бэлэн</small></div>
          <div className="metric"><p>НИЙТ RSVP</p><b>{stats.rsvpTotal}</b><small>Бүх урилгаас</small></div>
        </section>

        <section className="admin-section">
          <h2>Урилгууд</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Урилга</th><th>Эзэмшигч</th><th>Загвар</th><th>Үнэ</th><th>RSVP</th><th>Төлөв</th><th>Үүссэн</th><th>Үйлдэл</th></tr>
              </thead>
              <tbody>
                {invitations.map((invitation) => {
                  const details = rsvpDetails[invitation.id]
                  const attending = details?.filter((rsvp) => rsvp.response === 'attending') || []
                  const guestTotal = attending.reduce((total, rsvp) => total + rsvp.party_size, 0)
                  return [
                    <tr key={invitation.id}>
                      <td><b>{invitation.title}</b><small>/i/{invitation.slug}</small></td>
                      <td>{invitation.owner_email || '—'}</td>
                      <td>{invitation.template_id || invitation.theme}</td>
                      <td>{formatPrice(invitation.price)}</td>
                      <td>{invitation.rsvps?.[0]?.count || 0}</td>
                      <td><span className={`kbadge ${invitation.status}`}>{statusLabels[invitation.status] || invitation.status}</span></td>
                      <td>{formatDate(invitation.created_at)}</td>
                      <td className="admin-actions">
                        <button onClick={() => toggleRsvps(invitation)}>{openId === invitation.id ? 'RSVP хаах' : 'RSVP харах'}</button>
                        {invitation.status === 'pending_payment' && <button onClick={() => markPaid(invitation)}>Төлөгдсөн болгох</button>}
                        {invitation.status === 'active' && <button onClick={() => setStatus(invitation, 'paused')}>Түр хаах</button>}
                        {invitation.status === 'paused' && <button onClick={() => setStatus(invitation, 'active')}>Идэвхжүүлэх</button>}
                        {invitation.status !== 'archived' && <button onClick={() => setStatus(invitation, 'archived')}>Архивлах</button>}
                      </td>
                    </tr>,
                    openId === invitation.id && (
                      <tr key={`${invitation.id}-rsvps`} className="admin-rsvp-row">
                        <td colSpan="8">
                          {!details ? 'Ачаалж байна…' : details.length === 0 ? 'Хариу ирээгүй байна.' : (
                            <div className="admin-rsvp-panel">
                              <div className="admin-rsvp-head">
                                <b>Ирнэ: {attending.length} хариу · нийт {guestTotal} зочин</b>
                                <button onClick={() => downloadCsv(invitation)}>CSV татах</button>
                              </div>
                              {details.map((rsvp, index) => (
                                <div key={index}>
                                  <p className="admin-rsvp-line">
                                    <span className={`kbadge ${rsvp.response === 'attending' ? 'active' : 'paused'}`}>{rsvp.response === 'attending' ? 'ИРНЭ' : 'ҮГҮЙ'}</span>
                                    <b>{rsvp.guest_name || 'Нэргүй зочин'}</b>
                                    <small>{rsvp.guest_phone ? `${rsvp.guest_phone} · ` : ''}{rsvp.party_size} хүн · {formatDate(rsvp.created_at)}</small>
                                  </p>
                                  {rsvp.wish && <p className="admin-rsvp-wish">«{rsvp.wish}»</p>}
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ),
                  ]
                })}
                {invitations.length === 0 && <tr><td colSpan="8">Урилга алга байна.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-section">
          <h2>Төлбөрүүд</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Огноо</th><th>Урилга</th><th>Дүн</th><th>Хэлбэр</th><th>Төлөв</th></tr>
              </thead>
              <tbody>
                {payments.map((payment) => {
                  const invitation = invitations.find((item) => item.id === payment.invitation_id)
                  return (
                    <tr key={payment.id}>
                      <td>{formatDate(payment.paid_at || payment.created_at)}</td>
                      <td>{invitation ? invitation.title : payment.invitation_id.slice(0, 8)}</td>
                      <td>{formatPrice(payment.amount)}</td>
                      <td>{payment.method}</td>
                      <td><span className={`kbadge ${payment.status === 'paid' ? 'active' : 'pending_payment'}`}>{payment.status}</span></td>
                    </tr>
                  )
                })}
                {payments.length === 0 && <tr><td colSpan="5">Төлбөр алга байна.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
