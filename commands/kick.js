const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
exports.run = (client, message, args) => {
  sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row => {
  sql.run(`UPDATE scores SET casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
  const prefixtouse = row.prefix
  const usage = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .setThumbnail(client.user.avatarURL)
            .setTitle("Comando: " + prefixtouse + "kick")
            .addField("Uso", prefixtouse + "kick @Someone <razon>")
            .addField("Ejemplo", prefixtouse + "kick @Someone Publicidad")
            .setDescription("Descripcion: " + "Kickea a un usuario en el servidor actual");

  if (message.member.hasPermission("KICK_MEMBERS")) {
  if (!message.guild.member(client.user).hasPermission('KICK_MEMBERS')) return message.reply('Lo siento, no tengo los permisos necesarios para este comando, necesito `KICK_MEMBERS`. :x:')
    let reason = args.slice(1).join(' ') || `Moderador no dio una razon.`;
    if (message.mentions.users.size < 1) return message.channel.send(usage);
    let user = message.guild.member(message.mentions.users.first());
  if (user.highestRole.position >= message.member.highestRole.position) return message.reply('No puedo banear a ese miembro. Esto puede estar pasando porque están por encima de mí..  :x:');
  let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
  message.channel.send("***El usuario ha sido kickeado correctamente! :white_check_mark:***")
  if (!message.guild.member(user).kickable) return message.reply('No pudo kickear a ese miembro :x:');
  message.guild.member(user).kick(); 
  const embed = new Discord.RichEmbed()
    .setColor(0x00A2E8)
    .setTitle("Caso #" + row.casenumber + " | Accion: Kick")
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
   
