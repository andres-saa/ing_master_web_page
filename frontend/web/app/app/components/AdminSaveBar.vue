<template>
  <div v-if="store.isDirty" class="save-bar">
    <div class="content">
      <span>Tienes cambios sin guardar</span>
      <button @click="handleSave" :disabled="loading">
        {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useWebDataStore } from '@/stores/webData'; // Ajusta la ruta

const store = useWebDataStore();
const loading = ref(false);

const handleSave = async () => {
  loading.value = true;
  await store.saveAllChanges();
  loading.value = false;
};
</script>

<style scoped>
.save-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #333;
  color: white;
  padding: 1rem;
  z-index: 9999;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
}
.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}
button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
}
button:disabled {
  background-color: #888;
}
</style>