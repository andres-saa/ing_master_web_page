<template>
  <ClientOnly>
    <main class="cf" v-if="dataReady && store.data.servicios?.cuartosfrios">
      <!-- ================== EDITOR MODAL (MEJORADO) ================== -->
      <Transition name="fade">
        <div
          v-if="editor.isOpen"
          class="editor-overlay"
          role="dialog"
          aria-modal="true"
          @click.self="closeEditor"
        >
          <div class="editor-modal" tabindex="-1">
            <header class="editor-header">
              <div class="editor-header__left">
                <div class="editor-badge">GALERÍA</div>
                <div class="editor-title-wrap">
                  <h3 class="editor-title">Editar galería</h3>
                  <p class="editor-subtitle">Ordena, cambia imágenes y ajusta el texto ALT.</p>
                </div>
              </div>

              <div class="editor-header__right">
                <button class="icon-btn" @click="closeEditor" aria-label="Cerrar">✕</button>
              </div>
            </header>

            <div class="editor-body">
              <div v-if="editor.tempData.length === 0" class="editor-empty">
                <p class="editor-empty__title">Aún no hay imágenes.</p>
                <p class="editor-empty__text">Agrega la primera imagen para mostrarla en la galería.</p>
                <button @click="addNewItem" class="btn btn--primary">+ Agregar nueva imagen</button>
              </div>

              <div v-else class="editor-list">
                <div v-for="(item, idx) in editor.tempData" :key="idx" class="editor-item">
                  <div class="editor-item__top">
                    <div class="editor-index">
                      <span class="editor-index__dot"></span>
                      <span>Imagen {{ idx + 1 }}</span>
                    </div>

                    <div class="editor-actions">
                      <button
                        class="chip-btn"
                        @click="moveItem(idx, -1)"
                        :disabled="idx === 0"
                        title="Mover arriba"
                      >
                        ↑
                      </button>
                      <button
                        class="chip-btn"
                        @click="moveItem(idx, 1)"
                        :disabled="idx === editor.tempData.length - 1"
                        title="Mover abajo"
                      >
                        ↓
                      </button>
                      <button
                        class="chip-btn chip-btn--danger"
                        @click="deleteItem(idx)"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div class="editor-item__content">
                    <div class="img-preview-box">
                      <img :src="resolveImage(item.src)" class="img-preview" :alt="item.alt || `Imagen ${idx+1}`" />
                      <label class="btn btn--soft btn--small full-width">
                        Cambiar imagen
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          @change="(e) => handleGalleryImageUpload(e, idx)"
                        />
                      </label>
                    </div>

                    <div class="field-group">
                      <label class="field-label">Descripción (ALT)</label>
                      <input
                        v-model="item.alt"
                        class="field-input"
                        type="text"
                        placeholder="Ej: Cuarto frío modular"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="editor-add">
                <button @click="addNewItem" class="btn btn--soft full-width">+ Agregar nueva imagen</button>
              </div>
            </div>

            <footer class="editor-footer">
              <button @click="closeEditor" class="btn btn--ghost">Cancelar</button>
              <button @click="saveEditorChanges" class="btn btn--primary">Guardar cambios</button>
            </footer>
          </div>
        </div>
      </Transition>

      <!-- ================== HERO ================== -->
      <section
        class="hero relative-parent"
        :style="{
          backgroundImage: `linear-gradient(rgba(9,20,28,.65), rgba(9,20,28,.82)), url(${resolveImage(
            store.data.servicios.cuartosfrios.hero.bg
          )})`
        }"
      >
        <div class="hero__edit-btn">
          <label class="btn btn--small">
            📷 Cambiar Fondo
            <input type="file" hidden @change="uploadHeroBg" />
          </label>
        </div>

        <div class="container hero__inner">
          <p class="kicker">Refrigeración industrial</p>
          <h1 class="title">
            <input
              v-model="store.data.servicios.cuartosfrios.hero.title"
              @input="markDirty"
              class="editable-input-title"
            />
          </h1>
          <textarea
            v-model="store.data.servicios.cuartosfrios.hero.lead"
            @input="markDirty"
            class="editable-input lead"
            rows="4"
          ></textarea>

          <NuxtLink to="/contacto" class="btn">Cotizar ahora</NuxtLink>
        </div>
      </section>

      <!-- ================== GALERÍA ================== -->
      <section class="section relative-parent">
        <button class="edit-section-btn" @click="openEditor">⚙️ Editar Galería</button>

        <div class="container">
          <h2 class="section__title center">Sistemas de refrigeración convencional y no convencional</h2>
          <p class="eyebrow center">Cumplen con los estándares nacionales e internacionales (FDA)</p>

          <div class="carousel">
            <button class="nav prev" @click="scrollPrev" aria-label="Anterior">
              <Icon name="mdi:arrow-left" aria-hidden="true" />
            </button>

            <div ref="track" class="track" tabindex="0">
              <figure
                v-for="(img, i) in store.data.servicios.cuartosfrios.gallery"
                :key="i"
                class="item"
              >
                <img :src="resolveImage(img.src)" :alt="img.alt" loading="lazy" decoding="async" />
              </figure>
            </div>

            <button class="nav next" @click="scrollNext" aria-label="Siguiente">
              <Icon name="mdi:arrow-right" aria-hidden="true" />
            </button>
          </div>

          <div class="dots" role="tablist" aria-label="Paginación galería">
            <button
              v-for="(img, i) in store.data.servicios.cuartosfrios.gallery"
              :key="'dot-' + i"
              class="dot"
              :class="{ active: i === currentIdx }"
              @click="scrollTo(i)"
              :aria-label="`Ir a imagen ${i + 1}`"
            />
          </div>
        </div>
      </section>

      <!-- ================== FAQ ================== -->
      <section class="section relative-parent">
        <div class="container">
          <h2 class="section__title center">Preguntas frecuentes</h2>

          <div class="faq">
            <article v-for="(q, idx) in store.data.servicios.cuartosfrios.faqs" :key="idx" class="faq__item">
              <input v-model="q.q" @input="markDirty" class="editable-input-simple faq__q" />
              <textarea v-model="q.a" @input="markDirty" class="editable-input-simple faq__a" rows="3"></textarea>
            </article>
          </div>
        </div>
      </section>
    </main>
  </ClientOnly>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, onBeforeUnmount } from 'vue'
