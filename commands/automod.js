const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
exports.run = (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("You're missing MANAGE_GUILD permission");
    if (!message.guild.member(client.user).hasPermission('MANAGE_MESSAGES')) return message.reply('Sorry, i dont have the perms to do this cmd i need MANAGE_MESSAGES. :x:')
    sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row => {
        const prefixtouse = row.prefix
        const embed10 = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .setThumbnail(client.user.avatarURL)
                .setTitle("Commando: " + prefixtouse + "automod")
                .addField("Uso", prefixtouse + "automod [enable/disable] [antiinvite/antiweblink/antidupcharacters]")
                .addField("Ejemplo", prefixtouse + "automod enable antiinvite")
                .setDescription("Descripcion: " + "Habilita/deshabilita la moderación automática de los bots.");

        const toenable = args[0]
        const thingtoenable = args.slice(1).join(` `);
        if (toenable < 1) return message.channel.send(embed10)
        if (thingtoenable < 1) return message.channel.send(embed10)

                if (toenable === "enable" && thingtoenable === "antiinvite") {
                       sql.run(`UPDATE scores SET automoderation = "enabled", invitelinkprotection = "enabled", casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
                       message.channel.send("Se ha habilitado la moderación automática con antiinvitación para este gremio..")
                       let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
                       const embed = new Discord.RichEmbed()
                           .setColor(0x00A2E8)
                           .setTitle("Caso #" + row.casenumber + " | Action:  Auto Mod Habilitado")
                           .addField("Moderador", message.author.tag + " (ID: " + message.author.id + ")")
                           .addField("Herramienta Auto Mod", "Anti Invitación")
                           .setFooter("Time used: " + message.createdAt.toDateString())
                           if (!modlog) return;
                           if (row.logsenabled === "disabled") return;
                           client.channels.get(modlog.id).send({embed});
                } else if (toenable === "enable" && thingtoenable === "antiweblink") {
                       sql.run(`UPDATE scores SET automoderation = "enabled", websitelinkprotection = "enabled", casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
                       message.channel.send("Se ha habilitado la moderación automática con enlace anti sitio web para este servidor.")
                       let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
                       const embed = new Discord.RichEmbed()
                           .setColor(0x00A2E8)
                           .setTitle("Caso #" + row.casenumber + " | Accion:  Auto Mod Activado")
                           .addField("Moderador", message.author.tag + " (ID: " + message.author.id + ")")
                           .addField("Herramienta Auto Mod", "Anti Website Link")
                           .setFooter("Time used: " + message.createdAt.toDateString())
                           if (!modlog) return;
                           if (row.logsenabled === "disabled") return;
                           client.channels.get(modlog.id).send({embed});
                } else if (toenable === "enable" && thingtoenable === "antidupcharacters") {
                       sql.run(`UPDATE scores SET automoderation = "enabled", dupcharactersprotection = "enabled", casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
                       message.channel.send("Se ha habilitado la moderación automática con caracteres anti duplicados para este servidor..")
                       let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
                       const embed = new Discord.RichEmbed()
                           .setColor(0x00A2E8)
                           .setTitle("Caso #" + row.casenumber + " | Action:  Auto Mod Activado")
                           .addField("Moderador", message.author.tag + " (ID: " + message.author.id + ")")
                           .addField("Herramienta Auto Mod", "Anti Duplicate Characters")
                           .setFooter("Time used: " + message.createdAt.toDateString())
                           if (!modlog) return;
                           if (row.logsenabled === "disabled") return;
                           client.channels.get(modlog.id).send({embed});
                } else if (toenable === "enable" && thingtoenable === "all") {
                       sql.run(`UPDATE scores SET automoderation = "enabled", invitelinkprotection = "enabled", websitelinkprotection = "enabled", dupcharactersprotection = "enabled", casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
                       message.channel.send("Se ha habilitado la moderación automática con todas las herramientas para este gremio..")
                       let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
                       const embed = new Discord.RichEmbed()
                           .setColor(0x00A2E8)
                           .setTitle("Caso #" + row.casenumber + " | Action:  Auto Mod Activado")
                           .addField("Moderador", message.author.tag + " (ID: " + message.author.id + ")")
                           .addField("Herramienta Auto Mod", "Todo")
                           .setFooter("Time used: " + message.createdAt.toDateString())
                           if (!modlog) return;
                           if (row.logsenabled === "disabled") return;
                           client.channels.get(modlog.id).send({embed});
                } else if (toenable === "disable" && thingtoenable === "antiinvite") {
                   sql.run(`UPDATE scores SET automoderation = "enabled", invitelinkprotection = "disabled", casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
                   message.channel.send("Anti-invitación ha sido desactivada para este servidor.")      
                   let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
                   const embed = new Discord.RichEmbed()
                       .setColor(0x00A2E8)
                       .setTitle("Caso #" + row.casenumber + " | Acción:  Auto Mod Desactivado")
                       .addField("Moderador", message.author.tag + " (ID: " + message.author.id + ")")
                       .addField("Herramienta Auto Mod", "Anti Invite")
                       .setFooter("Time used: " + message.createdAt.toDateString())
                   if (!modlog) return;
                   if (row.logsenabled === "disabled") return;
                   client.channels.get(modlog.id).send({embed});
                } else if (toenable === "disable" && thingtoenable === "antiweblink") {
                   sql.run(`UPDATE scores SET automoderation = "enabled", websitelinkprotection = "disabled", casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
                   message.channel.send("Anit website link has been disabled for this guild.")                   
                   let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
                   const embed = new Discord.RichEmbed()
                       .setColor(0x00A2E8)
                       .setTitle("Case #" + row.casenumber + " | Action:  Auto Mod Disabled")
                       .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                       .addField("Auto Mod Tool", "Anti Website link")
                       .setFooter("Time used: " + message.createdAt.toDateString())
                   if (!modlog) return;
                   if (row.logsenabled === "disabled") return;
                   client.channels.get(modlog.id).send({embed});
                } else if (toenable === "disable" && thingtoenable === "antidupcharacters") {
                   sql.run(`UPDATE scores SET automoderation = "enabled", dupcharactersprotection = "disabled", casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
                   message.channel.send("Anit duplicate characters has been disabled for this guild.")
                   let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
                   const embed = new Discord.RichEmbed()
                       .setColor(0x00A2E8)
                       .setTitle("Case #" + row.casenumber + " | Action:  Auto Mod Disabled")
                       .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                       .addField("Auto Mod Tool", "Anti Website link")
                       .setFooter("Time used: " + message.createdAt.toDateString())
                   if (!modlog) return;
                   if (row.logsenabled === "disabled") return;
                   client.channels.get(modlog.id).send({embed});
                } else if (toenable === "disable" && thingtoenable === "all") {
                   sql.run(`UPDATE scores SET automoderation = "disabled", invitelinkprotection = "disabled", websitelinkprotection = "disabled", dupcharactersprotection = "disabled", casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
                   message.channel.send("All auto moderation has been disabled for this guild.")
                   let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
                   const embed = new Discord.RichEmbed()
                       .setColor(0x00A2E8)
                       .setTitle("Case #" + row.casenumber + " | Action:  Auto Mod Disabled")
                       .addField("Moderator", message.author.tag + " (ID: " + message.author.id + ")")
                       .addField("Auto Mod Tool", "All")
                       .setFooter("Time used: " + message.createdAt.toDateString())
                   if (!modlog) return;
                   if (row.logsenabled === "disabled") return;
                   client.channels.get(modlog.id).send({embed});
                } else {
                    message.channel.send(embed10)
                }
            })
        }
