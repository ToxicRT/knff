const Discord = require("discord.js");
const bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./assets/guildsettings.sqlite");
var maincommands = [
        "`help` - El Bot te dará un enlace con todos los comandos..",
        "`ping` - El Bot responderá con pong y tiempo que tomó.",
        "`botinfo` - Obtendrás toda la información del bot. ",
        "`reminder` [minutos] [texto] - Le enviare un recordatorio de [texto] en [tiempo]. ",
        "`invite` - Te enviara una invitacion del bot.",
        "`serverinfo` - Te mostrara la informacion del servidor.",
        "`serverroles` - Obtendras los roles del servidor.",
        "`prefix` - Cambiar el prefix del servidor.",
        "`uptime` - Sabras cuanto tiempo el bot esta en linea.",
        "`whois @Someone` - Obtendras la informacion del usuario.",
        "`uroles @Someone` Para ver los roles del usuario"
    ]
    var moderationcommands = [
        "`ban @Someone [razon]` - Banear al usuario mencionado.",
		"`kick @Someone [Razon]` - Kickea al usuario mencionado",
        "`unban @Someone [razon]` - Desbanear al usuario mencionado [ID].",
        "`softban [ID] [reason]` - Banea y desbanea al instante al usuario mencionado.",
        "`mute @Someone [minutos] [razon]` - Mutear al usuario mencionado por un tiempo especificado. ",
        "`unmute @Someone [reason]` - Desmutear al usuario mencionado.",
        "`clean [cantidad]` - Elimina los mensajes del bot.",
        "`antiraid [minutos] [reason]` - Deshabilitará el rol predeterminado para enviar mensajes.",
        "`giverole @Someone [rolename]` - Dara el rol especificado al usuario.",
        "`takerole @Someone [nombredelrol]` - Tomara el rol especificado del usuario.",
        "`roleall [nombredelrol]` - Dara el rol especificado a todos los miembros.",
        "`rroleall [nombredelrol]` - Tomara el rol especificado de todos los miembros.",
        "`slowmode [segundos]` - Cantidad de mensajes por x segundos",
        "`automod [enable/disable] [automodtool]` - Activa la automoderacion.",
        "`autorole [rolename]` - Da automaticamente rol especificado.",
        "`logs [1/2/3]` - Te da opciones para modificar los registros del serviodr.",
        "`modonly` - Hace los comandos solamente para moderadores (mods/mods+ necesitan el permiso `KICK_MEMBERS`).",
        "`welcomeleave` - Modificar los mensajes de bienvenida/salida",
        "`warn` - @Someone [razon] - Se le avisara con su razon.",
        "`warings` @Someone - Muestra las advertencias del usuario.",
        "`clearwarns` @Someone - Remueve las advertencias del usuario.",
        "`report` @someone [razon] Reporta un usuario"
    ] 
