<template>
  <ClientOnly>
    <footer class="footer" v-if="dataReady && store.data.footer">
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
                <div class="editor-badge">Instagram</div>
                <div class="editor-title-wrap">
                  <h3 class="editor-title">Gestionar posts</h3>
                  <p class="editor-subtitle">Reordena, cambia imagen y actualiza el enlace.</p>
                </div>
              </div>

              <div class="editor-header__right">
                <button class="icon-btn" @click="closeEditor" aria-label="Cerrar">✕</button>
              </div>
            </header>

            <div class="editor-body">
              <div v-if="editor.tempData.length === 0" class="editor-empty">
                <p class="editor-empty__title">Aún no tienes posts.</p>
                <p class="editor-empty__text">Agrega el primer post para mostrarlo en la grilla.</p>
                <button @click="addNewItem" class="btn btn--primary">+ Añadir post</button>
              </div>

              <div v-else class="editor-list">
                <div v-for="(post, idx) in editor.tempData" :key="idx" class="editor-item">
                  <div class="editor-item__top">
                    <div class="editor-index">
                      <span class="editor-index__dot"></span>
                      <span>Post {{ idx + 1 }}</span>
                    </div>

                    <div class="editor-actions">
                      <button class="chip-btn" @click="moveItem(idx, -1)" :disabled="idx === 0" title="Subir">↑</button>
                      <button
                        class="chip-btn"
                        @click="moveItem(idx, 1)"
                        :disabled="idx === editor.tempData.length - 1"
                        title="Bajar"
                      >
                        ↓
                      </button>
                      <button class="chip-btn chip-btn--danger" @click="deleteItem(idx)" title="Eliminar">🗑️</button>
                    </div>
                  </div>

                  <div class="editor-item__content">
                    <div class="img-upload">
                      <div class="img-upload__preview">
                        <img :src="resolveImage(post.Image)" class="img-preview" alt="Preview" loading="lazy" decoding="async" />
                      </div>

                      <div class="img-upload__controls">
                        <label class="file-btn">
                          <span>📷 Cambiar</span>
                          <input type="file" hidden @change="(e) => handlePostImageUpload(e, idx)" accept="image/*" />
                        </label>

                        <button class="ghost-btn" type="button" @click="clearPostImage(idx)" :disabled="!post.Image">
                          Quitar
                        </button>
                      </div>
                    </div>

                    <div class="field-group">
                      <label class="field-label">Enlace del post</label>
                      <input
                        v-model="post.href"
                        type="text"
                        class="field-input"
                        placeholder="https://instagram.com/p/..."
                        autocomplete="off"
                      />
                      <p class="field-hint">
                        Si queda vacío, usará el link del perfil.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer class="editor-footer">
              <div class="editor-footer__left">
                <button @click="addNewItem" class="btn btn--soft">+ Añadir post</button>
              </div>

              <div class="editor-footer__right">
                <button @click="closeEditor" class="btn btn--ghost">Cancelar</button>
                <button @click="saveEditorChanges" class="btn btn--primary">Guardar cambios</button>
              </div>
            </footer>
          </div>
        </div>
      </Transition>

      <!-- ================== INSTAGRAM SECTION ================== -->
      <section class="ig relative-parent">
        <button class="edit-section-btn" @click="openEditor">⚙️ Editar Posts</button>

        <div class="container">
          <h3 class="ig__title">
            <Icon name="mdi:instagram" class="ig__title-icon" />
            <span>SÍGUENOS EN INSTAGRAM</span>
          </h3>

          <div class="ig__head">
            <div class="avatar-wrapper">
              <img class="ig__avatar" :src="resolveImage(store.data.footer.instagram.avatar)" alt="avatar instagram" />
              <label class="avatar-edit-btn" title="Cambiar avatar">
                📷
                <input type="file" hidden @change="uploadAvatar" />
              </label>
            </div>

            <div class="ig__user">
              <div class="flex-row">
                <Icon name="mdi:at" style="margin-right: 0.25rem" />
                <input
                  v-model="store.data.footer.instagram.user"
                  @input="markDirty"
                  class="editable-input-simple"
                  style="width: 150px; font-weight: bold"
                />
              </div>
              <div class="flex-row" style="margin-top: 5px; font-size: 0.8rem">
                Link Perfil:
                <input
                  v-model="store.data.footer.instagram.profileUrl"
                  @input="markDirty"
                  class="editable-input-simple"
                />
              </div>
            </div>
          </div>

          <div class="ig__grid">
            <NuxtLink
              v-for="(p, idx) in visiblePosts"
              :key="idx"
              :href="p.href || store.data.footer.instagram.profileUrl"
              class="ig__card"
              target="_blank"
              rel="noopener"
              aria-label="Abrir publicación de Instagram"
            >
              <img :src="resolveImage(p.Image)" alt="post de instagram" loading="lazy" decoding="async" />
            </NuxtLink>
          </div>

          <div class="ig__actions">
            <button v-if="canLoadMore" class="btn btn--ghost" @click="loadMore">
              <Icon name="mdi:plus" /> Cargar más…
            </button>
            <a :href="store.data.footer.instagram.profileUrl" target="_blank" rel="noopener" class="btn btn--primary">
              <Icon name="mdi:instagram" /> Síguenos en Instagram
            </a>
          </div>
        </div>
      </section>

      <!-- ================== FOOTER TOP ================== -->
      <div class="container footer__top">
        <div class="col">
          <div class="mini-links">
            <NuxtLink to="/manual-proteccion-datos">
              <Icon name="mdi:shield-lock-outline" /> Manual de protección de datos personales
            </NuxtLink>
            <NuxtLink to="/terminos-y-condiciones">
              <Icon name="mdi:file-document-outline" /> Términos y condiciones Ingenieria Master.com.co
            </NuxtLink>
          </div>
        </div>

        <div class="col">
          <h4 class="tt">CONTÁCTANOS</h4>
          <input v-model="store.data.footer.contact.subtitle" @input="markDirty" class="editable-input sub" />

          <p>LÍNEA NACIONAL</p>
          <div class="contact-row">
            <Icon name="mdi:phone" />
            <input v-model="store.data.footer.contact.phone" @input="markDirty" class="editable-input-simple" />
          </div>

          <div class="contact-row">
            <Icon name="mdi:email-outline" />
            <input v-model="store.data.footer.contact.email" @input="markDirty" class="editable-input-simple" />
          </div>
        </div>

        <div class="col">
          <h4 class="tt">CALI</h4>
          <div class="contact-row">
            <Icon name="mdi:phone" />
            <input v-model="store.data.footer.contact.phoneLocal" @input="markDirty" class="editable-input-simple" />
          </div>
          <div class="contact-row">
            <Icon name="mdi:map-marker-outline" />
            <input v-model="store.data.footer.contact.address" @input="markDirty" class="editable-input-simple" />
          </div>
          <p>Cali - Valle del Cauca</p>

          <div class="divider"></div>

          <h4 class="tt tt--thin">¿Quieres hacer parte de nuestro equipo?</h4>

          <!-- ✅ FIX HTML: NO div dentro de p -->
          <p>Envía tu hoja de vida al correo:</p>
          <div class="contact-row" style="margin-top: 6px">
            <Icon name="mdi:email-edit-outline" />
            <input v-model="store.data.footer.contact.hrEmail" @input="markDirty" class="editable-input-simple" />
          </div>
          <p style="margin-top: 6px">y trabaja con nosotros.</p>
        </div>
      </div>

      <div class="copy">
        <Icon name="mdi:copyright" /> {{ year }} Ingenieria Master / Arhook-web
      </div>

      <div class="wa-config">
        <small>Num. WhatsApp:</small>
        <input v-model="store.data.footer.contact.whatsapp" @input="markDirty" class="editable-input-black" />
      </div>

      <a class="wa" :href="whatsHref" target="_blank" rel="noopener" aria-label="Chatear por WhatsApp">
        <Icon name="mdi:whatsapp" aria-hidden="true" />
      </a>

      <button class="to-top" @click="scrollTop" aria-label="Volver arriba">
        <Icon name="mdi:arrow-up" aria-hidden="true" />
      </button>
    </footer>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, reactive } from 'vue'
