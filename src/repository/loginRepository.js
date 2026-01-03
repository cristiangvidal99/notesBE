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
            throw error;
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

        // Paso 2: Hashear la contraseña para guardarla en la tabla
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Paso 3: Insertar en la tabla de usuarios
        // Priorizamos el service role key para bypass RLS, o el token de sesión como fallback
        const now = new Date().toISOString();
        let supabaseClient;

        // Prioridad 1: Usar service role key si está disponible (bypass RLS)
        if (SERVICE_ROLE_KEY) {
            supabaseClient = createClient(BASE_URL, SERVICE_ROLE_KEY, {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            });
        }
        // Prioridad 2: Usar el token de sesión del usuario recién creado
        else if (authData.session?.access_token) {
            supabaseClient = createClient(BASE_URL, API_KEY, {
                global: {
                    headers: {
                        Authorization: `Bearer ${authData.session.access_token}`
                    }
                }
            });
        }
        // Si no hay ninguna opción, lanzar error
        else {
            throw new Error('No se puede insertar en la tabla: se requiere SERVICE_ROLE_KEY o sesión activa. Configure SERVICE_ROLE_KEY en las variables de entorno.');
        }

        const { data: userData, error: insertError } = await supabaseClient
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