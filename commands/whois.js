const Discord = require("discord.js");
const bot = new Discord.Client();
exports.run = (client, message, args) => {
  let embed2 = new Discord.RichEmbed()
  .setColor(0x00A2E8)
  .setThumbnail(message.author.avatarURL)
  .addField("Nombre de usuario ", `${message.author.tag} (ID: ${message.author.id})`, true)
  .addField("Estado", message.member.presence !== null && message.member.presence.status !== null ? message.member.presence.status : "Offline")
  .addField("Jugando ", `${message.author.presence.game === null ? "None" :  message.author.presence.game.name}`, true)
  .addField("Apodo ", `${message.member.displayName}`, true)
  .addField("Role(s) ", "Usa `URoles` Para ver los roles del usuario")
  .addField("Rol más alto ", message.member.highestRole.name)
  .addField("Tiempo en el servidor ", `${message.member.joinedAt.toDateString()}`)
  .addField("Tiempo en discord ", `${message.author.createdAt.toDateString()}`)
  .setTimestamp()
  .setFooter(message.author.username, message.author.avatarURL);
if (message.mentions.users.size < 1) return message.channel.send(embed2);
  
let member = message.mentions.members.first();
let embed = new Discord.RichEmbed()
  .setColor(0x00A2E8)
  .setThumbnail(member.user.avatarURL)
  .addField("Nombre de usuario ", `${member.user.tag} (ID: ${member.id})`, true)
  .addField("Estado", member.presence !== null && member.presence.status !== null ? member.presence.status : "Offline")
  .addField("Jugando ", `${member.user.presence.game === null ? "Nothing" :  member.user.presence.game.name}`, true)
  .addField("Apodo ", `${member.nickname === null ? "None" : member.nickname}`, true)
  .addField("Role(s) ", "Usa `URoles` Para ver los roles del usuario") 
  .addField("Rol más alto ", member.highestRole.name)
  .addField("Tiempo en el servidor ", `${member.joinedAt.toDateString()}`)
  .addField("Tiempo en discord ", `${member.user.createdAt.toDateString()}`)
  .setTimestamp()
  .setFooter(member.user.username, member.user.avatarURL);
  message.channel.send({embed})
}
