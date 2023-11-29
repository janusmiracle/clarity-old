const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channel')
		.setDescription('get user voice channel'),
	async execute(interaction) {
        if (!interaction.member.voice.channel) {
            return await interaction.reply({ content: 'You need to enter a voice channel before using this command.', ephemeral: true });
        }
        else {
            return await interaction.reply({content: `${interaction.member.voice.channel}`, ephemeral: true });
        }
	},
};