var funcommands = [
    "`trigger @Someone` - Convierte a alguien loco.",
    "`brazzers @Someone` - Conviertelo en Brazzers.",
    "`approved @Someone` - Converte a alguien en aprobado.",
    "`wasted @Someone` - Convierte a alguien en buscado.",
    "`achievement [o]` - Te da un logro de minecraft.",
    "`avatar @Someone` - Te da el avatar del usuario.",
]
var funcommands2 = [
    "`reverse [texto]` - Will reverse the text you provided.",
    "`slots` - Juega el juego de cajas.",
    "`textflip [texto]` - Flips text upside down.",
    "`today` - El bot dira algo de hoy en dia.",
    "`notes` - Escribe notas y guardalas.",
]
var roleplaycommands = [
    "hug @Someone - Will send a image hugging that user.",
    "kiss @Someone - Will send a image kissing that user.",
    "marry @Someone - Will send a image marrying that user.",
    "high-five @Someone - Will send a image high-fiving that user.",
    "cuddle @Someone - Will send a image cuddling that user.",
    "fist-bump @Someone - Will send a image fist-bumping that user.",
    "poke @Someone - Will send a image poking that user.",
    "pat @Someone - Will send a image patting that user.",
    "punch @Someone - Will send a image punching that user.",
    "hold-hands @Someone - Will send a image holding that users hand.",
    "tackle @Someone - Will send a image tackle that user.",
    "kiss @someone",
]
var levelcommands = [
    "`profile @Someone` - Obtienes el perfil de un usuario.",
    "`deposit [cantidad]` - Depositas [cantidad] A tu banco.",
    "`withdraw [cantidad]` - Sacas [cantidad] de tu banco.",
    "`redeem [codigo]` - Reclamas un codigo.",
    "`transfer @Someone [amount]` - Te permite transferir dinero a un usuario.",
    "`leaderboard [cash/level]` - Muestra el top 10 del servidor.",
    "`25 [betamount]` - Bet on the dice if it rolls above 25 win x1.25 of your bet.",
    "`50 [betamount]` - Bet on the dice if it rolls above 50 win x1.50 of your bet.",
    "`75 [betamount]` - Bet on the dice if it rolls above 75 win x1.75 of your bet.",
    "`99 [betamount]` - Bet on the dice if it rolls above 99 win x2.00 of your bet.",
    "`rob @Someone` - Intenta robar al usuario 5,000 pero no te dejes atrapar.",
    "`work` - Trabajas y consigues dinero. [tiempo de espera: 10 mins]",
    "`hack` - Trabajas como hacker. [tiempo de espera 15 mins]",
    "`flipcoin [bet] [heads/tails]` - Tira la monera y consigue algo de dinero.",
    "\n",
    "Estos comandos necesitan el permiso `MANAGE_GUILD`",
    "\n",
    "`givemoney @Someone [amount]` - Te permite dar dinero a un usuario.",
    "`takemoney @Someone [amount]` - Te permite tomar dinero de un usuario.",
    "`givexp @Someone [amount]` - Te permite dar experiencia a un usuario.",
    "`takexp @Someone [amount]` - Te permite dar dinero a un usuario.",
    "`profilesystem` - Te permite activar/desactivar niveles/dinero en tu servidor",
]
exports.run = (client, message, args) => { 
    sql.get(`SELECT * FROM scores WHERE guildId ="${message.guild.id}"`).then(row => {
     const prefixtouse = row.prefix
     const embed10 = new Discord.RichEmbed()
     .setColor(0x00A2E8)
     .setThumbnail(client.user.avatarURL)
     .setTitle("Comando: " + prefixtouse + "help")
     .addField("Uso", prefixtouse + "help [number]")
     .addField("Opciones", "`[1]` - Comandos Principales. \n`[2]` - Comandos de Moderacion.\n`[3]` - Comandos de diversion. \n`[4]` - Comandos de diversion pag 2. \n`[5]` - Comandos de rolplay.\n`[6]` - Comandos de Niveles/Dinero.")
     .addField("Ejemplo", prefixtouse + "help 3")
     .setDescription("Descripcion: " + "Usado para obtener la lista de comandos.");

        const numberpicked = parseInt(args[0])
        if (isNaN(numberpicked)) return message.channel.send(embed10)
        if (numberpicked === 1) {

            const embed = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .setTitle("Comandos Principales")
            .setDescription(maincommands)
            message.author.send(embed).then(() => message.channel.send("Los comandos han sido enviados a tus mensajes privados.")).catch(() => message.channel.send("Ha ocurrido un error enviando los comandos, si tienes los mensajes privados desactivados `Activalo`"))
        } else if (numberpicked === 2) {
            const embed2 = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .setTitle("Comandos de moderacion")
            .setDescription(moderationcommands)
            message.author.send(embed2).then(() => message.channel.send("Los comandos han sido enviados a tus mensajes privados.")).catch(() => message.channel.send("Ha ocurrido un error enviando los comandos, si tienes los mensajes privados desactivados `Activalo`"))       
         } else if (numberpicked === 3) {
                const embed3 = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .setTitle("Comandos de diversion")
                .setDescription(funcommands)
                message.author.send(embed3).then(() => message.channel.send("Los comandos han sido enviados a tus mensajes privados.")).catch(() => message.channel.send("Ha ocurrido un error enviando los comandos, si tienes los mensajes privados desactivados `Activalo`"))        
            } else if (numberpicked === 4) {
                const embed4 = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .setTitle("Comandos de diversion pag 2")
                .setDescription(funcommands2)
                message.author.send(embed4).then(() => message.channel.send("Los comandos han sido enviados a tus mensajes privados.")).catch(() => message.channel.send("Ha ocurrido un error enviando los comandos, si tienes los mensajes privados desactivados `Activalo`"))        
        } else if (numberpicked === 5) {
                const embed5 = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .setTitle("Comandos de rolplay")
                .setDescription(roleplaycommands)
                message.author.send(embed5).then(() => message.channel.send("Los comandos han sido enviados a tus mensajes privados.")).catch(() => message.channel.send("Ha ocurrido un error enviando los comandos, si tienes los mensajes privados desactivados `Activalo`"))        
            
            } else if (numberpicked === 6) {

                const embed7 = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .setTitle("Comandos de Nivel/Dinero ")
                .setDescription(levelcommands)
                message.author.send(embed7).then(() => message.channel.send("Los comandos han sido enviados a tus mensajes privados.")).catch(() => message.channel.send("Ha ocurrido un error enviando los comandos, si tienes los mensajes privados desactivados `Activalo`"))        
        } else {
            message.channel.send("Opcion no valida")
        }
    })
}