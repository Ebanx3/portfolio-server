import { envs } from "./environmentVariables.js";
import express from "express";
import cors from "cors";
import { corsOption } from "./cors.js";
import {
  getHomeHtml,
  getServerStatus,
  redirectEmail,
  registerFrontend,
} from "./endpoints.js";

const server = express();
server.use(express.json());
server.use(cors(corsOption));

server.get("/", getHomeHtml);

server.get("/serverStatus", getServerStatus);

server.post("/registerFrontend", registerFrontend);

server.post("/redirectEmail", redirectEmail);

server.use((req, res) => {
  res.status(404).send("Undefined path");
});

server.listen(envs.PORT, () => {
  console.clear();
  console.log(`Server up! Listening at port ${envs.PORT}`);
});
