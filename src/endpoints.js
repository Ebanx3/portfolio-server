import path from "node:path";
import { fileURLToPath } from "url";
import { addFrontendUrlEmail, addNewVisit, getEmail } from "./redis.js";
import { sendEmail } from "./sendEMail.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getHomeHtml = async (req, res) => {
  try {
    res.status(200).sendFile(path.resolve(__dirname, "../public/index.html"));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export const getServerStatus =  async (req, res) => {
  try {
    const visits = await addNewVisit();
    res.status(200).json({ success: true, message: "server status ON", visits  });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export const registerFrontend =  async (req, res) => {
  try {
    const { url, email } = req.body;
    if (!url || !email || url.length < 8 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ) {
      res.status(400).json({ message: "Es necesario proveer una url y un email validos" });
      return;
    }

    const added = await addFrontendUrlEmail(url, email);
    if(!added){
      res.status(400).json({message:"No se pudo agregar la url"})
    }

    res.status(200).json({ message: "Url agregada correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export const redirectEmail = async (req, res) => {
  try {
    const { from, subject, html } = req.body;

    if(!from || !subject || !html){
      res.status(400).json({
        success:false, message: "El cuerpo de la petición debe contener: from (string), subject (string) y html (string o html)"
      });
      return;
    } 

    const email = await getEmail(req.headers.origin);

    const result = await sendEmail({html, from, to:email , subject});
    if(!result){
      res.status(400).json({ success:false, message:"No se pudo enviar el email." });
      return;
    }

    res.status(200).json({ success: true, message: `Email redirigido a ${email} correctamente.` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}