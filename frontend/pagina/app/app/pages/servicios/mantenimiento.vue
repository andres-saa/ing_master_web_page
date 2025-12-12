<!-- pages/servicios/mantenimiento.vue -->
<template>
  <ClientOnly>
    <main class="mnt" v-if="dataReady">

      <!-- ======= TOGGLE MOSTRAR / EDITAR ======= -->
      <button class="toggle-mode" @click="toggleEditMode">
        {{ isEditMode ? '👁 Mostrar' : '✏️ Editar' }}
      </button>

      <!-- ======= EDITOR OVERLAY (solo en edición) ======= -->
      <div v-if="isEditMode && editor.isOpen" class="editor-overlay">
        <div class="editor-modal">
          <header>
            <h3>Editar Galería</h3>
            <button @click="closeEditor" class="btn-close">×</button>
          </header>

          <div class="editor-body">
            <div v-for="(item, idx) in editor.tempData" :key="idx" class="editor-item">
              <div class="editor-controls">
                <button @click="moveItem(idx, -1)" :disabled="idx === 0" title="Mover arriba">↑</button>
                <button
                  @click="moveItem(idx, 1)"
                  :disabled="idx === editor.tempData.length - 1"
                  title="Mover abajo"
                >
                  ↓
                </button>
                <button @click="deleteItem(idx)" class="btn-danger" title="Eliminar">🗑️</button>
              </div>

              <div class="editor-fields">
                <div class="img-preview-box">
                  <img :src="resolveImage(item.src)" class="img-preview" />
                  <label class="btn btn--small">
                    Cambiar IMG
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      @change="(e) => handleGalleryImageUpload(e, idx)"
                    />
                  </label>
                </div>

                <div class="field-group">
                  <label>Descripción (Alt):</label>
                  <input v-model="item.alt" type="text" placeholder="Descripción de la imagen" />
                </div>
              </div>
            </div>

            <button @click="addNewItem" class="btn btn--primary full-width">
              + Agregar Nueva Imagen
            </button>
          </div>

          <footer>
            <button @click="saveEditorChanges" class="btn btn--primary">Guardar Orden y Cambios</button>
          </footer>
        </div>
      </div>

      <!-- ======= HERO ======= -->
      <section
        class="hero relative-parent"
        :style="{
          backgroundImage:
            `linear-gradient(rgba(9,20,28,.68), rgba(9,20,28,.84)), url(${resolveImage(mnt.hero.bg)})`
        }"
      >
        <!-- Cambiar fondo (solo en edición) -->
        <div v-if="isEditMode" class="hero__edit-btn">
          <label class="btn btn--small">
            📷 Cambiar Fondo
            <input type="file" hidden accept="image/*" @change="uploadHeroBg" />
          </label>
        </div>

        <div class="container hero__inner">
          <p class="kicker">Refrigeración comercial</p>

          <h1 class="title">
            <input
              v-if="isEditMode"
              v-model="mnt.hero.title"
              @input="markDirty"
              class="editable-input-title"
            />
            <span v-else>{{ mnt.hero.title }}</span>
          </h1>

          <div class="lead">
            <textarea
              v-if="isEditMode"
              v-model="mnt.hero.lead"
              @input="markDirty"
              class="editable-input lead-textarea"
              rows="5"
            />
            <p v-else>
              En <strong>Ingeniería Master</strong> {{ mnt.hero.lead }}
            </p>
          </div>
        </div>
      </section>

      <!-- ======= INTRO ======= -->
      <section class="section">
        <div class="container intro">
          <textarea
            v-if="isEditMode"
            v-model="mnt.intro.text"
            @input="markDirty"
            class="editable-input intro-text"
            rows="4"
          />
          <p v-else>
            {{ mnt.intro.text }}
          </p>
        </div>
      </section>

      <!-- ======= BLOQUE TÍTULO + CARRUSEL ======= -->
      <section class="section relative-parent">
        <button v-if="isEditMode" class="edit-section-btn" @click="openEditor">⚙️ Editar Galería</button>

        <div class="container">
          <h2 class="section__title center">Mantenimiento experto en refrigeración industrial</h2>
          <p class="eyebrow center">Prevención, eficiencia y respuesta técnica inmediata</p>

          <div class="carousel">
            <button class="nav prev" @click="scrollPrev" aria-label="Anterior">
              <Icon name="mdi:arrow-left" aria-hidden="true" />
            </button>

            <div ref="track" class="track" tabindex="0">
              <figure v-for="(img, i) in mnt.gallery" :key="i" class="item">
                <img :src="resolveImage(img.src)" :alt="img.alt" loading="lazy" decoding="async" />
              </figure>
            </div>

            <button class="nav next" @click="scrollNext" aria-label="Siguiente">
              <Icon name="mdi:arrow-right" aria-hidden="true" />
            </button>
          </div>

          <div class="dots" role="tablist" aria-label="Paginación galería">
            <button
              v-for="(img, i) in mnt.gallery"
              :key="'dot-' + i"
              class="dot"
              :class="{ active: i === currentIdx }"
              @click="scrollTo(i)"
              :aria-label="`Ir a imagen ${i + 1}`"
            />
          </div>
        </div>
      </section>

      <!-- ======= FAQ ======= -->
      <section class="section">
        <div class="container">
          <p class="eyebrow">Preguntas frecuentes sobre el servicio de mantenimiento:</p>
          <h2 class="section__title">Preguntas frecuentes</h2>

          <div class="faq">
            <article v-for="(q, idx) in mnt.faqs" :key="idx" class="faq__item">
              <template v-if="isEditMode">
                <input v-model="q.q" @input="markDirty" class="editable-input-simple faq__q" />
                <textarea v-model="q.a" @input="markDirty" class="editable-input-simple faq__a" rows="3" />
              </template>

              <template v-else>
                <h3 class="faq__q">{{ q.q }}</h3>
                <p class="faq__a">{{ q.a }}</p>
              </template>
            </article>
          </div>
        </div>
      </section>
    </main>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useWebDataStore } from '~/stores/webData'

