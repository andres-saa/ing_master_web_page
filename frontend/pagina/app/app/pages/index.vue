<template>
  <ClientOnly>
    <main class="site" v-if="dataReady && store.data?.home">
      
      <section class="hero section" :style="{ backgroundImage: `linear-gradient(rgba(7,20,28,.65), rgba(7,20,28,.75)), url(${resolveImage(store.data.home.hero.bg)})` }">
        <div class="hero__inner container">
          <div class="brand" v-reveal>
            <span class="brand__tag">{{ store.data.home.hero.tag }}</span>
          </div>
          <h1 class="hero__title" v-reveal>{{ store.data.home.hero.title }}</h1>
          <ul class="hero__chips" v-reveal>
            <li v-for="(chip, i) in store.data.home.hero.chips" :key="i" class="chip">{{ chip }}</li>
          </ul>
          <div style="display: flex;justify-content: end;" v-reveal>
            <NuxtLink to="#servicios" class="btn btn--primary" style="width:max-content;">Ver más</NuxtLink>
          </div>
        </div>
      </section>

      <section class="strip section">
        <div class="strip__grid container">
          <div v-for="item in store.data.home.strip" :key="item.label" class="strip__item" v-reveal>
            <component :is="getIconComponent(item.iconData)" class="strip__icon" />
            <span class="strip__label">{{ item.label }}</span>
          </div>
        </div>
      </section>

      <section ref="metricsSectionEl" class="metrics section">
        <div class="container center">
          <p class="eyebrow" v-reveal>{{ store.data.home.metricsInfo.eyebrow }}</p>
          <h2 class="section__title" v-reveal>{{ store.data.home.metricsInfo.title }}</h2>
          <p class="section__lead" v-reveal>{{ store.data.home.metricsInfo.lead }}</p>

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

      <section id="servicios" class="services section">
        <article v-for="(s, i) in store.data.home.services" :key="s.title || i" class="service surface" :class="{ 'service--invert': i % 2 === 1 }" v-reveal>
          <div class="service__inner container">
            <div class="service__media" v-reveal>
              <img style="aspect-ratio: 1/1;object-fit: cover;border-radius: .3rem;" :src="resolveImage(s.image)" :alt="s.title" loading="lazy" decoding="async" />
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

      <section class="brands section">
        <div class="container center">
          <h3 class="section__title" v-reveal>Marcas líderes que nos respaldan</h3>
          <div class="brands__grid">
            <img v-for="(logo, idx) in store.data.home.brands" :key="idx" :src="resolveImage(logo)" alt="Marca" v-reveal style="width: 100%;height: 100%; aspect-ratio: 1 / 1;object-fit: contain;" />
          </div>
        </div>
      </section>

      <section class="impact section">
        <div class="container">
          <h3 class="section__title center" v-reveal>Nuestro impacto</h3>
          <div class="impact__grid">
            <article v-for="f in store.data.home.features" :key="f.title" class="card" v-reveal>
              <component :is="getIconComponent(f.iconData)" class="card__icon" />
              <h4 class="card__title">{{ f.title }}</h4>
              <p class="card__text">{{ f.text }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="clients section">
        <div class="container center">
          <h3 class="section__title" v-reveal>Alcance y sectores</h3>
          <div class="clients__grid">
            <img v-for="(logo, idx) in store.data.home.clients" :key="idx" :src="resolveImage(logo)" alt="Cliente" v-reveal style="width: 100%;height: 100%; aspect-ratio: 1 / 1;object-fit: contain;" />
          </div>
        </div>
      </section>

    </main>
  </ClientOnly>
</template>

<script setup lang="ts">
import { defineComponent, h, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useWebDataStore } from '~/stores/webData'

// Fallback assets
import hero from '~/assets/images/hero.jpeg'
import imgcuartosfiros from '~/assets/images/cuartos.jpg'
import imgMantenimiento from '~/assets/images/mantenimiento.jpg'
import imgSalaProceso from '~/assets/images/salaProceso.jpeg'
import clienteLogo1 from '~/assets/images/brands/1.png'
import clienteLogo2 from '~/assets/images/brands/2.png'
import clienteLogo3 from '~/assets/images/brands/3.png'
import clienteLogo4 from '~/assets/images/brands/4.png'
import clienteLogo5 from '~/assets/images/brands/5.png'
import clienteLogo6 from '~/assets/images/brands/6.png'

const store = useWebDataStore()
const dataReady = ref(false)

// === ICONOS ===
const makeIcon = (d: string) => defineComponent({ name: 'Ic', setup: () => () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor', class: 'i' }, [h('path', { d })]) })
const getIconComponent = (d: string | undefined) => d ? makeIcon(d) : makeIcon('M12 2a10 10 0 100 20 10 10 0 000-20zm1 5v5l4 2')

// === INIT DATA ===
const defaultData = {
    hero: { bg: hero, tag: 'Ingeniería en refrigeración', title: '10 años construyendo soluciones...', chips: ['10+ años', '97% referencias', '570 proyectos'] },
    strip: [ /* Iconos default igual que en editor... */ ],
    metricsInfo: { eyebrow: 'Ingenieria Master S.A.S.', title: 'Proyectos frigoríficos de calidad', lead: 'Más de 10 años de experiencia...' },
    metrics: [ { value: 10, label: 'Años de experiencia' }, { value: '97%', label: 'de proyectos con referencias' }, { value: '570', label: 'proyectos realizados' }, { value: 25, label: 'colaboradores a su servicio' } ],
    services: [
        { category: 'Refrigeración industrial', title: 'Cuartos fríos', description: '...', image: imgcuartosfiros, href: '/servicios/cuartos-frios' },
        { category: 'Refrigeración comercial', title: 'Mantenimiento', description: '...', image: imgMantenimiento, href: '/servicios/mantenimiento' },
        { category: 'Refrigeración industrial', title: 'Salas de proceso', description: '...', image: imgSalaProceso, href: '/servicios/salas-de-proceso' }
    ],
    brands: [clienteLogo1, clienteLogo2, clienteLogo3, clienteLogo4, clienteLogo5, clienteLogo6],
    features: [
        { title: 'Eficiencia energética', text: 'Diseños optimizados.', iconData: 'M12 2a10 10 0 100 20 10 10 0 000-20zm1 5v5l4 2' },
        { title: 'Calidad certificada', text: 'Garantía y trazabilidad.', iconData: 'M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5 20l2-7L2 9h7z' },
        { title: 'Cobertura nacional', text: 'Atención en múltiples ciudades.', iconData: 'M3 11h18v2H3z M12 3v18' }
    ],
    clients: Array(6).fill(hero)
}

onMounted(() => {
    if (!store.data) store.data = {};
    if (!store.data.home) store.data.home = {};
    const current = store.data.home;
    for (const key in defaultData) {
        // @ts-ignore
        if (!current[key]) current[key] = JSON.parse(JSON.stringify(defaultData[key]));
    }
    store.data.home = { ...current };
    dataReady.value = true;

    // Sincronizar métricas inmediatamente si existen
    if(store.data.home.metrics) {
        syncMetrics(store.data.home.metrics);
    }
});

const resolveImage = (src: any) => {
    if (!src) return '';
    if (typeof src === 'string' && (src.includes('/') || src.includes('data:') || src.startsWith('http'))) return src;
    return `https://backend.salchimonster.com/read-photo-product/${src}`;
}

// === LOGICA DE ANIMACIÓN ===
const metricStates = ref<any[]>([]);
const metricsSectionEl = ref<HTMLElement | null>(null)
let metricsObserver: IntersectionObserver | null = null
let rafId: number | null = null
let animatedOnce = false

function syncMetrics(sourceMetrics: any[]) {
    // Convierte los datos del store en estado local animable
    metricStates.value = sourceMetrics.map((m: any) => {
        const strVal = String(m.value);
        const hasPercent = strVal.includes('%');
        // Extrae solo números
        const cleanVal = parseFloat(strVal.replace(/[^0-9.]/g, '')) || 0;
        return {
            label: m.label,
            target: cleanVal,
            current: 0, 
            suffix: hasPercent ? '%' : '',
            decimals: 0
        };
    });
}

function runAnimation() {
  const duration = 1500;
  const start = performance.now();
  const from = metricStates.value.map(m => m.current);
  const to = metricStates.value.map(m => m.target);

  const tick = (t: number) => {
    const elapsed = t - start;
    const progress = Math.min(1, elapsed / duration);
    const ease = 1 - Math.pow(1 - progress, 3); 

    metricStates.value.forEach((m, i) => {
      m.current = from[i] + (to[i] - from[i]) * ease;
    });

    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      metricStates.value.forEach((m, i) => (m.current = to[i]));
      rafId = null;
    }
  }
  rafId = requestAnimationFrame(tick);
}

// Watcher para cambios en tiempo real desde el Editor
watch(
  () => store.data.home?.metrics,
  (newMetrics) => {
    if (newMetrics) {
        syncMetrics(newMetrics);
        // Si la sección ya es visible, animamos el cambio suavemente
        if (animatedOnce) runAnimation();
    }
  },
  { deep: true }
);

const nf = new Intl.NumberFormat('es-CO');
const formatDisplay = (v: number, s: string, d: number) => nf.format(Number(v.toFixed(d))) + s;

// === DIRECTIVAS Y OBSERVERS ===
const vReveal = {
  mounted(el: HTMLElement) {
    el.classList.add('reveal')
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { el.classList.add('is-in'); io.unobserve(el); }
      })
    }, { threshold: 0.25 })
    io.observe(el)
  }
}

