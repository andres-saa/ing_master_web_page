<template>
  <ClientOnly>
    <main class="pqr" v-if="dataReady && store.data.pqr">
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
                <div class="editor-badge">PQR</div>
                <div class="editor-title-wrap">
                  <h3 class="editor-title">Editar datos de contacto</h3>
                  <p class="editor-subtitle">Ordena, elimina o agrega nuevos ítems del sidebar.</p>
                </div>
              </div>

              <div class="editor-header__right">
                <button class="icon-btn" @click="closeEditor" aria-label="Cerrar">✕</button>
              </div>
            </header>

            <div class="editor-body">
              <div v-if="editor.tempData.length === 0" class="editor-empty">
                <p class="editor-empty__title">No hay datos en la lista.</p>
                <p class="editor-empty__text">Agrega el primer ítem para mostrarlo en el sidebar.</p>
                <button @click="addNewItem" class="btn btn--primary">+ Agregar dato</button>
              </div>

              <div v-else class="editor-list">
                <div v-for="(item, idx) in editor.tempData" :key="idx" class="editor-item">
                  <div class="editor-item__top">
                    <div class="editor-index">
                      <span class="editor-index__dot"></span>
                      <span>Ítem {{ idx + 1 }}</span>
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
                    <div class="field-group">
                      <label class="field-label">Etiqueta</label>
                      <input v-model="item.label" class="field-input" type="text" placeholder="Ej: Email" />
                    </div>

                    <div class="field-group">
                      <label class="field-label">Valor visible</label>
                      <input v-model="item.text" class="field-input" type="text" placeholder="Ej: contacto@..." />
                    </div>

                    <div class="field-group">
                      <label class="field-label">Enlace (opcional)</label>
                      <input
                        v-model="item.href"
                        class="field-input"
                        type="text"
                        placeholder="mailto:..., tel:..., https://..."
                      />
                    </div>

                    <div class="field-meta">
                      <span class="hint">Si “href” está vacío, se mostrará solo texto.</span>
                      <button class="ghost-btn" type="button" @click="autoHref(idx)">Auto-href</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="editor-add">
                <button @click="addNewItem" class="btn btn--soft full-width">+ Agregar dato</button>
              </div>
            </div>

            <footer class="editor-footer">
              <button @click="closeEditor" class="btn btn--ghost">Cancelar</button>
              <button @click="saveEditorChanges" class="btn btn--primary">Guardar lista</button>
            </footer>
          </div>
        </div>
      </Transition>

      <!-- ================== HERO ================== -->
      <section
        class="hero relative-parent"
        :style="{
          backgroundImage: `linear-gradient(rgba(7,20,28,.65), rgba(7,20,28,.82)), url(${resolveImage(store.data.pqr.hero.bg)})`
        }"
      >
        <div class="hero__edit-btn">
          <label class="btn btn--small">
            📷 Cambiar Fondo
            <input type="file" hidden @change="uploadHeroBg" />
          </label>
        </div>

        <div class="container">
          <h1 class="hero__title">
            <input v-model="store.data.pqr.hero.title" @input="markDirty" class="editable-input-title" />
          </h1>
        </div>
      </section>

      <!-- ================== FORM + SIDEBAR ================== -->
      <section class="section">
        <div class="container grid">
          <form class="card form" @submit.prevent="onSubmit">
            <input v-model="form._robot" type="text" autocomplete="off" tabindex="-1" class="hp" aria-hidden="true" />

            <div class="field">
              <label class="label">Su nombre</label>
              <input v-model.trim="form.name" type="text" placeholder="Su nombre" required />
            </div>

            <div class="field">
              <label class="label">Su correo electrónico</label>
              <input v-model.trim="form.email" type="email" placeholder="correo@empresa.com" required />
            </div>

            <div class="field">
              <label class="label">Su teléfono</label>
              <input v-model.trim="form.phone" type="tel" placeholder="+57 300 000 0000" />
            </div>

            <div class="field">
              <label class="label">Asunto</label>
              <input v-model.trim="form.subject" type="text" placeholder="Asunto" />
            </div>

            <div class="field">
              <label class="label">Pregunta, queja o reclamo</label>
              <textarea
                v-model.trim="form.message"
                rows="7"
                placeholder="Describe tu solicitud con el mayor detalle posible…"
                required
              />
            </div>

            <div class="actions">
              <button class="btn" type="submit" :disabled="submitting">
                {{ submitting ? 'Enviando…' : 'Enviar' }}
              </button>
              <p v-if="error" class="feedback error">{{ error }}</p>
              <p v-if="ok" class="feedback ok">¡Gracias! Hemos recibido tu PQR y te contactaremos muy pronto.</p>
            </div>
          </form>

          <aside class="side relative-parent">
            <button class="edit-section-btn" @click="openEditor">⚙️ Editar Sidebar</button>

            <input v-model="store.data.pqr.sidebar.eyebrow" @input="markDirty" class="editable-input eyebrow" />
            <textarea
              v-model="store.data.pqr.sidebar.headline"
              @input="markDirty"
              class="editable-input headline"
              rows="3"
            ></textarea>

            <hr class="sep" />

            <textarea
              v-model="store.data.pqr.sidebar.description"
              @input="markDirty"
              class="editable-input copy"
              rows="5"
            ></textarea>

            <ul class="contact-list">
              <li v-for="(item, i) in store.data.pqr.sidebar.list" :key="i">
                <span class="key">{{ item.label }}</span>
                <a v-if="item.href" :href="item.href">{{ item.text }}</a>
                <span v-else>{{ item.text }}</span>
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  </ClientOnly>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useWebDataStore } from '~/stores/webData'
import hero from '~/assets/images/hero.jpeg'

