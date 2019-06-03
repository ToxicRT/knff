const Discord = require("discord.js");
const bot = new Discord.Client();
exports.run = (client, message, args) => {
message.channel.send("Aquí hay un enlace de invitación para invitar al bot a su servidor, ¡nos vemos allí!")
    const embed = new Discord.RichEmbed()
    .setColor(0x00A2E8)
    .setDescription(`https://discordapp.com/oauth2/authorize?client_id=582706483423084567&scope=bot&permissions=470281471`);
    message.channel.send({embed})
}