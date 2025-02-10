'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders_details', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'orders',
          key: 'id',
        },
        allowNull: false, 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      menuId: {
        type: Sequelize.INTEGER,
        references: {
          model:'menu',
          key: 'id',
        },
        allowNull: false, 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      quantity: { 
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders_details');
  },
};