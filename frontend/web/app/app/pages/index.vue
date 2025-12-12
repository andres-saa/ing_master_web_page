<template>
  <ClientOnly>
    <main class="site" v-if="dataReady && store.data.home">
      <!-- ================== EDITOR MODAL ================== -->
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
                <div class="editor-badge">Editor</div>
                <div class="editor-title-wrap">
                  <h3 class="editor-title">Editando</h3>
                  <p class="editor-subtitle">{{ prettySectionName(editor.sectionName) }}</p>
                </div>
              </div>

              <div class="editor-header__right">
                <button class="icon-btn" @click="closeEditor" aria-label="Cerrar">
                  ✕
                </button>
              </div>
            </header>

            <div class="editor-body">
              <div v-if="!editor.tempData || editor.tempData.length === 0" class="editor-empty">
                <p class="editor-empty__title">No hay elementos en esta sección.</p>
                <p class="editor-empty__text">Agrega el primer item para empezar a editar.</p>
                <button @click="addNewItem" class="btn btn--primary">
                  + Agregar item
                </button>
              </div>

              <div v-else class="editor-list">
                <div v-for="(item, idx) in editor.tempData" :key="idx" class="editor-item">
                  <div class="editor-item__top">
                    <div class="editor-index">
                      <span class="editor-index__dot"></span>
                      <span>Item {{ idx + 1 }}</span>
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
                    <!-- Imagen (si aplica) -->
                    <div v-if="hasImageField(item) || typeof item === 'string'" class="field-group">
                      <label class="field-label">Imagen</label>

                      <div class="img-upload">
                        <div class="img-upload__preview">
                          <img
                            :src="resolveImage(typeof item === 'string' ? item : (item.image || item.logo))"
                            class="img-preview"
                            alt="Preview"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>

                        <div class="img-upload__controls">
                          <label class="file-btn">
                            <span>📷 Cambiar</span>
                            <input type="file" hidden @change="(e) => handleListImageUpload(e, idx)" accept="image/*" />
                          </label>

                          <button
                            class="ghost-btn"
                            type="button"
                            @click="clearItemImage(idx)"
                            :disabled="!getItemImage(editor.tempData[idx])"
                            title="Quitar imagen"
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Campos (si es objeto) -->
                    <template v-if="typeof item === 'object' && item">
                      <div class="fields-grid">
                        <template v-for="(val, key) in item" :key="key">
                          <div v-if="isEditableField(String(key))" class="field-group">
                            <label class="field-label">
                              {{ prettyKey(String(key)) }}
                            </label>

                            <textarea
                              v-if="String(key) === 'description' || String(key) === 'text' || String(key) === 'lead'"
                              v-model="item[key]"
                              class="field-input field-textarea"
                              rows="3"
                            />
                            <input
                              v-else
                              v-model="item[key]"
                              class="field-input"
                              type="text"
                              autocomplete="off"
                            />
                          </div>
                        </template>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <footer class="editor-footer">
              <div class="editor-footer__left">
                <button @click="addNewItem" class="btn btn--soft">
                  + Agregar item
                </button>
              </div>

              <div class="editor-footer__right">
                <button @click="closeEditor" class="btn btn--ghost">
                  Cancelar
                </button>
                <button @click="saveEditorChanges" class="btn btn--primary">
                  Guardar cambios
                </button>
              </div>
            </footer>
          </div>
        </div>
      </Transition>

      <!-- ================== HERO ================== -->
      <section
        class="hero section"
        :style="{
          backgroundImage: `linear-gradient(rgba(7,20,28,.65), rgba(7,20,28,.75)), url(${resolveImage(store.data.home.hero.bg)})`
        }"
      >
        <div class="hero__edit-btn">
          <label class="btn btn--small">
            📷 Cambiar Fondo
            <input type="file" hidden @change="uploadHeroBg" />
          </label>
        </div>

        <div class="hero__inner container">
          <div class="brand" v-reveal>
            <input v-model="store.data.home.hero.tag" @input="markDirty" class="editable-input brand__tag" />
          </div>

          <textarea
            v-model="store.data.home.hero.title"
            @input="markDirty"
            class="editable-input hero__title"
            rows="2"
          />

          <ul class="hero__chips" v-reveal>
            <li v-for="(chip, i) in store.data.home.hero.chips" :key="i" class="chip">
              <input v-model="store.data.home.hero.chips[i]" @input="markDirty" class="editable-input-simple" />
            </li>
          </ul>

          <div style="display: flex; justify-content: end" v-reveal>
            <NuxtLink to="#servicios" class="btn btn--primary" style="width: max-content">Ver más</NuxtLink>
          </div>
        </div>
      </section>

      <!-- ================== STRIP ================== -->
      <section class="strip section relative-parent">
        <button class="edit-section-btn" @click="openEditor('strip', store.data.home.strip)">⚙️ Editar Iconos</button>

        <div class="strip__grid container">
          <div v-for="item in store.data.home.strip" :key="item.label" class="strip__item" v-reveal>
            <component :is="getIconComponent(item.iconData)" class="strip__icon" />
            <span class="strip__label">{{ item.label }}</span>
          </div>
        </div>
      </section>

      <!-- ================== METRICS ================== -->
      <section ref="metricsSectionEl" class="metrics section relative-parent">
        <button class="edit-section-btn" @click="openEditor('metrics', store.data.home.metrics)">⚙️ Editar Métricas</button>

        <div class="container center">
          <input
            v-model="store.data.home.metricsInfo.eyebrow"
            @input="markDirty"
            class="editable-input eyebrow center-text"
          />
          <textarea
            v-model="store.data.home.metricsInfo.title"
            @input="markDirty"
            class="editable-input section__title center-text"
            rows="2"
          />
          <textarea
            v-model="store.data.home.metricsInfo.lead"
            @input="markDirty"
            class="editable-input section__lead center-text"
            rows="3"
          />

          <div class="metrics__grid">
            <div v-for="m in metricStates" :key="m.label" class="metric card-soft" v-reveal>
              <div class="metric__value">
                {{ formatDisplay(m.current, m.suffix, m.decimals) }}
              </div>
              <div class="metric__label">{{ m.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ================== SERVICES ================== -->
      <section id="servicios" class="services section relative-parent">
        <button class="edit-section-btn" @click="openEditor('services', store.data.home.services)">⚙️ Editar Servicios</button>

        <article
          v-for="(s, i) in store.data.home.services"
          :key="s.title || i"
          class="service surface"
          :class="{ 'service--invert': i % 2 === 1 }"
          v-reveal
        >
          <div class="service__inner container">
            <div class="service__media" v-reveal>
              <img
                style="aspect-ratio: 1/1; object-fit: cover; border-radius: 0.3rem"
                :src="resolveImage(s.image)"
                :alt="s.title"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="service__content" v-reveal>
              <p class="eyebrow">{{ s.category }}</p>
              <h3 class="service__title">{{ s.title }}</h3>
              <p class="service__text">{{ s.description }}</p>
              <NuxtLink :to="s.href" class="btn btn--primary" style="margin: 1rem 0">Ver más</NuxtLink>
            </div>
          </div>
        </article>
      </section>

      <!-- ================== BRANDS ================== -->
      <section class="brands section relative-parent">
        <button class="edit-section-btn" @click="openEditor('brands', store.data.home.brands)">⚙️ Editar Marcas</button>

        <div class="container center">
          <h3 class="section__title" v-reveal>Marcas líderes que nos respaldan</h3>

          <div class="brands__grid">
            <img
              style="width: 100%; height: 100%; aspect-ratio: 1 / 1; object-fit: contain"
              v-for="(logo, idx) in store.data.home.brands"
              :key="idx"
              :src="resolveImage(logo)"
              alt="Marca"
              v-reveal
            />
          </div>
        </div>
      </section>

      <!-- ================== IMPACT ================== -->
      <section class="impact section relative-parent">
        <button class="edit-section-btn" @click="openEditor('features', store.data.home.features)">⚙️ Editar Impacto</button>

        <div class="container">
          <h3 class="section__title center" v-reveal>Nuestro impacto</h3>

          <div class="impact__grid">
            <article v-for="f in store.data.home.features" :key="f.title" class="card" v-reveal>
              <div class="card__icon-placeholder">
                <component :is="getIconComponent(f.iconData)" class="strip__icon" />
              </div>
              <h4 class="card__title">{{ f.title }}</h4>
              <p class="card__text">{{ f.text }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- ================== CLIENTS ================== -->
      <section class="clients section relative-parent">
        <button class="edit-section-btn" @click="openEditor('clients', store.data.home.clients)">⚙️ Editar Clientes</button>

        <div class="container center">
          <h3 class="section__title" v-reveal>Alcance y sectores</h3>

          <div class="clients__grid">
            <img
              style="width: 100%; height: 100%; aspect-ratio: 1 / 1; object-fit: contain"
              v-for="(logo, idx) in store.data.home.clients"
              :key="idx"
              :src="resolveImage(logo)"
              alt="Cliente"
              v-reveal
            />
          </div>
        </div>
      </section>
    </main>
  </ClientOnly>
</template>

<script setup lang="ts">
import { defineComponent, h, onMounted, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useWebDataStore } from '~/stores/webData'

// === ASSETS ESTATICOS (Fallback) ===
import hero from '~/assets/images/hero.jpeg'
import imgcuartosfiros from '~/assets/images/cuartos.jpg'
import imgMantenimiento from '~/assets/images/mantenimiento.jpg'
import imgSalaProceso from '~/assets/images/salaProceso.jpeg'
import clienteLogo1 from '~/assets/images/brands/1.png'
import clienteLogo2 from '~/assets/images/brands/2.png'
import clienteLogo3 from '~/assets/images/brands/3.png'
import clienteLogo4 from '~/assets/images/brands/4.png'
import clienteLogo5 from '~/assets/images/brands/5.png'
import clienteLogo6 from '~/assets/images/brands/6.png'

const store = useWebDataStore()
const dataReady = ref(false)

// ========= ICONOS =========
const makeIcon = (d: string) =>
  defineComponent({
    name: 'Ic',
    setup() {
      return () =>
        h(
          'svg',
          { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor', class: 'i', 'aria-hidden': 'true' },
          [h('path', { d })]
        )
    }
  })

const getIconComponent = (d: string | undefined) => {
  if (!d) return makeIcon('M12 2a10 10 0 100 20 10 10 0 000-20zm1 5v5l4 2')
  return makeIcon(d)
}

// ========= DATA DEFAULT (Fuente de verdad) =========
const defaultData = {
  hero: {
    bg: hero,
    tag: 'Ingeniería en refrigeración',
    title: '10 años construyendo soluciones de refrigeración industrial',
    chips: ['10+ años', '97% de proyectos con referencias', '570 proyectos realizados']
  },
  strip: [
    {
      label: 'Cuartos fríos',
      iconData:
        'M12 2a1 1 0 011 1v3.382l2.121-2.121a1 1 0 111.415 1.414L13 8.707V11h2.293l3.032-3.032a1 1 0 111.414 1.415L17.414 12l2.325 2.325a1 1 0 11-1.414 1.414L15.293 13H13v2.293l2.032 2.032a1 1 0 11-1.414 1.414L13 18.618V21a1 1 0 11-2 0v-2.382l-2.121 2.121a1 1 0 11-1.415-1.414L11 15.293V13H8.707l-3.032 3.032a1 1 0 01-1.414-1.414L6.586 12 4.261 9.675a1 1 0 011.414-1.415L8.707 11H11V8.707L8.968 6.675a1 1 0 011.414-1.414L11 6.382V3a1 1 0 011-1z'
    },
    { label: 'Servicios', iconData: 'M21.164 7.07l-3.95 3.95a3 3 0 11-4.243-4.242l3.95-3.95a5 5 0 106.243 6.243zM3 14a3 3 0 013-3h3l3 3-6 6H6a3 3 0 01-3-3v-3z' },
    { label: 'Industria', iconData: 'M2 21V9l7 3V9l7 3V9l6 3v9H2zm5-4h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM7 13h2v2H7v-2zm4 0h2v2h-2v-2z' },
    { label: 'Procesos', iconData: 'M12 3a9 9 0 109 9 1 1 0 10-2 0 7 7 0 11-7-7 1 1 0 000-2zm4.243 4.757a1 1 0 00-1.414 0l-3.182 3.182A2 2 0 0011 12a2 2 0 102 1.353l3.182-3.182a1 1 0 000-1.414z' },
    { label: 'Mantenimiento', iconData: 'M21 7.5a4.5 4.5 0 01-7.374 3.44L6.56 18.005a2 2 0 11-2.828-2.828l7.065-7.065A4.5 4.5 0 1121 7.5z' },
    { label: 'Salas', iconData: 'M11 2.06a1 1 0 011 0l8 4.62a1 1 0 010 1.73l-8 4.62a1 1 0 01-1 0l-8-4.62a1 1 0 010-1.73l8-4.62zM3.06 11.5L11 16.1a1 1 0 001 0l7.94-4.6V18a1 1 0 01-.5.866l-7.5 4.33a1 1 0 01-1 0l-7.5-4.33A1 1 0 013.06 18V11.5z' },
    { label: 'Asesorías', iconData: 'M12 12a5 5 0 10-5-5 5 5 0 005 5zm-7 9a7 7 0 1114 0v1H5z' }
  ],
  metricsInfo: {
    eyebrow: 'Ingenieria Master S.A.S.',
    title: 'Proyectos frigoríficos con los más altos estándares de calidad',
    lead: 'Más de 10 años de experiencia, calidad certificada y soluciones a la medida para la cadena de frío en la industria alimentaria, farmacéutica y logística.'
  },
  metrics: [
    { value: 10, label: 'Años de experiencia' },
    { value: '97%', label: 'de proyectos con referencias' },
    { value: '570', label: 'proyectos realizados' },
    { value: 25, label: 'colaboradores a su servicio' }
  ],
  services: [
    {
      category: 'Refrigeración industrial',
      title: 'Cuartos fríos',
      description: 'Diseño, fabricación e instalación de cuartos fríos a la medida para conservación, congelación y procesos especiales de la cadena de frío.',
      image: imgcuartosfiros,
      href: '/servicios/cuartos-frios'
    },
    {
      category: 'Refrigeración comercial',
      title: 'Mantenimiento',
      description: 'Planes preventivos y correctivos, auditorías de desempeño  para maximizar la disponibilidad de sus equipos.',
      image: imgMantenimiento,
      href: '/servicios/mantenimiento'
    },
    {
      category: 'Refrigeración industrial',
      title: 'Salas de proceso o acondicionamiento',
      description: 'Diseño de salas limpias y áreas de proceso con control térmico, de humedad y calidad del aire para alimentos y farmacéutica.',
      image: imgSalaProceso,
      href: '/servicios/salas-de-proceso'
    }
  ],
  brands: [clienteLogo1, clienteLogo2, clienteLogo3, clienteLogo4, clienteLogo5, clienteLogo6],
  features: [
    { title: 'Eficiencia energética', text: 'Diseños optimizados para menor consumo y mayor vida útil.', iconData: 'M12 2a10 10 0 100 20 10 10 0 000-20zm1 5v5l4 2' },
    { title: 'Calidad certificada', text: 'Componentes y procesos con garantía y trazabilidad.', iconData: 'M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5 20l2-7L2 9h7z' },
    { title: 'Cobertura nacional', text: 'Atención en múltiples ciudades con equipos in-house.', iconData: 'M3 11h18v2H3z M12 3v18' }
  ],
  clients: Array(6).fill(hero)
}

// ========= INIT DATOS (MERGE) =========
onMounted(() => {
  if (!store.data) store.data = {}
  if (!store.data.home) store.data.home = {}

  const currentHome: any = store.data.home
  for (const key in defaultData) {
    const v = (currentHome as any)[key]
    if (!v || (Array.isArray(v) && v.length === 0)) {
      ;(currentHome as any)[key] = JSON.parse(JSON.stringify((defaultData as any)[key]))
    }
  }

  store.data.home = { ...currentHome }
  dataReady.value = true
})

// ========= HELPER IMÁGENES =========
const resolveImage = (imgSource: string | null | undefined) => {
  if (!imgSource) return ''
  if (imgSource.startsWith('/') || imgSource.startsWith('data:') || imgSource.includes('assets') || imgSource.startsWith('http')) {
    return imgSource
  }
  return `https://backend.salchimonster.com/read-photo-product/${imgSource}`
}

// ========= LÓGICA DE EDICIÓN Y UPLOAD =========
const markDirty = () => {
  store.markAsDirty()
}

const uploadHeroBg = async (event: any) => {
  const file = event.target.files?.[0]
  if (!file) return
  const id = await store.uploadImage(file)
  if (id) {
    store.data.home.hero.bg = id
    markDirty()
  }
}

// --- Editor Modal Logic ---
const editor = reactive({
  isOpen: false,
  sectionName: '',
  targetArray: null as any[] | null,
  tempData: [] as any[]
})

const openEditor = (name: string, dataArray: any[]) => {
  editor.sectionName = name
  editor.targetArray = dataArray
  editor.tempData = JSON.parse(JSON.stringify(dataArray ?? []))
  editor.isOpen = true
}

const closeEditor = () => {
  editor.isOpen = false
  editor.targetArray = null
  editor.tempData = []
}

const saveEditorChanges = () => {
  if (store.data.home && editor.sectionName) {
    ;(store.data.home as any)[editor.sectionName] = JSON.parse(JSON.stringify(editor.tempData))
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
  if (confirm('¿Eliminar este item?')) editor.tempData.splice(index, 1)
}

const addNewItem = () => {
  if (editor.tempData.length > 0) {
    const template = JSON.parse(JSON.stringify(editor.tempData[0]))
    if (typeof template === 'string') {
      editor.tempData.push(template)
      return
    }
    for (const key in template) {
      if (typeof template[key] === 'string' && key !== 'icon' && key !== 'iconData') {
        template[key] = key === 'href' ? '/' : `Nuevo ${key}`
      }
    }
    editor.tempData.push(template)
  } else {
    editor.tempData.push({ title: 'Nuevo Item', text: 'Descripción' })
  }
}

const hasImageField = (item: any) => typeof item === 'object' && item && ('image' in item || 'logo' in item)

const isEditableField = (key: string) => {
  // iconData: se edita en tu flujo del strip/features; imagen por upload.
  const ignored = ['image', 'logo', 'icon', 'iconData']
  return !ignored.includes(key)
}

const handleListImageUpload = async (event: any, index: number) => {
  const file = event.target.files?.[0]
  if (!file) return
  const id = await store.uploadImage(file)
  if (!id) return

  const item = editor.tempData[index]
  if (typeof item === 'string') {
    editor.tempData[index] = id
  } else {
    if (item.image !== undefined) item.image = id
    else if (item.logo !== undefined) item.logo = id
    else item.image = id
  }
}

const getItemImage = (item: any): string | null => {
  if (!item) return null
  if (typeof item === 'string') return item
  return item.image || item.logo || null
}

const clearItemImage = (index: number) => {
  const item = editor.tempData[index]
  if (!item) return
  if (typeof item === 'string') editor.tempData[index] = ''
  else {
    if ('image' in item) item.image = ''
    if ('logo' in item) item.logo = ''
  }
}

// ========= UX HELPERS =========
const prettySectionName = (s: string) => {
  const map: Record<string, string> = {
    strip: 'Iconos (strip)',
    metrics: 'Métricas',
    services: 'Servicios',
    brands: 'Marcas',
    features: 'Impacto',
    clients: 'Clientes'
  }
  return map[s] || s
}

const prettyKey = (k: string) => {
  const map: Record<string, string> = {
    title: 'Título',
    text: 'Texto',
    description: 'Descripción',
    label: 'Etiqueta',
    category: 'Categoría',
    href: 'Link (href)',
    value: 'Valor',
    eyebrow: 'Eyebrow',
    lead: 'Texto (lead)'
  }
  return map[k] || k
}

// ========= LÓGICA DE MÉTRICAS =========
const metricStates = ref<any[]>([])
const metricsSectionEl = ref<HTMLElement | null>(null)
let metricsObserver: IntersectionObserver | null = null
let rafId: number | null = null
let metricsAnimated = false

function normalizeMetric(v: number | string) {
  let suffix = ''
  let decimals = 0
  if (typeof v === 'string') {
    const hasPercent = v.trim().endsWith('%')
    if (hasPercent) {
      suffix = '%'
      v = v.trim().slice(0, -1)
    }
    const onlyDigits = v.replace(/\./g, '').replace(',', '.')
    const parsed = Number(onlyDigits)
    return { target: isNaN(parsed) ? 0 : parsed, suffix, decimals }
  }
  return { target: typeof v === 'number' ? v : 0, suffix: '', decimals: 0 }
}

const nf = new Intl.NumberFormat('es-CO')
function formatDisplay(value: number, suffix = '', decimals = 0) {
  const rounded = decimals > 0 ? Number(value.toFixed(decimals)) : Math.round(value)
  const base = nf.format(rounded)
  return suffix ? `${base}${suffix}` : base
}

function animateMetrics(duration = 1200) {
  const start = performance.now()
  const from = metricStates.value.map(m => m.current)
  const to = metricStates.value.map(m => m.target)

  const tick = (t: number) => {
    const elapsed = t - start
    const p = Math.min(1, elapsed / duration)
    const e = 1 - Math.pow(1 - p, 3)

    metricStates.value.forEach((m, i) => {
      m.current = from[i] + (to[i] - from[i]) * e
    })

    if (p < 1) rafId = requestAnimationFrame(tick)
    else {
      metricStates.value.forEach((m, i) => (m.current = to[i]))
      rafId = null
    }
  }
  rafId = requestAnimationFrame(tick)
}

watch(
  () => store.data.home?.metrics,
  newMetrics => {
    if (!newMetrics) return
    metricStates.value = newMetrics.map((m: any) => {
      const n = normalizeMetric(m.value)
      return { label: m.label, target: n.target, current: 0, suffix: n.suffix, decimals: n.decimals }
    })
    if (metricsAnimated && metricsObserver) animateMetrics(1000)
  },
  { immediate: true, deep: true }
)

// ========= DIRECTIVAS =========
const vReveal = {
  mounted(el: HTMLElement) {
    el.classList.add('reveal')
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            el.classList.add('is-in')
            obs.unobserve(el)
          }
        })
      },
      { threshold: 0.25 }
    )
    io.observe(el)
  }
}

