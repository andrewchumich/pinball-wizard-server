"use strict";
var http = require('http');
var express = require('express');
var app = express();
const score_1 = require('./score');
const Pinball = require('./pinball');
Pinball.start();
app.get('/', (req, res) => {
    res.send('hello world');
});
var expressWs = require('express-ws')(app);
function originIsAllowed(origin) {
    return true;
}
app.ws('/live', (ws, req, next) => {
    console.log('WEBSOCKET!');
    if (!originIsAllowed(req.hostname)) {
        console.log((new Date()) + ' Connection from origin ' + req.origin + ' rejected.');
        return next();
    }
    const defaultScore = new score_1.Score();
    const config = {
        onScoreUpdate: (score = defaultScore) => {
            if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify(score.toApi()));
            }
        },
        onGameStart: (score) => {
        },
        onGameEnd: (score = defaultScore) => {
            console.log('GAME END');
        }
    };
    Pinball.listen(config);
    ws.on('open', () => {
        console.log('OPEN');
    });
    ws.on('close', () => {
        console.log('close');
    });
    ws.on('error', (e) => {
        console.log('error');
    });
    ws.on('message', (msg) => {
        const data = msg;
        console.log('Received Message: ' + msg);
        Pinball.setUser(data);
    });
});
app.listen(3000);
