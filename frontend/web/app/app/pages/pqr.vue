<!-- pages/pqr.vue -->
<template>
  <main class="pqr">
    <!-- ======= HERO ======= -->
    <section
      class="hero"
      :style="{ backgroundImage: `linear-gradient(rgba(7,20,28,.65), rgba(7,20,28,.82)), url(${heroBg})` }"
    >
      <div class="container">
        <h1 class="hero__title">PQR</h1>
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

          <!-- reCAPTCHA (opcional) -->
          <div v-if="useRecaptcha" id="recaptcha-container" class="recaptcha"></div>

          <div class="actions">
            <button class="btn" type="submit" :disabled="submitting">
              {{ submitting ? 'Enviando…' : 'Enviar' }}
            </button>
            <p v-if="error" class="feedback error">{{ error }}</p>
            <p v-if="ok" class="feedback ok">¡Gracias! Hemos recibido tu PQR y te contactaremos muy pronto.</p>
          </div>
        </form>

        <!-- ======= LADO DERECHO ======= -->
        <aside class="side">
          <p class="eyebrow">Escríbanos</p>
          <h2 class="headline">Si tiene alguna duda, sugerencia, queja o reclamo</h2>
          <hr class="sep" />
          <p class="copy">
            Envíenos sus datos y resolveremos sus dudas a la mayor brevedad posible.
            En <strong>Ingeniería Master</strong> cuidamos cada detalle de nuestros proyectos y del servicio postventa.
          </p>

          <!-- Datos útiles (opcional) -->
          <ul class="contact-list">
            <li><span class="key">Email</span> <a href="mailto:contacto@ingenieriamaster.com">contacto@ingenieriamaster.com</a></li>
            <li><span class="key">Teléfono</span> <a href="tel:+576044448735">+57 (604) 444 8735</a></li>
          </ul>
        </aside>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

/** Fondo hero coherente con el sitio */
const heroBg =
  'https://images.unsplash.com/photo-1543966888-7c1dc482a810?q=80&w=1920&auto=format&fit=crop'

type Form = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  _robot?: string // honeypot
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

/** Actívalo si integras reCAPTCHA */
const useRecaptcha = false

async function onSubmit() {
  error.value = null
  ok.value = false

  // Honeypot
  if (form._robot && form._robot.length > 0) {
    error.value = 'Error de validación.'
    return
  }

  // Validación mínima
  if (!form.name || !form.email || !form.message) {
    error.value = 'Por favor completa nombre, correo y tu mensaje.'
    return
  }

  submitting.value = true
  try {
    // ======= Conectar a tu backend =======
    // Crea un endpoint POST /api/pqr que reciba el JSON y procese (email/DB/WhatsApp).
    const { error: fetchErr } = await useFetch('/api/pqr', {
      method: 'POST',
      body: { ...form }
    })
    if (fetchErr.value) throw new Error(fetchErr.value.message || 'No se pudo enviar.')

    // Reset
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
.pqr{background:#fff;color:#14313f}
.container{max-width:1160px;margin:0 auto;padding:0 1.25rem}
.section{padding:34px 0}
@media (min-width: 768px){ .section{ padding: 52px 0; } }

/* ===== Hero ===== */
.hero{
  min-height: 28vh;
  display:flex;
  align-items:center;
  background-position:center;
  background-size:cover;
  padding:44px 0;
  border-bottom:1px solid #0f2a38;
}
.hero__title{
  color:var(--white);
  font-size:clamp(2rem,6vw,3rem);
  margin:0 0 6px;
  text-shadow:0 10px 40px rgba(0,0,0,.35);
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
.hp{ position:absolute !important; left:-50000px !important; opacity:0 !important; pointer-events:none; }

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
