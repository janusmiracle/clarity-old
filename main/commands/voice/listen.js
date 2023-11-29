const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, EndBehaviorType, VoiceReceiver } = require('@discordjs/voice');
const { opus } = require('prism-media');
const { createWriteStream } = require('fs');
const { pipeline } = require('node:stream');
const { EventEmitter } = require('events');

// This removes the error and the code runs fine without errors, but potential memory leak
//EventEmitter.setMaxListeners(0);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listen')
		.setDescription('join user voice channel and detect speaking users'),
	async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: true,
        });

        // list of users in voice channel
        const members = voiceChannel.members;
        const userMap = [];

        // Perhaps check if a user is a bot rather than just Clarity -- go thru user docs
        members.filter((user) => user.displayName !== 'Clarity')
        .forEach((user) => {
            // map userid to user display name
            userMap[user.id] = user.displayName;
        })

        // main: when user is speaking
        connection.receiver.speaking.on('start', (userId) => {
            console.log(`${userMap[userId]} is currently speaking.`);

            const opusStream = connection.receiver.subscribe(userId, {
                end: {
                    behavior: EndBehaviorType.AfterSilence,
                    duration: 1000,
                },
            });
            createListeningStream(opusStream, userId, userMap);
        });

        connection.receiver.speaking.on('end', () => {
            console.log('\nUser has stopped speaking.\n');
            //connection.receiever.removeListener();
        });


        connection.receiver.speaking.on('error', console.log);

        //connection.receiver.speaking.off()
        
        await interaction.reply({ content: 'Listening..', ephemeral: true });
	},
};

function createListeningStream(opusStream, userId, userMap) {

    const oggStream = new opus.OggLogicalBitstream(
        {
            opusHead: new opus.OpusHead({
                channelCount: 2,
                sampleRate: 48000,
            }),
            pageSizeControl: {
                maxPackets: 10,
            },
            crc: true
        }
    );

    console.log(`Opus stream: ${opusStream}`);
    console.log(`Ogg Stream: ${oggStream}`);

    const filename = `./recordings/${Date.now()}-${userMap[userId]}.ogg`;

    const out = createWriteStream(filename);

    console.log(`Started recording ${filename}`);

    pipeline(opusStream, oggStream, out, (err) => {
        if (err) {
            console.warn(`Error recording file ${filename} - ${err.message}`);
        } else {
            console.log(`Recorded ${filename}`);
            out.end();
            
        }
    });
}