onMounted(() => {
  if (metricsSectionEl.value) {
    metricsObserver = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            metricsAnimated = true
            animateMetrics(1300)
            metricsObserver?.unobserve(e.target)
          }
        })
      },
      { threshold: 0.6 }
    )
    metricsObserver.observe(metricsSectionEl.value)
  }
})

onBeforeUnmount(() => {
  metricsObserver?.disconnect()
  if (rafId) cancelAnimationFrame(rafId)
})
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

/* ====== MISMOS ESTILOS QUE YA TENIAS ====== */
/* Ajustes adicionales para el editor */
.editable-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px dashed rgba(255, 255, 255, 0.3);
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  width: 100%;
  padding: 0.2rem;
  border-radius: 4px;
}
.editable-input:focus {
  background: rgba(0, 0, 0, 0.5);
  outline: 2px solid var(--sky);
}
.editable-input-simple {
  background: transparent;
  border: none;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
  color: inherit;
  width: 100%;
}
.center-text {
  text-align: center;
}

.relative-parent {
  position: relative;
}
.edit-section-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 50;
  background: #ff9800;
  color: black;
  border: none;
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 800;
  opacity: 0.65;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.edit-section-btn:hover {
  opacity: 1;
  transform: translateY(-1px);
}
.hero__edit-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 20;
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
  padding: 14px 14px;
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
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fields-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
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
.field-textarea {
  resize: vertical;
  min-height: 84px;
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

/* Botones extra para editor */
.btn--ghost {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.92);
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.14);
}
.btn--soft {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.14);
}

