'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class gestorModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     * */
    static associate(models) {
      // define association here
    }
  }
  gestorModel.init({
    rg: DataTypes.STRING,
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    genero: DataTypes.STRING,
    senha: DataTypes.STRING,
    InativeAt: DataTypes.DATE
  }, {
    tableName: 'gestor',
    sequelize,
    modelName: 'gestorModel',
    paranoid: true,
    deletedAt: 'InativeAt'
  });
  return gestorModel;
};
/*
'use strict';

module.exports = (sequelize, DataTypes) => {
  const gestorModel = sequelize.define('gestorModel', {
    rg: DataTypes.STRING,
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    genero: DataTypes.STRING,
    senha: DataTypes.STRING,
    InativeAt: DataTypes.DATE
  }, {
    tableName: 'gestor',
    paranoid: true,
    deletedAt: 'InativeAt'
  });

  // Não há associações definidas aqui, você pode adicioná-las conforme necessário.

  return gestorModel;
};
*/