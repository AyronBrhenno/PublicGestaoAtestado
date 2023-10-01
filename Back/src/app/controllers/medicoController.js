const config = require('../database/config/config');
const { Sequelize, DataTypes } = require('sequelize');
const atestadomodel = require('../database/models/atestadomodel');
const sequelize = new Sequelize(process.env.DEV_DATABASE_URL, {
    dialect: 'postgres' // Adicione esta linha para especificar o dialeto
});
const medicoModel = require('../database/models/medicomodel')(sequelize, DataTypes);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { TOKEN_SECRET, SALT } = require('../../../environments');

class MedicoController {
    async sigin(request, response) {
        try {
            const { rg, password } = request.body;

            // Validar parâmetros
            if (!rg || !password) {
                return response.status(400).json({
                    error: 'Nome e senha são obrigatórios!'
                });
            }

            // Verifica se usuário existe
            const userExists = await medicoModel.findOne({
                where: { rg }
            });

            if (!userExists) {
                return response.status(400).json({
                    error: 'Usuario não existe!'
                });
            }

            // Gera token de acesso
            const accessToken = jwt.sign(
                { id: userExists.id },
                TOKEN_SECRET,
                { expiresIn: '1000m' }
            );

            return response.status(200).json({
                accessToken
            });
        } catch (error) {
            return response.status(500).json({
                error: `Erro interno: ${error}`
            });
        }
    }
    async store (req,res) {
        try {
            const {rg, nome, email, genero, senha, endereco, dataNascimento, crm} = await req.body;
            //const senhaHASH = await bcrypt.hash(senha, SALT);
            const novoMedico = await medicoModel.create({
                rg: rg,
                nome: nome,
                email: email,
                genero: genero,
                senha: senha,
                endereco: endereco,
                dataNascimento: dataNascimento,
                crm: crm
            });
            res.status(201).json({ mensagem: 'Médico cadastrado com sucesso!', Medico: novoMedico });
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao cadastrar o médico.' });
        }
    }

    async show (req,res) {
        try {
            const medicos = await medicoModel.findAll();
            res.status(200).json(medicos);
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao buscar os medicos.' });
        }
    }
    async showOnly (req,res) {
        try {
            const {coluna, ordem, dado} = req.body;
            const paciente = await medicoModel.findAll({
                where: {[coluna]: dado},
                order:[ [ordem, 'DESC'] ]
            });
            res.status(200).json(paciente);
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao buscar os pacientes.' });
        }
    }

    async update (req,res) {
        try {
            const {rg, nome, email, genero, endereco, dataNascimento, crm, senha} = req.body;
            const atualizar = await medicoModel.findByPk(req.params.id);
            if(rg){
                atualizar.rg = rg;
            }
            if(nome){
                atualizar.nome = nome;
            }
            if(email){
                atualizar.email = email;
            }
            if(genero){
                atualizar.genero = genero;
            }
            if(senha){
                atualizar.senha = senha;
            }
            if(endereco){
                atualizar.endereco = endereco;
            }
            if(dataNascimento){
                atualizar.dataNascimento = dataNascimento;
            }
            if(crm){
                atualizar.crm = crm;
            }
            await atualizar.save();
            res.status(201).json({ mensagem: 'Medico atualizado com sucesso!', medicoModel: atualizar });
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao atualizar Medico.' });
        }
    }
    async delete (req,res) {
        try {
            const medico = await medicoModel.destroy({
                where: {
                    id: req.params.id
                }
            });
            res.status(200).json(`${medico} medico excluido com sucesso! `);
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao excluir medico.' });
        }
    }
}

module.exports = new MedicoController();
