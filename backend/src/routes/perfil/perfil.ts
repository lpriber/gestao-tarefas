// src/routes/perfil/perfil.ts
import { Router } from 'express'
import { perfilService } from '../../services/perfil/perfil'

const router = Router()

/**
 * @swagger
 * /api/perfil:
 *   get:
 *     summary: Busca informações do perfil do usuário autenticado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informações do usuário retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Perfil'
 *       401:
 *         description: Não autenticado
 *       404:
 *         description: Perfil não encontrado
 *       500:
 *         description: Erro ao buscar informações do usuário
 */
router.get('/', async (req: any, res) => {
  try {
    const uid = req.user.uid
    const perfil = await perfilService.getPerfil(uid)
    
    if (!perfil) {
      return res.status(404).json({ error: 'Perfil não encontrado' })
    }
    
    res.json(perfil)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar informações do usuário' })
  }
})

export default router