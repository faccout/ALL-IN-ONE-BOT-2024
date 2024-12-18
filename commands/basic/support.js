const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const lang = require('../../events/loadLanguage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription(lang.supportDescription),
    async execute(interaction) {
        const supportServerLink = lang.supportServerLink;
        const githubLink = lang.githubLink;
        const replitLink = lang.replitLink;
        const youtubeLink = lang.youtubeLink;

        const embed = new EmbedBuilder()
            .setColor('#b300ff')
            .setAuthor({
                name: lang.supportTitle,
                iconURL: "https://cdn.discordapp.com/attachments/1273947742724685875/1277995111422361631/59CB4C83-CB04-428B-BF26-6E82A1981F83.png?ex=676381f2&is=67623072&hm=641ee6e343e5c6e9604ef8feb48186871c954dc89ee214b7e4162da4dd476dff&",
                url: "https://discord.gg/2gzCDFVhUP"
            })
            .setDescription(`
                ➡️ **${lang.supportDescriptionTitle}:**
                - ${lang.discord} - ${supportServerLink}
                
        ➡️ **${lang.followUsOn}: https://spellaexp.my.canva.site/web**
                
            `)
            .setImage(lang.supportImageURL)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
