import jwt from "jsonwebtoken";
import { getUserById } from "./consultas.js";

const reporteConsulta = async (req, res, next) => {
    const parametros = req.params;
    const querys = req.query;
    const url = req.url;

    console.log(`Hoy ${new Date()},  consulta en la ruta ${url} con parámetros y querys: `, parametros, querys);

    next();
}

const verificarLogin = async (req, res, next) => {
    console.log(' verificando el login ');
    const { email, password } = req.body;

    console.log(`Se ha recibido el correo ${email} y la clave ${password}`);

    if (!email || !password) {
        res.status(400).send('Credenciales incorrectas...');
    }

    next();
}

const validarToken = async (req, res, next) => {
    const token = req.headers.authorization;

    console.log('validando Token...');

    if (!token) {
        return res.status(401).json({ error: 'Falta el token...' });
    }

    try {
       // const payload = jwt.verify(token, process.env.JWT_SECRET);=
       const tokenSplit=token.split("bearer") [1];
jwt.verify(tokenSplit,"az_Az");
next();
        
       
    } catch (error) {
        console.log(error);
        return res.status(401).send({ error: 'Token inválido...' });
    }
}

const verificarUsuario = async (req, res, next) => {
    const { id } = req.params;

    try {
        await getUserById(id);
        next();
    } catch (error) {
        res.status(404).send('No se consiguió ningún usuario con este id');
    }
};

export { reporteConsulta, verificarLogin, validarToken, verificarUsuario };
