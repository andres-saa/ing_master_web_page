<template>
  <ClientOnly>
    <main class="process" v-if="dataReady && store.data.servicios?.salasProceso">
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
                      <img
                        :src="resolveImage(item.src)"
                        class="img-preview"
                        :alt="item.alt || `Imagen ${idx + 1}`"
                      />
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
                        placeholder="Ej: Sala de proceso refrigerada"
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
        v-if="showHero"
        class="hero relative-parent"
        :style="{
          backgroundImage: `linear-gradient(rgba(7,20,28,.65), rgba(7,20,28,.82)), url(${resolveImage(
            store.data.servicios.salasProceso.hero.bg
          )})`
        }"
      >
        <div class="hero__edit-btn">
          <label class="btn btn--small">
            📷 Cambiar Fondo
            <input type="file" hidden @change="uploadHeroBg" />
          </label>
        </div>

        <div class="container">
          <p class="eyebrow">Refrigeración industrial</p>
          <h1 class="title">
            <input
              v-model="store.data.servicios.salasProceso.hero.title"
              @input="markDirty"
              class="editable-input-title"
            />
          </h1>
          <textarea
            v-model="store.data.servicios.salasProceso.hero.lead"
            @input="markDirty"
            class="editable-input lead"
            rows="5"
          ></textarea>
        </div>
      </section>

      <!-- ================== GALERÍA ================== -->
      <section class="section relative-parent">
        <button class="edit-section-btn" @click="openEditor">⚙️ Editar Galería</button>

        <div class="container">
          <header class="section-head">
            <h2 class="section-title">
              <input
                v-model="store.data.servicios.salasProceso.intro.title"
                @input="markDirty"
                class="editable-input-simple center-text section-title"
              />
            </h2>
            <p class="section-sub">
              <input
                v-model="store.data.servicios.salasProceso.intro.subtitle"
                @input="markDirty"
                class="editable-input-simple center-text"
              />
            </p>
          </header>

          <div class="carousel" role="region" aria-label="Galería de salas de proceso">
            <div class="viewport">
              <div class="track" :style="{ transform: `translateX(-${current * 100}%)` }">
                <figure v-for="(img, i) in store.data.servicios.salasProceso.gallery" :key="i" class="slide">
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
                v-for="(img, i) in store.data.servicios.salasProceso.gallery"
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

      <!-- ================== FAQ ================== -->
      <section class="section section-faq relative-parent">
        <div class="container">
          <h2 class="section-title center">Preguntas frecuentes</h2>

          <div class="faq-grid">
            <article v-for="(f, i) in store.data.servicios.salasProceso.faqs" :key="i" class="faq-card">
              <input v-model="f.q" @input="markDirty" class="editable-input-simple q" />
              <textarea v-model="f.a" @input="markDirty" class="editable-input-simple a" rows="4"></textarea>
            </article>
          </div>
        </div>
      </section>
    </main>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, reactive } from 'vue'
import { useWebDataStore } from '~/stores/webData'

// Assets Default
import imgcuartosfiros from '~/assets/images/cuartos.jpg'
import imgIndustriales from '~/assets/images/industriales.jpeg'
import imgMantenimiento from '~/assets/images/mantenimiento.jpg'
import imgSalaProceso from '~/assets/images/salaProceso.jpeg'
import hero from '~/assets/images/hero.jpeg'

const store = useWebDataStore()
const dataReady = ref(false)

const props = withDefaults(defineProps<{ show_hero?: boolean }>(), { show_hero: true })
const showHero = computed(() => props.show_hero)

// ========= DATOS POR DEFECTO =========
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

// ========= INIT STORE =========
onMounted(async () => {
  if (!store.data) store.data = {}
  if (!store.data.servicios) store.data.servicios = {}
  if (!store.data.servicios.salasProceso) store.data.servicios.salasProceso = {}

  const ensureStructure = (target: any, defaults: any) => {
    for (const key in defaults) {
      if (target[key] === undefined) target[key] = JSON.parse(JSON.stringify(defaults[key]))
      else if (typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key])) {
        ensureStructure(target[key], defaults[key])
      }
    }
  }

  ensureStructure(store.data.servicios.salasProceso, defaultData)
  dataReady.value = true
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
    store.data.servicios.salasProceso.hero.bg = id
    markDirty()
  }
}

// ========= EDITOR MODAL (Galería) =========
const editor = reactive({
  isOpen: false,
  tempData: [] as any[]
})

const openEditor = () => {
  editor.tempData = JSON.parse(JSON.stringify(store.data.servicios?.salasProceso?.gallery || []))
  editor.isOpen = true
}

const closeEditor = () => {
  editor.isOpen = false
  editor.tempData = []
}

