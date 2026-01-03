const { supabase } = require("../../supabase");
const buildLogger = require("../configs/winston.config");
const logger = buildLogger("notesRepository");

const createNoteRepository = async (userId, noteData) => {
    try {
        const { title, content } = noteData;

        if (!title || !content) {
            throw new Error('Título y contenido son requeridos');
        }

        const now = new Date().toISOString();
        const { data, error } = await supabase
            .from('notes')
            .insert({
                user_id: userId,
                title: title.trim(),
                content: content.trim(),
                created_at: now,
                updated_at: now
            })
            .select()
            .single();

        if (error) {
            logger.error(`Error al crear nota: ${error.message}`);
            throw error;
        }

        logger.log(`Nota creada exitosamente. ID: ${data.id}, Usuario: ${userId}`);
        return { data, error: null };

    } catch (error) {
        logger.error(`Error en createNoteRepository: ${error.message}`);
        return { data: null, error };
    }
}

const getAllNotesRepository = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            logger.error(`Error al obtener notas: ${error.message}`);
            throw error;
        }

        logger.log(`Notas obtenidas para usuario: ${userId}. Total: ${data?.length || 0}`);
        return { data: data || [], error: null };

    } catch (error) {
        logger.error(`Error en getAllNotesRepository: ${error.message}`);
        return { data: null, error };
    }
}

const getNoteByIdRepository = async (userId, noteId) => {
    try {
        if (!noteId) {
            throw new Error('ID de nota es requerido');
        }

        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('id', noteId)
            .eq('user_id', userId)
            .single();

        if (error) {
            logger.error(`Error al obtener nota: ${error.message}`);
            throw error;
        }

        if (!data) {
            throw new Error('Nota no encontrada');
        }

        logger.log(`Nota obtenida. ID: ${noteId}, Usuario: ${userId}`);
        return { data, error: null };

    } catch (error) {
        logger.error(`Error en getNoteByIdRepository: ${error.message}`);
        return { data: null, error };
    }
}

const updateNoteRepository = async (userId, noteId, noteData) => {
    try {
        if (!noteId) {
            throw new Error('ID de nota es requerido');
        }

        const { title, content } = noteData;
        const updateData = {
            updated_at: new Date().toISOString()
        };

        if (title !== undefined) {
            updateData.title = title.trim();
        }

        if (content !== undefined) {
            updateData.content = content.trim();
        }

        if (Object.keys(updateData).length === 1) {
            throw new Error('Al menos un campo (título o contenido) debe ser proporcionado para actualizar');
        }

        const { data, error } = await supabase
            .from('notes')
            .update(updateData)
            .eq('id', noteId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            logger.error(`Error al actualizar nota: ${error.message}`);
            throw error;
        }

        if (!data) {
            throw new Error('Nota no encontrada o no tienes permisos para actualizarla');
        }

        logger.log(`Nota actualizada. ID: ${noteId}, Usuario: ${userId}`);
        return { data, error: null };

    } catch (error) {
        logger.error(`Error en updateNoteRepository: ${error.message}`);
        return { data: null, error };
    }
}

const deleteNoteRepository = async (userId, noteId) => {
    try {
        if (!noteId) {
            throw new Error('ID de nota es requerido');
        }

        // Primero verificar que la nota existe y pertenece al usuario
        const { data: note, error: checkError } = await supabase
            .from('notes')
            .select('id')
            .eq('id', noteId)
            .eq('user_id', userId)
            .single();

        if (checkError || !note) {
            throw new Error('Nota no encontrada o no tienes permisos para eliminarla');
        }

        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', noteId)
            .eq('user_id', userId);

        if (error) {
            logger.error(`Error al eliminar nota: ${error.message}`);
            throw error;
        }

        logger.log(`Nota eliminada. ID: ${noteId}, Usuario: ${userId}`);
        return { data: { id: noteId, deleted: true }, error: null };

    } catch (error) {
        logger.error(`Error en deleteNoteRepository: ${error.message}`);
        return { data: null, error };
    }
}

module.exports = {
    createNoteRepository,
    getAllNotesRepository,
    getNoteByIdRepository,
    updateNoteRepository,
    deleteNoteRepository
}