import { useWebDataStore } from '~/stores/webData'

// Assets por defecto
import imgcuartosfiros from '~/assets/images/cuartos.jpg'
import imgIndustriales from '~/assets/images/industriales.jpeg'
import imgMantenimiento from '~/assets/images/mantenimiento.jpg'
import imgSalaProceso from '~/assets/images/salaProceso.jpeg'
import hero from '~/assets/images/hero.jpeg'

const store = useWebDataStore()
const dataReady = ref(false)

// ========= DATOS POR DEFECTO =========
const defaultData = {
  hero: {
    bg: hero,
    title: 'Cuartos fríos',
    lead:
      'El corazón de nuestros proyectos es diseñado y desarrollado meticulosamente por nuestro departamento de ingeniería para que el funcionamiento de su proyecto sea totalmente adaptado a la medida de su necesidad y a lo que su proceso ya establecido requiere.'
  },
  gallery: [
    { src: imgcuartosfiros, alt: 'Cuarto frío modular' },
    { src: imgMantenimiento, alt: 'Evaporadores en cámara' },
    { src: imgIndustriales, alt: 'Sala de proceso refrigerada' },
    { src: imgSalaProceso, alt: 'Puertas aisladas' }
  ],
  faqs: [
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
}

// ========= INIT STORE =========
const onTrackScroll = () => {
  window.clearTimeout((track.value as any)?._t)
  ;(track.value as any)._t = setTimeout(syncOnScroll, 80)
}

onMounted(async () => {
  if (!store.data) store.data = {}
  if (!store.data.servicios) store.data.servicios = {}
  if (!store.data.servicios.cuartosfrios) store.data.servicios.cuartosfrios = {}

  const ensureStructure = (target: any, defaults: any) => {
    for (const key in defaults) {
      if (target[key] === undefined) target[key] = JSON.parse(JSON.stringify(defaults[key]))
      else if (typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key])) {
        ensureStructure(target[key], defaults[key])
      }
    }
  }

  ensureStructure(store.data.servicios.cuartosfrios, defaultData)
  dataReady.value = true

  // Listener del scroll (con cleanup)
  if (track.value) track.value.addEventListener('scroll', onTrackScroll)
})

