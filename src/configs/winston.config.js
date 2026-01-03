const winston = require('winston');

const { combine, timestamp, json, printf } = winston.format;

// Formato para consola (desarrollo)
const consoleFormat = printf(({ level, message, service, timestamp }) => {
    const serviceTag = service ? `[${service}]` : '';
    const time = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();
    return `${time} ${level}: ${serviceTag} ${message}`;
});

// Formato para archivos (JSON)
const fileFormat = combine(
    timestamp(),
    json()
);

const logger = winston.createLogger({
    level: 'info',
    transports: [
        // - Write all logs with importance level of `error` or higher to `error.log`
        new winston.transports.File({
            filename: 'error.log',
            level: 'error',
            format: fileFormat
        }),
        // - Write all logs with importance level of `info` or higher to `combined.log`
        new winston.transports.File({
            filename: 'combined.log',
            format: fileFormat
        }),
    ],
});

// Agregar consola solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            consoleFormat
        ),
    }));
}

module.exports = function buildLoggerPluggin(service) {
    return {
        log: (message) => {
            logger.log("info", { message, service })
        },
        error: (message) => {
            logger.error("error", {
                message,
                service,
            })
        }
    }
}