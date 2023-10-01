'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class paciente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     * */
    static associate(models) {
      this.hasMany(models.atesatdo, { foreignKey: 'pacienteFK' });
    }
  }
  paciente.init({
    id: {
      type: DataTypes.INTEGER
    },
    rg: {type: DataTypes.STRING, primaryKey: true},
    nome: DataTypes.STRING,
    dataNascimento: DataTypes.DATEONLY,
    genero: DataTypes.STRING,
    InativeAt: DataTypes.DATE

  }, {
    tableName: 'paciente',
    sequelize,
    modelName: 'paciente',
    paranoid: true,
    deletedAt: 'InativeAt'
  });
  return paciente;
};
/*
'use strict';

module.exports = (sequelize, DataTypes) => {
  const pacienteModel = sequelize.define('pacienteModel', {
    rg: DataTypes.STRING,
    nome: DataTypes.STRING,
    dataNascimento: DataTypes.DATEONLY,
    genero: DataTypes.STRING,
    InativeAt: DataTypes.DATE
  }, {
    tableName: 'paciente',
    paranoid: true,
    deletedAt: 'InativeAt'
  });

  pacienteModel.associate = (models) => {
    pacienteModel.hasMany(models.atestadoModel, { foreignKey: 'pacienteFK' });
  };

  return pacienteModel;
};
*/