const saveEditorChanges = () => {
  if (store.data.servicios?.salasProceso) {
    store.data.servicios.salasProceso.gallery = JSON.parse(JSON.stringify(editor.tempData))
    markDirty()
    closeEditor()
    current.value = 0
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
  editor.tempData.push({ src: imgSalaProceso, alt: 'Nueva imagen' })
}

const handleGalleryImageUpload = async (e: any, index: number) => {
  const file = e.target.files?.[0]
  if (!file) return
  const id = await store.uploadImage(file)
  if (id) editor.tempData[index].src = id
}

// ========= CARRUSEL LOGIC =========
const current = ref(0)
function next() {
  const len = store.data.servicios?.salasProceso?.gallery?.length || 0
  if (len === 0) return
  current.value = (current.value + 1) % len
}
function prev() {
  const len = store.data.servicios?.salasProceso?.gallery?.length || 0
  if (len === 0) return
  current.value = (current.value - 1 + len) % len
}
function go(i: number) {
  current.value = i
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
.center-text { text-align: center; }

.editable-input-title{
  background: transparent;
  border: none;
  border-bottom: 1px dashed rgba(255,255,255,0.3);
  color: inherit;
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

.hero__edit-btn{ position:absolute; top:20px; left:20px; z-index:20; }
.edit-section-btn{
  position:absolute; top:10px; right:10px; z-index:20;
  background:#FF9800; border:none; padding:6px 12px;
  cursor:pointer; border-radius:999px; font-weight:900;
  opacity:.75; transition:opacity .2s, transform .2s;
}
.edit-section-btn:hover{ opacity:1; transform: translateY(-1px); }

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
.editor-title-wrap{ display:flex; flex-direction:column; gap:2px; }
.editor-title{ margin:0; font-size:1.05rem; font-weight:900; }
.editor-subtitle{ margin:0; font-size:.82rem; color:rgba(255,255,255,.72); }

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

.editor-body{ padding:14px; overflow-y:auto; flex:1; }

.editor-empty{
  padding: 18px;
  border-radius: 16px;
  border: 1px dashed rgba(255,255,255,.16);
  background: rgba(255,255,255,.04);
}
.editor-empty__title{ margin:0 0 6px; font-weight:900; }
.editor-empty__text{ margin:0 0 12px; color:rgba(255,255,255,.7); }

.editor-list{ display:flex; flex-direction:column; gap:12px; }
.editor-item{
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(0,0,0,.22);
  padding: 12px;
}
.editor-item__top{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  margin-bottom:10px;
}
.editor-index{
  display:inline-flex;
  align-items:center;
  gap:8px;
  color: rgba(255,255,255,.78);
  font-size:.85rem;
  font-weight:800;
}
.editor-index__dot{
  width: 10px; height: 10px; border-radius: 999px;
  background: rgba(15,177,194,.7);
  box-shadow: 0 0 0 6px rgba(15,177,194,.12);
}
.editor-actions{ display:inline-flex; align-items:center; gap:8px; }

.chip-btn{
  border-radius:999px;
  border:1px solid rgba(255,255,255,.14);
  background: rgba(255,255,255,.06);
  color:#fff;
  padding: 8px 10px;
  cursor:pointer;
  font-weight:900;
  transition: transform .15s ease, background .15s ease, border-color .15s ease, opacity .15s ease;
}
.chip-btn:hover{
  transform: translateY(-1px);
  background: rgba(255,255,255,.10);
  border-color: rgba(255,255,255,.20);
}
.chip-btn:disabled{ opacity:.35; cursor:not-allowed; transform:none; }
.chip-btn--danger{
  background: rgba(244,67,54,.14);
  border-color: rgba(244,67,54,.22);
}

.editor-item__content{
  display:grid;
  grid-template-columns: 160px 1fr;
  gap: 12px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.04);
}

.img-preview-box{ display:flex; flex-direction:column; gap:8px; align-items:stretch; }
.img-preview{
  width:100%;
  height:110px;
  object-fit:cover;
  border-radius:12px;
  background:#000;
  border:1px solid rgba(255,255,255,.12);
}
.hint{ font-size:.78rem; color: rgba(255,255,255,.65); }

.field-group{ display:flex; flex-direction:column; gap:6px; }
.field-label{
  font-size:.78rem;
  font-weight:800;
  letter-spacing:.06em;
  color: rgba(255,255,255,.72);
}
.field-input{
  width:100%;
  border-radius:12px;
  padding: 10px 10px;
  border:1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.06);
  color:#fff;
  outline:none;
}
.field-input:focus{
  border-color: rgba(15,177,194,.55);
  background: rgba(255,255,255,.08);
}

.editor-add{ margin-top:12px; }

.editor-footer{
  padding: 12px 14px;
  border-top: 1px solid rgba(255,255,255,.12);
  display:flex;
  justify-content:flex-end;
  gap:10px;
  align-items:center;
  background: rgba(0,0,0,.18);
}

/* Botones reutilizables */
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
.btn--primary{ background:#0fb1c2; color:#032229; font-weight:900; }
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

@media (max-width: 720px){
  .editor-item__content{ grid-template-columns: 1fr; }
  .editor-footer{ flex-direction: column; align-items: stretch; }
  .editor-footer .btn{ width: 100%; }
}

/* ========================================= */
/* ESTILOS ORIGINALES */
:root{
  --ink:#0f2a38;
  --ink-dim:#5e7b8c;
  --line:rgba(0,0,0,.08);
  --accent:#0fb1c2;
}
*{box-sizing:border-box}
html,body{margin:0}
.process{background:#fff;color:#173341; min-height: 100vh;}

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

/* ===== Section Head ===== */
.section-head{ text-align:center; margin-bottom:22px }
.section-title{
  margin:0; color:#102b37; text-transform:uppercase; letter-spacing:.12em;
  font-size:clamp(1.4rem,3.5vw,1.9rem);
  width: 100%; background: transparent; border: none;
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
.q{ margin:0 0 .4rem; color:#09222e; font-size:1.05rem; font-weight:700; text-transform:uppercase; background: transparent; border: none; width: 100%; }
.a{ margin:0; color:#385867; line-height:1.6; background: transparent; border: none; width: 100%; resize: vertical; }

/* ===== Mobile paddings ===== */
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
