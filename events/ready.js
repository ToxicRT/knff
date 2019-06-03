const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");
const superagent = require("superagent")
module.exports = (client, guild, files) => {
        fs.readdir("./commands/", (err, files) => {
       const filez = files.length
       if (err) return console.error(err);
            console.log(`Cargado ${filez + 0} comandos satisfactoriamente!`)
        })
        console.log(`[LISTO] Inicie sesion como ${client.user.tag}! (${client.user.id})`);
        try {
		const activity = activities[Math.floor(Math.random() * activities.length)];
        client.user.setActivity(activity.text, { type: activity.type });

      } catch (err) {
        return;
      }
}