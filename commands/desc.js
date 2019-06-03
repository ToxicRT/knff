const Discord = require('discord.js'),
      db = require('quick.db');
const desc = require('quick.db');

exports.run = async (bot, message, args) => {

  // Create a new 'AFK' table w/ Quick.db
  const status = new db.table(`desc_${message.guild.id}_${message.author.id}`);

  // Fetch user object from that table
  let desc = await db.fetch(`desc_${message.guild.id}_${message.author.id}`);

  // Form Embed
  const embed = new Discord.RichEmbed()
    .setColor(0xffffff)
  
  var user = message.author;

  if (!desc) { // Run if they are NOT afk, or afk is null
    embed.setFooter('Descripcion modificada.');
    // Add the user to the AFK pool
    db.set(`desc_${message.guild.id}_${message.author.id}`, args.join(' ') || `Actualiza tu descripcion.`);
  } else { // Run if they ARE afk
    embed.setFooter('Descripcion modificada..'); // Modify Embed
    // Remove the user from the AFK pool
    db.delete(`desc_${message.guild.id}_${message.author.id}`);
    db.set(`desc_${message.guild.id}_${message.author.id}`, args.join(' ') || `Actualiza tu descripcion.`);
  }

  // Send Embed
  message.channel.send(embed);

}
