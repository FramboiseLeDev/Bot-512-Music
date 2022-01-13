const { MessageEmbed } = require("discord.js");

exports.run = async (client, message) => {
  const channel = message.member.voice.channel;
  if (!channel)
    return message.channel.send(
      "Vous devez rejoindre un canal vocal avant d'utiliser cette commande !"
    );

  if (!channel.permissionsFor(message.client.user).has("CONNECT"))
    return error("Je n'ai pas la permission de rejoindre le channel!");

  if (!channel.permissionsFor(message.client.user).has("SPEAK"))
    return error("Je n'ai pas la permission de parler dans le channel!");

  await channel.join();

  return message.channel.send(
    new MessageEmbed()
      .setDescription("**Kaori est maintenant connecter :white_check_mark: **")
      .setColor("BLUE")
  );
};
