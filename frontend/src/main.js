// src/main.ts
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useSessionStore } from './stores/session'

import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({ 
  icons: { 
    defaultSet: 'mdi', 
    aliases, 
    sets: { mdi } 
  },
  // INÍCIO DA CONFIGURAÇÃO DO TEMA (Modo Claro/Escuro)
  theme: {
    // Define qual tema deve ser usado ao iniciar a aplicação.
    // 'light' é o padrão. Altere para 'dark' se quiser o modo escuro inicial.
    defaultTheme: 'light', 
    themes: {
      light: {
        colors: {
          primary: '#1976D2', 
        },
      },
      dark: {
        colors: {
          primary: '#90CAF9', 
        },
      },
    },
  },
  // FIM DA CONFIGURAÇÃO DO TEMA
})

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(vuetify)

// inicializa sessão antes de montar
const session = useSessionStore()
session.init().finally(() => app.mount('#app'))