const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
exports.run = (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("Necesitas el permiso `MANAGE_GUILD`");
    if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES')) return message.reply('Lo siento, no tengo los permisos para hacer este cmd necesito `MANAGE_ROLES`. :x:')
  sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row => {
    const prefixtouse = row.prefix
    const embed10 = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .setThumbnail(client.user.avatarURL)
            .setTitle("Commando: " + prefixtouse + "autorole")
            .addField("Uso", prefixtouse + "autorole [enable/disable] [role name]")
            .addField("Ejemplo", prefixtouse + "autorole enable Members")
            .setDescription("Descripcion: " + "Habilita/deshabilita el rol automático en join.");

      const optiontopick = args[0]
      if (optiontopick === "enable") {
            let roletogive = args.slice(1).join(" ")
            const roletogivefix = roletogive.replace(/[^\x00-\x7F]/g, "");
                    const prefixtouse = row.prefix
        if (roletogive.length < 1) return message.channel.send(usage)

        sql.run(`UPDATE scores SET autoroleenabled = "enabled", roletogive = "${roletogivefix}", casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
        message.channel.send("Los miembros ahora obtendrán el rol `" + roletogivefix + "` cuando se unan al servidor de ahora en adelante.")

        let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
        const embed = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .setTitle("Caso #" + row.casenumber + " | Action:  Auto Rol Activado")
            .addField("Moderador", message.author.tag + " (ID: " + message.author.id + ")")
            .addField("Rol a dar", roletogivefix, true)
            .setFooter("Time used: " + message.createdAt.toDateString())

        if (!modlog) return;
        if (row.logsenabled === "disabled") return;
        return client.channels.get(modlog.id).send({embed});
  } else if (optiontopick === "disable") {
        sql.run(`UPDATE scores SET autoroleenabled = "disabled", casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
    message.channel.send("He desactivado la función de auto rol para este servidor.")

    let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
    const embed = new Discord.RichEmbed()
        .setColor(0x00A2E8)
        .setTitle("Caso #" + row.casenumber + " | Acción:  Auto Rol Desactivado")
        .addField("Moderador", message.author.tag + " (ID: " + message.author.id + ")")
        .setFooter("Time used: " + message.createdAt.toDateString())
    if (!modlog) return;
    if (row.logsenabled === "disabled") return;
    return client.channels.get(modlog.id).send({embed});
        } else {
            message.channel.send(embed10)
        }
    })
}
