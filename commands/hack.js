const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
const talkedRecently = new Set();
exports.run = (client, message, args) => {
    if (talkedRecently.has(message.author.id)) return message.channel.send("Ya has hackeado en los últimos 15 minutos por favor espera.")
            sql.get(`SELECT * FROM profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(row => {
                if (!row) return;
                var dice = Math.floor(Math.random() * 10000 + 1);
                var dice2 = Math.floor(Math.random() * 3);
                var dice3 = Math.floor(Math.random() * 400 + 1);
                var possiblethingstohack = ["**El Banco**", "Mr. Robot", "Un servidor", "El casino", "El computador deken's"];
                if (dice2 >= 2) {
                    message.channel.send("Fuiste atrapado tratando de hackear " + possiblethingstohack[Math.floor(Math.random () * possiblethingstohack.length)] + "y pagastes una multa de: $" + dice3)
                    sql.run(`UPDATE profiles SET cash = ${row.cash -= dice3} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                } else {
                    sql.run(`UPDATE profiles SET cash = ${row.cash += dice} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                    message.channel.send("Se ha hackeado " + possiblethingstohack[Math.floor(Math.random () * possiblethingstohack.length)] + " y conseguistes $" + dice + " Desde allí, puedes hackear de nuevo en 15 minutos.")
                    talkedRecently.add(message.author.id);
                    setTimeout(() => {
                        talkedRecently.delete(message.author.id);
                    }, 15 * 60000);
                }
          })
}
