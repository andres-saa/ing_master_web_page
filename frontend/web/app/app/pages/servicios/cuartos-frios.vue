<!-- pages/servicios/cuartos-frios.vue -->
<template>
  <main class="cf">
    <!-- ======= HERO ======= -->
    <section
      class="hero"
      :style="{ backgroundImage: `linear-gradient(rgba(9,20,28,.65), rgba(9,20,28,.82)), url(${heroBg})` }"
    >
      <div class="container hero__inner">
        <p class="kicker">Refrigeración industrial</p>
        <h1 class="title">Cuartos fríos</h1>
        <p class="lead">
          El corazón de nuestros proyectos es diseñado y desarrollado meticulosamente por nuestro
          departamento de ingeniería para que el funcionamiento de su proyecto sea totalmente
          adaptado a la medida de su necesidad y a lo que su proceso ya establecido requiere.
        </p>
        <NuxtLink to="/contacto" class="btn">Cotizar ahora</NuxtLink>
      </div>
    </section>

    <!-- ======= GALERÍA / CARRUSEL ======= -->
    <section class="section">
      <div class="container">
        <h2 class="section__title center">
          Sistemas de refrigeración convencional y no convencional
        </h2>
        <p class="eyebrow center">Cumplen con los estándares nacionales e internacionales (FDA)</p>

        <div class="carousel">
          <button class="nav prev" @click="scrollPrev" aria-label="Anterior"> <Icon name="mdi:arrow-left" aria-hidden="true" /></button>

          <div ref="track" class="track" tabindex="0">
            <figure v-for="(img, i) in gallery" :key="i" class="item">
              <img :src="img.src" :alt="img.alt" loading="lazy" decoding="async" />
            </figure>
          </div>

          <button class="nav next" @click="scrollNext" aria-label="Siguiente"> <Icon name="mdi:arrow-right" aria-hidden="true" /></button>
        </div>

        <!-- Indicadores -->
        <div class="dots" role="tablist" aria-label="Paginación galería">
          <button
            v-for="(img, i) in gallery"
            :key="'dot-'+i"
            class="dot"
            :class="{ active: i === currentIdx }"
            @click="scrollTo(i)"
            :aria-label="`Ir a imagen ${i+1}`"
          />
        </div>
      </div>
    </section>

    <!-- ======= FAQ ======= -->
    <section class="section">
      <div class="container">
        <h2 class="section__title center">Preguntas frecuentes</h2>

        <div class="faq">
          <article v-for="q in faqs" :key="q.q" class="faq__item">
            <h3 class="faq__q">{{ q.q }}</h3>
            <p class="faq__a">{{ q.a }}</p>
          </article>
        </div>
      </div>
    </section>
  </main>

  <Contacto :show_hero="false"></Contacto>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Contacto from '../contacto.vue'
import imgcuartosfiros from '~/assets/images/cuartos.jpg'
import imgIndustriales from '~/assets/images/industriales.jpeg'
import imgMantenimiento from '~/assets/images/mantenimiento.jpg'
import imgSalaProceso from '~/assets/images/salaProceso.jpeg'
import hero from '~/assets/images/hero.jpeg'

/* ====== Assets ====== */
const heroBg = hero

const gallery = [
  { src: imgcuartosfiros , alt: 'Cuarto frío modular' },
  { src:imgMantenimiento  , alt: 'Evaporadores en cámara' },
  { src:imgIndustriales , alt: 'Sala de proceso refrigerada' },
  { src: imgSalaProceso , alt: 'Puertas aisladas' },
]

/* ====== FAQ ====== */
const faqs = [
  {
    q: '¿Hay un tamaño o área mínima?',
    a: 'Más que un área mínima, hay un punto donde el volumen requerido deja de caber en un refrigerador convencional e industrial. Esto es decisión entre funciones por espacio, consumo eléctrico e inversión de adecuación. Contáctanos y revisamos cuál opción se ajusta mejor a tu proceso.'
  },
  {
    q: '¿Hay un área máxima?',
    a: 'No hay un área máxima para la construcción de un cuarto frío. Lo importante es que esté diseñado a la medida de tu proceso y de las condiciones del sitio.'
  },
  {
    q: '¿Se puede ajustar a un espacio ya construido?',
    a: 'Sí. El aislamiento térmico de panel permite fabricación modular y ajuste a casi cualquier espacio de lados rectos. Es clave concebir el cuarto desde el diseño del proyecto para alinear el flujo y el requerimiento del proceso/producto.'
  },
  {
    q: '¿Qué mantenimiento requiere?',
    a: 'El mantenimiento preventivo depende del uso y las condiciones: polvo, humedad, condensación y agentes corrosivos. Sugerimos visitas programadas para limpieza y revisión de sellos, drenajes, evaporadores y control eléctrico cada mes, y una revisión general 1 a 2 veces por año.'
  },
  {
    q: '¿Qué obras adicionales se requieren?',
    a: 'Normalmente se requiere alimentación eléctrica de potencia y control para la operación, y en la mayoría de los proyectos adecuaciones civiles (pisos, media caña, pendientes y cañuelas) según las normas del proceso.'
  }
]

/* ====== Carousel logic (sin dependencias) ====== */
const track = ref<HTMLDivElement | null>(null)
const currentIdx = ref(0)

