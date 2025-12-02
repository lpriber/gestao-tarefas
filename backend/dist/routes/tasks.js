"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/tasks.ts
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    const uid = req.user.uid;
    const [rows] = await db_1.pool.query('SELECT * FROM tasks WHERE user_uid = ? ORDER BY created_at DESC', [uid]);
    res.json(rows);
});
router.post('/', async (req, res) => {
    const uid = req.user.uid;
    const { title, description } = req.body;
    if (!title)
        return res.status(400).json({ error: 'Título é obrigatório' });
    const [result] = await db_1.pool.query('INSERT INTO tasks (user_uid, title, description) VALUES (?, ?, ?)', [uid, title, description || null]);
    res.status(201).json({ id: result.insertId, user_uid: uid, title, description, done: 0 });
});
router.put('/:id', async (req, res) => {
    const uid = req.user.uid;
    const { id } = req.params;
    const { title, description, done } = req.body;
    const [result] = await db_1.pool.query('UPDATE tasks SET title = ?, description = ?, done = ? WHERE id = ? AND user_uid = ?', [title, description, !!done, id, uid]);
    if (result.affectedRows === 0)
        return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.json({ id, title, description, done: !!done });
});
router.delete('/:id', async (req, res) => {
    const uid = req.user.uid;
    const { id } = req.params;
    const [result] = await db_1.pool.query('DELETE FROM tasks WHERE id = ? AND user_uid = ?', [id, uid]);
    if (result.affectedRows === 0)
        return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.json({ success: true });
});
exports.default = router;
