'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('menu', [
      {
        product_name: 'Taco de Suadero 12K',
        description: 'Vape con sabor a taco de suadero, con notas de pepino y su olor chistoso. Vape de 12K pufs.',
        price: 450.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_name: 'Gordita de Chicharron Prensado 12K',
        description: 'Vape con sabor a gordita de harina de chicharron prensado hecha por la doña Cuca la de la esquina. Vape de 12K pufs.',
        price: 450.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_name: 'Chettos Flaming Hot 6K',
        description: 'Vape con sabor a chettos flamin hot de una dulceria tipica de México. Vape de 6K pufs.',
        price: 320.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_name: 'Pozole 2K',
        description: 'Vape con sabor a pozole, con un toque de maíz y especias. Vape de 2K pufs.',
        price: 220.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_name: 'Tamal 2K',
        description: 'Vape con sabor a tamal, con notas de masa y salsa verde. Vape de 2K pufs.',
        price: 220.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_name: 'Ceviche 12K',
        description: 'Vape con sabor a ceviche, con un toque cítrico y marino. Vape de 12K pufs.',
        price: 450.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_name: 'Churro 2K',
        description: 'Vape con sabor a churro, con notas de canela y azúcar. Vape de 2K pufs.',
        price: 220.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_name: 'Horchata 2K',
        description: 'Vape con sabor a horchata, con un toque de arroz y canela. Vape de 2K pufs.',
        price: 220.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_name: 'Flan 2K',
        description: 'Vape con sabor a flan, con notas de caramelo y vainilla. Vape de 2K pufs.',
        price: 220.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_name: 'Guacamole 2K',
        description: 'Vape con sabor a guacamole, con un toque de aguacate y limón. Vape de 2K pufs.',
        price: 220.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_name: 'Elote 2K',
        description: 'Vape con sabor a elote, con notas de maíz, mayonesa y queso. Vape de 2K pufs.',
        price: 220.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_name: 'Cochinita Pibil 6K',
        description: 'Vape con sabor a cochinita pibil, con un toque de achiote y naranja. Vape de 6K pufs.',
        price: 320.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_name: 'Barbacoa 12K',
        description: 'Vape con sabor a barbacoa, con notas de carne y especias. Vape de 12K pufs.',
        price: 450.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_name: 'Sopa de Tortilla 2K',
        description: 'Vape con sabor a sopa de tortilla, con un toque de tomate y chile. Vape de 2K pufs.',
        price: 220.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_name: 'Agua de Jamaica 2K',
        description: 'Vape con sabor a agua de jamaica, con notas florales y cítricas. Vape de 2K pufs.',
        price: 220.00,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Menu', null, {});
  }
};