function scrollTo(i: number) {
  if (!track.value) return
  const el = track.value.children[i] as HTMLElement
  el?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  currentIdx.value = i
}
function scrollNext() {
  currentIdx.value = (currentIdx.value + 1) % gallery.length
  scrollTo(currentIdx.value)
}
function scrollPrev() {
  currentIdx.value = (currentIdx.value - 1 + gallery.length) % gallery.length
  scrollTo(currentIdx.value)
}
function syncOnScroll() {
  if (!track.value) return
  // calcula el índice visible más cercano
  const { scrollLeft, clientWidth } = track.value
  currentIdx.value = Math.round(scrollLeft / clientWidth)
}
onMounted(() => {
  track.value?.addEventListener('scroll', () => {
    // debounce ligero
    window.clearTimeout((track.value as any)._t)
    ;(track.value as any)._t = setTimeout(syncOnScroll, 80)
  })
})
</script>

<style scoped>
:root{
  --ink:#0f2a38;
  --ink-inv:#fff;
  --ink-dim:#567584;
  --line:rgba(0,0,0,.08);
  --accent:#0fb1c2;
}

/* ===== Base ===== */
*{box-sizing:border-box}
html,body{margin:0;padding:0}
.cf{background:#fff;color:#14313f}
.container{max-width:1160px;margin:0 auto;padding:0 1.25rem}
.section{padding:34px 0}
.center{text-align:center}
@media (min-width: 768px){ .section{ padding: 52px 0; } }

/* ===== Hero ===== */
.hero{
  min-height:48vh;
  background-position:center;
  background-size:cover;
  display:flex;
  align-items:center;
  padding:52px 0;
  border-bottom:1px solid #0f2a38;
}
.hero__inner{ max-width:840px }
.kicker{
  text-transform:uppercase; letter-spacing:.28em; color:#bfe5ec; font-size:.75rem; margin:0 0 8px;
}
.title{
  color:var(--white);
  font-size:clamp(2rem,5.6vw,3.4rem);
  margin:0 0 8px; line-height:1.08;
  text-shadow:0 10px 40px rgba(0,0,0,.35);
}
.lead{ color:#e7f3f7; margin:0 0 16px; max-width:70ch }
.btn{
  display:inline-block; padding:.8rem 1.2rem; border-radius:10px; color:#fff;
  background:#0fb1c2; text-decoration:none; font-weight:700;
}

 



/* ===== Carousel ===== */
.carousel{ position:relative; margin-top:18px }
.viewport{ overflow:hidden; border-radius:14px; border:1px solid var(--line) }
/* .track{ display:flex; transition:transform .45s ease } */
.slide{ min-width:100%; line-height:0; background:#f6fafc }
.slide img{ width:100%; height:460px; object-fit:cover; display:block }
@media (max-width: 768px){ .slide img{ height:260px } }

.nav{
  position:absolute; top:50%; 
  width:42px; height:42px; border-radius:50%; border:0;
  background:#0b7f8d; color:#fff; cursor:pointer;
  display:grid; place-items:center; font-size:28px;
  box-shadow:0 10px 28px rgba(0,0,0,.15);z-index: 99;
}
.nav.prev{ left:10px } .nav.next{ right:10px }
.nav:focus{ outline:2px solid #fff }

/* Dots */
.dots{ display:flex; gap:8px; justify-content:center; margin:10px 0 0 }
.dot{
  width:10px; height:10px; border-radius:50%; border:0; background:#cfe3ea; cursor:pointer
}
.dot.active{ background:#0b7f8d }



.track{
  overflow:auto hidden;
  scroll-snap-type:x mandatory;
  display:grid;
  grid-auto-flow:column;
  grid-auto-columns:100%;
  border-radius:16px;
  border:1px solid #e6eef1;
  box-shadow:0 16px 36px rgba(0,0,0,.12);
}
.item{
  scroll-snap-align:start;
  margin:0; position:relative; height: min(56vh, 520px);
}
.item img{
  width:100%; height:100%; object-fit:cover; display:block;
}
.nav{
  height:44px; width:44px; border-radius:999px; border:1px solid #cfe7ec;
  background:#e9f6f8; color:#0b7f8d; cursor:pointer; font-size:24px; line-height:0;
}
.nav:active{ transform: translateY(1px); }

/* Dots */
.dots{ display:flex; gap:8px; justify-content:center; margin-top:12px; }
.dot{
  width:10px; height:10px; border-radius:999px; border:1px solid #a6dbe2; background:#e9f6f8; cursor:pointer;
}
.dot.active{ background:#0fb1c2; border-color:#0fb1c2 }

/* ===== Section titles ===== */
.section__title{
  font-size:clamp(1.4rem,3.8vw,2rem); line-height:1.15; margin:0 0 6px; color:#0e2a36;
}
.eyebrow{
  letter-spacing:.28em; text-transform:uppercase; font-size:.72rem; color:#7c9cab; margin:.25rem 0 1rem;
}

/* ===== FAQ ===== */
.faq{
  display:grid; gap:24px;
  grid-template-columns:1fr;
}
@media (min-width: 980px){
  .faq{ grid-template-columns:1fr 1fr; }
}
.faq__item{
  background:#fff; border:1px solid var(--line); border-radius:14px; padding:18px;
  box-shadow:0 8px 24px rgba(0,0,0,.06);
}
.faq__q{
  margin:0 0 6px; font-size:1.05rem; font-weight:800; color:#0e2a36; text-transform:uppercase;
}
.faq__a{ margin:0; color:#365564; line-height:1.6 }

/* ===== Mobile paddings ===== */
@media (max-width: 767.98px){
  .container{ padding-left:18px; padding-right:18px; }
  .carousel{ grid-template-columns: 36px 1fr 36px; }
}

@media (max-width: 767.98px){
  .carousel{
    margin-left: -18px;
    margin-right: -18px;
  }

  .viewport{
    border-radius: 0;
  }

  /* Sin bordes redondeados en las slides e imágenes */
  .slide{
    border-radius: 0 !important;
  }
  .slide img{
    border-radius: 0 !important;
  }
  .track{
    border-radius: 0;
  }
}


</style>
