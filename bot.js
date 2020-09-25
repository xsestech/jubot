const Discord = require('discord.js');
const fs = require('fs');
const config = require("./botcfg.json");
const utf8 = require('utf8');
const botdata = require("./botdata.json");

const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
bot.commands = new Discord.Collection();

const token = config.token;
const prefix = config.prefix;
const emojiroles = config.emojiroles;
let bot_db = botdata;

function db_commit(){
  fs.writeFile( "botdata.json", JSON.stringify(bot_db), "utf8", (err) => {
    if(err) console.log(err);
} );
}

fs.readdir('./cmds/',(err,files)=>{
    if(err) console.log(err);
    let jsfiles = files.filter(f => f.split(".").pop() == "js");
    if(jsfiles.length <=0) console.log("Нет комманд для загрузки")
    console.log(`Заружено ${jsfiles.length}`)
    jsfiles.forEach((f,i)=>{
        let props = require(`./cmds/${f}`);
        console.log(`${i+1}.${f} Загружен`);
        bot.commands.set(props.help.name,props);
    })
})

bot.on('ready', () => {
    console.log(`Бот запустился ${bot.user.username}`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link =>{
      console.log(link)

  });
  bot.user.setActivity("js");
});

bot.on('message', async message => {
  if(message.author.bot) return;
  if(message.channel.type == "dm") return;
  let user = message.author.username;
  let userid = message.author.id;
  let messageArray = message.content.split(" ");
  let command = messageArray[0].toLowerCase();
  let args = messageArray.slice(1);
  if(!message.content.startsWith(prefix)) return;
  let cmd = bot.commands.get(command.slice(prefix.length));
  if(cmd) cmd.run(bot,message,args);
});

bot.on('messageReactionAdd', async (reaction,user)=>{
    if(!user) return;
    if(!reaction.message.channel.guild) return;
    if(!((reaction.message.id == config.msgspec) ||(reaction.message.id == config.msgspec2))) return;
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.log('Something went wrong when fetching the message: ', error);
                return;
      }
    }
    for(let i in emojiroles)
    {
      console.log(`${emojiroles[i]} - ${reaction.emoji.name}`);
      if(reaction.emoji.name == i)
      {
        if(bot_db["users"][reaction.message.guild.member(user).id.toString()] == null)
        {
          bot_db["users"][reaction.message.guild.member(user).id.toString()] = 1
        } else {
          bot_db["users"][reaction.message.guild.member(user).id.toString()] = parseInt(bot_db["users"][reaction.message.guild.member(user).id.toString()]) + 1
        }
        db_commit();
        if(parseInt(bot_db["users"][reaction.message.guild.member(user).id.toString()])>5&&!reaction.message.guild.member(user).hasPermission("ADMINISTRATOR")) return;
        let role = reaction.message.guild.roles.cache.get(emojiroles[i]);
        console.log(`added role ${role.name} - ${reaction.message.guild.member(user).name}`);
        reaction.message.guild.member(user).roles.add(emojiroles[i]);
    }
  }
});
bot.on('messageReactionRemove', async (reaction,user)=>{
  if(!user) return;
  if(user.bot) return;
  if(!reaction.message.channel.guild) return;
  if(!((reaction.message.id == config.msgspec) ||(reaction.message.id == config.msgspec2))) return;
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.log('Something went wrong when fetching the message: ', error);
      return;
    }
  }
  for(let i in emojiroles)
  {
      if(reaction.emoji.name == i)
      {
          let role = reaction.message.guild.roles.cache.get(emojiroles[i]);
          console.log(`removed role ${role.name}`);
          reaction.message.guild.member(user).roles.remove(emojiroles[i]);
          bot_db["users"][reaction.message.guild.member(user).id.toString()] = parseInt(bot_db["users"][reaction.message.guild.member(user).id.toString()]) - 1
          db_commit();
        }
  }

});

bot.login(token);