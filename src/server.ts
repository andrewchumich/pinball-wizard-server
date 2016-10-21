/**
 * This module is the main server module. It is responsible for handling requests
 * and websocket connections and then calling external modules.
 * 
 */
import { User } from './user'
import { Score } from './score'
import * as Pinball from './pinball'
import { PinballConfig } from './pinball'


export const SCORE_EVENT = 'SCORE_EVENT';
// start pinball app

var app = require('express')()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
io.on('connection', (socket) => {
    console.log('HELLO WORLD')
    // on connection we should start sending score data from PinballScore
    const defaultScore: Score = new Score();

    const config: PinballConfig = {
        onScoreUpdate: (score: Score = defaultScore) => {
            io.emit(SCORE_EVENT, JSON.stringify(score.toApi()));
        },
        onGameStart: (score: Score) => {
            // do stuff
        },
        onGameEnd: (score: Score = defaultScore) => {
            // do stuff
            // instert score into database
            console.log('GAME END');
        }
    };

    Pinball.setConfig(config);

    Pinball.setUser('ALC');

});

Pinball.start()

app.get('/', (req, res) => {
    res.send('hello world')
})


function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

/**
 * handle websocket requests on the /live endpoint
 */
/*
app.ws('/live', (ws, req, next) => {
    console.log('WEBSOCKET!');

    if (!originIsAllowed(req.hostname)) {
        // Make sure we only accept reqests from an allowed origin
        console.log((new Date()) + ' Connection from origin ' + req.origin + ' rejected.');
        return next();
    }

    // on connection we should start sending score data from PinballScore
    const defaultScore: Score = new Score();

    const config: PinballConfig = {
        onScoreUpdate: (score: Score=defaultScore) => {
            if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify(score.toApi()));
            }
        },
        onGameStart: (score: Score) => {
            // do stuff
        },
        onGameEnd: (score: Score=defaultScore) => {
            // do stuff
            // instert score into database
            console.log('GAME END');
        }
    };

    // start live updates
    Pinball.listen(config);

    ws.on('open', () => {
        console.log('OPEN');
    })

    ws.on('close', () => {
        // end game
        console.log('close');
    });

    ws.on('error', (e) => {
        console.log('error');
    });

    ws.on('message', (msg: string) => {
        const data = msg;
        console.log('Received Message: ' + msg);
        Pinball.setUser(data);
    });

});
*/

server.listen(3000);
