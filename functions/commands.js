const { goals } = require('mineflayer-pathfinder')

let isFarming = false

async function collectBlocks(bot, itemType) {
    if (!isFarming) return
    
    const mcData = bot.getMcData()
    if (!mcData) {
        bot.chat("Minecraft data not loaded yet!")
        return
    }

    const block = mcData.blocksByName[itemType]
    if (!block) {
        bot.chat(`Block type not found: ${itemType}`)
        return
    }

    const blockToCollect = bot.findBlock({
        matching: block.id,
        maxDistance: 64
    })

    //This is a test
    if(blockToCollect) return
    if (blockToCollect && isFarming) {
        try {
            await bot.collectBlock.collect(blockToCollect)
            bot.chat(`Collected ${itemType}!`)
            // Only continue if farming is still active
            if (isFarming) {
                collectBlocks(bot, itemType)
            }
        } catch (err) {
            console.log('Error while collecting:', err)
            bot.chat('Error while collecting the block.')
        }
    } else {
        bot.chat(`No ${itemType} found nearby!`)
    }
}

function followPlayer(bot, userId) {
    const playerToFollow = bot.players[userId]
        if (!playerToFollow || !playerToFollow.entity) {
            bot.chat(`Cannot find player ${userId}`)
            return
        }
        const target = new goals.GoalFollow(playerToFollow.entity, 1)
        bot.pathfinder.setGoal(target, true)
        bot.chat(`Following ${userId}`)
}

const commands = {
    come: (bot, userId) => {
        followPlayer(bot, userId)
    },
    
    farm: (bot, userId, args) => {
        if (!args[0]) {
            bot.chat('Please specify a block type. Example: farm dirt')
            return
        }
        isFarming = true
        const itemType = args[0]
        collectBlocks(bot, itemType)
    },
    
    stop: (bot) => {
        isFarming = false
        bot.pathfinder.setGoal(null)
        bot.chat('Stopped all activities')
    },
    
    help: (bot) => {
        bot.chat('Available commands: come, farm [block], stop, help')
    }
}

function handleCommand(bot, userId, message) {
    const prefix = bot.username
    if (!message.startsWith(prefix)) return
    
    const args = message.slice(prefix.length).trim().split(' ')
    const command = args.shift().toLowerCase()
    
    if (commands[command]) {
        commands[command](bot, userId, args)
    } else {
        bot.chat(`Unknown command. Type "${prefix} help" for available commands`)
    }
}

module.exports = { handleCommand }