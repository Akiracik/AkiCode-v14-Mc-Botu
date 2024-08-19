const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUserData, updateUserData } = require('../utils/database');
const { checkCooldown } = require('../utils/helpers');
const config = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sell')
        .setDescription('Envanterindeki eşyaları sat'),
    
    async execute(interaction) {
        const userId = interaction.user.id;
        const cooldown = checkCooldown(userId, 'sell');
        if (cooldown) {
            return interaction.reply(`Bu komutu tekrar kullanmak için ${cooldown.toFixed(1)} saniye beklemelisiniz.`);
        }

        const userData = await getUserData(userId);
        let totalValue = 0;

        for (const [item, quantity] of Object.entries(userData.inventory)) {
            if (config.items[item]) {
                totalValue += config.items[item].value * quantity;
                delete userData.inventory[item];
            }
        }

        userData.coins = (userData.coins || 0) + totalValue;
        await updateUserData(userId, userData);

        await interaction.reply(`Tüm eşyalarınızı sattınız ve ${totalValue} coin kazandınız!`);
    },

    name: 'sell',
    description: 'Envanterindeki eşyaları sat',
    async run(message, args) {
        const userId = message.author.id;
        const cooldown = checkCooldown(userId, 'sell');
        if (cooldown) {
            return message.reply(`Bu komutu tekrar kullanmak için ${cooldown.toFixed(1)} saniye beklemelisiniz.`);
        }

        const userData = await getUserData(userId);
        let totalValue = 0;

        for (const [item, quantity] of Object.entries(userData.inventory)) {
            if (config.items[item]) {
                totalValue += config.items[item].value * quantity;
                delete userData.inventory[item];
            }
        }

        userData.coins = (userData.coins || 0) + totalValue;
        await updateUserData(userId, userData);

        await message.reply(`Tüm eşyalarınızı sattınız ve ${totalValue} coin kazandınız!`);
    }
};