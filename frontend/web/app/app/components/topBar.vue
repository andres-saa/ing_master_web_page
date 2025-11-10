<!-- components/TopBar.vue -->
<template>
  <header class="topbar" :class="{ 'topbar--scrolled': scrolled }">
    <div class="topbar__inner">
      <!-- Logo -->
      <NuxtLink to="/" class="brand" aria-label="Inicio" @click="closeAll">
        <img class="brand__icon" :src="logo" alt="Ingeniería Master Logo" />
        <span class="brand__text">INGENIERÍA MASTER</span>
      </NuxtLink>

      <!-- Nav (ESCRITORIO centrado) -->
      <nav :id="'mainmenu'" class="nav">
        <ul class="nav__list">
          <li><NuxtLink :class="linkClass('/')" to="/">Inicio</NuxtLink></li>
          <li><NuxtLink :class="linkClass('/nosotros')" to="/nosotros">Nosotros</NuxtLink></li>

          <!-- Servicios (dropdown robusto) -->
          <li
            class="dropdown"
            ref="dropdownLi"
            @pointerenter="openServiciosHover"
            @pointerleave="scheduleCloseServicios"
            @focusin="openServiciosHover"
            @focusout="scheduleCloseServicios"
          >
            <button
              ref="dropdownBtn"
              class="dropdown__button"
              :class="linkClass('/servicios', true)"
              @click.prevent="toggleServiciosClick"
              aria-haspopup="menu"
              :aria-expanded="hoverServicios"
            >
              Servicios
              <svg class="chev" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>

            <ul
              ref="dropdownMenu"
              
              class="dropdown__menu"
              :class="{ 'dropdown__menu--show': hoverServicios }"
              role="menu"
              @pointerenter="cancelCloseServicios"
              @pointerleave="scheduleCloseServicios"
            >
              <li><NuxtLink class="dropdown__link" to="/servicios/cuartos-frios">Cuartos Frios</NuxtLink></li>
              <li><NuxtLink class="dropdown__link" to="/servicios/mantenimiento">Mantenimiento</NuxtLink></li>
              <li><NuxtLink class="dropdown__link" to="/servicios/salas-de-proceso">Salas de proceso</NuxtLink></li>
            </ul>
          </li>

          <li><NuxtLink :class="linkClass('/noticias')" to="/noticias">Noticias</NuxtLink></li>
          <li><NuxtLink :class="linkClass('/contacto')" to="/contacto">Contacto</NuxtLink></li>
          <li><NuxtLink :class="linkClass('/pqr')" to="/pqr">PQR</NuxtLink></li>
        </ul>
      </nav>

      <!-- CTA (escritorio) -->
      <div class="cta-desktop">
        <a :href="waUrl" class="cta" target="_blank" rel="noopener" aria-label="Cotizar por WhatsApp">
          Cotizar ahora
        </a>
      </div>

      <!-- Backdrop (solo móvil) -->
      <transition name="fade">
        <button v-if="open" class="backdrop" aria-label="Cerrar menú" @click="closeAll" />
      </transition>

      <!-- Drawer lateral (solo móvil) -->
      <transition name="slide-left">
        <aside
          v-if="open"
          class="drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
          @click.self="closeAll"
        >
          <div class="drawer__header">
            <span id="drawer-title" class="drawer__title">Menú</span>
            <button class="drawer__close" aria-label="Cerrar menú" @click="closeAll">
              <Icon name="material-symbols:close-rounded" style="width: 100%; height: 100%;" />
            </button>
          </div>

          <nav class="nav--mobile">
            <ul class="nav__list--mobile">
              <li><NuxtLink class="nav__link" to="/" @click="closeAll">Inicio</NuxtLink></li>
              <li><NuxtLink class="nav__link" to="/nosotros" @click="closeAll">Nosotros</NuxtLink></li>

              <!-- Servicios acordeón móvil -->
              <li>
                <button
                  class="dropdown__button nav__link nav__link--button"
                  @click="openServicios = !openServicios"
                  aria-haspopup="true"
                  :aria-expanded="openServicios"
                >
                  Servicios
                  <svg class="chev" viewBox="0 0 24 24" aria-hidden="true" :class="{ 'chev--rot': openServicios }">
                    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
                <ul class="mobile-sub" v-show="openServicios">
                  <li><NuxtLink class="dropdown__link" to="/servicios/cuartos-frios" @click="closeAll">Cuartos Frios</NuxtLink></li>
                  <li><NuxtLink class="dropdown__link" to="/servicios/mantenimiento" @click="closeAll">Mantenimiento</NuxtLink></li>
                  <li><NuxtLink class="dropdown__link" to="/servicios/salas-de-proceso" @click="closeAll">Salas de proceso</NuxtLink></li>
                </ul>
              </li>

              <li><NuxtLink class="nav__link" to="/noticias" @click="closeAll">Noticias</NuxtLink></li>
              <li><NuxtLink class="nav__link" to="/contacto" @click="closeAll">Contacto</NuxtLink></li>
              <li><NuxtLink class="nav__link" to="/pqr" @click="closeAll">PQR</NuxtLink></li>

              <li class="cta-wrap"></li>
            </ul>

            <a :href="waUrl" class="cta" target="_blank" rel="noopener" @click="closeAll" aria-label="Cotizar por WhatsApp">
              Cotizar ahora
            </a>
          </nav>
        </aside>
      </transition>

      <!-- Burger (mobile) -->
      <button
        class="burger"
        @click="toggleDrawer"
        aria-label="Abrir menú"
        aria-controls="mainmenu"
        :aria-expanded="open"
      >
        <Icon name="game-icons:hamburger-menu" style="width: 100%;height: 100%;" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import logo from '~/assets/images/logo.png'

