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
        await sequelize.authenticate(); //Si la autenticacion es exitosa, se establece la conexion
        console.log('Conexion a MySQL establecida exitosamente.'); 
        return true;
    }  catch (error) {
        console.error('X Error al conectar con MySQL:',
        error.message); //Si hay un error al conectar, se muestra el mensaje de error
        console.error('X Verifica que XAMPP este corriendo y las credenciales en .env sean correctas:'); //Se recomienda verificar que el servidor de MySQL esté activo y que las credenciales en el archivo .env sean correctas
        return false;
        
    }
}

/**Funcion para sincronizar los modelos con la base de datos
*esta funcion creara las tablas automaticamente basandose en los modelos
*/
/*@param {boolean} force - si es true, elimina y recrea todas la tablas
*@param {boolean} alter - si es true, modifica las tablas existentes para que coincidan con los modelos definidos en Sequelize. Si es false, no realiza ningún cambio en las tablas existentes. 
*/
const syncDatabase = async (force = false, alter = false) => {
    try {
        //sincronizar todos los modelos con la base de datos
        await sequelize.sync({ force, alter });

        if (force) {
            console.log('Base de datos sincronizada con (todas las tablas recreadas)');
        } else if (alter) {
            console.log('Base de datos sincronizada (tablas alteradas segun los modelos)');
        } else {
            console.log('Base de datos sincronizada correctamente)');

        }
        return true;
        
    } catch (error) {
        console.error('X Error al sincronizar la base de datos:', error.message);
        return false;
    }

}

//exportar la instancia de sequelize y las funciones
module.exports = {
    sequelize,
    testConnection,
    syncDatabase
};