import { useWebDataStore } from '~/stores/webData'

// Assets por defecto (Placeholders)
import post1 from '~/assets/images/posts/1.png'
import post2 from '~/assets/images/posts/2.png'
import post3 from '~/assets/images/posts/3.png'

const store = useWebDataStore()
const dataReady = ref(false)
const year = new Date().getFullYear()

// ========= DATOS POR DEFECTO =========
const defaultFooterData = {
  instagram: {
    user: 'cuartosfrioscali',
    profileUrl: 'https://www.instagram.com/cuartosfrioscali/',
    avatar: 'https://i.pravatar.cc/120?img=3',
    posts: [
      { Image: post1, href: '' },
      { Image: post2, href: 'https://www.instagram.com/p/DBw8wABOpU8/' },
      { Image: post3, href: 'https://www.instagram.com/p/DBzSbIEPiC6/' },
      { Image: post1, href: '' },
      { Image: post2, href: '' },
      { Image: post3, href: '' }
    ]
  },
  contact: {
    subtitle: 'COBERTURA EN TODO EL TERRITORIO NACIONAL',
    phone: '+57 310 4080918',
    phoneLocal: '+57 310 4080918',
    email: 'ventas.ingmaster@gmail.com',
    address: 'Calle 31# 4 b 35 Porvenir',
    hrEmail: 'recursoshumanos.ingmaster@gmail.com',
    whatsapp: '573104080918'
  }
}

