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
            .setTitle("Comando: " + prefixtouse + "ban")
            .addField("Uso", prefixtouse + "ban @Someone <razon>")
            .addField("Ejemplo", prefixtouse + "ban @Someone Publicidad de otros servidores")
            .setDescription("Descripcion: " + "Banea un usuario en el servidor actual");

  if (message.member.hasPermission("BAN_MEMBERS")) {
  if (!message.guild.member(client.user).hasPermission('BAN_MEMBERS')) return message.reply('Lo siento, no tengo los permisos necesarios para este comando, necesito `BAN_MEMBERS`. :x:')
  if (message.mentions.users.size < 1) return message.channel.send(usage)
  let user = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args.slice(0).join(" "));
  if (user.highestRole.position >= message.member.highestRole.position) return message.reply('No puedo banear a ese miembro. Son del mismo nivel que tú o superior.. :x:');
  let reason = args.slice(1).join(' ') || `Moderador no dio una razon.`;
  let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
  if (!message.guild.member(user).bannable) return message.reply(' No puedo banear a ese miembro. Esto puede estar pasando porque están por encima de mí.. :x:');
  message.guild.ban(user, 2);
  message.channel.send("***El usuario ha sido baneado correctamente! :white_check_mark:***")
  sql.run(`UPDATE scores SET casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);

  const embed = new Discord.RichEmbed()
    .setColor(0x00A2E8)
    .setTitle("Caso #" + row.casenumber + " | Accion: Baneo")
    .addField("Moderador", message.author.tag + " (ID: " + message.author.id + ")")
    .addField("Usuario", user.user.tag + " (ID: " + user.user.id + ")")
    .addField("Razon", reason, true)
    .setFooter("Tiempo: " + message.createdAt.toDateString())
    if (!modlog) return;
    if (row.logsenabled === "disabled") return;
    client.channels.get(modlog.id).send({embed});
    }
  })
}