/* ====== Base CSS (lo tuyo) ====== */
* {
  box-sizing: border-box;
}
html,
body {
  margin: 0;
  padding: 0;
}
body {
  background: var(--bg) no-repeat fixed center/cover;
  color: var(--ink);
  font-family: ui-sans-serif, system-ui;
}
.site {
  position: relative;
  min-height: 100dvh;
}
.site::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, rgba(7, 19, 26, 0.75), rgba(7, 19, 26, 0.85)),
    url('https://elcomercio.pe/resizer/v2/6Y2EDIISGFGVFANEVDCR5LCG34.jpg?auth=f58b5c647a09717054d85bb8b9a6bc624bfcb14fe9c60b5246730ea6a513e2b0&width=1198&height=690&quality=75&smart=true')
      center/cover no-repeat fixed;
  filter: saturate(1) contrast(1.05);
}
.container {
  max-width: 1160px;
  margin: 0 auto;
}
@media (max-width: 767px) {
  .container {
    padding: 0 1rem;
  }
}
.center {
  text-align: center;
}
.eyebrow {
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-size: 0.62rem;
  color: var(--sky-2);
  opacity: 0.9;
  margin: 0 0 0.5rem;
}
.section__title {
  font-size: 1.7rem;
  line-height: 1.25;
  margin: 0 0 0.5rem;
  background: transparent;
  border: none;
  width: 100%;
  color: inherit;
}
.section__lead {
  max-width: 720px;
  margin: 0.5rem auto 0;
  color: var(--ink-dim);
  background: transparent;
  border: none;
  width: 100%;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.7rem 1.1rem;
  font-weight: 700;
  border: 0;
  cursor: pointer;
  text-decoration: none;
}
.btn--small {
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  background: white;
  color: black;
}
.btn--primary {
  background: var(--sky);
  color: #06202a;
  box-shadow: 0 6px 20px rgba(103, 232, 249, 0.25);
}
.btn--primary:hover {
  transform: translateY(-1px);
}
.section {
  padding-block: 2rem;
}
.reveal {
  opacity: 0;
  transform: translatex(-16px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.is-in {
  opacity: 1;
  transform: translatex(0);
}
.surface {
  background: rgba(7, 19, 26, 0.55);
  backdrop-filter: blur(6px);
  border: 1px solid var(--line);
  border-radius: 16px;
}
.card {
  border: 1px solid var(--line);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  padding: 18px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.25);
}
.card-soft {
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  padding: 16px;
}
.hero {
  min-height: 68vh;
  display: flex;
  align-items: center;
  background-position: center;
  background-size: cover;
  border-bottom: 1px solid var(--line);
  position: relative;
}
.hero__inner {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-block: 24px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.brand__logo {
  height: 42px;
}
.brand__tag {
  font-size: 0.72rem;
  letter-spacing: 0.25em;
  opacity: 0.95;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--line);
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
}
.hero__title {
  font-size: clamp(1.8rem, 3.4vw, 3rem);
  line-height: 1.15;
  max-width: 780px;
  margin: 0;
  text-wrap: balance;
}
.hero__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.65rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chip {
  font-size: 0.78rem;
  padding: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);
  border: 1px solid var(--line);
}
.chip input {
  padding: 0.4rem 0.65rem;
}
.strip {
  border-block: 1px solid var(--line);
  background: rgba(7, 19, 26, 0.5);
  backdrop-filter: blur(3px);
}
.strip__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  justify-items: center;
  padding: 18px 0;
}
.strip__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.95;
}
.strip__icon,
.i {
  width: 26px;
  height: 26px;
}
.strip__label {
  font-size: 0.8rem;
  color: var(--ink-dim);
}
.metrics__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  margin-top: 22px;
}
.metric {
  padding: 10px;
}
.metric__value {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--sky);
  opacity: 0.95;
}
.metric__label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--ink-dim);
}
.services {
  background: rgba(7, 19, 26, 0.45);
  padding: 1rem;
}
.service {
  border-radius: 18px;
  overflow: clip;
  margin-block: 20px;
}
.service__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  align-items: center;
  padding: 26px;
}
.service--invert .service__inner {
  direction: rtl;
}
.service--invert .service__content {
  direction: ltr;
}
.service__media img {
  max-width: 560px;
  width: 100%;
  display: block;
  margin: 0 auto;
  filter: drop-shadow(0 24px 40px rgba(0, 0, 0, 0.5));
}
.service__title {
  font-size: 1.6rem;
  margin: 0.25rem 0 0.5rem;
}
.service__text {
  color: var(--ink-dim);
  max-width: 60ch;
}
.brands {
  background: rgba(7, 19, 26, 0.45);
}
.brands__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  justify-items: center;
  margin-top: 18px;
}
.brands__grid img {
  height: 44px;
  opacity: 0.9;
  padding: 2rem;
  background-color: white;
  border-radius: 0.3rem;
  box-shadow: 0 0 1rem black;
}
.impact {
  background: rgba(7, 19, 26, 0.45);
}
.impact__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
.card__icon {
  width: 30px;
  height: 30px;
  margin-bottom: 10px;
}
.card__icon-placeholder {
  font-size: 30px;
  color: var(--sky);
  margin-bottom: 10px;
}
.card__title {
  margin: 0.25rem 0;
  font-weight: 800;
}
.card__text {
  color: var(--ink-dim);
}
.clients {
  background: rgba(7, 19, 26, 0.45);
}
.clients__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  justify-items: center;
  margin-top: 18px;
}
.clients__grid img {
  height: 40px;
  opacity: 0.95;
  mix-blend-mode: screen;
}

@media (min-width: 768px) {
  .strip__grid {
    grid-template-columns: repeat(7, 1fr);
    gap: 24px;
  }
  .metrics__grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .service__inner {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    padding: 34px;
  }
  .brands__grid {
    grid-template-columns: repeat(5, 1fr);
  }
  .impact__grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .clients__grid {
    grid-template-columns: repeat(6, 1fr);
  }

  /* Editor: más columnas en desktop */
  .fields-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 767px) {
  .card,
  .card-soft,
  .surface,
  .service {
    border: 0 !important;
    padding: 0 !important;
    box-shadow: none;
    background: transparent;
  }
  .service__inner {
    padding: 0 !important;
    gap: 16px;
  }
  .metric {
    padding: 0 !important;
  }
  .brands__grid img {
    padding: 0.5rem !important;
    box-shadow: none;
  }

  .editor-modal {
    border-radius: 16px;
  }
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
</style>
