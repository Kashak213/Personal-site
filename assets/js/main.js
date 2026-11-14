function toggleDarkTheme() {
  const dark = document.documentElement.classList.toggle('dark')
  try {
    localStorage.setItem('dark', dark)
  } catch (e) {}
  const meta = document.querySelector('meta[name=theme-color]')
  if (meta) {
    meta.setAttribute('content', dark ? '#0c0c0e' : '#f4f1ea')
  }
  window.dispatchEvent(new CustomEvent('themechange', { detail: { dark } }))
}

function initMyTime() {
  const myTime = document.querySelector('.my-time')
  if (!myTime) return
  const tz = myTime.dataset.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York'
  const format = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const syncTime = () => {
    const newTime = format.format(new Date())
    if (myTime.innerText !== newTime) {
      myTime.innerText = newTime
    }
  }
  syncTime()
  setInterval(syncTime, 1000)
}

function initTooltips() {
  const hideTitle = () => {
    const existing = document.querySelector('.popup-title')
    if (existing) existing.remove()
  }

  const showTitle = (title) => (event) => {
    hideTitle()
    const titleNode = document.createElement('div')
    titleNode.classList.add('popup-title')
    titleNode.innerText = title
    document.body.appendChild(titleNode)

    const targetRect = event.currentTarget.getBoundingClientRect()
    const titleNodeRect = titleNode.getBoundingClientRect()

    let top = targetRect.top + targetRect.height + 6
    let left = targetRect.left + targetRect.width / 2 - titleNodeRect.width / 2

    const maxRight = window.innerWidth - titleNodeRect.width - 10
    const maxLeft = 10
    const maxBottom = window.innerHeight - titleNodeRect.height - 10

    if (left < maxLeft) left = maxLeft
    else if (left > maxRight) left = maxRight

    if (top > maxBottom) {
      top = targetRect.top - titleNodeRect.height - 6
    }

    titleNode.style.top = `${top}px`
    titleNode.style.left = `${left}px`
  }

  const titled = document.querySelectorAll('[title]')
  for (let i = 0; i < titled.length; i++) {
    const title = titled[i].getAttribute('title')
    if (!title) continue
    titled[i].removeAttribute('title')
    titled[i].addEventListener('mouseover', showTitle(title))
    titled[i].addEventListener('mouseout', hideTitle)
  }
  document.addEventListener('scroll', hideTitle, { passive: true })
}

function initHeadingKerning() {
  const kern = {
    'Ty': -.07, 'Tw': -.05, 'Tu': -.05, 'Tr': -.05, 'To': -.07, 'Te': -.07, 'Ta': -.07,
    'T.': -.07, 'T,': -.07, 'T-': -.05,
    'Yo': -.07, 'Ye': -.07, 'Ya': -.07, 'Yu': -.05, 'Yi': -.03, 'Y.': -.08, 'Y,': -.08,
    'Wa': -.04, 'We': -.03, 'Wi': -.02, 'Wo': -.03, 'Wu': -.02, 'Wy': -.02,
    'wa': -.02, 'we': -.02, 'wo': -.02,
    'VA': -.06, 'Va': -.04, 'Ve': -.03, 'Vo': -.03, 'Vu': -.02,
    'AV': -.06, 'AW': -.04, 'AT': -.07, 'AY': -.07, 'AC': -.02,
    'LT': -.07, 'LV': -.06, 'LW': -.04, 'LY': -.07,
    'PA': -.04, 'Pa': -.03,
    'FA': -.04, 'Fa': -.02, 'Fo': -.02,
    'ry': -.02, 'r.': -.04, 'r,': -.04,
    'f.': -.03, 'f,': -.03,
    'v.': -.04, 'v,': -.04, 'va': -.02,
    'y.': -.04, 'y,': -.04,
  }

  const h1s = document.querySelectorAll('h1:not(.title-sticker)')
  for (const h1 of h1s) {
    if (/[\w\s]+/.test(h1.innerText)) {
      const chars = h1.innerText.split('')
      let html = chars
        .map((c, i) => {
          if (c === ' ') return '_'
          const ml = i > 0 && chars[i - 1] !== ' ' ? kern[chars[i - 1] + c] : undefined
          let style = `animation-delay: ${i * 0.03}s`
          if (ml) style += `; margin-left: ${ml}em`
          return `<span class="ch" style="${style}">${c}</span>`
        })
        .join('')
      html = html.split('_').map(x => `<span class="word">${x}</span>`).join(' ')
      h1.innerHTML = html
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  initMyTime()
  initTooltips()
  initHeadingKerning()

  for (const element of document.querySelectorAll('.dark-toggle')) {
    element.addEventListener('click', toggleDarkTheme)
  }

  const hamburgerToggle = document.querySelector('.hamburger-toggle')
  const navPopup = document.querySelector('.nav-popup')
  if (hamburgerToggle && navPopup) {
    hamburgerToggle.addEventListener('click', function (event) {
      event.preventDefault()
      navPopup.classList.toggle('active')
    })

    document.addEventListener('click', function (e) {
      if (
        navPopup.classList.contains('active') &&
        !navPopup.contains(e.target) &&
        !hamburgerToggle.contains(e.target)
      ) {
        navPopup.classList.remove('active')
      }
    })
  }
})
