const Discord = require('discord.js');
const { DisTube, SearchResultType, Song } = require('distube');
const {prefix} = require("./config.json");
require('dotenv').config();
const client = new Discord.Client({
	setMaxListeners: 0,
	intents: ['MessageContent','Guilds', 'GuildVoiceStates', 'GuildMessages'],
});

client.setMaxListeners(0);

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
		return message.channel.send(`π Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
	}

	if (cmd === 'play' || cmd === 'p') {
		const voiceChannel = message.member?.voice?.channel;
		if (voiceChannel) {
			if(args.join(' ') === ""){
				message.channel.send(
					'>>> ααΌααααααΌααααααααααααα¬ααΈααααα»α Command!π',
				);
				return;
			}
			return distube.play(voiceChannel, args.join(" "));
		} else {
			message.channel.send(
				'>>> ααΌαααΌα Voice Channel ααΆαα»ααα·ααα»αααΉαααΆα cmd!π',
			);
			return;
		}
	}

	if(queue){
		
		if (cmd === "repeat" || cmd === "rp" || cmd === "loop") {
			const voiceChannel = message.member?.voice?.channel;
			if (!voiceChannel) return;

			if(args.join(' ') === "") {
				return message.channel.send(
					'>>> ααΌααααααΌα Argument in Command (on,off,queue)! , Ex: .repeat on'
				);
			}

			if(args[0].toString() === "on"){
				distube.setRepeatMode(message, 1)
				message.reply("ααααα·ααα»αααααΌαααΆαααΎαααααΎααααα! π");
			}else if (args[0].toString() === "off"){
				distube.setRepeatMode(message, 0)
				message.reply("ααααα·ααα»αααααΌαααΆααα·α! π΄");
			}else if (args[0].toString() === "queue" || args[0].toString() === "q"){
				distube.setRepeatMode(message, 2)
				message.reply("ααααα·ααα»αααααΌαααΆαααΎαααααΎαααααΈααΆααααΌα! π");
			}
		}


		if (cmd === 'stop' || cmd === 's') {
			const voiceChannel = message.member?.voice?.channel;
			if (!voiceChannel) return;
			distube.stop(message);
			message.channel.send('ααααααααααΌαααΆααααααα! π΅βπ«');
		}

		if (cmd === 'leave' || cmd === 'l') {
			const voiceChannel = message.member?.voice?.channel;
			if (!voiceChannel) return;
			distube.voices.get(message)?.leave();
			message.channel.send('ααΆαααΆαααα, αα½αβααααΆβαααβααααα! π');
		}

		if (cmd === 'resume' || cmd === 'rs') {
			const voiceChannel = message.member?.voice?.channel;
			if (!voiceChannel) return;
			distube.resume(message);
			message.reply("ααααααααΆαααΆαααααα! βΆοΈ");
		}

		if (cmd === 'pause' || cmd === 'ps') {
			const voiceChannel = message.member?.voice?.channel;
			if (!voiceChannel) return;
			distube.pause(message);
			message.reply("ααααααααΆααααα»α! βΉοΈ");
		}

		if (cmd === 'n' || cmd === 'next') {
			const voiceChannel = message.member?.voice?.channel;
			if (!voiceChannel) return;

			if(queue.songs.length > 1){
				distube.skip(message);
			}else{
				message.reply('α’ααααΆααααααααααααΆαααα! π');
			}
		}

		if (cmd === 'previous' || cmd === 'pv') {
			const voiceChannel = message.member?.voice?.channel;
			if (!voiceChannel) return;
			if(queue.previousSongs.length > 0){
				distube.previous(message);
				message.reply('ααΆαααΆαααααααααα»αααα! π₯²');
			}else{
				message.reply('α’ααααΆααααααααα»αααΉαααααααααααα! π');
			}
		}

		if (cmd === 'seek' || cmd === 'sk') {

		const voiceChannel = message.member?.voice?.channel;
		if (!voiceChannel) return;

			if(args.join(' ') === ""){
				distube.seek(message, 10);
				return message.reply("ααααααααΆαααΆαααα·ααΆααΈ ααΈ 10 αααααααα! βΏ");
			}

			const time = Number(args[0])
			if (isNaN(time)) return message.reply("ααΌαααΆαααα·ααΆααΈαααααααΌαααΆα’ααααΆαααααΉαααααΌα! π");
			distube.seek(message, time);
			return message.reply("ααααααααΆαααΆαααα·ααΆααΈ ααΈ " + time + "! βΏ");
		}

		if (cmd === 'forward' || cmd === 'fw') {
			const voiceChannel = message.member?.voice?.channel;
			if (!voiceChannel) return;

			if(args.join(' ') === ""){
				distube.seek(message, (queue.currentTime + 10));
				return message.reply("ααααααααΆαααΆαααα»α 10 αα·ααΆααΈ! β©");
			}

			const time = Number(args[0])
			if (isNaN(time)) return message.reply("ααΌαααΆαααα·ααΆααΈαααααααΌαααΆα’ααααΆαααααΉαααααΌα! π");
			distube.seek(message, queue.currentTime + time);
			return message.reply("ααααααααΆαααΆαααα»α "+ parseInt(args[0]) +" αα·ααΆααΈ! β©");
		}

		if (cmd === 'rewind' || cmd === 'rw') {
			
			const voiceChannel = message.member?.voice?.channel;
			if (!voiceChannel) return;

			const time = Number(args[0])
			if (isNaN(time)) return message.reply("ααΌαααΆαααα·ααΆααΈαααααααΌαααΆα’ααααΆαααααΉαααααΌα! π");

			if(queue.currentTime - time <= 0){
				distube.seek(message, 0);
				message.reply("ααααααααΆαααΆαααααα»αααΎααα·α!");
			}else{
				distube.seek(message, queue.currentTime - time);
				message.reply("ααααααααΆαααΆααααααα "+ parseInt(args[0]) +" αα·ααΆααΈ! βͺ");
			}
			return;
		}

		if (cmd === 'volume' || cmd === 'vol') {
			
			// if(args.join(' ') === ""){
			// 	message.reply("ααα‘αα = " + queue.getVol)
				
			// }
			const voiceChannel = message.member?.voice?.channel;
			if (!voiceChannel) return;

			const vol = Number(args[0])
			if (isNaN(vol)) return message.reply("ααΌαααΆαααααα½αααα‘ααα’ααααΆαααααΉαααααΌα! π");

			if(vol >= 0){
				queue.setVolume(vol);
				return message.reply("ααα‘ααααΆαααΆαααααααα½α " + vol + "%");
			}else{
				return message.reply("ααΌαααΆαααααα½αααα‘ααα’ααααΆαααααΉαααααΌα! π");
			}
		}

		if (cmd === 'queue' || cmd === 'q') {

			const voiceChannel = message.member?.voice?.channel;
			if (!voiceChannel) return;
			
			if (!queue) {
				return message.channel.send('α’ααααΆαα’αΈααΆαααα! π');
			} else {
				return message.channel.send(
					`αααααα»ααααααΈ:\n${queue.songs
						.map(
							(song, id) =>
								`**${id ? id : 'π αααα»αααΆαα'}**. - ${
									song.name
								} - \`${song.formattedDuration}\``,
						)
						.slice(0, 10)
						.join('\n')}`,
				);
			}
		}

		if(cmd === 'shuffle' || cmd === 'sf'){
			const voiceChannel = message.member?.voice?.channel;
			if (!voiceChannel) return;
			distube.shuffle(message);
			return message.channel.send(`αααααααααα½α ${queue.songs.length} ααααΌαααΆα Shuffle`);
		}

		// if (cmd === 'remove' || cmd === 'rm'){
		// 	const voiceChannel = message.member?.voice?.channel;
		// 	if (!voiceChannel) return;
		// 	const num = Number(args[0])
		// 	if (isNaN(num)) return message.reply("ααΌαααΆαααααα’ααααΆαααααΉαααααΌα! π");
		// }
	}
});

distube
	.on("playSong", (queue,song) => {
		let playembed = new Discord.EmbedBuilder()
		.setColor(Discord.Colors.Red)
		.setTitle(`πΆ αααα»αααΆαα `)
		.setDescription(`[${song.name}]`)
		.setImage(song.thumbnail)
		.setTimestamp()
		.addFields({ name: 'αααααα α', value: song.formattedDuration.toString(), inline: true })
		.setFooter({ text: `Request By πΈ ${author.username} πΈ`, iconURL: author.displayAvatarURL({ dynamic: true })});
		channel.send({ embeds: [playembed] });
	}).on("addSong", (queue, song) => {
		let playembed = new Discord.EmbedBuilder()
		.setColor(Discord.Colors.Green)
		.setTitle(`π’ ααΆαααΆαααααααα»ααααααΈαααααα `)
		.setDescription(`[${song.name}]`)
		.setImage(song.thumbnail)
		.setTimestamp()
		.addFields({ name: 'αααααα α', value: song.formattedDuration.toString()})
		.setFooter({ text: `Request By πΉ ${author.username} πΉ`, iconURL: author.displayAvatarURL({ dynamic: true })});
		channel.send({ embeds: [playembed] });
	}).on('finish', () => {
		channel.send('α’αααααααααααααα»ααααααΈ! ππ»');
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
		channel.send("Playlist ααααΌαααΆααααααΌααααααα»ααααααΈ " + `(${playlist.songs.length}) αααααα (${time})`);
	});

client.login(process.env.TOKEN);
