const cors = require('cors');
const app = require('./app.js')
const PORTA = process.env.PORT || 8080

// escutar a porta 8080
app.listen(PORTA, () => {
    console.log(`Servidor iniciado na porta ${8080}`);
});