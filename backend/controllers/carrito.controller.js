/**
 * Controlador para el carrito de compras
 * gestion de carrito
 * requiere autenticacion
 */


//importar modelos

const Carrito = require('../models/Carrito')
const Carrito = require('../models/Producto')
const Carrito = require('../models/categoria')
const Carrito = require('../models/Subcategoria')


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
                    cantidadTotal: itemsCarrito.reduce((sum, item) => sum + item.cantidad, 0)
                }
            }
        })
    }
}