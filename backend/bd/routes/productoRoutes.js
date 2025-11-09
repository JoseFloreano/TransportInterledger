import express from 'express';
import  { Producto }  from '../models/Producto.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});



router.post('/', async (req, res) => {
    try {
        const producto = await Producto.create(req.body);
        res.status(201).json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});



router.put('/:id', async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default router;


