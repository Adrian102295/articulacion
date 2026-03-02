/**
 * Controlador para el carrito de compras
 * gestion de carrito
 * requiere autenticacion
 */

 //importar modelos




const Carrito = require('../models/Carrito')
const Producto = require('../models/Producto')
const Categoria = require('../models/categoria')
const Subcategoria = require('../models/Subcategoria')


/**
 * Obtener el carrito del usuario autenticado
 * Get /api/carrito
 * @param {Object} req request express con req usuario del middleware
 * @param {Object} res response express
 */

const getCarrito = async (req, res) => {
    try{
        //obtener items del carrito con los productos relacionados
        const itemCarrito = await Carrito.findAll({
            where: {usuarioId: req.usuario.id},
            include: [
                {
                    model: Producto,
                    as: 'producto',
                    attributes: ['id', 'nombre', 'descripcion', 'precio', 'stock', 'imagen', 'activo'],
                    include: {
                        model: Categoria,
                        as: 'categoria',
                        attributes: ['id', 'nombre']

                    }
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        //calcular el total del carrito
        let totalCarrito = 0;
        itemsCarrito.forEach(item => {
            totalCarrito += parseFloat(item.producto.precio) * item.cantidad;
        });

        //respuesta exitosa
        res.json({
            success: true,
            data: {
                items: itemsCarrito,
                resumen: {
                    totalItems: itemsCarrito.length,
                    cantidadTotal: itemsCarrito.reduce((sum, item) => sum + item.cantidad, 0),
                    totalCarrito: totalCarrito.toFixed(2)
                }
            }
        });
    } catch (error) {
        console.error('Error en getCarrito:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el carrito',
            error: error.message
        });
    }
};


/**
 * agregar producto al carrito
 * post/api/carrito
 * @param {Object} req request express
 * @param {object} res response express
 */

const agregarAlCarrito = async (req, res) => {
    try {
        const { productoId, cantidad = 1 } = req.body;

        //validacion 1: campos requeridos
        if (!productoId){
            return res.status(400).json({
                success: false,
                message: 'El producto es requerido'
            });
        }

        //Validacion 2: Cantidad valida
        const cantidadNUm = parseInt(cantidad);
        if (cantidadNUm < 1) {
            return res.status(400).json({
                success: false,
                message: 'La cantidad debe ser al menos 1'
            });
        }

        //validacion 3: producto existe y esta activo
        const producto = await Producto.findByPk(productoId);
        if (!producto){
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        if (!producto.activo){
            return res.status(400).json({
                success: false,
                message: 'El producto no esta disponible'
            });
        }

        //validacion 4: verificar si ya existe en el carrito
        let itemExistente = await Carrito.findOne({
            where: {
                usuarioId: req.usuario.id,
                productoId
            }
        });

        if(itemExistente) {
            //actualizar cantidad
            const nuevaCantidad = itemExistente.cantidad + cantidadNUm;

            //validar stock disponible
            if (nuevaCantidad > producto.stock) {
                return res.status(400).json({
                    success: false,
                    message: `No hay suficiente stock. Stock disponible: ${producto.stock}, En carrito: ${itemExistente.cantidad}`
                });
            }

            itemExistente.cantidad = nuevaCantidad;
            await itemExistente.save();

            //Recargar Producto
            await itemExistente.reload({
                include: [{
                    model: Producto,
                    as: 'Producto',
                    attributes: ['id', 'nombre', 'descripcion', 'precio', 'stock', 'imagen']
                }]
            });

        return res.json({
            success: true,
            message: 'Cantidad actualizada en el carrito',
            data: itemExistente
        });
        
    }

    //validacion 5:

    if (cantidadNUm > producto.stock){
        return res.status(400).json({
            success: false,
            message: `stock insuficiente. disponible: ${producto.stock}`
        });
    }

    //crear nuevo item en el carrito
    const nuevoItem = await Carrito.create({
        usuarioId: req.usuario.id,
        productoId,
        cantidad: cantidadNUm,
        precioUnitario: producto.precio
    });

    //Recargar con producto
    await nuevoItem.reload({
        include: [{
            model: Producto,
            as: 'Producto',
            attributes: ['id', 'nombre', 'descripcion', 'precio', 'stock', 'imagen']
        }]
    });

    //respuesta exitosa
    res.status(201).json({
        success: true,
        message: 'Producto agregado al carrito',
        data: { 
            nuevoItem }
    });

    }catch (error) {
        console.error('Error en AgregarAlCarrito:', error);
        res.status(500).json({
            success: false,
            message: 'Error al agregar producto al carrito',
            error: error.message
        });
    } 
};

/** Actualizar cantidad de item del carrito
 * Put /api/carrito/:id
 * Body: { cantidad }
 * @param {Object} req request express
 * @param {object} res response express
 */

const actualizarItemCarrito = async (req, res) =>{
    try {
        const { id } = req.params;
        const { cantidad } = req.body;

        //validar cantidad
        const cantidadNum = parseInt(cantidad);
        if (cantidadNum < 1)  {
            return res.status(400).json({
                success: false,
                message: 'la cantidad debe ser al menos 1'
            });
        }

        // Buscar item del carrito 
        const item = await Carrito.findOne({
            where: {
                id,
                usuarioId: req.usuario.id //solo puede modificar su propio carrito
            
            },

            include: [{
                model: Producto,
                as: 'Producto',
                attributes: ['id', 'nombre', 'descripcion', 'precio', 'stock']
            }]
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item del carrito no encontrado'
            });
        }
        
        //validar stock disponible
        if (cantidadNum > item.Producto.stock) {
            return res.status(400).json({
                success: false,
                message: `Stock insuficiente. Disponible: ${item.Producto.stock}`
            });
        }

        // actualizar cantidad
        item.cantidad = cantidadNum;
        await item.save();

        //Respuesta exitosa
        res.json({
            success: true,
            message: 'Cantidad actualizada',
            data: {
                item
            }
        });
    }catch (error) {
        console.error('Error en actualizar ItemCarrito:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar item del carrito',
            error: error.message
        });
    }
};

/**
 * Eliminar item del carrito
 * Delete /api/carrito/:id
 */

const eliminarItemCarrito = async (req, res) => {
    try {
        const { id } = req.params;

        //Buscar item 
        const item =  await Carrito.FindOne({
            where: {
                id,
                usuarioId: req.usuario.id
            }
        });

        if (!item) {
            return res.status(400).json({
                success: false,
                message: 'Item no encontrado en el carrito'
            });
        }

        //Eliminar item
        await item.destroy();

        //Respuesta exitosa
        res.json({
            success: true,
            message: 'Item eliminado del carrito'
        });
    }catch (error) {
        console.error('Error en eliminarItemCarrito:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar item del carrito',
            error: error.message
        });
    }
};


/**
 * Vaciar todo el carrito
 * DELETE /api/carrito/vaciar
 * 
 */

const vaciarCarrito = async (req,res) => {
    try {
        //Eliminar todos los items del usuario
        const itemsEliminados = await Carrito.destroy({
            where: {
                usuarioId: req.usuario.id}
        });

        res.json({
            success: true,
            message: `Carrito vaciado`,
            data: {
                itemsEliminados
            }
        });
    }catch (error) {
        console.error('Error en vaciarCarrito:', error);
        res.status(500).json({
            success: false,
            message: 'Error al vaciar el carrito',
            error: error.message
        });
    }
};


//Exportar controladores

module.exports = {
    getCarrito,
    agregarAlCarrito,
    actualizarItemCarrito,
    eliminarItemCarrito,
    vaciarCarrito
}

