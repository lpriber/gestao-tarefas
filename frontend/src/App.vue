<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Gestão de Tarefas</v-toolbar-title>
      <v-spacer />
      <v-btn text to="/">Home</v-btn>
      <v-btn text to="/tasks">Tarefas</v-btn>
      <v-btn text to="/profile" v-if="user">
        {{ user.displayName || 'Perfil' }}
        <v-avatar size="32" class="ml-2" v-if="user.photoURL">
          <img :src="user.photoURL" alt="Foto do usuário" style="object-fit: contain; width: 100%; height: 100%;" />
        </v-avatar>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore } from './stores/session'

const session = useSessionStore()
const { user } = storeToRefs(session)
</script>