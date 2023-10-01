const config = require('../database/config/config');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DEV_DATABASE_URL, {
    dialect: 'postgres' // Adicione esta linha para especificar o dialeto
});
const atestadoModel = require('../database/models/atestadomodel')(sequelize, DataTypes);
const pacienteModel = require('../database/models/pacientemodel')(sequelize, DataTypes);
const medicoModel = require('../database/models/medicomodel')(sequelize, DataTypes);
class AtestadoController {
    async store(req, res) {
        try {
            const { medicoFK, pacienteFK, dataConsulta, horaInicioConsulta, horaFimConsulta, dispensaAlgorismo, dispensaExtenso, cid } = req.body;
            const novoAtestado = await atestadoModel.create({
                medicoFK: medicoFK,
                pacienteFK: pacienteFK,
                dataConsulta: dataConsulta,
                horaInicioConsulta: horaInicioConsulta,
                horaFimConsulta: horaFimConsulta,
                dispensaAlgorismo: dispensaAlgorismo,
                dispensaExtenso: dispensaExtenso,
                cid: cid
            });
            res.status(201).json({ mensagem: 'Atestado cadastrado com sucesso!', nome: novoAtestado });
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao cadastrar o atestado.' });
        }
    }

    async show(req, res) {
        try {
            const atestadoData = await atestadoModel.findAll();
            // Use um loop ou mapeamento para buscar dados associados
            const atestadoAss = await Promise.all(
                atestadoData.map(async (atestadoModel) => {
                    const medico = require('../database/models/medicomodel')(sequelize, DataTypes);
                    const paciente = require('../database/models/pacientemodel')(sequelize, DataTypes);
                    const medicodata = await medico.findByPk(atestadoModel.medicoFK, { paranoid: false });
                    const pacientedata = await paciente.findByPk(atestadoModel.pacienteFK, { paranoid: false });

                    // Combine os dados associados com o objeto PatrimonioSala
                    return {
                        atestado: atestadoModel,
                        medicoFK: medicodata,
                        pacienteFK: pacientedata,
                    };
                }))
            res.status(200).json(atestadoAss);
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao buscar os atestados.' });
        }
    }
    async barChart(req, res) {
        try {
            const results = await atestadoModel.findAll({
                attributes: [
                    [Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "dataConsulta"')), 'ano'],
                    [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM "dataConsulta"')), 'mes'],
                    [Sequelize.fn('COUNT', Sequelize.literal('*')), 'total_ocorrencias'],
                ],
                where: Sequelize.literal(`EXTRACT(YEAR FROM "dataConsulta") = 2023`),
                group: ['ano', 'mes'],
                order: ['ano', 'mes'],
            });

            // Processar os resultados, se necessário

            res.status(200).json(results); // Retornar os resultados como JSON
        } catch (error) {
            console.error('Erro ao executar a consulta:', error);
            res.status(500).json({ error: 'Ocorreu um erro ao contar dados.' });
        }
    }
    async pieChart(req, res) {
        try {
            const results = await atestadoModel.findAll({
                attributes: [
                    [sequelize.fn('COALESCE', sequelize.col('cid'), 'Não especificado'), 'cid_especificado'],
                    [sequelize.fn('COUNT', sequelize.col('*')), 'quantidade']
                ],
                group: sequelize.col('cid_especificado'),
                order: [[sequelize.col('quantidade'), 'DESC']],
                limit: 5
            });

            // Processar os resultados, se necessário

            res.status(200).json(results); // Retornar os resultados como JSON
        } catch (error) {
            console.error('Erro ao executar a consulta:', error);
            res.status(500).json({ error: 'Ocorreu um erro ao contar dados.' });
        }
    }
    async contarMedicos(req, res) {
        try {
            const totalMedicos = await medicoModel.count();
            res.status(200).json(totalMedicos);
        } catch (error) {
            console.error('Erro ao contar médicos:', error);
            throw error;
        }
    }

    // Função para contar pacientes
    async contarPacientes(req, res) {
        try {
            const totalPacientes = await pacienteModel.count();
            res.status(200).json(totalPacientes);
        } catch (error) {
            console.error('Erro ao contar pacientes:', error);
            throw error;
        }
    }
    async showOnly(req, res) {
        try {
            const { coluna, ordem, dado } = req.body;
            const atestadoData = await atestadoModel.findAll({
                where: { [coluna]: dado },
                order: [['id', ordem]]
            });
            // Use um loop ou mapeamento para buscar dados associados
            const atestadoAss = await Promise.all(
                atestadoData.map(async (atestadoModel) => {
                    const medico = require('../database/models/medicomodel')(sequelize, DataTypes);
                    const paciente = require('../database/models/pacientemodel')(sequelize, DataTypes);
                    const medicodata = await medico.findByPk(atestadoModel.medicoFK, { paranoid: false });
                    const pacientedata = await paciente.findByPk(atestadoModel.pacienteFK, { paranoid: false });

                    // Combine os dados associados com o objeto PatrimonioSala
                    return {
                        atestado: atestadoModel,
                        medicoFK: medicodata,
                        pacienteFK: pacientedata,
                    };
                }))
            res.status(200).json(atestadoAss);
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao buscar os atestados.' });
        }
    }
    /*async showOnly(req, res) {
        try {
            const { coluna, ordem, dado } = req.body;
            const paciente = await atestadoModel.findAll({
                where: { [coluna]: dado },
                order: [[ordem, 'DESC']]
            });
            res.status(200).json(paciente);
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao buscar os pacientes.' });
        }
    }*/

    async update(req, res) {
        try {
            const { medicoFK, pacienteFK, dataConsulta, horaInicioConsulta, horaFimConsulta, dispensaAlgorismo, dispensaExtenso, cid } = req.body;
            const atualizar = await atestadoModel.findByPk(req.params.id);
            if (medicoFK) {
                atualizar.medicoFK = medicoFK;
            }
            if (pacienteFK) {
                atualizar.pacienteFK = pacienteFK;
            }
            if (dataConsulta) {
                atualizar.dataConsulta = dataConsulta;
            }
            if (horaInicioConsulta) {
                atualizar.horaInicioConsulta = horaInicioConsulta;
            }
            if (horaFimConsulta) {
                atualizar.horaFimConsulta = horaFimConsulta;
            }
            if (dispensaAlgorismo) {
                atualizar.dispensaAlgorismo = dispensaAlgorismo;
            }
            if (dispensaExtenso) {
                atualizar.dispensaExtenso = dispensaExtenso;
            }
            if (cid) {
                atualizar.cid = cid;
            }
            await atualizar.save();
            res.status(201).json({ mensagem: 'Atestado atualizado com sucesso!', atestadoModel: atualizar });
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao atualizar atestado.' });
        }
    }
    async delete(req, res) {
        try {
            const atestado = await atestadoModel.destroy({
                where: {
                    id: req.params.id
                }
            });
            res.status(200).json(`${atestado} atestado excluido com sucesso! `);
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao excluir atestado.' });
        }
    }
}

module.exports = new AtestadoController();
