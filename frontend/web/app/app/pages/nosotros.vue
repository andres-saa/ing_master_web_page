<template>
  <ClientOnly>
    <main class="about" v-if="dataReady && store.data.nosotros">
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
                <div class="editor-badge">Nosotros</div>
                <div class="editor-title-wrap">
                  <h3 class="editor-title">Editar párrafos</h3>
                  <p class="editor-subtitle">
                    Organiza el orden, elimina o agrega nuevos párrafos para la sección.
                  </p>
                </div>
              </div>

              <div class="editor-header__right">
                <button class="icon-btn" @click="closeEditor" aria-label="Cerrar">✕</button>
              </div>
            </header>

            <div class="editor-body">
              <div v-if="editor.tempData.length === 0" class="editor-empty">
                <p class="editor-empty__title">No hay párrafos aún.</p>
                <p class="editor-empty__text">Crea el primer párrafo para mostrarlo en la página.</p>
                <button @click="addNewItem" class="btn btn--primary">+ Agregar párrafo</button>
              </div>

              <div v-else class="editor-list">
                <div v-for="(item, idx) in editor.tempData" :key="idx" class="editor-item">
                  <div class="editor-item__top">
                    <div class="editor-index">
                      <span class="editor-index__dot"></span>
                      <span>Párrafo {{ idx + 1 }}</span>
                    </div>

                    <div class="editor-actions">
                      <button class="chip-btn" @click="moveItem(idx, -1)" :disabled="idx === 0" title="Subir">
                        ↑
                      </button>
                      <button
                        class="chip-btn"
                        @click="moveItem(idx, 1)"
                        :disabled="idx === editor.tempData.length - 1"
                        title="Bajar"
                      >
                        ↓
                      </button>
                      <button class="chip-btn chip-btn--danger" @click="deleteItem(idx)" title="Eliminar">
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div class="editor-item__content">
                    <label class="field-label">Contenido</label>
                    <textarea
                      v-model="item.text"
                      class="field-textarea"
                      rows="5"
                      placeholder="Escribe el párrafo…"
                    ></textarea>
                    <div class="field-meta">
                      <span>{{ (item.text || '').length }} caracteres</span>
                      <button class="ghost-btn" type="button" @click="trimText(idx)" :disabled="!(item.text || '').length">
                        Limpiar espacios
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="editor-add">
                <button @click="addNewItem" class="btn btn--soft full-width">+ Agregar párrafo</button>
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
          backgroundImage: `linear-gradient(rgba(7,20,28,.65), rgba(7,20,28,.82)), url(${resolveImage(
            store.data.nosotros.hero.bg
          )})`
        }"
      >
        <div class="hero__edit-btn">
          <label class="btn btn--small">
            📷 Cambiar Fondo
            <input type="file" hidden @change="(e) => uploadGeneric(e, store.data.nosotros.hero, 'bg')" />
          </label>
        </div>

        <div class="container">
          <h1 class="hero__title">
            <input v-model="store.data.nosotros.hero.title" @input="markDirty" class="editable-input-title" />
          </h1>
        </div>
      </section>

      <!-- ================== VIDEO ================== -->
      <section class="section relative-parent">
        <div class="container">
          <div class="video-controls">
            <label>ID Video YouTube:</label>
            <input
              v-model="store.data.nosotros.video.id"
              @input="markDirty"
              class="editable-input-black"
              placeholder="Ej: dQw4w9WgXcQ"
            />
          </div>

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

      <!-- ================== ABOUT ================== -->
      <section class="section relative-parent">
        <button class="edit-section-btn" @click="openEditor('paragraphs', store.data.nosotros.about.paragraphs)">
          ⚙️ Editar Párrafos
        </button>

        <div class="container">
          <input
            v-model="store.data.nosotros.about.eyebrow"
            @input="markDirty"
            class="editable-input eyebrow center-text"
          />
          <textarea
            v-model="store.data.nosotros.about.title"
            @input="markDirty"
            class="editable-input title center-text"
            rows="2"
          ></textarea>

          <div class="lead">
            <!-- FIX SSR/Hydration: p solo contiene texto -->
            <p v-for="(p, i) in store.data.nosotros.about.paragraphs" :key="i">{{ p.text }}</p>
          </div>
        </div>
      </section>

      <!-- ================== M/V ================== -->
      <section class="section">
        <div class="container">
          <div class="grid-2">
            <article class="card">
              <input v-model="store.data.nosotros.cards.mission.title" @input="markDirty" class="editable-input h3 accent" />
              <textarea
                v-model="store.data.nosotros.cards.mission.text"
                @input="markDirty"
                class="editable-input copy"
                rows="6"
              ></textarea>
            </article>

            <article class="card">
              <input v-model="store.data.nosotros.cards.vision.title" @input="markDirty" class="editable-input h3 accent" />
              <textarea
                v-model="store.data.nosotros.cards.vision.text"
                @input="markDirty"
                class="editable-input copy"
                rows="6"
              ></textarea>
            </article>
          </div>
        </div>
      </section>

      <!-- ================== QUALITY/SECURITY ================== -->
      <section class="section">
        <div class="container">
          <div class="grid-2 grid-2--images">
            <figure class="media relative-parent">
              <div class="img-edit-overlay">
                <label class="btn btn--small">
                  📷 Cambiar
                  <input type="file" hidden @change="(e) => uploadGeneric(e, store.data.nosotros.qualitySecurity.images, 'left')" />
                </label>
              </div>
              <img
                :src="resolveImage(store.data.nosotros.qualitySecurity.images.left)"
                alt="Imagen Izquierda"
                loading="lazy"
                decoding="async"
              />
            </figure>

            <figure class="media relative-parent">
              <div class="img-edit-overlay">
                <label class="btn btn--small">
                  📷 Cambiar
                  <input type="file" hidden @change="(e) => uploadGeneric(e, store.data.nosotros.qualitySecurity.images, 'right')" />
                </label>
              </div>
              <img
                :src="resolveImage(store.data.nosotros.qualitySecurity.images.right)"
                alt="Imagen Derecha"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>

          <div class="grid-2 mt-20">
            <article class="card">
              <input
                v-model="store.data.nosotros.qualitySecurity.cards.quality.title"
                @input="markDirty"
                class="editable-input h3 accent"
              />
              <textarea
                v-model="store.data.nosotros.qualitySecurity.cards.quality.text"
                @input="markDirty"
                class="editable-input copy"
                rows="5"
              ></textarea>
            </article>

            <article class="card">
              <input
                v-model="store.data.nosotros.qualitySecurity.cards.security.title"
                @input="markDirty"
                class="editable-input h3 accent"
              />
              <textarea
                v-model="store.data.nosotros.qualitySecurity.cards.security.text"
                @input="markDirty"
                class="editable-input copy"
                rows="5"
              ></textarea>
            </article>
          </div>
        </div>
      </section>
    </main>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, reactive } from 'vue'
