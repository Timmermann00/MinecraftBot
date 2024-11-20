const mineflayer = require('mineflayer')
const { initializeBot, createBotOptions } = require('./initializeBot');

const bots = []
for (let i = 0; i < 1; i++) {
    const bot = mineflayer.createBot(createBotOptions('bot'+i));
    initializeBot(bot);
    bots.push(bot);
    console.log('Created bot' + i);
}

console.log('All bots finished')