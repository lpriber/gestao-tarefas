# Sistema de Gestão de Tarefas

## 👥 Integrantes
- LUCAS PEREIRA RIBEIRO CORRÊA
- VITOR ROBERTO B. DOS SANTOS
- GABRIEL FERNANDO BRAND

## 📖 Descrição
Este sistema foi desenvolvido para auxiliar na **gestão de tarefas** de usuários autenticados.  
Principais funcionalidades:
- Autenticação com conta Google (Firebase Authentication).
- Manutenção de sessão com Pinia.
- CRUD completo de tarefas (criar, listar, atualizar, excluir).
- Interface responsiva com Vuetify.
- Integração entre frontend (Vue.js 3) e backend (Express.js + MySQL).

---

## 🚀 Instalação e Execução

### Faça o clone do projeto em sua máquina
- Primeiramente digite em seu terminal:
   ```bash
   git clone https://github.com/lpriber/gestao-tarefas.git

### 🔹 Frontend (Vue.js 3 + Vuetify + Pinia + Router)
1. Acesse a pasta `frontend`:
   ```bash
   cd frontend
   
2. Instale dependências:

   ```bash
   npm install

3. Crie o arquivo .env com as variáveis de ambiente:

   ```bash
   VITE_API_URL=http://localhost:3000/api
   VITE_FIREBASE_API_KEY=<sua-chave>
   VITE_FIREBASE_AUTH_DOMAIN=<seu-domínio>
   VITE_FIREBASE_PROJECT_ID=<seu-projeto>

5. Execute:

   ```bash
   npm run dev

5. O frontend estará disponível em `http://localhost:5173`.

### 🔹Backend (Express.js + MySQL)

1. Acesse a pasta backend:

   ```bash
   cd backend

2. Instale dependências:

   ```bash
   npm install

3. Crie o arquivo .env com as variáveis de ambiente:

   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=<sua-senha>
   DB_NAME=gestao_tarefas
   PORT=3000

4. Adicione um arquivo chamado `serviceAccountKey.json` no backend contendo os dados e chave do firebase:
   
- Acesse o seu projeto no Firebase Console
- Configurações do projeto → Aba Contas de Serviço
- Clique em Gerar nova chave privada
- Baixe o arquivo e salve como serviceAccountKey.json no backend

5. Configure o banco de dados MySQL:

   ```bash
   CREATE DATABASE IF NOT EXISTS gestao_tarefas;
   USE gestao_tarefas;
   CREATE TABLE IF NOT EXISTS tasks (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_uid VARCHAR(128) NOT NULL,
     title VARCHAR(255) NOT NULL,
     description TEXT,
     done BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

6. Execute:
   ```bash
   npm run dev

8. O backend estará disponível em `http://localhost:3000`.