onBeforeUnmount(() => {
  if (track.value) track.value.removeEventListener('scroll', onTrackScroll)
})

// ========= HELPERS =========
const markDirty = () => store.markAsDirty()

const resolveImage = (imgSource: string | undefined) => {
  if (!imgSource) return ''
  if (imgSource.startsWith('/') || imgSource.startsWith('data:') || imgSource.startsWith('http') || imgSource.includes('assets')) {
    return imgSource
  }
  return `https://backend.salchimonster.com/read-photo-product/${imgSource}`
}

const uploadHeroBg = async (e: any) => {
  const file = e.target.files?.[0]
  if (!file) return
  const id = await store.uploadImage(file)
  if (id) {
    store.data.servicios.cuartosfrios.hero.bg = id
    markDirty()
  }
}

// ========= EDITOR MODAL (Galería) =========
const editor = reactive({
  isOpen: false,
  tempData: [] as any[]
})

const openEditor = () => {
  editor.tempData = JSON.parse(JSON.stringify(store.data.servicios?.cuartosfrios?.gallery || []))
  editor.isOpen = true
}

const closeEditor = () => {
  editor.isOpen = false
  editor.tempData = []
}

const saveEditorChanges = () => {
  if (store.data.servicios?.cuartosfrios) {
    store.data.servicios.cuartosfrios.gallery = JSON.parse(JSON.stringify(editor.tempData))
    markDirty()
    closeEditor()
    currentIdx.value = 0
    scrollTo(0)
  }
}

const moveItem = (index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < editor.tempData.length) {
    const item = editor.tempData.splice(index, 1)[0]
    editor.tempData.splice(newIndex, 0, item)
  }
}

const deleteItem = (index: number) => {
  if (confirm('¿Eliminar esta imagen?')) editor.tempData.splice(index, 1)
}

const addNewItem = () => {
  editor.tempData.push({ src: imgcuartosfiros, alt: 'Nueva imagen' })
}

const handleGalleryImageUpload = async (e: any, index: number) => {
  const file = e.target.files?.[0]
  if (!file) return
  const id = await store.uploadImage(file)
  if (id) editor.tempData[index].src = id
}

// ========= CAROUSEL LOGIC =========
const track = ref<HTMLDivElement | null>(null)
const currentIdx = ref(0)

function scrollTo(i: number) {
  if (!track.value) return
  const el = track.value.children[i] as HTMLElement
  el?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  currentIdx.value = i
}

function scrollNext() {
  const len = store.data.servicios?.cuartosfrios?.gallery?.length || 0
  if (len === 0) return
  currentIdx.value = (currentIdx.value + 1) % len
  scrollTo(currentIdx.value)
}

function scrollPrev() {
  const len = store.data.servicios?.cuartosfrios?.gallery?.length || 0
  if (len === 0) return
  currentIdx.value = (currentIdx.value - 1 + len) % len
  scrollTo(currentIdx.value)
}

function syncOnScroll() {
  if (!track.value) return
  const { scrollLeft, clientWidth } = track.value
  currentIdx.value = Math.round(scrollLeft / clientWidth)
}
</script>

<style scoped>
/* ====== TRANSITIONS ====== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* ====== ESTILOS EDITABLES ====== */
.relative-parent { position: relative; }

.editable-input-title{
  background: transparent;
  border: none;
  border-bottom: 1px dashed rgba(255,255,255,0.3);
  color: white;
  font-family: inherit;
  font-size: inherit;
  text-align: inherit;
  width: 100%;
  text-shadow: inherit;
}
.editable-input-title:focus{ outline: none; background: rgba(255,255,255,0.1); }

.editable-input{
  background: transparent;
  border: 1px dashed rgba(255,255,255,0.3);
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  width: 100%;
  resize: vertical;
}