// Assets por defecto
import imgcuartosfiros from '~/assets/images/cuartos.jpg'
import imgIndustriales from '~/assets/images/industriales.jpeg'
import imgMantenimiento from '~/assets/images/mantenimiento.jpg'
import imgSalaProceso from '~/assets/images/salaProceso.jpeg'
import hero from '~/assets/images/hero.jpeg'

const store = useWebDataStore()
const dataReady = ref(false)

/** ====== MOSTRAR / EDITAR ====== */
const isEditMode = ref(false)
const toggleEditMode = () => {
  // si está abierto el editor y pasas a "mostrar", lo cerramos
  if (isEditMode.value && editor.isOpen) closeEditor()
  isEditMode.value = !isEditMode.value
}

/** ====== DATOS POR DEFECTO ====== */
const defaultData = {
  hero: {
    bg: hero,
    title: 'Mantenimiento',
    lead:
      'sabemos que la confiabilidad de cualquier sistema de refrigeración industrial depende directamente de la calidad del mantenimiento que reciba. Por eso, ponemos a su disposición un equipo de profesionales altamente calificados, comprometidos con brindar un servicio confiable, eficiente y adaptado a las necesidades específicas de su proceso.'
  },
  intro: {
    text:
      'Integramos estrategias de mantenimiento preventivo y predictivo para optimizar el rendimiento de sus equipos, reducir tiempos de inactividad y prolongar su vida útil. Además, respondemos con eficacia a través de nuestro servicio de mantenimiento correctivo, brindándole la tranquilidad de contar con un respaldo técnico oportuno y de calidad.'
  },
  gallery: [
    { src: imgcuartosfiros, alt: 'Cuarto frío modular' },
    { src: imgMantenimiento, alt: 'Evaporadores en cámara' },
    { src: imgIndustriales, alt: 'Sala de proceso refrigerada' },
    { src: imgSalaProceso, alt: 'Puertas aisladas' }
  ],
  faqs: [
    {
      q: '¿Con qué frecuencia se debe hacer mantenimiento a un sistema de refrigeración?',
      a: 'Depende de la ubicación del sistema y su exposición a contaminantes. En ambientes con polvo o humedad se recomienda mantenimiento mensual; en condiciones controladas puede realizarse cada dos meses como máximo.'
    },
    {
      q: '¿Es necesario cambiar el aceite en un sistema con freón?',
      a: 'Sí, pero no siempre. Se realiza en revisión anual o tras eventos eléctricos significativos. Se analiza el nivel de acidez y, si hay valores anormales, se cambia para garantizar un funcionamiento seguro.'
    },
    {
      q: '¿Incluyen limpieza y desinfección de serpentines y drenajes?',
      a: 'Sí. Dentro del plan preventivo se contemplan limpieza de serpentines, revisión de drenajes y desobstrucción para preservar transferencia térmica y evitar hielo o retornos de líquido.'
    },
    {
      q: '¿Qué cubre el mantenimiento eléctrico?',
      a: 'Inspección de tableros, apriete de bornes, verificación de protecciones, medición de consumos, chequeo de contactores y relés, y pruebas de seguridad para prevenir fallas.'
    },
    {
      q: '¿Ofrecen planes de mantenimiento programado?',
      a: 'Sí. Diseñamos planes a la medida con frecuencia mensual, bimestral o trimestral, con bitácoras, checklist y trazabilidad de tareas y repuestos.'
    }
  ]
}

