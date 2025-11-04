const { supabase } = require("../../supabase");
const { logger } = require("../configs/winston.config");


const loginRepository = async (body) => {
    try {
        const { email, password } = body;
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        return data;

    } catch (error) {
        console.log(error);
    }
}

const registerRepository = async (body) => {
    try {
        const { email, password } = body;
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });
        return data;

    } catch (error) {
        console.log(error);
    }
}

const getUserRepository = async (token) => {
    try {

        const { data, error } = await supabase.auth.getUser(token);

        if (error) throw error;
        return data;

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loginRepository,
    registerRepository,
    getUserRepository
}