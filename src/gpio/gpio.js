"use strict";
var USE_MOCK = true;
var rpio;
if (process.platform === 'linux') {
    USE_MOCK = false;
    rpio = require('rpio');
}
function start() {
    if (USE_MOCK === true) {
        console.log(rpio);
    }
    else {
        console.log('PLATFORM DOES NOT SUPPORT RPIO:');
        console.log(process.platform);
    }
}
exports.start = start;
