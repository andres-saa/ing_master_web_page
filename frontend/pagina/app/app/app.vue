<script setup lang="ts">
import { onMounted } from 'vue';
import { useWebDataStore } from '@/stores/webData'; // Verifica que la ruta al store sea correcta

const store = useWebDataStore();

onMounted(async () => {
  try {
    // Realizamos el GET al mismo ID usado anteriormente
    const response = await fetch('https://backend.salchimonster.com/data/ing-master-web-data-json');

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result = await response.json();

    // La respuesta es { id: "...", data: {...} }
    // Extraemos solo 'data' y la asignamos al store
    if (result.data) {
      store.data = result.data;
      console.log('Datos cargados exitosamente en el store');
    }

  } catch (error) {
    console.error('Error al traer los datos iniciales:', error);
  }
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>