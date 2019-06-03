const Discord = require("discord.js");
const bot = new Discord.Client();
const math = require('mathjs');
exports.run = async (client, message, args) => {
    const expression = args.join(" ");
        try {
            const solved = math.eval(expression).toString();
            return message.channel.send("La respuesta es: " + solved);
        } catch (err) {
            return message.channel.send('An error happened, more details: ' + err);
        }
}
