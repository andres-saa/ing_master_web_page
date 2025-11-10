<template>
  <main class="site">
    <!-- ======= HERO ======= -->
    <section
      class="hero section"
      :style="{ backgroundImage: `linear-gradient(rgba(7,20,28,.65), rgba(7,20,28,.75)), url(${heroBg})` }"
    >
      <div class="hero__inner container">
        <div class="brand" v-reveal>
          <!-- <img src="/logo-Ingenieria Master.svg" alt="Ingenieria Master" class="brand__logo" /> -->
          <span class="brand__tag">Ingeniería en refrigeración</span>
        </div>
        <h1 class="hero__title" v-reveal>10 años construyendo soluciones de refrigeración industrial</h1>
        <ul class="hero__chips" v-reveal>
          <li class="chip">10+ años</li>
          <li class="chip">97% de proyectos con referencias</li>
          <li class="chip">570 proyectos realizados</li>
        </ul>
        <div style="display: flex;justify-content: end;" v-reveal>
          <NuxtLink to="#servicios" class="btn btn--primary" style="width:max-content;">Ver más</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ======= TIRA DE ICONOS ======= -->
    <section class="strip section">
      <div class="strip__grid container">
        <div v-for="item in iconStrip" :key="item.label" class="strip__item" v-reveal>
          <component :is="item.icon" class="strip__icon" />
          <span class="strip__label">{{ item.label }}</span>
        </div>
      </div>
    </section>

    <!-- ======= MÉTRICAS ======= -->
    <section ref="metricsSectionEl" class="metrics section">
      <div class="container center">
        <p class="eyebrow" v-reveal>Ingenieria Master S.A.S.</p>
        <h2 class="section__title" v-reveal>Proyectos frigoríficos con los más altos estándares de calidad</h2>
        <p class="section__lead" v-reveal>
          Más de 10 años de experiencia, calidad certificada y soluciones a la medida para la cadena de frío en la industria alimentaria, farmacéutica y logística.
        </p>

        <div class="metrics__grid">
          <div v-for="m in metricStates" :key="m.label" class="metric card-soft" v-reveal>
            <div class="metric__value">
              {{ formatDisplay(m.current, m.suffix, m.decimals) }}
            </div>
            <div class="metric__label">{{ m.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ======= SERVICIOS ======= -->
    <section id="servicios" class="services section">
      <article
        v-for="(s, i) in services"
        :key="s.title"
        class="service surface"
        :class="{ 'service--invert': i % 2 === 1 }"
        v-reveal
      >
        <div class="service__inner container">
          <div class="service__media" v-reveal>
            <img style="aspect-ratio: 1/1;object-fit: cover;border-radius: .3rem;" :src="s.image" :alt="s.title" loading="lazy" decoding="async" />
          </div>
          <div class="service__content" v-reveal>
            <p class="eyebrow">{{ s.category }}</p>
            <h3 class="service__title">{{ s.title }}</h3>
            <p class="service__text">{{ s.description }}</p>
            <NuxtLink :to="s.href" class="btn btn--primary" style="margin: 1rem 0;">Ver más</NuxtLink>
          </div>
        </div>
      </article>
    </section>

    <!-- ======= MARCAS ======= -->
    <section class="brands section">
      <div class="container center">
        <h3 class="section__title" v-reveal>Marcas líderes que nos respaldan</h3>
        <div class="brands__grid">
          <img
            style="width: 100%;height: 100%; aspect-ratio: 1 / 1;object-fit: contain;"
            v-for="(logo, idx) in brandLogos"
            :key="idx"
            :src="logo"
            alt="Marca"
            v-reveal
          />
        </div>
      </div>
    </section>

    <!-- ======= NUESTRO IMPACTO ======= -->
    <section class="impact section">
      <div class="container">
        <h3 class="section__title center" v-reveal>Nuestro impacto</h3>
        <div class="impact__grid">
          <article v-for="f in features" :key="f.title" class="card" v-reveal>
            <component :is="f.icon" class="card__icon" />
            <h4 class="card__title">{{ f.title }}</h4>
            <p class="card__text">{{ f.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ======= CLIENTES ======= -->
    <section class="clients section">
      <div class="container center">
        <h3 class="section__title" v-reveal>Alcance y sectores</h3>
        <div class="clients__grid">
          <img
            style="width: 100%;height: 100%; aspect-ratio: 1 / 1;object-fit: contain;"
            v-for="(logo, idx) in clientLogos"
            :key="idx"
            :src="logo"
            alt="Cliente"
            v-reveal
          />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { defineComponent, h, onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import hero from '~/assets/images/hero.jpeg'
import imgcuartosfiros from '~/assets/images/cuartos.jpg'
import imgIndustriales from '~/assets/images/industriales.jpeg'
import imgMantenimiento from '~/assets/images/mantenimiento.jpg'
import imgSalaProceso from '~/assets/images/salaProceso.jpeg'
import clienteLogo1 from '~/assets/images/brands/1.png'
import clienteLogo2 from '~/assets/images/brands/2.png'
import clienteLogo3 from '~/assets/images/brands/3.png'
import clienteLogo4 from '~/assets/images/brands/4.png'
import clienteLogo5 from '~/assets/images/brands/5.png'
import clienteLogo6 from '~/assets/images/brands/6.png'

// ========= Imagen global =========
const IMG = hero
const heroBg = IMG

// ========= Iconos inline =========
const makeIcon = (d: string) =>
  defineComponent({
    name: 'Ic',
    setup() {
      return () =>
        h(
          'svg',
          { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor', class: 'i', 'aria-hidden': 'true' },
          [h('path', { d })]
        )
    }
  })

const iconStrip = [
  { label: 'Cuartos fríos', icon: makeIcon('M12 2a1 1 0 011 1v3.382l2.121-2.121a1 1 0 111.415 1.414L13 8.707V11h2.293l3.032-3.032a1 1 0 111.414 1.415L17.414 12l2.325 2.325a1 1 0 11-1.414 1.414L15.293 13H13v2.293l2.032 2.032a1 1 0 11-1.414 1.414L13 18.618V21a1 1 0 11-2 0v-2.382l-2.121 2.121a1 1 0 11-1.415-1.414L11 15.293V13H8.707l-3.032 3.032a1 1 0 01-1.414-1.414L6.586 12 4.261 9.675a1 1 0 011.414-1.415L8.707 11H11V8.707L8.968 6.675a1 1 0 011.414-1.414L11 6.382V3a1 1 0 011-1z') },
  { label: 'Servicios', icon: makeIcon('M21.164 7.07l-3.95 3.95a3 3 0 11-4.243-4.242l3.95-3.95a5 5 0 106.243 6.243zM3 14a3 3 0 013-3h3l3 3-6 6H6a3 3 0 01-3-3v-3z') },
  { label: 'Industria', icon: makeIcon('M2 21V9l7 3V9l7 3V9l6 3v9H2zm5-4h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM7 13h2v2H7v-2zm4 0h2v2h-2v-2z') },
  { label: 'Procesos', icon: makeIcon('M12 3a9 9 0 109 9 1 1 0 10-2 0 7 7 0 11-7-7 1 1 0 000-2zm4.243 4.757a1 1 0 00-1.414 0l-3.182 3.182A2 2 0 0011 12a2 2 0 102 1.353l3.182-3.182a1 1 0 000-1.414z') },
  { label: 'Mantenimiento', icon: makeIcon('M21 7.5a4.5 4.5 0 01-7.374 3.44L6.56 18.005a2 2 0 11-2.828-2.828l7.065-7.065A4.5 4.5 0 1121 7.5z') },
  { label: 'Salas', icon: makeIcon('M11 2.06a1 1 0 011 0l8 4.62a1 1 0 010 1.73l-8 4.62a1 1 0 01-1 0l-8-4.62a1 1 0 010-1.73l8-4.62zM3.06 11.5L11 16.1a1 1 0 001 0l7.94-4.6V18a1 1 0 01-.5.866l-7.5 4.33a1 1 0 01-1 0l-7.5-4.33A1 1 0 013.06 18V11.5z') },
  { label: 'Asesorías', icon: makeIcon('M12 12a5 5 0 10-5-5 5 5 0 005 5zm-7 9a7 7 0 1114 0v1H5z') }
]

// ========= Datos de métricas =========
const metricsRaw = [
  { value: 10, label: 'Años de experiencia' },
  { value: '97%', label: 'de proyectos con referencias' },
  { value: '570', label: 'proyectos realizados' },
  { value: 25, label: 'colaboradores a su servicio' }
]

function normalizeMetric(v: number | string) {
  let suffix = ''
  let decimals = 0
  if (typeof v === 'string') {
    const hasPercent = v.trim().endsWith('%')
    if (hasPercent) {
      suffix = '%'
      v = v.trim().slice(0, -1)
      decimals = 0
    }
    const onlyDigits = v.replace(/\./g, '').replace(',', '.')
    const parsed = Number(onlyDigits)
    return { target: isNaN(parsed) ? 0 : parsed, suffix, decimals }
  }
  return { target: v, suffix: '', decimals: 0 }
}

type MetricState = {
  label: string
  target: number
  current: number
  suffix: string
  decimals: number
}

const metricStates = reactive<MetricState[]>(
  metricsRaw.map(m => {
    const n = normalizeMetric(m.value)
    return {
      label: m.label,
      target: n.target,
      current: 0,
      suffix: n.suffix,
      decimals: n.decimals
    }
  })
)

const nf = new Intl.NumberFormat('es-CO')
function formatDisplay(value: number, suffix = '', decimals = 0) {
  const rounded = decimals > 0 ? Number(value.toFixed(decimals)) : Math.round(value)
  const base = nf.format(rounded)
  return suffix ? `${base}${suffix}` : base
}

// ========= Servicios / Marcas / Clientes / Impacto =========
const services = [
  {
    category: 'Refrigeración industrial',
    title: 'Cuartos fríos',
    description: 'Diseño, fabricación e instalación de cuartos fríos a la medida para conservación, congelación y procesos especiales de la cadena de frío.',
    image: imgcuartosfiros,
    href: '/servicios/cuartos-frios'
  },
  // {
  //   category: 'Refrigeración industrial',
  //   title: 'Aplicaciones industriales',
  //   description: 'Sistemas de compresión, cámaras de proceso, túneles y líneas de producción con monitoreo y control, integrando eficiencia energética.',
  //   image: imgIndustriales,
  //   href: '/servicios/aplicaciones-industriales'
  // },
  {
    category: 'Refrigeración comercial',
    title: 'Mantenimiento',
    description: 'Planes preventivos y correctivos, auditorías de desempeño  para maximizar la disponibilidad de sus equipos.',
    image: imgMantenimiento,
    href: '/servicios/mantenimiento'
  },
  {
    category: 'Refrigeración industrial',
    title: 'Salas de proceso o acondicionamiento',
    description: 'Diseño de salas limpias y áreas de proceso con control térmico, de humedad y calidad del aire para alimentos y farmacéutica.',
    image: imgSalaProceso,
    href: '/servicios/salas-de-proceso'
  }
]

const brandLogos = [clienteLogo1,clienteLogo2,clienteLogo3,clienteLogo4,clienteLogo5,clienteLogo6]
const clientLogos = Array(6).fill(IMG)
const features = [
  { title: 'Eficiencia energética', text: 'Diseños optimizados para menor consumo y mayor vida útil.', icon: makeIcon('M12 2a10 10 0 100 20 10 10 0 000-20zm1 5v5l4 2') },
  // { title: 'Monitoreo 24/7', text: 'Telemetría y alertas para operar con tranquilidad.', icon: makeIcon('M4 4h16v16H4z M8 12h8') },
  { title: 'Calidad certificada', text: 'Componentes y procesos con garantía y trazabilidad.', icon: makeIcon('M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5 20l2-7L2 9h7z') },
  { title: 'Cobertura nacional', text: 'Atención en múltiples ciudades con equipos in-house.', icon: makeIcon('M3 11h18v2H3z M12 3v18') }
]

// ========= IntersectionObservers =========
const metricsSectionEl = ref<HTMLElement | null>(null)
let metricsObserver: IntersectionObserver | null = null
let rafId: number | null = null
let metricsAnimated = false

// 1) Directiva para REVEAL por ELEMENTO
const revealDirective = {
  mounted(el: HTMLElement) {
    // estado inicial
    el.classList.add('reveal')
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          el.classList.add('is-in')
          obs.unobserve(el)
        }
      })
    }, { threshold: 0.25 })
    io.observe(el)
  }
}

// Registro local de la directiva en <script setup>
// (con defineExpose no es necesario; Vue la expone como v-reveal)
// @ts-ignore
const vReveal = revealDirective

function animateMetrics(duration = 1200) {
  if (metricsAnimated) return
  metricsAnimated = true

  const start = performance.now()
  const from = metricStates.map(m => m.current)
  const to = metricStates.map(m => m.target)

  const tick = (t: number) => {
    const elapsed = t - start
    const p = Math.min(1, elapsed / duration)
    const e = 1 - Math.pow(1 - p, 3) // easeOutCubic

    metricStates.forEach((m, i) => {
      m.current = from[i] + (to[i] - from[i]) * e
    })

    if (p < 1) {
      rafId = requestAnimationFrame(tick)
    } else {
      metricStates.forEach((m, i) => (m.current = to[i]))
      rafId = null
    }
  }

  rafId = requestAnimationFrame(tick)
}

onMounted(() => {
  // Disparador de métricas cuando el CONTENEDOR entra
  if (metricsSectionEl.value) {
    metricsObserver = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            animateMetrics(1300)
            metricsObserver?.unobserve(e.target)
          }
        })
      },
      { threshold: 0.6 }
    )
    metricsObserver.observe(metricsSectionEl.value)
  }
})

