/**
 * Asociación entre modelos
 * este archivo define todas las relaciones entre los modelos de sequelize
 * debe ejecutarse después de importar todos los modelos
 */


//importar todos los modelos

const Usuario = require('./Usuario');
const Categoria = require('./categoria');
const Subcategoria = require('./Subcategoria');
const Producto = require('./Producto');
const Carrito = require('./Carrito');
const Pedido = require('./Pedido');
const DetallePedido = require('./DetallePedido');


/**
 * Definir asociaciones entre modelos
 * Tipos de relaciones sequelize:
 * hasOne: 1 a 1
 * belongsTo: 1 a 1
 * hasMany: 1 a muchos  1-N
 * belongsToMany: muchos a muchos  N-N
 */

 /**
  * Categoria - Subcategoria
  * Una categoria tiene muchas subcategorias
  * Una subcategoria pertenece a una categoria
  */

 Categoria.hasMany(Subcategoria, { foreignKey: 'categoriaId', // Campo que conecta las tablas
    as: 'subcategorias', // Alias para la relacion
    onDelete: 'CASCADE', // Si se borra una categoria, se borran sus subcategorias
    onUpdate: 'CASCADE' // Si se actualiza una categoria, se actualiza en sus subcategorias
});

Subcategoria.belongsTo(Categoria, { foreignKey: 'categoriaId', // Campo que conecta las tablas
    as: 'categoria', // Alias para la relacion
    onDelete: 'CASCADE', // Si se borra una subcategoria, se borra su categoria
    onUpdate: 'CASCADE' // Si se actualiza una subcategoria, se actualiza en su categoria
});


/**
  * Categoria - Producto
  * Una categoria tiene muchos productos
  * un producto pertenece a una categoria
  */

 Categoria.hasMany(Producto, { foreignKey: 'categoriaId', // Campo que conecta las tablas
    as: 'productos', // Alias para la relacion
    onDelete: 'CASCADE', // Si se borra una categoria, se borran sus productos
    onUpdate: 'CASCADE' // Si se actualiza una categoria, se actualiza en sus productos
});

Producto.belongsTo(Categoria, { foreignKey: 'categoriaId', // Campo que conecta las tablas
    as: 'categoria', // Alias para la relacion
    onDelete: 'CASCADE', // Si se borra un producto, se borra su categoria
    onUpdate: 'CASCADE' // Si se actualiza un producto, se actualiza en su categoria
});


/**
  * Subcategoria - Producto
  * Una subcategoria tiene muchos productos
  * Un producto pertenece a una subcategoria
  */

 Subcategoria.hasMany(Producto, { foreignKey: 'subcategoriaId', // Campo que conecta las tablas
    as: 'productos', // Alias para la relacion
    onDelete: 'CASCADE', // Si se borra una subcategoria, se borran sus productos
    onUpdate: 'CASCADE' // Si se actualiza una subcategoria, se actualiza en sus productos
});

Producto.belongsTo(Subcategoria, { foreignKey: 'subcategoriaId', // Campo que conecta las tablas
    as: 'subcategoria', // Alias para la relacion
    onDelete: 'CASCADE', // Si se borra un producto, se borra su subcategoria
    onUpdate: 'CASCADE' // Si se actualiza un producto, se actualiza en su subcategoria
});


/**
  * Usuario - Carrito
  * Un usuario tiene un carrito
  * Un carrito pertenece a un usuario
  */

 Usuario.hasOne(Carrito, { foreignKey: 'usuarioId', // Campo que conecta las tablas
    as: 'carrito', // Alias para la relacion
    onDelete: 'CASCADE', // Si se borra un usuario, se borra su carrito
    onUpdate: 'CASCADE' // Si se actualiza un usuario, se actualiza en su carrito
});

Carrito.belongsTo(Usuario, { foreignKey: 'usuarioId', // Campo que conecta las tablas
    as: 'usuario', // Alias para la relacion
    onDelete: 'CASCADE', // Si se borra un carrito, se borra su usuario
    onUpdate: 'CASCADE' // Si se actualiza un carrito, se actualiza en su usuario
});


