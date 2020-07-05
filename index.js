const Discord = require('discord.js');
const bot = new Discord.Client();

const token = "<token>" ; 
bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

var servers = {};

const ytdl = require("ytdl-core");

const PREFIX = '!';

bot.on('message' , msg=>{
  if(msg.content == 'hey bot' ){
    msg.reply('Hey') ;
  }
  else if(msg.content == 'What did u learn today?'){
    msg.channel.send("Well today I learnt how to play songs xD.\nUse !play <link> to play a song")
  }
})

bot.on('message' , message=>{
  
  let args = message.content.substring(PREFIX.length).split(" ");

  switch(args[0]){
    case 'play':
      
      function play(connection, message){
        var server = servers[message.guild.id];

        server.dispatcher = connection.play(ytdl(server.queue[0], {filter:"audioonly"}));

        server.queue.shift();

        server.dispatcher.on("end" , function(){
          if(server.queue[0]){
            play(connection, message);
          }else{
            connection.disconnect();
          }
        })
      }

    
      
    
      if(!args[1]){
        message.channel.send("you need to provide a link");
        return;
      }
     
      if(!message.member.voice.channel){
        message.channel.send("You must be in a channel to play songs");
        
        return;
      }else message.member.voice.channel.join()

      if(!servers[message.guild.id]) servers[message.guild.id] = {
        queue: []
      }

      var server = servers[message.guild.id];

      server.queue.push(args[1]);

      if(!message.member.voice.connection) message.member.voice.channel.join().then(function(connection){
        play(connection, message);
      })

      break;

      case 'skip':
        var server = servers[message.guild.id];
        if(server.dispatcher) server.dispatcher.end();
        message.channel.send("Okie , I'm Skippin it!");
        break;

      case 'stop' :
        var server = servers[message.guild.id];
        if(message.guild.voice.connection){
          for(var i = server.queue.length - 1; i>=0 ; i--){
            server.queue.splice(i, 1 )
          }

          server.dispatcher.end();
          message.channel.send("Bye , I'm leaving.");
          console.log("stopped the playing");
        }
        
        if(message.guild.connection) message.guild.voice.connection.disconnect();
    
      break;  
    }
});

bot.login(token);