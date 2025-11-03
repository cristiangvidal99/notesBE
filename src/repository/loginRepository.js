const { supabase } = require("../../supabase");
const { logger } = require("../configs/winston.config");


const loginRepository = async (body) => {
    try {
        const { email, password } = body;
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        logger.log("data:" + data);
        return data;

    } catch (error) {
        logger.error(`Error login repository ${error}`);
        throw error;
    }
}

module.exports = {
    loginRepository
}