import { useWebDataStore } from '~/stores/webData'
import hero from '~/assets/images/hero.jpeg'

const store = useWebDataStore()
const dataReady = ref(false)

/* ====== Defaults para asegurar estructura ====== */
const defaultImgLeft =
  'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1400&auto=format&fit=crop'
const defaultImgRight =
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400&auto=format&fit=crop'

const defaultNosotrosData = {
  hero: {
    bg: hero,
    title: 'NOSOTROS'
  },
  video: {
    id: 'dQw4w9WgXcQ'
  },
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
    images: {
      left: defaultImgLeft,
      right: defaultImgRight
    },
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

// ========= INIT STORE ROBUSTO =========
onMounted(async () => {
  if (!store.data) store.data = {}
  if (!store.data.nosotros) store.data.nosotros = {}

  const ensureStructure = (target: any, defaults: any) => {
    for (const key in defaults) {
      if (target[key] === undefined) {
        target[key] = JSON.parse(JSON.stringify(defaults[key]))
      } else if (typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key])) {
        ensureStructure(target[key], defaults[key])
      }
    }
  }

  ensureStructure(store.data.nosotros, defaultNosotrosData)
  dataReady.value = true
})

// ========= HELPERS =========
const markDirty = () => store.markAsDirty()

const resolveImage = (imgSource: string | null | undefined) => {
  if (!imgSource) return ''
  if (imgSource.startsWith('/') || imgSource.startsWith('data:') || imgSource.startsWith('http')) return imgSource
  return `https://backend.salchimonster.com/read-photo-product/${imgSource}`
}

