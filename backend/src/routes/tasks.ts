// src/routes/tasks.ts
import { Router } from 'express'
import { pool } from '../db'

const router = Router()

router.get('/', async (req: any, res) => {
  try {
    const uid = req.user.uid
    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE user_uid = ? ORDER BY created_at DESC',
      [uid]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar tarefas' })
  }
})

router.post('/', async (req: any, res) => {
  try {
    const uid = req.user.uid
    const { title, description } = req.body
    if (!title) return res.status(400).json({ error: 'Título é obrigatório' })

    const [result]: any = await pool.query(
      'INSERT INTO tasks (user_uid, title, description, done, created_at) VALUES (?, ?, ?, ?, NOW())',
      [uid, title, description || null, false]
    )

    res.status(201).json({ id: result.insertId, user_uid: uid, title, description, done: false })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao criar tarefa' })
  }
})

router.put('/:id', async (req: any, res) => {
  try {
    const uid = req.user.uid
    const { id } = req.params
    const { title, description, done } = req.body

    const [result]: any = await pool.query(
      'UPDATE tasks SET title=?, description=?, done=? WHERE id=? AND user_uid=?',
      [title, description, !!done, id, uid]
    )

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tarefa não encontrada' })

    res.json({ id, title, description, done: !!done })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao atualizar tarefa' })
  }
})

router.delete('/:id', async (req: any, res) => {
  try {
    const uid = req.user.uid
    const { id } = req.params

    const [result]: any = await pool.query(
      'DELETE FROM tasks WHERE id=? AND user_uid=?',
      [id, uid]
    )

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tarefa não encontrada' })

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao deletar tarefa' })
  }
})

export default router