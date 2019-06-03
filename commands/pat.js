const Discord = require("discord.js");
const bot = new Discord.Client();
const snekfetch = require("snekfetch")
exports.run = async (client, message, args) => {
      if (message.mentions.users.size < 1) return message.channel.send("no puedes darle palmadita a nadie")
      let palmadita = [
        'https://cdn.discordapp.com/attachments/584893262347763712/584893327351087133/4ssddEQ.gif',
        'https://cdn.discordapp.com/attachments/584893262347763712/584893395063930888/d11456b511e27f746ee2ca46d0e30dd6.gif',
        'https://cdn.discordapp.com/attachments/584893262347763712/584893397815263251/3173672643_1_15_SlkVbswW.gif',
        'https://cdn.discordapp.com/attachments/584893262347763712/584893656255954954/tumblr_p14hcsxPsb1tm1dgio1_400.gif',
        'https://cdn.discordapp.com/attachments/584893262347763712/584893679462908048/giphy.gif',
        'https://cdn.discordapp.com/attachments/584893262347763712/584893740410339368/UWbKpx8.gif',
        'https://cdn.discordapp.com/attachments/584893262347763712/584894258411208744/giphy_1.gif',
        'https://cdn.discordapp.com/attachments/584893262347763712/584894352770334742/source.gif',
        'https://cdn.discordapp.com/attachments/584893262347763712/584894378879746048/tenor.gif',
        'https://cdn.weeb.sh/images/Sk9mfCtY-.gif'
      ]
    let result1 = Math.floor((Math.random() * palmadita.length));
      let user = message.guild.member(message.mentions.users.first());
            message.channel.send(`${user} Obtuvistes una palmadita de ${message.author.username} ❤`,{
                embed: {
                    image: {
                        url: (palmadita[result1])
                    }
                }
            })
}
   
