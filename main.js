const { Intents, Client, MessageEmbed, Collection } = require("discord.js");
const Discord = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const mongoose = require("mongoose");
const fs = require("fs");
const { ProfilingLevel } = require("mongodb");
const settings = require("./req/configDiscord.json");
client.login(settings.loginToken);
client.config = require("./req/configDiscord.json");
const getip = require("./essentials/getIP.js");
const mongo = require("./mongodb/mongo.js");

const superagent = require("superagent");

async function getIP() {
  const ip = await superagent
    .get("https://api.ipify.org?format=json")
    .then((res) => res.body.ip);
  return ip;
};

/** 
   * @param {string} type
   */
getIP(type) {
  return this.IpAdress({ type });
};

client.on("ready", async () => {
  console.log("State");
  const embed = new MessageEmbed()
    .setColor("GREEN")
    .setTitle("Startingup")
    .addFields(
      { name: "Reason ", value: "nodemon startup", inline: true },
      { name: "Time", value: Date() },
      { name: "Version", value: "3.1.1", inline: true },
      { name: "Author", value: "Turta", inline: true },
      { name: "Discord.js", value: Discord.version, inline: true },
      { name: "Node.js", value: process.version, inline: true },
      { name: "MongoDB", value: mongoose.version, inline: true },
      { name: "Nodemon", value: "v1.8.3", inline: true },
      { name: "Ip Adress", value: await getIP() }
    );
  console.log(
    client.channels.cache.get("778745188482154506").send({ embeds: [embed] })
  );
  const state_schema = require("./mongodb/schemas/state_schema.js");
  await mongo().then(async (mongooose) => {
    try {
      await state_schema({
        ipv4: `${await getIP()}`,
        ipv6: null,
        discordjs_version: Discord.version,
        nodejs: process.version,
        mongodb: mongoose.version,
        timeIstanbul: Date(),
      }).save();
    } catch (err) {
      console.log(err);
    } finally {
      mongooose.connection.close();
    }
  });
});

client.commands = new Collection();
require("./handler")(client);
