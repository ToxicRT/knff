const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
let chrono = require("chrono-node");
var moment = require('moment');
const superagent = require("superagent");
exports.run = async (client, message, args) => {
  sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row => {
  sql.run(`UPDATE scores SET casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
  const prefixtouse = row.prefix
  const usage = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .setThumbnail(client.user.avatarURL)
            .setTitle("Comando: " + prefixtouse + "mute")
            .addField("Uso", prefixtouse + "mute @Someone <minutes> <reason>")
            .addField("Ejemplo", prefixtouse + "mute @Someone 5 spameo en general.")
            .setDescription("Descripcion: " + "Le da al usuario el rol Muted durante x minutos");

  if (message.member.hasPermission("KICK_MEMBERS")) {
  if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES')) return message.reply('Lo sentimos, no tengo los permisos para hacer este cmd. Necesito `MANAGE_USERS`. :x:')
  if (message.mentions.users.size < 1) return message.channel.send(usage)
  let user = message.guild.member(message.mentions.users.first());
  if (user.highestRole.position >= message.member.highestRole.position) return message.reply('No puedo silenciar a ese miembro. Son del mismo nivel que tú o superior.. :x:');
  let messagez = parseInt(args[1])
  if (isNaN(messagez)) return message.channel.send("Ese no es un tiempo válido.")
  if (messagez > 1440) return message.channel.send('El tiempo máximo es de 1 día (1440 minutos)');
  if (messagez < 1) return message.channel.send('El tiempo debe ser de al menos 1 minuto..');
  let reason = args.slice(2).join(' ') || `Moderador no dio una razon.`;
  let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
  if (reason.length < 1) return;
  let muteRole = client.guilds.get(message.guild.id).roles.find(r => r.name == 'Muted') || client.guilds.get(message.guild.id).roles.find('name', 'muted');
  if (!muteRole) return message.channel.send(" No puedo encontrar el rol `Muted`. :x:");

  const embed = new Discord.RichEmbed()
    .setColor(0x00A2E8)
    .setTitle("Caso #" + row.casenumber + " | Accion: Mute")
    .addField("Moderador", message.author.tag + " (ID: " + message.author.id + ")")
    .addField("Usuario", user.user.tag + " (ID: " + user.user.id + ")")
    .addField("Tiempo", messagez, true)
    .addField("Razon", reason, true)
    .setFooter("Time used: " + message.createdAt.toDateString())

    message.guild.member(user).addRole(muteRole).then(() => {
      message.channel.send("***El usuario ha sido silenciado exitosamente por " + messagez + " m(s) :white_check_mark:***")

  if (!modlog) {
     setTimeout(() => {
     message.guild.member(user).removeRole(muteRole)
     message.channel.send(user.user.username + ' ahora ha sido Desmuteado después de ' + messagez +' minuto(s)')
     }, messagez * 60000);
    } else if (row.logsenabled === "disabled") {
     setTimeout(() => {
     message.guild.member(user).removeRole(muteRole)
    message.channel.send(user.user.username + ' ahora ha sido Desmuteado después de ' + messagez +' minuto(s)')
     }, messagez * 60000);
    } else {
     client.channels.get(modlog.id).send({embed})
     setTimeout(() => {
     message.guild.member(user).removeRole(muteRole)
    message.channel.send(user.user.username + ' ahora ha sido Desmuteado después de ' + messagez +' minuto(s)')
     }, messagez * 60000);
    }
  })
}
})
}
   
