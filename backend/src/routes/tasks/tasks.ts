// src/routes/tasks.ts
import { Router } from 'express'
import { tasksService } from '../../services/tasks/tasks'

const router = Router()

/**
 * @swagger
 * /api/tarefas:
 * get:
 * summary: Lista todas as tarefas do usuário autenticado
 * tags: [Tarefas]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Lista de tarefas retornada com sucesso
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Task'
 * 401:
 * description: Não autenticado
 * 500:
 * description: Erro ao buscar tarefas
 */
router.get('/', async (req: any, res) => {
  try {
    const uid = req.user.uid
    const tasks = await tasksService.getTodasTask(uid)
    res.json(tasks)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar tarefas' })
  }
})

/**
 * @swagger
 * /api/tarefas:
 * post:
 * summary: Cria uma nova tarefa
 * tags: [Tarefas]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/CreateTaskRequest'
 * responses:
 * 201:
 * description: Tarefa criada com sucesso
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Task'
 * 400:
 * description: Título é obrigatório
 * 401:
 * description: Não autenticado
 * 500:
 * description: Erro ao criar tarefa
 */
router.post('/', async (req: any, res) => {
  try {
    const uid = req.user.uid
    // 🔹 CORREÇÃO: Adicionado 'categoria' na leitura do corpo da requisição
    const { title, description, categoria } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Título é obrigatório' })
    }

    // 🔹 CORREÇÃO: Passando 'categoria' para o serviço
    const newTask = await tasksService.criarTask(uid, { title, description, categoria })
    
    res.status(201).json(newTask)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao criar tarefa' })
  }
})

/**
 * @swagger
 * /api/tarefas/{id}:
 * put:
 * summary: Atualiza uma tarefa existente
 * tags: [Tarefas]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: ID da tarefa
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UpdateTaskRequest'
 * responses:
 * 200:
 * description: Tarefa atualizada com sucesso
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Task'
 * 401:
 * description: Não autenticado
 * 404:
 * description: Tarefa não encontrada
 * 500:
 * description: Erro ao atualizar tarefa
 */
router.put('/:id', async (req: any, res) => {
  try {
    const uid = req.user.uid
    const id = parseInt(req.params.id)
    // 🔹 CORREÇÃO: Adicionado 'categoria' na leitura para atualização
    const { title, description, done, categoria } = req.body

    // 🔹 CORREÇÃO: Passando 'categoria' para o serviço de atualização
    const updatedTask = await tasksService.atualizarTask(id, uid, { title, description, done, categoria })

    if (!updatedTask) {
      return res.status(404).json({ error: 'Tarefa não encontrada' })
    }

    res.json(updatedTask)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao atualizar tarefa' })
  }
})

/**
 * @swagger
 * /api/tarefas/{id}:
 * delete:
 * summary: Deleta uma tarefa
 * tags: [Tarefas]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: ID da tarefa
 * responses:
 * 200:
 * description: Tarefa deletada com sucesso
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success:
 * type: boolean
 * example: true
 * 401:
 * description: Não autenticado
 * 404:
 * description: Tarefa não encontrada
 * 500:
 * description: Erro ao deletar tarefa
 */
router.delete('/:id', async (req: any, res) => {
  try {
    const uid = req.user.uid
    const id = parseInt(req.params.id)

    const deleted = await tasksService.deletarTask(id, uid)

    if (!deleted) {
      return res.status(404).json({ error: 'Tarefa não encontrada' })
    }

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao deletar tarefa' })
  }
})

export default router