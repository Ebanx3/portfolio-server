if( process.argv.includes("--loadEnv") ) process.loadEnvFile();

const { EMAIL_ADDRESS, EMAIL_APP_PASSWORD, EMAIL_SERVICE, EMAIL_PORT, BOT_TOKEN } = process.env;
if (!EMAIL_ADDRESS || !EMAIL_APP_PASSWORD || !EMAIL_SERVICE || !EMAIL_PORT || !BOT_TOKEN) {
  throw Error(
    "EMAIL_ADDRESS, EMAIL_APP_PASSWORD, EMAIL_SERVICE, BOT_TOKEN and EMAIL_PORT environment variables are necessary"
  );
}

export { EMAIL_ADDRESS, EMAIL_APP_PASSWORD, EMAIL_SERVICE, EMAIL_PORT, BOT_TOKEN };