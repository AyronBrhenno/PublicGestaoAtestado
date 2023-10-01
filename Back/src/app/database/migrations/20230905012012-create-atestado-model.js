'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('atestado', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      medicoFK: {
        allowNull: false,
        type: Sequelize.STRING,
        references: { model: 'medico', key: 'rg'},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      pacienteFK: {
        allowNull: false,
        type: Sequelize.STRING,
        references: { model: 'paciente', key: 'rg' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      dataConsulta: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      horaInicioConsulta: {
        allowNull: false,
        type: Sequelize.TIME
      },
      horaFimConsulta: {
        allowNull: false,
        type: Sequelize.TIME
      },
      dispensaAlgorismo: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      dispensaExtenso: {
        allowNull: false,
        type: Sequelize.STRING
      },
      cid: {
        allowNull: true,
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
    await queryInterface.dropTable('atestado');
  }
};