const route = useRoute()
const open = ref(false)
const openServicios = ref(false)
const hoverServicios = ref(false)
const scrolled = ref(false)

// refs del dropdown (desktop)
const dropdownLi = ref<HTMLElement | null>(null)
const dropdownBtn = ref<HTMLElement | null>(null)
const dropdownMenu = ref<HTMLElement | null>(null)

let closeTimer: number | undefined

const linkClass = (path: string, isSection = false) => {
  const active = isSection ? route.path.startsWith(path) : route.path === path
  return ['nav__link', active ? 'nav__link--active' : ''].join(' ')
}

function lockScroll(lock: boolean) {
  if (typeof document === 'undefined') return
  document.body.style.overflow = lock ? 'hidden' : ''
}

function toggleDrawer() {
  open.value = !open.value
  if (!open.value) openServicios.value = false
  lockScroll(open.value)
}

function closeAll() {
  open.value = false
  openServicios.value = false
  lockScroll(false)
}

// ===== Dropdown desktop: abrir/cerrar con delay =====
function openServiciosHover() {
  cancelCloseServicios()
  hoverServicios.value = true
}
function scheduleCloseServicios() {
  cancelCloseServicios()
  // pequeño delay para permitir mover el puntero al menú sin que se cierre
  closeTimer = window.setTimeout(() => {
    hoverServicios.value = false
  }, 180) as unknown as number
}
function cancelCloseServicios() {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = undefined
  }
}
// Abrir/cerrar con click/foco (accesibilidad y soporte touch en desktop)
function toggleServiciosClick() {
  if (window.matchMedia('(pointer: coarse)').matches) {
    // en dispositivos táctiles de escritorio, alternar
    hoverServicios.value = !hoverServicios.value
  } else {
    // en mouse, forzar abierto al click (y se cerrará al salir)
    hoverServicios.value = true
  }
}

function onScroll() { scrolled.value = window.scrollY > 2 }
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (open.value) closeAll()
    if (hoverServicios.value) hoverServicios.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  lockScroll(false)
})
watch(() => route.fullPath, () => closeAll())

// === WhatsApp CTA ===
const waPhone = '573104080918' // +57 310 4080918 en formato internacional sin '+'
const waText  = encodeURIComponent('¡Hola! Me gustaría cotizar un proyecto de refrigeración industrial. ¿Me ayudas?')
const waUrl   = `https://wa.me/${waPhone}?text=${waText}`
</script>

<style scoped>
/* ====== Wrapper ====== */
.topbar {
  position: sticky; top: 0; z-index: 50;
  background: var(--bg);
  color: var(--txt);
  box-shadow: 0 0 0 rgba(0,0,0,0);
  transition: box-shadow .2s ease;
}
.topbar--scrolled { box-shadow: 0 4px 14px rgba(0,0,0,.25); }

.topbar__inner {
  height: var(--topbar-h);
  max-width: 1200px;
  width:100%;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0 16px;
  display: flex; align-items: center;
  gap: 14px;
}

/* ====== Brand ====== */
.brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--white); }
.brand__icon { width: 34px; height: 34px; opacity: .95 }
.brand__text { font-weight: 800; letter-spacing: .5px; font-size: 22px; line-height: 1; }

