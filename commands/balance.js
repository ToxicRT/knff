const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
exports.run = (client, message, args) => {
      var user = message.mentions.users.first() || message.author;
  
    sql.get(`SELECT * FROM profiles WHERE guildId ="${message.guild.id}" AND userId ="${user.id}"`).then(row => {  
      
      if (!row) return message.channel.send("El usuario necesita hablar primero.")
      
      let bank = row.bank;
      let cash = row.cash;
      let rep = row.rep;
      
      if (bank === null) bank = 0;
      if (cash === null) cash = 0;
      if (rep === null) rep = 0;

       var embed = new Discord.RichEmbed()
       .setTitle('Saldo')
       .setDescription(`**${user.username}**\n  **:dollar: Saldo:\n$${row.cash}**\n:bank: **Banco**\n**$${row.bank}**\n:military_medal: **Reputacion:**\n**${rep}**`)
       .setColor('#ffffff')
       .setFooter('Pedido por: ' + message.author.tag, message.author.avatarURL)
       
       message.channel.send(embed)
    
    })
}
