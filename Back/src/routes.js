const Router = require('express');

const medicoController = require('./app/controllers/medicoController');
const gestorController = require('./app/controllers/gestorController');
const pacienteController = require('./app/controllers/pacienteController');
const atestadoControllerGestor = require('./app/controllers/atestadoControllerGestor');
const atestadoControllerMedico= require('./app/controllers/atestadoControlerMedico');
const { authMiddlewareGestao } = require('./app/database/middlewares/auth-middleware-gestor copy');
const { authMiddlewareMedico } = require('./app/database/middlewares/auth-middleware-medico')
const router = Router()

// medico
router.post('/medico/cadastro', authMiddlewareGestao, medicoController.store);
router.get('/medico/getall', authMiddlewareGestao, medicoController.show);
router.put('/medico/:id', medicoController.update);
router.delete('/medico/:id', authMiddlewareGestao, medicoController.delete);
router.post('/medico/getonly', authMiddlewareGestao, medicoController.showOnly);
router.post('/medico/sigin', medicoController.sigin);
router.get('/medico/restore/:rg', authMiddlewareGestao, medicoController.restore);


// gestor
router.post('/gestor/cadastro', gestorController.store);
router.get('/gestor/getall', gestorController.show);
router.put('/gestor/:id', gestorController.update);
router.delete('/gestor/:id', gestorController.delete);
router.post('/gestor/sigin', gestorController.sigin);
router.post('/gestor/getall', gestorController.showOnly);

// paciente
router.post('/paciente/cadastro', authMiddlewareGestao, pacienteController.store);
router.get('/paciente/getall', authMiddlewareGestao, pacienteController.show);
router.put('/paciente/:id', authMiddlewareGestao, pacienteController.update);
router.delete('/paciente/:id', authMiddlewareGestao, pacienteController.delete);
router.post('/paciente/getonly', authMiddlewareGestao, pacienteController.showOnly);
router.post('/medico/paciente/getonly', authMiddlewareMedico, pacienteController.showOnly);
router.get('/medico/paciente/getall', authMiddlewareMedico, pacienteController.show);
router.get('/paciente/restore/:rg', authMiddlewareGestao, pacienteController.restore);

// atestadoGestor
router.post('/atestado/gestor/cadastro', authMiddlewareGestao, atestadoControllerGestor.store);
router.get('/atestado/gestor/getall', authMiddlewareGestao, atestadoControllerGestor.show);
router.put('/atestado/gestor/:id', authMiddlewareGestao, atestadoControllerGestor.update);
router.delete('/atestado/gestor/:id', authMiddlewareGestao, atestadoControllerGestor.delete);
router.post('/atestado/gestor/getonly', authMiddlewareGestao, atestadoControllerGestor.showOnly);
router.get('/atestado/gestor/getdata', atestadoControllerGestor.barChart);
router.get('/atestado/gestor/getcids', atestadoControllerGestor.pieChart);
router.get('/atestado/gestor/contarmedicos', atestadoControllerGestor.contarMedicos);
router.get('/atestado/gestor/contarpacientes', atestadoControllerGestor.contarPacientes);

// atestadoMedico
router.post('/atestado/medico/cadastro', authMiddlewareMedico, atestadoControllerMedico.store);
router.get('/atestado/medico/getall', authMiddlewareMedico, atestadoControllerMedico.show);
router.put('/atestado/medico/:id', authMiddlewareMedico, atestadoControllerMedico.update);
router.delete('/atestado/medico/:id', authMiddlewareMedico, atestadoControllerMedico.delete);
router.post('/atestado/medico/getonly', authMiddlewareMedico, atestadoControllerMedico.showOnly);
router.get('/atestado/medico/getdata/:rg', atestadoControllerMedico.barChart)
router.get('/atestado/medico/getcids/:rg', atestadoControllerMedico.pieChart)
module.exports = router;