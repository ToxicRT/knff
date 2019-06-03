const Discord = require("discord.js");
const bot = new Discord.Client();
const snekfetch = require("snekfetch")
exports.run = async (client, message, args) => {
      if (message.mentions.users.size < 1) return message.channel.send("no puedes besar a nadie")
    let kiss1 = ['https://cdn.discordapp.com/attachments/583106383109423106/584556019196100611/1514952791_122488f0e373ecc034a2123f4e09c6f7.gif', 'https://cdn.discordapp.com/attachments/583106383109423106/584555897049579527/9cbebfb852e76c2b8d9c3b72ae08e68f.gif', 'https://cdn.discordapp.com/attachments/583106383109423106/584555830297231381/d38b8c3e3eb9c78975c91e29fe579da3097a2df7_hq.gif', 'https://cdn.discordapp.com/attachments/583106383109423106/584565603885514774/32a9d9205d83589a591b79e6085d3b11.gif', 'https://cdn.discordapp.com/attachments/583106383109423106/584565653671903262/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f.gif', 'https://cdn.discordapp.com/attachments/583106383109423106/584566097957748746/tumblr_mrwwf89gQO1r3z3s3o1_500.gif']
    let result1 = Math.floor((Math.random() * kiss1.length));
      let user = message.guild.member(message.mentions.users.first());
            message.channel.send(`${user} Obtuvistes un beso de ${message.author.username} ❤`,{
                embed: {
                    image: {
                        url: (kiss1[result1])
                    }
                }
            })
}
   
