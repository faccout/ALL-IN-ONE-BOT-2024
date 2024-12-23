const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { DisTubeError } = require('distube');
const musicIcons = require('../../UI/icons/musicicons');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription(lang.nowPlayingDescription),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {
            await interaction.deferReply();
        }

        await this.executeNowPlaying(interaction);
    },

    async executePrefix(message) {
        await this.executeNowPlaying(message);
    },

    async executeNowPlaying(source) {
        try {
            const voiceChannel = source.member.voice.channel;

            if (!voiceChannel) {
                return source.channel.send(lang.nowPlayingNoVoiceChannel);
            }

            const permissions = voiceChannel.permissionsFor(source.client.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                

            const queue = source.client.distube.getQueue(source.guildId);
            if (!queue || !queue.playing) {
                const noSongEmbed = new EmbedBuilder()
                    .setColor(0x0000FF)
                    .setAuthor({ 
                        name: lang.nowPlayingNoSongTitle, 
                        iconURL: musicIcons.wrongIcon,
                        url: "https://discord.gg/uwVGgwHV3T"
                    })
                    .setFooter({ text: lang.nowPlayingFooterText, iconURL: musicIcons.footerIcon })
                    .setDescription(lang.nowPlayingNoSong);


            }

            const currentSong = queue.songs[0];
            const nowPlayingEmbed = new EmbedBuilder()
                .setColor(0x0000FF)
                .setAuthor({ 
                    name: lang.nowPlayingTitle, 
                    iconURL: musicIcons.playerIcon,
                    url: "https://discord.gg/uwVGgwHV3T"
                })
                .setDescription(`- ${lang.nowPlayingDescriptionText}\n[${currentSong.name}](${currentSong.url})`)
                .setFooter({ text: lang.nowPlayingFooterText, iconURL: musicIcons.footerIcon })
                .addFields(
                    { name: lang.nowPlayingDuration, value: currentSong.formattedDuration },
                    { name: lang.nowPlayingRequestedBy, value: currentSong.user.username }
                );

            
        } catch (error) {
            console.error(error);

            if (error instanceof DisTubeError && error.code === 'NO_QUEUE') {
                const noQueueEmbed = new EmbedBuilder()
                    .setColor(0x0000FF)
                    .setAuthor({ 
                        name: lang.nowPlayingNoQueueTitle, 
                        iconURL: musicIcons.wrongIcon,
                        url: "https://discord.gg/uwVGgwHV3T"
                    })
                    .setFooter({ text: lang.nowPlayingFooterText, iconURL: musicIcons.footerIcon })
                    .setDescription(lang.nowPlayingNoQueue);

                return source.channel.send({ embeds: [noQueueEmbed] });
            } else {
                return source.channel.send(lang.nowPlayingError);
            }
        }
    },
};
