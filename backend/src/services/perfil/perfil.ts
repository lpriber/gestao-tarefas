import admin from 'firebase-admin'
import { Perfil } from '../../schemas/perfil/perfil'

export const perfilService = {
  async getPerfil(uid: string): Promise<Perfil | null> {
    try {
      // Busca informações do usuário no Firebase Auth
      const userRecord = await admin.auth().getUser(uid)

      const perfil: Perfil = {
        user_uid: userRecord.uid,
        name: userRecord.displayName || null,
        email: userRecord.email || null,
        photoURL: userRecord.photoURL || null,
      }

      return perfil
    } catch (err) {
      console.error('Erro ao buscar perfil do Firebase:', err)
      return null
    }
  }
}