/** ====== INIT STORE ====== */
onMounted(async () => {
  // if (!store.isLoaded) await store.initData()

  if (!store.data) store.data = {}
  if (!store.data.servicios) store.data.servicios = {}
  if (!store.data.servicios.mantenimiento) store.data.servicios.mantenimiento = {}

  const ensureStructure = (target: any, defaults: any) => {
    for (const key in defaults) {
      if (target[key] === undefined) {
        target[key] = JSON.parse(JSON.stringify(defaults[key]))
      } else if (
        typeof defaults[key] === 'object' &&
        defaults[key] !== null &&
        !Array.isArray(defaults[key])
      ) {
        ensureStructure(target[key], defaults[key])
      }
    }
  }

  ensureStructure(store.data.servicios.mantenimiento, defaultData)
  dataReady.value = true

  track.value?.addEventListener('scroll', onTrackScroll, { passive: true })
})

onBeforeUnmount(() => {
  track.value?.removeEventListener('scroll', onTrackScroll as any)
})

/** ====== SHORTCUT ====== */
const mnt = computed(() => store.data.servicios.mantenimiento)

/** ====== HELPERS ====== */
const markDirty = () => store.markAsDirty()

const resolveImage = (imgSource?: string) => {
  if (!imgSource) return ''
  if (
    imgSource.startsWith('/') ||
    imgSource.startsWith('data:') ||
    imgSource.startsWith('http') ||
    imgSource.includes('assets')
  ) {
    return imgSource
  }
  return `https://backend.salchimonster.com/read-photo-product/${imgSource}`
}

const uploadHeroBg = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const id = await store.uploadImage(file)
  if (id) {
    mnt.value.hero.bg = id
    markDirty()
  }
  input.value = ''
}

/** ====== EDITOR GALERÍA ====== */
const editor = reactive({
  isOpen: false,
  tempData: [] as Array<{ src: string; alt: string }>
})

const openEditor = () => {
  editor.tempData = JSON.parse(JSON.stringify(mnt.value.gallery || []))
  editor.isOpen = true
}
const closeEditor = () => {
  editor.isOpen = false
  editor.tempData = []
}
const saveEditorChanges = () => {
  mnt.value.gallery = JSON.parse(JSON.stringify(editor.tempData))
  markDirty()
  closeEditor()
  currentIdx.value = 0
  scrollTo(0)
}
const moveItem = (index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= editor.tempData.length) return
  const item = editor.tempData.splice(index, 1)[0]
  editor.tempData.splice(newIndex, 0, item)
}
const deleteItem = (index: number) => {
  if (confirm('¿Eliminar esta imagen?')) editor.tempData.splice(index, 1)
}
const addNewItem = () => {
  editor.tempData.push({ src: imgMantenimiento as any, alt: 'Nueva imagen' })
}
const handleGalleryImageUpload = async (e: Event, index: number) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const id = await store.uploadImage(file)
  if (id) editor.tempData[index].src = id
  input.value = ''
}

