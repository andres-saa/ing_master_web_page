<!-- pages/servicios/salas-de-proceso.vue -->
<template>
  <main class="process">
    <!-- ===== HERO ===== -->
    <section
      v-if="showHero"
      class="hero"
      :style="{ backgroundImage: `linear-gradient(rgba(7,20,28,.65), rgba(7,20,28,.82)), url(${heroBg})` }"
    >
      <div class="container">
        <p class="eyebrow">Refrigeración industrial</p>
        <h1 class="title">Salas de proceso o acondicionamiento</h1>
        <p class="lead">
          En el punto del proceso donde ocurre la magia y la materia prima se convierte en
          el valor agregado que llegará a manos de sus clientes, Sutrak aporta a su
          proceso no solo las condiciones de temperatura que dicta la norma sino también
          tecnología y control que contribuyen a la calidad de lo que pone en la vitrina o
          la mesa de su consumidor final.
        </p>
      </div>
    </section>

    <!-- ===== TECNOLOGÍA Y CONTROL ===== -->
    <section class="section">
      <div class="container">
        <header class="section-head">
          <h2 class="section-title">Tecnología y control de calidad</h2>
          <p class="section-sub">Para garantizar su cadena de frío</p>
        </header>

        <!-- Carrusel simple (sin dependencias) -->
        <div class="carousel" role="region" aria-label="Galería de salas de proceso">
          <div class="viewport">
            <div
              class="track"
              :style="{ transform: `translateX(-${current * 100}%)` }"
            >
              <figure v-for="(img, i) in gallery" :key="i" class="slide">
                <img :src="img.src" :alt="img.alt" loading="lazy" decoding="async" />
              </figure>
            </div>
          </div>

          <button class="nav prev" @click="prev" aria-label="Anterior"> <Icon name="mdi:arrow-left" aria-hidden="true" /></button>
          <button class="nav next" @click="next" aria-label="Siguiente"> <Icon name="mdi:arrow-right" aria-hidden="true" /></button>

          <div class="dots" role="tablist" aria-label="Paginación de galería">
            <button
              v-for="(img, i) in gallery"
              :key="'dot-' + i"
              class="dot"
              :class="{ active: i === current }"
              @click="go(i)"
              :aria-label="`Ir a imagen ${i + 1}`"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ===== PREGUNTAS FRECUENTES ===== -->
    <section class="section section-faq">
      <div class="container">
        <h2 class="section-title center">Preguntas frecuentes</h2>

        <div class="faq-grid">
          <article v-for="(f, i) in faqs" :key="i" class="faq-card">
            <h3 class="q">{{ f.q }}</h3>
            <p class="a">{{ f.a }}</p>
          </article>
        </div>
      </div>
    </section>
 
  </main>
  <Contacto :show_hero="false" />
</template>

<script setup lang="ts">
import { computed, ref, withDefaults } from 'vue'
import Contacto from '../contacto.vue';
import imgcuartosfiros from '~/assets/images/cuartos.jpg'
import imgIndustriales from '~/assets/images/industriales.jpeg'
import imgMantenimiento from '~/assets/images/mantenimiento.jpg'
import imgSalaProceso from '~/assets/images/salaProceso.jpeg'
/** Prop para permitir ocultar el hero si se desea (por defecto TRUE) */
import hero from '~/assets/images/hero.jpeg'

const props = withDefaults(
  defineProps<{ show_hero?: boolean }>(),
  { show_hero: true }
)
const showHero = computed(() => props.show_hero)

/** Imagen de fondo del hero */
const heroBg = hero
/** Galería (3 imágenes como en el diseño) */
const gallery = ref([
{ src: imgcuartosfiros , alt: 'Cuarto frío modular' },
  { src:imgMantenimiento  , alt: 'Evaporadores en cámara' },
  { src:imgIndustriales , alt: 'Sala de proceso refrigerada' },
  { src: imgSalaProceso , alt: 'Puertas aisladas' },
])

/** Carrusel mínimo */
const current = ref(0)
function next() { current.value = (current.value + 1) % gallery.value.length }
function prev() { current.value = (current.value - 1 + gallery.value.length) % gallery.value.length }
function go(i: number) { current.value = i }

/** FAQs */
const faqs = ref([
  {
    q: '¿Se puede acondicionar una sala de proceso con aire acondicionado?',
    a: 'Depende de la norma que rija su proceso. En general, lograr temperaturas inferiores a 10 °C con A/C es costoso y complejo; la mayoría de normas para procesamientos en Colombia exigen un máximo de 12 °C, especialmente en procesos cárnicos.'
  },
  {
    q: '¿En qué aporta a mi producto bajar las temperaturas en el proceso?',
    a: 'Refrigerar los procesos tiene ventajas como proteger la cadena de frío y mejorar el rendimiento. En cárnicos reduce mermas por escurrimiento y ayuda a controlar POES al disminuir la condensación en techos.'
  },
  {
    q: '¿Cuándo debo refrigerar mi proceso?',
    a: 'Todas las normas exigen conservar la cadena de frío. Cada producto debe cuidarse para que, tras la primera refrigeración, permanezca en ambientes de temperatura controlada.'
  }
])
</script>

