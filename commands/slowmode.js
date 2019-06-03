const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
exports.run = (client, message, args) => {
     if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("necesitas el permiso `MANAGE_GUILD`");
     if (!message.guild.member(client.user).hasPermission('MANAGE_MESSAGES')) return message.reply('Lo siento, no tengo los permisos para hacer esto cmd necesito `MANAGE_MESSAGES`. :x:')
     sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row => {
         if (row.slowmode === "enabled") {
             sql.run(`UPDATE scores SET slowmode = "disabled", casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
             message.channel.send("Slow mode ha sido desactivado")
                  let modlog = message.guild.channels.find('name', row.logschannel);
                    const embed = new Discord.RichEmbed()
                    .setColor(0x00A2E8)
                    .setTitle("Caso #" + row.casenumber + " | Accion:  Slow Mode desactivado")
                    .addField("Moderador", message.author.tag + " (ID: " + message.author.id + ")")
                    .setFooter("Time used: " + message.createdAt.toDateString())
                    if (!modlog) return;
                    if (row.logsenabled === "disabled") return;
                    return client.channels.get(modlog.id).send({embed});
                } else {
                    const timetoset = parseInt(args[0])
                    const prefixtouse = row.prefix
                    const usage = new Discord.RichEmbed()
                        .setColor(0x00A2E8)
                        .setThumbnail(client.user.avatarURL)
                        .setTitle("Commando: " + prefixtouse + "slowmode")
                        .addField("Uso", prefixtouse + "slowmode <segundos>")
                        .addField("Ejemplo", prefixtouse + "slowmode 5")
                        .setDescription("Descripcion: " + "Activa el Slow mode en el servidor actual y los usuarios sólo pueden enviar mensajes cada x segundos.");

                    if (isNaN(timetoset)) return message.channel.send(usage)
                    if (timetoset.length < 1) return message.channel.send(usage)
                    sql.run(`UPDATE scores SET slowmode = "enabled", slowmodetime = ${timetoset}, casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
                     message.channel.send("El modo lento se ha habilitado con el tiempo de " + timetoset + " segundos")
                      let modlog = message.guild.channels.find('name', row.logschannel);
                    const embed = new Discord.RichEmbed()
                    .setColor(0x00A2E8)
                    .setTitle("Caso #" + row.casenumber + " | Acción:  Slow Mode Activado")
                    .addField("Moderador", message.author.tag + " (ID: " + message.author.id + ")")
                    .addField("Tiempo", timetoset, true)
                    .setFooter("Time used: " + message.createdAt.toDateString())
                    if (!modlog) return;
                    if (row.logsenabled === "disabled") return;
                    return client.channels.get(modlog.id).send({embed});

         }
    })
}