var WebSocketServer = require('websocket').server;
var http = require('http');
var pinball = require('./app/pinball');
var express = require('express');
var app = express();
import { User } from './user';
import { Score } from './score';

// start pinball app
pinball.start()
app.get('/', (req, res) => {
    res.send('hello world');
});

var expressWs = require('express-ws')(app)

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}


app.ws('/live', (ws, req, next) => {
    console.log('WEBSOCKET!');

    if (!originIsAllowed(req.hostname)) {
        // Make sure we only accept reqests from an allowed origin
        console.log((new Date()) + ' Connection from origin ' + req.origin + ' rejected.');
        return next();
    }

    // on connection we should start sending score data from PinballScore
    const defaultScore: Score = new Score();


    const config = {
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
    pinball.listen(config);

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
        pinball.setUser(data);
    });

});

app.listen(3000);
// TODO: on startup we should start the 'PinballScore' program

/*var server = http.createServer((request, response) => {
    console.log((new Date()) + ' Received request for ' + request.url);


    response.writeHead(404);
    response.end();
});

server.listen(3000, function () {
    console.log((new Date()) + ' Server is listening on port 3000');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});


wsServer.on('request', function (request) {
    console.log('REQUEST');
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    var connection = request.accept();
    console.log((new Date()) + ' Connection accepted.');
    // on connection we should start sending score data from PinballScore
    const defaultScore = {
        score: 0,
        user: ''
    };

    const config = {
        onScoreUpdate: (score=defaultScore) => {
            if (connection.connected === true) {
                connection.sendUTF(JSON.stringify(score));
            }
        },
        onGameStart: () => {
            // do stuff
        },
        onGameEnd: (score=defaultScore) => {
            // do stuff
            // instert score into database
            console.log('GAME END');
        }
    };

    pinball.start(config);
    connection.on('error', function (error) {
        console.log(error);
    });
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            const data = message.utf8Data;
            console.log('Received Message: ' + message.utf8Data);
            pinball.setUser(data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});*/