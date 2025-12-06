import { pool } from '../../db'
import { Task, CriarTask, AtualizarTask } from '../../schemas/tasks/tasks'

export const tasksService = {
  async getTodasTask(uid: string): Promise<Task[]> {
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM tasks WHERE user_uid = ? ORDER BY created_at DESC',
      [uid]
    )
    return rows as Task[]
  },

  async getTaskPorId(id: number, uid: string): Promise<Task | null> {
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM tasks WHERE id = ? AND user_uid = ?',
      [id, uid]
    )
    const tasks = rows as Task[]
    return tasks.length > 0 ? tasks[0] : null
  },

  async criarTask(uid: string, data: CriarTask): Promise<Task> {
    const { title, description } = data

    const [result]: any = await pool.query(
      'INSERT INTO tasks (user_uid, title, description, done, created_at) VALUES (?, ?, ?, ?, NOW())',
      [uid, title, description || null, false]
    )

    const newTask: Task = {
      id: result.insertId,
      user_uid: uid,
      title,
      description: description || null,
      done: false,
      created_at: new Date()
    }

    return newTask
  },

  async atualizarTask(id: number, uid: string, data: AtualizarTask): Promise<Task | null> {
    const currentTask = await this.getTaskPorId(id, uid)
    if (!currentTask) {
      return null
    }

    const updatedData = {
      title: data.title !== undefined ? data.title : currentTask.title,
      description: data.description !== undefined ? data.description : currentTask.description,
      done: data.done !== undefined ? !!data.done : currentTask.done
    }

    const [result]: any = await pool.query(
      'UPDATE tasks SET title=?, description=?, done=? WHERE id=? AND user_uid=?',
      [updatedData.title, updatedData.description, updatedData.done, id, uid]
    )

    if (result.affectedRows === 0) {
      return null
    }

    return {
      ...currentTask,
      ...updatedData
    }
  },

  async deletarTask(id: number, uid: string): Promise<boolean> {
    const [result]: any = await pool.query(
      'DELETE FROM tasks WHERE id=? AND user_uid=?',
      [id, uid]
    )

    return result.affectedRows > 0
  }
}