onBeforeUnmount(() => {
  metricsObserver?.disconnect()
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
/* ====== Theme / Base ====== */
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{
  background: var(--bg) no-repeat fixed center/cover;
  color: var(--ink);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji";
}

/* Imagen global en todo el sitio */
.site{
  position: relative;
  min-height: 100dvh;
}
.site::before{
  content:"";
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(180deg, rgba(7,19,26,.75), rgba(7,19,26,.85)),
    url('https://elcomercio.pe/resizer/v2/6Y2EDIISGFGVFANEVDCR5LCG34.jpg?auth=f58b5c647a09717054d85bb8b9a6bc624bfcb14fe9c60b5246730ea6a513e2b0&width=1198&height=690&quality=75&smart=true')
    center/cover no-repeat fixed;
  filter: saturate(1) contrast(1.05);
}

/* Contenedor con respiración en móvil */
.container{
  max-width: 1160px;
  margin: 0 auto;
}
@media (max-width: 767px){
  .container{ padding: 0 1rem; }
}

/* Utilidades */
.center{text-align:center}
.eyebrow{letter-spacing:.28em;text-transform:uppercase;font-size:.62rem;color:var(--sky-2);opacity:.9;margin:0 0 .5rem}
.section__title{font-size:1.7rem;line-height:1.25;margin:0 0 .5rem}
.section__lead{max-width:720px;margin:.5rem auto 0;color:var(--ink-dim)}
.btn{display:inline-flex;align-items:center;gap:.5rem;border-radius:999px;padding:.7rem 1.1rem;font-weight:700;border:0;cursor:pointer;text-decoration:none}
.btn--primary{background:var(--sky);color:#06202a;box-shadow:0 6px 20px rgba(103,232,249,.25)}
.btn--primary:hover{transform:translateY(-1px)}
.section{padding-block: 2rem}

/* ====== REVEAL por ELEMENTO ====== */
.reveal{opacity:0; transform: translatex(-16px); transition: opacity .6s ease, transform .6s ease}
.reveal.is-in{opacity:1; transform: translatex(0)}

/* Superficies */
.surface{
  background: rgba(7,19,26,.55);
  backdrop-filter: blur(6px);
  border: 1px solid var(--line);
  border-radius: 16px;
}
.card{
  border:1px solid var(--line);
  border-radius:16px;
  background:rgba(255,255,255,.06);
  padding:18px;
  box-shadow: 0 8px 28px rgba(0,0,0,.25);
}
.card-soft{
  border:1px solid var(--line);
  border-radius:14px;
  background:rgba(255,255,255,.04);
  padding:16px;
}

/* ====== Hero ====== */
.hero{
  min-height:68vh;
  display:flex;
  align-items:center;
  background-position:center;
  background-size:cover;
  border-bottom: 1px solid var(--line);
}
.hero__inner{display:flex;flex-direction:column;gap:1rem;padding-block: 24px}
.brand{display:flex;align-items:center;gap:.75rem}
.brand__logo{height:42px}
.brand__tag{font-size:.72rem;letter-spacing:.25em;opacity:.95;background:rgba(255,255,255,.08);border:1px solid var(--line);padding:.35rem .6rem;border-radius:999px}
.hero__title{font-size:clamp(1.8rem, 3.4vw, 3rem);line-height:1.15;max-width:780px;margin:0;text-wrap:balance}
.hero__chips{display:flex;flex-wrap:wrap;gap:.5rem .65rem;list-style:none;margin:0;padding:0}
.chip{font-size:.78rem;padding:.4rem .65rem;border-radius:999px;background:rgba(255,255,255,.12);backdrop-filter:blur(6px);border:1px solid var(--line)}

/* ====== Icon strip ====== */
.strip{border-block:1px solid var(--line); background: rgba(7,19,26,.5); backdrop-filter: blur(3px)}
.strip__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;justify-items:center;padding:18px 0}
.strip__item{display:flex;flex-direction:column;align-items:center;gap:8px;opacity:.95}
.strip__icon,.i{width:26px;height:26px}
.strip__label{font-size:.8rem;color:var(--ink-dim)}

/* ====== Metrics ====== */
.metrics__grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:22px}
.metric{padding:10px}
.metric__value{font-size:2.2rem;font-weight:800;color:var(--sky);opacity:.95}
.metric__label{font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;color:var(--ink-dim)}

/* ====== Services ====== */
.services{background: rgba(7,19,26,.45);padding: 1rem;}
.service{  border-radius:18px; overflow: clip; margin-block:20px;}
.service__inner{display:grid;grid-template-columns:1fr;gap:24px;align-items:center;padding:26px}
.service--invert .service__inner{direction:rtl}
.service--invert .service__content{direction:ltr}
.service__media img{max-width:560px;width:100%;display:block;margin:0 auto;filter:drop-shadow(0 24px 40px rgba(0,0,0,.5))}
.service__title{font-size:1.6rem;margin:.25rem 0 .5rem}
.service__text{color:var(--ink-dim);max-width:60ch}

/* ====== Brands ====== */
.brands{background: rgba(7,19,26,.45)}
.brands__grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;justify-items:center;margin-top:18px}
.brands__grid img{height:44px;opacity:.9;padding: 2rem;background-color: white;border-radius: .3rem;box-shadow:0 0 1rem black}

