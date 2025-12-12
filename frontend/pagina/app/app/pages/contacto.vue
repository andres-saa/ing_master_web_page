<!-- pages/contacto.vue (MODO MOSTRAR - lee del store guardado por el CMS) -->
<template>
  <ClientOnly>
    <main class="contact" v-if="dataReady">
      <!-- ======= HERO ======= -->
      <section
        v-if="showHero"
        class="hero"
        :style="{
          backgroundImage:
            `linear-gradient(rgba(7,20,28,.65), rgba(7,20,28,.82)), url(${heroBgResolved})`
        }"
      >
        <div class="container">
          <h1 class="hero__title">{{ contacto.hero.title || 'CONTÁCTENOS' }}</h1>
        </div>
      </section>

      <!-- ======= HERO SIMPLE (solo frase) ======= -->
      <section v-else class="hero hero--plain">
        <div class="container">
          <h1 class="hero__title hero__title--plain">{{ contacto.hero.title || 'CONTÁCTENOS' }}</h1>
        </div>
      </section>

      <!-- ======= CONTENIDO ======= -->
      <section class="section">
        <div class="container grid">
          <!-- ======= FORM ======= -->
          <form class="card form" @submit.prevent="onSubmit">
            <!-- Honeypot anti-spam -->
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
              <label class="label">Empresa</label>
              <input v-model.trim="form.company" type="text" placeholder="Nombre de la empresa" />
            </div>

            <div class="field">
              <label class="label">Ciudad</label>
              <input v-model.trim="form.city" type="text" placeholder="Ciudad" />
            </div>

            <div class="field">
              <label class="label">Asunto</label>
              <input v-model.trim="form.subject" type="text" placeholder="Asunto" />
            </div>

            <div class="field">
              <label class="label">Su mensaje</label>
              <textarea v-model.trim="form.message" rows="6" placeholder="Cuéntenos brevemente su necesidad…" required />
            </div>

            <div class="actions">
              <button class="btn" type="submit" :disabled="submitting">
                {{ submitting ? 'Enviando…' : 'Enviar' }}
              </button>
              <p v-if="error" class="feedback error">{{ error }}</p>
              <p v-if="ok" class="feedback ok">¡Gracias! Te contactaremos muy pronto.</p>
            </div>
          </form>

          <!-- ======= LADO DERECHO ======= -->
          <aside class="side">
            <p class="eyebrow">{{ contacto.sidebar.eyebrow }}</p>
            <h2 class="headline">{{ contacto.sidebar.headline }}</h2>
            <hr class="sep" />
            <p class="copy">
              {{ contacto.sidebar.description }}
            </p>

            <ul class="contact-list">
              <li v-for="(item, i) in contacto.sidebar.list" :key="i">
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
import { reactive, ref, computed, withDefaults, onMounted } from 'vue'
import heroFallback from '~/assets/images/hero.jpeg'
import { useWebDataStore } from '~/stores/webData'

type ContactListItem = { label: string; text: string; href?: string }
type ContactData = {
  hero: { bg: string; title: string }
  sidebar: {
    eyebrow: string
    headline: string
    description: string
    list: ContactListItem[]
  }
}

const store = useWebDataStore()
const dataReady = ref(false)

/** Props */
const props = withDefaults(defineProps<{ show_hero?: boolean }>(), { show_hero: true })
const showHero = computed(() => props.show_hero)

/** Defaults (mismo shape que el CMS) */
const defaultContactData: ContactData = {
  hero: { bg: heroFallback as unknown as string, title: 'CONTÁCTENOS' },
  sidebar: {
    eyebrow: 'Permítanos asesorarlo',
    headline: 'Solicite una cotización a su medida',
    description:
      'Envíenos sus datos y uno de nuestros asesores se pondrá en contacto a la mayor brevedad posible. En Ingeniería Master diseñamos, construimos y mantenemos soluciones de refrigeración industrial a la medida de su operación.',
    list: [
      { label: 'Email', text: 'contacto@ingenieriamaster.com', href: 'mailto:contacto@ingenieriamaster.com' },
      { label: 'Teléfono', text: '+57 (604) 444 8735', href: 'tel:+576044448735' },
      { label: 'Medellín', text: 'Carrera 46 N. 48C Sur 40 – Int. 104', href: '' }
    ]
  }
}

/** Deep merge seguro para “rellenar” lo que falte */
function ensureStructure(target: any, defaults: any) {
  for (const key in defaults) {
    const dv = defaults[key]
    const tv = target?.[key]

    if (tv === undefined || tv === null) {
      target[key] = JSON.parse(JSON.stringify(dv))
      continue
    }

    // objetos (no arrays)
    if (typeof dv === 'object' && dv !== null && !Array.isArray(dv)) {
      if (typeof tv !== 'object' || tv === null || Array.isArray(tv)) {
        target[key] = JSON.parse(JSON.stringify(dv))
      } else {
        ensureStructure(target[key], dv)
      }
    }
  }
}

