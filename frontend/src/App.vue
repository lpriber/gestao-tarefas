<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Gestão de Tarefas</v-toolbar-title>
      <v-spacer />
      
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
      
      <v-btn text to="/">Home</v-btn>
      <v-btn text to="/tasks">Tarefas</v-btn>
      <v-btn text to="/profile">Perfil</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

// Propriedade computada para saber qual ícone usar (sol ou lua)
const isDark = computed(() => theme.global.current.value.dark)

// Função que inverte o tema global do Vuetify
function toggleTheme () {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}
</script>