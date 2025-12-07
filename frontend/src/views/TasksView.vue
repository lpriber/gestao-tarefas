<template>
  <v-container class="fill-height align-start">
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between align-center mb-4">
        <h1 class="text-h4">Gerenciador de Tarefas</h1>
        <v-btn icon @click="toggleTheme">
          <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <v-card-title>Nova Tarefa</v-card-title>
          
          <v-text-field v-model="form.title" label="Título" outlined dense />
          
          <v-textarea v-model="form.description" label="Descrição" outlined dense />

          <v-select
            v-model="form.categoria"
            :items="categoriesList"
            item-title="text"
            item-value="value"
            label="Categoria"
            outlined
            dense
          ></v-select>

          <v-btn color="primary" class="mt-2" block :disabled="!form.title" @click="createTask">
            <v-icon left>mdi-plus</v-icon> Adicionar
          </v-btn>
          
          <v-alert v-if="error" type="error" class="mt-2">{{ error }}</v-alert>
        </v-card>
      </v-col>

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
                <div class="d-flex align-center">
                  <v-list-item-title :class="{ 'text-decoration-line-through': t.done }">
                    {{ t.title }}
                  </v-list-item-title>
                  
                  <v-chip 
                    v-if="t.categoria" 
                    x-small 
                    class="ml-2" 
                    color="primary" 
                    outlined
                  >
                    {{ getCategoryName(t.categoria) }}
                  </v-chip>
                </div>
                <v-list-item-subtitle>{{ t.description }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn icon color="success" @click="toggleDone(t)">
                  <v-icon>{{ t.done ? 'mdi-checkbox-marked-circle-outline' : 'mdi-checkbox-blank-circle-outline' }}</v-icon>
                </v-btn>
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
import { ref, watch, onMounted, computed } from 'vue'
import { useSessionStore } from '../stores/session'
import { useTheme } from 'vuetify' // Importante para o modo escuro

// --- Configuração do Tema (Dark Mode) ---
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

// --- Dados ---
const session = useSessionStore()
const tasks = ref<any[]>([])

// Atualizei o form para incluir categoria (padrão null ou 1)
const form = ref({ title: '', description: '', categoria: null }) 
const error = ref('')

// Lista fixa de categorias para mapear no INT do banco
const categoriesList = [
  { text: 'Trabalho', value: 1 },
  { text: 'Pessoal', value: 2 },
  { text: 'Estudos', value: 3 },
  { text: 'Urgente', value: 4 }
]

// Função auxiliar para mostrar o nome bonitinho na lista
function getCategoryName(id: number) {
  const cat = categoriesList.find(c => c.value === id)
  return cat ? cat.text : 'Geral'
}

// --- Funções de API (Mantive sua lógica, apenas o form mudou) ---
// ... (mantenha suas funções headers e api iguais as anteriores) ...

function headers() {
  return {
    'Content-Type': 'application/json',
    ...(session.token ? { Authorization: `Bearer ${session.token}` } : {}),
  }
}

async function api(path: string, options: RequestInit = {}) {
  const baseUrl = import.meta.env.VITE_API_URL
  const res = await fetch(baseUrl + path, { ...options, headers: headers() })
  if (!res.ok) throw new Error(`Erro API: ${res.statusText}`)
  return res.json()
}

async function loadTasks() {
  try {
    tasks.value = await api('/tarefas') // Lembra de tirar o /api se já arrumou o .env
  } catch (e: any) {
    console.error(e)
  }
}

async function createTask() {
  try {
    // O backend precisa estar pronto para receber "categoria" no body!
    await api('/tarefas', { method: 'POST', body: JSON.stringify(form.value) })
    form.value = { title: '', description: '', categoria: null }
    await loadTasks()
  } catch (e: any) {
    error.value = e.message
  }
}

// ... (mantenha toggleDone e deleteTask iguais) ...
async function toggleDone(t: any) {
   /* mesma lógica */ 
   try {
    await api(`/tarefas/${t.id}`, { method: 'PUT', body: JSON.stringify({ ...t, done: !t.done }) })
    await loadTasks()
   } catch(e) {}
}

async function deleteTask(id: number) {
   /* mesma lógica */
   try {
    await api(`/tarefas/${id}`, { method: 'DELETE' })
    await loadTasks()
   } catch(e) {}
}

watch(() => session.token, (token) => { if (token) loadTasks() }, { immediate: true })
</script>