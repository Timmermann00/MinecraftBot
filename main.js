//this is the start of the program

const mineflayer = require('mineflayer')
const { initializeBot, createBotOptions } = require('./initializeBot')
const prompt = require('prompt-sync')({sigint: true})

const bots = []

const port = parseInt(prompt('Enter port number: '))
const botCount = parseInt(prompt('Enter number of bots to create: '))

if (isNaN(botCount) || botCount < 1) {
    console.error('Invalid bot count. Must be at least 1')
    process.exit(1)
}

require('./initializeBot').updatePort(port)

try {
    for (let i = 0; i < botCount; i++) {
        const bot = mineflayer.createBot(createBotOptions('bot'+i))
        initializeBot(bot)
        bots.push(bot)
        console.log('Created bot' + i)
    }
    console.log('All bots created successfully')
} catch (error) {
    console.error('Error creating bots:', error)
}
