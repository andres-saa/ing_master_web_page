<!-- pages/nosotros.vue -->
<template>
  <main class="about">

    <!-- ======= HERO ======= -->
    <section
      class="hero"
      :style="{ backgroundImage: `linear-gradient(rgba(7,20,28,.65), rgba(7,20,28,.82)), url(${heroBg})` }"
    >
      <div class="container">
        <h1 class="hero__title">NOSOTROS</h1>
      </div>
    </section>

    <!-- ======= VIDEO ======= -->
    <section class="section">
      <div class="container">
        <div class="video">
          <iframe
            :src="ytEmbed"
            title="Proyectos frigoríficos con los más altos estándares de calidad - Ingeniería Master"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>

    <!-- ======= ACERCA DE NOSOTROS ======= -->
    <section class="section">
      <div class="container">
        <p class="eyebrow center">ACERCA DE NOSOTROS</p>
        <h2 class="title center">SOMOS INGENIERÍA MASTER</h2>

        <div class="lead">
          <p>
            En <strong>Ingeniería Master</strong> transformamos la ingeniería en soluciones frigoríficas de alto desempeño.
            Desde hace más de 35 años diseñamos, construimos y mantenemos sistemas de refrigeración industrial
            hechos a la medida, atendiendo las necesidades específicas de industrias que exigen precisión, eficiencia y confiabilidad.
          </p>
          <p>
            Nuestra propuesta se basa en un enfoque integral: desde la conceptualización hasta el mantenimiento
            postventa, entregamos proyectos que combinan calidad técnica, eficiencia energética y control total
            de las variables críticas del proceso. Gracias a un equipo multidisciplinario y altamente capacitado,
            acompañamos a nuestros clientes en cada etapa, garantizando continuidad operativa, trazabilidad y soporte permanente.
          </p>
          <p>
            Trabajamos con tecnología de refrigeración de punta y arquitecturas térmicas optimizadas, seleccionadas según el proceso,
            el entorno regulatorio y los objetivos de sostenibilidad de cada operación. Ya sea en la industria cárnica, láctea,
            logística, farmacéutica, agrícola o cualquier sector de la cadena de frío, en <strong>Ingeniería Master</strong> encontrará un aliado con
            soluciones reales, escalables y con visión de largo plazo.
          </p>
        </div>
      </div>
    </section>

    <!-- ======= MISIÓN / VISIÓN ======= -->
    <section class="section">
      <div class="container">
        <div class="grid-2">
          <article class="card">
            <h3 class="h3 accent">MISIÓN</h3>
            <p>
              Diseñar, construir y mantener sistemas de refrigeración industrial que integren tecnología avanzada y disponible,
              eficiencia energética y sostenibilidad, adaptándonos a los procesos de cada cliente para garantizar confiabilidad
              operativa, trazabilidad y respaldo técnico continuo, bajo el sello de excelencia de <strong>Ingeniería Master</strong>.
            </p>
          </article>

          <article class="card">
            <h3 class="h3 accent">VISIÓN</h3>
            <p>
              Para 2030, posicionarnos en el Top 5 de empresas de refrigeración industrial en Colombia, con al menos
              70% de sistemas instalados con GWP menor a 100, reconocidos por nuestra capacidad de diseñar soluciones a la medida,
              ambientalmente responsables y respaldadas por ingeniería confiable de <strong>Ingeniería Master</strong>.
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- ======= CALIDAD / SEGURIDAD (IMÁGENES) ======= -->
    <section class="section">
      <div class="container">
        <div class="grid-2 grid-2--images">
          <figure class="media">
            <img :src="imgLeft" alt="Equipos de refrigeración industrial - Ingeniería Master" loading="lazy" decoding="async" />
          </figure>
          <figure class="media">
            <img :src="imgRight" alt="Sala de proceso: calidad e higiene - Ingeniería Master" loading="lazy" decoding="async" />
          </figure>
        </div>

        <div class="grid-2 mt-20">
          <article class="card">
            <h3 class="h3 accent">CALIDAD</h3>
            <p>
              Nuestro compromiso personal y profesional es velar por el servicio que llega a nuestros clientes, que sea de alta calidad
              y cumpla con los estándares prometidos. Nuestra premisa es: <em>“Como si fuera para nosotros mismos”.</em> Así trabajamos en <strong>Ingeniería Master</strong>.
            </p>
          </article>

          <article class="card">
            <h3 class="h3 accent">SEGURIDAD</h3>
            <p>
              En <strong>Ingeniería Master</strong> estamos comprometidos con la protección, promoción de la salud e integridad física de nuestros colaboradores
              a través de la gestión de los riesgos, el mejoramiento continuo de los procesos y la protección del medio ambiente,
              cumpliendo requisitos legales aplicables a todas las partes interesadas.
            </p>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/** Fondo del hero (textura de hielo de tu captura). Cambia por tu asset si lo tienes local. */
