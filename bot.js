const Discord = require('discord.js');
const fs = require('fs');
const config = require("./botcfg.json");
const utf8 = require('utf8');

const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
bot.commands = new Discord.Collection();

const token = config.token;
const prefix = config.prefix;

let rolename = ["683721522392727656","683721867252858905","683722236720709748","683723979273273345","683723708178759747","670164002827141145","670164093415456789","670164143466217482","670164229726273576","670163488613597189","670163129090572319","670163263564283904"];
let emojinames = ["🌐","🖥️","📱","💾","🎮","📜","🔷","🕹️","☕","🟨","🐘","🐍"];

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
//   bot.generateInvite(["ADMINISTRATOR"]).then(link =>{
//       console.log(link)
//   })
    
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
    let counter = 1;
    for(i in rolename)
    {
      if(reaction.message.guild.member(user).roles.cache.has(rolename[i]))
      {
        counter++;
      }
    }
    console.log(counter)
    if(counter>5&&!reaction.message.guild.member(user).hasPermission("ADMINISTRATOR")) return;
    if(!user) return;
    if(user.bot) return;
    if(!reaction.message.channel.guild) return;
    console.log(!((reaction.message.id == config.msgspec) ||(reaction.message.id == config.msgspec2)));
    if(!((reaction.message.id == config.msgspec) ||(reaction.message.id == config.msgspec2))) return;
    if (reaction.partial) {
      // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
      try {
        await reaction.fetch();
      } catch (error) {
        console.log('Something went wrong when fetching the message: ', error);
        // Return as `reaction.message.author` may be undefined/null
        return;
      }
    }
    // console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
    // The reaction is now also fully available and the properties will be reflected accurately:
    console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
    
    console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
    
    
    for(let i in emojinames)
    {

        if(reaction.emoji.name == emojinames[i])
        {
            let role = reaction.message.guild.roles.cache.get(rolename[i]);
            console.log(`added role ${role.name}`);
            reaction.message.guild.member(user).roles.add(rolename[i]);
        }
    }
  
});
bot.on('messageReactionRemove', async (reaction,user)=>{
  if(!user) return;
  if(user.bot) return;
  if(!reaction.message.channel.guild) return;
  if(!((reaction.message.id == config.msgspec) ||(reaction.message.id == config.msgspec2))) return;
  
  // if(len([i for i in member.roles if i.id not in config.EXCROLES]) <= config.MAX_ROLES_PER_USER)
  if (reaction.partial) {
    // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
    try {
      await reaction.fetch();
    } catch (error) {
      console.log('Something went wrong when fetching the message: ', error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }
  // console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
  // The reaction is now also fully available and the properties will be reflected accurately:
  console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
  
  console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
  
  
  for(let i in emojinames)
  {

      if(reaction.emoji.name == emojinames[i])
      {
          let role = reaction.message.guild.roles.cache.get(rolename[i]);
          console.log(`removed role ${role.name}`);
          reaction.message.guild.member(user).roles.remove(rolename[i]);
      }
  }

});

bot.login(token);