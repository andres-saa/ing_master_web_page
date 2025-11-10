<!-- components/FooterIngenieria Master.vue -->
<template>
  <footer class="footer">
    <!-- ======= INSTAGRAM ======= -->
    <section class="ig">
      <div class="container">
        <h3 class="ig__title">SÍGUENOS EN INSTAGRAM</h3>

        <!-- Header de cuenta -->
        <div class="ig__head">
          <img class="ig__avatar" :src="avatarSrc" alt="avatar instagram" />
          <div class="ig__user">
            <a :href="profileUrl" target="_blank" rel="noopener">@{{ igUser }}</a>
          </div>
        </div>

        <!-- Grilla -->
        <div class="ig__grid">
          <NuxtLink
            v-for="(p, idx) in visiblePosts"
            :key="idx"
            :href="p.href"
            class="ig__card"
            target="_blank"
            rel="noopener"
            aria-label="Abrir publicación de Instagram"
          >
            <img :src="p.Image" alt="post de instagram" loading="lazy" decoding="async" />
          </NuxtLink>
        </div>

        <!-- Acciones -->
        <div class="ig__actions">
          <button v-if="canLoadMore" class="btn btn--ghost" @click="loadMore">Cargar más…</button>
          <a :href="profileUrl" target="_blank" rel="noopener" class="btn btn--primary">
            Síguenos en Instagram
          </a>
        </div>
      </div>
    </section>

    <!-- ======= FOOTER TOP ======= -->
    <div class="container footer__top">
      <!-- Newsletter -->
      <div class="col">
        <h4 class="tt">SUSCRÍBETE A NUESTRO NEWSLETTER</h4>
        <form class="newsletter" @submit.prevent="onSubscribe">
          <input
            v-model="email"
            type="email"
            required
            placeholder="tu@correo.com"
            aria-label="Correo para suscripción"
          />
          <button type="submit" class="btn-sub">SUSCRIBIRSE</button>
        </form>

        <div class="brand-row">
          <!-- Marca simple en SVG (reemplaza por tu logo si quieres) -->
          <svg class="brand" viewBox="0 0 120 24" aria-hidden="true">
            <rect x="0" y="6" width="28" height="12" rx="3"></rect>
            <text x="38" y="17" font-size="12" fill="currentColor">Ingenieria Master</text>
          </svg>
        </div>

        <div class="mini-links">
          <NuxtLink to="/manual-proteccion-datos">Manual de protección de datos personales</NuxtLink>
          <NuxtLink to="/terminos-y-condiciones">Términos y condiciones Ingenieria Master.com.co</NuxtLink>
        </div>
      </div>

      <!-- Contáctanos -->
      <div class="col">
        <h4 class="tt">CONTÁCTANOS</h4>
        <p class="sub">COBERTURA EN TODO EL TERRITORIO NACIONAL</p>
        <p>LÍNEA NACIONAL</p>
        <p><a href="tel:018000423789">018000 - 423789</a></p>
        <p><a href="mailto:soporte@Ingenieria Mastersa.com">soporte@Ingenieria Mastersa.com</a></p>
      </div>

      <!-- Medellín -->
      <div class="col">
        <h4 class="tt">MEDELLÍN</h4>
        <p><a href="tel:+576044448735">(604) 444 8735</a></p>
        <p>Carrera 46 No. 48 C sur 40 - Int. 104</p>
        <p>Envigado – Antioquia</p>

        <div class="divider"></div>

        <h4 class="tt tt--thin">¿Quieres hacer parte de nuestro equipo?</h4>
        <p>
          Envía tu hoja de vida al correo
          <a href="mailto:soporte@Ingenieria Mastersa.com">soporte@Ingenieria Mastersa.com</a>
          y trabaja con nosotros.
        </p>
      </div>
    </div>

    <!-- ======= COPY ======= -->
    <div class="copy">
      Copyright © {{ year }} Ingenieria Master / Arhook-web
    </div>

    <!-- ======= FLOTANTES ======= -->
    <a
      class="wa"
      :href="whatsHref"
      target="_blank"
      rel="noopener"
      aria-label="Chatear por WhatsApp"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M19.11 17.51c-.28-.15-1.65-.86-1.9-.96-.26-.1-.45-.15-.65.15-.2.3-.75.95-.92 1.14-.17.2-.34.22-.62.08-.28-.14-1.18-.43-2.25-1.38-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.35.42-.53.14-.18.19-.3.28-.5.09-.2.05-.37-.03-.53-.08-.15-.65-1.56-.9-2.13-.24-.58-.49-.5-.65-.5-.17 0-.37-.02-.57-.02s-.52.07-.79.37c-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.06.15.2 2.1 3.2 5.08 4.49 2.99 1.3 2.99.87 3.53.82.55-.05 1.65-.67 1.88-1.32.23-.66.23-1.22.16-1.34-.07-.12-.25-.2-.53-.35z"/>
        <path d="M26.7 5.3A13.5 13.5 0 1 0 5.26 26.73L4 30l3.38-1.22A13.5 13.5 0 1 0 26.7 5.3zM16 27.17a11.18 11.18 0 1 1 0-22.36 11.18 11.18 0 0 1 0 22.36z"/>
      </svg>
    </a>

    <button class="to-top" @click="scrollTop" aria-label="Volver arriba">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 6l-8 8h16z"/>
      </svg>
    </button>
  </footer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import post1 from '~/assets/images/posts/1.png'
