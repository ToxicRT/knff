const Discord = require("discord.js");
const bot = new Discord.Client();
exports.run = (client, message, args) => {
    const embed2 = new Discord.RichEmbed()
    .setColor(0x00A2E8) 
    .setTitle(" Premios posibles ")
    .addField(`:tada: - Alcanza el nivel 25.`, ` + 5,000 money`, true)
    .addField(`:medal: - Alcanza el nivel 50.`, `+ 10,000 money`, true)
    .addField(`:military_medal: - Alcanza el nivel 75.`, `+ 20,000 money`, true)
    .addField(`:trophy:`, `Alcanza el nivel 100. (max)`, true)
    .addBlankField()
    .addField(`:first_place: - Alcanza el número 1 en la tabla de clasificación.`, `+5% oportunidad de ganar`, false)
    .addField(`:moneybag:`, `Gana 10,000 en efectivo. +1% oportunidad de ganare`, true)
    .addField(`:credit_card:`, `Gana 100,000 en efectivo. +3% oportunidad de ganar`, true)
    .addBlankField()
    .addField(`:spy::skin-tone-1:`, `Premio secreto`, true)
    .addField(`:tophat: - Premio secreto`, ` +`, true)
    .addField(`:watch:`, `Premio secreto`, true)
    .addField(`:tools:`, `Premio secreto`, true)
    message.channel.send(embed2) 
}
   
