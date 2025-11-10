<!-- pages/noticias.vue -->
<template>
  <main class="news">
    <!-- ======= HERO ======= -->
    <section
      class="hero"
      :style="{ backgroundImage: `linear-gradient(rgba(7,20,28,.65), rgba(7,20,28,.82)), url(${heroBg})` }"
    >
      <div class="container">
        <h1 class="hero__title">NOTICIAS</h1>
    </div>
    </section>

    <!-- ======= CONTENT ======= -->
    <section class="section">
      <div class="container grid">
        <!-- ======= LISTA DE NOTAS ======= -->
        <div class="col-left">
          <article
            v-for="post in paged"
            :key="post.id"
            class="post"
          >
            <NuxtLink :to="`/noticias/${post.slug}`" class="thumb" :aria-label="post.title">
              <img :src="post.image || placeholderImg" :alt="post.title" loading="lazy" decoding="async" />
            </NuxtLink>
            <div class="post__body">
              <p class="kicker">
                {{ post.category.toUpperCase() }}
                <span class="dot">•</span>
                <time :datetime="post.date">{{ formatDate(post.date) }}</time>
              </p>
              <NuxtLink :to="`/noticias/${post.slug}`" class="title">
                {{ post.title }}
              </NuxtLink>
              <p class="excerpt">
                {{ post.excerpt }}
              </p>
              <NuxtLink :to="`/noticias/${post.slug}`" class="more">
                Leer más
              </NuxtLink>
            </div>
          </article>

          <!-- Paginación -->
          <nav class="pager" aria-label="Paginación de noticias" v-if="totalPages > 1">
            <button class="btn" :disabled="page===1" @click="page--">Anterior</button>
            <span class="sep">Página {{ page }} de {{ totalPages }}</span>
            <button class="btn" :disabled="page===totalPages" @click="page++">Siguiente</button>
          </nav>
        </div>

        <!-- ======= SIDEBAR ======= -->
        <aside class="col-right">
          <!-- Buscar -->
          <form class="widget card" @submit.prevent="applySearch">
            <label for="q" class="label">Buscar…</label>
            <div class="search">
              <input id="q" v-model="q" type="search" placeholder="Buscar" />
              <button class="btn" type="submit">Buscar</button>
            </div>
          </form>

          <!-- Entradas recientes -->
          <section class="widget card">
            <h3 class="widget__title">Entradas recientes</h3>
            <ul class="recent">
              <li v-for="p in recent" :key="p.id">
                <NuxtLink :to="`/noticias/${p.slug}`">{{ p.title }}</NuxtLink>
              </li>
            </ul>
          </section>


        </aside>
      </div>
    </section>

    <!-- ======= CTA / FOOTER STRIP OPCIONAL ======= -->
    <section class="newsletter">
      <div class="container nl">
        <div class="nl__left">
          <h4>Suscríbete a nuestro newsletter</h4>
          <p>Actualizaciones de <strong>Ingeniería Master</strong> sobre refrigeración industrial, eficiencia y proyectos.</p>
        </div>
        <form class="nl__right" @submit.prevent>
          <input type="email" placeholder="Tu correo electrónico" />
          <button class="btn">Suscribirme</button>
        </form>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

/** Hero con textura de hielo (misma línea visual) */
const heroBg =
  'https://images.unsplash.com/photo-1543966888-7c1dc482a810?q=80&w=1920&auto=format&fit=crop'

/** Placeholder para miniaturas (si una nota no trae imagen) */
const placeholderImg =
  'https://images.unsplash.com/photo-1543966888-7c1dc482a810?q=80&w=1200&auto=format&fit=crop'

type Post = {
  id: number
  slug: string
  title: string
  excerpt: string
  image?: string
  category: string
  date: string
}

const all = ref<Post[]>([])
const page = ref(1)
const perPage = 5

// Estado de filtros/búsqueda
const q = ref('')
const cat = ref<string | null>(null)

const filtered = computed(() => {
  let arr = [...all.value]
  if (cat.value) {
    arr = arr.filter(p => p.category.toLowerCase() === cat.value?.toLowerCase())
  }
  if (q.value.trim()) {
    const k = q.value.trim().toLowerCase()
    arr = arr.filter(p =>
      p.title.toLowerCase().includes(k) ||
      p.excerpt.toLowerCase().includes(k)
    )
  }
  return arr
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage)))
const paged = computed(() => {
  const start = (page.value - 1) * perPage
  return filtered.value.slice(start, start + perPage)
})

