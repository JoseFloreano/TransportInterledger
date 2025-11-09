import express from 'express';
import {Wallet} from '../models/Wallet.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const wallets = await Wallet.find();
        res.json(wallets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las wallets' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const wallet = await Wallet.findById(req.params.id);
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet no encontrada' });
        }
        res.json(wallet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la wallet' });
    }
});

// Agregar esta ruta a tu router
router.get('/user/:userId', async (req, res) => {
    try {
        const wallets = await Wallet.find({ id_usuario: req.params.userId });
        res.json(wallets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las wallets del usuario' });
    }
});

router.post('/', async (req, res) => {
    try {
        const wallet = await Wallet.create(req.body);
        res.status(201).json(wallet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la wallet' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const wallet = await Wallet.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet no encontrada' });
        }
        res.json(wallet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la wallet' });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const wallet = await Wallet.findByIdAndDelete(req.params.id);
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet no encontrada' });
        }
        res.json(wallet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la wallet' });
    }
});



export default router;