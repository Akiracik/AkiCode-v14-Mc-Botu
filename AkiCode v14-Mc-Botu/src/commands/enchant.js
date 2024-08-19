const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUserData, updateUserData } = require('../utils/database');
const { checkCooldown } = require('../utils/helpers');
const config = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('enchant')
        .setDescription('Kazmayı büyüle')
        .addStringOption(option =>
            option.setName('enchant')
                .setDescription('Uygulanacak büyü')
                .setRequired(true)
                .addChoices(
                    { name: 'Hız', value: 'speed' },
                    { name: 'Şans', value: 'fortune' }
                )),
    
    async execute(interaction) {
        const userId = interaction.user.id;
        const enchantName = interaction.options.getString('enchant');

        const cooldown = checkCooldown(userId, 'enchant');
        if (cooldown) {
            return interaction.reply(`Bu komutu tekrar kullanmak için ${cooldown.toFixed(1)} saniye beklemelisiniz.`);
        }

        const userData = await getUserData(userId);
        const enchant = config.enchants[enchantName];

        if (!enchant) {
            return interaction.reply('Geçersiz büyü seçimi.');
        }

        if (userData.coins < enchant.cost) {
            return interaction.reply(`Bu büyü için yeterli coininiz yok. ${enchant.cost} coin gerekiyor.`);
        }

        userData.coins -= enchant.cost;
        userData.enchants[enchantName] = (userData.enchants[enchantName] || 0) + 1;
        await updateUserData(userId, userData);

        await interaction.reply(`${enchant.name} büyüsü başarıyla uygulandı!`);
    },

    name: 'enchant',
    description: 'Kazmayı büyüle',
    async run(message, args) {
        const userId = message.author.id;
        const enchantName = args[0];

        if (!enchantName || !config.enchants[enchantName]) {
            return message.reply('Geçerli bir büyü adı belirtmelisiniz (speed veya fortune).');
        }

        const cooldown = checkCooldown(userId, 'enchant');
        if (cooldown) {
            return message.reply(`Bu komutu tekrar kullanmak için ${cooldown.toFixed(1)} saniye beklemelisiniz.`);
        }

        const userData = await getUserData(userId);
        const enchant = config.enchants[enchantName];

        if (userData.coins < enchant.cost) {
            return message.reply(`Bu büyü için yeterli coininiz yok. ${enchant.cost} coin gerekiyor.`);
        }

        userData.coins -= enchant.cost;
        userData.enchants[enchantName] = (userData.enchants[enchantName] || 0) + 1;
        await updateUserData(userId, userData);

        await message.reply(`${enchant.name} büyüsü başarıyla uygulandı!`);
    }
};