/**
  * Producto - Carrito
  * Un producto puede estar en muchos carritos
  * Un carrito puede tener muchos productos
  * Relacion muchos a muchos a traves de una tabla intermedia CarritoProducto
  */

 Producto.hasMany(Carrito, { foreignKey: 'productoId', // Campo que conecta las tablas
    as: 'carritos', // Alias para la relacion
    onDelete: 'CASCADE', // Si se borra un producto, se borran sus carritos
    onUpdate: 'CASCADE' // Si se actualiza un producto, se actualiza en sus carritos
});

Carrito.belongsTo(Producto, { foreignKey: 'productoId', // Campo que conecta las tablas
    as: 'producto', // Alias para la relacion
    onDelete: 'CASCADE', // Si se borra un carrito, se borra su producto
    onUpdate: 'CASCADE' // Si se actualiza un carrito, se actualiza en su producto
});



/**
  * Usuario - Pedido
  * Un usuario tiene muchos pedidos
  * Un pedido pertenece a un usuario
  */

 Usuario.hasMany(Pedido, { foreignKey: 'usuarioId', // Campo que conecta las tablas
    as: 'pedidos', // Alias para la relacion
    onDelete: 'RESTRICT', // Si se borra un usuario, se borran sus pedidos
    onUpdate: 'CASCADE' // Si se actualiza un usuario, se actualiza en sus pedidos
});

Pedido.belongsTo(Usuario, { foreignKey: 'usuarioId', // Campo que conecta las tablas
    as: 'usuario', // Alias para la relacion
    onDelete: 'RESTRICT', // Si se borra un pedido, se borra su usuario
    onUpdate: 'CASCADE' // Si se actualiza un pedido, se actualiza en su usuario
});



/**
  * Pedido - DetallePedido
  * Un pedido tiene muchos detalles de pedido
  * Un detalle de pedido pertenece a un pedido
  */

 Pedido.hasMany(DetallePedido, { foreignKey: 'pedidoId', // Campo que conecta las tablas
    as: 'detalles', // Alias para la relacion
    onDelete: 'CASCADE', // Si se borra un pedido, se borran sus detalles
    onUpdate: 'CASCADE' // Si se actualiza un pedido, se actualiza en sus detalles
});

DetallePedido.belongsTo(Pedido, { foreignKey: 'pedidoId', // Campo que conecta las tablas
    as: 'pedido', // Alias para la relacion
    onDelete: 'CASCADE', // Si se borra un detalle de pedido, se borra su pedido
    onUpdate: 'CASCADE' // Si se actualiza un detalle de pedido, se actualiza en su pedido
});

/**
  * Producto - DetallePedido
  * Un producto puede estar en muchos detalles de pedido
  * Un detalle de pedido pertenece a un producto
  */
  

 Producto.hasMany(DetallePedido, { foreignKey: 'productoId', // Campo que conecta las tablas
    as: 'detalles', // Alias para la relacion
    onDelete: 'RESTRICT', // Si se borra un producto, se borran sus detalles
    onUpdate: 'CASCADE' // Si se actualiza un producto, se actualiza en sus detalles
});

DetallePedido.belongsTo(Producto, { foreignKey: 'productoId',
    as: 'producto',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});



/**
 * Relacion muchos a muchos atravez de detalle pedido
 */


Pedido.belongsToMany(Producto, { through: 'DetallePedido', // Campo que conecta las tablas
    foreignKey: 'pedidoId', // Campo que conecta las tablas
    otherKey: 'productoId', // Campo que conecta las tablas
    as: 'productos', // Alias para la relacion
   
});

Producto.belongsToMany(Pedido, { through: 'DetallePedido', // Campo que conecta las tablas
    foreignKey: 'productoId', // Campo que conecta las tablas
    otherKey: 'pedidoId', // Campo que conecta las tablas
    as: 'pedidos', // Alias para la relacion
   
});


/**
 * Exportar funcion de inicializacion
 * funcion para inicializar las asociaciones entre modelos
 * se llama desde server.js despues de importar todos los modelos
 */


const initAssociations = () => {
    console.log('Asociaciones entre modelos inicializadas');
};


//exportar los modelos

module.exports = {
    Usuario,
    Categoria,
    Subcategoria,
    Producto,
    Carrito,
    Pedido,
    DetallePedido,
    initAssociations
};  