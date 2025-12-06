export interface Perfil {
  user_uid: string
  name: string | null
  email: string | null
  photoURL: string | null
}

export const perfilSwaggerSchema = {
  Perfil: {
    type: 'object',
    properties: {
      user_uid: {
        type: 'string',
        example: 'user123',
        description: 'UID do usuário'
      },
      name: {
        type: 'string',
        nullable: true,
        example: 'John Doe',
        description: 'Nome do usuário'
      },
      email: {
        type: 'string',
        nullable: true,
        example: 'john.doe@example.com',
        description: 'Email do usuário'
      },
      photoURL: {
        type: 'string',
        nullable: true,
        example: 'https://example.com/photo.jpg',
        description: 'URL da foto do usuário'
      },
    },
    required: ['user_uid']
  }
}