const { DataTypes }=require("sequelize");
const sequelize =require("../Conection/database");
const Usuario = require("../Models/Usuario");
const Pelicula = require("../Models/Pelicula");

const Favorito = sequelize.define("Favorito", {
    id_favorito: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    comentario: {
        type: DataTypes.STRING(255),
    },
    calificacion: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 5,
        },
    },
}, {
    tableName: "favoritos",
    timestamps: false,
});

// Relaciones
Usuario.belongsToMany(Pelicula, { through: Favorito, foreignKey: "id_usuario" });
Pelicula.belongsToMany(Usuario, { through: Favorito, foreignKey: "id_pelicula" });

Favorito.belongsTo(Usuario, { foreignKey: "id_usuario" });
Favorito.belongsTo(Pelicula, { foreignKey: "id_pelicula" });

module.exports= Favorito;