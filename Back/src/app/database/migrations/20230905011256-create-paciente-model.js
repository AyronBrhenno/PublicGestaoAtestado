'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('paciente', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      rg: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      nome: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dataNascimento: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      genero: {
        allowNull: false,
        type: Sequelize.STRING
      },
      InativeAt: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('paciente');
  }
};