/** ====== CARRUSEL ====== */
const track = ref<HTMLDivElement | null>(null)
const currentIdx = ref(0)

function scrollTo(i: number) {
  if (!track.value) return
  const el = track.value.children[i] as HTMLElement
  el?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  currentIdx.value = i
}
function scrollNext() {
  const len = (mnt.value.gallery || []).length
  if (!len) return
  currentIdx.value = (currentIdx.value + 1) % len
  scrollTo(currentIdx.value)
}
function scrollPrev() {
  const len = (mnt.value.gallery || []).length
  if (!len) return
  currentIdx.value = (currentIdx.value - 1 + len) % len
  scrollTo(currentIdx.value)
}
function syncOnScroll() {
  if (!track.value) return
  const { scrollLeft, clientWidth } = track.value
  currentIdx.value = Math.round(scrollLeft / clientWidth)
}
function onTrackScroll() {
  if (!track.value) return
  window.clearTimeout((track.value as any)._t)
  ;(track.value as any)._t = window.setTimeout(syncOnScroll, 80)
}
</script>

<style scoped>
:global(:root){
  --ink:#0f2a38;
  --ink-inv:#fff;
  --ink-dim:#567584;
  --line:rgba(0,0,0,.08);
  --accent:#0fb1c2;
}

/* ===== Toggle button ===== */
.toggle-mode{
  position: fixed;
  right: 14px;
  bottom: 14px;
  z-index: 20000;
  border: 1px solid rgba(0,0,0,.12);
  background: #ffffff;
  color: #0e2a36;
  border-radius: 999px;
  padding: 10px 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 28px rgba(0,0,0,.12);
}
.toggle-mode:active{ transform: translateY(1px); }

