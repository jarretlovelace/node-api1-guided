// IMPORTS AT THE TOP
const express = require('express');
const Dog = require('./dog-model');

// INSTANCE OF EXPRESS APP
const server = express();

// GLOBAL MIDDLEWARE
server.use(express.json());

// ENDPOINTS
// [GET]    /             (Hello World endpoint)
server.get('/hello-world', (req, res) => {
    res.status(200).json({ message: "hello, world" });
});

// [GET]    /api/dogs     (R of CRUD, fetch all dogs)
server.get('/api/dogs', async (req, res) => {
    try {
        const dogs = await Dog.findAll();
        res.status(200).json(dogs);
    } catch (err) {
        res.status(500).json({ message: `Error fetching dogs: ${err.message}` });
    }
});

// [GET]    /api/dogs/:id (R of CRUD, fetch dog by :id)
server.get('/api/dogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const dog = await Dog.findById(id);
        if (dog) {
            res.status(200).json(dog);
        } else {
            res.status(404).json({ message: `Dog with ID ${id} not found` });
        }
    } catch (err) {
        res.status(500).json({ message: `Error fetching dog ${req.params.id}: ${err.message}` });
    }
});

// [POST]   /api/dogs     (C of CRUD, create new dog from JSON payload)
server.post('/api/dogs', async (req, res) => {
    try {
        const { name, weight } = req.body;
        if (!name || !weight) {
            res.status(422).json({ message: 'Dogs need name and weight' });
        } else {
            const createdDog = await Dog.create({ name, weight });
            res.status(201).json({
                message: 'Success creating dog',
                data: createdDog
            });
        }
    } catch (err) {
        res.status(500).json({ message: `Error creating dog: ${err.message}` });
    }
});

// [PUT]    /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)
server.put('/api/dogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, weight } = req.body;
        const updatedDog = await Dog.update(id, { name, weight });
        if (updatedDog) {
            res.status(200).json({
                message: 'Success updating dog',
                data: updatedDog
            });
        } else {
            res.status(404).json({ message: `Dog with ID ${id} not found` });
        }
    } catch (err) {
        res.status(500).json({ message: `Error updating dog ${req.params.id}: ${err.message}` });
    }
});

// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)
server.delete('/api/dogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDog = await Dog.remove(id);
        if (deletedDog) {
            res.status(200).json({ message: 'Success deleting dog' });
        } else {
            res.status(404).json({ message: `Dog with ID ${id} not found` });
        }
    } catch (err) {
        res.status(500).json({ message: `Error deleting dog ${req.params.id}: ${err.message}` });
    }
});

// EXPOSING THE SERVER TO OTHER MODULES
module.exports = server;
