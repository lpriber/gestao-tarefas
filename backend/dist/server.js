"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const auth_1 = require("./auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Configuração de CORS
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // portas do Vite
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/tasks', auth_1.requireAuth, tasks_1.default);
app.listen(process.env.PORT || 3000, () => {
    console.log('API rodando em http://localhost:3000');
});
