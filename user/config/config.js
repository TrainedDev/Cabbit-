require("dotenv").config();

module.exports = {
  development : {
    use_env_variable: "SUPABASE_URL"
  },
  production : {
    use_env_variable: "SUPABASE_URL"
  },
};