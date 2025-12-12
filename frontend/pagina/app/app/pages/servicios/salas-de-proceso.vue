<!-- pages/servicios/salas-de-proceso.vue -->
<template>
  <ClientOnly>
    <main class="process" v-if="dataReady">

      <!-- ===== TOGGLE MOSTRAR / EDITAR ===== -->
      <button class="toggle-mode" @click="toggleEditMode">
        {{ isEditMode ? '👁 Mostrar' : '✏️ Editar' }}
      </button>

      <!-- ===== EDITOR OVERLAY (solo edición) ===== -->
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

      <!-- ===== HERO ===== -->
      <section
        v-if="showHero"
        class="hero relative-parent"
        :style="{
          backgroundImage:
            `linear-gradient(rgba(7,20,28,.65), rgba(7,20,28,.82)), url(${resolveImage(sp.hero.bg)})`
        }"
      >
        <div v-if="isEditMode" class="hero__edit-btn">
          <label class="btn btn--small">
            📷 Cambiar Fondo
            <input type="file" hidden accept="image/*" @change="uploadHeroBg" />
          </label>
        </div>

        <div class="container">
          <p class="eyebrow">Refrigeración industrial</p>

          <h1 class="title">
            <template v-if="isEditMode">
              <input v-model="sp.hero.title" @input="markDirty" class="editable-input-title" />
            </template>
            <template v-else>
              {{ sp.hero.title }}
            </template>
          </h1>

          <div class="lead">
            <template v-if="isEditMode">
              <textarea
                v-model="sp.hero.lead"
                @input="markDirty"
                class="editable-input lead-input"
                rows="5"
              />
            </template>
            <template v-else>
              <p>{{ sp.hero.lead }}</p>
            </template>
          </div>
        </div>
      </section>

      <!-- ===== TECNOLOGÍA Y CONTROL ===== -->
      <section class="section relative-parent">
        <button v-if="isEditMode" class="edit-section-btn" @click="openEditor">⚙️ Editar Galería</button>

        <div class="container">
          <header class="section-head">
            <h2 class="section-title">
              <template v-if="isEditMode">
                <input
                  v-model="sp.intro.title"
                  @input="markDirty"
                  class="editable-input-simple center-text section-title"
                />
              </template>
              <template v-else>
                {{ sp.intro.title }}
              </template>
            </h2>

            <p class="section-sub">
              <template v-if="isEditMode">
                <input
                  v-model="sp.intro.subtitle"
                  @input="markDirty"
                  class="editable-input-simple center-text"
                />
              </template>
              <template v-else>
                {{ sp.intro.subtitle }}
              </template>
            </p>
          </header>

          <div class="carousel" role="region" aria-label="Galería de salas de proceso">
            <div class="viewport">
              <div class="track" :style="{ transform: `translateX(-${current * 100}%)` }">
                <figure v-for="(img, i) in sp.gallery" :key="i" class="slide">
                  <img :src="resolveImage(img.src)" :alt="img.alt" loading="lazy" decoding="async" />
                </figure>
              </div>
            </div>

            <button class="nav prev" @click="prev" aria-label="Anterior">
              <Icon name="mdi:arrow-left" aria-hidden="true" />
            </button>
            <button class="nav next" @click="next" aria-label="Siguiente">
              <Icon name="mdi:arrow-right" aria-hidden="true" />
            </button>

            <div class="dots" role="tablist" aria-label="Paginación de galería">
              <button
                v-for="(img, i) in sp.gallery"
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

      <!-- ===== FAQ ===== -->
      <section class="section section-faq relative-parent">
        <div class="container">
          <h2 class="section-title center">Preguntas frecuentes</h2>

          <div class="faq-grid">
            <article v-for="(f, i) in sp.faqs" :key="i" class="faq-card">
              <template v-if="isEditMode">
                <input v-model="f.q" @input="markDirty" class="editable-input-simple q" />
                <textarea v-model="f.a" @input="markDirty" class="editable-input-simple a" rows="4" />
              </template>

              <template v-else>
                <h3 class="q">{{ f.q }}</h3>
                <p class="a">{{ f.a }}</p>
              </template>
            </article>
          </div>
        </div>
      </section>

    </main>


  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, withDefaults } from 'vue'
import { useWebDataStore } from '~/stores/webData'
import Contacto from '../contacto.vue'

// Assets Default
import imgcuartosfiros from '~/assets/images/cuartos.jpg'
import imgIndustriales from '~/assets/images/industriales.jpeg'
import imgMantenimiento from '~/assets/images/mantenimiento.jpg'
import imgSalaProceso from '~/assets/images/salaProceso.jpeg'
import hero from '~/assets/images/hero.jpeg'

const store = useWebDataStore()
const dataReady = ref(false)

/** Prop para permitir ocultar el hero si se desea (por defecto TRUE) */
const props = withDefaults(defineProps<{ show_hero?: boolean }>(), { show_hero: true })
const showHero = computed(() => props.show_hero)

/** ===== MOSTRAR / EDITAR ===== */
const isEditMode = ref(false)
const toggleEditMode = () => {
  if (isEditMode.value && editor.isOpen) closeEditor()
  isEditMode.value = !isEditMode.value
}

