/**
 * Controlador de pedidos
 * gestion de pedidos
 * requiere autenticacion
 */

//importar modelos

const Pedido = require('../models/Pedido');
const DetallePedido = require('../models/DetallePedido');
const Carrito = require('../models/Carrito');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');
const Categoria = require('../models/categoria');
const Subcategoria = require('../models/Subcategoria');

/**
 * Crear pedido desde el carrito (Checkout)
 * POST /api/cliente/pedidos
 */

const crearPedido = async (req, res) => {
        const { sequelize } = require('../config/database');
        const t = await sequelize.transaction();
    
        try {
            const { direccionEnvio, telefono, metodoPago = 'Efectivo', notasAdicionales } = req.body;
        

        //validacion 1 direccion de envio 
        
        if (!direccionEnvio || direccionEnvio.trim() === '') {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'La direccion de envio es requerida'
            });

        }

        //validacion 2 telefono

        if (!telefono || telefono.trim() === '') {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'El telefono es requerido'
            });
        }

        //validacion 3 metodo de pago

        const metodosVaslidos = ['Efectivo', 'Tarjeta', 'Transferencia'];
        if (!metodosVaslidos.includes(metodoPago)) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: `Metodo de pago invalido opciones: ${metodosVaslidos.join(', ')}`
            });
        }

        //obtener items del carrito

        const carritoItems = await Carrito.findAll({
            where: {usuarioId: req.usuario.id },
            include: [{
                model: Producto,
                as: 'producto',
                attributes: ['id', 'nombre', 'precio', 'stock', 'activo']
            }],

            transaction: t 

        });

        if (itemsCarrito.lenght === 0) {
            await t.rollback();
            return res.status(400).json({
                success:false,
                message: 'El carrito esta vacio'
            });
        }


    }
}