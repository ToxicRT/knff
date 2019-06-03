const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
exports.run = (client, message, args) => {
  sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row => {
  const prefixtouse = row.prefix
  const usage = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .setThumbnail(client.user.avatarURL)
            .setTitle("Comando: " + prefixtouse + "unban")
            .addField("Uso", prefixtouse + "unban <ID> <reason>")
            .addField("Ejemplo", prefixtouse + "unban 130515926117253122 asked for a second chance.")
            .setDescription("Descripcion: " + "Desbanea un usuario del servidor actual");

      if (message.member.hasPermission("BAN_MEMBERS")) {
     if (!message.guild.member(client.user).hasPermission('BAN_MEMBERS')) return message.reply('Lo siento, no tengo los permisos para hacer este cmd que necesito `BAN_MEMBERS`. :x:')
     let user = args[0]
     if (isNaN(user)) return message.channel.send(usage)
     let reason = args.slice(1).join(' ') || `Moderator didn't give a reason.`;
     let modlog = message.guild.channels.find('name', row.logschannel);
     if (reason.length < 1) return message.channel.send(usage)
     if (!user) return message.channel.send(usage)
     if (user === message.author.id) return message.channel.send(`:x: Pues no, no te puedes desbanear`);
	   if (message.guild.members.get(user)) return message.channel.send(`:x: Ese usuario no está baneado en el servidor
`);
     message.guild.unban(user, 2);
     sql.run(`UPDATE scores SET casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
     const embed = new Discord.RichEmbed()
    .setColor(0x00A2E8)
    .setTitle("Caso #" + row.casenumber + " | Accion: Unban")
    .addField("Moderador", message.author.tag + " (ID: " + message.author.id + ")")
    .addField("ID:", user)
    .addField("Razon", reason, true)
    .setFooter("Time used: " + message.createdAt.toDateString())
     message.channel.send("El usuario ha sido desbaneado del servidor")
     if (!modlog) return;
     if (row.logsenabled === "disabled") return;
     client.channels.get(modlog.id).send({embed})
       }
    })
}