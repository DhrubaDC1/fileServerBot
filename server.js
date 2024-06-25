const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');
const https = require('https');
require('dotenv').config();
const client = new Client({ 
  intents: [
      GatewayIntentBits.Guilds, 
      GatewayIntentBits.GuildMessages, 
      GatewayIntentBits.MessageContent
  ] 
});
const discordToken = process.env.DISCORD_TOKEN;

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('messageCreate', async message => {
  // Check if the message has any attachments
  if (message.attachments.size > 0) {
      try {
          // Iterate over each attachment
          message.attachments.forEach(async attachment => {
              // Log attachment details
          console.log(`Received attachment: ${attachment.name} (${attachment.size} bytes)`);

          // Optionally, you can reply to the user confirming receipt of the file
          message.reply(`Received file: ${attachment.name} (${attachment.size} bytes})`);
          
          const file = fs.createWriteStream(`./uploads/${attachment.name}`);
          https.get(attachment.url, response => {
              response.pipe(file);
          });
          });
      } catch (error) {
          console.error('Error handling attachment:', error);
          message.reply('There was an error handling your file.');
      }
  }
  else if(message.content.includes("!dl")) {
    const fileName = message.content.split("!dl ")[1];
    console.log("Someone is requesting a file: ", fileName);
    fs.readFile(`uploads/${fileName}`, (err, data) => {
      if (err) {
        console.error('Error reading the file:', err);
        message.reply('There was an error handling your file.');
      } else {
        message.reply({files: [data]});
      }
    });
  }
});

client.login(discordToken);