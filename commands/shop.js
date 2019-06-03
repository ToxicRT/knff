const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
const fs = require("fs")
exports.run = (client, message, args) => {
      fs.readdir("./commands/", (err, files) => {
       const filez = files.length
       if (err) return console.error(err);
       sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row => {
       if (!row) return;
      const embed = new Discord.RichEmbed()
            .setAuthor(client.user.username, client.user.avatarURL)
            .setColor(0x00A2E8)
            .addField('Tienda', "Podras comprar objetos para el bot")
            .addField('Dignidad', 'Precio: `1e+2 Muy cara porque no es facil de conseguir :v`')
            .setTimestamp()
            .setFooter(client.user.username, client.user.avatarURL);
      message.channel.send({embed}) 
            })
      })
 }
   