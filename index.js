const express = require("express");
const sequelize = require('./Conection/database');
const Usuario = require('./Models/Usuario');
const Pelicula = require('./Models/Pelicula');
const Favorito = require('./Models/Favoritos');
const app = express();
var cors = require('cors');
app.use(cors())


app.use(express.json());

/* -------------------
   LOGIN DE USUARIO
------------------- */
app.post("/usuarios/login", async (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ message: "Correo y contraseña son requeridos" });
    }

    try {
        const usuario = await Usuario.findOne({ where: { correo, password } });

        if (!usuario) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        res.json({
            message: "Login exitoso",
            usuario: {
                id: usuario.id_usuario,
                correo: usuario.correo

            }
        });
    } catch (err) {
        res.status(500).json({ message: "Error en el servidor", error: err.message });
    }
});



/* -------------------
   USUARIOS (CRUD)
------------------- */
app.get("/usuarios", async (req, res) => {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
});

app.get("/usuarios/:id", async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    usuario ? res.json(usuario) : res.status(404).json({ error: "Usuario no encontrado" });
});

app.post("/usuarios", async (req, res) => {
    const nuevo = await Usuario.create(req.body);
    res.json(nuevo);
});

app.put("/usuarios/:id", async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    await usuario.update(req.body);
    res.json(usuario);
});

app.delete("/usuarios/:id", async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    await usuario.destroy();
    res.json({ message: "Usuario eliminado" });
});


/* -------------------
   PELICULAS (CRUD)
------------------- */
app.get("/peliculas", async (req, res) => {
    const peliculas = await Pelicula.findAll();
    res.json(peliculas);
});

app.get("/peliculas/:id", async (req, res) => {
    const pelicula = await Pelicula.findByPk(req.params.id);
    pelicula ? res.json(pelicula) : res.status(404).json({ error: "Película no encontrada" });
});

app.post("/peliculas", async (req, res) => {
    const nueva = await Pelicula.create(req.body);
    res.json(nueva);
});

app.put("/peliculas/:id", async (req, res) => {
    const pelicula = await Pelicula.findByPk(req.params.id);
    if (!pelicula) return res.status(404).json({ error: "Película no encontrada" });
    await pelicula.update(req.body);
    res.json(pelicula);
});

app.delete("/peliculas/:id", async (req, res) => {
    const pelicula = await Pelicula.findByPk(req.params.id);
    if (!pelicula) return res.status(404).json({ error: "Película no encontrada" });
    await pelicula.destroy();
    res.json({ message: "Película eliminada" });
});



/* -------------------
   FAVORITOS (CRUD)
------------------- */
app.get("/favoritos", async (req, res) => {
    const favoritos = await Favorito.findAll({
        include: [Usuario, Pelicula],
    });
    res.json(favoritos);
});


// Obtener favoritos por id de usuario
app.get("/favoritos/usuario/:id", async (req, res) => {
    const idUsuario = req.params.id;

    try {
        const favoritos = await Favorito.findAll({
            where: { id_usuario: idUsuario },
            include: [Pelicula], // Incluye solo la información de la película
        });

        if (!favoritos || favoritos.length === 0) {
            return res.status(404).json({ message: "No se encontraron favoritos para este usuario" });
        }

        res.json(favoritos);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener favoritos", error: err.message });
    }
});



app.post("/favoritos", async (req, res) => {
    const { id_usuario, id_pelicula, comentario, calificacion } = req.body;
    try {
        const favorito = await Favorito.create({ id_usuario, id_pelicula, comentario, calificacion });
        res.json(favorito);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Agregar una película a favoritos del usuario actual
app.post("/usuarios/:id/favoritos", async (req, res) => {
    const idUsuario = req.params.id;
    const {id_pelicula, titulo, comentario, calificacion } = req.body;

    try {
        // Validación: asegurarse de que se envíe un título
        if (!titulo) {
            return res.status(400).json({ message: "El título de la película es requerido" });
        }

        // Verificar que exista el usuario
        const usuario = await Usuario.findByPk(idUsuario);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Verificar si ya existe en favoritos
        const yaExiste = await Favorito.findOne({
            where: { id_usuario: idUsuario, titulo }
        });
        if (yaExiste) {
            return res.status(400).json({ message: "La película ya está en favoritos" });
        }

        // Crear el favorito
        const favorito = await Favorito.create({
            id_usuario: idUsuario,
            titulo:titulo,
            comentario: comentario || "",
            calificacion: calificacion || null
        });

        res.status(201).json({
            message: "Película agregada a favoritos exitosamente",
            favorito
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error al agregar a favoritos",
            error: err.message
        });
    }
});







app.delete("/favoritos/:id", async (req, res) => {
    const favorito = await Favorito.findByPk(req.params.id);
    if (!favorito) return res.status(404).json({ error: "Favorito no encontrado" });
    await favorito.destroy();
    res.json({ message: "Favorito eliminado" });
});



/* -------------------
   INICIO DEL SERVIDOR
------------------- */

app.listen(3000, () => {
    console.log('corriendo en puerto 3000');
});