const store = useWebDataStore()
const dataReady = ref(false)

// ========= DATOS POR DEFECTO =========
const defaultPqrData = {
  hero: {
    bg: hero,
    title: 'PQR'
  },
  sidebar: {
    eyebrow: 'Escríbanos',
    headline: 'Si tiene alguna duda, sugerencia, queja o reclamo',
    description:
      'Envíenos sus datos y resolveremos sus dudas a la mayor brevedad posible. En Ingeniería Master cuidamos cada detalle de nuestros proyectos y del servicio postventa.',
    list: [
      { label: 'Email', text: 'contacto@ingenieriamaster.com', href: 'mailto:contacto@ingenieriamaster.com' },
      { label: 'Teléfono', text: '+57 (604) 444 8735', href: 'tel:+576044448735' }
    ]
  }
}

// ========= INIT STORE ROBUSTO =========
onMounted(async () => {
  if (!store.data) store.data = {}
  if (!store.data.pqr) store.data.pqr = {}

  const ensureStructure = (target: any, defaults: any) => {
    for (const key in defaults) {
      if (target[key] === undefined) {
        target[key] = JSON.parse(JSON.stringify(defaults[key]))
      } else if (typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key])) {
        ensureStructure(target[key], defaults[key])
      }
    }
  }

  ensureStructure(store.data.pqr, defaultPqrData)
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
    store.data.pqr.hero.bg = id
    markDirty()
  }
}

// ========= EDITOR MODAL (Sidebar List) =========
const editor = reactive({
  isOpen: false,
  tempData: [] as any[]
})

const openEditor = () => {
  editor.tempData = JSON.parse(JSON.stringify(store.data.pqr.sidebar.list || []))
  editor.isOpen = true
}

const closeEditor = () => {
  editor.isOpen = false
  editor.tempData = []
}

const saveEditorChanges = () => {
  store.data.pqr.sidebar.list = JSON.parse(JSON.stringify(editor.tempData))
  markDirty()
  closeEditor()
}

const moveItem = (index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < editor.tempData.length) {
    const item = editor.tempData.splice(index, 1)[0]
    editor.tempData.splice(newIndex, 0, item)
  }
}

const deleteItem = (index: number) => {
  if (confirm('¿Eliminar este dato?')) editor.tempData.splice(index, 1)
}

const addNewItem = () => {
  editor.tempData.push({ label: 'Nuevo', text: 'Dato', href: '' })
}

/** Autogenera href si está vacío: mailto/tel según el texto */
const autoHref = (index: number) => {
  const it = editor.tempData[index]
  if (!it) return
  const text = String(it.text || '').trim()
  if (!text) return

  // Si ya hay href, no lo pisa
  if (String(it.href || '').trim()) return

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)
  if (isEmail) {
    it.href = `mailto:${text}`
    return
  }

  // Tel: deja números y +
  const digits = text.replace(/[^\d+]/g, '')
  if (digits.length >= 7) {
    it.href = `tel:${digits}`
  }
}

// ========= FORM LOGIC (Usuario Final) =========
type Form = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  _robot?: string
}

const form = reactive<Form>({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  _robot: ''
})

const submitting = ref(false)
const ok = ref(false)
const error = ref<string | null>(null)

async function onSubmit() {
  error.value = null
  ok.value = false

  if (form._robot && form._robot.length > 0) {
    error.value = 'Error de validación.'
    return
  }

  if (!form.name || !form.email || !form.message) {
    error.value = 'Por favor completa nombre, correo y tu mensaje.'
    return
  }

  submitting.value = true
  try {
    await new Promise((r) => setTimeout(r, 1000))
    Object.assign(form, { name: '', email: '', phone: '', subject: '', message: '' })
    ok.value = true
  } catch (e: any) {
    error.value = e?.message ?? 'Ocurrió un error inesperado.'
  } finally {
    submitting.value = false
  }
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

.editable-input {
  background: transparent;
  border: 1px dashed rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 2px;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  font-weight: inherit;
}
.editable-input:focus {
  outline: 1px solid var(--accent);
  background: rgba(0, 0, 0, 0.05);
}

.editable-input-title {
  background: transparent;
  border: none;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
  color: white;
  font-family: inherit;
  font-size: inherit;
  text-align: inherit;
  width: 100%;
}
.editable-input-title:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.1);
}

