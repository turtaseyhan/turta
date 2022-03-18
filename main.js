const { Intents, Client, MessageEmbed, Collection } = require("discord.js");
const Discord = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Handler } = require('discord-slash-command-handler')
const client = new Client( {
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const mongoose = require("mongoose");
const fs = require("fs");
const { ProfilingLevel } = require("mongodb");
const settings = require("./req/configDiscord.json");
client.login(settings.loginToken);
client.config = require("./req/configDiscord.json");
const getip = require("./essentials/getIP.js");
const mongo = require("./mongodb/mongo.js");
const os = require("os");


const superagent = require("superagent");

// Functions for the bot
const getIP = require("./essentials/getIP.js");
const state_schema = require("./mongodb/schemas/state_schema.js");

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
      { name: "OS", value: os.version(), inline: true },
      { name: "Ip Adress", value: await getIP('ipv4') || await getIP('ipv6') },
      { name: "CPU", value: `${os.cpus()[0].model} ${os.arch()}`, inline: true}
    );
  console.log(
    client.channels.cache.get("778745188482154506").send({ embeds: [embed] }),
  );
  await mongo().then(async (mongooose) => {
    try {
          await state_schema.findOneAndUpdate(
            { _id: "1" },
            {
              $set: {
                ipv4: await getIP('ipv4'),
                ipv6: await getIP('ipv6'),
                discordjs_version: Discord.version,
                nodejs: process.version,
                mongodb: mongoose.version,
                cpuArch: os.arch(),
                cpu: os.cpus()[0].model,
                os: os.version(),
                timeIstanbul: Date(),
              },
            },  // Update the document
          );
          // fetch data from mongo
          await state_schema.find({}).then(data => {
              console.log(data[0].ipv4);
            
          }).catch(err => console.log('An error succed :', err))
    } catch (err) {
      console.log(err);
    } finally {
      mongooose.connection.close();
    }
  });
});

client.on('messageCreate', message => {
  if(message.content == 'p!test') {
    message.reply('5.5.5.5')
  }
})

client.on('ready', () => {
  const handler = new Handler(client, {
    commandFolder: '/commands',
    commandType: 'file' || 'folder',
    eventFolder: '/events',
    mongoURI: settings.mongoPath,
    prefix: settings.prefix,
  })

  handler.on('slashCommand', (command,command_data) => {
    // handle the command
    // command is your normal command object,  for command_data go down below to data types
})
})








// Command Handler
const config = require("./req/configDiscord.json");

client.config = config;
client.commands = new Discord.Collection();

const events = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));
for (const file of events) {
  const eventName = file.split(".")[0];
  const event = require(`./events/${file}`);
  client.on(eventName, event.bind(null, client));
}

const commands = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commands) {
  const commandName = file.split(".")[0];
  const command = require(`./commands/${file}`);

  console.log(`Attempting to load command ${commandName}`);
  client.commands.set(commandName, command);
}
