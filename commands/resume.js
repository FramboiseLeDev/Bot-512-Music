const { MessageEmbed } = require("discord.js");

exports.run = async (client, message) => {
  const channel = message.member.voice.channel;
  if (!channel)
    return message.channel.send(
      "Vous devez rejoindre un canal vocal avant d'utiliser cette commande !"
    );
  let queue = message.client.queue.get(message.guild.id);
  if (!queue)
    return message.channel.send(
      new MessageEmbed()
        .setDescription(":x: Il n'y a pas de chansons en lecture sur ce serveur !")
        .setColor("RED")
    );
  if (queue.playing == true)
    return message.channel.send(
      new MessageEmbed()
        .setDescription(":x: La musique est déjà en cours !")
        .setColor("RED")
    );
  queue.connection.dispatcher.resume();
  message.react("▶");
  queue.playing = true;
  return message.channel.send(
    new MessageEmbed()
    .setDescription("**Kaori a bien relancer la musique :white_check_mark:**")
    .setColor("BLUE")
  );
};
