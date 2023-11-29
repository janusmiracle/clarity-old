const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('disconnect from voice channel'),
	async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return await interaction.reply({ content: 'You need to enter a voice channel before using this command.', ephemeral: true });
        }
        else {
            const connection = getVoiceConnection(voiceChannel.guild.id);
            connection.destroy();
            return await interaction.reply({content: `Clarity has disconnected from ${voiceChannel}.`, ephemeral: true });
        }
	},
};