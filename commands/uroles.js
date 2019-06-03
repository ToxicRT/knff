const Discord = require("discord.js");
const bot = new Discord.Client();
exports.run = (client, message, args) => {
  let embed2 = new Discord.RichEmbed()
  .setColor(0x00A2E8)
  .setThumbnail(message.author.avatarURL)
  .addField("Role(s) ", `${message.member.roles.map(r => r.name).join(", ")}`)
  .setTimestamp()
  .setFooter(message.author.username, message.author.avatarURL);
if (message.mentions.users.size < 1) return message.channel.send(embed2);
  
let member = message.mentions.members.first();
let embed = new Discord.RichEmbed()
  .setColor(0x00A2E8)
  .setThumbnail(member.user.avatarURL)
  .addField("Role(s) ", `${message.member.roles.map(r => r.name).join(", ")}`) 
  .setTimestamp()
  .setFooter(member.user.username, member.user.avatarURL);
  message.channel.send({embed})
}
