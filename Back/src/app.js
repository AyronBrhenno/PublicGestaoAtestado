const cors = require('cors');
const express = require('express');
const routes = require('./routes')
const app = express();

app.use(cors());
// indicar para o express ler body com json
app.use(express.json())

//usar o router
app.use(routes)

module.exports = app;
