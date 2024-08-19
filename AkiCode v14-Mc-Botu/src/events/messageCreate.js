module.exports = {
  name: 'messageCreate',
  execute(client, message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(client.config.prefix)) return;

    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) return;

    try {
      command.run(message, args);
    } catch (error) {
      console.error(error);
      message.reply('Komutu çalıştırırken bir hata oluştu!');
    }
  },
};