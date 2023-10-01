'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class medico extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     * */
    static associate(models) {
        this.hasMany(models.atestado, { foreignKey: 'medicoFK', as: 'medico' });
    }
  }
  medico.init({
    id: {
      type: DataTypes.INTEGER
    },
    rg: {type: DataTypes.STRING, primaryKey: true},
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    genero: DataTypes.STRING,
    senha: DataTypes.STRING,
    endereco: DataTypes.STRING,
    dataNascimento: DataTypes.DATEONLY,
    crm: DataTypes.STRING,
    InativeAt: DataTypes.DATE
  }, {
    tableName: 'medico',
    sequelize,
    modelName: 'medico',
    paranoid: true,
    deletedAt: 'InativeAt'
  });

  return medico;
};

/*
'use strict';

module.exports = (sequelize, DataTypes) => {
  const medicoModel = sequelize.define('medicoModel', {
    rg: DataTypes.STRING,
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    genero: DataTypes.STRING,
    senha: DataTypes.STRING,
    endereco: DataTypes.STRING,
    dataNascimento: DataTypes.DATEONLY,
    crm: DataTypes.STRING,
    InativeAt: DataTypes.DATE
  }, {
    tableName: 'medico',
    paranoid: true,
    deletedAt: 'InativeAt'
  });

  medicoModel.associate = (models) => {
    medicoModel.hasMany(models.atestadoModel, { foreignKey: 'medicoFK' });
  };

  return medicoModel;
};
*/