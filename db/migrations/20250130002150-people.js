'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) =>
      queryInterface.createTable('people', {
        id: {
          type: Sequelize.DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.DataTypes.STRING(120),
          allowNull: false,
        },
        last_name: {
          type: Sequelize.DataTypes.STRING(500),
          allowNull: true,
        },
        birthdate: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
        },
        cellphone_number: {
          type: Sequelize.DataTypes.STRING(20),
          allowNull: false,
          unique: true,
          validate: {
            isNumeric: true,
            len: [10, 15],
          }
        },
        userId: { 
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false, 
          references: {
            model: 'users', 
            key: 'id', 
          },
          onUpdate: 'CASCADE', 
          onDelete: 'CASCADE', 
        },
        delivery_men: {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
        },
        is_free: {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
        },
        createdAt: {
          type: Sequelize.DataTypes.DATE,
        },
        updatedAt: {
          type: Sequelize.DataTypes.DATE,
        },
      }),
  down: (queryInterface) => queryInterface.dropTable('people'),
}