const ytEmbed = computed(() => {
  const id = store.data.nosotros?.video?.id || 'dQw4w9WgXcQ'
  return `https://www.youtube.com/embed/${id}?rel=0`
})

// ========= UPLOAD GENÉRICO =========
const uploadGeneric = async (event: any, targetObject: any, key: string) => {
  const file = event.target.files?.[0]
  if (!file) return
  const id = await store.uploadImage(file)
  if (id) {
    targetObject[key] = id
    markDirty()
  }
}

// ========= EDITOR MODAL (párrafos) =========
const editor = reactive({
  isOpen: false,
  sectionName: '',
  targetArray: null as any[] | null,
  tempData: [] as any[]
})

const openEditor = (name: string, dataArray: any[]) => {
  editor.sectionName = name
  editor.targetArray = dataArray
  editor.tempData = JSON.parse(JSON.stringify(dataArray || []))
  editor.isOpen = true
}

const closeEditor = () => {
  editor.isOpen = false
  editor.targetArray = null
  editor.tempData = []
}

const saveEditorChanges = () => {
  if (editor.sectionName === 'paragraphs') {
    store.data.nosotros.about.paragraphs = JSON.parse(JSON.stringify(editor.tempData))
    markDirty()
    closeEditor()
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
  if (confirm('¿Eliminar este párrafo?')) editor.tempData.splice(index, 1)
}

const addNewItem = () => {
  editor.tempData.push({ text: 'Nuevo párrafo…' })
}

const trimText = (index: number) => {
  const it = editor.tempData[index]
  if (!it) return
  it.text = String(it.text || '')
    .replace(/\s+\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim()
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
.relative-parent {
  position: relative;
}
.center-text {
  text-align: center;
}

.editable-input-title {
  background: transparent;
  border: none;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  text-align: inherit;
  width: 100%;
}
.editable-input-title:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.1);
}

.editable-input {
  background: transparent;
  border: 1px dashed rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 4px;
  width: 100%;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
}
.editable-input:focus {
  outline: 1px solid var(--accent);
  background: rgba(0, 0, 0, 0.05);
}

.editable-input-black {
  background: #222;
  color: white;
  border: 1px solid #444;
  padding: 5px;
  border-radius: 10px;
  width: 220px;
}

/* Botones de edición flotantes */
.hero__edit-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 20;
}
.img-edit-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}
.edit-section-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 20;
  background: #ff9800;
  border: none;
  padding: 7px 12px;
  cursor: pointer;
  border-radius: 999px;
  font-weight: 900;
  opacity: 0.7;
  transition: opacity 0.2s, transform 0.2s;
}
.edit-section-btn:hover {
  opacity: 1;
  transform: translateY(-1px);
}
.btn--small {
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  background: white;
  color: black;
  cursor: pointer;
  border-radius: 999px;
  display: inline-block;
}

.video-controls {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  padding: 10px;
  border-radius: 12px;
}

/* ================== EDITOR (MEJORADO) ================== */
.editor-overlay {
  position: fixed;
  inset: 0;
  background: radial-gradient(1200px 600px at 30% 10%, rgba(15, 177, 194, 0.12), rgba(0, 0, 0, 0.85));
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px;
}
.editor-modal {
  width: min(980px, 100%);
  max-height: min(88vh, 780px);
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  color: white;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(180deg, rgba(20, 32, 46, 0.92), rgba(10, 18, 26, 0.92));
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
}
.editor-header {
  padding: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.editor-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.editor-badge {
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(15, 177, 194, 0.14);
  border: 1px solid rgba(15, 177, 194, 0.22);
}
.editor-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.editor-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 900;
}
.editor-subtitle {
  margin: 0;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.72);
}
.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: white;
  cursor: pointer;
  font-size: 1.1rem;
  display: grid;
  place-items: center;
  transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}
.icon-btn:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.editor-body {
  padding: 14px;
  overflow-y: auto;
  flex: 1;
}

