const Discord = require("discord.js");
const bot = new Discord.Client();
const snekfetch = require("snekfetch")
exports.run = async (client, message, args) => {
	  let user = message.guild.member(message.mentions.users.first());
      if (!user) return message.channel.send("you can't marry nobody")
	  if (user.id === message.author.id) return message.channel.send("No puedes casarte contigo mismo")
      //let user = message.guild.member(message.mentions.users.first());
            message.channel.send(`${user} Te casastes con ${message.author.username} ❤`,{
                embed: {
                    image: {
                        url: "https://i.imgur.com/u67QLhB.gif"
                    }
                }
            })
}
   
