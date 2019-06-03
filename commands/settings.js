const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
exports.run = (client, message, args) => {
    sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row => {
    const embed = new Discord.RichEmbed()
        .setColor(0x00A2E8)
        .setTitle("Ajuster del servidor")
        .addField("General", `Prefix: ${row.prefix}`)
        .addField("Mensajes", `Mensaje de Bienvenida: ${row.welcomemessage} \nMensaje de ida: ${row.leavemessage}`)
        .addField("Canales", `Canal de Ida/Bienvenida: ${row.wlchannel} \nCanal de logs: ${row.logschannel}`)
        .addField("Moderacion", `Anti-invitacion: ${row.invitelinkprotection} \nAnti website link: ${row.websitelinkprotection} \nAnti dup characters: ${row.dupcharactersprotection} \nSlowmode: ${row.slowmode} \nMod only commands: ${row.modonlycommands}`)
        .addField("Misc", `Anti join: ${row.antijoin} \nAutorole: ${row.autoroleenabled}\nProfile/Level/Cash system: ${row.levelsystem}`);
      message.channel.send(embed)
    })
}