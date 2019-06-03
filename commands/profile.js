const Discord = require("discord.js");
const bot = new Discord.Client();
const db = require('quick.db');
const desc = require('quick.db');
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
exports.run = async (client, message, args) => {
    sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row2 => {
        if (!row2) return;
        if (row2.levelsystem === "disabled") return message.channel.send("El sistema de niveles esta desactivado para este servidor.");
        if (message.mentions.users.size < 1) {
            sql.get(`SELECT * FROM profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(row => {
                
              /*  let curxp = row.xp;
                let curlvl = row.level;
                let nxtLVL = curlvl * 100;
                let dif = nxtLVL - curxp; */
                if (!row) {
                    message.channel.send("Necesitas hablar primero!")
					
                }

				              let bank = row.bank;
                      let cash = row.cash;
                      let rep = row.rep;
                      let level = row.level;
                      let xp = row.xp;
                      let awards = row.awards;
      
                      if (bank === null) bank = 0;
                      if (cash === null) cash = 0;
                      if (rep === null) rep = 0;
                      if (level === null) level = 1;
                      if (xp === null) xp = 0;
                      if (awards  === "None") awards = "Ninguno";
              
                  let desc = db.fetch(`desc_${message.guild.id}_${message.author.id}`); {
                     if (desc === null) desc = "Añade una descripcion";
                  }
              
                    const embed = new Discord.RichEmbed()
                        .setColor(0x00A2E8)
                        .setTitle(" Informacion del perfil para: " + message.author.username + " ")
                        .setThumbnail(message.author.avatarURL)
                        .addField("Tu Nivel Actual: ", level, true)
                        .addField("Total XP: ", xp + "XP", true)
                        .addField("Descripcion: ", "**" + desc + "**", true)
                        .addField(":bank: Banco: ", "$" + bank, true)
                        .addField(":dollar: Dinero: ", "$" + cash, true)
                        .addField(":military_medal: Reputacion:", rep, true)
                        .addField("Premios: ", row.awards, true)
                        .addField("Inventario: ", "Nada todavia", true)
              message.channel.send(embed)
                      })
        } else if (message.content.includes("<@" + client.user.id +">") || message.content.includes("<@!" + client.user.id +">")) {
			
               let curxp = row2.xp;
                let curlvl = row2.level
                let nxtLVL = curlvl * 200;
                let dif = nxtLVL - curxp;
                const embed = new Discord.RichEmbed()
                    .setColor(0x00A2E8)
                    .setTitle("Informacion del perfil para: " + client.user.username + " ", true)
                    .setThumbnail(client.user.avatarURL)
                    .addField("Nivel actual: ", "1000", true)
                    .addField("Total XP: ", "1395434567276XP", true)
                    .addField("Descripcion: ", "Sin descripcion", true)
                    .addField(":bank: Banco: ", "$" + "9324432", true)
                    .addField(":dollar: Dinero: ", "$" + "1657562386", true)
                    .addField(":military_medal: Reputacion:", "102", true)
                    .addField("Premios: ", ":tada: :medal: :military_medal: :trophy: :tools: :tophat: :spy::skin-tone-1: :moneybag: :first_place: :credit_card: :watch:", true)
                    .addField("Inventario: ", "Nada todavia", true)
                message.channel.send(embed)
        } else {
            let user = message.mentions.users.first();
            sql.get(`SELECT * FROM profiles WHERE guildId ="${message.guild.id}" AND userId ="${user.id}"`).then(row => {
				
            /*  let curxp = row.xp;
                let curlvl = row.level
                let nxtLVL = curlvl * 200;
                let dif = nxtLVL - curxp; */
				

      

              
                  let desc = db.fetch(`desc_${message.guild.id}_${message.author.id}`); {
                     if (desc === null) desc = "Añade una descripcion";
                  }
              
					
                if (!row) return message.channel.send("El usuario necesita hablar primero.")
                const embed = new Discord.RichEmbed()
                    .setColor(0x00A2E8)
                    .setTitle("Informacion del perfil para: " + user.username + " ")
                    .setThumbnail(user.avatarURL)
                    .addField("Nivel actual: ", row.level, true)
                    .addField("Total XP: ", row.xp + "XP", true)
                    .addField("Descripcion: ", desc, true)
                    .addField(":bank: Banco: ", "$" + row.bank, true)
                    .addField(":dollar: Dinero: ", "$" + row.cash, true)
                    .addField(":military_medal: Reputacion:", row.rep, true)
                    .addField("Premios: ", row.awards, true)
                    .addField("Inventario: ", "Nada todavia", true)
                message.channel.send(embed)
                      })
        }
    })
}