'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) =>
      queryInterface.createTable('users', {
        id: {
          type: Sequelize.DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_name: {
          type: Sequelize.DataTypes.STRING(120),
          allowNull: false,
        },
        
        createdAt: {
          type: Sequelize.DataTypes.DATE,
        },
        updatedAt: {
          type: Sequelize.DataTypes.DATE,
        },
      }),
  down: (queryInterface) => queryInterface.dropTable('users'),
}