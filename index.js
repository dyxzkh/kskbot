const Discord = require('discord.js');
const { DisTube } = require('distube');
const {prefix} = require("./config.json");
require('dotenv').config();
const client = new Discord.Client({
	setMaxListeners: 0,
	intents: ['MessageContent','Guilds', 'GuildVoiceStates', 'GuildMessages'],
});

let channel;
let author;
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
	client.user.setActivity(`Your Feeling`,Discord.ActivityType.Playing);
  	distube.on('error', (error) => {
    console.error(error)
    //channel.send(`An error encoutered: ${error.slice(0, 1979)}`) // Discord limits 2000 characters in a message
  })
});
// client.on("debug", console.log)

client.on('messageCreate', message => {
	const queue = distube.getQueue(message);

	if (message.author.bot || !message.inGuild()) return;
	if (!message.content.startsWith(prefix)) return;
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const cmd = args.shift();

	channel = message.channel;
	author = message.author;
	

	if(cmd === 'ping'){
		return message.channel.send(`🏓 Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
	}

	if (cmd === 'play' || cmd === 'p') {
		const voiceChannel = message.member?.voice?.channel;
		if (voiceChannel) {
			if(args.join(' ') === ""){
				message.channel.send(
					'>>> សូមបញ្ជូលឈ្មោះចម្រៀងឬលីងក្នុង Command!😑',
				);
				return;
			}
			return distube.play(voiceChannel, args.join(" "));
		} else {
			message.channel.send(
				'>>> សូមចូល Voice Channel ជាមុនសិនមុននឹងវាយ cmd!😆',
			);
			return;
		}
	}

	if (cmd === "repeat" || cmd === "rp" || cmd === "loop") {

		if(args.join(' ') === "") {
			return message.channel.send(
				'>>> សូមបញ្ជូល Argument in Command (on,off,queue)! , Ex: .repeat on'
			);
		}

		if(args[0].toString() === "on"){
			distube.setRepeatMode(message, 1)
			message.reply("រង្វិលជុំត្រូវបានបើកនៅលើបទនេះ! 🔂");
		}else if (args[0].toString() === "off"){
			distube.setRepeatMode(message, 0)
			message.reply("រង្វិលជុំត្រូវបានបិទ! 📴");
		}else if (args[0].toString() === "queue" || args[0].toString() === "q"){
			distube.setRepeatMode(message, 2)
			message.reply("រង្វិលជុំត្រូវបានបើកនៅលើបញ្ជីទាំងមូល! 🔁");
		}
	}

	if(queue){

		if (cmd === 'stop' || cmd === 's') {
			distube.stop(message);
			message.channel.send('ចម្រៀងត្រូវបានបញ្ឈប់! 😵‍💫');
		}

		if (cmd === 'leave' || cmd === 'l') {
			distube.voices.get(message)?.leave();
			message.channel.send('បានចាកចេញ, ជួប​គ្នា​ពេល​ក្រោយ! 😘');
		}

		if (cmd === 'resume' || cmd === 'rs') {
			distube.resume(message);
			message.reply("ចម្រៀងបានចាក់បន្ត! ▶️");
		}

		if (cmd === 'pause' || cmd === 'ps') {
			distube.pause(message);
			message.reply("ចម្រៀងបានស្កុប! ⏹️");
		}

		if (cmd === 'skip' || cmd === 'n' || cmd === 'next') {
			
			if(queue.songs.length > 1){
				distube.skip(message);
			}else{
				message.reply('អត់មានចម្រៀងក្នុងបញ្ជី! 😕');
			}
		}

		if (cmd === 'seek' || cmd === 'sk') {
			

			if(args.join(' ') === ""){
				distube.seek(message, 10);
				return message.reply("ចម្រៀងបានខាទៅវិនាទី ទី 10 នៃចម្រៀង! ➿");
				
			}

			const time = Number(args[0])
			if (isNaN(time)) return message.reply("សូមដាក់វិនាទីដែលត្រូវខាអោយបានត្រឹមត្រូវ! 😕");
			distube.seek(message, time);
			message.reply("ចម្រៀងបានខាទៅវិនាទី ទី " + time + "! ➿");

		}

		if (cmd === 'forward' || cmd === 'fw') {
			

			if(args.join(' ') === ""){
				distube.seek(message, (queue.currentTime + 10));
				return message.reply("ចម្រៀងបានខាទៅមុខ 10 វិនាទី! ⏩");
				
			}

			const time = Number(args[0])
			if (isNaN(time)) return message.reply("សូមដាក់វិនាទីដែលត្រូវខាអោយបានត្រឹមត្រូវ! 😕");
			distube.seek(message, queue.currentTime + time);
			message.reply("ចម្រៀងបានខាទៅមុខ "+ parseInt(args[0]) +" វិនាទី! ⏩");

		}

		if (cmd === 'rewind' || cmd === 'rw') {
			
			
			const time = Number(args[0])
			if (isNaN(time)) return message.reply("សូមដាក់វិនាទីដែលត្រូវខាអោយបានត្រឹមត្រូវ! 😕");

			if(queue.currentTime - time <= 0){
				distube.seek(message, 0);
				message.reply("ចម្រៀងបានខាទៅចំណុចដើមវិញ!");
			}else{
				distube.seek(message, queue.currentTime - time);
				message.reply("ចម្រៀងបានខាទៅក្រោយ "+ parseInt(args[0]) +" វិនាទី! ⏪");
			}
		}

		if (cmd === 'volume' || cmd === 'vol') {
			
			// if(args.join(' ') === ""){
			// 	message.reply("សំឡេង = " + queue.getVol)
				
			// }

			const vol = Number(args[0])
			if (isNaN(vol)) return message.reply("សូមដាក់ចំនួនសំឡេងអោយបានត្រឹមត្រូវ! 😕");

			if(vol >= 0){
				queue.setVolume(vol);
				message.reply("សំឡេងបានដាក់ទៅចំនួន " + vol + "%");
			}else{
				return message.reply("សូមដាក់ចំនួនសំឡេងអោយបានត្រឹមត្រូវ! 😕");
			}
		}

		if (cmd === 'queue' || cmd === 'q') {
			
			if (!queue) {
				message.channel.send('អត់មានអីចាក់ទេ! 😕');
			} else {
				message.channel.send(
					`បទក្នុងបញ្ជី:\n${queue.songs
						.map(
							(song, id) =>
								`**${id ? id : '🔊 កំពុងចាក់'}**. ${
									song.name
								} - \`${song.formattedDuration}\``,
						)
						.slice(0, 10)
						.join('\n')}`,
				);
			}
		}
	}
});

distube
	.on("playSong", (queue,song) => {
		let playembed = new Discord.EmbedBuilder()
		.setColor(Discord.Colors.Red)
		.setTitle(`🎶 កំពុងចាក់ `)
		.setDescription(`[${song.name}]`)
		.setImage(song.thumbnail)
		.setTimestamp()
		.addFields({ name: 'រយៈពេល ៖', value: song.formattedDuration.toString(), inline: true })
		.setFooter({ text: `Request By 🔸 ${author.username} 🔸`, iconURL: author.displayAvatarURL({ dynamic: true })});
		channel.send({ embeds: [playembed] });
	}).on("addSong", (queue, song) => {
		let playembed = new Discord.EmbedBuilder()
		.setColor(Discord.Colors.Green)
		.setTitle(`📢 បានដាក់ទៅក្នុងបញ្ជីចម្រៀង `)
		.setDescription(`[${song.name}]`)
		.setImage(song.thumbnail)
		.setTimestamp()
		.addFields({ name: 'រយៈពេល ៖', value: song.formattedDuration.toString()})
		.setFooter({ text: `Request By 🔹 ${author.username} 🔹`, iconURL: author.displayAvatarURL({ dynamic: true })});
		channel.send({ embeds: [playembed] });
	}).on('finish', () => {
		channel.send('អស់ចម្រៀងនៅក្នុងបញ្ចី! 👏🏻');
	}).on('error', (error) => {
		console.error(error);
		channel.send(`An error encoutered: ${error.slice(0, 1979)}`); // Discord limits 2000 characters in a message
	}).on('addList', (queue, playlist) => {
		let time = '';
		let SECONDS = playlist.duration;
		if(SECONDS < 3600){
			time = new Date(SECONDS * 1000).toISOString().substring(14, 19) + " Minute";
		}else{
			time = new Date(SECONDS * 1000).toISOString().substring(11, 16) + " Hour";
		}
		channel.send("Playlist ត្រូវបានបញ្ជូលទៅក្នុងបញ្ជី " + `(${playlist.songs.length}) ចម្រៀង (${time})`);
	});

client.login(process.env.TOKEN);