// ========= INIT STORE ROBUSTO =========
onMounted(async () => {
  if (!store.data) store.data = {}
  if (!store.data.footer) store.data.footer = {}

  const ensureStructure = (target: any, defaults: any) => {
    for (const key in defaults) {
      if (target[key] === undefined) {
        target[key] = JSON.parse(JSON.stringify(defaults[key]))
      } else if (typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key])) {
        ensureStructure(target[key], defaults[key])
      }
    }
  }

  ensureStructure(store.data.footer, defaultFooterData)
  dataReady.value = true
})

// ========= HELPERS =========
const markDirty = () => store.markAsDirty()

const resolveImage = (imgSource: string | undefined) => {
  if (!imgSource) return ''
  if (imgSource.startsWith('/') || imgSource.startsWith('data:') || imgSource.startsWith('http')) return imgSource
  return `https://backend.salchimonster.com/read-photo-product/${imgSource}`
}

// ========= INSTAGRAM LOGIC =========
const showCount = ref(6)

const visiblePosts = computed(() => {
  const posts = store.data.footer?.instagram?.posts || []
  return posts.slice(0, showCount.value)
})

const canLoadMore = computed(() => {
  const posts = store.data.footer?.instagram?.posts || []
  return showCount.value < posts.length
})

function loadMore() {
  if (store.data.footer?.instagram?.posts) {
    showCount.value = Math.min(showCount.value + 6, store.data.footer.instagram.posts.length)
  }
}

// Subir Avatar
const uploadAvatar = async (e: any) => {
  const file = e.target.files?.[0]
  if (!file) return
  const id = await store.uploadImage(file)
  if (id) {
    store.data.footer.instagram.avatar = id
    markDirty()
  }
}

// ========= EDITOR MODAL (IG Grid) =========
const editor = reactive({
  isOpen: false,
  tempData: [] as any[]
})

const openEditor = () => {
  if (store.data.footer?.instagram?.posts) {
    editor.tempData = JSON.parse(JSON.stringify(store.data.footer.instagram.posts))
    editor.isOpen = true
  }
}

const closeEditor = () => {
  editor.isOpen = false
  editor.tempData = []
}

