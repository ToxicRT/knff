const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
exports.run = (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("Necesitas el permiso `MANAGE_ROLES`")
    sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row => {
        var userz = message.guild.members.array();
        const roletogive = args.join(" ")
        let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
        let subscriberRole = client.guilds.get(message.guild.id).roles.find(r => r.name == roletogive);
        if (!subscriberRole) return message.channel.send("No puedo encontrar el rol " + roletogive + " :x:");

        if (row.logsenabled === 'disabled') {
            try {
                userz.forEach(u => {
                    u.removeRole(subscriberRole)
                })
                message.channel.send("He tomando el rol " + roletogive + " de todos los miembros.")
               return client.channels.get(modlog.id).send({embed});
            } catch (err) {
                return;
            }
        } else {
    sql.run(`UPDATE scores SET logsenabled = "disabled" WHERE guildId = ${message.guild.id}`);
    try {
        userz.forEach(u => {
            u.removeRole(subscriberRole)
        })
        message.channel.send("He tomando el rol " + roletogive + " de todos los miembros.")
        const embed = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .setTitle("Caso #" + row.casenumber + " | Acción: Remover el rol de todos los miembros")
            .addField("Moderador", message.author.tag + " (ID: " + message.author.id + ")")
            .addField("Rol Tomado:", roletogive)
            .setFooter("Time used: " + message.createdAt.toDateString())
   if (!modlog) return;
   sql.run(`UPDATE scores SET logsenabled = "enabled", casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
     return client.channels.get(modlog.id).send({embed});
    } catch (err) {
        return;
    }
}
    })
}
