import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import {
  EMAIL_SERVICE,
  EMAIL_ADDRESS,
  EMAIL_PORT,
  EMAIL_APP_PASSWORD,
  REDIS,
  FRONTEND_URL
} from "./envVariables.js";
import { createClient } from "redis";

const server = express();
server.use(express.json());
server.use(cors({ origin: FRONTEND_URL }));

const port = process.env.PORT || 8080;

const redis_key = "visitors";

const transporter = nodemailer.createTransport({
  host: EMAIL_SERVICE,
  port: EMAIL_PORT,
  secure: true,
  auth: {
    user: EMAIL_ADDRESS,
    pass: EMAIL_APP_PASSWORD,
  },
});

server.get("/serverStatus", async (req, res) => {
  try {
    const client = await createClient({url:REDIS})
      .on("error", (err) => console.log(err))
      .connect();
    const value = await client.get(redis_key);
    const visits = parseInt(value)
    await client.set(redis_key, visits + 1);
    res
      .status(200)
      .json({ success: true, message: "server status ON", visits: visits + 1});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

server.post("/redirectEmail", async (req, res) => {
  try {
    const { email, message } = req.body;
    if (
      !email ||
      !message ||
      typeof email != "string" ||
      typeof message != "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Request must have body with email and message string fields",
      });
    }

    const mailOptions = {
      from:`Portfolio <${EMAIL_ADDRESS}>`,
      to: EMAIL_ADDRESS,
      subject: `Recibiste un mensaje desde tu sitio web`,
      html: `
          <h2>Reciibiste un mensaje de: ${email}</h2>
          <p style="white-space: pre-line;">${message}</p>
          `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw Error(error);
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

server.use((req, res) => {
  res.status(404).send("Undefined path");
});

server.listen(port, () => {
  console.log(`Server up! Listening at port ${port}`);
});
