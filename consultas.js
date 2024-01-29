import pkg from 'pg';
const { Pool } = pkg;

import bcrypt from 'bcryptjs';

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '',
    database: 'softjobs',
    allowExitOnIdle: true
});

// Obtener usuarios
const getUsers = async () => {
    console.log('Dentro de la función getUsers...');
    const { rows: users } = await pool.query('SELECT * FROM usuarios');
    return users;
}

const getUserById = async (id) => {
    const query = 'SELECT * FROM usuarios WHERE id = $1';
    const values = [id];
    const result = await pool.query(query, values);
    const [user] = result.rows;
    return user;
}

// Verificar credenciales
const checkCredentials = async (email, password) => {
    const values = [email];
    const query = "SELECT * FROM usuarios WHERE email = $1";

    const result = await pool.query(query, values)
    console.log("valor de rowcount: " + result.rowCount)
    console.log("valor de rows: " + result.rows)

    if (result.rows.length === 0) {
        throw { code: 401, message: "email no existe" }
    }
    const passEncriptada = result.rows[0].password
    console.log("Valor de passEncriptada: ", passEncriptada)
    const passwordEsCorrecta = bcrypt.compareSync(password, passEncriptada)

    if (!passwordEsCorrecta) {
        throw { code: 401, message: "Contraseña incorrecta" }
    }
}

// Registrar nuevo usuario
const registerUser = async (user) => {
    try {
        const { email, password, rol, lenguage } = user;
        const hashedPassword = bcrypt.hashSync(password, 10); // encripta la contraseña

        const query = 'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)';
        const values = [email, hashedPassword, rol, lenguage];
        const { rowCount } = await pool.query(query, values);

        if (rowCount === 1) {
            console.log('Usuario registrado con éxito');
        } else {
            console.error('Error al registrar usuario: No se insertó ninguna fila');
            throw new Error('No se pudo insertar el usuario');
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw error;
    }
};

export { getUsers, getUserById, checkCredentials, registerUser };
