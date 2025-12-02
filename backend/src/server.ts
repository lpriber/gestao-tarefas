// src/server.ts
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import { requireAuth } from './auth'
import tasksRouter from './routes/tasks'

const app = express()

// 🔹 CORS permitindo qualquer origem (em produção, restrinja ao domínio do frontend)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())

// 🔹 Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.get('/', (req, res) => res.send('API Gestão de Tarefas'))

// 🔹 Monta o router de tarefas protegido por requireAuth
app.use('/api/tasks', requireAuth, tasksRouter)

// 🔹 Inicialização do servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}`)
})
