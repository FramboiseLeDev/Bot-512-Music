module.exports = (client) => {
  console.log("[Discord API]: Logged In As " + client.user.tag);
};
module.exports = (client) => {
setInterval(() => {
  let membersCount = client.guilds.cache.map(guild => guild.memberCount).reduce((a, b) => a + b, 0)
  client.user.setActivity(`osu!`, {type: "PLAYING"});
}, 1000 * 60);
}