/** Resolver imagen: id del backend / url / dataUrl / ruta */
const resolveImage = (imgSource: string | null | undefined) => {
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

onMounted(async () => {
  // Si tu store tiene algún método para cargar persistencia manual, lo llamas aquí.
  // (No asumo nombres. Si no existe, no pasa nada.)
  try {
    // @ts-ignore
    if (!store.isLoaded && typeof store.initData === 'function') await store.initData()
    // @ts-ignore
    if (!store.isLoaded && typeof store.loadFromStorage === 'function') await store.loadFromStorage()
  } catch (e) {
    // silencioso: seguimos con defaults + lo que exista
  }

  if (!store.data) store.data = {}
  if (!store.data.contacto) store.data.contacto = {}

  ensureStructure(store.data.contacto, defaultContactData)
  dataReady.value = true
})

/** Data final (ya “asegurada”) */
const contacto = computed<ContactData>(() => store.data.contacto as ContactData)
const heroBgResolved = computed(() => resolveImage(contacto.value.hero.bg))

// ========= FORM (Usuario final) =========
type Form = {
  name: string
  email: string
  phone: string
  company: string
  city: string
  subject: string
  message: string
  _robot?: string
}

const form = reactive<Form>({
  name: '',
  email: '',
  phone: '',
  company: '',
  city: '',
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
    error.value = 'Por favor completa nombre, correo y mensaje.'
    return
  }

  submitting.value = true
  try {
    // Tu backend real:
    const { error: fetchErr } = await useFetch('/api/contact', {
      method: 'POST',
      body: { ...form }
    })
    if (fetchErr.value) throw new Error(fetchErr.value.message || 'No se pudo enviar.')

    Object.assign(form, { name: '', email: '', phone: '', company: '', city: '', subject: '', message: '' })
    ok.value = true
  } catch (e: any) {
    error.value = e?.message ?? 'Ocurrió un error inesperado.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
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
.contact{background:#fff;color:#14313f}
.container{max-width:1160px;margin:0 auto;padding:0 1.25rem}
.section{padding:34px 0}
@media (min-width: 768px){ .section{ padding: 52px 0; } }

/* ===== Hero ===== */
.hero{
  min-height: 32vh;
  display:flex;
  align-items:center;
  background-position:center;
  background-size:cover;
  padding:44px 0;
  border-bottom:1px solid #0f2a38;
}
.hero__title{
  color:white;
  font-size:clamp(2rem,6vw,3rem);
  margin:0 0 6px;
  text-shadow:0 10px 40px rgba(0,0,0,.35);
}

/* Variante sin imagen */
.hero--plain{
  background:none !important;
  border-bottom:1px solid var(--line);
  align-items:center;
  min-height:auto;
  padding:26px 0;
}
.hero__title--plain{
  color:var(--ink);
  text-shadow:none;
}

/* ===== Grid ===== */
.grid{
  display:grid;
  grid-template-columns:1fr;
  gap:28px;
  align-items:start;
}
@media (min-width: 980px){
  .grid{ grid-template-columns:minmax(0,560px) 1fr; gap:48px; }
}

/* ===== Form ===== */
.card{
  background:#fff;border:1px solid var(--line);border-radius:14px;
  box-shadow:0 8px 24px rgba(0,0,0,.06);
}
.form{ padding:18px }
@media (min-width: 700px){ .form{ padding:22px } }

.label{
  display:block;font-size:.8rem;color:var(--ink-dim);text-transform:uppercase;
  letter-spacing:.06em;margin-bottom:6px;
}
.field{ margin-bottom:14px }
input, textarea{
  width:100%;border:1px solid #d8e4ea;border-radius:10px;background:#f7fafb;
  padding:.8rem .9rem;outline:none;color:#0e2a36;
}
input:focus, textarea:focus{ border-color:#9ed6de;background:#fff }
textarea{ resize:vertical }

.hp{
  position:absolute !important; left:-50000px !important; opacity:0 !important; pointer-events:none;
}

.actions{ display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.btn{
  height:44px;padding:0 1.2rem;border:1px solid transparent;border-radius:10px;
  background:#0b7f8d;color:#fff;font-weight:600;cursor:pointer;
}
.btn:disabled{ opacity:.6; cursor:not-allowed }
.feedback{ margin:0; font-size:.9rem }
.feedback.ok{ color:#1a8f5b }
.feedback.error{ color:#c24040 }

/* ===== Sidebar ===== */
.side{ padding:8px 0 }
.eyebrow{
  letter-spacing:.28em;text-transform:uppercase;font-size:.75rem;color:#7c9cab;margin:.25rem 0 .5rem;
}
.headline{
  font-size:clamp(1.8rem,4.5vw,2.6rem);line-height:1.15;margin:0 0 .4rem;color:#0e2a36;
}
.sep{
  width:86px;border:0;border-top:3px solid #0fb1c2;margin:14px 0 10px;
}
.copy{ color:#365564; max-width:56ch }
.contact-list{ list-style:none; padding:0; margin:16px 0 0; display:grid; gap:6px; }
.contact-list .key{ display:inline-block; min-width:86px; color:#567584 }
.contact-list a{ color:#0b7f8d; text-decoration:none }
.contact-list a:hover{ text-decoration:underline }

/* ===== Mobile paddings ===== */
@media (max-width: 767.98px){
  .container{ padding-left:18px; padding-right:18px; }
}
</style>
