const { DataTypes }=require("sequelize");
const sequelize =require("../Conection/database");

const Pelicula = sequelize.define("Pelicula", {
    id_pelicula: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    titulo: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    categoria: {
        type: DataTypes.STRING(50),
    },
    duracion: {
        type: DataTypes.INTEGER,
    },
    sinopsis: {
        type: DataTypes.TEXT,
    },
    imagen: {
        type: DataTypes.STRING(255),
    },
}, {
    tableName: "pelicula",
    timestamps: false,
});

module.exports= Pelicula;