.editable-input-simple{
  background: transparent;
  border: 1px dashed rgba(0,0,0,0.1);
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  width: 100%;
  padding: 2px;
}
.editable-input-simple:focus{ outline: 1px solid var(--accent); background: rgba(0,0,0,0.02); }

.hero__edit-btn{
  position: absolute; top: 20px; left: 20px; z-index: 20;
}
.edit-section-btn{
  position: absolute; top: 10px; right: 10px; z-index: 20;
  background: #FF9800; border:none; padding: 6px 12px;
  cursor:pointer; border-radius: 999px; font-weight: 900;
  opacity: .75; transition: opacity .2s, transform .2s;
}
.edit-section-btn:hover{ opacity: 1; transform: translateY(-1px); }

/* ================== MODAL (MEJORADO) ================== */
.editor-overlay{
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px;
  background: radial-gradient(1200px 600px at 30% 10%, rgba(15,177,194,.12), rgba(0,0,0,.85));
  backdrop-filter: blur(6px);
}

.editor-modal{
  width: min(980px, 100%);
  max-height: min(88vh, 760px);
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  overflow: hidden;
  color: #fff;
  border: 1px solid rgba(255,255,255,.12);
  background: linear-gradient(180deg, rgba(20,32,46,.92), rgba(10,18,26,.92));
  box-shadow: 0 18px 60px rgba(0,0,0,.7);
}

.editor-header{
  padding: 14px;
  border-bottom: 1px solid rgba(255,255,255,.12);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.editor-header__left{
  display: flex;
  align-items: center;
  gap: 12px;
}
.editor-badge{
  font-size: .72rem;
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(15,177,194,.14);
  border: 1px solid rgba(15,177,194,.22);
}
.editor-title-wrap{ display: flex; flex-direction: column; gap: 2px; }
.editor-title{ margin: 0; font-size: 1.05rem; font-weight: 900; }
.editor-subtitle{ margin: 0; font-size: .82rem; color: rgba(255,255,255,.72); }

.icon-btn{
  width: 40px; height: 40px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.06);
  color: #fff;
  cursor: pointer;
  font-size: 1.1rem;
  display: grid;
  place-items: center;
  transition: transform .15s ease, background .15s ease, border-color .15s ease;
}
.icon-btn:hover{
  transform: translateY(-1px);
  background: rgba(255,255,255,.10);
  border-color: rgba(255,255,255,.20);
}

.editor-body{
  padding: 14px;
  overflow-y: auto;
  flex: 1;
}

.editor-empty{
  padding: 18px;
  border-radius: 16px;
  border: 1px dashed rgba(255,255,255,.16);
  background: rgba(255,255,255,.04);
}
.editor-empty__title{ margin: 0 0 6px; font-weight: 900; }
.editor-empty__text{ margin: 0 0 12px; color: rgba(255,255,255,.7); }

.editor-list{ display: flex; flex-direction: column; gap: 12px; }
.editor-item{
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(0,0,0,.22);
  padding: 12px;
}
.editor-item__top{
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.editor-index{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,.78);
  font-size: .85rem;
  font-weight: 800;
}
.editor-index__dot{
  width: 10px; height: 10px; border-radius: 999px;
  background: rgba(15,177,194,.7);
  box-shadow: 0 0 0 6px rgba(15,177,194,.12);
}
.editor-actions{ display: inline-flex; align-items: center; gap: 8px; }

.chip-btn{
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.06);
  color: #fff;
  padding: 8px 10px;
  cursor: pointer;
  font-weight: 900;
  transition: transform .15s ease, background .15s ease, border-color .15s ease, opacity .15s ease;
}
.chip-btn:hover{
  transform: translateY(-1px);
  background: rgba(255,255,255,.10);
  border-color: rgba(255,255,255,.20);
}
.chip-btn:disabled{ opacity: .35; cursor: not-allowed; transform: none; }
.chip-btn--danger{
  background: rgba(244,67,54,.14);
  border-color: rgba(244,67,54,.22);
}

.editor-item__content{
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 12px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.04);
}

.img-preview-box{
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: stretch;
}
.img-preview{
  width: 100%;
  height: 110px;
  object-fit: cover;
  border-radius: 12px;
  background: #000;
  border: 1px solid rgba(255,255,255,.12);
}
.hint{
  font-size: .78rem;
  color: rgba(255,255,255,.65);
}

