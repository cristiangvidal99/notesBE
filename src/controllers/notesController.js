const notesService = require('../services/notesService');
const buildLogger = require('../configs/winston.config');
const logger = buildLogger('notesController');

const createNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                error: 'Título y contenido son requeridos'
            });
        }

        const response = await notesService.createNoteService(userId, req.body);
        res.status(201).json(response);
    } catch (error) {
        logger.error(`Error en createNote controller: ${error.message}`);

        const statusCode = error.status || 400;
        res.status(statusCode).json({
            success: false,
            error: error.message || 'Error al crear la nota'
        });
    }
}

const getAllNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const response = await notesService.getAllNotesService(userId);
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error en getAllNotes controller: ${error.message}`);

        const statusCode = error.status || 500;
        res.status(statusCode).json({
            success: false,
            error: error.message || 'Error al obtener las notas'
        });
    }
}

const getNoteById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'ID de nota es requerido'
            });
        }

        const response = await notesService.getNoteByIdService(userId, id);
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error en getNoteById controller: ${error.message}`);

        const statusCode = error.status || 404;
        res.status(statusCode).json({
            success: false,
            error: error.message || 'Error al obtener la nota'
        });
    }
}

const updateNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { title, content } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'ID de nota es requerido'
            });
        }

        if (!title && !content) {
            return res.status(400).json({
                success: false,
                error: 'Al menos un campo (título o contenido) debe ser proporcionado'
            });
        }

        const response = await notesService.updateNoteService(userId, id, req.body);
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error en updateNote controller: ${error.message}`);

        const statusCode = error.status || 400;
        res.status(statusCode).json({
            success: false,
            error: error.message || 'Error al actualizar la nota'
        });
    }
}

const deleteNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'ID de nota es requerido'
            });
        }

        const response = await notesService.deleteNoteService(userId, id);
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error en deleteNote controller: ${error.message}`);

        const statusCode = error.status || 404;
        res.status(statusCode).json({
            success: false,
            error: error.message || 'Error al eliminar la nota'
        });
    }
}

module.exports = {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote
}

