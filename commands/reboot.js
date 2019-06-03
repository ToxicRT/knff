const Discord = require("discord.js")
const fs = require("fs");
exports.run = async (client, message, args) => {
  	if (message.author.id !== "295335481179373568") return message.channel.send("Only owners can use this command");
  try {
      await message.reply('Se esta reiniciando el bot.');
      fs.readdir("./commands/", (err, files) => {
        const filez = files.length
        if (err) return console.error(err);
        message.channel.send(`Refrescado \`${filez + 11}\` Comandos correctamente!`)
        console.log("Reiniciado " + filez + " Comandos")
        files.forEach(file => {
             delete require.cache[require.resolve(`./${file}`)];
        });
    });
      process.exit(1);
    } catch (e) {
      console.log(e);
    }
}