const heroBg =
  'https://images.unsplash.com/photo-1543966888-7c1dc482a810?q=80&w=1920&auto=format&fit=crop' // textura de hielo

/** Video de YouTube (pon el ID real de tu video) */
const youtubeId = 'VIDEO_ID' // <- reemplaza por el ID real
const ytEmbed = computed(() => `https://www.youtube.com/embed/${youtubeId}?rel=0`)

/** Imágenes de los bloques CALIDAD / SEGURIDAD */
const imgLeft =
  'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1400&auto=format&fit=crop'    // compresores / maquinaria
const imgRight =
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400&auto=format&fit=crop'   // sala limpia / laboratorio
</script>

<style scoped>
:root{
  --ink: #0f2a38;
  --ink-inv: #fff;
  --ink-dim: #4a6674;
  --line: rgba(0,0,0,.08);
  --accent: #0fb1c2;
}

/* ===== Base ===== */
*{box-sizing:border-box}
html,body{margin:0;padding:0}
.about{background:#fff;color:#122b37}
.container{max-width:1160px;margin:0 auto;padding:0 1.25rem;}
.center{text-align:center}
.mt-20{margin-top:20px}

.eyebrow{
  letter-spacing:.28em;
  text-transform:uppercase;
  font-size:.68rem;
  color:#7c9cab;
  margin:.25rem 0 .5rem;
}
.title{font-size:2rem;line-height:1.2;margin:0 auto .75rem;}

/* ===== Hero ===== */
.hero{
  min-height: 38vh;
  display:flex;
  align-items:center;
  background-position:center;
  background-size:cover;
  padding: 44px 0;
  border-bottom: 1px solid #0f2a38;
}
.hero__title{
  color:var(--white);
  font-size:clamp(2rem,6vw,3rem);

  text-shadow:0 10px 40px rgba(0,0,0,.35);
}

/* ===== Secciones ===== */
.section{padding: 34px 0;}
@media (min-width: 768px){ .section{ padding: 52px 0; } }

.lead{display:grid;gap:14px;color:#2a4755;max-width:86ch;margin-inline:auto;}

/* ===== Video (16:9 responsive) ===== */
.video{position:relative;width:100%;aspect-ratio:16/9;border-radius:14px;overflow:hidden;box-shadow:0 12px 34px rgba(0,0,0,.18);}
.video iframe{position:absolute;inset:0;width:100%;height:100%;}

/* ===== Grid 2 ===== */
.grid-2{display:grid;grid-template-columns:1fr;gap:18px}
@media (min-width: 900px){ .grid-2{ grid-template-columns: 1fr 1fr; gap: 24px; } }

.card{
  background:#fff;
  border:1px solid var(--line);
  border-radius:14px;
  padding:18px;
  box-shadow:0 8px 24px rgba(0,0,0,.06);
}
.h3{font-size:1.25rem;margin:.25rem 0 .5rem}
.accent{color:#0b7f8d}

/* ===== Imágenes ===== */
.grid-2--images .media{
  margin:0;
  border-radius:16px;
  overflow:hidden;
  box-shadow:0 16px 36px rgba(0,0,0,.16);
  border:1px solid #e6eef1;
}
.media img{
  width:100%;
  height:100%;
  display:block;
  object-fit:cover;
}

/* ===== Mobile paddings ===== */
@media (max-width: 767.98px){
  .container{ padding-left: 18px; padding-right: 18px; }
}
</style>
