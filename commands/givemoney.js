const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
exports.run = (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("Necesitas el permiso `MANAGE_GUILD` Para usar este comando.")
    const user = message.mentions.users.first();
     if (message.mentions.users.size < 1) {
        const amount = parseInt(args[0]);
        if (amount < 1) return message.channel.send("No has proporcionado ningún dinero para dar.");
        sql.get(`SELECT * FROM profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(row2 => {
            if (!row2) message.channel.send("Necesitas comenzar a hablar primero.")
            const doingmath = row2.cash + row2.bank
               if (doingmath >= 9999999999999999999999) return message.channel.send("El dinero maximo es: $ 9999999999999999999999")
               if (amount >= 9999999999999999999999) return message.channel.send("El máximo dinero para dar es: $ 9999999999999999999999")
               if (isNaN(amount)) return message.channel.send("No es un número válido")
               sql.run(`UPDATE profiles SET cash = ${row2.cash += amount} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
               message.channel.send("Le he dado dinero a: " + message.author.username + " $" + amount);
        })
     } else {
     const amount = parseInt(args[1]);
     if (amount < 1) return message.channel.send("No has proporcionado ningún dinero para dar.");
    sql.get(`SELECT * FROM profiles WHERE guildId ="${message.guild.id}" AND userId ="${user.id}"`).then(row => {
     if (!row) message.channel.send("Necesitas comenzar a hablar primero.")
     const doingmath = row.cash + row.bank
        if (doingmath >= 9999999999999999999999) return message.channel.send("El dinero maximo es: $9999999999999999999999")
        if (amount >= 9999999999999999999999 ) return message.channel.send("El máximo dinero para dar es: $ 9999999999999999999999")
        if (isNaN(amount)) return message.channel.send("No es un número válido")
        sql.run(`UPDATE profiles SET cash = ${row.cash += amount} WHERE guildId ="${message.guild.id}" AND userId = ${user.id}`);
        message.channel.send("Le he dado dinero a: " + user.username + " $" + amount);
        })
    }
}
