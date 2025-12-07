export interface Task {
  id: number
  user_uid: string
  title: string
  description: string | null
  categoria: number | null
  done: boolean
  created_at: Date
}

export interface CriarTask {
  title: string
  description?: string
  categoria?: number
}

export interface AtualizarTask {
  title?: string
  description?: string
  categoria?: number
  done?: boolean
}

export const taskSwaggerSchema = {
  Task: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
        description: 'ID da tarefa'
      },
      user_uid: {
        type: 'string',
        example: 'user123',
        description: 'UID do usuário proprietário da tarefa'
      },
      title: {
        type: 'string',
        example: 'Minha tarefa',
        description: 'Título da tarefa'
      },
      description: {
        type: 'string',
        nullable: true,
        example: 'Descrição da tarefa',
        description: 'Descrição detalhada da tarefa'
      },
      categoria: {
        type: 'integer',
        nullable: true,
        example: 1,
        description: 'ID da categoria da tarefa'
      },
      done: {
        type: 'boolean',
        example: false,
        description: 'Status de conclusão da tarefa'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-01T00:00:00.000Z',
        description: 'Data de criação da tarefa'
      }
    },
    required: ['id', 'user_uid', 'title', 'done', 'created_at']
  },
  CreateTaskRequest: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        example: 'Nova tarefa',
        description: 'Título da tarefa (obrigatório)'
      },
      description: {
        type: 'string',
        example: 'Descrição da nova tarefa',
        description: 'Descrição da tarefa (opcional)'
      },
      categoria: {
        type: 'integer',
        example: 1,
        description: 'ID da categoria da tarefa (opcional)'
      }
    },
    required: ['title']
  },
  UpdateTaskRequest: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        example: 'Tarefa atualizada',
        description: 'Novo título da tarefa'
      },
      description: {
        type: 'string',
        example: 'Nova descrição',
        description: 'Nova descrição da tarefa'
      },
      categoria: {
        type: 'integer',
        example: 1,
        description: 'ID da categoria da tarefa'
      },
      done: {
        type: 'boolean',
        example: true,
        description: 'Status de conclusão da tarefa'
      }
    }
  }
}
