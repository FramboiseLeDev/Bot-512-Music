const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const channel = message.member.voice.channel;
  if (!channel)
    return message.channel.send(
      "Vous devez rejoindre un canal vocal avant d'utiliser cette commande !"
    );
  if (!args[0])
    return message.channel.send(
      new MessageEmbed()
        .setDescription(":x: Aucun numéro de chanson fourni")
        .setColor("RED")
    );
  if (isNaN(args[0]))
    return message.channel.send(
      new MessageEmbed()
        .setDescription(":x: **Args doit être un nombre [Exemple: 1!remove 2]**")
        .setColor("RED")
    );
  let queue = message.client.queue.get(message.guild.id);
  if (args[0] == 1)
    return message.channel.send(
      new MessageEmbed()
        .setDescription(
          ":x: **Impossible de supprimer la chanson en cours de lecture, utilisez la commande skip**"
        )
        .setColor("RED")
    );
  if (queue.queue.length == 1)
    return message.channel.send(
      new MessageEmbed()
        .setDescription(
          ":x: **Impossible de supprimer lorsqu'une seule chanson est en cours de lecture, utilisez la commande stop**"
        )
        .setColor("RED")
    );
  if (args[0] > queue.queue.length)
    return message.channel.send(
      new MessageEmbed()
        .setDescription(":x: **La file d'attente n'a pas beaucoup de chansons!**")
        .setColor("RED")
    );
  if (!queue)
    return message.channel.send(
      new MessageEmbed()
        .setDescription(":x: **Il n'y a pas de chansons en lecture sur ce serveur!**")
        .setColor("RED")
    );
  var name = queue.queue[args[0] - 1].name;
  queue.queue.splice(args[0] - 1);
  return message.channel.send(
    new MessageEmbed()
      .setDescription(
        "**Vous avez supprimez" + " " + name + " " + "de la file d'attente :white_check_mark: **"
      )
      .setTimestamp()
      .setColor("BLUE")
  );
};
