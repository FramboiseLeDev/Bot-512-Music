const { MessageEmbed } = require("discord.js");

exports.run = async (client, message) => {
  const channel = message.member.voice.channel;
  if (!channel)
    return message.channel.send(
      "Vous devez rejoindre un canal vocal avant d'utiliser cette commande !"
    );

  await channel.leave();

  return message.channel.send(
    new MessageEmbed()
      .setDescription("**Kaori n'est maintenant deconnecter :white_check_mark: **")
      .setColor("BLUE")
  );
};
