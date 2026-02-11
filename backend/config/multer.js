/**
 * configuracion de subida de archivos
 *
 * multer es un midelware para manejar la subida de archivos
 *
 * Este archivo configura como y donde se guardan las imagenes
 */

// Importar multer para manejar archivos
const multer = require('multer');

// Importar path para trabajar con rutas de archivos
const path = require('path');

// Importar fs para verificar / crear directorios
const fs = require('fs');

// Importar detenv para variables de entorno
require('dotenv').config();

// Obtener la ruta de donde se guardan los archivos
const uploadPath = process.env.UPLOAD_PATH || './uploads';

// Verificar si la carpeta uploads existe, si no crearla
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log(`Carpeta ${uploadPath} creada`);
}

/**
 * Configuracion de almacenamiento de multer
 * Define donde y como se guardan los archivos
 */

const storage = multer.diskStorage({
    /**
     * Destinacion: define la carpeta destino donde se guarda el archivo
     *
     * @param {object} req - Objeto de peticion HTTP
     * @param {object} file - Archivos que esta subiendo
     * @param {function} cb - Callback que se llama con (error, destination)
     */
    destination: function (req, file, cb) {
        //cb(null, ruta) -> sin error, ruta = carpeta destino
        cb(null, uploadPath);
    },

    /**
     * filename: Define el nombre con el que se guarda el archivo
     * formato: timestamp-nombreoriginal.ext
     *
     * @param {object} req - Objeto de peticion HTTP
     * @param {object} file - Archivo que se esta subiendo
     * @param {function} cb - Callback que se llama con (error, filename)
     */
    filename: function (req, file, cb) {
        //Gnerar nombre unico usando timestamp + nombre original
        //Date.now() genera un timestamp unico
        //path.extname()  extrae la extension del archivo (.jpg, .png, tec)
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

/**
 * Filtro para validar el tipo de archivo
 * solo permite imagenes (jpg, jpeg, png, gif)
 *
 * @param {object} req - Objeto de peticion HTTP
 * @param {object} file - Archivo que se esta subiendo
 * @param {function} cb - Callback que se llama con (error, acceptFile)
 */
const fileFilter = function (req, file, cb) {

    //Tipos mime permitidos para las imagenes
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    //verificar si el tipo de archivo esta en la lista permitida
    if (allowedTypes.includes(file.mimetype)) {
        //cb(null, true) -> aceptar el archivo
        cb(null, true);
    }else {
        //cb(error) -> rechazar archivo
        cb(new Error('Solo se permiten imagenes (jpg, jpeg, png, gif)'), false);
    }

};

/**
 * configurar multer con las opciones definidas
 */

const upload = multer({
    strorage: storage,
    fileFilter: fileFilter,
    limits: {
        //Limite del tamaño del archivo en bytes
        //por defecto 5mb (5*1024) 52428800 bytes
        fileSize: paseInt(process.env.MAX_FILE_SIZE) || 52428800
        
    }
});

/**
 * funcion para eliminar el archivo del servidor
 * util cuando se actualiza o elimina el producto
 * @param {string} filename - nombre del archivo a eliminar
 * @returns {boolean} - true si se elimino correctamente, false si hubo un error
 */

const deletefile = (filename) => {
    try{
        //construir la ruta completa del archivo
        const filePath = path.join(uploadPath, filename);

        //verificar si el archivo existe
        if (fs.existsSync(filePath)) {
            //eliminar el archivo
            fs.unlinkSync(filepath);
            console.log('archivo eliminado: ${filename}');
            return true;
        }else {
            console.log('archivo no encontrado: ${filename}');
            return false;
        }
    }catch (error) {
        console.error('error al eliminar el archivo;', error.message);
        return false;
    }
}

//Exportar configuracion de multer y la funcion de eliminacion

module.exports = {
    upload,
    deletefile
};



