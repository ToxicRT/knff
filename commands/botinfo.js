const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
const fs = require("fs")
const version = "v11.5.0"
exports.run = (client, message, args) => {
      fs.readdir("./commands/", (err, files) => {
       const filez = files.length
       if (err) return console.error(err);
       sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row => {
       if (!row) return;
      const embed = new Discord.RichEmbed()
            .setAuthor(client.user.username, client.user.avatarURL)
            .setColor(0x00A2E8)
            .addField("Memoria", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}` + "MBS", true)
            .addField("Comandos:", `${filez + 0}`)
            .addField('Usuarios totales', `${client.users.size}`, true)
            .addField('Canales totales:', `${client.channels.size}`, true)
            .addField('Servidores totales', Math.ceil(client.guilds.size), true)
            .addField('Creado en', client.user.createdAt.toLocaleString())
            .addField('Libreria', `Discord.js ${version}`, true)
            .addField('Version Node.js', process.version, true)
            .addField('Version', "0.1.0.2", true)
            .addField('Cambios', "Se han presentado cambios y el cual he modificado con los de knf `Se agradece`")
            .setTimestamp()
            .setFooter(client.user.username, client.user.avatarURL);
      message.channel.send({embed}) 
            })
      })
 }
   
