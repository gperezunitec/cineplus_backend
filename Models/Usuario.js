const { DataTypes }=require("sequelize");
const sequelize =require("../Conection/database");

const Usuario = sequelize.define("Usuario", {
    id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    tableName: "usuario",
    timestamps: false,
});
module.exports= Usuario;