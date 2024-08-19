const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setPresence({
      activities: [{ name: 'AkiCode & ParsherCode', type: ActivityType.Streaming, url: 'https://www.twitch.tv/example' }],
      status: 'online',
    });

    // Slash komutlarını kaydet
    const guildId = client.config.guildId;
    const guild = client.guilds.cache.get(guildId);
    let commands;

    if (guild) {
      commands = guild.commands;
    } else {
      commands = client.application?.commands;
    }

    if (commands) {
      client.slashCommands.forEach(slashCommand => {
        commands.create(slashCommand.data.toJSON());
      });
    } else {
      console.error('Unable to register slash commands. Guild or application commands are not available.');
    }
  },
};