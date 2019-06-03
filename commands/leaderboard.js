const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
var n = 0;
var y = 0;
exports.run = async (client, message, args) => {
    const choice = args[0]
    if (choice < 1) return message.channel.send("No seleccionastes una tabla de clasificación (opciones: cash, level, xp)")
    if (choice === "cash" || choice === "money") {
        sql.all(`SELECT username,userId,cash,bank FROM profiles WHERE guildId ="${message.guild.id}" ORDER BY cash DESC LIMIT 10`).then(rows => {
            if (!rows) return message.channel.send("Nadie ha ganado dinero.");
            var leaders = '';
            rows.forEach(function (row) {
            if (leaders.includes(`${row.username}`)) return;
               function increment(){
                    y+= 1;
                    return y;
                }
                leaders += `${increment()}: **${row.username}**, Dinero Total: **$${row.cash + row.bank}**\n`
            })
            message.channel.send({
                embed: {
                    title: "**`" + message.guild.name + "`**" + " tabla de líderes " + "**`" + y + "`**",
                    color: 3447003,
                    description: `${leaders}`
                }
            })
            y = 0;
        })
    } else if (choice ==="lvl" || choice ==="level" || choice === "levels" || choice === "xp") {
        sql.all(`SELECT username,userId,level,xp FROM profiles WHERE guildId ="${message.guild.id}" ORDER BY xp DESC LIMIT 10`).then(rows => {
            if (!rows) return message.channel.send("Nadie ha ganado experiencia.");
            var leaders = '';
            rows.forEach(function (row) {
            if (leaders.includes(`${row.username}`)) return;
               function increment(){
                    n+= 1;
                    return n;
                }
                leaders += `${increment()}: **${row.username}**, Nivel: **${row.level}** (XP: **${row.xp}**)\n`
            })
            message.channel.send({
                embed: {
                    title: "**`" + message.guild.name + "`**" + " Tabla de lideres " + "**`" + n + "`**",
                    color: 3447003,
                    description: `${leaders}`
                }
            })
            n = 0;
        })
    } else {
      message.channel.send("No seleccionó una tabla de clasificación válida (opciones: cash, level, xp)")
    }
}
   