/** ===== DATOS POR DEFECTO ===== */
const defaultData = {
  hero: {
    bg: hero,
    title: 'Salas de proceso o acondicionamiento',
    lead:
      'En el punto del proceso donde ocurre la magia y la materia prima se convierte en el valor agregado que llegará a manos de sus clientes, Sutrak aporta a su proceso no solo las condiciones de temperatura que dicta la norma sino también tecnología y control que contribuyen a la calidad de lo que pone en la vitrina o la mesa de su consumidor final.'
  },
  intro: {
    title: 'Tecnología y control de calidad',
    subtitle: 'Para garantizar su cadena de frío'
  },
  gallery: [
    { src: imgcuartosfiros, alt: 'Cuarto frío modular' },
    { src: imgMantenimiento, alt: 'Evaporadores en cámara' },
    { src: imgIndustriales, alt: 'Sala de proceso refrigerada' },
    { src: imgSalaProceso, alt: 'Puertas aisladas' }
  ],
  faqs: [
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
  ]
}

/** ===== INIT STORE ===== */
onMounted(async () => {
  // if (!store.isLoaded) await store.initData()

  if (!store.data) store.data = {}
  if (!store.data.servicios) store.data.servicios = {}
  if (!store.data.servicios.salasProceso) store.data.servicios.salasProceso = {}

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

  ensureStructure(store.data.servicios.salasProceso, defaultData)
  dataReady.value = true
})

/** ===== ALIAS ===== */
const sp = computed(() => store.data.servicios.salasProceso)

/** ===== HELPERS ===== */
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
    sp.value.hero.bg = id
    markDirty()
  }
  input.value = ''
}

/** ===== EDITOR (Galería) ===== */
const editor = reactive({
  isOpen: false,
  tempData: [] as Array<{ src: string; alt: string }>
})

const openEditor = () => {
  editor.tempData = JSON.parse(JSON.stringify(sp.value.gallery || []))
  editor.isOpen = true
}
const closeEditor = () => {
  editor.isOpen = false
  editor.tempData = []
}
const saveEditorChanges = () => {
  sp.value.gallery = JSON.parse(JSON.stringify(editor.tempData))
  markDirty()
  closeEditor()
  current.value = 0
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
  editor.tempData.push({ src: imgSalaProceso as any, alt: 'Nueva imagen' })
}
const handleGalleryImageUpload = async (e: Event, index: number) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const id = await store.uploadImage(file)
  if (id) editor.tempData[index].src = id
  input.value = ''
}

/** ===== CARRUSEL ===== */
const current = ref(0)
function next() {
  const len = (sp.value.gallery || []).length
  if (!len) return
  current.value = (current.value + 1) % len
}
function prev() {
  const len = (sp.value.gallery || []).length
  if (!len) return
  current.value = (current.value - 1 + len) % len
}
function go(i: number) {
  current.value = i
}
</script>

<style scoped>
:global(:root){
  --ink:#0f2a38;
  --ink-dim:#5e7b8c;
  --line:rgba(0,0,0,.08);
  --accent:#0fb1c2;
}
*{box-sizing:border-box}
html,body{margin:0}
.process{background:#fff;color:#173341; min-height:100vh;}

/* ===== Toggle ===== */
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

/* ===== Layout ===== */
.container{max-width:1160px;margin:0 auto;padding:0 1.25rem}
.section{padding:46px 0}
@media (min-width: 768px){ .section{ padding: 64px 0; } }

/* ===== Hero ===== */
.relative-parent{ position: relative; }
.hero{
  min-height:56vh;
  display:flex; align-items:center;
  background-position:center; background-size:cover;
  padding:56px 0; border-bottom:1px solid #0f2a38;
  position: relative;
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
.lead p{ margin:0; }

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
.dot{ width:10px; height:10px; border-radius:50%; border:0; background:#cfe3ea; cursor:pointer }
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
.q{
  margin:0 0 .4rem; color:#09222e; font-size:1.05rem; font-weight:700; text-transform:uppercase;
}
.a{ margin:0; color:#385867; line-height:1.6 }

/* ===== Editable styles ===== */
.center-text{ text-align:center; }
.editable-input-title{
  background:transparent;
  border:none;
  border-bottom:1px dashed rgba(255,255,255,.35);
  color:#fff;
  font:inherit;
  width:100%;
  text-shadow: inherit;
}
.editable-input{
  background:transparent;
  border:1px dashed rgba(255,255,255,.35);
  color:inherit;
  font:inherit;
  width:100%;
  resize:vertical;
}
.lead-input{ width:100%; }

.editable-input-simple{
  background:transparent;
  border:1px dashed rgba(0,0,0,.12);
  color:inherit;
  font:inherit;
  width:100%;
  padding:2px;
}
.editable-input-simple:focus{ outline:1px solid var(--accent); background:rgba(0,0,0,.02); }

/* Edit buttons */
.hero__edit-btn{ position:absolute; top:20px; left:20px; z-index:20; }
.edit-section-btn{
  position:absolute; top:10px; right:10px; z-index:20;
  background:#FF9800; border:none; padding:5px 10px;
  cursor:pointer; border-radius:4px; font-weight:bold;
  opacity:.6; transition: opacity .2s;
}
.edit-section-btn:hover{ opacity:1; }

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
}
@media (max-width: 767.98px){
  .carousel{ margin-left:-18px; margin-right:-18px; }
  .viewport{ border-radius:0; }
  .slide{ border-radius:0 !important; }
  .slide img{ border-radius:0 !important; }
  .track{ border-radius:0; }
}
</style>
