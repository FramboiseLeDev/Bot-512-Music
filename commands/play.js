const ytdl = require("discord-ytdl-core");
const youtubeScraper = require("yt-search");
const yt = require("ytdl-core");
const { MessageEmbed, Util } = require("discord.js");
const forHumans = require("../utils/forhumans.js");

exports.run = async (client, message, args) => {
  const channel = message.member.voice.channel;

  const error = (err) => message.channel.send(err);
  const send = (content) => message.channel.send(content);
  const setqueue = (id, obj) => message.client.queue.set(id, obj);
  const deletequeue = (id) => message.client.queue.delete(id);
  var song;

  if (!channel) return error("Vous devez rejoindre un channel vocale pour jouer de la musique !");

  if (!channel.permissionsFor(message.client.user).has("CONNECT"))
    return error("Je n'ai pas la permission de rejoindre ce channel!");

  if (!channel.permissionsFor(message.client.user).has("SPEAK"))
    return error("Je n'ai pas la permission de parler dans ce channel!");

  const query = args.join(" ");

  if (!query) return error("Tu n’as pas donné de nom de chanson à jouer !");

  if (query.includes("www.youtube.com")) {
    try {
      const ytdata = await await yt.getBasicInfo(query);
      if (!ytdata) return error("Aucune chanson trouvée pour l’url fournie!");
      song = {
        name: Util.escapeMarkdown(ytdata.videoDetails.title),
        thumbnail:
          ytdata.player_response.videoDetails.thumbnail.thumbnails[0].url,
        requested: message.author,
        videoId: ytdata.videoDetails.videoId,
        duration: forHumans(ytdata.videoDetails.lengthSeconds),
        url: ytdata.videoDetails.video_url,
        views: ytdata.videoDetails.viewCount,
      };
    } catch (e) {
      console.log(e);
      return error("Une erreur s’est produite, veuillez vérifier la console!");
    }
  } else {
    try {
      const fetched = await (await youtubeScraper(query)).videos;
      if (fetched.length === 0 || !fetched)
        return error("Je n’ai pas trouvé la chanson que tu as demandée !");
      const data = fetched[0];
      song = {
        name: Util.escapeMarkdown(data.title),
        thumbnail: data.image,
        requested: message.author,
        videoId: data.videoId,
        duration: data.duration.toString(),
        url: data.url,
        views: data.views,
      };
    } catch (err) {
      console.log(err);
      return error("Une erreur s’est produite, veuillez vérifier la console!");
    }
  }

  var list = message.client.queue.get(message.guild.id);

  if (list) {
    list.queue.push(song);
    return send(
      new MessageEmbed()
        .setAuthor(
          "La chanson a été ajoutée à la file d'attente",
          "https://img.icons8.com/color/2x/cd--v3.gif"
        )
        .setColor("RANDOM")
        .setThumbnail(song.thumbnail)
        .addField("Nom de la musique", song.name, false)
        .addField("Vues", song.views, false)
        .addField("Durée", song.duration, false)
        .addField("Demander par", song.requested.tag, false)
        .setFooter("Positionner " + list.queue.length + " In the queue")
    );
  }

  const structure = {
    channel: message.channel,
    vc: channel,
    volume: 85,
    playing: true,
    queue: [],
    connection: null,
  };

  setqueue(message.guild.id, structure);
  structure.queue.push(song);

  try {
    const join = await channel.join();
    structure.connection = join;
    play(structure.queue[0]);
  } catch (e) {
    console.log(e);
    deletequeue(message.guild.id);
    return error("Je n’ai pas pu rejoindre le canal vocal, veuillez vérifier la console!");
  }

  async function play(track) {
    try {
      const data = message.client.queue.get(message.guild.id);
      if (!track) {
        data.channel.send("La file d’attente est vide, quitte le canal vocal!");
        message.guild.me.voice.channel.leave();
        return deletequeue(message.guild.id);
      }
      data.connection.on("disconnect", () => deletequeue(message.guild.id));
      const source = await ytdl(track.url, {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25,
        opusEncoded: true,
      });
      const player = data.connection
        .play(source, { type: "opus" })
        .on("finish", () => {
          var removed = data.queue.shift();
          if(data.loop == true){
            data.queue.push(removed)
          }
          play(data.queue[0]);
        });
      player.setVolumeLogarithmic(data.volume / 100);
      data.channel.send(
        new MessageEmbed()
          .setAuthor(
            "Kaori a commencé à jouer",
            "https://img.icons8.com/color/2x/cd--v3.gif"
          )
          .setColor("RANDOM")
          .setThumbnail(track.thumbnail)
          .addField("Titre de la musique", track.name, false)
          .addField("Vues", track.views, false)
          .addField("Durée", track.duration, false)
          .addField("Demander par", track.requested, false)
          .setFooter("Kaori utilise youtube")
      );
    } catch (e) {
      console.error(e);
    }
  }
};