onMounted(() => {
  if (metricsSectionEl.value) {
    metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            // Bandera para saber que ya se vio la sección
            animatedOnce = true;
            // Solo animar si hay datos
            if (metricStates.value.length > 0) runAnimation();
            metricsObserver?.disconnect();
          }
        })
      }, { threshold: 0.5 }
    );
    metricsObserver.observe(metricsSectionEl.value);
  }
})

onBeforeUnmount(() => {
  metricsObserver?.disconnect();
  if (rafId) cancelAnimationFrame(rafId);
})
</script>

<style scoped>
/* ESTILOS IGUALES AL EDITOR (Solo Visualización) */
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{
  background: var(--bg) no-repeat fixed center/cover;
  color: var(--ink);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji";
}
.site{ position: relative; min-height: 100dvh; }
.site::before{ content:""; position: fixed; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(7,19,26,.75), rgba(7,19,26,.85)), url('https://elcomercio.pe/resizer/v2/6Y2EDIISGFGVFANEVDCR5LCG34.jpg?auth=f58b5c647a09717054d85bb8b9a6bc624bfcb14fe9c60b5246730ea6a513e2b0&width=1198&height=690&quality=75&smart=true') center/cover no-repeat fixed; filter: saturate(1) contrast(1.05); }
.container{ max-width: 1160px; margin: 0 auto; }
@media (max-width: 767px){ .container{ padding: 0 1rem; } }
.center{text-align:center}
.eyebrow{letter-spacing:.28em;text-transform:uppercase;font-size:.62rem;color:var(--sky-2);opacity:.9;margin:0 0 .5rem}
.section__title{font-size:1.7rem;line-height:1.25;margin:0 0 .5rem}
.section__lead{max-width:720px;margin:.5rem auto 0;color:var(--ink-dim)}
.btn{display:inline-flex;align-items:center;gap:.5rem;border-radius:999px;padding:.7rem 1.1rem;font-weight:700;border:0;cursor:pointer;text-decoration:none}
.btn--primary{background:var(--sky);color:#06202a;box-shadow:0 6px 20px rgba(103,232,249,.25)}
.btn--primary:hover{transform:translateY(-1px)}
.section{padding-block: 2rem}
.reveal{opacity:0; transform: translatex(-16px); transition: opacity .6s ease, transform .6s ease}
.reveal.is-in{opacity:1; transform: translatex(0)}
.surface{ background: rgba(7,19,26,.55); backdrop-filter: blur(6px); border: 1px solid var(--line); border-radius: 16px; }
.card{ border:1px solid var(--line); border-radius:16px; background:rgba(255,255,255,.06); padding:18px; box-shadow: 0 8px 28px rgba(0,0,0,.25); }
.card-soft{ border:1px solid var(--line); border-radius:14px; background:rgba(255,255,255,.04); padding:16px; }
.hero{ min-height:68vh; display:flex; align-items:center; background-position:center; background-size:cover; border-bottom: 1px solid var(--line); }
.hero__inner{display:flex;flex-direction:column;gap:1rem;padding-block: 24px}
.brand{display:flex;align-items:center;gap:.75rem}
.brand__tag{font-size:.72rem;letter-spacing:.25em;opacity:.95;background:rgba(255,255,255,.08);border:1px solid var(--line);padding:.35rem .6rem;border-radius:999px}
.hero__title{font-size:clamp(1.8rem, 3.4vw, 3rem);line-height:1.15;max-width:780px;margin:0;text-wrap:balance}
.hero__chips{display:flex;flex-wrap:wrap;gap:.5rem .65rem;list-style:none;margin:0;padding:0}
.chip{font-size:.78rem;padding:.4rem .65rem;border-radius:999px;background:rgba(255,255,255,.12);backdrop-filter:blur(6px);border:1px solid var(--line)}
.strip{border-block:1px solid var(--line); background: rgba(7,19,26,.5); backdrop-filter: blur(3px)}
.strip__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;justify-items:center;padding:18px 0}
.strip__item{display:flex;flex-direction:column;align-items:center;gap:8px;opacity:.95}
.strip__icon,.i{width:26px;height:26px}
.strip__label{font-size:.8rem;color:var(--ink-dim)}
.metrics__grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:22px}
.metric{padding:10px}
.metric__value{font-size:2.2rem;font-weight:800;color:var(--sky);opacity:.95}
.metric__label{font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;color:var(--ink-dim)}
.services{background: rgba(7,19,26,.45);padding: 1rem;}
.service{ border-radius:18px; overflow: clip; margin-block:20px;}
.service__inner{display:grid;grid-template-columns:1fr;gap:24px;align-items:center;padding:26px}
.service--invert .service__inner{direction:rtl}
.service--invert .service__content{direction:ltr}
.service__media img{max-width:560px;width:100%;display:block;margin:0 auto;filter:drop-shadow(0 24px 40px rgba(0,0,0,.5))}
.service__title{font-size:1.6rem;margin:.25rem 0 .5rem}
.service__text{color:var(--ink-dim);max-width:60ch}
.brands{background: rgba(7,19,26,.45)}
.brands__grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;justify-items:center;margin-top:18px}
.brands__grid img{height:44px;opacity:.9;padding: 2rem;background-color: white;border-radius: .3rem;box-shadow:0 0 1rem black}
.impact{background: rgba(7,19,26,.45)}
.impact__grid{display:grid;grid-template-columns:1fr;gap:16px}
.card__icon{width:30px;height:30px;margin-bottom:10px}
.card__title{margin:.25rem 0;font-weight:800}
.card__text{color:var(--ink-dim)}
.clients{background: rgba(7,19,26,.45)}
.clients__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;justify-items:center;margin-top:18px}
.clients__grid img{height:40px;opacity:.95; mix-blend-mode:screen}
@media (min-width: 768px){
  .strip__grid{grid-template-columns:repeat(7,1fr);gap:24px}
  .metrics__grid{grid-template-columns:repeat(4,1fr)}
  .service__inner{grid-template-columns:1fr 1fr;gap:40px;padding:34px}
  .brands__grid{grid-template-columns:repeat(5,1fr)}
  .impact__grid{grid-template-columns:repeat(4,1fr)}
  .clients__grid{grid-template-columns:repeat(6,1fr)}
}
@media (max-width: 767px){
  .card, .card-soft, .surface, .service { border: 0 !important; padding: 0 !important; box-shadow: none; background: transparent; }
  .service__inner{ padding: 0 !important; gap: 16px; }
  .metric{ padding: 0 !important; }
  .brands__grid img{ padding: .5rem !important; box-shadow: none; }
}
</style>