.hero__edit-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 20;
}
.edit-section-btn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 20;
  background: #ff9800;
  border: none;
  padding: 6px 12px;
  font-size: 0.78rem;
  cursor: pointer;
  border-radius: 999px;
  font-weight: 900;
  opacity: 0.75;
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
  max-height: min(88vh, 760px);
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
  display: grid;
  gap: 10px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
}
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field-label {
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.72);
}
.field-input {
  width: 100%;
  border-radius: 12px;
  padding: 10px 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: white;
  outline: none;
}
.field-input:focus {
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
.hint {
  color: rgba(255, 255, 255, 0.65);
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

/* ===== ESTILOS BASE ===== */
:root {
  --ink: #0f2a38;
  --ink-inv: #fff;
  --ink-dim: #567584;
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
.pqr {
  background: #fff;
  color: #14313f;
  min-height: 100vh;
}
.container {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 1.25rem;
}
.section {
  padding: 34px 0;
}
@media (min-width: 768px) {
  .section {
    padding: 52px 0;
  }
}

/* ===== Hero ===== */
.hero {
  min-height: 28vh;
  display: flex;
  align-items: center;
  background-position: center;
  background-size: cover;
  padding: 44px 0;
  border-bottom: 1px solid #0f2a38;
  position: relative;
}
.hero__title {
  color: var(--ink-inv);
  font-size: clamp(2rem, 6vw, 3rem);
  margin: 0 0 6px;
  text-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
  width: 100%;
  text-align: center;
}

/* ===== Grid ===== */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
  align-items: start;
}
@media (min-width: 980px) {
  .grid {
    grid-template-columns: minmax(0, 560px) 1fr;
    gap: 48px;
  }
}

/* ===== Form ===== */
.card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.form {
  padding: 18px;
}
@media (min-width: 700px) {
  .form {
    padding: 22px;
  }
}

.label {
  display: block;
  font-size: 0.8rem;
  color: var(--ink-dim);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}
.field {
  margin-bottom: 14px;
}
input,
textarea {
  width: 100%;
  border: 1px solid #d8e4ea;
  border-radius: 10px;
  background: #f7fafb;
  padding: 0.8rem 0.9rem;
  outline: none;
  color: #0e2a36;
}
input:focus,
textarea:focus {
  border-color: #9ed6de;
  background: #fff;
}
textarea {
  resize: vertical;
}
.hp {
  position: absolute !important;
  left: -50000px !important;
  opacity: 0 !important;
  pointer-events: none;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.btn {
  height: 44px;
  padding: 0 1.2rem;
  border: 1px solid transparent;
  border-radius: 10px;
  background: #0b7f8d;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn--ghost {
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.12);
  color: #0e2a36;
}
.btn--soft {
  background: rgba(15, 177, 194, 0.12);
  border: 1px solid rgba(15, 177, 194, 0.18);
  color: #0e2a36;
}

.feedback {
  margin: 0;
  font-size: 0.9rem;
}
.feedback.ok {
  color: #1a8f5b;
}
.feedback.error {
  color: #c24040;
}

/* ===== Sidebar ===== */
.side {
  padding: 8px 0;
}
.eyebrow {
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: #7c9cab;
  margin: 0.25rem 0 0.5rem;
}
.headline {
  font-size: clamp(1.8rem, 4.5vw, 2.6rem);
  line-height: 1.15;
  margin: 0 0 0.4rem;
  color: #0e2a36;
  background: transparent;
  border: none;
  width: 100%;
  resize: none;
  overflow: hidden;
}
.sep {
  width: 86px;
  border: 0;
  border-top: 3px solid #0fb1c2;
  margin: 14px 0 10px;
}
.copy {
  color: #365564;
  max-width: 56ch;
  background: transparent;
  border: none;
  width: 100%;
  resize: vertical;
  line-height: 1.5;
}
.contact-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: grid;
  gap: 6px;
}
.contact-list .key {
  display: inline-block;
  min-width: 86px;
  color: #567584;
}
.contact-list a {
  color: #0b7f8d;
  text-decoration: none;
}
.contact-list a:hover {
  text-decoration: underline;
}

/* ===== Mobile paddings ===== */
@media (max-width: 767.98px) {
  .container {
    padding-left: 18px;
    padding-right: 18px;
  }
}
</style>
