/**
 * This module is the main server module. It is responsible for handling requests
 * and websocket connections and then calling external modules.
 * 
 */
import { User } from './user'
import * as Pinball from './pinball'
import { PinballConfig, pinballState } from './pinball'
import { initializeSSE } from './sse'
var express = require('express')
var EventEmitter = require('events')
var app = express()
export const STATE_CHANGE = 'STATE_CHANGE';
// start pinball app
var sse = initializeSSE()
const ScoreEmitter = new EventEmitter()

// this is a Server-Side Events endpoint
app.get('/scores', (req, res) => {
    console.log('OPEN CONNECTION')
    res = sse(res)
    let event_callback = (score: pinballState) => {
        res.push(score)
    }
    ScoreEmitter.on('score', event_callback)
    // set event listener for res

    req.on('close', () => {
        console.log('CLOSE CONNECTION')
        ScoreEmitter.removeListener('score', event_callback)
    })
})

const config: PinballConfig = {
    onStateChange: (state: pinballState) => {
        ScoreEmitter.emit('score', state)
    }
};

Pinball.setConfig(config);

Pinball.setUser('ALC');

Pinball.start()

app.listen(3000)
