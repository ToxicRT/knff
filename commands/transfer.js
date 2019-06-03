const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
exports.run = (client, message, args) => {
        const user = message.mentions.users.first();
        if (message.mentions.users.size < 1) return message.channel.send("Necesitas mencionar un usuario.")
        let transferamount = parseInt(args.slice(1).join(' '));
        let taxtransfer = (transferamount / 100) * 80;
        let taxtransferz = (transferamount / 100) * 20;
        if (transferamount <= 1) return message.channel.send("Especifica una cantidad valida `1+`");
        if (isNaN(transferamount)) return message.channel.send("Cantidad Invalida");
        if (user.id === message.author.id) return message.channel.send("No puedes transferirte dinero a ti mismo")
            sql.get(`SELECT * FROM profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(row => {
                    if (!row) return message.channel.nend("No tienes dinero, necesitas comenzar a hablar primero..")
                if (row.cash < transferamount) return message.channel.send("Usted no tiene suficiente dinero para transferir tanto, usted tiene: $" + row.cash);
                sql.run(`UPDATE profiles SET cash = ${row.cash -= transferamount} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                message.channel.send("He transferido exitosamente $" + transferamount + ", a " + user.username + " Nuevo saldo: $" + row.cash + ".")
            sql.get(`SELECT * FROM profiles WHERE guildId ="${message.guild.id}" AND userId ="${user.id}"`).then(row2 => {
                 if (!row2) return message.channel.nend("No tienes dinero, necesitas comenzar a hablar primero..")
                    sql.run(`UPDATE profiles SET cash = ${row2.cash += transferamount} WHERE guildId ="${message.guild.id}" AND userId = ${user.id}`);
            })
          })
}
