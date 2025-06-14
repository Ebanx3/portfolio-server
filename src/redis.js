import { envs } from "./environmentVariables.js";
import { createClient } from "redis";

const redis_key = "portfolio-visits";

export const addNewVisit = async () => {
  const client = await createClient({ url: envs.REDIS_URL })
    .on("error", (err) => console.log(err))
    .connect();
  const value = await client.get(redis_key);
  const visits = parseInt(value);
  await client.set(redis_key, visits + 1);
  client.quit();
  return visits + 1;
};

export const addFrontendUrlEmail = async (url, email) => {
  const client = await createClient({ url: envs.REDIS_URL })
    .on("error", (err) => console.log(err))
    .connect();
  await client.set(url, email);
  client.quit();
  return true;
};

export const getEmail = async (urlf) => {
  const client = await createClient({ url: envs.REDIS_URL })
    .on("error", (err) => console.log(err))
    .connect();
    const keys = await client.keys('*')
    const email = await client.get(urlf);
  client.quit();
  return email;
};
