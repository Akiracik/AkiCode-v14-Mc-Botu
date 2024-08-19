const { cooldowns } = require('../config');

function checkCooldown(userId, command) {
    if (!cooldowns[command]) return false;

    const now = Date.now();
    const cooldownAmount = cooldowns[command];

    if (cooldowns[userId] && cooldowns[userId][command] > now) {
        const timeLeft = (cooldowns[userId][command] - now) / 1000;
        return timeLeft;
    }

    if (!cooldowns[userId]) {
        cooldowns[userId] = {};
    }

    cooldowns[userId][command] = now + cooldownAmount;
    return false;
}

module.exports = {
    checkCooldown
};