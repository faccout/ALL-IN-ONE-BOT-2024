const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');
const { serverConfigCollection } = require('../../mongodb');
const commandFolders = ['anime', 'basic', 'fun', 'moderation', 'utility', 'distube music', 'setups'];
const enabledCategories = config.categories;
const excessCommands = config.excessCommands;
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of commands'),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {

            const serverId = interaction.guildId;
            let serverConfig;
            try {
                serverConfig = await serverConfigCollection.findOne({ serverId });
            } catch (err) {
                console.error('Error fetching server configuration from MongoDB:', err);
            }

          
            const serverPrefix = serverConfig && serverConfig.prefix ? serverConfig.prefix : config.prefix;

            const createSlashCommandPages = () => {
                const pages = [];

                const totalServers = interaction.client.guilds.cache.size;
                const totalMembers = interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
                const uptime = process.uptime();
                const uptimeHours = Math.floor(uptime / 3600);
                const uptimeMinutes = Math.floor((uptime % 3600) / 60);
                const uptimeSeconds = Math.floor(uptime % 60);

                const enabledCategoriesList = Object.keys(enabledCategories).filter(category => enabledCategories[category]);
                const disabledCategoriesList = Object.keys(enabledCategories).filter(category => !enabledCategories[category]);

                
                const countJsFiles = (dir) => {
                    try {
                        if (fs.existsSync(dir)) {
                            return fs.readdirSync(dir).filter(file => file.endsWith('.js')).length;
                        }
                        return 0;
                    } catch (err) {
                        console.error(`Error reading directory ${dir}:`, err);
                        return 0;
                    }
                };
                
             
                const getDirectories = (src) => {
                    return fs.readdirSync(src).filter(file => fs.statSync(path.join(src, file)).isDirectory());
                };
                
              
                const commandsDir = path.join(__dirname, '../../commands');
                const excessCommandsDir = path.join(__dirname, '../../excesscommands');
                
             
                const commandFolders = getDirectories(commandsDir);
                const totalCommandFiles = commandFolders.reduce((total, folder) => {
                    const folderPath = path.join(commandsDir, folder);
                    return total + countJsFiles(folderPath);
                }, 0);
                
           
                const excessCommandFolders = getDirectories(excessCommandsDir);
                const totalExcessCommandFiles = excessCommandFolders.reduce((total, folder) => {
                    const folderPath = path.join(excessCommandsDir, folder);
                    return total + countJsFiles(folderPath);
                }, 0);
                
            
                const totalCommands = totalCommandFiles + totalExcessCommandFiles;
                

                pages.push({
                    title: 'Bot Information',
                    description: `Welcome to the help command! This bot provides a variety of commands to enhance your server experience. Below are the categories and the number of commands available in each.`,
                    commands: [
                        `**💜 Bot Developers:** Spella team\n`+
                        `**Bot Version:** 1.1.0\n`+
                        `**Total Servers:** ${totalServers}\n`+
                        `**Total Members:** ${totalMembers}\n`+
                        `**Bot Uptime:** ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s\n`+
                        `**Total Commands:** ${totalCommands}\n`+
                        `**Enabled Categories:** ${enabledCategoriesList.join(', ')}\n`+
                        `**Disabled Categories:** ${disabledCategoriesList.join(', ')}\n`,
                    ],
                    image: "https://cdn.discordapp.com/attachments/1290281849075007519/1317847026830151710/Picsart_24-12-15_16-23-25-851.jpg?ex=67602c2f&is=675edaaf&hm=4426f289f0b3ed750905e44a2b0a20fd53d8f58afbefc0b94e3a9e9519110137&",
                    color: "#FF0000",
                    thumbnail: "https://cdn.discordapp.com/attachments/1290281849075007519/1317847042235699312/Picsart_24-12-15_16-20-34-861.png?ex=67602c33&is=675edab3&hm=93b32127e8c2112b460c9e541371a24217d10ebc524c0b969cf735239187d999&",
                    author: {
                        name: 'Bolt',
                        iconURL: "https://cdn.discordapp.com/attachments/1230824451990622299/1297599083694919741/se.gif?ex=675fae11&is=675e5c91&hm=00b44a2bf6e439894b1a50f6024285e6be4186643076f58796f086b60b82d15e&",
                        url: "https://discord.gg/uwVGgwHV3T"
                    }
                });

                const commandData = {};

                for (const folder of commandFolders) {

                    if (enabledCategories[folder]) { 
                        const commandFiles = fs.readdirSync(path.join(__dirname, `../../commands/${folder}`)).filter(file => file.endsWith('.js'));
                        commandData[folder] = commandFiles.map(file => {
                            const command = require(`../../commands/${folder}/${file}`);
                            return command.data.name;
                        });
                    }
                }

                for (const [category, commands] of Object.entries(commandData)) {
                    const page = {
                        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                        description: `**Total Commands : **${commands.length}\n` +
                            `**Usage : **Both Slash commands and Prefix\n\n` +
                            `${category.charAt(0).toUpperCase() + category.slice(1)} related commands`,
                        commands: commands.map(command => `\`\`${command}\`\``),
                        image: "",
                        color: "#3498db",
                        thumbnail: "",
                        author: {
                            name: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                            iconURL: "",
                            url: "https://discord.gg/uwVGgwHV3T"
                        }
                    };

                    switch (category) {
                        case 'anime':
                            page.image = "https://cdn.discordapp.com/attachments/1290281849075007519/1317849957532962828/360_F_562024161_tGM4lFlnO0OczLYHFFuNNdMUTG9ekHxb.jpg?ex=67602eea&is=675edd6a&hm=67c6fa37ec259a9fa60f791690b0f801cc4fcadde4e1ce57ecf8c109fa8ff232&";
                            page.color = "#ADD8E6";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1290281849075007519/1317847042235699312/Picsart_24-12-15_16-20-34-861.png?ex=67602c33&is=675edab3&hm=93b32127e8c2112b460c9e541371a24217d10ebc524c0b969cf735239187d999&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1297599083694919741/se.gif?ex=675fae11&is=675e5c91&hm=00b44a2bf6e439894b1a50f6024285e6be4186643076f58796f086b60b82d15e&";
                            break;
                        case 'basic':
                            page.image = "https://cdn.discordapp.com/attachments/1290281849075007519/1317847026830151710/Picsart_24-12-15_16-23-25-851.jpg?ex=67602c2f&is=675edaaf&hm=4426f289f0b3ed750905e44a2b0a20fd53d8f58afbefc0b94e3a9e9519110137&";
                            page.color = "#99ccff";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1290281849075007519/1317847042235699312/Picsart_24-12-15_16-20-34-861.png?ex=67602c33&is=675edab3&hm=93b32127e8c2112b460c9e541371a24217d10ebc524c0b969cf735239187d999&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1297599083694919741/se.gif?ex=675fae11&is=675e5c91&hm=00b44a2bf6e439894b1a50f6024285e6be4186643076f58796f086b60b82d15e&";
                            break;
                        case 'fun':
                            page.image = "https://cdn.discordapp.com/attachments/1290281849075007519/1317847026830151710/Picsart_24-12-15_16-23-25-851.jpg?ex=67602c2f&is=675edaaf&hm=4426f289f0b3ed750905e44a2b0a20fd53d8f58afbefc0b94e3a9e9519110137&";
                            page.color = "#ffcc00";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1290281849075007519/1317847042235699312/Picsart_24-12-15_16-20-34-861.png?ex=67602c33&is=675edab3&hm=93b32127e8c2112b460c9e541371a24217d10ebc524c0b969cf735239187d999&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1297599083694919741/se.gif?ex=675fae11&is=675e5c91&hm=00b44a2bf6e439894b1a50f6024285e6be4186643076f58796f086b60b82d15e&";
                            break;
                        case 'moderation':
                            page.image = "https://cdn.discordapp.com/attachments/1290281849075007519/1317847026830151710/Picsart_24-12-15_16-23-25-851.jpg?ex=67602c2f&is=675edaaf&hm=4426f289f0b3ed750905e44a2b0a20fd53d8f58afbefc0b94e3a9e9519110137&";
                            page.color = "#ff0000";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1290281849075007519/1317847042235699312/Picsart_24-12-15_16-20-34-861.png?ex=67602c33&is=675edab3&hm=93b32127e8c2112b460c9e541371a24217d10ebc524c0b969cf735239187d999&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1297599083694919741/se.gif?ex=675fae11&is=675e5c91&hm=00b44a2bf6e439894b1a50f6024285e6be4186643076f58796f086b60b82d15e&";
                            break;
                        case 'utility':
                            page.image = "https://cdn.discordapp.com/attachments/1290281849075007519/1317847026830151710/Picsart_24-12-15_16-23-25-851.jpg?ex=67602c2f&is=675edaaf&hm=4426f289f0b3ed750905e44a2b0a20fd53d8f58afbefc0b94e3a9e9519110137&";
                            page.color = "#00cc99";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1290281849075007519/1317847042235699312/Picsart_24-12-15_16-20-34-861.png?ex=67602c33&is=675edab3&hm=93b32127e8c2112b460c9e541371a24217d10ebc524c0b969cf735239187d999&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1297599083694919741/se.gif?ex=675fae11&is=675e5c91&hm=00b44a2bf6e439894b1a50f6024285e6be4186643076f58796f086b60b82d15e&";
                            break;
                        case 'distube music':
                            page.image = "https://cdn.discordapp.com/attachments/1290281849075007519/1317847060598489098/Picsart_24-12-15_16-30-37-737.png?ex=67602c37&is=675edab7&hm=311d59496aa4fae2db017a4e8c1163c743efdc9035c6bbc37a17cba83ac0ed76&";
                            page.color = "#245c5c";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1273947742724685875/1317841745827860480/sonic_now.png?ex=67602744&is=675ed5c4&hm=90c4164a2abbc8ebd8eb9dbe46ee7aad96b652064772ef576c7cb75dcc8ccea3&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1297599083694919741/se.gif?ex=675fae11&is=675e5c91&hm=00b44a2bf6e439894b1a50f6024285e6be4186643076f58796f086b60b82d15e&";
                            break;
                        case 'setups':
                            page.image = "https://cdn.discordapp.com/attachments/1290281849075007519/1317847026830151710/Picsart_24-12-15_16-23-25-851.jpg?ex=67602c2f&is=675edaaf&hm=4426f289f0b3ed750905e44a2b0a20fd53d8f58afbefc0b94e3a9e9519110137&";
                            page.color = "#ff0000";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1290281849075007519/1317847042235699312/Picsart_24-12-15_16-20-34-861.png?ex=67602c33&is=675edab3&hm=93b32127e8c2112b460c9e541371a24217d10ebc524c0b969cf735239187d999&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1297599083694919741/se.gif?ex=675fae11&is=675e5c91&hm=00b44a2bf6e439894b1a50f6024285e6be4186643076f58796f086b60b82d15e&";
                            break;
                        default:
                            page.color = "#3498db"; // Set a default color if none matches
                            break;
                    }

                    pages.push(page);
                }

                return pages;
            };

            const createPrefixCommandPages = () => {

                const pages = [];
                const totalServers = interaction.client.guilds.cache.size;
                const totalMembers = interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
                const uptime = process.uptime();
                const uptimeHours = Math.floor(uptime / 3600);
                const uptimeMinutes = Math.floor((uptime % 3600) / 60);
                const uptimeSeconds = Math.floor(uptime % 60);

                const enabledCategoriesList = Object.keys(enabledCategories).filter(category => enabledCategories[category]);
                const disabledCategoriesList = Object.keys(enabledCategories).filter(category => !enabledCategories[category]);

                
                const countJsFiles = (dir) => {
                    try {
                        if (fs.existsSync(dir)) {
                            return fs.readdirSync(dir).filter(file => file.endsWith('.js')).length;
                        }
                        return 0;
                    } catch (err) {
                        console.error(`Error reading directory ${dir}:`, err);
                        return 0;
                    }
                };
                
             
                const getDirectories = (src) => {
                    return fs.readdirSync(src).filter(file => fs.statSync(path.join(src, file)).isDirectory());
                };
                
              
                const commandsDir = path.join(__dirname, '../../commands');
                const excessCommandsDir = path.join(__dirname, '../../excesscommands');
                
             
                const commandFolders = getDirectories(commandsDir);
                const totalCommandFiles = commandFolders.reduce((total, folder) => {
                    const folderPath = path.join(commandsDir, folder);
                    return total + countJsFiles(folderPath);
                }, 0);
                
           
                const excessCommandFolders = getDirectories(excessCommandsDir);
                const totalExcessCommandFiles = excessCommandFolders.reduce((total, folder) => {
                    const folderPath = path.join(excessCommandsDir, folder);
                    return total + countJsFiles(folderPath);
                }, 0);
                
            
                const totalCommands = totalCommandFiles + totalExcessCommandFiles;
                pages.push({
                    title: 'Bot Information',
                    description: `Welcome to the help command! This bot provides a variety of commands to enhance your server experience. Below are the categories and the number of commands available in each.`,
                    commands: [
                        `**💜 Bot Developers:** Spella team\n`+
                        `**Bot Version:** 1.1.0\n`+
                        `**Total Servers:** ${totalServers}\n`+
                        `**Total Members:** ${totalMembers}\n`+
                        `**Bot Uptime:** ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s\n`+
                        `**Total Commands:** ${totalCommands}\n`+
                        `**Enabled Categories:** ${enabledCategoriesList.join(', ')}\n`+
                        `**Disabled Categories:** ${disabledCategoriesList.join(', ')}\n`,
                    ],
                    image: "https://cdn.discordapp.com/attachments/1290281849075007519/1317870599732859033/Picsart_24-12-15_18-05-47-283.jpg?ex=67604223&is=675ef0a3&hm=8cd48ee35820174333d506cca66a90eeedfaca340b0692f5251e108380418da2&",
                    color: "#3498db",
                    thumbnail: "https://cdn.discordapp.com/attachments/1290281849075007519/1317870682494734366/Picsart_24-12-15_18-06-41-160.png?ex=67604237&is=675ef0b7&hm=72863013d91c10d07e1cc65612e23c1d0615e735df613f3ffa6013791eaff812&",
                    author: {
                        name: 'Bolt',
                        iconURL: "https://cdn.discordapp.com/attachments/1230824451990622299/1297599084236116039/user.gif?ex=675fae11&is=675e5c91&hm=6e042173bb439db7e5ea4285e0abac73b83dd7b86957a752d7fb5b5fb6d004b4&",
                        url: "https://discord.gg/uwVGgwHV3T"
                    }
                });

                const prefixCommands = {};

                for (const [category, isEnabled] of Object.entries(excessCommands)) {
                    if (isEnabled) {
                        const commandFiles = fs.readdirSync(path.join(__dirname, `../../excesscommands/${category}`)).filter(file => file.endsWith('.js'));
                        prefixCommands[category] = commandFiles.map(file => {
                            const command = require(`../../excesscommands/${category}/${file}`);
                            return {
                                name: command.name,
                                description: command.description
                            };
                        });
                    }
                }

                for (const [category, commands] of Object.entries(prefixCommands)) {
                    const page = {
                        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                        description: `**Total Commands : **${commands.length}\n` +
                            `**Usage : **Only Prefix commands with \`${serverPrefix}\`\n\n` +
                            `${category.charAt(0).toUpperCase() + category.slice(1)} related commands`,
                        commands: commands.map(command => `\`\`${command.name}\`\``),
                        image: "",
                        color: "",
                        thumbnail: "",
                        author: {
                            name: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                            iconURL: "",
                            url: "https://discord.gg/xQF9f9yUEM"
                        }
                    };

                    switch (category) {
                        case 'utility':
                            page.image = "https://cdn.discordapp.com/attachments/1290281849075007519/1317870599732859033/Picsart_24-12-15_18-05-47-283.jpg?ex=67604223&is=675ef0a3&hm=8cd48ee35820174333d506cca66a90eeedfaca340b0692f5251e108380418da2&";
                            page.color = "#8B8000";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1290281849075007519/1317870682494734366/Picsart_24-12-15_18-06-41-160.png?ex=67604237&is=675ef0b7&hm=72863013d91c10d07e1cc65612e23c1d0615e735df613f3ffa6013791eaff812&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1297599084236116039/user.gif?ex=675fae11&is=675e5c91&hm=6e042173bb439db7e5ea4285e0abac73b83dd7b86957a752d7fb5b5fb6d004b4&";
                            break;
                        case 'other':
                            page.image = "https://cdn.discordapp.com/attachments/1290281849075007519/1317870599732859033/Picsart_24-12-15_18-05-47-283.jpg?ex=67604223&is=675ef0a3&hm=8cd48ee35820174333d506cca66a90eeedfaca340b0692f5251e108380418da2&";
                            page.color = "#8B8000";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1290281849075007519/1317870682494734366/Picsart_24-12-15_18-06-41-160.png?ex=67604237&is=675ef0b7&hm=72863013d91c10d07e1cc65612e23c1d0615e735df613f3ffa6013791eaff812&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1297599084236116039/user.gif?ex=675fae11&is=675e5c91&hm=6e042173bb439db7e5ea4285e0abac73b83dd7b86957a752d7fb5b5fb6d004b4&";
                            break;
                        case 'hentai':
                            page.image = "https://cdn.discordapp.com/attachments/1316818681610637362/1317874048763695216/pngtree-the-anime-anime-girl-in-autumn-leaves-wearing-a-long-red-image_2957988.jpg?ex=6760455a&is=675ef3da&hm=e838848791d4a29f91d83973d436a412b6fd9fb8449dd4bd6bdc04800aea5589&";
                            page.color = "#8B8000";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1290281849075007519/1317870682494734366/Picsart_24-12-15_18-06-41-160.png?ex=67604237&is=675ef0b7&hm=72863013d91c10d07e1cc65612e23c1d0615e735df613f3ffa6013791eaff812&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1297599084236116039/user.gif?ex=675fae11&is=675e5c91&hm=6e042173bb439db7e5ea4285e0abac73b83dd7b86957a752d7fb5b5fb6d004b4&";
                            break;
                        case 'lavalink':
                            page.image = "https://cdn.discordapp.com/attachments/1290281849075007519/1317847049420406804/Picsart_24-12-15_16-30-29-773.png?ex=67602c34&is=675edab4&hm=551bb6f47ea9a3ded87417bc47bad544084f11bc02de86977500365921fd8595&";
                            page.color = "#8B8000";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1273947742724685875/1317841745827860480/sonic_now.png?ex=67602744&is=675ed5c4&hm=90c4164a2abbc8ebd8eb9dbe46ee7aad96b652064772ef576c7cb75dcc8ccea3&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1297599084236116039/user.gif?ex=675fae11&is=675e5c91&hm=6e042173bb439db7e5ea4285e0abac73b83dd7b86957a752d7fb5b5fb6d004b4&";
                            break;
                        case 'troll':
                            page.image = "https://cdn.discordapp.com/attachments/1290281849075007519/1317870599732859033/Picsart_24-12-15_18-05-47-283.jpg?ex=67604223&is=675ef0a3&hm=8cd48ee35820174333d506cca66a90eeedfaca340b0692f5251e108380418da2&";
                            page.color = "#8B8000";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1290281849075007519/1317870682494734366/Picsart_24-12-15_18-06-41-160.png?ex=67604237&is=675ef0b7&hm=72863013d91c10d07e1cc65612e23c1d0615e735df613f3ffa6013791eaff812&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1297599084236116039/user.gif?ex=675fae11&is=675e5c91&hm=6e042173bb439db7e5ea4285e0abac73b83dd7b86957a752d7fb5b5fb6d004b4&";
                            break;
                        default:
                            page.color = "#3498db"; // Set a default color if none matches
                            break;
                    }

                    pages.push(page);
                }

                return pages;
            };

            const slashCommandPages = createSlashCommandPages();
            const prefixCommandPages = createPrefixCommandPages();
            let currentPage = 0;
            let isPrefixHelp = false;

            const createEmbed = () => {
                const pages = isPrefixHelp ? prefixCommandPages : slashCommandPages;
                const page = pages[currentPage];

                if (!page) {
                    console.error('Page is undefined');
                    return new EmbedBuilder().setColor('#3498db').setTitle('Error').setDescription('Page not found.');
                }

                const fieldName = page.title === "Bot Information" ? "Additional Information" : "Commands";

                // Ensure a valid color is always set
                const color = page.color || '#3498db';

                return new EmbedBuilder()
                    .setTitle(page.title)
                    .setDescription(page.description)
                    .setColor(color)
                    .setImage(page.image)
                    .setThumbnail(page.thumbnail)
                    .setAuthor({ name: page.author.name, iconURL: page.author.iconURL, url: page.author.url })
                    .addFields({ name: fieldName, value: page.commands.join(', ') });
            };

            const createActionRow = () => {
                const pages = isPrefixHelp ? prefixCommandPages : slashCommandPages;
                return new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('previous1')
                            .setLabel('Previous')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === 0),
                        new ButtonBuilder()
                            .setCustomId('next2')
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === pages.length - 1),
                        new ButtonBuilder()
                            .setCustomId('prefix')
                            .setLabel(isPrefixHelp ? 'Normal Command List' : 'Excess Command List')
                            .setStyle(ButtonStyle.Secondary)
                    );
            };

            const createDropdown = () => {
                const pages = isPrefixHelp ? prefixCommandPages : slashCommandPages;
                return new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('page-select')
                            .setPlaceholder('Select a page')
                            .addOptions(pages.map((page, index) => ({
                                label: page.title,
                                value: index.toString()
                            })))
                    );
            };

            await interaction.reply({ embeds: [createEmbed()], components: [createDropdown(), createActionRow()] });

            const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });

            collector.on('collect', async (button) => {
                if (button.user.id !== interaction.user.id) return;

                if (button.isButton()) {
                    if (button.customId === 'previous1') {
                        currentPage = (currentPage - 1 + (isPrefixHelp ? prefixCommandPages : slashCommandPages).length) % (isPrefixHelp ? prefixCommandPages : slashCommandPages).length;
                    } else if (button.customId === 'next2') {
                        currentPage = (currentPage + 1) % (isPrefixHelp ? prefixCommandPages : slashCommandPages).length;
                    } else if (button.customId === 'prefix') {
                        isPrefixHelp = !isPrefixHelp;
                        currentPage = 0;
                    }
                } else if (button.isSelectMenu()) {
                    currentPage = parseInt(button.values[0]);
                }

                try {
                    await button.update({ embeds: [createEmbed()], components: [createDropdown(), createActionRow()] });
                } catch (error) {
                    //console.error('Error updating the interaction:', error);
                }
            });

            collector.on('end', async () => {
                try {
                    await interaction.editReply({ components: [] });
                } catch (error) {
                    //console.error('Error editing the interaction reply:', error);
                }
            });
           }   else {
                const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({ 
                    name: "Alert!", 
                    iconURL: cmdIcons.dotIcon ,
                    url: "https://discord.gg/xQF9f9yUEM"
                })
                .setDescription('- This command can only be used through slash command!\n- Please use `/help`')
                .setTimestamp();
            
                await interaction.reply({ embeds: [embed] });
            
                } 
    }
};
