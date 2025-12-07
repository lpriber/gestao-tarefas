<template>
  <v-container class="fill-height align-start" fluid>
    <v-row justify="center">
      
      <v-col cols="12" md="4" lg="3">
        <v-card elevation="3" class="rounded-lg">
          <v-toolbar color="primary" density="compact">
            <v-toolbar-title class="text-subtitle-1 font-weight-bold">
              Nova Tarefa
            </v-toolbar-title>
          </v-toolbar>
          
          <v-card-text class="pa-4">
            <v-form @submit.prevent="createTask">
              
              <v-text-field 
                v-model="form.title" 
                label="O que precisa ser feito?" 
                variant="outlined" 
                density="comfortable"
                color="primary"
                prepend-inner-icon="mdi-format-title"
              ></v-text-field>

              <v-textarea 
                v-model="form.description" 
                label="Detalhes (opcional)" 
                variant="outlined" 
                density="comfortable"
                color="primary"
                rows="3"
                prepend-inner-icon="mdi-text"
              ></v-textarea>

              <v-select
                v-model="form.category"
                :items="categories"
                item-title="title"
                item-value="value"
                label="Categoria"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-tag-outline"
              >
                <template v-slot:selection="{ item }">
                  <v-chip :color="item.raw.color" size="x-small" label class="font-weight-bold">
                    {{ item.title }}
                  </v-chip>
                </template>
              </v-select>

              <v-btn 
                color="primary" 
                block 
                size="large" 
                class="mt-2 font-weight-bold" 
                :disabled="!form.title" 
                type="submit"
                :loading="loading"
              >
                Criar Tarefa
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8" lg="7">
        <v-card elevation="2" class="rounded-lg">
          
          <v-toolbar color="surface" flat border>
            <v-icon class="ml-4" color="primary">mdi-checkbox-marked-circle-auto-outline</v-icon>
            <v-toolbar-title class="text-h6 font-weight-bold text-primary">
              Minhas Tarefas
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-chip class="mr-4" color="primary" variant="tonal">
              Total: {{ tasks.length }}
            </v-chip>
          </v-toolbar>

          <v-sheet 
            v-if="tasks.length === 0" 
            class="d-flex flex-column align-center justify-center pa-10"
            min-height="300"
          >
            <v-icon size="80" color="grey-lighten-2" class="mb-4">mdi-clipboard-text-off-outline</v-icon>
            <div class="text-h6 text-grey">Nenhuma tarefa por enquanto</div>
            <div class="text-body-2 text-grey-lighten-1">Aproveite seu tempo livre!</div>
          </v-sheet>

          <v-list v-else lines="two" class="pa-2">
            <template v-for="(t, index) in tasks" :key="t.id">
              
              <v-list-item 
                class="rounded-lg mb-2 elevation-1" 
                :class="t.done ? 'bg-grey-lighten-4' : ''"
              >
                <template v-slot:prepend>
                  <v-checkbox-btn 
                    :model-value="t.done" 
                    @change="toggleDone(t)"
                    color="success"
                  ></v-checkbox-btn>
                </template>

                <v-list-item-title 
                  class="font-weight-medium text-body-1"
                  :class="{ 'text-decoration-line-through text-grey': t.done }"
                >
                  {{ t.title }}
                  <v-chip 
                    v-if="t.category" 
                    size="x-small" 
                    :color="getCategoryColor(t.category)" 
                    class="ml-2" 
                    variant="flat"
                  >
                    {{ getCategoryLabel(t.category) }}
                  </v-chip>
                </v-list-item-title>

                <v-list-item-subtitle class="mt-1">
                  {{ t.description || 'Sem descrição' }}
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-btn 
                    icon="mdi-trash-can-outline" 
                    variant="text" 
                    color="error" 
                    size="small"
                    @click="deleteTask(t.id)"
                  ></v-btn>
                </template>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar 
      v-model="snackbar.show" 
      :color="snackbar.color" 
      timeout="3000"
      location="bottom right"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Fechar</v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSessionStore } from '../stores/session'

const session = useSessionStore()
const tasks = ref<any[]>([])
const loading = ref(false)

// Configuração do Formulário
const form = ref({ 
  title: '', 
  description: '', 
  category: 'personal' // Categoria padrão
})

// Opções de Categorias
const categories = [
  { title: 'Trabalho', value: 'work', color: 'blue-darken-2' },
  { title: 'Pessoal', value: 'personal', color: 'green-darken-1' },
  { title: 'Urgente', value: 'urgent', color: 'red-accent-2' },
  { title: 'Estudos', value: 'study', color: 'purple-lighten-1' },
]

// Estado da Notificação (Snackbar)
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// --- Helpers Visuais ---
function getCategoryColor(value: string) {
  const cat = categories.find(c => c.value === value)
  return cat ? cat.color : 'grey'
}

function getCategoryLabel(value: string) {
  const cat = categories.find(c => c.value === value)
  return cat ? cat.title : value
}

function showMessage(text: string, color: string = 'success') {
  snackbar.value = { show: true, text, color }
}

// --- API ---

function headers() {
  return {
    'Content-Type': 'application/json',
    ...(session.token ? { Authorization: `Bearer ${session.token}` } : {}),
  }
}

async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(import.meta.env.VITE_API_URL + path, { ...options, headers: headers() })
  if (!res.ok) throw new Error((await res.json()).error || 'Erro na API')
  return res.json()
}

// --- Ações ---

async function loadTasks() {
  try {
    tasks.value = await api('/tasks')
  } catch (e: any) {
    showMessage(e.message, 'error')
  }
}

async function createTask() {
  loading.value = true
  try {
    // Enviamos o formulário completo, agora com a categoria
    await api('/tasks', { method: 'POST', body: JSON.stringify(form.value) })
    
    // Reset do formulário
    form.value = { title: '', description: '', category: 'personal' }
    
    await loadTasks()
    showMessage('Tarefa criada com sucesso!')
  } catch (e: any) {
    showMessage(e.message, 'error')
  } finally {
    loading.value = false
  }
}

async function toggleDone(t: any) {
  try {
    await api(`/tasks/${t.id}`, { method: 'PUT', body: JSON.stringify({ ...t, done: !t.done }) })
    await loadTasks()
    // Pequeno feedback visual opcional
    if (!t.done) showMessage('Tarefa concluída!', 'blue') 
  } catch (e: any) {
    showMessage(e.message, 'error')
  }
}

async function deleteTask(id: number) {
  if(!confirm("Tem certeza que deseja excluir esta tarefa?")) return
  
  try {
    await api(`/tasks/${id}`, { method: 'DELETE' })
    await loadTasks()
    showMessage('Tarefa removida.', 'grey-darken-3')
  } catch (e: any) {
    showMessage(e.message, 'error')
  }
}

// Monitora o token e carrega
watch(() => session.token, (token) => {
  if (token) loadTasks()
}, { immediate: true })
</script>