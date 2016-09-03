"use strict";
var rpio = require('rpio');
function start() {
    console.log(rpio);
    console.log(process.platform);
}
exports.start = start;
