'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) =>
      queryInterface.createTable('orders', {
        id: {
          type: Sequelize.DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        total_price: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
        },
        description: {
          type: Sequelize.DataTypes.STRING(500),
          allowNull: true,
        },
        price: {
          type: Sequelize.DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        stock: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DataTypes.DATE,
        },
        updatedAt: {
          type: Sequelize.DataTypes.DATE,
        },
      }),
  down: (queryInterface) => queryInterface.dropTable('orders'),
}