const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
exports.run = async (client, message, args) => {
    sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row => {
        const prefixtouse = row.prefix
        const usage = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .setThumbnail(client.user.avatarURL)
            .setTitle("Commando: " + prefixtouse + "warn")
            .addField("Uso", prefixtouse + "warn @Someone <razon>")
            .addField("Ejemplo", prefixtouse + "warn @Someone para enlaces de anuncios a otros discords")
            .setDescription("Descripcion: " + "warnear a un usuario del servidor actual");

        if (!message.member.hasPermission("KICK_MEMBERS")) return;
        if (!message.guild.member(client.user).hasPermission('KICK_MEMBERS')) return message.reply('Lo siento, no tengo los permisos para hacer esto cmd necesito `KICK_MEMBERS.` :x:')
        let reason = args.slice(1).join(' ');
        if (reason.length < 1) return message.channel.send(usage)
        if (reason.length > 70) return message.channel.send(`Las razones no pueden ser más de 70 caracteres`)
        let user2 = message.mentions.users.first();
        sql.get(`SELECT * FROM warnings WHERE guildId ="${message.guild.id}" AND userId ="${user2.id}"`).then(row => {
            if (!row) {
                sql.run("INSERT INTO warnings (guildId, userId, userwarnings, reasons) VALUES (?, ?, ?, ?)", [message.guild.id, user2.id, 2, `1. ${reason} by: ${message.author.tag}`]);
            }
        }).catch(() => {
            sql.run("CREATE TABLE IF NOT EXISTS warnings (guildId TEXT, userId TEXT, userwarnings INTEGER, reasons TEXT)").then(() => {
                sql.run("INSERT INTO warnings (guildId, userId, userwarnings, reasons) VALUES (?, ?, ?, ?)", [message.guild.id, user2.id, 2, `1. ${reason} by: ${message.author.tag}`]);
            })
        })
    if (message.mentions.users.size < 1) return message.channel.send(usage)
    let user = message.guild.member(message.mentions.users.first())
    if (user.highestRole.position >= message.member.highestRole.position) return message.reply('No puedo advertir a ese miembro. Tienen el mismo nivel que usted o superior. :x:')
    let user3 = message.mentions.users.first();
    let reason2 = args.slice(1).join(' ');
    message.channel.send("***" + user3.username + " ha sido advertido con éxito! :white_check_mark:***")
    user3.send("Has recibido una advertencia de: " + message.author.username + " por: " + reason2)
    sql.get(`SELECT * FROM warnings WHERE guildId ="${message.guild.id}" AND userId ="${user3.id}"`).then(row => {
        if (row.userwarnings >= 99) return message.channel.send("Has alcanzado el máximo de advertencias posibles para este usuario, por favor usa `k!clearwarns @Alguien` para eliminar sus advertencias.")
        sql.run(`UPDATE warnings SET userwarnings = ${row.userwarnings + 1}, reasons = "${row.reasons} \n${row.userwarnings}. ${reason2} by: ${message.author.tag}" WHERE guildId = ${message.guild.id} AND userId = ${user3.id}`);
    })
    sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row => {
        sql.run(`UPDATE scores SET casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
        let modlog = message.guild.channels.find(channel => channel.name == row.logschannel)
        let reason3 = args.slice(1).join(' ');
        const embed = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .setTitle("Caso #" + row.casenumber + " | Accion: Warn")
            .addField("Moderador", message.author.tag + " (ID: " + message.author.id + ")")
            .addField("Usuario", user3.tag + " (ID: " + user3.id + ")")
            .addField("Razon", reason3, true)
            .setFooter("Tiempo usado: " + message.createdAt.toDateString())
        if (!modlog) return;
        if (row.logsenabled === "disabled") return;
        client.channels.get(modlog.id).send({embed});
    })
    })
}