import post2 from '~/assets/images/posts/2.png'
import post3 from '~/assets/images/posts/3.png'
import post4 from '~/assets/images/posts/4.png'
import post5 from '~/assets/images/posts/5.png'
import post6 from '~/assets/images/posts/6.png'
import post7 from '~/assets/images/posts/7.png'
import post8 from '~/assets/images/posts/8.png'
import post9 from '~/assets/images/posts/9.png'
import post10 from '~/assets/images/posts/10.png'

import post11 from '~/assets/images/posts/11.png'

import post12 from '~/assets/images/posts/12.png'



const year = new Date().getFullYear()
const email = ref('')

// ===== Instagram (simple grid local; si tienes API/Token, puedes poblarlo dinámicamente)
const igUser = 'cuartosfrioscali'
const profileUrl = `https://www.instagram.com/${igUser}/`
const avatarSrc = 'https://i.pravatar.cc/120?img=3' // reemplaza por tu avatar real si lo tienes

const IMG =
  'https://elcomercio.pe/resizer/v2/6Y2EDIISGFGVFANEVDCR5LCG34.jpg?auth=f58b5c647a09717054d85bb8b9a6bc624bfcb14fe9c60b5246730ea6a513e2b0&width=1198&height=690&quality=75&smart=true'

// 12 posts de ejemplo usando la misma imagen (puedes cambiarlos por tus thumbs reales)
 

const allPosts = [
    {
        Image: post1,
        href:''
    },
     {
        Image: post2,
        href:''
    },
     {
        Image: post3,
        href:''
    },
     {
        Image: post4,
        href:''
    },
     {
        Image: post5,
        href:''
    },
     {
        Image: post6,
        href:''
    },
     {
        Image: post7,
        href:''
    },
     {
        Image: post8,
        href:''
    },
     {
        Image: post9,
        href:''
    },
     {
        Image: post10,
        href:''
    },
     {
        Image: post11,
        href:''
    },
     {
        Image: post12,
        href:''
    }
    
]

const showCount = ref(6)
const visiblePosts = computed(() => allPosts.slice(0, showCount.value))
const canLoadMore = computed(() => showCount.value < allPosts.length)
function loadMore() {
  showCount.value = Math.min(showCount.value + 6, allPosts.length)
}

// ===== Newsletter
function onSubscribe() {
  // Integrar con tu backend/email service
  email.value = ''
  alert('¡Gracias por suscribirte!')
}

// ===== WhatsApp flotante
const whatsappNumber = '573000000000'  // <— cámbialo
const whatsMsg = encodeURIComponent('Hola, quiero más información.')
const whatsHref = computed(() => `https://wa.me/${whatsappNumber}?text=${whatsMsg}`)

// ===== Volver arriba
function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
:root{
  --bg: #0b1f2a;
  --ink: #ffffff;
  --ink-dim: #cfe3ec;
  --accent: #0fb1c2;
  --line: rgba(255,255,255,.12);
}

.footer{
  background: var(--bg);
  color: var(--ink);
  border-top: 1px solid var(--line);
  position: relative;
  padding-bottom: 80px; /* espacio para flotantes */
}

