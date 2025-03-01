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
        email: {
          type: Sequelize.DataTypes.STRING(75),
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          }
        },
        password: {
          type: Sequelize.DataTypes.STRING(100),
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DataTypes.DATE,
        },
        updatedAt: {
          type: Sequelize.DataTypes.DATE,
        },
        authToken: {
          type: Sequelize.DataTypes.STRING(500), 
          allowNull: true, 
        },
      }),
  down: (queryInterface) => queryInterface.dropTable('users'),
}