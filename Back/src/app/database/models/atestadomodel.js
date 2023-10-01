'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class atestado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.medico, { foreignKey: 'medicoFK', as: "medico" });
        this.belongsTo(models.paciente, { foreignKey: 'pacienteFK' });
    }
  }
  atestado.init({
    medicoFK: DataTypes.STRING,
    pacienteFK: DataTypes.STRING,
    dataConsulta: DataTypes.DATEONLY,
    horaInicioConsulta: DataTypes.TIME,
    horaFimConsulta: DataTypes.TIME,
    dispensaAlgorismo: DataTypes.INTEGER,
    dispensaExtenso: DataTypes.STRING,
    cid: DataTypes.STRING,
    InativeAt: DataTypes.DATE
  }, {
    tableName: 'atestado',
    sequelize,
    modelName: 'atestado',
    paranoid: true,
    deletedAt: 'InativeAt'
  });
  return atestado;
};


/*'use strict';
const config = require('../config/config');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DEV_DATABASE_URL, {
    dialect: 'postgres' // Adicione esta linha para especificar o dialeto
});
const medicoModel = require("./medicomodel")(sequelize, DataTypes);
const pacienteModel = require('./pacientemodel')(sequelize, DataTypes);

module.exports = (sequelize, DataTypes) => {
  const atestadoModel = sequelize.define('medico', {
    medicoFK: {
      type: DataTypes.STRING,
      references:{
      model: medicoModel,
      key: 'rg'
    }
    },
    pacienteFK: {
      type: DataTypes.STRING,
      references:{
      model: pacienteModel,
      key: 'rg'
    }
    },
    dataConsulta: DataTypes.DATEONLY,
    horaInicioConsulta: DataTypes.TIME,
    horaFimConsulta: DataTypes.TIME,
    dispensaAlgorismo: DataTypes.INTEGER,
    dispensaExtenso: DataTypes.STRING,
    cid: DataTypes.STRING,
    InativeAt: DataTypes.DATE
  }, {
    tableName: 'atestado',
    paranoid: true,
    deletedAt: 'InativeAt'
  });

  atestadoModel.associate = (models) => {
    atestadoModel.belongsTo(models.medicoModel, { foreignKey: 'medicoFK' });
    atestadoModel.belongsTo(models.pacienteModel, { foreignKey: 'pacienteFK' });
  };

  return atestadoModel;
}; */