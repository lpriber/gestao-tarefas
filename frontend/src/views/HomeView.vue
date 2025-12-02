<template>
  <v-container class="text-center">
    <v-card class="pa-6">
      <v-card-title class="text-h5">Bem-vindo à Gestão de Tarefas 🚀</v-card-title>
      <v-card-text>
        Organize suas tarefas de forma simples e prática.
      </v-card-text>

      <div v-if="!user">
        <v-card-text>Faça login com sua conta Google para começar.</v-card-text>
        <v-btn color="primary" @click="login">
          <v-icon left>mdi-google</v-icon> Entrar com Google
        </v-btn>
      </div>

      <div v-else>
        <v-alert type="success" variant="tonal" class="mt-4">
          Você está logado como {{ user.displayName || user.email }}.
        </v-alert>
        <v-btn color="secondary" class="mt-2" @click="goTasks">Ir para Tarefas</v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSessionStore } from '../stores/session'
import { useRouter } from 'vue-router'

const session = useSessionStore()
const { user } = storeToRefs(session)
const router = useRouter()

function login() {
  session.login()
}
function goTasks() {
  router.push('/tasks')
}
</script>