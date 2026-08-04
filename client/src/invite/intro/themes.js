/*
 * What the intro looks like for each template tone: the velvet colours,
 * the metal of the rod and seal, and what drifts through the air.
 *
 * Colours are handed to CSS as custom properties so the stylesheet stays
 * generic — one curtain, twelve dressings.
 */

/* fabric: [deep fold, mid, highlight] · metal: rod + seal · paper: envelope */
const themes = {
  lavender: { particle: 'petals', fabric: ['#241046', '#4c2694', '#7a4fd0'], metal: '#d9b25c', glow: '#c9a6ff', paper: ['#f6ecff', '#e3d2f7'], ink: '#5b3f8f' },
  rose: { particle: 'petals', fabric: ['#4a0f2a', '#8c2750', '#c4548a'], metal: '#e0b676', glow: '#ffb3d1', paper: ['#fff0f6', '#f6d9e6'], ink: '#8c2750' },
  coral: { particle: 'confetti', fabric: ['#63201f', '#b6423c', '#e87a63'], metal: '#ffd166', glow: '#ffb199', paper: ['#fff2ea', '#ffdccb'], ink: '#b6423c' },
  sage: { particle: 'goldDust', fabric: ['#173328', '#2f6a4c', '#5aa07a'], metal: '#d9b25c', glow: '#b9e6c8', paper: ['#f0f9f2', '#d9ecdf'], ink: '#2f6a4c' },
  gold: { particle: 'goldDust', fabric: ['#2a1f08', '#6b4f16', '#a87f2c'], metal: '#f0d9a0', glow: '#ffd98a', paper: ['#fffaf0', '#f3e6c8'], ink: '#6b4f16' },
  ocean: { particle: 'confetti', fabric: ['#0d2647', '#1f4d86', '#3f80c4'], metal: '#e0d3a8', glow: '#a8d8ff', paper: ['#f0f7ff', '#d6e8f9'], ink: '#1f4d86' },
  /* pale specks on deep blue read as a night sky, not weather */
  midnight: { particle: 'snow', fabric: ['#0f0e2c', '#26246b', '#4b47a8'], metal: '#c9cbe8', glow: '#b9c2ff', paper: ['#f2f3ff', '#dcdef5'], ink: '#26246b' },
  noir: { particle: 'embers', fabric: ['#0c0c11', '#26262f', '#43434f'], metal: '#c8a44f', glow: '#cbb4ff', paper: ['#f4f2f7', '#dcd8e3'], ink: '#26262f' },
  blossom: { particle: 'petals', fabric: ['#5a1f38', '#a34470', '#d986ac'], metal: '#e8c07d', glow: '#ffc4d8', paper: ['#fff2f7', '#f9dce8'], ink: '#a34470' },
  sky: { particle: 'bubbles', fabric: ['#153a5c', '#2f6f9e', '#63a5d4'], metal: '#e6d8b0', glow: '#bfe3ff', paper: ['#f2f9ff', '#d9ecfa'], ink: '#2f6f9e' },
  terra: { particle: 'goldDust', fabric: ['#4a2413', '#8a4a24', '#c07a45'], metal: '#e8c07d', glow: '#ffcfa3', paper: ['#fff5ea', '#f2ddc6'], ink: '#8a4a24' },
  /* a corporate invitation should whisper: slow drifting dust, nothing festive */
  forest: { particle: 'goldDust', fabric: ['#13291d', '#2b543a', '#4d8460'], metal: '#d4c795', glow: '#b6e2c5', paper: ['#f2f8f3', '#dcebe0'], ink: '#2b543a' },
}

/* Legacy host-picked curtain colours stay available as an override */
const hostColors = {
  violet: themes.lavender,
  burgundy: themes.rose,
  noir: themes.noir,
  navy: themes.ocean,
}

const fallback = themes.lavender

/*
 * `tone` comes from the template, `override` from the host's colour swatch.
 * 'auto' (the new default) means: dress the intro like the template.
 */
export function getIntroTheme(tone, override) {
  if (override && override !== 'auto' && hostColors[override]) {
    // keep the host's fabric, but let the template still choose the air
    return { ...hostColors[override], particle: (themes[tone] || fallback).particle }
  }
  return themes[tone] || fallback
}

/* Theme → the CSS custom properties the intro stylesheet reads */
export function introStyle(theme) {
  return {
    '--fab-deep': theme.fabric[0],
    '--fab-mid': theme.fabric[1],
    '--fab-light': theme.fabric[2],
    '--metal': theme.metal,
    '--glow': theme.glow,
    '--paper-a': theme.paper[0],
    '--paper-b': theme.paper[1],
    '--ink': theme.ink,
  }
}
