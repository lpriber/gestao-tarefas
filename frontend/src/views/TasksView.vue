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
                <div class="d-flex align-center flex">
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
                  <v-list-item-action>
                <div class="d-flex align-center ml-2 cursor-pointer" @click="toggleDone(t)">
                  <v-icon v-if="t.done">
                    <CheckCheck style="color: green;" :size="20" />
                  </v-icon>
                  <v-icon v-else>
                    <CheckCheck style="color: gray;" :size="20" />
                  </v-icon>
                </div>
                <div class="d-flex align-center ml-2 cursor-pointer" @click="deleteTask(t.id)">
                  <v-icon>
                    <Trash2 style="color: red;" :size="20" />
                  </v-icon>
                </div>
              </v-list-item-action>
                </div>
                <v-list-item-subtitle>{{ t.description }}</v-list-item-subtitle>
                
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { Trash2, CheckCheck } from 'lucide-vue-next'
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
    let errorMessage = `Erro API: ${res.statusText}`
    try {
      const contentType = res.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json()
        errorMessage = errorData.error || errorMessage
      }
    } catch {
      // Se não conseguir parsear, usa a mensagem padrão
    }
    throw new Error(errorMessage)
  }
  
  return res.json()
}

async function loadTasks() {
  try {
    tasks.value = await api('/api/tarefas')
  } catch (e: any) {
    console.error('Erro ao carregar tarefas:', e)
    error.value = e.message
  }
}

async function createTask() {
  error.value = ''
  try {
    await api('/api/tarefas', { method: 'POST', body: JSON.stringify(form.value) })
    form.value = { title: '', description: '', categoria: null }
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

watch(() => session.token, (token) => { 
  if (token) loadTasks() 
}, { immediate: true })

onMounted(() => {
  if (session.token) {
    loadTasks()
  }
})
</script>