const mineflayer = require('mineflayer')
const { pathfinder, Movements } = require('mineflayer-pathfinder')
const collectBlock = require('mineflayer-collectblock').plugin

const baseOptions = {
    host: 'localhost',
    port: 25565  // Default port
}

function updatePort(newPort) {
    baseOptions.port = newPort
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
    initializeBot,
    updatePort
}