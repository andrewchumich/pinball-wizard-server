/**
 * This module is the main server module. It is responsible for handling requests
 * and websocket connections and then calling external modules.
 * 
 */
import { User } from './user'
import * as Pinball from './pinball'
import { PinballConfig, pinballState } from './pinball'
var Primus = require('primus')

export const STATE_CHANGE = 'STATE_CHANGE';
// start pinball app

var app = require('express')()
var server = require('http').createServer(app)

console.log('HELLO')
var p = Primus.createServer({
    port: 3000,
    transformer: 'websockets'
}, (res) => {
    console.log(res)
})
p.on('connection', (res) => {
    console.log(res)
    console.log('hello')
})

/*app.get('/', (req, res) => {
    res.send('hello world')
})*/

/*var io = require('socket.io')(server)
io.on('connection', (socket) => {
    console.log('HELLO WORLD')
    // on connection we should start sending score data from PinballScore

    const config: PinballConfig = {
        onStateChange: (state: pinballState) => {
            console.log(state)
            io.emit(STATE_CHANGE, JSON.stringify(state));
        }
    };

    Pinball.setConfig(config);

    Pinball.setUser('ALC');

});

Pinball.start()



function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}
*/
//server.listen(3000);
