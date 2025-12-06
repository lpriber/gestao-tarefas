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

### 🔹 Frontend (Vue.js 3 + Vuetify + Pinia + Router)
1. Acesse a pasta `frontend`:
   ```bash
   cd frontend

2. Instale dependências:

bash
npm install

3. Crie o arquivo .env com as variáveis de ambiente:
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=<sua-chave>
VITE_FIREBASE_AUTH_DOMAIN=<seu-domínio>
VITE_FIREBASE_PROJECT_ID=<seu-projeto>

4. Execute:

npm run dev

5 O frontend estará disponível em http://localhost:5173.

Backend (Express.js + MySQL)

1. Acesse a pasta backend:

cd backend

2. Instale dependências:

npm install

3. Crie o arquivo .env com as variáveis de ambiente:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<sua-senha>
DB_NAME=gestao_tarefas
PORT=3000

4. Configure o banco de dados MySQL:

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

5. Execute:

npm run dev

6. O backend estará disponível em http://localhost:3000.