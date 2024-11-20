const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const collectBlock = require('mineflayer-collectblock').plugin
let mcData

const baseOptions = {
    host: 'localhost',
    port: 63931
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

    function followPlayer(userId) {
        const playerToFollow = bot.players[userId]
        if (!playerToFollow || !playerToFollow.entity) {
            bot.chat(`Cannot find player ${userId}`)
            return
        }
        const target = new goals.GoalFollow(playerToFollow.entity, 1)
        bot.pathfinder.setGoal(target, true)
        bot.chat(`Following ${userId}`)
    }

    bot.on('chat', (userId, message) => {
        const command = `${bot.username} come`
        const command2 = `${bot.username} farm`
        if (message === command) {
            followPlayer(userId)
        }
        if (message === command2) {
            collectBlocks(bot)
        }
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
}


async function collectBlocks(bot) {
    if (!mcData) {
        bot.chat("Minecraft-Daten wurden noch nicht geladen!")
        return
    }

    const grass = bot.findBlock({
        matching: mcData.blocksByName.grass_block.id,
        maxDistance: 64
    })

    if (grass) {
        try {
            await bot.collectBlock.collect(grass)
            bot.chat('Grasblock gesammelt!')
            collectBlocks(bot)
        } catch (err) {
            console.log('Fehler beim Abbauen:', err)
            bot.chat('Fehler beim Sammeln des Blocks.')
        }
    } else {
        bot.chat('Kein Grasblock in der Nähe gefunden!')
    }
}

module.exports = {
    createBotOptions,
    initializeBot
}
