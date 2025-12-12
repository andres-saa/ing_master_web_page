import { defineStore } from 'pinia';

export const useWebDataStore = defineStore('webData', {
  state: () => ({
    data: {} as Record<string, any>, 
    isDirty: false,
  }),

  actions: {
    async uploadImage(file: File) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('https://backend.salchimonster.com/upload-photo-product', {
          method: 'POST',
          body: formData
        });
        
        const resData = await response.json();
        return resData.image_identifier;
        
      } catch (error) {
        console.error('Error subiendo imagen', error);
        return null;
      }
    },

    markAsDirty() {
      this.isDirty = true;
    },
    
    // Tu función PUT (estaba correcta)
    async saveAllChanges() {
        console.log('Guardando datos en backend...');
        try {
            const response = await fetch('https://backend.salchimonster.com/data/ing-master-web-data-json', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.data)
            });

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            
            const result = await response.json();
            console.log('Guardado exitoso:', result);
            this.isDirty = false;
            return true;

        } catch (error) {
            console.error('Error al guardar:', error);
            return false;
        }
    }
  },

  persist: {
    key: 'ing_master_web_data', 
    paths: ['data'],
    // CORRECCIÓN: Validamos si existe 'window' (navegador) antes de asignar localStorage
    // Si estamos en el servidor (Nuxt SSR), pasamos null para que no falle.
    storage: typeof window !== 'undefined' ? localStorage : null, 
  }
});