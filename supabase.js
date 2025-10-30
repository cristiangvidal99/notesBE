const { createClient } = require('@supabase/supabase-js');
const { BASE_URL, API_KEY } = require('./src/globals/globals');
const supabase = createClient(BASE_URL, API_KEY);

module.exports = {
    supabase
}