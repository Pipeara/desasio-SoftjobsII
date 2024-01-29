import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { getUsers, getUserById, checkCredentials, registerUser } from './consultas.js';
import { reporteConsulta, verificarUsuario, verificarLogin, validarToken } from './middleware.js';

// Importa el middleware de manejo de errores desde la misma carpeta
import errorHandler from './errorHandler.js';

const app = express();

config(); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Servidor abierto en el puerto', PORT);
});

app.use(cors());
app.use(express.json());

// Middleware de manejo de errores
app.use(errorHandler);

// Resto de tu código...


// ---------------------------------------------------
// GET a Usuarios
app.get('/usuarios', reporteConsulta, async (req, res) => {
    try {
        const usuarios = await getUsers();
        res.json(usuarios);
    } catch (error) {
        res.status(error.code || 500).send(error);
    }
});


app.get('/usuarios/:id', validarToken, reporteConsulta, verificarUsuario, async (req, res) => {
    const { id } = req.params;
    const usuario = await getUserById(id);
    res.json(usuario);
});

// POST/usuarios
app.post('/usuarios', async (req, res) => {
    try {
        const usuario = req.body;

        await registerUser(usuario);
        res.send('Usuario creado con éxito');
    } catch (error) {
        console.log('Error en creación de usuario', error);
        res.status(500).send(error);
    }
});


// ------Login ------------------

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        await checkCredentials(email, password);
        const token = jwt.sign({ email },"az_aZ");
        res.send(token);
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(error);
    }
});
