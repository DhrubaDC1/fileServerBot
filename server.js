const { Client, GatewayIntentBits } = require('discord.js');
const https = require('https');
const fs = require('fs');
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
            
            // If you need to save the file locally, you can download it using Node.js `https` or `axios`
            // Example using Node.js `https` module (ensure `https` module is imported)
            const https = require('https');
            const fs = require('fs');
            const file = fs.createWriteStream(`./${attachment.name}`);
            https.get(attachment.url, response => {
                response.pipe(file);
            });
            });
        } catch (error) {
            console.error('Error handling attachment:', error);
            message.reply('There was an error handling your file.');
        }
    }
});

client.login(discordToken);
