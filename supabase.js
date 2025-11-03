const { createClient } = require('@supabase/supabase-js');
const { BASE_URL, API_KEY } = require('./src/configs/constants');
const supabase = createClient(BASE_URL, API_KEY);

module.exports = {
    supabase
}