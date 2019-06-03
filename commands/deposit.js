const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
exports.run = (client, message, args) => {
        let transferamount = parseInt(args[0]);
        if (transferamount <= 1) return message.channel.send("No puedes depositar nada por debajo de 1");
        if (isNaN(transferamount)) return message.channel.send("No es un número válido para depositar");
            sql.get(`SELECT * FROM profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(row => {
                if (!row) return message.channel.nend("No tiene dinero en efectivo para depositar, necesita comenzar a hablar primero.")
                if (row.cash < transferamount) return message.channel.send("No tienes suficiente dinero para depositar tanto, tienes: $" + row.cash);
                sql.run(`UPDATE profiles SET cash = ${row.cash -= transferamount} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                sql.run(`UPDATE profiles SET bank = ${row.bank += transferamount} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
                message.channel.send("He depositado exitosamente $" + transferamount + ", a tu banco, nuevo saldo: $" + row.cash + ".")
            })
}
