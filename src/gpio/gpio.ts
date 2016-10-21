import { GpioInterface } from './gpioConfig.interface'

var USE_MOCK = true
var rpio
// need a better way to do this
// probably an environment variable
if (process.platform === 'linux') {
    USE_MOCK = false
    rpio = require('rpio')
}    

const SCORES = [1, 10, 50, 100]
var count = 0
var timeoutFunction = function(config: GpioInterface) {

    config.onScoreUpdate(SCORES[Math.floor(Math.random() * 4)])
    const randomTimeout = Math.random() * 5000
    //if (count++ === 10) {
      //  config.onGameEnd()
    //} else {
    setTimeout(() => timeoutFunction(config), randomTimeout)
    //}
};

export function start(config: GpioInterface) {
    if (USE_MOCK === false) {
	    console.log(rpio)
    } else {
	    console.log('PLATFORM DOES NOT SUPPORT RPIO:')
	    console.log(process.platform)
        console.log('STARTING MOCK...')
        config.onGameStart()
        timeoutFunction(config)
    }

}