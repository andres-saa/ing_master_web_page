<template>
  <div>
    <TopBar />

    <slot></slot>

    <Footer />

    <AdminSaveBar />
  </div>
</template>

<script setup>
// Asegúrate de importar el componente
import AdminSaveBar from '~/components/AdminSaveBar.vue'
</script>