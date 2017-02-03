/**
 * This module is the main server module. It is responsible for handling requests
 * and websocket connections and then calling external modules.
 * 
 */
import { User } from './user'
import * as Pinball from './pinball'
import { PinballConfig, PinballState } from './pinball'
import { ConnectionManager, DATABASE_PATH } from './storage'
import { initializeSSE } from './sse'
var express = require('express')
var EventEmitter = require('events')
var app = express()
export const STATE_CHANGE = 'STATE_CHANGE';
var sse = initializeSSE()
const ScoreEmitter = new EventEmitter()

// this is a Server-Side Events endpoint
app.get('/livescore', (req, res) => {
    console.log('OPEN CONNECTION')
    res = sse(res)
    let event_callback = (score: PinballState) => {
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
    onStateChange: (state: PinballState) => {
        ScoreEmitter.emit('score', state)
    }
};

ConnectionManager.getConnection(DATABASE_PATH).then(() => {
    Pinball.setConfig(config);

    Pinball.setUser('ALC');

    Pinball.start()

    app.listen(3000)
})

process.on('exit', () => {
    console.log('Exiting...')
    ConnectionManager.closeConnection().then(() => {
        console.log('Database connection closed')
    })
})