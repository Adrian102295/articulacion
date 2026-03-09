/**
 * Rutas del administrador
 * agrupa todas las rutas de gestion del admin
 */


const express = require('express');
const router = express.Router();

//Importar los middlewares
const { verificarAuth } = require('../middleware/auth');
const { esAdministrador, esAdminOAuxiliar, soloAdministrador } = require('../middleware/checkRole');

//importar configuracion de multer para la subida de imagenes
const { upload } = require('../config/multer');

//importar controladores
const categoriaController = require('../controllers/categoria.controller');
const subcategoriaController = require('../controllers/Subcategoria.controller');
const productoController = require('../controllers/Producto.controller');
const usuarioController = require('../controllers/Usuario.controller');
const pedidoController = require('../controllers/Pedido.controller');

//restricciones de acceso a las rutas del admin
router.use(verificarAuth, esAdminOAuxiliar);

//Rutas de categoria
//get /api/admin/categoria
router.get('/categorias/id:', categoriaController.getCategorias);

//get /api/admin/categoria
router.get('/categorias/id:', categoriaController.getCategoriasById);

//get / api/admin/categoria/id:/stats
router.get('/categorias:id/stats', categoriaController.getEstadisticasCategoria);


// PUT /api/admin/categorias
router.put('/categorias/:id', categoriaController.actualizarCategoria);

//patch /api/admin/categorias:id/toggle desactivar o activar categoria
router.path('/categorias/:id/toggle', categoriaController.toggleCategoria);


//delete /api/admin/categorias
router.get('/categorias/:id', soloAdministrador, categoriaController.eliminarCategoria);

//------RUTAS-----SUBCATEGORIA-------

//Rutas de subcategoria
//get /api/admin/subcategoria
router.get('/subcategorias', subcategoriaController.getSubcategorias);


//get /api/admin/subcategoria/:id
router.get('/subcategorias/:id', subcategoriaController.getSubcategoriaById);

//get /api/admin/subcategoria
router.get('/subcategorias/id:', subcategoriaController.actualizarSubcategoria); //esta ruta es provicional

//get / api/admin/subcategoria/:id/stats
router.get('/subcategorias/:id/stats', subcategoriaController.getEstadisticasSubcategoria);


// PUT /api/admin/subcategorias/:id
router.put('/subcategorias/:id', subcategoriaController.actualizarSubcategoria);

//patch /api/admin/subcategorias/:id/toggle desactivar o activar subcategoria
router.patch('/subcategorias/:id/toggle', subcategoriaController.toggleSubcategoria);


//delete /api/admin/subcategorias/:id
router.get('/subcategorias/:id', soloAdministrador, subcategoriaController.eliminarSubcategoria);