/* ====== Impact (features) ====== */
.impact{background: rgba(7,19,26,.45)}
.impact__grid{display:grid;grid-template-columns:1fr;gap:16px}
.card__icon{width:30px;height:30px;margin-bottom:10px}
.card__title{margin:.25rem 0;font-weight:800}
.card__text{color:var(--ink-dim)}

/* ====== Clients ======= */
.clients{background: rgba(7,19,26,.45)}
.clients__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;justify-items:center;margin-top:18px}
.clients__grid img{height:40px;opacity:.95; mix-blend-mode:screen}

/* ====== Responsive ====== */
@media (min-width: 768px){
  .strip__grid{grid-template-columns:repeat(7,1fr);gap:24px}
  .metrics__grid{grid-template-columns:repeat(4,1fr)}
  .service__inner{grid-template-columns:1fr 1fr;gap:40px;padding:34px}
  .brands__grid{grid-template-columns:repeat(5,1fr)}
  .impact__grid{grid-template-columns:repeat(4,1fr)}
  .clients__grid{grid-template-columns:repeat(6,1fr)}
}

/* ====== Mobile: tarjetas sin borde ni padding ====== */
@media (max-width: 767px){
  /* Tarjetas y superficies */
  .card,
  .card-soft,
  .surface,
  .service {
    border: 0 !important;
    padding: 0 !important;
    box-shadow: none; /* opcional: quita sombra para aún más espacio visual */
    background: transparent; /* opcional */
  }

  /* Contenido interno de cada servicio */
  .service__inner{
    padding: 0 !important;
    gap: 16px;
  }

  /* Métricas: quita padding de cada ítem */
  .metric{
    padding: 0 !important;
  }

  /* (Opcional) Logos de marcas: menos padding para que luzcan más grandes */
  .brands__grid img{
    padding: .5rem !important;
    box-shadow: none;
  }
}

</style>