const saveEditorChanges = () => {
  if (store.data.footer?.instagram) {
    store.data.footer.instagram.posts = JSON.parse(JSON.stringify(editor.tempData))
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
  if (confirm('¿Borrar este post?')) editor.tempData.splice(index, 1)
}

const addNewItem = () => {
  editor.tempData.unshift({ Image: post1, href: '' })
}

const clearPostImage = (index: number) => {
  if (!editor.tempData[index]) return
  editor.tempData[index].Image = ''
}

// Subir Imagen de un Post específico
const handlePostImageUpload = async (e: any, index: number) => {
  const file = e.target.files?.[0]
  if (!file) return
  const id = await store.uploadImage(file)
  if (id) editor.tempData[index].Image = id
}

// ===== WhatsApp flotante =====
const whatsMsg = encodeURIComponent('Hola, quiero más información.')
const whatsHref = computed(() => {
  const num = store.data.footer?.contact?.whatsapp || '573000000000'
  return `https://wa.me/${num}?text=${whatsMsg}`
})

// ===== Volver arriba =====
function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
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

/* Estilos para inputs editables */
.editable-input-simple {
  background: transparent;
  border: none;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
  color: inherit;
  font-family: inherit;
  width: 100%;
  min-width: 50px;
}
.editable-input-simple:focus {
  outline: none;
  border-bottom: 1px solid var(--accent);
  background: rgba(0, 0, 0, 0.2);
}

.editable-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  color: inherit;
  width: 100%;
  padding: 2px 5px;
  border-radius: 4px;
}
.editable-input:focus {
  outline: 1px solid var(--accent);
  background: rgba(255, 255, 255, 0.1);
}

.editable-input-black {
  background: #000;
  border: 1px solid #444;
  color: white;
  padding: 2px 5px;
  width: 120px;
}

.relative-parent {
  position: relative;
}
.edit-section-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 20;
  background: #ff9800;
  border: none;
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 999px;
  font-weight: 800;
  opacity: 0.7;
  transition: opacity 0.2s, transform 0.2s;
}
.edit-section-btn:hover {
  opacity: 1;
  transform: translateY(-1px);
}

.avatar-wrapper {
  position: relative;
  width: 38px;
  height: 38px;
}
.avatar-edit-btn {
  position: absolute;
  bottom: -5px;
  right: -10px;
  background: #333;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #fff;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.flex-row {
  display: flex;
  align-items: center;
}

/* Config WA flotante */
.wa-config {
  position: fixed;
  left: 80px;
  bottom: 16px;
  background: rgba(0, 0, 0, 0.8);
  padding: 5px 10px;
  border-radius: 8px;
  z-index: 29;
  display: flex;
  flex-direction: column;
}
.wa-config small {
  color: #aaa;
  font-size: 0.7rem;
}

/* ================== EDITOR (MEJORADO) ================== */
.editor-overlay {
  position: fixed;
  inset: 0;
  background: radial-gradient(1200px 600px at 30% 10%, rgba(103, 232, 249, 0.12), rgba(0, 0, 0, 0.85));
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px;
}
.editor-modal {
  width: min(920px, 100%);
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
  background: rgba(103, 232, 249, 0.14);
  border: 1px solid rgba(103, 232, 249, 0.22);
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
  background: rgba(103, 232, 249, 0.7);
  box-shadow: 0 0 0 6px rgba(103, 232, 249, 0.12);
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
  grid-template-columns: 1fr;
  gap: 12px;
}

.img-upload {
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 12px;
  align-items: center;
  padding: 10px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
}
.img-upload__preview {
  width: 84px;
  height: 84px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.35);
}
.img-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.img-upload__controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.file-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(103, 232, 249, 0.25);
  background: rgba(103, 232, 249, 0.14);
  color: white;
  cursor: pointer;
  font-weight: 900;
}
.ghost-btn {
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.92);
  cursor: pointer;
  font-weight: 800;
}
.ghost-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
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
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: white;
  padding: 10px 10px;
  border-radius: 12px;
  width: 100%;
  outline: none;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.field-input:focus {
  border-color: rgba(103, 232, 249, 0.5);
  background: rgba(255, 255, 255, 0.08);
}
.field-hint {
  margin: 0;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.62);
}

.editor-footer {
  padding: 12px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.18);
}
.editor-footer__right {
  display: flex;
  gap: 10px;
  align-items: center;
}
.btn--soft {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.14);
}