/* ===== Container ===== */
.container{
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

/* ===== Instagram ===== */
.ig{ background: #0f2a38; border-bottom: 1px solid var(--line); }
.ig__title{
  text-align: center;
  padding-top: 18px;
  letter-spacing: .28em;
  text-transform: uppercase;
  font-size: .82rem;
  color: var(--ink);
}
.ig__head{
  margin: 14px 0 8px;
  display: flex; align-items: center; gap: 10px;
}
.ig__avatar{
  width: 38px; height: 38px; border-radius: 50%;
  border: 1px solid var(--line);
  object-fit: cover;
}
.ig__user a{ color: var(--ink); text-decoration: none; font-weight: 700; }
.ig__user a:hover{ color: var(--accent); }

.ig__grid{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.ig__card{
  display: block;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255,255,255,.04);
  border: 1px solid var(--line);
}
.ig__card img{
  display: block; width: 100%; aspect-ratio: 1/1; object-fit: cover;
  transition: transform .2s ease;
}
.ig__card:hover img{ transform: scale(1.03); }

.ig__actions{
  display: flex; gap: .6rem; align-items: center; justify-content: center;
  padding: 12px 0 18px;
}
.btn{ display: inline-flex; align-items: center; gap: .4rem; border-radius: 10px; padding: .62rem 1rem; font-weight: 700; text-decoration: none; cursor: pointer; }
.btn--primary{ background: var(--accent); color: #032229; border: 0; }
.btn--primary:hover{ filter: brightness(1.05); }
.btn--ghost{ background: transparent; border: 1px solid var(--line); color: var(--ink); }
.btn--ghost:hover{ background: rgba(255,255,255,.06); }

/* ===== Footer Top ===== */
.footer__top{
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
  padding: 26px 0;
}

.col .tt{
  letter-spacing: .12em;
  text-transform: uppercase;
  font-size: .88rem;
  margin: 0 0 .75rem;
}
.tt--thin{ letter-spacing: .06em; text-transform: none; font-weight: 700; margin-top: 10px; }

.sub{
  color: var(--ink-dim);
  margin: .2rem 0 .6rem;
}

/* Newsletter */
.newsletter{
  display: flex;
  gap: .6rem;
  align-items: center;
}
.newsletter input{
  flex: 1;
  min-width: 0;
  background: rgba(255,255,255,.06);
  border: 1px solid var(--line);
  color: var(--ink);
  border-radius: 10px;
  padding: .7rem .9rem;
  outline: none;
}
.btn-sub{
  background: var(--accent);
  color: #032229;
  border: 0;
  border-radius: 10px;
  padding: .72rem 1rem;
  font-weight: 700;
  cursor: pointer;
}
.btn-sub:hover{ filter: brightness(1.05); }

/* Marca + mini links */
.brand-row{
  margin-top: 18px;
  display: flex; align-items: center; gap: 10px;
}
.brand{ width: 110px; height: 24px; fill: currentColor; color: var(--ink); }

.mini-links{
  display: grid;
  gap: .35rem;
  margin-top: 10px;
}
.mini-links a{
  color: var(--ink-dim);
  text-decoration: none;
}
.mini-links a:hover{ text-decoration: underline; }

/* Divider */
.divider{ height: 1px; background: var(--line); margin: 14px 0; }

/* Links de contacto */
a{ color: var(--ink); }
a:hover{ color: var(--accent); }

/* Copy */
.copy{
  text-align: center;
  font-size: .85rem;
  color: var(--ink-dim);
  border-top: 1px solid var(--line);
  padding: 14px 1.25rem;
  background: #0b1f2a;
}

/* Flotantes */
.wa{
  position: fixed;
  left: 16px;
  bottom: 16px;
  width: 56px; height: 56px;
  border-radius: 50%;
  background: #25D366;
  display: grid; place-items: center;
  box-shadow: 0 10px 24px rgba(0,0,0,.35);
  z-index: 30;
}
.wa svg{ width: 28px; height: 28px; fill: #fff; }

.to-top{
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: 56px; height: 56px;
  border-radius: 50%;
  border: 0;
  background: #0e2a39;
  color: var(--ink);
  box-shadow: 0 10px 24px rgba(0,0,0,.35);
  cursor: pointer;
  z-index: 30;
}
.to-top svg{ width: 24px; height: 24px; fill: currentColor; }

/* Responsive */
@media (min-width: 768px){
  .ig__grid{ grid-template-columns: repeat(6, 1fr); gap: 10px; }
  .footer__top{
    grid-template-columns: 1.2fr .8fr .9fr;
    gap: 32px;
    padding: 34px 0;
  }
}

/* ===== Fix: paddings de contenedor en mobile ===== */
@media (max-width: 767.98px){
  .container{
    padding-left: 18px;
    padding-right: 18px;
  }

  /* Asegura respiración también en estas franjas */
  .ig .container{
    padding-left: 18px;
    padding-right: 18px;
  }

  .copy{
    padding-left: 18px;
    padding-right: 18px;
  }
}

</style>
