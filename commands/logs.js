const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
exports.run = (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("Necesitas el permiso `MANAGE_GUILD`");
  sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row => {

  const prefixtouse = row.prefix
        const embed10 = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .setThumbnail(client.user.avatarURL)
                .setTitle("Comando: " + prefixtouse + "logs")
                .addField("Uso", prefixtouse + "logs [number]")
                .addField("Ejemplo", "[1] - Activar los registros\n[2] - Desactivar los logs\n[3] - Cambiar el canal de los logs")
                .setDescription("Description: " + "Se utiliza para configurar los registros de moderación del bot.");

        const toenable = args[0]
        if (toenable === "1") {
            sql.run(`UPDATE scores SET logsenabled = "enabled" WHERE guildId = ${message.guild.id}`);
            message.channel.send("He habilitado los registros para este servidor.")
            let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
            const embed = new Discord.RichEmbed()
          .setColor(0x00A2E8)
          .setTitle("Case #" + row.casenumber + " | Action: Logs Enabled")
          .addField("Moderador", message.author.tag + " (ID: " + message.author.id + ")")
          .setFooter("Time used: " + message.createdAt.toDateString())
            if (!modlog) return;
            if (row.logsenabled === "disabled") return;
            client.channels.get(modlog.id).send({embed});
        } else if (toenable === "2") {
            sql.run(`UPDATE scores SET logsenabled = "disabled" WHERE guildId = ${message.guild.id}`);
            message.channel.send("He deshabilitado los registros para este servidor.")
            let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
            const embed = new Discord.RichEmbed()
          .setColor(0x00A2E8)
          .setTitle("Caso #" + row.casenumber + " | Accion: Logs Disabled")
          .addField("Moderador", message.author.tag + " (ID: " + message.author.id + ")")
          .setFooter("Time used: " + message.createdAt.toDateString())
            if (!modlog) return;
            if (row.logsenabled === "disabled") return;
            client.channels.get(modlog.id).send({embed});
        } else if (toenable === "3") {
          const newlogs = args.slice(1).join(' ')
          const newlogschannel = newlogs.replace(/[^\x00-\x7F]/g, "");
          if (newlogs.length < 1) return message.channel.send("No proporcionó un nuevo nombre de canal para establecer")
          if (newlogschannel.length < 1) return message.channel.send("El prefix no puede tener caracteres que no sean ASCII")
          if (newlogs.length > 20) return message.channel.send("el nombre del canal no puede tener más de 20 caracteres")
          if (!row.logschannel) return;
          sql.run(`UPDATE scores SET logschannel = "${newlogschannel}", casenumber = ${row.casenumber + 1} WHERE guildId = ${message.guild.id}`);
          message.channel.send("He configurado el nuevo canal de registros de este servidor para " + newlogschannel)
          let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
           const embed = new Discord.RichEmbed()
         .setColor(0x00A2E8)
         .setTitle("Caso #" + row.casenumber + " | Accion: Cambio del canal de registros")
         .addField("Moderador", message.author.tag + " (ID: " + message.author.id + ")")
         .addField("Nuevo canal de registros", newlogschannel, true)
         .setFooter("Time used: " + message.createdAt.toDateString())
           if (!modlog) return;
           if (row.logsenabled === "disabled") return;
           client.channels.get(modlog.id).send({embed});
        } else {
           message.channel.send(embed10)
        }
    })
}
