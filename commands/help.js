const { MessageEmbed } = require("discord.js");

exports.run = async (client, message) => {
  const commands = `connect\`\` - Rejoindre le canal vocal dans lequel vous vous trouvez
   disconnect\`\` - Quitter le canal vocal dans lequel vous vous trouvez
   play <Nom musique or url>\`\` - Jouer des chansons de youtube
   pause\`\` - Mettre en pause la lecture des chansons en cours sur le serveur
   resume\`\` - Reprendre les chansons en pause sur le serveur
   queue\`\` - Reprendre les chansons en pause sur le serveur
   skip\`\` - Passe à la chanson suivante dans la file d'attente
   stop\`\` - Arrête la chanson et efface la file d'attente
   volume <volume count or none>\`\` - Voir ou régler le volume des chansons
   np\`\` - Voir quelle musique est jouer à l'instant
   loop\`\` - Activer / désactiver la boucle pour la chanson en cours de lecture
   remove <Target number>\`\` - Supprimer une chanson de la file d'attente
   help\`\` - Pour voir cette commande`;

  const revised = commands
    .split("\n")
    .map((x) => "• " + "``" + client.config.prefix + x.trim())
    .join("\n");

  message.channel.send(
    new MessageEmbed()
      .setAuthor(
        "Les commandes de Kaori",
        "https://img.icons8.com/color/2x/services--v2.gif"
      )
      .setColor("RANDOM")
      .setTimestamp()
      .setDescription(revised)
  );
};