<style scoped>
:root{
  --ink:#0f2a38;
  --ink-dim:#5e7b8c;
  --line:rgba(0,0,0,.08);
  --accent:#0fb1c2;
}
*{box-sizing:border-box}
html,body{margin:0}
.process{background:#fff;color:#173341}

/* ===== Layout ===== */
.container{max-width:1160px;margin:0 auto;padding:0 1.25rem}
.section{padding:46px 0}
@media (min-width: 768px){ .section{ padding: 64px 0; } }

/* ===== Hero ===== */
.hero{
  min-height: 56vh;
  display:flex; align-items:center;
  background-position:center; background-size:cover;
  padding:56px 0; border-bottom:1px solid #0f2a38;
}
.eyebrow{
  text-transform:uppercase; letter-spacing:.28em; color:#b8ced7; margin:0 0 .6rem;
  font-size:.78rem
}
.title{
  color:#fff; margin:.2rem 0 .8rem;
  font-size:clamp(2rem,5.6vw,3.2rem); line-height:1.05;
  text-shadow:0 14px 40px rgba(0,0,0,.35);
}
.lead{
  color:#e7f1f4; max-width:70ch; margin:0 0 .4rem; font-size:1.03rem; line-height:1.6
}

/* ===== Section Head ===== */
.section-head{ text-align:center; margin-bottom:22px }
.section-title{
  margin:0; color:#102b37; text-transform:uppercase; letter-spacing:.12em;
  font-size:clamp(1.4rem,3.5vw,1.9rem)
}
.section-sub{ margin:.25rem 0 0; color:var(--ink-dim); letter-spacing:.24em; text-transform:uppercase; font-size:.8rem }
.center{ text-align:center }

/* ===== Carousel ===== */
.carousel{ position:relative; margin-top:18px }
.viewport{ overflow:hidden; border-radius:14px; border:1px solid var(--line) }
.track{ display:flex; transition:transform .45s ease }
.slide{ min-width:100%; line-height:0; background:#f6fafc }
.slide img{ width:100%; height:460px; object-fit:cover; display:block }
@media (max-width: 768px){ .slide img{ height:260px } }

.nav{
  position:absolute; top:50%; transform:translateY(-50%);
  width:42px; height:42px; border-radius:50%; border:0;
  background:#0b7f8d; color:#fff; cursor:pointer;
  display:grid; place-items:center; font-size:28px;
  box-shadow:0 10px 28px rgba(0,0,0,.15);
}
.nav.prev{ left:10px } .nav.next{ right:10px }
.nav:focus{ outline:2px solid #fff }

/* Dots */
.dots{ display:flex; gap:8px; justify-content:center; margin:10px 0 0 }
.dot{
  width:10px; height:10px; border-radius:50%; border:0; background:#cfe3ea; cursor:pointer
}
.dot.active{ background:#0b7f8d }

/* ===== FAQ ===== */
.section-faq{ background:#f7fbfd; border-top:1px solid var(--line) }
.faq-grid{
  display:grid; gap:24px; margin-top:18px;
  grid-template-columns:1fr;
}
@media (min-width: 900px){
  .faq-grid{ grid-template-columns: repeat(3, 1fr); gap:28px }
}
.faq-card{
  background:#fff; padding:18px 18px 16px; border:1px solid var(--line); border-radius:12px;
  box-shadow:0 8px 22px rgba(0,0,0,.05);
}
.q{ margin:0 0 .4rem; color:#09222e; font-size:1.05rem; font-weight:700; text-transform:uppercase }
.a{ margin:0; color:#385867; line-height:1.6 }

/* ===== WhatsApp FAB ===== */
.wa-fab{
  position:fixed; left:14px; bottom:22vh; z-index:50;
  width:56px; height:56px; border-radius:50%;
  background:#25d366; color:#fff; display:grid; place-items:center;
  text-decoration:none; box-shadow:0 12px 28px rgba(0,0,0,.22);
}
.wa-fab svg{ width:28px; height:28px }
@media (max-width: 768px){ .wa-fab{ left:12px; bottom:18px } }

/* ===== Mobile paddings ===== */
@media (max-width: 767.98px){
  .container{ padding-left:18px; padding-right:18px; }
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
