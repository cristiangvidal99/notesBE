const notesRepository = require('../repository/notesRepository');
const buildLogger = require('../configs/winston.config');
const logger = buildLogger('notesService');

const createNoteService = async (userId, noteData) => {
    try {
        const { data, error } = await notesRepository.createNoteRepository(userId, noteData);

        if (error) {
            throw error;
        }

        return {
            success: true,
            note: data
        };
    } catch (error) {
        logger.error(`Error en createNoteService: ${error.message}`);
        throw error;
    }
}

const getAllNotesService = async (userId) => {
    try {
        const { data, error } = await notesRepository.getAllNotesRepository(userId);

        if (error) {
            throw error;
        }

        return {
            success: true,
            notes: data,
            count: data.length
        };
    } catch (error) {
        logger.error(`Error en getAllNotesService: ${error.message}`);
        throw error;
    }
}

const getNoteByIdService = async (userId, noteId) => {
    try {
        const { data, error } = await notesRepository.getNoteByIdRepository(userId, noteId);

        if (error) {
            throw error;
        }

        return {
            success: true,
            note: data
        };
    } catch (error) {
        logger.error(`Error en getNoteByIdService: ${error.message}`);
        throw error;
    }
}

const updateNoteService = async (userId, noteId, noteData) => {
    try {
        const { data, error } = await notesRepository.updateNoteRepository(userId, noteId, noteData);

        if (error) {
            throw error;
        }

        return {
            success: true,
            note: data
        };
    } catch (error) {
        logger.error(`Error en updateNoteService: ${error.message}`);
        throw error;
    }
}

const deleteNoteService = async (userId, noteId) => {
    try {
        const { data, error } = await notesRepository.deleteNoteRepository(userId, noteId);

        if (error) {
            throw error;
        }

        return {
            success: true,
            message: 'Nota eliminada exitosamente',
            note: data
        };
    } catch (error) {
        logger.error(`Error en deleteNoteService: ${error.message}`);
        throw error;
    }
}

module.exports = {
    createNoteService,
    getAllNotesService,
    getNoteByIdService,
    updateNoteService,
    deleteNoteService
}

