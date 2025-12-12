<!-- components/Footer.vue -->
<template>
  <ClientOnly>
    <footer class="footer" v-if="dataReady && store.data?.footer">
      <!-- ===== Instagram ===== -->
      <section class="ig">
        <div class="container">
          <h3 class="ig__title">
            <Icon name="mdi:instagram" class="ig__title-icon" />
            <span>SÍGUENOS EN INSTAGRAM</span>
          </h3>

          <div class="ig__head">
            <img
              class="ig__avatar"
              :src="resolveImage(store.data.footer.instagram.avatar)"
              alt="avatar instagram"
            />
            <div class="ig__user">
              <a
                :href="store.data.footer.instagram.profileUrl"
                target="_blank"
                rel="noopener"
              >
                <Icon name="mdi:at" style="margin-right: .25rem" />
                {{ store.data.footer.instagram.user }}
              </a>
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
              <img
                :src="resolveImage(p.Image)"
                alt="post de instagram"
                loading="lazy"
                decoding="async"
              />
            </NuxtLink>
          </div>

          <div class="ig__actions">
            <button
              v-if="canLoadMore"
              class="btn btn--ghost"
              type="button"
              @click="loadMore"
            >
              <Icon name="mdi:plus" /> Cargar más…
            </button>

            <a
              :href="store.data.footer.instagram.profileUrl"
              target="_blank"
              rel="noopener"
              class="btn btn--primary"
            >
              <Icon name="mdi:instagram" /> Síguenos en Instagram
            </a>
          </div>
        </div>
      </section>

      <!-- ===== Footer columns ===== -->
      <div class="container footer__top">
        <div class="col">
          <div class="mini-links">
            <NuxtLink to="/manual-proteccion-datos">
              <Icon name="mdi:shield-lock-outline" />
              Manual de protección de datos personales
            </NuxtLink>

            <NuxtLink to="/terminos-y-condiciones">
              <Icon name="mdi:file-document-outline" />
              Términos y condiciones Ingenieria Master.com.co
            </NuxtLink>
          </div>
        </div>

        <div class="col">
          <h4 class="tt">CONTÁCTANOS</h4>
          <p class="sub">{{ store.data.footer.contact.subtitle }}</p>

          <p class="label">LÍNEA NACIONAL</p>

          <p class="contact-line">
            <Icon name="mdi:phone" />
            <a :href="`tel:${cleanPhone(store.data.footer.contact.phone)}`">
              {{ store.data.footer.contact.phone }}
            </a>
          </p>

          <p class="contact-line">
            <Icon name="mdi:email-outline" />
            <a :href="`mailto:${store.data.footer.contact.email}`">
              {{ store.data.footer.contact.email }}
            </a>
          </p>
        </div>

        <div class="col">
          <h4 class="tt">CALI</h4>

          <p class="contact-line">
            <Icon name="mdi:phone" />
            <a :href="`tel:${cleanPhone(store.data.footer.contact.phoneLocal)}`">
              {{ store.data.footer.contact.phoneLocal }}
            </a>
          </p>

          <p class="contact-line">
            <Icon name="mdi:map-marker-outline" />
            <span>{{ store.data.footer.contact.address }}</span>
          </p>

          <p class="muted">Cali - Valle del Cauca</p>

          <div class="divider"></div>

          <h4 class="tt tt--thin">¿Quieres hacer parte de nuestro equipo?</h4>

          <!-- ✅ FIX: nada de div dentro de p -->
          <div class="hr-block">
            <p class="hr-text">Envía tu hoja de vida al correo</p>

            <p class="contact-line">
              <Icon name="mdi:email-edit-outline" />
              <a :href="`mailto:${store.data.footer.contact.hrEmail}`">
                {{ store.data.footer.contact.hrEmail }}
              </a>
            </p>

            <p class="hr-text">y trabaja con nosotros.</p>
          </div>
        </div>
      </div>

      <!-- ===== Copy ===== -->
      <div class="copy">
        <Icon name="mdi:copyright" />
        {{ year }} Ingenieria Master / Arhook-web
      </div>

      <!-- ===== Floating WhatsApp ===== -->
      <a
        class="wa"
        :href="whatsHref"
        target="_blank"
        rel="noopener"
        aria-label="Chatear por WhatsApp"
      >
        <Icon name="mdi:whatsapp" aria-hidden="true" />
      </a>

      <!-- ===== To top ===== -->
      <button class="to-top" type="button" @click="scrollTop" aria-label="Volver arriba">
        <Icon name="mdi:arrow-up" aria-hidden="true" />
      </button>
    </footer>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
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

// ========= INIT DATOS =========
onMounted(() => {
  // Asegurar estructura
  if (!store.data) store.data = {}
  if (!store.data.footer) store.data.footer = {}

  // Merge recursivo simple para asegurar que existan los campos
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

  ensureStructure(store.data.footer, defaultFooterData)
  dataReady.value = true
})

// ========= HELPERS =========
const resolveImage = (imgSource: string | undefined) => {
  if (!imgSource) return ''
  if (
    imgSource.startsWith('/') ||
    imgSource.startsWith('data:') ||
    imgSource.startsWith('http')
  ) {
    return imgSource
  }
  return `https://backend.salchimonster.com/read-photo-product/${imgSource}`
}

const cleanPhone = (phone: string) => {
  return phone.replace(/[^0-9+]/g, '')
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
:root {
  --bg: #0b1f2a;
  --ink: #ffffff;
  --ink-dim: #cfe3ec;
  --accent: #0fb1c2;
  --line: rgba(255, 255, 255, 0.12);
}

.footer {
  background: var(--bg);
  color: white;
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
  color: white;
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

.ig__user a {
  color: white;
  text-decoration: none;
  font-weight: 700;
}

.ig__user a:hover {
  color: var(--accent);
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
  aspect-ratio: 1 / 1;
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
  color: white;
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
  color: white;
  margin: 0.2rem 0 0.6rem;
}

.label {
  margin: 0.8rem 0 0.3rem;
  color: white;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.78rem;
}

/* Mini links */
.mini-links {
  display: grid;
  gap: 0.35rem;
  margin-top: 10px;
}

.mini-links a {
  color: white;
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

/* Links / contact lines */
a {
  color: white;
}
a:hover {
  color: var(--accent);
}

.contact-line {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0.35rem 0;
}

.muted {
  color: white;
  margin: 0.35rem 0 0;
}

.hr-block {
  margin-top: 8px;
}
.hr-text {
  margin: 0.25rem 0;
  color: white;
}

/* Copy */
.copy {
  text-align: center;
  font-size: 0.85rem;
  color: white;
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
  color: white;
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
