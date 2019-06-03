const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
exports.run = (client, message, args) => {
if (message.member.hasPermission("KICK_MEMBERS")) {
  try {
    if (!message.guild.member(client.user).hasPermission('KICK_MEMBERS')) return message.reply('Lo siento, no tengo los permisos para hacer este cmd necesito `KICK_MEMBERS`. :x:')
    let reason = args.slice(1).join(' ');
    if (message.mentions.users.size < 1) return message.channel.send(`Necesita etiquetar a un usuario para ver sus advertencias`)
    let user = message.mentions.users.first();
    sql.get(`SELECT * FROM warnings WHERE guildId = "${message.guild.id}" AND userId = "${user.id}"`).then(row => {
      if (!row) return message.channel.send(`**${user.username}**` + " tiene " + `0` + " advertencia(s)")
    if (row.userwarnings === 0) {
      message.channel.send(`**${user.username}**` + " tiene " + row.userwarnings + " advertencia(s).")
    } else {
      sql.run(`DELETE FROM warnings WHERE guildId = "${message.guild.id}" AND userId = "${user.id}"`)
      message.channel.send(`**${user.username}**` + " " + `${row.userwarnings - 1}` + " advertencia(s) han sido removidos.")
    }
  })
  } catch (err) {
    message.channel.send("Un error ocurrió oops, más detalles: " + err + " informe de esto a los desarrolladores..")
  }
}
}
   
