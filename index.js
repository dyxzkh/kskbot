const Discord = require('discord.js');
const { DisTube } = require('distube');
const {prefix} = require("./config.json");
require('dotenv').config();
const client = new Discord.Client({
	intents: ['MessageContent','Guilds', 'GuildVoiceStates', 'GuildMessages'],
});

// Create a new DisTube
const distube = new DisTube(client, {
	emitNewSongOnly: false,
	searchSongs: 0,
	leaveOnEmpty: true,
	emptyCooldown: 5,
});

client.on('ready', client => {
  	console.log(`KSK is Online!`);
  	client.user.setStatus("online");
  	distube.on('error', (channel, error) => {
    console.error(error)
    channel.send(`An error encoutered: ${error.slice(0, 1979)}`) // Discord limits 2000 characters in a message
  })
});
// client.on("debug", console.log)

client.on('messageCreate', message => {
	if (message.author.bot || !message.inGuild()) return;
	if (!message.content.startsWith(prefix)) return;
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const cmd = args.shift();

	if(cmd === 'ping'){
		message.channel.send("Ching Chong!");
	}

	if (cmd === 'play' || cmd === 'p') {
		const voiceChannel = message.member?.voice?.channel;
		if (voiceChannel) {
			distube.play(voiceChannel, args.join(' '));
		} else {
			message.channel.send(
				'You must join a voice channel first.',
			);
		}
	}
});

client.login(process.env.TOKEN);