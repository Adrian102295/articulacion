/*CNFIGURACION DE LA BASE DE DATOS*/


//Importamos Sequelize
const { Sequelize } = require('sequelize');

//Importar dotenv para variables de entorno
require('dotenv').config();

//Crear instancia de Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql' ,

    //Configuracion de pool de conexiones
    //Mantiene las conexiones abiertas para mejorar el rendimiento
    pool: {
        max: 5, //Numero maximo de conexiones en el pool
        min: 0, //Numero minimo de conexiones en el pool
        acquire: 30000, //Tiempo maximo para adquirir una conexion antes de lanzar un error
        idle: 10000 //Tiempo maximo que una conexion puede estar inactiva antes de ser liberada
    },

    // Configuracion de logging
    // Permite ver las consultas de mysql por consola
    logging: process.env.NODE_ENV === 'development' ? console.log : false,



    //Zone horaria
    timezone: '-05:00',  //Zona horaria de Colombia


    //Opciones adicionales pueden ser agregadas aqui
    define: {
        timestamps: true, //Agrega campos createdAt y updatedAt a todas las tablas
        underscored: false, //Usa snake_case para los nombres de columnas en lugar de camelCase

    //frazeTableName: true usa el nombre del modelo como nombre de la tabla sin pluralizarlo
        freezeTableName: true
    }

});


/* Funcion para probar la conexion a la base de datos esta funcion se llamara al iniciar el servidor */

const testConnection = async () => {
    try {
        //intentar autenticar con la base de datos
        await sequelize.authenticate();
        console.log('Conexion a MySQL establecida exitosamente.');
        return true;
    }  catch (error) {
        console.error('X Error al conectar con MySQL:',
        error.message);
        console.error('X Verifica que XAMPP este corriendo y las credenciales en .env sean correctas:');
        return false;
        
    }
}