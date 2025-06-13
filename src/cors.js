import { envs } from "./environmentVariables.js";
import { getEmail } from "./redis.js";

export const corsOption = {
    origin: async (origin, callback) => {
      if (!origin || origin === envs.DEFAULT_URL) {
        return callback(null, true);
      }

      try {
        const email = await getEmail(origin);
        
        if (!email) return callback(new Error("Not allowed by CORS"));
        
        return callback(null,true);
      } catch (error) {
        console.error("Error leyendo urls.json:", error);
        return callback(new Error("Server error"));
      }
    },
  }