const recent = computed(() =>
  [...all.value].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 5)
)

const categories = computed(() => {
  const map = new Map<string, number>()
  for (const p of all.value) {
    map.set(p.category, (map.get(p.category) || 0) + 1)
  }
  return [...map.entries()].map(([name, count]) => ({ name, count }))
})

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
}

function applySearch() {
  page.value = 1
}

function filterByCategory(c: string) {
  cat.value = c
  page.value = 1
  // Limpia búsqueda para que prevalezca la categoría
  q.value = ''
}

async function loadPosts() {
  // --- OPCIÓN A (con API): descomenta y apunta a tu backend ---
  // const { data } = await useFetch<Post[]>('/api/news')
  // all.value = data.value ?? []

  // --- OPCIÓN B (mock local): edita/borra cuando tengas API ---
  all.value = [
    {
      id: 1,
      slug: 'factores-para-evitar-la-condensacion',
      title: 'Factores a controlar para evitar la condensación',
      excerpt:
        'La condensación en plantas de proceso es un desafío con múltiples variables: temperatura, humedad, presión y filtración. Estas son algunas de las formas de mitigarla en sistemas de refrigeración industrial.',
      category: 'Innovación',
      date: '2025-02-10',
      image: placeholderImg
    },
    {
      id: 2,
      slug: 'iq-module-cm-rc-01',
      title: 'IQ MODULE // CM-RC-01',
      excerpt:
        'Módulo de supervisión para parámetros críticos del compresor, ayudando a garantizar operación estable y trazabilidad.',
      category: 'Productos',
      date: '2025-01-28',
      image: placeholderImg
    },
    {
      id: 3,
      slug: 'proyecto-del-mes',
      title: 'Proyecto del mes',
      excerpt:
        'Conoce nuestro proyecto destacado en Ingeniería Master: arquitectura térmica optimizada y eficiencia energética.',
      category: 'Proyecto del mes',
      date: '2025-01-15',
      image: placeholderImg
    },
    {
      id: 4,
      slug: 'cuartos-frios-industria-farmaceutica',
      title: 'Cuartos fríos para la industria farmacéutica',
      excerpt:
        'Buenas prácticas de almacenamiento, cumplimiento regulatorio y control térmico confiable para productos sensibles.',
      category: 'Actualidad',
      date: '2024-12-20',
      image: placeholderImg
    },
    {
      id: 5,
      slug: 'usos-y-aplicaciones-puertas-correderas',
      title: 'Usos y aplicaciones de nuestras puertas correderas',
      excerpt:
        'Puertas correderas diseñadas para garantizar estanqueidad y durabilidad en ambientes de cadena de frío exigentes.',
      category: 'Productos',
      date: '2024-12-02',
      image: placeholderImg
    },
    {
      id: 6,
      slug: 'usos-y-aplicaciones-de-los-cuartos-frios',
      title: 'Usos y aplicaciones de los cuartos fríos',
      excerpt:
        'Claves para continuidad operativa en alimentos, farmacéutica y logística. Objetivo: mantener la cadena de frío.',
      category: 'Productos',
      date: '2024-11-21',
      image: placeholderImg
    },
    {
      id: 7,
      slug: 'proyecto-con-co2',
      title: 'Nuestro más reciente proyecto de refrigeración con CO₂',
      excerpt:
        'Sistemas con CO₂: menor GWP, alta eficiencia y menores caudales de masa. Avance sostenible en Ingeniería Master.',
      category: 'Innovación',
      date: '2024-11-07',
      image: placeholderImg
    }
  ]
}

onMounted(loadPosts)
</script>

<style scoped>
:root{
  --ink:#0f2a38;
  --ink-dim:#52707e;
  --ink-inv:#fff;
  --line:rgba(0,0,0,.08);
  --accent:#0fb1c2;
}