.editor-empty {
  padding: 18px;
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.04);
}
.editor-empty__title {
  margin: 0 0 6px;
  font-weight: 900;
}
.editor-empty__text {
  margin: 0 0 12px;
  color: rgba(255, 255, 255, 0.7);
}

.editor-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.editor-item {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.22);
  padding: 12px;
}
.editor-item__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.editor-index {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.85rem;
  font-weight: 800;
}
.editor-index__dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(15, 177, 194, 0.7);
  box-shadow: 0 0 0 6px rgba(15, 177, 194, 0.12);
}
.editor-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.chip-btn {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: white;
  padding: 8px 10px;
  cursor: pointer;
  font-weight: 900;
  transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
}
.chip-btn:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}
.chip-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  transform: none;
}
.chip-btn--danger {
  background: rgba(244, 67, 54, 0.14);
  border-color: rgba(244, 67, 54, 0.22);
}

.editor-item__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
}
.field-label {
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.72);
}
.field-textarea {
  width: 100%;
  border-radius: 12px;
  padding: 10px 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: white;
  outline: none;
  resize: vertical;
  line-height: 1.5;
}
.field-textarea:focus {
  border-color: rgba(15, 177, 194, 0.55);
  background: rgba(255, 255, 255, 0.08);
}
.field-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.82rem;
}
.ghost-btn {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.92);
  cursor: pointer;
  font-weight: 800;
  font-size: 0.85rem;
}
.ghost-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.editor-add {
  margin-top: 12px;
}
.full-width {
  width: 100%;
  justify-content: center;
}

.editor-footer {
  padding: 12px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  align-items: center;
  background: rgba(0, 0, 0, 0.18);
}

/* Responsive modal */
@media (max-width: 767px) {
  .editor-footer {
    flex-direction: column;
    align-items: stretch;
  }
  .editor-footer .btn {
    width: 100%;
  }
}

/* ===== ESTILOS DE DISEÑO (BASE) ===== */
:root {
  --ink: #0f2a38;
  --ink-inv: #fff;
  --ink-dim: #4a6674;
  --line: rgba(0, 0, 0, 0.08);
  --accent: #0fb1c2;
}

* {
  box-sizing: border-box;
}
html,
body {
  margin: 0;
  padding: 0;
}
.about {
  background: #fff;
  color: #122b37;
  min-height: 100vh;
}
.container {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 1.25rem;
}
.mt-20 {
  margin-top: 20px;
}
.eyebrow {
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-size: 0.68rem;
  color: #7c9cab;
  margin: 0.25rem 0 0.5rem;
}
.title {
  font-size: 2rem;
  line-height: 1.2;
  margin: 0 auto 0.75rem;
  background: transparent;
  border: none;
  resize: none;
}
.hero {
  min-height: 38vh;
  display: flex;
  align-items: center;
  background-position: center;
  background-size: cover;
  padding: 44px 0;
  border-bottom: 1px solid #0f2a38;
  position: relative;
}
.hero__title {
  color: #fff;
  font-size: clamp(2rem, 6vw, 3rem);
  text-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
  width: 100%;
  text-align: center;
}
.section {
  padding: 34px 0;
}
@media (min-width: 768px) {
  .section {
    padding: 52px 0;
  }
}
.lead {
  display: grid;
  gap: 14px;
  color: #2a4755;
  max-width: 86ch;
  margin-inline: auto;
  text-align: center;
}

.video {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.18);
}
.video iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}
@media (min-width: 900px) {
  .grid-2 {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
}
.card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.h3 {
  font-size: 1.25rem;
  margin: 0.25rem 0 0.5rem;
  font-weight: bold;
}
.accent {
  color: #0b7f8d;
}
.copy {
  background: transparent;
  border: none;
  width: 100%;
  resize: vertical;
  font-family: inherit;
  color: inherit;
  line-height: 1.5;
}

.grid-2--images .media {
  margin: 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.16);
  border: 1px solid #e6eef1;
  height: 300px;
}
.media img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

/* Mobile paddings */
@media (max-width: 767.98px) {
  .container {
    padding-left: 18px;
    padding-right: 18px;
  }
}
</style>
