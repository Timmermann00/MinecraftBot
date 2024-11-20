const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const collectBlock = require('mineflayer-collectblock').plugin
const { handleCommand } = require('./functions/commands')
let mcData

const baseOptions = {
    host: 'localhost',
    port: 5276
}

function createBotOptions(username) {
    return {
        ...baseOptions,
        username
    }
}

function initializeBot(bot) {
    bot.loadPlugin(pathfinder)
    bot.loadPlugin(collectBlock)

    bot.on('chat', (userId, message) => {
        handleCommand(bot, userId, message)
    })

    bot.once('spawn', () => {
        console.log('Bot Version', bot.version)
        mcData = require('minecraft-data')(bot.version)
        if (!mcData) {
            bot.chat("Could not load minecraft data")
            return
        }

        const movements = new Movements(bot, mcData)
        bot.pathfinder.setMovements(movements)
    })
    bot.getMcData = () => mcData
}

module.exports = {
    createBotOptions,
    initializeBot
}