.field-group{ display: flex; flex-direction: column; gap: 6px; }
.field-label{
  font-size: .78rem;
  font-weight: 800;
  letter-spacing: .06em;
  color: rgba(255,255,255,.72);
}
.field-input{
  width: 100%;
  border-radius: 12px;
  padding: 10px 10px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.06);
  color: #fff;
  outline: none;
}
.field-input:focus{
  border-color: rgba(15,177,194,.55);
  background: rgba(255,255,255,.08);
}

.editor-add{ margin-top: 12px; }

.editor-footer{
  padding: 12px 14px;
  border-top: 1px solid rgba(255,255,255,.12);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  align-items: center;
  background: rgba(0,0,0,.18);
}

/* Botones (reutilizables) */
.btn{
  display:inline-block;
  padding:.8rem 1.2rem;
  border-radius:10px;
  color:#fff;
  background:#0fb1c2;
  text-decoration:none;
  font-weight:700;
  border:none;
  cursor:pointer;
}
.btn--primary{ background: #0fb1c2; color: #032229; font-weight: 900; }
.btn--ghost{
  background: transparent;
  border: 1px solid rgba(255,255,255,.18);
  color: rgba(255,255,255,.92);
}
.btn--soft{
  background: rgba(15,177,194,.14);
  border: 1px solid rgba(15,177,194,.22);
  color: #fff;
}
.btn--small{
  font-size: .78rem;
  padding: .5rem .75rem;
  border-radius: 999px;
  background: #fff;
  color: #0e2a36;
}
.full-width{ width: 100%; }

/* Responsive modal */
@media (max-width: 720px){
  .editor-item__content{ grid-template-columns: 1fr; }
  .editor-footer{ flex-direction: column; align-items: stretch; }
  .editor-footer .btn{ width: 100%; }
}

/* ========================================= */
/* ESTILOS ORIGINALES (TU DISEÑO) */
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
.cf{background:#fff;color:#14313f; min-height: 100vh;}
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
  position: relative;
}
.hero__inner{ max-width:840px }
.kicker{
  text-transform:uppercase; letter-spacing:.28em; color:#bfe5ec; font-size:.75rem; margin:0 0 8px;
}
.title{
  color:var(--ink-inv);
  font-size:clamp(2rem,5.6vw,3.4rem);
  margin:0 0 8px; line-height:1.08;
  text-shadow:0 10px 40px rgba(0,0,0,.35);
}
.lead{ color:#e7f3f7; margin:0 0 16px; max-width:70ch }
.btn{
  display:inline-block; padding:.8rem 1.2rem; border-radius:10px; color:#fff;
  background:#0fb1c2; text-decoration:none; font-weight:700; border: none; cursor: pointer;
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
  margin:0; position:relative; height: min(56vh, 520px);
}
.item img{
  width:100%; height:100%; object-fit:cover; display:block;
}

.nav{
  position:absolute; top:50%;
  width:42px; height:42px; border-radius:50%; border:0;
  background:#0b7f8d; color:#fff; cursor:pointer;
  display:grid; place-items:center; font-size:28px;
  box-shadow:0 10px 28px rgba(0,0,0,.15); z-index: 10;
}
.nav.prev{ left:10px } .nav.next{ right:10px }
.nav:focus{ outline:2px solid #fff }

/* Dots */
.dots{ display:flex; gap:8px; justify-content:center; margin:10px 0 0 }
.dot{
  width:10px; height:10px; border-radius:50%; border:0; background:#cfe3ea; cursor:pointer
}
.dot.active{ background:#0b7f8d }

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
  background: transparent; border: none; width: 100%;
}
.faq__a{ margin:0; color:#365564; line-height:1.6; background: transparent; border: none; width: 100%; resize: vertical;}

/* ===== Mobile paddings ===== */
@media (max-width: 767.98px){
  .container{ padding-left:18px; padding-right:18px; }
  .carousel{ margin-left: -18px; margin-right: -18px; }
  .track{ border-radius: 0; }
}
</style>
