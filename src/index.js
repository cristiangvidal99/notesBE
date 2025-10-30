const express = require('express');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const { swaggerSpec } = require('../swagger.config.js');
const routes = require('./routes/apiRoutes');
const { PORT } = require('./globals/globals.js');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});