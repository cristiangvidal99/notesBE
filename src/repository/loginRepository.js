const { supabase } = require("../../supabase");
const buildLogger = require("../configs/winston.config");
const bcrypt = require("bcrypt");
const { createClient } = require('@supabase/supabase-js');
const { BASE_URL, SERVICE_ROLE_KEY } = require("../configs/constants");
const logger = buildLogger("loginRepository");

const loginRepository = async (body) => {
    try {
        const { email, password } = body;

        if (!email || !password) {
            throw new Error('Email y contraseña son requeridos');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password
        });

        if (error) {
            logger.error(`Error en login: ${error.message}`);

            // Manejar error de email no confirmado con mensaje más claro
            if (error.message === 'Email not confirmed' || error.message.includes('Email not confirmed')) {
                const customError = new Error('Por favor confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.');
                customError.status = 403;
                throw customError;
            }

            throw error;
        }

        if (!data || !data.session) {
            logger.error('Login exitoso pero no se recibió sesión');
            throw new Error('Error al obtener la sesión de autenticación');
        }

        logger.log(`Login exitoso para usuario: ${email}`);
        return { data, error: null };

    } catch (error) {
        logger.error(`Error en loginRepository: ${error.message}`);
        return { data: null, error };
    }
}

const registerRepository = async (body) => {
    try {
        const { email, password, full_name } = body;

        if (!email || !password) {
            throw new Error('Email y contraseña son requeridos');
        }

        if (password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('El formato del email no es válido');
        }

        // Paso 1: Autenticar con Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password
        });

        if (authError) {
            logger.error(`Error en registro de autenticación: ${authError.message}`);
            throw authError;
        }

        if (!authData.user) {
            throw new Error('No se pudo crear el usuario en la autenticación');
        }

        // Auto-confirmar email si tenemos service role key (solo en desarrollo)
        if (SERVICE_ROLE_KEY && !authData.user.email_confirmed_at) {
            try {
                const adminClient = createClient(BASE_URL, SERVICE_ROLE_KEY, {
                    auth: {
                        autoRefreshToken: false,
                        persistSession: false
                    }
                });

                const { error: confirmError } = await adminClient.auth.admin.updateUserById(
                    authData.user.id,
                    { email_confirm: true }
                );

                if (confirmError) {
                    logger.error(`Error al auto-confirmar email: ${confirmError.message}`);
                } else {
                    logger.log(`Email auto-confirmado para usuario: ${email}`);
                }
            } catch (confirmErr) {
                logger.error(`Error al intentar auto-confirmar email: ${confirmErr.message}`);
                // No lanzamos error, solo logueamos
            }
        }

        // Paso 2: Hashear la contraseña para guardarla en la tabla
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Paso 3: Insertar en la tabla de usuarios (RLS desactivado)
        const now = new Date().toISOString();
        const { data: userData, error: insertError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                email: email.trim().toLowerCase(),
                password_hash: password_hash,
                full_name: full_name || null,
                created_at: now,
                updated_at: now
            })
            .select()
            .single();

        if (insertError) {
            logger.error(`Error al insertar usuario en tabla: ${insertError.message}`);
            throw new Error(`Error al guardar datos del usuario: ${insertError.message}`);
        }

        logger.log(`Registro exitoso para usuario: ${email} (ID: ${authData.user.id})`);
        return { data: { ...authData, userData }, error: null };

    } catch (error) {
        logger.error(`Error en registerRepository: ${error.message}`);
        return { data: null, error };
    }
}

const getUserRepository = async (token) => {
    try {
        if (!token) {
            throw new Error('Token es requerido');
        }

        const { data, error } = await supabase.auth.getUser(token);

        if (error) {
            logger.error(`Error al obtener usuario: ${error.message}`);
            throw error;
        }

        return { data, error: null };

    } catch (error) {
        logger.error(`Error en getUserRepository: ${error.message}`);
        return { data: null, error };
    }
}

module.exports = {
    loginRepository,
    registerRepository,
    getUserRepository
}