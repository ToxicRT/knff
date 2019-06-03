const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
exports.run = (client, message, args) => {
        const user = message.mentions.users.first();
        if (message.mentions.users.size < 1) return message.channel.send("Necesitas mencionar un usuario para robarlo.")
        if (user.id === message.author.id) return message.channel.send("No te puedes robar a ti mismo")
            sql.get(`SELECT * FROM profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(row => {
                sql.get(`SELECT * FROM profiles WHERE guildId ="${message.guild.id}" AND userId ="${user.id}"`).then(row2 => {
                if (!row) return message.channel.nend("No tienes dinero empieza hablando primero.")
                if (!row2) return message.channel.nend("El usuario necesita dinero, para ganar algo antes de que puedas robarlo.")
                if (row2.cash < 0) return message.channel.send("El usuario no tiene dinero para robarlo.")
                var dice = Math.floor(Math.random() * 15000 + 1);
                var dice2 = Math.floor(Math.random() * row2.cash);
                var dice3 = Math.floor(Math.random() * 2500 + 1);
                if (dice >= "75") {
                    sql.run(`UPDATE profiles SET cash = ${row.cash += dice2} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                    sql.run(`UPDATE profiles SET cash = ${row2.cash -= dice2} WHERE guildId ="${message.guild.id}" AND userId = ${user.id}`);
                    message.channel.send("Has robado con éxito $" + dice2 + ", de " + user.username + ", New balance: $" + row.cash + ".")
                } else {
                    sql.run(`UPDATE profiles SET cash = ${row.cash -= dice3} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                    message.channel.send("Te sorprendieron tratando de robar "+ user.username +", y pagó una multa de: $ "+ dice3 +", Nuevo saldo: $ " + row.cash + ".")
                }
            })
          })
}
