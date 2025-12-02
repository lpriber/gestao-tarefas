// src/auth.ts
import { Request, Response, NextFunction } from 'express'
import admin from 'firebase-admin'
import path from 'path'

// 🔹 Inicializa Firebase Admin com a chave de serviço
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      require(path.resolve(__dirname, '../serviceAccountKey.json'))
    ),
  })
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  // 🔹 Permite requisições OPTIONS (preflight CORS) sem exigir token
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }

  const header = req.headers.authorization
  console.log("Authorization header recebido:", header)

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token ausente' })
  }

  const token = header.substring(7)

  try {
    const decoded = await admin.auth().verifyIdToken(token)
    ;(req as any).user = { uid: decoded.uid, email: decoded.email }
    next()
  } catch (err) {
    console.error('Erro ao validar token:', err)
    return res.status(401).json({ error: 'Token inválido' })
  }
}