/* ====== Nav (desktop centrado) ====== */
.nav { flex: 1 1 auto; display: block; }
.nav__list { display: flex; align-items: center; justify-content: center; gap: 22px; list-style: none; margin: 0; padding: 0; }

.nav__link {
  text-decoration: none; font-weight: 800; letter-spacing: .6px; font-size: 12px; text-transform: uppercase;
  color: var(--txt-dim); opacity: .95; position: relative; display: inline-flex; align-items: center; gap: 6px; line-height: 1.1;
}
.dropdown__button {
  appearance: none; -webkit-appearance: none; background: none; border: 0; padding: 0; margin: 0; cursor: pointer;
  font: inherit; color: inherit; font-weight: 800; letter-spacing: .6px; font-size: 12px; text-transform: uppercase;
  opacity: .95; position: relative; display: inline-flex; align-items: center; gap: 6px; line-height: 1.1;
}

.nav__link:hover, .dropdown__button:hover { color: var(--white); }
.nav__link--active, .dropdown__button.nav__link--active { color: var(--white); }

.nav__link--active::after,
.nav__link:hover::after,
.dropdown__button.nav__link--active::after,
.dropdown__button:hover::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: -10px; height: 2px;
  background: var(--accent); border-radius: .3rem;
}

/* ====== Dropdown ====== */
.dropdown { position: relative; }
.dropdown__button .chev { width: 14px; height: 14px; opacity: .7; color: var(--white); }
.dropdown__menu {
  position: absolute; top: calc(100% + 12px); left: 0;
  min-width: 220px;
  background: #0b2f38; border: 1px solid rgba(255,255,255,.06);
  border-radius: .3rem; padding: 8px; box-shadow: 0 10px 30px rgba(0,0,0,.35);
  opacity: 0; transform: translateY(-4px); pointer-events: none; transition: all .14s ease;
  z-index: 40; /* asegurar sobre contenido cercano */
}
.dropdown__menu--show { opacity: 1; transform: translateY(0); pointer-events: auto;list-style: none; }
.dropdown__menu li { list-style: none; }
.dropdown__link { display: block; padding: 10px 12px; border-radius: .3rem; color: var(--txt); text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: .3px; }
.dropdown__link:hover { background: rgba(255,255,255,.06); }

/* ====== CTA ====== */
.cta-desktop { display: inline-flex; }
.cta {
  display: inline-flex; align-items: center; justify-content: center;
  height: 40px;  padding: 12px;
  border-radius: .3rem;
  background: var(--accent);
  color: var(--white); font-weight: 800; letter-spacing: .4px; text-decoration: none;
  transition: transform .06s ease, background .2s ease;
  white-space: nowrap; margin: 12px;
}
.cta:hover { background: var(--accent-strong); }
.cta:active { transform: translateY(1px); }

/* ====== Burger (mobile) ====== */
.burger { display: none; width: 40px; height: 40px; background: none; border: 0; padding: 0; gap: 4px; color: var(--white); }

/* ====== SOLO MÓVIL: drawer lateral ====== */
@media (max-width: 980px) {
  .burger { display: inline-flex; flex-direction: column; }
  .nav { display: none; }
  .cta-desktop { display: none; }

  .backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.45); border: 0; padding: 0; margin: 0; cursor: default; }
  .drawer {
    position: fixed; top: 0; left: 0; bottom: 0; width: min(86vw, 340px);
    background: var(--bg); border-right: 1px solid rgba(255,255,255,.06);
    box-shadow: 0 10px 30px rgba(0,0,0,.35); display: flex; flex-direction: column; z-index: 60;
  }
  .drawer__header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,.06); }
  .drawer__title { font-weight: 800; letter-spacing: .4px; }
  .drawer__close { width: 38px; height: 38px; background: none; border: 0; color: var(--white); }

  .nav--mobile { padding: 6px 8px 18px; display: flex; flex-direction: column; height: 100%; justify-content: space-between; }
  .nav__list--mobile { display: grid; gap: 1.5rem; list-style: none; padding: 8px; margin: 0; }

  .nav__link.nav__link--button { width: 100%; text-align: left; }
  .mobile-sub { margin:1rem 0 0 0; display: grid; gap: 4px;list-style: none; }

  .cta-wrap { margin-top: 4px; }
}

/* Animaciones */
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-left-enter-active, .slide-left-leave-active { transition: transform .22s ease; will-change: transform; }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-102%); }
.chev--rot { transform: rotate(180deg); transition: transform .15s ease; }
</style>
