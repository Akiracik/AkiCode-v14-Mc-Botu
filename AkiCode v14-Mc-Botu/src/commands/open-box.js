const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUserData, updateUserData } = require('../utils/database');
const { checkCooldown } = require('../utils/helpers');
const config = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('open-box')
        .setDescription('Bir kutu aç'),
    
    async execute(interaction) {
        const userId = interaction.user.id;
        const cooldown = checkCooldown(userId, 'openBox');
        if (cooldown) {
            return interaction.reply(`Bu komutu tekrar kullanmak için ${cooldown.toFixed(1)} saniye beklemelisiniz.`);
        }

        const userData = await getUserData(userId);

        if (userData.coins < config.boxCost) {
            return interaction.reply(`Kutu açmak için yeterli coininiz yok. ${config.boxCost} coin gerekiyor.`);
        }

        userData.coins -= config.boxCost;
        const reward = config.boxRewards[Math.floor(Math.random() * config.boxRewards.length)];
        userData.inventory[reward] = (userData.inventory[reward] || 0) + 1;

        await updateUserData(userId, userData);

        await interaction.reply(`Kutuyu açtınız ve 1 adet ${config.items[reward].name} kazandınız!`);
    },

    name: 'open-box',
    description: 'Bir kutu aç',
    async run(message, args) {
        const userId = message.author.id;
        const cooldown = checkCooldown(userId, 'openBox');
        if (cooldown) {
            return message.reply(`Bu komutu tekrar kullanmak için ${cooldown.toFixed(1)} saniye beklemelisiniz.`);
        }

        const userData = await getUserData(userId);

        if (userData.coins < config.boxCost) {
            return message.reply(`Kutu açmak için yeterli coininiz yok. ${config.boxCost} coin gerekiyor.`);
        }

        userData.coins -= config.boxCost;
        const reward = config.boxRewards[Math.floor(Math.random() * config.boxRewards.length)];
        userData.inventory[reward] = (userData.inventory[reward] || 0) + 1;

        await updateUserData(userId, userData);

        await message.reply(`Kutuyu açtınız ve 1 adet ${config.items[reward].name} kazandınız!`);
    }
};