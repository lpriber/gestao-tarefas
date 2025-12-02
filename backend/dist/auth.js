"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
if (!firebase_admin_1.default.apps.length) {
    // Inicialize com credencial de serviço (recomendado)
    // admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON!)) })
    // Para desenvolvimento sem credenciais, usar admin.initializeApp() pode falhar em verifyIdToken.
    firebase_admin_1.default.initializeApp();
}
async function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer '))
        return res.status(401).json({ error: 'Token ausente' });
    const token = header.substring(7);
    try {
        const decoded = await firebase_admin_1.default.auth().verifyIdToken(token);
        req.user = { uid: decoded.uid, email: decoded.email };
        next();
    }
    catch {
        return res.status(401).json({ error: 'Token inválido' });
    }
}