/* ===== Base ===== */
*{box-sizing:border-box}
html,body{margin:0;padding:0}
.mnt{background:#fff;color:#14313f; min-height:100vh;}
.container{max-width:1160px;margin:0 auto;padding:0 1.25rem}
.section{padding:34px 0}
.center{text-align:center}
@media (min-width: 768px){ .section{ padding: 52px 0; } }

/* ===== Hero ===== */
.relative-parent{ position: relative; }
.hero{
  min-height:48vh;
  background-position:center;
  background-size:cover;
  display:flex; align-items:center;
  padding:52px 0;
  border-bottom:1px solid #0f2a38;
  position: relative;
}
.hero__inner{ max-width:880px }
.kicker{
  text-transform:uppercase; letter-spacing:.28em; color:#bfe5ec; font-size:.75rem; margin:0 0 8px;
}
.title{
  color:var(--ink-inv);
  font-size:clamp(2rem,5.6vw,3.4rem);
  margin:0 0 8px; line-height:1.08;
  text-shadow:0 10px 40px rgba(0,0,0,.35);
}
.lead{ color:#e7f3f7; margin:0 0 12px; max-width:72ch }
.lead-textarea{ width:100%; }

/* ===== Intro ===== */
.intro{ color:#375a69; max-width:80ch }

/* ===== Section titles ===== */
.section__title{
  font-size:clamp(1.4rem,3.8vw,2rem); line-height:1.15; margin:0 0 6px; color:#0e2a36;
}
.eyebrow{
  letter-spacing:.28em; text-transform:uppercase; font-size:.72rem; color:#7c9cab; margin:.25rem 0 1rem;
}

/* ===== Carousel ===== */
.carousel{ position:relative; margin-top:18px }
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
  margin:0; position:relative; height:min(56vh, 520px);
}
.item img{ width:100%; height:100%; object-fit:cover; display:block; }
.nav{
  position:absolute; top:50%;
  width:44px; height:44px; border-radius:999px; border:1px solid #cfe7ec;
  background:#e9f6f8; color:#0b7f8d; cursor:pointer; font-size:24px; line-height:0;
  box-shadow:0 10px 28px rgba(0,0,0,.15); z-index:99;
  transform: translateY(-50%);
}
.nav.prev{ left:10px } .nav.next{ right:10px }
.nav:active{ transform: translateY(calc(-50% + 1px)); }

/* Dots */
.dots{ display:flex; gap:8px; justify-content:center; margin-top:12px; }
.dot{
  width:10px; height:10px; border-radius:999px; border:1px solid #a6dbe2; background:#e9f6f8; cursor:pointer;
}
.dot.active{ background:var(--accent); border-color:var(--accent) }

/* ===== FAQ ===== */
.faq{ display:grid; gap:24px; grid-template-columns:1fr; }
@media (min-width: 980px){ .faq{ grid-template-columns:1fr 1fr; } }
.faq__item{
  background:#fff; border:1px solid var(--line); border-radius:14px; padding:18px;
  box-shadow:0 8px 24px rgba(0,0,0,.06);
}
.faq__q{
  margin:0 0 6px; font-size:1.02rem; font-weight:800; color:#0e2a36; text-transform:uppercase;
}
.faq__a{ margin:0; color:#365564; line-height:1.6 }

/* ===== Editable (solo estética) ===== */
.hero__edit-btn{
  position:absolute; top:20px; left:20px; z-index:20;
}
.edit-section-btn{
  position:absolute; top:10px; right:10px; z-index:20;
  background:#FF9800; border:none; padding:5px 10px;
  cursor:pointer; border-radius:4px; font-weight:bold;
  opacity:.6; transition: opacity .2s;
}
.edit-section-btn:hover{ opacity:1; }

.editable-input-title{
  background:transparent;
  border:none;
  border-bottom:1px dashed rgba(255,255,255,.35);
  color:#fff;
  font:inherit;
  width:100%;
}
.editable-input{
  background:transparent;
  border:1px dashed rgba(255,255,255,.35);
  color:inherit;
  font:inherit;
  width:100%;
  resize:vertical;
}
.intro-text{ border-color: rgba(0,0,0,.14); color:#14313f; }
.editable-input-simple{
  background:transparent;
  border:1px dashed rgba(0,0,0,.12);
  color:inherit;
  font:inherit;
  width:100%;
  padding:2px;
}

/* ===== Modal ===== */
.editor-overlay{
  position:fixed; inset:0; background:rgba(0,0,0,.8); z-index:10000;
  display:flex; justify-content:center; align-items:center;
}
.editor-modal{
  background:#1a2634; width:90%; max-width:600px; max-height:85vh;
  display:flex; flex-direction:column; border-radius:8px;
  box-shadow:0 10px 30px #000; color:#fff;
}
.editor-modal header{ padding:1rem; border-bottom:1px solid #333; display:flex; justify-content:space-between; }
.editor-body{ padding:1rem; overflow-y:auto; flex:1; }
.editor-item{ background:rgba(0,0,0,.2); margin-bottom:1rem; padding:10px; display:flex; gap:10px; border-radius:4px; }
.editor-controls{ display:flex; flex-direction:column; gap:5px; justify-content:center; }
.editor-controls button{ padding:5px; cursor:pointer; border:1px solid #555; background:#333; color:#fff; border-radius:4px; }
.editor-controls button:disabled{ opacity:.3; cursor:not-allowed; }
.editor-controls .btn-danger{ background:#822; border-color:#a44; }
.img-preview-box{ display:flex; flex-direction:column; gap:6px; align-items:center; width:110px; }
.img-preview{ width:90px; height:64px; object-fit:cover; background:#000; border-radius:4px; }
.editor-fields{ flex:1; display:flex; flex-direction:column; gap:8px; justify-content:center; }
.field-group label{ font-size:.75rem; color:#ccc; }
.field-group input{ background:#333; border:1px solid #444; color:#fff; padding:8px; border-radius:4px; }
.btn-close{ background:transparent; border:none; color:#fff; font-size:1.5rem; cursor:pointer; }
.btn--small{ font-size:.72rem; padding:6px 8px; background:#eee; color:#000; cursor:pointer; border-radius:6px; width:100%; }
.full-width{ width:100%; margin-top:10px; }
.btn--primary{ background:var(--accent); color:#032229; border:none; padding:10px; border-radius:6px; cursor:pointer; font-weight:700; }

/* ===== Mobile ===== */
@media (max-width: 767.98px){
  .container{ padding-left:18px; padding-right:18px; }
  .carousel{ margin-left:-18px; margin-right:-18px; }
  .track{ border-radius:0; }
}
</style>
