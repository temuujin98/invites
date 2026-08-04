import { useEffect } from 'react'

/*
 * Reveals sections as the guest scrolls: every [data-reveal] element
 * fades and rises once when it first enters view.
 *
 * IntersectionObserver + CSS rather than an animation library — this page
 * is opened on phones over mobile data, and the whole effect costs 0KB.
 *
 * `ready` holds the reveal back until the intro overlay is gone, so the
 * page is not quietly animating behind a closed curtain.
 *
 * Fail-safe by construction. The invitation IS the product, so it must
 * never be left invisible by an effect:
 *   - sections are plain visible until JS adds `reveal-armed`, so no-JS
 *     or a thrown error degrades to a static page, not a blank one;
 *   - a timer reveals anything still hidden, covering environments where
 *     the observer callback never runs (a backgrounded tab, for one).
 */
export function useReveal(ready) {
  useEffect(() => {
    if (!ready) return undefined
    const targets = [...document.querySelectorAll('[data-reveal]')]
    if (!targets.length) return undefined

    const revealAll = () => targets.forEach((element) => element.classList.add('revealed'))

    if (typeof IntersectionObserver === 'undefined'
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealAll()
      return undefined
    }

    targets.forEach((element) => element.classList.add('reveal-armed'))

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('revealed')
        observer.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 })

    targets.forEach((element) => observer.observe(element))
    const failsafe = setTimeout(revealAll, 2500)

    return () => { clearTimeout(failsafe); observer.disconnect() }
  }, [ready])
}
