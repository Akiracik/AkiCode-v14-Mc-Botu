const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUserData, updateUserData } = require('../utils/database');
const { checkCooldown } = require('../utils/helpers');
const config = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('upgrade')
        .setDescription('Kazmayı yükselt'),
    
    async execute(interaction) {
        const userId = interaction.user.id;
        const cooldown = checkCooldown(userId, 'upgrade');
        if (cooldown) {
            return interaction.reply(`Bu komutu tekrar kullanmak için ${cooldown.toFixed(1)} saniye beklemelisiniz.`);
        }

        const userData = await getUserData(userId);
        const currentLevel = userData.upgrades?.pickaxe || 0;

        if (!config.upgrades || !config.upgrades.pickaxe || !config.upgrades.pickaxe.levels) {
            return interaction.reply('Üzgünüm, şu anda yükseltme seçenekleri mevcut değil.');
        }

        if (currentLevel >= config.upgrades.pickaxe.levels.length - 1) {
            return interaction.reply('Kazmanız zaten maksimum seviyede!');
        }

        const nextLevel = config.upgrades.pickaxe.levels[currentLevel + 1];
        if (userData.coins < nextLevel.cost) {
            return interaction.reply(`Yükseltme için yeterli coininiz yok. ${nextLevel.cost} coin gerekiyor.`);
        }

        userData.coins -= nextLevel.cost;
        userData.upgrades = userData.upgrades || {};
        userData.upgrades.pickaxe = currentLevel + 1;
        await updateUserData(userId, userData);

        await interaction.reply(`Kazmanız başarıyla ${nextLevel.name} seviyesine yükseltildi!`);
    },

    name: 'upgrade',
    description: 'Kazmayı yükselt',
    async run(message, args) {
        const userId = message.author.id;
        const cooldown = checkCooldown(userId, 'upgrade');
        if (cooldown) {
            return message.reply(`Bu komutu tekrar kullanmak için ${cooldown.toFixed(1)} saniye beklemelisiniz.`);
        }

        const userData = await getUserData(userId);
        const currentLevel = userData.upgrades?.pickaxe || 0;

        if (!config.upgrades || !config.upgrades.pickaxe || !config.upgrades.pickaxe.levels) {
            return message.reply('Üzgünüm, şu anda yükseltme seçenekleri mevcut değil.');
        }

        if (currentLevel >= config.upgrades.pickaxe.levels.length - 1) {
            return message.reply('Kazmanız zaten maksimum seviyede!');
        }

        const nextLevel = config.upgrades.pickaxe.levels[currentLevel + 1];
        if (userData.coins < nextLevel.cost) {
            return message.reply(`Yükseltme için yeterli coininiz yok. ${nextLevel.cost} coin gerekiyor.`);
        }

        userData.coins -= nextLevel.cost;
        userData.upgrades = userData.upgrades || {};
        userData.upgrades.pickaxe = currentLevel + 1;
        await updateUserData(userId, userData);

        await message.reply(`Kazmanız başarıyla ${nextLevel.name} seviyesine yükseltildi!`);
    }
};