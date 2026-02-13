/**
 * MODELO CARRITO
 * define la tabla carrito en la base de datos
 * Almacena los productos que cada usuario ha agregado a su carrito
 */


//Importar Datatypes de sequelize
const { DataTypes } = require('sequelize');


//importar instancia de sequelize
const { sequelize } = require('../config/database');


/**
 * Definir el modelo de Carrito
 */
const Carrito = sequelize.define('Carrito', {
    // campos de la tabla
    // id identificador unico (PRIMARY KEY)
    id: {
        type: DataTypes.INTEGER, // tipo entero
        primaryKey: true, // clave primaria
        autoIncrement: true, // se incrementa automaticamente
        allowNull: false // no puede ser nulo
    },


    // Ususario ID del usuario dueño del carrito
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuarios',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // si elimina el usuario se elimina su carrito
        validate: {
            notNull: {
                msg: 'Debe especificar un usuario'
            }
        }
    },
    
    nombre: {
        type: DataTypes.STRING(100), // tipo cadena de texto
        allowNull: false, // no puede ser nulo
        unique:{
            msg: 'Ya existe una categoria con ese nombre'
        },
        validate: {
            notEmpty: {
                msg: 'El nombre de la categoria no puede estar vacio'
            },
            len: {
                args: [2, 100],
                msg: 'El nombre de la categoria debe tener entre 2 y 100 caracteres'
            }
        }
    },

    /**
     *descripcion de la categoria
     */

     descripcion: {
        type: DataTypes.TEXT,
        allowNull: true, // puede ser nulo
     },

     // Producto ID del Producto en el carrito carrito
    productoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Productos',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', //elimina el producto  del carrito
        validate: {
            notNull: {
                msg: 'Debe especificar un producto'
            }
        }
    },

    // Cantidad de este producto en el carrito
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            isInt: {
                msg: 'La cantidad debe ser un numero entero'
            },
            min:{
                args: [1],
                msg: 'La cantidad debe ser al menos 1'
            }
        }
    },


    /**
     * Precio Unitariop del producto al momento de agregarlo al carrito
     * Se guarda para mantener el precio aunque el producto cambie de precio
     */

    precioUnitario: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        validate:{
            isDecimal:{
                msg: 'El precio debe ser un  numero decimal valido'
            },
            min:{
                args: [0],
                msg: 'El precio no puede ser negativo'
            }
        }
    }
}, {
    //opciones del modelo

    tableName: 'carritos',
    timestamps: true,
    //indices para mejorar las busquedas
    indexes:[
        {
            //indice para buscar por usuario
            fields: ['usuarioId']
        },
        {

        //Indice compuesto : un usuario no puede teber el mismo producto mas de una vez
        unique: true,
        fields: ['usuarioId', 'productoId'],
        name: 'usuario_producto_unique'
        }

    ],

     /**
     * hooks acciones automaticas
     */
    hooks: {
        /**
         * beforeCreate - se ejecuta antes de crear una subcategoria
         * verifica que la categoria padre este activa
         */
        beforeCreate: async (subcategoria, options) => {
            const categoria = require('./categoria');

            //buscar categoria padre
            const categoria = await categoria.findByPk(subcategoria.categoriaId);
            if (!categoria) {
                throw new Error('la categoria seleccionada no existe');
            }

            if (!categoria.activo) {
                throw new Error('no se puede crear una subcategoria en una categoria inactiva');
            }
        },

        /**
         * afterUpdate - se ejecuta despues de actualizar una categoria
         * si se desactiva una subcategoria se desactivan todos todos sus productos
         */
        afterUpdate: async (subcategoria, options) => {
            //verificar si el campo activo se cambio
            if (subcategoria.changed('activo') && !subcategoria.activo) {
                console.log(`desactivando categoria: ${subcategoria.nombre}`);

                //importar modelos (aqui para evitar dependencias circulares
                const producto = require('./Producto');

                try {
                    //paso 1 : desactivar los productos de esta subcategoria
                    const productos = await productos.findAll({
                        where: { subcategoriaId: subcategoria.id }
                    });

                    for (const producto of productos) {
                        await producto.update({ activo: false }, { transaction: options.transaction });
                        console.log(`producto desactivado: ${producto.nombre}`);
                    }
                    console.log(`subcategoria y productos relacionados desactivados correctamente`);
                } catch (error) {
                    console.error(`error al desactivar productos relacionados:`, error.message);
                    throw error;
                }
            }

            //si se activa una categoria, no se activan automaticamente las subcategorias y productos
        }
    }
});

//metodo de instancia
/**
 * metodo para contar productos de esta subcategoria
 *
 * @return {Promise<number>} numero de productos
 */
subcategoria.prototype.contarproductos = async function () {
    const producto = require('./Producto');
    return await producto.count({ where: { subcategoriaId: this.id } });
};
