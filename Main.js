const Discord = require("discord.js");
const client = new Discord.Client({disableEveryone: true});
const yt = require('ytdl-core');
const snekfetch = require('snekfetch');
const fs = require("fs");
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
const invitecheck = ["discord.gg", "discord.me", "discord.io/", "discordapp.com/invite"]
const weblinkcheck = ["http", "www.", ".com", ".net", ".org", ".ca", ".co.uk"]

let dispatcher;
let queue = {};

const config = require("./assets/jsons/config.json");

client.on('warn', err => console.warn('[ADVERTENCIA]', err));

client.on('error', err => console.error('[ERROR]', err));

client.on('uncaughtException', (err) => {
    console.log("Uncaught Exception: " + err)
    process.exit(1)
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('[FATAL] Possibly Unhandled Rejection at: Promise ', promise, ' reason: ', reason.message);
});

client.on('disconnect', () => {
  console.warn('Disconnected!')
  process.exit(0);
})

client.on('reconnecting', () => console.warn('Reconectando...'))

client.on('ready', () => {
client.user.setActivity(`kn!help | kn!settings | En Mantenimiento | ${client.guilds.size} Servidores`, 
  { 
       type: "STREAMING", 
       url: "https://www.twitch.tv/something" 
  })
})

client.on("message", async (message) => {
	if (message.author.bot) return;
	if (message.channel.type === 'dm') return;
	if (!message.guild.member(client.user).hasPermission('SEND_MESSAGES')) return;
	if (!message.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
	if (!message.guild.member(client.user).hasPermission('VIEW_CHANNEL')) return;
	if (!message.guild.member(client.user).hasPermission('READ_MESSAGE_HISTORY')) return;

	sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(async (row) => {
		if (!row) return;

		const prefix = row.prefix
		if (row.prefix === undefined) return prefix = "kn!"
		if (message.content.indexOf(prefix) !== 0) return;
		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		if (command === "play") {
			if (!message.guild.member(client.user).hasPermission('CONNECT')) return message.reply('Sorry, i dont have the perms to do this cmd i need CONNECT. :x:')
			if (!message.guild.member(client.user).hasPermission('SPEAK')) return message.reply('Sorry, i dont have the perms to do this cmd i need SPEAK. :x:')
			const channel = message.member.voiceChannel;
			if (!channel || channel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel...');
			if (queue[message.guild.id] === undefined) return message.channel.send(`Add some songs to the queue first with add`);
			if (!message.guild.voiceConnection) {
				channel.join()
			}
			if (queue[message.guild.id].playing) return message.channel.send('Already Playing the queue.');
			queue[message.guild.id].playing = true;
			(function play(song) {
				if (song === undefined) return message.channel.send('Queue is empty, disconnecting till more is queued.').then(() => {
					queue[message.guild.id].playing = false;
					message.member.voiceChannel.leave();
				});
				console.log(song.title + " in " + message.guild.name);
				message.channel.send(`Playing: **${song.title}** as requested by: **${song.requester}**`);
				dispatcher = message.guild.voiceConnection.playStream(yt(song.url, {
					audioonly: true
				}), {
					seek: 0,
					passes: 1, // Can be increased to reduce packetloss.
					bitrate: 'auto',
					quality: 'highestaudio'
				});
				dispatcher.on('end', () => {
					play(queue[message.guild.id].songs.shift());
				});
				dispatcher.on('error', (err) => {
					return message.channel.send('error: ' + err).then(() => {
						play(queue[message.guild.id].songs.shift());
					});
				});
			})(queue[message.guild.id].songs.shift());
		}

		if (command === "add") {
			let query = args.join(" ");
			if (query < 1) return message.channel.send('You must include a query for what you want to play, add [songname/url]')
			const msg = await message.channel.send("Searching...")
			if (query.includes("youtube.com/watch")) {
				let url = query
				yt.getInfo(url, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
					if (err) return message.channel.send('Invalid YouTube Link: ' + err);
					if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
					queue[message.guild.id].songs.push({
						url: url,
						title: info.title,
						requester: message.author.username
					});
					msg.edit(`Added **${info.title}** to the queue`);
				});
			} else {
			const { body } = await snekfetch
				.get('https://www.googleapis.com/youtube/v3/search')
				.query({
					part: 'snippet',
					type: 'video',
					maxResults: 1,
					q: query,
					safeSearch: 'strict',
					order: 'relevance',
					videoDuration: 'medium',
					key: "GOOGLEKEY"
				});
			if (!body.items.length) return message.channel.send('No results found for ' + query + ".");
			let url = `https://www.youtube.com/watch?v=${body.items[0].id.videoId}`
			yt.getInfo(url, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
				if (err) return message.channel.send('Invalid YouTube Link: ' + err);
				if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
				queue[message.guild.id].songs.push({
					url: url,
					title: info.title,
					requester: message.author.username
				});
				info
				msg.edit(`Added **${info.title}** to the queue`);
			});
		}
	}

		if (command === "join") {
			return new Promise((resolve, reject) => {
				const voiceChannel = message.member.voiceChannel;
				if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel...');
				voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
			});
		}

		if (command === "leave") {
			return new Promise((resolve, reject) => {
				const voiceChannel = message.member.voiceChannel;
				if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t leave your voice channel...');
				voiceChannel.leave()
			});
		}

		if (command === "queue") {
			if (queue[message.guild.id] === undefined || queue[message.guild.id] === {}) return message.channel.send(`Add some songs to the queue first with add`);
			let tosend = [];
			queue[message.guild.id].songs.forEach((song, i) => {
				tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);
			});
			if (tosend.length <= 0) return message.channel.send(`**${message.guild.name}'s Music Queue:** Currently **${tosend.length}** queued.`);
			message.channel.send(`**${message.guild.name}'s Music Queue:** Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
		}

		if (command === "clearqueue") {
                   if (queue === {}) return message.channel.send('Queue is empty, have no songs to remove.');
			const voiceChannel = message.member.voiceChannel;
			if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t leave your voice channel...');
			queue[message.guild.id] = {};
			message.channel.send('Queue has been cleared, use kn!add to start playing music again.')
			voiceChannel.leave()
		}

		if (command === "pause") {
			dispatcher.pause();
			message.channel.send('Music has been paused, use kn!resume to start playing music again.')
		}

		if (command === "resume") {
			dispatcher.resume();
			message.channel.send('Music has been resumed.')
		}

		if (command === "skip") {
			if (queue === {}) return message.channel.send('Queue is empty, have no songs to skip.');
			message.channel.send('Current song has been skipped.')
			dispatcher.end();
		}
		if (command === "volume") {
			const volumetoset = parseInt(args.join(""))
			if (volumetoset > 200 || volumetoset < 0) return message.channel.send('Volume out of range!').then((response) => {
				response.delete(5000);
		    });
			if (isNaN(volumetoset)) return message.channel.send("Need to provide a valid number.")
			dispatcher.setVolume(volumetoset/100);
			message.channel.send(`Volume now set too: ${volumetoset}%`);
		}
	})
});


const express = require('express')
const app = express()

app.use(express.static('public'))
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on ' + listener.address().port);
}); 


const talkedRecently = new Set();

const talkedRecently2 = new Set();


var cooldownUsers = [];

const checkCooldown = ((userId) => {
  if(cooldownUsers.indexOf(userId) > -1) {
    return true;
  } else {
    return false;
  }
});

const removeCooldown = ((userId, timeInSeconds) => {
  let index = cooldownUsers.indexOf(userId);
  if(index > -1) { 
    setTimeout(() => {
      cooldownUsers = cooldownUsers.splice(index, 0);
    }, timeInSeconds * 1000)
  }
});

fs.readdir('./events/', (err, files) => {
  files = files.filter(f => f.endsWith('.js'));
  files.forEach(f => {
      const event = require(`./events/${f}`);
      client.on(f.split('.')[0], event.bind(null, client));
      delete require.cache[require.resolve(`./events/${f}`)];
  });
});

client.on("guildCreate", async (guild) => {
  try {
  console.log(`Alguien añadio a KNF! ${guild.name} Cantidad de miembros: ${guild.memberCount} Dueño: ${guild.owner.user.username}!`)
  const owner = guild.owner.user
  var guildMsg = [
      "Gracias por agregarme a su servidor. Sólo algunos consejos para empezar...",
      "`**1.** El Prefix por defecto es `kn!`.",
      "**2.** Los Comandos no funcionaran en mensajes directos.",
      "**3.** Configure los mensajes de bienvenida con k!welcomeleave.",
      "**4.** Configurar el canal de registros con kn!logs `logs`.",
      "**5.** Fijar autorol con k!autorole `role`.",
      "**6.** El prefix se puede cambiar con kn!prefix `kf!`.",
      "**7.** El sistema de perfiles se puede habilitar con k!profilesystem.",
      "**8.** Automod puede ser habilitado con kn!automod enable all```"
  ]
  owner.send(guildMsg)
} catch (err) {
  return;
}
});

client.on('guildDelete', (guild) => {
  console.log(`Alguien removio a KNF! ${guild.name} Cantidad de miembros: ${guild.memberCount} Dueño: ${guild.owner.user.username}!`)
  sql.run(`DELETE FROM scores WHERE guildId = ${guild.id}`)
});

client.on("guildMemberAdd", (member) => {
  if (!member.guild.member(client.user).hasPermission('SEND_MESSAGES')) return;
    if (!member.guild.member(client.user).hasPermission('VIEW_CHANNEL')) return;
    if (!member.guild.member(client.user).hasPermission('READ_MESSAGE_HISTORY')) return;
  sql.get(`SELECT * FROM scores WHERE guildId ="${member.guild.id}"`).then(row => {
    if (row.antijoin === "enabled") {
      member.user.send("Anti-join has been enabled in " + member.guild.name + " you have been kicked automatically.")
      member.guild.member(member.user.id).kick().catch(console.error);
    } else {
      if (!member.guild.member(client.user).hasPermission('MANAGE_ROLES')) return;
        let autoRole = client.guilds.get(member.guild.id).roles.find(r => r.name == row.roletogive);
        if (!autoRole) return
        member.guild.member(member.user.id).addRole(autoRole).catch(console.error);
    }
    })
});

client.on('messageReactionAdd', (reaction, user) => {
  if (reaction.emoji.name === '⭐') {
    let message = reaction.message
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    if (!message.guild.member(client.user).hasPermission('SEND_MESSAGES')) return;

    if (!message.guild.member(client.user).hasPermission('VIEW_CHANNEL')) return;
    if (!message.guild.member(client.user).hasPermission('READ_MESSAGE_HISTORY')) return;
    if (message <= 1) return;
    if (message.guild.id === "110373943822540800") return;
    if (message.guild.id === "264445053596991498") return;
    const embed = new Discord.RichEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setColor(0x00A2E8)
      .setTitle(`⭐ ${client.user.username} Starboard ⭐`)
      .addField('Starred By', `${user.username}`, true)
      .addField('Channel', `${message.channel}`, true)
      .addField('Message', `${message.content}`, false)
      .setTimestamp()
    let modlog = message.guild.channels.find(channel => channel.name == 'starboard');
    if (!modlog) return
    if (user.id === message.author.id) return message.channel.send(`${message.author}, You can't star your own messages!`)

    let reacts = message.reactions.filter(function (reacts) {
      return reacts.emoji.name === '⭐'
    })
    if (reacts.length > 1) return;
    client.channels.get(modlog.id).send({embed}).catch(console.error);
  }
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;
  if (!message.guild.member(client.user).hasPermission('SEND_MESSAGES')) return;
  if (!message.guild.member(client.user).hasPermission('MANAGE_MESSAGES')) return;
  if (!message.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
  if (!message.guild.member(client.user).hasPermission('VIEW_CHANNEL')) return;
  if (!message.guild.member(client.user).hasPermission('READ_MESSAGE_HISTORY')) return;

  sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row => {
    if (!row) return;

    const prefix = row.prefix
    const args = message.content.slice(prefix.length).trim().split(/ +/g);

  if (message.content.startsWith("<@" + client.user.id +">") || message.content.startsWith("<@!" + client.user.id +">")) {
    message.reply("El prefix de este servidor es `" + row.prefix + "`.")
  }

  if (invitecheck.some(word => message.content.toLowerCase().includes(word))) {
  if (message.content.includes(row.prefix)) return
  if (row.automoderation === "disabled") return;
  if (row.invitelinkprotection === "disabled") return;
  if (message.member.hasPermission("KICK_MEMBERS")) return;
  message.delete()
  let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
  const embed = new Discord.RichEmbed()
    .setColor(0x00A2E8)
    .setTitle("Action: Auto Moderation")
    .addField("Moderator", client.user.username + " (ID: " + client.user.id + ")")
    .addField("User", message.author.username + " (ID: " + message.author.id + ")")
    .addField("In channel", message.channel.name, true)
    .addField("Reason", "Invite Link", true)
    .addField("Invite link", message.cleanContent)
    .setFooter("Time used: " + message.createdAt.toDateString())
    if (!modlog) return;
    if (row.logsenabled === "disabled") return;
    client.channels.get(modlog.id).send({embed});
    message.reply(" not allowed to post invite links.").then((response) => {
      response.delete(6000);
      });
}

  if (weblinkcheck.some(word2 => message.content.toLowerCase().includes(word2))) {
  if (message.content.includes(row.prefix)) return
  if (row.automoderation === "disabled") return;
  if (row.websitelinkprotection === "disabled") return;
  if (message.member.hasPermission("KICK_MEMBERS")) return;
  message.delete()
  let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
  const embed = new Discord.RichEmbed()
    .setColor(0x00A2E8)
    .setTitle("Action: Auto Moderation")
    .addField("Moderator", client.user.username + " (ID: " + client.user.id + ")")
    .addField("User", message.author.username + " (ID: " + message.author.id + ")")
    .addField("In channel", message.channel.name, true)
    .addField("Reason", "Website Link", true)
    .addField("Website link", message.cleanContent)
    .setFooter("Time used: " + message.createdAt.toDateString())
    if (!modlog) return;
    if (row.logsenabled === "disabled") return;
    client.channels.get(modlog.id).send({embed});
    message.reply(" not allowed to post website links.").then((response) => {
      response.delete(6000);
      });
  }

   if (message.content.includes('')) {
    if (message.content.includes(row.prefix)) return
    if (row.automoderation === "disabled") return;
    if (row.dupcharactersprotection === "disabled") return;
      if (message.member.hasPermission("KICK_MEMBERS")) return;
      const check1 = args.join(" ")
      if (check1.includes('.')) return;
      var hasDuplicates = /([a-zA-Z])\1+$/;
      const result = hasDuplicates.test(check1)
      if (result === true) { 
        message.delete()
        let modlog = message.guild.channels.find(channel => channel.name == row.logschannel);
        const embed = new Discord.RichEmbed()
          .setColor(0x00A2E8)
          .setTitle("Action: Auto Moderation")
          .addField("Moderator", client.user.username + " (ID: " + client.user.id + ")")
          .addField("User", message.author.username + " (ID: " + message.author.id + ")")
          .addField("In channel", message.channel.name, true)
          .addField("Reason", "Duplicated Characters", true)
          .addField("Message Content", message.cleanContent)
          .setFooter("Time used: " + message.createdAt.toDateString())
          if (!modlog) return;
          if (row.logsenabled === "disabled") return;
          client.channels.get(modlog.id).send({embed});
          let user = message.guild.member(message.mentions.users.first())
        message.reply(" message contains duplicated characters.").then((response) => {
          response.delete(6000);
          });
    } 
  }

  if (message.content.includes('')) {
      if (message.member.hasPermission("KICK_MEMBERS")) return;
      if (row.slowmode === "disabled") return;
      if (row.slowmode === "enabled") {
        if(checkCooldown(message.author.id)) {
          message.delete();
         }
      cooldownUsers.push(message.author.id);
      removeCooldown(message.author.id, row.slowmodetime);
      } 
     } 
    })

    if (message.content.startsWith("")) {
      sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row2 => {
        if (!row2) return;
        if (row2.levelsystem === "disabled") return;
        sql.get(`SELECT * FROM profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(row => {
          if (!row) return;
          if (row.level === 25) {
            if (row.awards.includes("None")) return sql.run(`UPDATE profiles SET awards = "" WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
            if (row.awards.includes(":tada:")) return;
             sql.run(`UPDATE profiles SET awards = "${row.rewards + ":tada:"}" WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
          } else if (row.level === 50) {
            if (row.awards.includes("None")) return sql.run(`UPDATE profiles SET awards = "" WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
            if (row.awards.includes(":medal:")) return;
          sql.run(`UPDATE profiles SET awards = "${row.awards + " :medal:"}" WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
          } else if (row.level === 100) {
            if (row.awards.includes("None")) return sql.run(`UPDATE profiles SET awards = "" WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
            if (row.awards.includes(":trophy:")) return;
            sql.run(`UPDATE profiles SET awards = "${row.awards + " :trophy:"}" WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
          } else if (row.cash >= 10000) {
            if (row.awards.includes("None")) return sql.run(`UPDATE profiles SET awards = "" WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
            if (row.awards.includes(":moneybag:")) return;
            sql.run(`UPDATE profiles SET awards = "${row.awards + " :moneybag:"}" WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
          } else if (row.cash >= 100000) {
            if (row.awards.includes("None")) return sql.run(`UPDATE profiles SET awards = "" WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
            if (row.awards.includes(":credit_card:")) return;
            sql.run(`UPDATE profiles SET awards = "${row.awards + " :credit_card:"}" WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
          } else {
            return;
          }
       });
    });
    }

  if (message.content.startsWith("")) {
    sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row2 => {
      if (!row2) return;
      if (row2.levelsystem === "disabled") return;
    if (talkedRecently.has(message.author.id)) return;
    const xpgained = Math.floor(Math.random() * 100) + 1;
    sql.get(`SELECT * FROM profiles WHERE guildId ="${message.guild.id}" AND userId ="${message.author.id}"`).then(row => {
      if (!row) {
          sql.run("INSERT INTO profiles (guildId, userId, xp, level, bank, cash, awards, rep, username, winningchance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [message.guild.id, message.author.id, 0, 1, 0, 100, "None", 0, message.author.username, 0]);
        } else {
          let curLevel = Math.floor(0.1 * Math.sqrt(row.xp + 30));
          if (curLevel > row.level) {
            row.level = curLevel;
            if (row.level >= 200) return;
            sql.run(`UPDATE profiles SET xp = ${row.xp + xpgained}, level = ${row.level} WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
          }
          if (row.xp >= 9999999) return;
          sql.run(`UPDATE profiles SET xp = ${row.xp + xpgained}, cash = ${row.cash + 10}, username = "${message.author.username}" WHERE guildId ="${message.guild.id}" AND userId = ${message.author.id}`);
        }
      }).catch(() => {
      console.error;
      sql.run("CREATE TABLE IF NOT EXISTS profiles (guildId TEXT, userId TEXT, xp INTEGER, level INTEGER, bank INTEGER, cash INTEGER, awards TEXT, rep INTEGER, username TEXT, winningchance INTEGER)").then(() => {
        sql.run("INSERT INTO profiles (guildId, userId, xp, level, bank, cash, awards, rep, username, winningchance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [message.guild.id, message.author.id, 0, 1, 0, 100, "None", 0, message.author.username, 0]);
      })
    })
    talkedRecently.add(message.author.id);
    setTimeout(() => {
      talkedRecently.delete(message.author.id);
    }, 60000);
  })
}

});

client.login(config.token);
