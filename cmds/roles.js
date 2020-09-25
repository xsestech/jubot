const Discord = require('discord.js');
const fs = require('fs');

module.exports.run = async (bot, message, args)=>{
    if(!message.member.hasPermission("ADMINISTRATOR")) return;
    let msg1 = "**Для получения ролей нажмите на реакцию**\n*Выбор специализации:*\n•🌐Web dev\n•🖥️Desktop dev\n•📱Mobile dev\n•💾Data science && AI\n•🎮Game dev";
    let msg2 = "*Выбор языка:*\n•🔷C/C++\n•🕹️C#\n•☕Java'вист\n•🟨Js'ник\n•🐘PHP'шник\n•🐍 Питонист";
    message.channel.send(msg1).catch();
    message.channel.send(msg2).catch();
};
module.exports.help = {
    name:"fsdskjklkjlkj"
};