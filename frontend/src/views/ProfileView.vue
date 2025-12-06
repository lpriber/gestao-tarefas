<template>
  <v-container v-if="user">
    <v-card class="pa-6 text-center">
      <v-avatar size="80" v-if="user.photoURL">
        <img :src="user.photoURL" alt="Foto do perfil" style="object-fit: contain; width: 100%; height: 100%;" />
      </v-avatar>
      <v-card-title>{{ user.displayName || 'Usuário' }}</v-card-title>
      <v-card-subtitle>{{ user.email }}</v-card-subtitle>
      <v-btn class="mt-4" color="red" @click="logout">
        <v-icon left>mdi-logout</v-icon> Sair
      </v-btn>
    </v-card>
  </v-container>
  <v-container v-else>
    <v-alert type="warning" variant="tonal">Você não está logado.</v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore } from '../stores/session'

const session = useSessionStore()
const { user } = storeToRefs(session)
const logout = () => session.logout()
</script>