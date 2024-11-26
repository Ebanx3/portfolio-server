process.loadEnvFile();
const { EMAIL_ADDRESS, EMAIL_APP_PASSWORD, EMAIL_SERVICE, EMAIL_PORT } = process.env;
if (!EMAIL_ADDRESS || !EMAIL_APP_PASSWORD || !EMAIL_SERVICE || !EMAIL_PORT) {
  throw Error(
    "EMAIL_ADDRESS, EMAIL_APP_PASSWORD, EMAIL_SERVICE and EMAIL_PORT environment variables are necessary"
  );
}

import express from "express";
import nodemailer from "nodemailer";

const server = express();
server.use(express.json());

const port = process.env.PORT || 8080;

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
    res.status(200).json({ success: true, message: "server status ON" });
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
      from: EMAIL_ADDRESS,
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

export const InitServer = () => {
  server.listen(port, () => {
    console.log(`Server up! Listening at port ${port}`);
  });
};
