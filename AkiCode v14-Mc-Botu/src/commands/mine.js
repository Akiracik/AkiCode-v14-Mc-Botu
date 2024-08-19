const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUserData, updateUserData } = require('../utils/database');
const { checkCooldown } = require('../utils/helpers');
const config = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mine')
        .setDescription('Madencilik yap ve kaynak topla'),
    
    async execute(interaction) {
        const userId = interaction.user.id;
        const cooldown = checkCooldown(userId, 'mine');
        if (cooldown) {
            return interaction.reply(`Bu komutu tekrar kullanmak için ${cooldown.toFixed(1)} saniye beklemelisiniz.`);
        }

        const userData = await getUserData(userId);
        const minedItem = mineItem(userData);
        userData.inventory[minedItem] = (userData.inventory[minedItem] || 0) + 1;
        await updateUserData(userId, userData);

        await interaction.reply(`Tebrikler! 1 adet ${config.items[minedItem].name} kazandınız!`);
    },

    name: 'mine',
    description: 'Madencilik yap ve kaynak topla',
    async run(message, args) {
        const userId = message.author.id;
        const cooldown = checkCooldown(userId, 'mine');
        if (cooldown) {
            return message.reply(`Bu komutu tekrar kullanmak için ${cooldown.toFixed(1)} saniye beklemelisiniz.`);
        }

        const userData = await getUserData(userId);
        const minedItem = mineItem(userData);
        userData.inventory[minedItem] = (userData.inventory[minedItem] || 0) + 1;
        await updateUserData(userId, userData);

        await message.reply(`Tebrikler! 1 adet ${config.items[minedItem].name} kazandınız!`);
    }
};

function mineItem(userData) {
    const roll = Math.random();
    if (roll < 0.6) return 'stone';
    if (roll < 0.85) return 'iron';
    if (roll < 0.95) return 'gold';
    return 'diamond';
}