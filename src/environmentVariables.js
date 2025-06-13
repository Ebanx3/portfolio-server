if (process.argv.includes("--loadEnv")) process.loadEnvFile();

const { EMAIL_USER, EMAIL_PASSWORD, PORT, DEFAULT_URL, REDIS_URL } =
  process.env;

if (!EMAIL_USER || !EMAIL_PASSWORD) {
  throw Error(
    "EMAIL_USER and EMAIL_PASSWORD environment variables are necessary"
  );
}

export const envs = {
  EMAIL_USER,
  EMAIL_PASSWORD,
  PORT: parseInt(PORT || "8080"),
  DEFAULT_URL: DEFAULT_URL || `http://localhost:${PORT || 8080}`,
  REDIS_URL,
};
