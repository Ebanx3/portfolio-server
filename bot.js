import config from "./dotenv.js";
import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

const pendientesId = "1298093968948596756";
const enProcesoId = "1298094010132594689";
const revisionId = "1298120464471822385";
const terminadasId = "1298094048778649611";

client.on("ready", async () => {
  console.log("Connectado", client.user.username);
});

client.on("messageCreate", (message) => {
});

client.on("messageReactionAdd", async (reaction, user) => {
  //   if (reaction.partial) await reaction.fetch();
  //   if (reaction.message.partial) await reaction.message.fetch;
  const { message, emoji } = reaction;

  if (emoji.name === "💪") {
    const enProcesoChannel = client.channels.cache.get(enProcesoId);
    const revisionChannel = client.channels.cache.get(revisionId);
    const terminadasChannel = client.channels.cache.get(terminadasId);

    if (message.channel.id === pendientesId) {
      await message.delete();
      await enProcesoChannel.send(
        `<@${user.id}> -> ${message.content}`
      );
    } else if (
      message.channel.id === enProcesoId &&
      message.content.startsWith(`<@${user.id}>`)
    ) {
      if(message.hasThread){
        await message.thread.delete();
      }
      await message.delete();
      await revisionChannel.send(`${message.content}`);
    } else if (
      message.channel.id === revisionId &&
      !message.content.startsWith(`<@${user.id}>`)
    ) {
      await message.delete();
      await terminadasChannel.send(message.content);
    }
  }

  if(emoji.name === "✊" && message.channel.id === revisionId){
    const enProcesoChannel = client.channels.cache.get(enProcesoId);

    await message.delete();
    await enProcesoChannel.send(
      `${message.content}`
    );
  }
});

client.login(config.BOT_TOKEN);
