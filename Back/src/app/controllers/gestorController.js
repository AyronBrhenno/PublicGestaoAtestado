const config = require('../database/config/config');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DEV_DATABASE_URL, {
    dialect: 'postgres' // Adicione esta linha para especificar o dialeto
});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { TOKEN_SECRET, SALT } = require('../../../environments');

const gestorModel = require('../database/models/gestormodel')(sequelize, DataTypes);

class GestorController {
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
            const userExists = await gestorModel.findOne({
                where: { rg }
            });

            if (!userExists) {
                return response.status(400).json({
                    error: 'Usuario não existe!'
                });
            }
            // Verifica se a senha está correta
            const isPasswordValid = await bcrypt.compare(password, userExists.senha);
            if (!isPasswordValid) {
                return response.status(400).json({
                    error: 'Senha incorreta!'
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
    async store(req, res) {
        try {
            const { rg, nome, email, genero, senha } = req.body;
            const senhaHASH = await bcrypt.hash(senha, SALT);
            const novoGestor = await gestorModel.create({
                rg: rg,
                nome: nome,
                email: email,
                genero: genero,
                senha: senhaHASH,
            });
            res.status(201).json({ mensagem: 'Gestor cadastrado com sucesso!', nome: novoGestor });
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao cadastrar o gestor.' });
        }
    }

    async show(req, res) {
        try {
            const gestor = await gestorModel.findAll();
            res.status(200).json(gestor);
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao buscar os gestores.' });
        }
    }
    async showOnly(req, res) {
        try {
            const { coluna, ordem, dado } = req.body;
            const paciente = await gestorModel.findAll({
                where: { [coluna]: dado },
                order: [[ordem, 'DESC']]
            });
            res.status(200).json(paciente);
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao buscar os pacientes.' });
        }
    }

    async update(req, res) {
        try {
            const { rg, nome, email, genero, senha } = req.body;
            const atualizar = await gestorModel.findByPk(req.params.id);
            if (rg) {
                atualizar.rg = rg;
            }
            if (nome) {
                atualizar.nome = nome;
            }
            if (email) {
                atualizar.email = email;
            }
            if (genero) {
                atualizar.genero = genero;
            }
            if (senha) {
                const senhaHASH = await bcrypt.hash(senha, SALT);
                atualizar.senha = senhaHASH;
            }
            await atualizar.save();
            res.status(201).json({ mensagem: 'Medico atualizado com sucesso!', gestorModel: atualizar });
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao atualizar Medico.' });
        }
    }
    async delete(req, res) {
        try {
            const gestor = await gestorModel.destroy({
                where: {
                    id: req.params.id
                }
            });
            res.status(200).json(`${gestor} medico excluido com sucesso! `);
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'Ocorreu um erro ao excluir medico.' });
        }
    }
}

module.exports = new GestorController();
