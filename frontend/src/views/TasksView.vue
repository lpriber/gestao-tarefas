<template>
  <v-container>
    <v-row>
      <!-- Formulário de nova tarefa -->
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <v-card-title>Nova Tarefa</v-card-title>
          <v-text-field v-model="form.title" label="Título" outlined dense />
          <v-textarea v-model="form.description" label="Descrição" outlined dense />
          <v-btn color="primary" class="mt-2" block :disabled="!form.title" @click="createTask">
            <v-icon left>mdi-plus</v-icon> Adicionar
          </v-btn>
          <v-alert v-if="error" type="error" class="mt-2">{{ error }}</v-alert>
        </v-card>
      </v-col>

      <!-- Lista de tarefas -->
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-format-list-bulleted</v-icon>
            Minhas Tarefas
          </v-card-title>
          <v-divider />
          <v-list>
            <v-list-item v-for="t in tasks" :key="t.id">
  <v-list-item-content>
    <v-list-item-title :class="{ 'text-decoration-line-through': t.done }">
      {{ t.title }}
    </v-list-item-title>
    <v-list-item-subtitle>{{ t.description }}</v-list-item-subtitle>
  </v-list-item-content>
  <v-list-item-action>
    <!-- Botão de concluir tarefa -->
    <v-btn icon color="success" @click="toggleDone(t)">
      <v-icon>
        {{ t.done ? 'mdi-checkbox-marked-circle-outline' : 'mdi-checkbox-blank-circle-outline' }}
      </v-icon>
    </v-btn>

    <!-- Botão de deletar tarefa -->
    <v-btn icon color="error" @click="deleteTask(t.id)">
      <v-icon>mdi-trash-can-outline</v-icon>
    </v-btn>
  </v-list-item-action>
</v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useSessionStore } from '../stores/session'

const session = useSessionStore()
const tasks = ref<any[]>([])
const form = ref({ title: '', description: '' })
const error = ref('')

function headers() {
  return {
    'Content-Type': 'application/json',
    ...(session.token ? { Authorization: `Bearer ${session.token}` } : {}),
  }
}

async function api(path: string, options: RequestInit = {}) {
  const baseUrl = import.meta.env.VITE_API_URL
  const res = await fetch(baseUrl + path, { ...options, headers: headers() })
  
  if (!res.ok) {
    // Tenta parsear como JSON, se falhar, usa o texto da resposta
    let errorMessage = 'Erro na API'
    try {
      const contentType = res.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json()
        errorMessage = errorData.error || `Erro ${res.status}: ${res.statusText}`
      } else {
        errorMessage = `Erro ${res.status}: ${res.statusText}`
      }
    } catch {
      errorMessage = `Erro ${res.status}: ${res.statusText}`
    }
    throw new Error(errorMessage)
  }
  
  return res.json()
}

async function loadTasks() {
  try {
    tasks.value = await api('/api/tarefas')
  } catch (e: any) {
    error.value = e.message
    console.error('Erro ao carregar tarefas:', e)
  }
}

async function createTask() {
  error.value = ''
  try {
    await api('/api/tarefas', { method: 'POST', body: JSON.stringify(form.value) })
    form.value = { title: '', description: '' }
    await loadTasks()
  } catch (e: any) {
    error.value = e.message
    console.error('Erro ao criar tarefa:', e)
  }
}

async function toggleDone(t: any) {
  error.value = ''
  try {
    await api(`/api/tarefas/${t.id}`, { method: 'PUT', body: JSON.stringify({ ...t, done: !t.done }) })
    await loadTasks()
  } catch (e: any) {
    error.value = e.message
    console.error('Erro ao atualizar tarefa:', e)
  }
}

async function deleteTask(id: number) {
  error.value = ''
  try {
    await api(`/api/tarefas/${id}`, { method: 'DELETE' })
    await loadTasks()
  } catch (e: any) {
    error.value = e.message
    console.error('Erro ao deletar tarefa:', e)
  }
}

// 🔹 Monitora o token e carrega tarefas quando ele estiver disponível
watch(() => session.token, (token) => {
  if (token) {
    loadTasks()
  }
}, { immediate: true })

// 🔹 Carrega tarefas quando o componente é montado (se já tiver token)
onMounted(() => {
  if (session.token) {
    loadTasks()
  }
})
</script>

<style>
.text-decoration-line-through {
  text-decoration: line-through;
}
</style>