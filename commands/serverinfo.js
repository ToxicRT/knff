const Discord = require("discord.js");
const bot = new Discord.Client();
exports.run = (client, message, args) => {
   const role = message.guild.roles.size;
   const online = message.guild.members.filter(m => m.presence.status != 'offline').size
   const verificationLevels = ['None', 'Low', 'Medium', 'Insane', 'Extreme'];
      const embed = new Discord.RichEmbed()
     .setAuthor(message.guild.name, message.guild.iconURL)
     .setColor(0x00A2E8)
      .setDescription(`Owner: ${message.guild.owner.user.tag} (${message.guild.owner.id})`)
      .addField('Cantidad de miembros', `${message.guild.memberCount}`, true)
      .addField('Online', `${online}`, true)
      .addField('Region del servidor', message.guild.region)
      .addField('Creado en', message.guild.createdAt.toLocaleString(), true)
      .addField("Nivel de verificacion: ", `${verificationLevels[message.guild.verificationLevel]}`)
      .addField('Canales de voz' , `${message.guild.channels.filter(chan => chan.type === 'voice').size}`)
      .addField('Canales de texto' , `${message.guild.channels.filter(chan => chan.type === 'text').size}`, true)
      .addField('Roles', role, true)
      message.channel.send({embed}) 
}
   