var WebSocketServer = require('websocket').server;
var http = require('http');
var pinball = require('./app/pinball');

// TODO: on startup we should start the 'PinballScore' program

var server = http.createServer(function (request, response) {
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

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

wsServer.on('request', function (request) {
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
});