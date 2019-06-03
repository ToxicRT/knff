const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
exports.run = (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("Necesitas el permiso `MANAGE_GUILD`");
    sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row => {
        if (row.modonlycommands === "disabled") {
            sql.run(`UPDATE scores SET modonlycommands = "enabled", casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
            message.channel.send("Ahora sólo los mods/mods+ pueden usar los comandos bot.")
            let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
            const embed = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .setTitle("Caso #" + row.casenumber + " | Accion: Mod-Only Cmds Habilitado")
                .addField("Moderador", message.author.tag + " (ID: " + message.author.id + ")")
                .setFooter("Time used: " + message.createdAt.toDateString())
            if (!modlog) return;
            if (row.logsenabled === "disabled") return;
            return client.channels.get(modlog.id).send({embed});
        } else {
            sql.run(`UPDATE scores SET modonlycommands = "disabled", casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
            message.channel.send("Ahora cualquiera puede usar los comandos del bot.")
            let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
            const embed = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .setTitle("Caso #" + row.casenumber + " | Accion: Mod-Only Cmds Deshabilitdo")
                .addField("Moderador", message.author.tag + " (ID: " + message.author.id + ")")
                .setFooter("Time used: " + message.createdAt.toDateString())
            if (!modlog) return;
            if (row.logsenabled === "disabled") return;
            return client.channels.get(modlog.id).send({embed});
        }
    })
}
