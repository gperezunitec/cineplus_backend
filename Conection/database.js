const {Sequelize}=require('sequelize');

const sequelize=new Sequelize(
    'cineplus',
    'root',
    '0000',
    {
        host:'localhost',
        port:3306,
        dialect:'mysql',
    }
)

sequelize.authenticate()
    .then(()=>{console.log('Conexion establecida')})
    .catch(()=>{console.log('error de conexion')})

module.exports = sequelize;