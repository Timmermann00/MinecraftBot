const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const Target = goals.GoalFollow

const options1 = {
  host: 'localhost',
  port: 59488,
  username: '2',
}
const options2 = {
  host: 'localhost',
  port: 59488,
  username: '1',

}

function initializeBot(bot){
  bot.loadPlugin(pathfinder)  
    function followplayer(username){
        
      const playerCI = bot.players[username]
      if(playerCI) {
        bot.chat("passt")

      }

      
      const target = new Target(playerCI.entity, 1)
      bot.chat("passt4")
      bot.pathfinder.setGoal(target, true, 1)

      bot.once('chat', function(username, message  ) {
        if(username === 'Karl4_President') 
          if(message === this.bot.username + 'come')
          {
            
          }
        console.log('Bot Version', this.bot.version)
        const mcData = require('minecraft-data')(this.bot.version)
        if (!mcData){
          bot.chat("passt nicht")
          return
        }
      
        const movements = new Movements(this.bot, mcData)
        bot.pathfinder.setMovements(movements)
        
      })   
    }
    const username = 'Karl4_President'
    followplayer(username)
  }

const bot1 = mineflayer.createBot(options1)
const bot2 = mineflayer.createBot(options2)

initializeBot(bot1)
initializeBot(bot2)