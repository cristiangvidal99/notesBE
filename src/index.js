const express = require('express');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const { swaggerSpec } = require('../swagger.config.js');
const routes = require('./routes/apiRoutes');
const { PORT } = require('./configs/constants.js');
const app = express();

// Configuración de CORS
const corsOptions = {
    origin: [
        'https://notesfe-k7ii.onrender.com',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:8080'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});