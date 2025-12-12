<!-- pages/nosotros.vue (MODO MOSTRAR - lee del store guardado por el CMS) -->
<template>
  <ClientOnly>
    <main class="about" v-if="dataReady">
      <!-- ======= HERO ======= -->
      <section
        class="hero"
        :style="{
          backgroundImage:
            `linear-gradient(rgba(7,20,28,.65), rgba(7,20,28,.82)), url(${heroBgResolved})`
        }"
      >
        <div class="container">
          <h1 class="hero__title">{{ nosotros.hero.title || 'NOSOTROS' }}</h1>
        </div>
      </section>

      <!-- ======= VIDEO ======= -->
      <section class="section">
        <div class="container">
          <div class="video">
            <iframe
              :src="ytEmbed"
              title="Video Corporativo"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </section>

      <!-- ======= ACERCA DE NOSOTROS ======= -->
      <section class="section">
        <div class="container">
          <p class="eyebrow center">{{ nosotros.about.eyebrow }}</p>
          <h2 class="title center">{{ nosotros.about.title }}</h2>

          <div class="lead">
            <p v-for="(p, i) in nosotros.about.paragraphs" :key="i">
              {{ p.text }}
            </p>
          </div>
        </div>
      </section>

      <!-- ======= MISIÓN / VISIÓN ======= -->
      <section class="section">
        <div class="container">
          <div class="grid-2">
            <article class="card">
              <h3 class="h3 accent">{{ nosotros.cards.mission.title }}</h3>
              <p class="copy">{{ nosotros.cards.mission.text }}</p>
            </article>

            <article class="card">
              <h3 class="h3 accent">{{ nosotros.cards.vision.title }}</h3>
              <p class="copy">{{ nosotros.cards.vision.text }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- ======= CALIDAD / SEGURIDAD (IMÁGENES) ======= -->
      <section class="section">
        <div class="container">
          <div class="grid-2 grid-2--images">
            <figure class="media">
              <img :src="imgLeftResolved" alt="Imagen Izquierda" loading="lazy" decoding="async" />
            </figure>
            <figure class="media">
              <img :src="imgRightResolved" alt="Imagen Derecha" loading="lazy" decoding="async" />
            </figure>
          </div>

          <div class="grid-2 mt-20">
            <article class="card">
              <h3 class="h3 accent">{{ nosotros.qualitySecurity.cards.quality.title }}</h3>
              <p class="copy">{{ nosotros.qualitySecurity.cards.quality.text }}</p>
            </article>

            <article class="card">
              <h3 class="h3 accent">{{ nosotros.qualitySecurity.cards.security.title }}</h3>
              <p class="copy">{{ nosotros.qualitySecurity.cards.security.text }}</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useWebDataStore } from '~/stores/webData'
import heroFallback from '~/assets/images/hero.jpeg'

const store = useWebDataStore()
const dataReady = ref(false)

type NosotrosData = {
  hero: { bg: string; title: string }
  video: { id: string }
  about: { eyebrow: string; title: string; paragraphs: { text: string }[] }
  cards: {
    mission: { title: string; text: string }
    vision: { title: string; text: string }
  }
  qualitySecurity: {
    images: { left: string; right: string }
    cards: {
      quality: { title: string; text: string }
      security: { title: string; text: string }
    }
  }
}

/** Defaults (mismo shape que el CMS) */
const defaultImgLeft =
  'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1400&auto=format&fit=crop'
const defaultImgRight =
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400&auto=format&fit=crop'

const defaultNosotrosData: NosotrosData = {
  hero: { bg: heroFallback as unknown as string, title: 'NOSOTROS' },
  video: { id: 'dQw4w9WgXcQ' },
  about: {
    eyebrow: 'ACERCA DE NOSOTROS',
    title: 'SOMOS INGENIERÍA MASTER',
    paragraphs: [
      { text: 'En Ingeniería Master transformamos la ingeniería en soluciones frigoríficas de alto desempeño.' },
      { text: 'Nuestra propuesta se basa en un enfoque integral: desde la conceptualización hasta el mantenimiento.' },
      { text: 'Trabajamos con tecnología de refrigeración de punta y arquitecturas térmicas optimizadas.' }
    ]
  },
  cards: {
    mission: {
      title: 'MISIÓN',
      text: 'Diseñar, construir y mantener sistemas de refrigeración industrial que integren tecnología avanzada.'
    },
    vision: {
      title: 'VISIÓN',
      text: 'Para 2030, posicionarnos en el Top 5 de empresas de refrigeración industrial en Colombia.'
    }
  },
  qualitySecurity: {
    images: { left: defaultImgLeft, right: defaultImgRight },
    cards: {
      quality: {
        title: 'CALIDAD',
        text: 'Nuestro compromiso personal y profesional es velar por el servicio que llega a nuestros clientes.'
      },
      security: {
        title: 'SEGURIDAD',
        text: 'En Ingeniería Master estamos comprometidos con la protección y promoción de la salud.'
      }
    }
  }
}