/* Responsive modal */
@media (max-width: 767px) {
  .editor-footer {
    flex-direction: column;
    align-items: stretch;
  }
  .editor-footer__right {
    justify-content: stretch;
  }
  .editor-footer__right .btn {
    width: 100%;
    justify-content: center;
  }
  .img-upload {
    grid-template-columns: 72px 1fr;
  }
  .img-upload__preview {
    width: 72px;
    height: 72px;
  }
}

/* ========================================= */
/* ESTILOS ORIGINALES (Mantener intactos) */
:root {
  --bg: #0b1f2a;
  --ink: #ffffff;
  --ink-dim: #cfe3ec;
  --accent: #0fb1c2;
  --line: rgba(255, 255, 255, 0.12);
}

.footer {
  background: var(--bg);
  color: var(--ink);
  border-top: 1px solid var(--line);
  position: relative;
  padding-bottom: 80px; /* espacio para flotantes */
}

/* ===== Container ===== */
.container {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

/* ===== Instagram ===== */
.ig {
  background: #0f2a38;
  border-bottom: 1px solid var(--line);
}
.ig__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  padding-top: 18px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-size: 0.82rem;
  color: var(--ink);
}
.ig__title-icon {
  font-size: 1.1rem;
  transform: translateY(-1px);
}

.ig__head {
  margin: 14px 0 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.ig__avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid var(--line);
  object-fit: cover;
}
.ig__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.ig__card {
  display: block;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--line);
}
.ig__card img {
  display: block;
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  transition: transform 0.2s ease;
}
.ig__card:hover img {
  transform: scale(1.03);
}

.ig__actions {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  justify-content: center;
  padding: 12px 0 18px;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 10px;
  padding: 0.62rem 1rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}
.btn--primary {
  background: var(--accent);
  color: #032229;
  border: 0;
}
.btn--primary:hover {
  filter: brightness(1.05);
}
.btn--ghost {
  background: transparent;
  border: 1px solid var(--line);
  color: var(--ink);
}
.btn--ghost:hover {
  background: rgba(255, 255, 255, 0.06);
}

/* ===== Footer Top ===== */
.footer__top {
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
  padding: 26px 0;
}

.col .tt {
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.88rem;
  margin: 0 0 0.75rem;
}
.tt--thin {
  letter-spacing: 0.06em;
  text-transform: none;
  font-weight: 700;
  margin-top: 10px;
}

.sub {
  color: var(--ink-dim);
  margin: 0.2rem 0 0.6rem;
}

/* Marca + mini links */
.mini-links {
  display: grid;
  gap: 0.35rem;
  margin-top: 10px;
}
.mini-links a {
  color: var(--ink-dim);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}
.mini-links a:hover {
  text-decoration: underline;
}

/* Divider */
.divider {
  height: 1px;
  background: var(--line);
  margin: 14px 0;
}

/* Copy */
.copy {
  text-align: center;
  font-size: 0.85rem;
  color: var(--ink-dim);
  border-top: 1px solid var(--line);
  padding: 14px 1.25rem;
  background: #0b1f2a;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  justify-content: center;
}

/* Flotantes */
.wa {
  position: fixed;
  left: 16px;
  bottom: 16px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #25d366;
  display: grid;
  place-items: center;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  z-index: 30;
  font-size: 28px;
  color: #fff;
}

.to-top {
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 0;
  background: #0e2a39;
  color: var(--ink);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  z-index: 30;
  display: grid;
  place-items: center;
  font-size: 24px;
}

/* Responsive */
@media (min-width: 768px) {
  .ig__grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
  }
  .footer__top {
    grid-template-columns: 1.2fr 0.8fr 0.9fr;
    gap: 32px;
    padding: 34px 0;
  }
}

/* ===== Fix: paddings de contenedor en mobile ===== */
@media (max-width: 767.98px) {
  .container {
    padding-left: 18px;
    padding-right: 18px;
  }
  .ig .container {
    padding-left: 18px;
    padding-right: 18px;
  }
  .copy {
    padding-left: 18px;
    padding-right: 18px;
  }
}
</style>
