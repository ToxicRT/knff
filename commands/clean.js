const Discord = require("discord.js");
const bot = new Discord.Client();
exports.run = (client, message, args) => {
      if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send("Necesitas el permiso `MANAGE_MESSAGES` para usar este comando.");
      let num = (!!args.slice(0).join(' ')) ? parseInt(args.slice(0).join(' ')) || 99 : 99;
      message.channel.fetchMessages({limit:num}).then(messages => {
      let ms = messages.filter(m => m.author.id === client.user.id);
      if (ms.size === 1) { ms.first().delete(); return message.channel.send("**Los mensajes de `KnightNoFansub[BOT]` han sido eliminados**") }
      if (ms.size < 1) return message.channel.send("**No se han encontrado mensajes para eliminar**")
      message.channel.bulkDelete(ms, true).then(() => message.channel.send("**Los mensajes de `KnightNoFansub[BOT]` han sido eliminados**"))
  })
}
   