/** Deep merge seguro para “rellenar” lo que falte sin pisar lo guardado */
function ensureStructure(target: any, defaults: any) {
  for (const key in defaults) {
    const dv = defaults[key]
    const tv = target?.[key]

    if (tv === undefined || tv === null) {
      target[key] = JSON.parse(JSON.stringify(dv))
      continue
    }

    if (typeof dv === 'object' && dv !== null && !Array.isArray(dv)) {
      if (typeof tv !== 'object' || tv === null || Array.isArray(tv)) {
        target[key] = JSON.parse(JSON.stringify(dv))
      } else {
        ensureStructure(target[key], dv)
      }
    }
  }
}

/** Resolver imagen: id del backend / url / dataUrl / ruta */
const resolveImage = (imgSource: string | null | undefined) => {
  if (!imgSource) return ''
  if (imgSource.startsWith('/') || imgSource.startsWith('data:') || imgSource.startsWith('http') || imgSource.includes('assets')) {
    return imgSource
  }
  return `https://backend.salchimonster.com/read-photo-product/${imgSource}`
}

onMounted(async () => {
  // Si tu store carga persistencia manualmente, lo intentamos sin asumir nombres.
  try {
    // @ts-ignore
    if (!store.isLoaded && typeof store.initData === 'function') await store.initData()
    // @ts-ignore
    if (!store.isLoaded && typeof store.loadFromStorage === 'function') await store.loadFromStorage()
  } catch {}

  if (!store.data) store.data = {}
  if (!store.data.nosotros) store.data.nosotros = {}

  ensureStructure(store.data.nosotros, defaultNosotrosData)
  dataReady.value = true
})

const nosotros = computed(() => store.data.nosotros as NosotrosData)

const heroBgResolved = computed(() => resolveImage(nosotros.value.hero.bg))
const imgLeftResolved = computed(() => resolveImage(nosotros.value.qualitySecurity.images.left))
const imgRightResolved = computed(() => resolveImage(nosotros.value.qualitySecurity.images.right))

const ytEmbed = computed(() => {
  const id = nosotros.value.video?.id || defaultNosotrosData.video.id
  return `https://www.youtube.com/embed/${id}?rel=0`
})
</script>

<style scoped>
:root{
  --ink: #0f2a38;
  --ink-inv: #fff;
  --ink-dim: #4a6674;
  --line: rgba(0,0,0,.08);
  --accent: #0fb1c2;
}

/* ===== Base ===== */
*{box-sizing:border-box}
html,body{margin:0;padding:0}
.about{background:#fff;color:#122b37}
.container{max-width:1160px;margin:0 auto;padding:0 1.25rem;}
.center{text-align:center}
.mt-20{margin-top:20px}

.eyebrow{
  letter-spacing:.28em;
  text-transform:uppercase;
  font-size:.68rem;
  color:#7c9cab;
  margin:.25rem 0 .5rem;
}
.title{font-size:2rem;line-height:1.2;margin:0 auto .75rem;}

/* ===== Hero ===== */
.hero{
  min-height: 38vh;
  display:flex;
  align-items:center;
  background-position:center;
  background-size:cover;
  padding: 44px 0;
  border-bottom: 1px solid #0f2a38;
}
.hero__title{
  color:#fff;
  font-size:clamp(2rem,6vw,3rem);
  text-shadow:0 10px 40px rgba(0,0,0,.35);
}

/* ===== Secciones ===== */
.section{padding: 34px 0;}
@media (min-width: 768px){ .section{ padding: 52px 0; } }

.lead{display:grid;gap:14px;color:#2a4755;max-width:86ch;margin-inline:auto;}

/* ===== Video ===== */
.video{position:relative;width:100%;aspect-ratio:16/9;border-radius:14px;overflow:hidden;box-shadow:0 12px 34px rgba(0,0,0,.18);}
.video iframe{position:absolute;inset:0;width:100%;height:100%;}

/* ===== Grid 2 ===== */
.grid-2{display:grid;grid-template-columns:1fr;gap:18px}
@media (min-width: 900px){ .grid-2{ grid-template-columns: 1fr 1fr; gap: 24px; } }

.card{
  background:#fff;
  border:1px solid var(--line);
  border-radius:14px;
  padding:18px;
  box-shadow:0 8px 24px rgba(0,0,0,.06);
}
.h3{font-size:1.25rem;margin:.25rem 0 .5rem}
.accent{color:#0b7f8d}
.copy{ color:#2a4755; line-height:1.6; }

/* ===== Imágenes ===== */
.grid-2--images .media{
  margin:0;
  border-radius:16px;
  overflow:hidden;
  box-shadow:0 16px 36px rgba(0,0,0,.16);
  border:1px solid #e6eef1;
  height: 300px;
}
.media img{
  width:100%;
  height:100%;
  display:block;
  object-fit:cover;
}

/* ===== Mobile paddings ===== */
@media (max-width: 767.98px){
  .container{ padding-left: 18px; padding-right: 18px; }
}
</style>