/* ===== Base ===== */
*{box-sizing:border-box}
html,body{margin:0;padding:0}
.news{background:#fff;color:#14313f}
.container{max-width:1160px;margin:0 auto;padding:0 1.25rem}
.section{padding:32px 0}
@media (min-width: 768px){ .section{ padding: 52px 0; } }

/* ===== Hero ===== */
.hero{
  min-height:36vh;
  display:flex;
  align-items:center;
  background-position:center;
  background-size:cover;
  padding:44px 0;
  border-bottom:1px solid #0f2a38;
}
.hero__title{
  color:var(--white);
  font-size:clamp(2rem,6vw,3rem);
  margin:0 0 6px;
  text-shadow:0 10px 40px rgba(0,0,0,.35);
}

/* ===== Grid ===== */
.grid{
  display:grid;
  grid-template-columns:1fr;
  gap:24px;
}
@media (min-width: 980px){
  .grid{ grid-template-columns: minmax(0,1fr) 320px; gap: 28px; }
}
.col-left{min-width:0}
.col-right{min-width:0}

/* ===== Post card ===== */
.post{
  display:grid;
  grid-template-columns: 160px 1fr;
  gap:16px;
  background:#fff;
  border:1px solid var(--line);
  border-radius:14px;
  padding:14px;
  margin-bottom:16px;
  box-shadow:0 10px 24px rgba(0,0,0,.06);
}
@media (min-width: 700px){
  .post{ grid-template-columns: 240px 1fr; gap:20px; padding:18px; }
}
.thumb{
  display:block;
  border-radius:12px;
  overflow:hidden;
  border:1px solid #e6eef1;
  box-shadow:0 12px 24px rgba(0,0,0,.08);
}
.thumb img{ width:100%; height:100%; display:block; object-fit:cover; }
.post__body{ display:flex; flex-direction:column; gap:8px; }
.kicker{
  font-size:.75rem;
  letter-spacing:.06em;
  text-transform:uppercase;
  color:var(--ink-dim);
  margin:0;
}
.kicker .dot{ padding:0 .4rem }
.title{
  display:inline-block;
  font-size: clamp(1rem, 2.6vw, 1.25rem);
  font-weight:700;
  color:#0e2a36;
  text-decoration:none;
}
.title:hover{ text-decoration:underline; }
.excerpt{ margin:0; color:#365564; line-height:1.55; }
.more{
  margin-top:4px;
  align-self:flex-start;
  font-weight:600;
  text-decoration:none;
  color:#0b7f8d;
}
.more:hover{ text-decoration:underline; }

/* ===== Sidebar ===== */
.card{
  background:#fff;
  border:1px solid var(--line);
  border-radius:14px;
  padding:16px;
  box-shadow:0 8px 24px rgba(0,0,0,.06);
}
.widget{ margin-bottom:16px; }
.widget__title{ margin:0 0 10px; font-size:1rem; }
.label{ display:block; font-size:.8rem; color:var(--ink-dim); margin-bottom:6px; }
.search{ display:flex; gap:8px; }
.search input{
  flex:1; height:40px; padding:0 .8rem;
  border:1px solid #d8e4ea; border-radius:10px; outline:none;
}
.btn{
  height:40px; padding:0 .9rem; border:1px solid transparent;
  background:#0b7f8d; color:#fff; border-radius:10px; cursor:pointer;
}
.btn:disabled{ opacity:.6; cursor:not-allowed }
.recent{ list-style:none; padding:0; margin:0; display:grid; gap:8px; }
.recent a{ color:#0e2a36; text-decoration:none; }
.recent a:hover{ text-decoration:underline; }
.cats{ list-style:none; padding:0; margin:0; display:grid; gap:8px; }
.link{
  width:100%; text-align:left; background:transparent; border:0; padding:0;
  color:#0e2a36; cursor:pointer; display:flex; justify-content:space-between; align-items:center;
}
.badge{
  background:#e9f6f8; color:#0b7f8d; border:1px solid #c8edf1;
  padding:2px 8px; border-radius:999px; font-size:.75rem;
}

/* ===== Pagination ===== */
.pager{
  display:flex; align-items:center; gap:10px; margin-top:18px;
}
.sep{ color:#4c6773; font-size:.9rem }

/* ===== Newsletter strip ===== */
.newsletter{
  background:#0b1e28; color:#d6e6ec; padding:28px 0;
  border-top:1px solid #0f2a38;
}
.nl{ display:grid; gap:14px; grid-template-columns:1fr; align-items:center; }
@media (min-width: 900px){ .nl{ grid-template-columns: 1fr auto; } }
.nl__left h4{ margin:0 0 4px; color:#fff }
.nl__right{ display:flex; gap:10px; }
.nl__right input{
  height:44px; width:min(360px, 70vw); padding:0 .9rem;
  border-radius:10px; border:1px solid #476273; background:#09202b; color:#e7f3f7;
}
.nl .btn{ height:44px; background:#0fb1c2; }

/* ===== Mobile fine-tuning ===== */
@media (max-width: 767.98px){
  .container{ padding-left:18px; padding-right:18px; }
  .post{ grid-template-columns: 1fr; }
}
</style>
