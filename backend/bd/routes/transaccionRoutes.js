import express from 'express';
import { Transaccion } from '../models/Transaccion.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const transacciones = await Transaccion.find();
        res.json(transacciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las transacciones' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const transaccion = await Transaccion.findById(req.params.id);
        if (!transaccion) {
            return res.status(404).json({ error: 'Transaccion no encontrada' });
        }
        res.json(transaccion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la transaccion' });
    }
});


router.post('/', async (req, res) => {
    try {
        const transaccion = new Transaccion(req.body);
        await transaccion.save();
        res.status(201).json(transaccion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la transaccion' });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const transaccion = await Transaccion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!transaccion) {
            return res.status(404).json({ error: 'Transaccion no encontrada' });
        }
        res.json(transaccion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la transaccion' });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const transaccion = await Transaccion.findByIdAndDelete(req.params.id);
        if (!transaccion) {
            return res.status(404).json({ error: 'Transaccion no encontrada' });
        }
        res.json(transaccion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la transaccion' });
    }
});

export default router;