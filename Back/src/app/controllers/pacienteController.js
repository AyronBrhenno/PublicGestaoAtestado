const config = require('../database/config/config');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DEV_DATABASE_URL, {
    dialect: 'postgres' // Adicione esta linha para especificar o dialeto
});
const pacienteModel = require('../database/models/pacientemodel')(sequelize, DataTypes);

class PacienteController {
    async store(req, res) {
        try {
            const { rg, nome, genero, dataNascimento } = req.body;
            const novoPaciente = await pacienteModel.create({
                rg: rg,
                nome: nome,
                genero: genero,
                dataNascimento: dataNascimento,
            });
            res.status(201).json({ mensagem: 'Paciente cadastrado com sucesso!', nome: novoPaciente });
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao cadastrar o paciente.' });
        }
    }

    async show(req, res) {
        try {
            const paciente = await pacienteModel.findAll({ paranoid: false });
            res.status(200).json(paciente);
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao buscar os pacientes.' });
        }
    }
    async show2(req, res) {
        try {
            const paciente = await pacienteModel.findAll({ paranoid: true });
            res.status(200).json(paciente);
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao buscar os pacientes.' });
        }
    }
    async showOnly(req, res) {
        try {
            const { coluna, dado } = req.body;
            const paciente = await pacienteModel.findAll({
                where: { [coluna]: dado }
            });
            res.status(200).json(paciente);
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao buscar os pacientes.' });
        }
    }
    async restore(req, res) {
        try {
            const paciente = await pacienteModel.restore({
                where: {
                    rg: req.params.rg
                }
            })
            res.status(200).json(`${paciente} paceinte restaurado com sucesso.`);
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao restaurar o paciente.' });
        }
    }
    async update(req, res) {
        try {
            const { rg, nome, genero, dataNascimento } = req.body;
            const atualizar = await pacienteModel.findByPk(req.params.id);
            if (rg) {
                atualizar.rg = rg;
            }
            if (nome) {
                atualizar.nome = nome;
            }
            if (genero) {
                atualizar.genero = genero;
            }
            if (dataNascimento) {
                atualizar.dataNascimento = dataNascimento;
            }
            await atualizar.save();
            res.status(201).json({ mensagem: 'Pacinte atualizado com sucesso!', pacienteModel: atualizar });
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao atualizar paciente.' });
        }
    }
    async delete(req, res) {
        try {
            const paciente = await pacienteModel.destroy({
                where: {
                    id: req.params.id
                }
            });
            res.status(200).json(`${paciente} paciente excluido com sucesso! `);
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao excluir paciente.' });
        }
    }
}

module.exports = new PacienteController();
